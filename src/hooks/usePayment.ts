'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { getFunctions, httpsCallable, Functions } from 'firebase/functions';
// Removed processPaymentAction import as it will be handled differently now

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

// Function to update Firestore, can be called from the event listener
const updateFirestorePayment = (
  firestore: Firestore,
  sessionId: string,
  status: 'success' | 'failed'
) => {
  if (!sessionId) return;
  const paymentRef = doc(firestore, 'payments/sessions', sessionId);
  updateDoc(paymentRef, { status }).catch((error) => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: paymentRef.path,
        operation: 'update',
        requestResourceData: { status },
      })
    );
    console.error('Failed to update payment status:', error);
  });
};

async function processPayment(input: any) {
  // This is a placeholder for the Genkit flow call which should be a server action.
  // For now, we'll just log it. A proper implementation needs a separate server action.
  console.log('AI Processing for payment would be triggered here:', input);
  return { summary: `Transaction for session ${input.sessionId} processed.` };
}

export function usePayment() {
  const { firestore, user, functions } = useFirebase();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (
        event.origin.includes('hesab.com') &&
        event.data?.type === 'paymentSuccess'
      ) {
        console.log('Payment Success Event Received:', event.data);
        const { success, transaction_id } = event.data;

        let currentSessionId: string | null = null;
        let paymentData: PaymentData | null = null;
        try {
          currentSessionId = sessionStorage.getItem('paymentSessionId');
          const storedPaymentData = sessionStorage.getItem('paymentData');
          if (storedPaymentData) {
            paymentData = JSON.parse(storedPaymentData);
          }
        } catch (e) {
          console.warn('Session storage is not available.');
        }

        if (success && currentSessionId) {
          toast({
            title: 'Payment Successful!',
            description: 'Your payment has been confirmed.',
          });
          updateFirestorePayment(firestore, currentSessionId, 'success');

          if (paymentData) {
            const totalAmount = paymentData.items.reduce(
              (sum, item) => sum + item.price,
              0
            );
            processPayment({
              sessionId: currentSessionId,
              userId: user?.uid,
              email: user?.email || paymentData.email,
              items: paymentData.items,
              totalAmount,
            }).then((result) => {
              console.log('AI Summary:', result.summary);
              toast({
                title: 'Transaction Summary',
                description: result.summary,
              });
            });
          }
        } else {
          toast({
            title: 'Payment Failed',
            description: 'There was an issue with your payment.',
            variant: 'destructive',
          });
          if (currentSessionId) {
            updateFirestorePayment(firestore, currentSessionId, 'failed');
          }
        }

        try {
          sessionStorage.removeItem('paymentSessionId');
          sessionStorage.removeItem('paymentData');
        } catch (e) {
          console.warn('Session storage is not available.');
        }
      }
    };

    window.addEventListener('message', handler);

    return () => {
      window.removeEventListener('message', handler);
    };
  }, [firestore, toast, user]);

  const createPaymentSession = useCallback(
    async (paymentData: PaymentData) => {
      setError(null);

      if (!functions) {
        const msg = "Firebase Functions service is not available.";
        console.error(msg);
        setError(msg);
        toast({ title: "Error", description: msg, variant: "destructive" });
        return;
      }
      
      const createSession = httpsCallable(functions, 'createPaymentSession');

      try {
        const result: any = await createSession({
          ...paymentData,
          email: paymentData.email || user?.email,
        });

        if (result.data.success && result.data.paymentUrl) {
          toast({
            title: 'Payment session created!',
            description: 'Redirecting to HesabPay...',
          });

          try {
            sessionStorage.setItem('paymentSessionId', result.data.sessionId);
            sessionStorage.setItem('paymentData', JSON.stringify(paymentData));
          } catch (e) {
            console.warn('Session storage is not available.');
          }

          window.location.href = result.data.paymentUrl;
        } else {
          const errorMessage = result.data.error || 'An unexpected error occurred.';
          console.error('Payment creation failed', errorMessage);
          setError(errorMessage);
          toast({
            title: 'Payment Failed',
            description: errorMessage,
            variant: 'destructive',
          });
        }
      } catch (error: any) {
        console.error('Error calling createPaymentSession function:', error);
        setError(error.message || 'An unexpected error occurred.');
         toast({
            title: 'Payment Failed',
            description: error.message || 'Could not connect to payment service.',
            variant: 'destructive',
        });
      }
    },
    [toast, user, functions]
  );

  return { createPaymentSession, error };
}
