'use client';

import { useState, useTransition } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function PaymentPage() {
  const { user, firestore } = useFirebase();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleUpgrade = () => {
    if (!user || !user.email || !firestore) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to make a payment.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      const paymentId = uuidv4();
      const paymentRef = doc(firestore, 'users', user.uid, 'payments', paymentId);
      const paymentData = {
        id: paymentId,
        userId: user.uid,
        email: user.email,
        items: [{ id: 'premium-plan', name: 'AfgAiHub Premium', price: 1000 }],
        status: 'created',
        url: `https://api.hesab.com/api/v1/payment/create-session`, // Placeholder URL
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(paymentRef, paymentData);

        toast({
          title: 'Payment session created!',
          description: 'Redirecting to HesabPay...',
        });
        
        // Simulate redirect for now.
        setTimeout(() => {
            alert("This would redirect to a payment URL from HesabPay.");
        }, 1000);

      } catch (error: any) {
        console.error('Payment failed', error);
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
