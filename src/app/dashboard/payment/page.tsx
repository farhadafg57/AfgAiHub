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
import { Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { createPaymentSessionAction } from '@/app/actions/payment-actions';

export default function PaymentPage() {
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = () => {
    startTransition(async () => {
      if (!user?.email) {
        alert('User email is not available. Please ensure you are logged in.');
        return;
      }
      
      const successUrl = `${window.location.origin}/payment/success`;
      const failUrl = `${window.location.origin}/payment/fail`;

      const result = await createPaymentSessionAction(user.email, successUrl, failUrl);

      if (result.checkout_url) {
        window.location.href = result.checkout_url;
      } else {
        alert(`Could not initiate payment: ${result.error}`);
      }
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
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                  <li>Unlimited access to all 10 AI agents.</li>
                  <li>Priority support and feature requests.</li>
                  <li>Early access to new and upcoming AI agents.</li>
                </ul>
                <Button
                  onClick={handleUpgrade}
                  disabled={isPending || !user}
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
