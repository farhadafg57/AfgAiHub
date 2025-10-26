'use client';

import { useTransition } from 'react';
import { Header } from '@/components/layout/header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePayment } from '@/hooks/usePayment';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';

export default function PaymentPage() {
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();
  // The hook now encapsulates all the complex logic.
  const { createPaymentSession, error } = usePayment();

  const handleUpgrade = () => {
    startTransition(async () => {
      if (!user?.email) {
        // In a real app, you'd handle this more gracefully.
        alert("User email is not available.");
        return;
      }
      const paymentData = {
        email: user.email,
        items: [{ id: 'premium-plan', name: 'AfgAiHub Premium', price: 1000 }],
        // Example redirect URLs can be passed here if needed
        // redirectSuccess: `${window.location.origin}/payment-success`,
        // redirectFailure: `${window.location.origin}/payment-failure`,
      };
      await createPaymentSession(paymentData);
    });
  };

  return (
    <div className="flex flex-col w-full">
      <Header title="Payments" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Premium Features</CardTitle>
              <CardDescription>
                Unlock the full potential of AfgAiHub with our premium plan for
                just 1000 AFN.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Get unlimited access to all our AI agents and features.
                </p>
                <Button
                  onClick={handleUpgrade}
                  disabled={isPending}
                  className="w-full"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating session...
                    </>
                  ) : (
                    'Upgrade to Premium'
                  )}
                </Button>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <p className="text-center text-xs text-muted-foreground">
                  You will be redirected to HesabPay to complete your secure
                  payment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
