'use server';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { initializeFirebase } from '@/firebase';

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
    // Use the client SDK to call the function.
    // initializeFirebase() ensures we have a valid app instance.
    const { functions } = initializeFirebase();
    const createPaymentSession = httpsCallable(functions, 'createPaymentSession');
    
    const result = await createPaymentSession(input);
    
    return result.data as CreatePaymentSessionOutput;
  } catch (error: any) {
    console.error('Error calling createPaymentSession function:', error);
    // The error object from a callable function has a 'message' and 'details' property
    const errorMessage = error.details?.message || error.message || 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}
