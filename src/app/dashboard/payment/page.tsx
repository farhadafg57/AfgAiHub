import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PaymentPage() {
  return (
    <div className="flex flex-col w-full">
      <Header title="Payments" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Premium Features</CardTitle>
            <CardDescription>
              Unlock the full potential of AfgAiHub with our premium plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <p>
                    Our payment system is currently under construction. Please check back later.
                </p>
                <p>We plan to integrate with HesabPay for secure and easy payments.</p>
                <Button disabled className="w-full">
                    Upgrade to Premium (Coming Soon)
                </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  );
}
