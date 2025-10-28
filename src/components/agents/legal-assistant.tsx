'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  LegalInformationOutput,
} from '@/ai/flows/legal-assistant-flow';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Scale, HelpCircle, Loader2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { getLegalInfoAction } from '@/app/actions/legal-assistant-actions';

export default function LegalAssistant() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<LegalInformationOutput | null>(null);
  const [legalQuery, setLegalQuery] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (legalQuery.length < 15) {
      alert('Please describe your legal question in more detail.');
      return;
    }
    setResult(null);
    startTransition(async () => {
      try {
        const response = await getLegalInfoAction({ legalQuery });
        setResult(response);
      } catch (error) {
        console.error(error);
        alert("Failed to get legal information. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-headline">Legal Assistant</CardTitle>
            <CardDescription>
              Ask a legal question or describe a situation to get preliminary, general information.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/how-to-use/legal-assistant">
              <HelpCircle className="mr-2 h-4 w-4" />
              How to Use
            </Link>
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div>
              <label htmlFor="legalQuery" className="text-sm font-medium">Your Legal Question</label>
              <Textarea
                id="legalQuery"
                placeholder="e.g., 'What are the basic steps to create a simple will?'"
                className="min-h-[120px] mt-2"
                value={legalQuery}
                onChange={(e) => setLegalQuery(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Analyzing...' : 'Get Information'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isPending && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Scale className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Legal Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="pt-4">
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Scale className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Legal Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-wrap">{result.information}</p>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Disclaimer</AlertTitle>
              <AlertDescription>
                {result.disclaimer}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
