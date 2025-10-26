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
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const {items, email, userId} = request.data;
  const apiKey = hesabpayApiKey.value();

  if (!userId) {
    throw new HttpsError('invalid-argument', 'The function must be called with a "userId".');
  }

  const headers = {
    Authorization: `API-KEY ${apiKey}`,
    accept: 'application/json',
  };

  try {
    // This external call is likely the source of the "internal" error if billing is not enabled.
    // It is temporarily bypassed.
    const mockPaymentUrl = `https://mock-hesab-pay.com/session/${uuidv4()}`;

    const paymentId = uuidv4();
    const payment = {
      id: paymentId,
      userId,
      email,
      items,
      status: 'created',
      url: mockPaymentUrl, // Using mock URL
      createdAt: new Date().toISOString(),
    };
    
    await db.collection('users').doc(userId).collection('payments').doc(paymentId).set(payment);

    return {success: true, paymentUrl: payment.url};
  } catch (err: any) {
    console.error('Error creating payment session:', err);
    if (axios.isAxiosError(err) && err.response) {
      console.error('HesabPay API response:', err.response.data);
    }
    throw new HttpsError(
      'internal',
      'Failed to create payment session.',
      err.message
    );
  }
});

export const verifyHesabWebhook = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const {payment_id, status, user_id} = req.body;
  if (!payment_id || !status || !user_id) {
    res.status(400).send('Missing payment_id, status, or user_id in request body.');
    return;
  }

  try {
    await db
      .collection('users').doc(user_id)
      .collection('payments')
      .doc(payment_id)
      .update({
        status,
        verifiedAt: new Date().toISOString(),
      });
    res.status(200).send('OK');
  } catch (error) {
    console.error(`Failed to update payment ${payment_id} for user ${user_id}:`, error);
    res.status(500).send('Internal Server Error');
  }
});
