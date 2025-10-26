'use server';
import { getFunctions, httpsCallable } from 'firebase-admin/functions';
import { getApp } from 'firebase-admin/app';

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
    // Ensure the admin app is initialized (it should be by default in Cloud Functions environment)
    const adminApp = getApp();
    const functions = getFunctions(adminApp);
    const createPaymentSession = httpsCallable(functions, 'createPaymentSession');
    
    const result = await createPaymentSession(input);
    
    return result.data as CreatePaymentSessionOutput;
  } catch (error: any) {
    console.error('Error calling createPaymentSession function:', error);
    // Functions V2 onCall errors have a different structure
    const errorMessage = error.details?.message || error.message || 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}
