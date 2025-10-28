'use server';

import { getFunctions, httpsCallable } from 'firebase/functions';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const functions = getFunctions(app, 'asia-south1');

const createPaymentSession = httpsCallable(functions, 'createPaymentSession');

type CreateSessionResponse = {
  success: boolean;
  checkout_url: string;
  sessionId: string;
};

export async function createPaymentSessionAction(
  email: string,
  successUrl: string,
  failUrl: string
): Promise<{ checkout_url?: string; error?: string }> {
  try {
    const items = [
      {
        name: 'AfgAiHub Premium',
        price: 1000, // Price in AFN
        quantity: 1,
      },
    ];

    const result = await createPaymentSession({
      items,
      email,
      successUrl,
      failUrl,
    });

    const data = result.data as CreateSessionResponse;

    if (data.success) {
      return { checkout_url: data.checkout_url };
    } else {
      return { error: 'Failed to create payment session.' };
    }
  } catch (error: any) {
    console.error('Error creating payment session:', error);
    return { error: error.message || 'An unknown error occurred.' };
  }
}
