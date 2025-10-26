'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirebase } from '@/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { processPaymentAction } from '@/app/actions/payment-actions';

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
  const { firebaseApp, firestore, user } = useFirebase();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
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

    const handler = (event: MessageEvent) => {
      // It's good practice to check the origin for security
      if (
        event.origin.includes('hesab.com') &&
        event.data?.type === 'paymentSuccess'
      ) {
        console.log('Payment Success Event Received:', event.data);
        const { success } = event.data;

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
            });
          }

          try {
            sessionStorage.removeItem('paymentSessionId');
            sessionStorage.removeItem('paymentData');
          } catch(e) {
             console.warn('Session storage is not available.');
          }

        } else {
            toast({
                title: 'Payment Failed',
                description: 'There was an issue with your payment.',
                variant: 'destructive'
            })
             if(currentSessionId) {
                updateFirestorePayment(firestore, currentSessionId, 'failed');
                 try {
                    sessionStorage.removeItem('paymentSessionId');
                    sessionStorage.removeItem('paymentData');
                 } catch(e) {
                    console.warn('Session storage is not available.');
                 }
             }
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
      if (!firebaseApp) {
        setError('Firebase not initialized.');
        toast({
          title: 'Error',
          description: 'The app is not connected to Firebase services.',
          variant: 'destructive',
        });
        return;
      }
      setError(null);

      const functions = getFunctions(firebaseApp, 'us-central1');
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
          } catch(e) {
             console.warn('Session storage is not available.');
          }

          window.location.href = result.data.paymentUrl;
        } else {
          throw new Error(result.data.error || 'Failed to get payment URL.');
        }
      } catch (error: any) {
        console.error('Payment creation failed', error);
        setError(error.message || 'An unexpected error occurred.');
        toast({
          title: 'Payment Failed',
          description:
            error.message || 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    },
    [firebaseApp, toast, user]
  );

  return { createPaymentSession, error };
}
