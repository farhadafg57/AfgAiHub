'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

function FailContent() {
  const searchParams = useSearchParams();
  let transactionData: any = null;

  try {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      transactionData = JSON.parse(dataParam);
    }
  } catch (error) {
    console.error('Failed to parse transaction data from URL:', error);
  }

  useEffect(() => {
    // Listen for paymentFailure message from HesabPay
    const handlePaymentFailure = (event: MessageEvent) => {
      // Validate origin - only accept messages from HesabPay domain
      const allowedOrigins = [
        'https://api.hesab.com',
        'https://hesab.com',
        'https://checkout.hesab.com',
      ];
      
      if (!allowedOrigins.some(origin => event.origin.startsWith(origin))) {
        console.warn('Payment message received from unauthorized origin:', event.origin);
        return;
      }

      if (event.data?.type === 'paymentFailure' || event.data?.type === 'paymentCancelled') {
        console.log('Payment failure event received:', event.data);
        
        // Process payment failure data
        const paymentData = event.data.payload;
        
        // Store failure info for debugging or retry
        if (paymentData) {
          localStorage.setItem('last_payment_failure', JSON.stringify(paymentData));
        }
      }
    };

    window.addEventListener('message', handlePaymentFailure);

    return () => {
      window.removeEventListener('message', handlePaymentFailure);
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 150 }}
              className="mx-auto"
            >
              <XCircle className="h-16 w-16 text-destructive" />
            </motion.div>
            <CardTitle className="mt-4 font-headline text-2xl">Payment Failed</CardTitle>
            <CardDescription>
              Unfortunately, we were unable to process your payment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactionData?.transaction_id && (
              <p className="text-sm text-muted-foreground">
                Transaction ID: {transactionData.transaction_id}
              </p>
            )}
            <p className="text-muted-foreground">
              Please try again or use a different payment method.
            </p>
            <Button asChild className="w-full">
              <Link href="/dashboard/payment">Try Again</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function FailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FailContent />
    </Suspense>
  );
}
