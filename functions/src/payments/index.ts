import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret, defineString } from 'firebase-functions/params';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

const hesabpayApiKey = defineSecret('HESABPAY_KEY');
const hesabpayWebhookSecret = defineSecret('HESABPAY_WEBHOOK_SECRET');
const hesabpayBaseUrl = defineString(
  'HESABPAY_BASE_URL',
  { default: 'https://api.hesab.com/api/v1' }
);
const merchantPin = defineSecret('MERCHANT_PIN');

function encryptPin(pin: string, key: string): string {
  const secretKey = key.substring(0, 32).padEnd(32, '\0');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let encrypted = cipher.update(pin, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return Buffer.from(iv.toString('hex') + encrypted, 'utf8').toString('base64');
}

export const createPaymentSession = onCall({ secrets: [hesabpayApiKey] }, async (request) => {
  const { items, email, successUrl, failUrl } = request.data;
  const uid = request.auth?.uid;

  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpsError('invalid-argument', 'The function must be called with an "items" array.');
  }
  if (!successUrl || !failUrl) {
    throw new HttpsError('invalid-argument', 'Success and failure redirect URLs are required.');
  }

  const apiKey = hesabpayApiKey.value();
  const apiEndpoint = `${hesabpayBaseUrl.value()}/payment/create-session`;

  const headers = {
    Authorization: `API-KEY ${apiKey}`,
    'Content-Type': 'application/json',
    accept: 'application/json',
  };

  const payload: any = {
    items,
    redirect_success_url: successUrl,
    redirect_failure_url: failUrl,
  };
  if (email) payload.email = email;

  try {
    const response = await axios.post(apiEndpoint, payload, { headers });

    if (response.status !== 200 || !response.data?.sessionId) {
      console.error("Invalid response from HesabPay:", response.data);
      throw new HttpsError('internal', 'Invalid response from HesabPay');
    }

    const { sessionId, paymentUrl } = response.data;
    const checkout_url = paymentUrl;

    const sessionDoc = {
      sessionId,
      checkout_url,
      email: email || null,
      userId: uid || null,
      guest: !uid,
      items,
      status: 'pending',
      createdAt: new Date(),
    };

    await db.collection('payments/sessions').doc(sessionId).set(sessionDoc);

    return { success: true, checkout_url, sessionId };
  } catch (err: any) {
    console.error('Error creating payment session:', err.response?.data || err.message);
    throw new HttpsError('internal', 'Failed to create payment session.', err.message);
  }
});

export const hesabWebhook = onRequest({ secrets: [hesabpayWebhookSecret] }, async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const signature = req.headers['x-hesab-signature'] as string;
  const secret = hesabpayWebhookSecret.value();

  if (!signature) {
    console.warn('Webhook received without signature.');
    res.status(400).send('Missing signature header.');
    return;
  }
  
  const rawBody = (req as any).rawBody ? (req as any).rawBody.toString() : JSON.stringify(req.body);
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody);
  const expectedSignature = hmac.digest('hex');

  if (signature !== expectedSignature) {
    console.warn('Invalid webhook signature.');
    res.status(403).send('Invalid signature.');
    return;
  }

  const { transaction_id, success } = req.body;

  if (!transaction_id) {
    res.status(400).send('Missing transaction_id in webhook payload.');
    return;
  }

  // The transaction_id from HesabPay corresponds to our sessionId
  const sessionRef = db.collection('payments/sessions').doc(transaction_id);

  try {
    const sessionDoc = await sessionRef.get();
    if (!sessionDoc.exists) {
      console.warn(`Webhook received for non-existent session: ${transaction_id}`);
      res.status(404).send('Session not found.');
      return;
    }

    await sessionRef.update({
      status: success ? 'success' : 'failed',
      webhookPayload: req.body,
      updatedAt: new Date(),
    });

    console.log(`Payment session ${transaction_id} status updated to ${success ? 'success' : 'failed'}`);
    res.status(200).send({ received: true });
  } catch (error: any) {
    console.error(`Error updating payment session ${transaction_id}:`, error);
    res.status(500).send('Internal Server Error while processing webhook.');
  }
});

export const distributePayment = onCall({ secrets: [hesabpayApiKey, merchantPin] }, async (request) => {
  const { vendors } = request.data;
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }
  if (!Array.isArray(vendors) || vendors.length === 0 || vendors.length > 16) {
    throw new HttpsError('invalid-argument', 'Vendors must be an array with 1 to 16 entries.');
  }
  const accountNumbers = vendors.map(v => v.account_number);
  if (new Set(accountNumbers).size !== accountNumbers.length) {
    throw new HttpsError('invalid-argument', 'Duplicate vendor account numbers are not allowed.');
  }

  const apiKey = hesabpayApiKey.value();
  const pin = merchantPin.value();
  const encryptedPin = encryptPin(pin, apiKey);

  const apiEndpoint = `${hesabpayBaseUrl.value()}/payment/send-money-MultiVendor`;
  const headers = {
    Authorization: `API-KEY ${apiKey}`,
    'Content-Type': 'application/json',
    accept: 'application/json',
  };
  const payload = { pin: encryptedPin, vendors };

  const txnId = uuidv4();
  const distributionLogRef = db.collection('payments/distributions').doc(txnId);

  try {
    const response = await axios.post(apiEndpoint, payload, { headers });

    const distributionLog = {
      txnId,
      initiatorUserId: uid,
      vendors,
      status: 'completed',
      response: response.data,
      createdAt: new Date(),
    };
    await distributionLogRef.set(distributionLog);

    return { success: true, transactionId: txnId, summary: response.data };
  } catch (err: any) {
    console.error('Error distributing payment:', err.response?.data || err.message);
    const errorData = err.response?.data || err.message;
    await distributionLogRef.set({
      txnId,
      initiatorUserId: uid,
      vendors,
      status: 'failed',
      error: errorData,
      createdAt: new Date(),
    });
    throw new HttpsError('internal', 'Failed to distribute payments.', errorData);
  }
});
