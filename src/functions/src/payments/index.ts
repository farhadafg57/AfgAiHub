import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onRequest } from 'firebase-functions/v2/https';
import { defineString } from 'firebase-functions/params';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();
const hesabpayApiKey = defineString('HESABPAY_KEY');
const hesabpayBaseUrl = defineString(
  'HESABPAY_BASE_URL',
  'https://api.hesab.com/api/v1'
);
const merchantPin = defineString('MERCHANT_PIN');

// --- Helper for PIN Encryption ---
function encryptPin(pin: string, key: string): string {
  const secretKey = key.substring(0, 32).padEnd(32, '\0');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let encrypted = cipher.update(pin, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return Buffer.from(iv.toString('hex') + encrypted, 'utf8').toString('base64');
}

// --- 1. Create Payment Session ---
export const createPaymentSession = onCall(async (request) => {
  const {
    items,
    email,
    redirect_success_url,
    redirect_failure_url,
  } = request.data;
  const uid = request.auth?.uid;

  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpsError('invalid-argument', 'The function must be called with an "items" array.');
  }

  const apiKey = hesabpayApiKey.value();
  const apiEndpoint = `${hesabpayBaseUrl.value()}/payment/create-session`;

  const headers = {
    Authorization: `API-KEY ${apiKey}`,
    'Content-Type': 'application/json',
    accept: 'application/json',
  };

  const payload: any = { items };
  if (email) payload.email = email;
  if (redirect_success_url) payload.redirect_success_url = redirect_success_url;
  if (redirect_failure_url) payload.redirect_failure_url = redirect_failure_url;


  try {
    const response = await axios.post(apiEndpoint, payload, { headers });
    
    if (response.status !== 200 || !response.data?.sessionId) {
      console.error("Invalid response from HesabPay:", response.data);
      throw new Error('Invalid response from HesabPay');
    }

    const { sessionId, paymentUrl } = response.data;
    
    const sessionDoc = {
      sessionId,
      paymentUrl,
      email: email || null,
      userId: uid || null,
      guest: !uid,
      items,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await db.collection('payments/sessions').doc(sessionId).set(sessionDoc);

    return { success: true, paymentUrl, sessionId };
  } catch (err: any) {
    console.error('Error creating payment session:', err.response?.data || err.message);
    throw new HttpsError(
      'internal',
      'Failed to create payment session.',
      err.message
    );
  }
});

// --- 2. Distribute Payment to Vendors ---
export const distributePaymentToVendors = onCall(async (request) => {
  const { vendors } = request.data;
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  if (!Array.isArray(vendors) || vendors.length === 0) {
    throw new HttpsError('invalid-argument', 'The function must be called with a "vendors" array.');
  }

  const apiKey = hesabpayApiKey.value();
  const pin = merchantPin.value();
  const encryptedPin = encryptPin(pin, apiKey);
  
  const apiEndpoint = `https://api-sandbox.hesab.com/api/v1/payment/send-money-MultiVendor`;

  const headers = {
    Authorization: `API-KEY ${apiKey}`,
    'Content-Type': 'application/json',
    accept: 'application/json',
  };

  const payload = {
    pin: encryptedPin,
    vendors,
  };

  try {
    const response = await axios.post(apiEndpoint, payload, { headers });

    const txnId = response.data?.transaction_id || uuidv4();
    const distributionLog = {
      txnId,
      initiatorUserId: uid,
      vendors,
      status: 'completed',
      response: response.data,
      createdAt: new Date().toISOString(),
    };

    await db.collection('payments/distributions').doc(txnId).set(distributionLog);

    return { success: true, transactionId: txnId, summary: response.data };
  } catch (err: any) {
    console.error('Error distributing payment:', err.response?.data || err.message);
    
    const txnId = uuidv4();
     await db.collection('payments/distributions').doc(txnId).set({
      txnId,
      initiatorUserId: uid,
      vendors,
      status: 'failed',
      error: err.response?.data || err.message,
      createdAt: new Date().toISOString(),
    });

    throw new HttpsError(
      'internal',
      'Failed to distribute payments to vendors.',
      err.message
    );
  }
});


// --- 3. Verify HesabPay Webhook ---
export const verifyHesabWebhook = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { signature, timestamp, transaction_id, status_code } = req.body;

  if (!signature || !timestamp || !transaction_id || status_code === undefined) {
    res.status(400).send('Missing required fields in webhook payload.');
    return;
  }

  const apiKey = hesabpayApiKey.value();
  // Corrected endpoint
  const verificationEndpoint = 'https://api.hesab.com/api/v1/hesab/webhooks/verify-signature';
  
  const verificationHeaders = {
      Authorization: `API-KEY ${apiKey}`,
      'Content-Type': 'application/json',
  };
  const verificationPayload = { signature, timestamp };

  try {
    const verificationResponse = await axios.post(verificationEndpoint, verificationPayload, { headers: verificationHeaders });

    if (verificationResponse.data?.success !== true) {
      console.warn('Invalid webhook signature received.');
      res.status(403).send('Invalid signature.');
      return;
    }

    // Signature is valid, proceed to update Firestore
    const paymentStatus = req.body.success ? 'success' : 'failed';
    const paymentSessionId = transaction_id; // Assuming transaction_id corresponds to our sessionId

    const paymentRef = db.collection('payments/sessions').doc(paymentSessionId);
    
    await paymentRef.update({
      status: paymentStatus,
      webhookVerifiedAt: new Date().toISOString(),
      webhookPayload: req.body, // Store the full payload for auditing
    });

    console.log(`Payment ${paymentSessionId} status updated to ${paymentStatus} via webhook.`);
    res.status(200).send('Webhook processed successfully.');

  } catch (error: any) {
    console.error('Error processing webhook:', error.response?.data || error.message);
    res.status(500).send('Internal Server Error while processing webhook.');
  }
});
