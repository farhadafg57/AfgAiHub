'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { createPaymentSessionAction, processPaymentAction } from '@/app/actions/payment-actions';

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
  const paymentRef = doc(
    firestore,
    'payments/sessions',
    sessionId,
    sessionId
  );
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

export function usePayment() {
  const { firestore, user } = useFirebase();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // It's good practice to check the origin for security
      if (
        event.origin.includes('hesab.com') &&
        event.data?.type === 'paymentSuccess'
      ) {
        console.log('Payment Success Event Received:', event.data);
        const { success } = event.data;

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
          
          if(paymentData){
            const totalAmount = paymentData.items.reduce((sum, item) => sum + item.price, 0);
            processPaymentAction({
              sessionId: currentSessionId,
              userId: user?.uid,
              email: user?.email || paymentData.email,
              items: paymentData.items,
              totalAmount,
            }).then(result => {
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
                variant: 'destructive'
            })
             if(currentSessionId) {
                updateFirestorePayment(firestore, currentSessionId, 'failed');
             }
        }

        // Always clear session storage after handling the event
        try {
          sessionStorage.removeItem('paymentSessionId');
          sessionStorage.removeItem('paymentData');
        } catch(e) {
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
      
      const result = await createPaymentSessionAction({
          ...paymentData,
          // Ensure email is included, falling back to the logged-in user's email
          email: paymentData.email || user?.email,
      });

      if (result.success && result.paymentUrl) {
        toast({
          title: 'Payment session created!',
          description: 'Redirecting to HesabPay...',
        });
        
        try {
           sessionStorage.setItem('paymentSessionId', result.sessionId);
           sessionStorage.setItem('paymentData', JSON.stringify(paymentData));
        } catch(e) {
           console.warn('Session storage is not available.');
        }

        window.location.href = result.paymentUrl;
      } else {
        const errorMessage = result.error || 'An unexpected error occurred.';
        console.error('Payment creation failed', errorMessage);
        setError(errorMessage);
        toast({
          title: 'Payment Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    },
    [toast, user]
  );

  return { createPaymentSession, error };
}
