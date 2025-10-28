'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  GetPropertyInformationOutput,
} from '@/ai/flows/real-estate-agent-property-information';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Home, HelpCircle, Loader2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { getPropertyInfoAction } from '@/app/actions/real-estate-agent-actions';

export default function RealEstateAgent() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GetPropertyInformationOutput | null>(null);
  const [propertyAddress, setPropertyAddress] = useState('');
  const [userQuestion, setUserQuestion] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (propertyAddress.length < 5) {
      alert('Please enter a valid address.');
      return;
    }
    if (userQuestion.length < 10) {
      alert('Please ask a more detailed question.');
      return;
    }
    setResult(null);
    startTransition(async () => {
      try {
        const response = await getPropertyInfoAction({ propertyAddress, userQuestion });
        setResult(response);
      } catch (error) {
        console.error(error);
        alert("Failed to get property information. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-headline">Property Assistant</CardTitle>
            <CardDescription>
              Enter a property address and your question to get detailed
              information.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/how-to-use/real-estate-agent">
              <HelpCircle className="mr-2 h-4 w-4" />
              How to Use
            </Link>
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="propertyAddress" className="text-sm font-medium">Property Address</label>
              <Input
                id="propertyAddress"
                placeholder="e.g., 123 Main St, Anytown, USA"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <label htmlFor="userQuestion" className="text-sm font-medium">Your Question</label>
              <Textarea
                id="userQuestion"
                placeholder="e.g., 'What are the nearby schools and their ratings?'"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                className="mt-2"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Searching...' : 'Get Information'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isPending && (
         <Card>
          <CardHeader>
             <div className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Property Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
             <div className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Property Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{result.propertyInformation}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
