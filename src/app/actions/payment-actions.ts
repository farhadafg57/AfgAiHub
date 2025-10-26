'use server';

import { getFunctions, httpsCallable } from 'firebase/functions';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

type Item = {
  id: string;
  name: string;
  price: number;
};

type PaymentData = {
  items: Item[];
  email?: string | null;
  redirectSuccess?: string;
  redirectFailure?: string;
};

// This function now runs securely on the server.
export async function createPaymentSessionAction(paymentData: PaymentData) {
  // Initialize Firebase Admin on the server if it hasn't been already.
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  const firebaseApp = getApp();
  const functions = getFunctions(firebaseApp, 'us-central1');
  const createSession = httpsCallable(functions, 'createPaymentSession');

  try {
    const result: any = await createSession(paymentData);
    if (result.data.success) {
      return { success: true, paymentUrl: result.data.paymentUrl, sessionId: result.data.sessionId };
    } else {
      return { success: false, error: result.data.error || 'Failed to get payment URL.' };
    }
  } catch (error: any) {
    console.error('Error calling createPaymentSession function:', error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}

import {
  processPayment,
  ProcessPaymentInput,
  ProcessPaymentOutput,
} from '@/ai/flows/process-payment-flow';

export async function processPaymentAction(
  input: ProcessPaymentInput
): Promise<ProcessPaymentOutput> {
  console.log('Processing payment action for session:', input.sessionId);
  return processPayment(input);
}
