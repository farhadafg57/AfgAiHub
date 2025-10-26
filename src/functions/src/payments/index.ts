'use server';
import {initializeApp, getApps} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import {onCall, HttpsError} from 'firebase-functions/v2/https';
import {onRequest} from 'firebase-functions/v2/https';
import {defineString} from 'firebase-functions/params';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';

if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();
const hesabpayApiKey = defineString('HESABPAY_KEY');
const hesabpayApiEndpoint = 'https://api.hesab.com/api/v1/payment/create-session';

export const createPaymentSession = onCall(async request => {
  const {items, email} = request.data;
  const apiKey = hesabpayApiKey.value();

  const headers = {
    Authorization: `API-KEY ${apiKey}`,
    accept: 'application/json',
  };

  try {
    const response = await axios.post(
      hesabpayApiEndpoint,
      {items, email},
      {headers}
    );
    const payment = {
      id: uuidv4(),
      email,
      items,
      status: 'created',
      url: response.data?.paymentUrl,
      createdAt: new Date().toISOString(),
    };
    await db.collection('payments').doc(payment.id).set(payment);
    return {success: true, paymentUrl: payment.url};
  } catch (err: any) {
    console.error('Error creating payment session:', err);
    if (axios.isAxiosError(err) && err.response) {
      console.error('HesabPay API response:', err.response.data);
    }
    // Correctly throw an HttpsError for onCall functions
    throw new HttpsError(
      'internal',
      'Failed to create payment session.',
      err.message
    );
  }
});

export const verifyHesabWebhook = onRequest(async (req, res) => {
  // Simple validation for the presence of required fields
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const {payment_id, status} = req.body;
  if (!payment_id || !status) {
    res.status(400).send('Missing payment_id or status in request body.');
    return;
  }

  try {
    await db
      .collection('payments')
      .doc(payment_id)
      .update({
        status,
        verifiedAt: new Date().toISOString(),
      });
    res.status(200).send('OK');
  } catch (error) {
    console.error(`Failed to update payment ${payment_id}:`, error);
    res.status(500).send('Internal Server Error');
  }
});
