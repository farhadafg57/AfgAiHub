'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  PreliminaryMedicalInformationOutput,
} from '@/ai/flows/doctor-assistant-preliminary-information';
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
import { AlertTriangle, Stethoscope, HelpCircle, Loader2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { getMedicalInfoAction } from '@/app/actions/doctor-assistant-actions';

export default function DoctorAssistant() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<PreliminaryMedicalInformationOutput | null>(null);
  const [symptoms, setSymptoms] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (symptoms.length < 20) {
      alert('Please describe your symptoms in more detail.');
      return;
    }
    setResult(null);
    startTransition(async () => {
      try {
        const response = await getMedicalInfoAction({ symptoms });
        setResult(response);
      } catch (error) {
        console.error(error);
        alert("Failed to get medical information. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-headline">Symptom Checker</CardTitle>
            <CardDescription>
              Describe your symptoms, and the AI will provide preliminary
              information and suggestions.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/how-to-use/doctor-assistant">
              <HelpCircle className="mr-2 h-4 w-4" />
              How to Use
            </Link>
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div>
              <label htmlFor="symptoms" className="text-sm font-medium">Your Symptoms</label>
              <Textarea
                id="symptoms"
                placeholder="e.g., 'I have a sore throat, a mild fever, and a headache...'"
                className="min-h-[120px] mt-2"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Analyzing Symptoms...' : 'Analyze Symptoms'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isPending && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Preliminary Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
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
              <Stethoscope className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Preliminary Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-wrap">{result.preliminaryInformation}</p>
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
