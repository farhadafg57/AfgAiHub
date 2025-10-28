'use server';

import { headers } from 'next/headers';
import axios from 'axios';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';

// Ensure Firebase Admin is initialized
if (!getApps().length) {
  initializeApp();
}
const db = getFirestore();

// Retrieve sensitive keys from environment variables on the server
const HESABPAY_API_KEY = process.env.HESABPAY_KEY;
const HESABPAY_BASE_URL = process.env.HESABPAY_BASE_URL || 'https://api.hesab.com/api/v1';

type CreateSessionArgs = {
  email: string;
  userId?: string;
  successUrl: string;
  failUrl: string;
};

type CreateSessionResponse = {
  checkout_url?: string;
  error?: string;
};

export async function createPaymentSessionAction(
  args: CreateSessionArgs
): Promise<CreateSessionResponse> {
  const { email, userId, successUrl, failUrl } = args;

  if (!HESABPAY_API_KEY) {
    console.error('HESABPAY_KEY environment variable is not set.');
    return { error: 'Server configuration error.' };
  }

  // Get the request origin from headers to construct absolute redirect URLs
  const origin = headers().get('origin');
  if (!origin) {
    return { error: 'Could not determine request origin.' };
  }

  const items = [
    {
      name: 'AfgAiHub Premium',
      price: 1000, // Price in AFN
      quantity: 1,
    },
  ];

  const apiEndpoint = `${HESABPAY_BASE_URL}/payment/create-session`;
  const apiHeaders = {
    Authorization: `API-KEY ${HESABPAY_API_KEY}`,
    'Content-Type': 'application/json',
    accept: 'application/json',
  };

  const payload: any = {
    items,
    redirect_success_url: `${origin}${successUrl}`,
    redirect_failure_url: `${origin}${failUrl}`,
  };
  if (email) payload.email = email;

  try {
    const response = await axios.post(apiEndpoint, payload, { headers: apiHeaders });

    if (response.status !== 200 || !response.data?.sessionId) {
      console.error('Invalid response from HesabPay:', response.data);
      await db.collection('payment_errors').add({
        function: 'createPaymentSessionAction',
        error: 'Invalid response from HesabPay',
        data: response.data,
        timestamp: new Date(),
      });
      return { error: 'Invalid response from payment provider.' };
    }

    const { sessionId, paymentUrl } = response.data;

    // Store session details in Firestore for webhook verification
    const sessionDoc = {
      sessionId,
      checkout_url: paymentUrl,
      email: email || null,
      userId: userId || null,
      guest: !userId,
      items,
      status: 'pending',
      createdAt: new Date(),
    };

    await db.collection('payments/sessions').doc(sessionId).set(sessionDoc);

    return { checkout_url: paymentUrl };
  } catch (err: any) {
    console.error('Error creating payment session:', err.response?.data || err.message);
    await db.collection('payment_errors').add({
      function: 'createPaymentSessionAction',
      error: err.message,
      details: err.response?.data,
      timestamp: new Date(),
    });
    return { error: err.message || 'An unknown error occurred.' };
  }
}
