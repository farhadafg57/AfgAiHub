"use client";

import 'server-only';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  getPreliminaryMedicalInformation,
  PreliminaryMedicalInformationInput,
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Stethoscope } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  symptoms: z.string().min(20, 'Please describe your symptoms in more detail.'),
});

async function getMedicalInfoAction(
  input: PreliminaryMedicalInformationInput
): Promise<PreliminaryMedicalInformationOutput> {
  'use server';
  return getPreliminaryMedicalInformation(input);
}

export default function DoctorAssistant() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<PreliminaryMedicalInformationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(null);
    startTransition(async () => {
      try {
        const response = await getMedicalInfoAction(values);
        setResult(response);
      } catch (error) {
        console.error(error);
        toast({
          title: "An error occurred.",
          description: "Failed to get medical information. Please try again.",
          variant: "destructive"
        })
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Symptom Checker</CardTitle>
          <CardDescription>
            Describe your symptoms, and the AI will provide preliminary
            information and suggestions.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I have a sore throat, a mild fever, and a headache...'"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Analyzing Symptoms...' : 'Analyze Symptoms'}
              </Button>
            </CardFooter>
          </form>
        </Form>
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
