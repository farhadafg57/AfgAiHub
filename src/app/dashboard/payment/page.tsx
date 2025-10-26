'use client';

import { useState, useTransition } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Loader2 } from 'lucide-react';

export default function PaymentPage() {
  const { user, firebaseApp } = useFirebase();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleUpgrade = () => {
    if (!firebaseApp) {
        toast({
            title: 'Firebase not initialized',
            description: 'The app is not connected to Firebase services.',
            variant: 'destructive',
        });
        return;
    }
  
    startTransition(async () => {
      const functions = getFunctions(firebaseApp, 'us-central1');
      const createPaymentSession = httpsCallable(functions, 'createPaymentSession');

      const paymentData = {
        email: user?.email,
        items: [{ id: 'premium-plan', name: 'AfgAiHub Premium', price: 1000 }],
        // Example redirect URLs:
        // redirectSuccess: 'https://your-app.com/payment-success',
        // redirectFailure: 'https://your-app.com/payment-failure',
      };

      try {
        const result: any = await createPaymentSession(paymentData);
        
        if (result.data.success && result.data.paymentUrl) {
          toast({
            title: 'Payment session created!',
            description: 'Redirecting to HesabPay...',
          });
          // Redirect user to the payment gateway
          window.location.href = result.data.paymentUrl;
        } else {
          throw new Error(result.data.error || 'Failed to get payment URL.');
        }
      } catch (error: any) {
        console.error('Payment creation failed', error);
        toast({
          title: 'Payment Failed',
          description: error.message || 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="flex flex-col w-full">
      <Header title="Payments" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Premium Features</CardTitle>
              <CardDescription>
                Unlock the full potential of AfgAiHub with our premium plan for just 1000 AFN.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Get unlimited access to all our AI agents and features.
                </p>
                <Button onClick={handleUpgrade} disabled={isPending} className="w-full">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating session...
                    </>
                  ) : (
                    'Upgrade to Premium'
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  You will be redirected to HesabPay to complete your secure payment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
