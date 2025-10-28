import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import { defineString, defineSecret } from 'firebase-functions/params';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

// Define Firebase environment variables
const hesabpayApiKey = defineString('HESABPAY_KEY');
const hesabpayWebhookSecret = defineSecret('HESABPAY_WEBHOOK_SECRET');
const hesabpayBaseUrl = defineString(
  'HESABPAY_BASE_URL',
  'https://api.hesab.com/api/v1'
);
const merchantPin = defineString('MERCHANT_PIN');

// --- Helper for PIN Encryption (AES-256-CBC) ---
export function encryptPin(pin: string, key: string): string {
  const secretKey = key.substring(0, 32).padEnd(32, '\0');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let encrypted = cipher.update(pin, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return Buffer.from(iv.toString('hex') + encrypted, 'utf8').toString('base64');
}

// Helper to verify HMAC signature
export function computeHmacHex(payload: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}


// --- 1. Create Payment Session ---
export const createPaymentSession = onCall(async (request) => {
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
      await db.collection('payment_errors').add({
        function: 'createPaymentSession',
        error: 'Invalid response from HesabPay',
        data: response.data,
        timestamp: new Date(),
      });
      throw new Error('Invalid response from HesabPay');
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
    await db.collection('payment_errors').add({
      function: 'createPaymentSession',
      error: err.message,
      details: err.response?.data,
      timestamp: new Date(),
    });
    throw new HttpsError('internal', 'Failed to create payment session.', err.message);
  }
});


// --- 2. HesabPay Webhook Handler ---
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

  // Verify signature against the raw body
  const expectedSignature = computeHmacHex(req.rawBody.toString(), secret);

  if (signature !== expectedSignature) {
    console.warn('Invalid webhook signature.');
    res.status(403).send('Invalid signature.');
    return;
  }

  // Signature is valid, process the event
  const { sessionId, success, amount } = req.body;

  if (!sessionId) {
    res.status(400).send('Missing sessionId in webhook payload.');
    return;
  }

  const sessionRef = db.collection('payments/sessions').doc(sessionId);

  try {
    // Use a transaction to safely update the document
    await db.runTransaction(async (t) => {
      const doc = await t.get(sessionRef);

      if (!doc.exists) {
        console.error(`Payment session not found: ${sessionId}`);
        // We can choose to stop the transaction here or log it.
        // For now, we'll log it and let it pass to avoid webhook retries for a non-existent doc.
        return;
      }
      
      const newStatus = success ? 'success' : 'failed';
      // Only update if status has changed to prevent redundant writes
      if (doc.data()?.status !== newStatus) {
        t.update(sessionRef, {
          status: newStatus,
          amount,
          webhookReceivedAt: new Date(),
          webhookPayload: req.body,
        });
      }
    });

    console.log(`Payment session ${sessionId} status updated to ${success ? 'success' : 'failed'}`);
    res.status(200).send({ received: true });

  } catch (error: any) {
    console.error(`Error updating session ${sessionId}:`, error);
    res.status(500).send('Internal Server Error while processing webhook.');
  }
});
