'use server';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { initializeFirebase } from '@/firebase';

type PaymentItem = {
  id: string;
  name: string;
  price: number;
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
    
    const data = result.data as { success: boolean, paymentUrl?: string, error?: string };

    if (data.success) {
      return { success: true, paymentUrl: data.paymentUrl };
    } else {
      return { success: false, error: data.error || 'An unknown error occurred in the cloud function.' };
    }
    
  } catch (error: any) {
    console.error('Error calling createPaymentSession function:', error);
    // The error object from a callable function has a 'message' and 'details' property
    const errorMessage = error.details?.message || error.message || 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}
