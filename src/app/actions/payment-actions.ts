'use server';
import { getFunctions, httpsCallable } from 'firebase-admin/functions';
import admin from 'firebase-admin';

// Ensure the admin app is initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

type PaymentItem = {
  name: string;
  price: number;
  quantity: number;
};

type CreatePaymentSessionInput = {
  items: PaymentItem[];
  email: string;
};

type CreatePaymentSessionOutput = {
  success: boolean;
  paymentUrl?: string;
  error?: string;
};

export async function createPaymentSessionAction(
  input: CreatePaymentSessionInput
): Promise<CreatePaymentSessionOutput> {
  try {
    const functions = getFunctions(admin.app());
    const createPaymentSession = httpsCallable(functions, 'createPaymentSession');
    
    const result = await createPaymentSession(input);
    
    return result.data as CreatePaymentSessionOutput;
  } catch (error: any) {
    console.error('Error calling createPaymentSession function:', error);
    const errorMessage = error.details?.message || error.message || 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}
