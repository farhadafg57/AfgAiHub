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

export default function PaymentPage() {
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = () => {
    startTransition(async () => {
      if (!user?.email) {
        alert("User email is not available.");
        return;
      }
      // The payment creation logic will be handled by a server action in a future step.
      // For now, this is a placeholder.
      console.log('Creating payment session for:', user.email);
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Payment redirection logic not implemented yet.');

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
