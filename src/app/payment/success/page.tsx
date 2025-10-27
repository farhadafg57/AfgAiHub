'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  let transactionData: any = null;

  try {
    // The data is expected to be a JSON string, so we parse it.
    const dataParam = searchParams.get('data');
    if (dataParam) {
      transactionData = JSON.parse(dataParam);
    }
  } catch (error) {
    console.error('Failed to parse transaction data from URL:', error);
    // Handle error gracefully, maybe show a generic success message
  }

  useEffect(() => {
    // Listen for paymentSuccess message from HesabPay
    const handlePaymentSuccess = (event: MessageEvent) => {
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

      if (event.data?.type === 'paymentSuccess') {
        console.log('Payment success event received:', event.data);
        
        // Process payment success data
        const paymentData = event.data.payload;
        
        // You can update UI or trigger additional actions here
        // For example, store in localStorage or update state
        if (paymentData?.transaction_id) {
          localStorage.setItem('last_transaction', JSON.stringify(paymentData));
        }
      }
    };

    window.addEventListener('message', handlePaymentSuccess);

    return () => {
      window.removeEventListener('message', handlePaymentSuccess);
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <motion.div
              className="mx-auto"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
            >
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </motion.div>
            <CardTitle className="mt-4 font-headline text-2xl">Payment Successful!</CardTitle>
            <CardDescription>
              Thank you for your payment. Your transaction has been confirmed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactionData?.transaction_id && (
              <p className="text-sm text-muted-foreground">
                Your Transaction ID is: <strong>{transactionData.transaction_id}</strong>
              </p>
            )}
            <p className="text-muted-foreground">
              A confirmation has been sent to your email.
            </p>
            <Button asChild className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  // Wrap with Suspense because useSearchParams() can suspend rendering
  return (
    <Suspense fallback={<div>Loading confirmation...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
