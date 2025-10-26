"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import {
  AuthenticateAntiqueInput,
  AuthenticateAntiqueOutput,
} from '@/ai/flows/antique-authentication-insights';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Gem, Upload, DollarSign, Key, Microscope } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { authenticateAction } from '@/app/actions/antique-authenticator-actions';

const formSchema = z.object({
  photoDataUri: z.string().refine((val) => val.startsWith('data:image/'), {
    message: 'Please upload an image file.',
  }),
  additionalDetails: z.string().optional(),
});

export default function AntiqueAuthenticator() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AuthenticateAntiqueOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photoDataUri: '',
      additionalDetails: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        form.setValue('photoDataUri', base64String, { shouldValidate: true });
        setPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(null);
    startTransition(async () => {
      try {
        const response = await authenticateAction(values);
        setResult(response);
      } catch (error) {
        console.error(error);
        toast({
          title: "An error occurred.",
          description: "Failed to authenticate the antique. Please try again.",
          variant: "destructive"
        })
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Antique Authenticator</CardTitle>
          <CardDescription>
            Upload a photo of your antique and provide any details to get an AI-powered authentication analysis.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="photoDataUri"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Antique Photo</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center">
                          {preview ? (
                            <Image src={preview} alt="Antique preview" width={96} height={96} className="object-cover rounded-md" />
                          ) : (
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <Input type="file" accept="image/*" onChange={handleFileChange} className="flex-1" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="additionalDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Found in grandmother\'s attic. Has a small chip on the base. Any maker\'s marks?'"
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
                {isPending ? 'Analyzing...' : 'Authenticate'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isPending && (
         <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Gem className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Authentication Report</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6 mt-2" />
            </div>
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </div>
             <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Gem className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Authentication Report</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Microscope className="h-5 w-5 text-muted-foreground"/>
                <h3 className="text-lg font-semibold font-headline">Authenticity Assessment</h3>
              </div>
              <p className="whitespace-pre-wrap text-muted-foreground">{result.authenticityAssessment}</p>
            </div>
             <div>
              <div className="flex items-center gap-2 mb-2">
                <Key className="h-5 w-5 text-muted-foreground"/>
                <h3 className="text-lg font-semibold font-headline">Key Features</h3>
              </div>
              <p className="whitespace-pre-wrap text-muted-foreground">{result.keyFeatures}</p>
            </div>
             <div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-muted-foreground"/>
                <h3 className="text-lg font-semibold font-headline">Potential Value</h3>
              </div>
              <p className="whitespace-pre-wrap text-muted-foreground">{result.potentialValue}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
