'use client';

import { useState, useCallback } from 'react';
import { useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { getFunctions, httpsCallable } from 'firebase/functions';

type Item = {
  id: string;
  name: string;
  price: number;
};

type PaymentData = {
  items: Item[];
  email?: string | null;
};

export function usePayment() {
  const { user, functions } = useFirebase();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
      
      // Construct redirect URLs
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}/payment/success`;
      const failUrl = `${baseUrl}/payment/fail`;

      try {
        const result: any = await createSession({
          ...paymentData,
          email: paymentData.email || user?.email,
          successUrl,
          failUrl,
        });

        if (result.data.success && result.data.checkout_url) {
          toast({
            title: 'Payment session created!',
            description: 'Redirecting to HesabPay...',
          });
          // Redirect user to the HesabPay checkout page
          window.location.href = result.data.checkout_url;
        } else {
          const errorMessage = result.data.error || 'An unexpected error occurred.';
          console.error('Payment creation failed on server:', errorMessage);
          setError(errorMessage);
          toast({
            title: 'Payment Failed',
            description: errorMessage,
            variant: 'destructive',
          });
        }
      } catch (error: any) {
        console.error('Error calling createPaymentSession function:', error);
        const errorMessage = error.message || 'Could not connect to payment service.';
        setError(errorMessage);
        toast({
          title: 'Payment Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    },
    [toast, user, functions]
  );

  return { createPaymentSession, error };
}
