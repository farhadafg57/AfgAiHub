'use client';

import { useState, useTransition, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Gem, Upload, DollarSign, Key, Microscope, HelpCircle, Loader2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { authenticateAction } from '@/app/actions/antique-authenticator-actions';

export default function AntiqueAuthenticator() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AuthenticateAntiqueOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoDataUri(base64String);
        setPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!photoDataUri) {
      alert('Please upload an image.');
      return;
    }
    setResult(null);
    startTransition(async () => {
      try {
        const response = await authenticateAction({ photoDataUri, additionalDetails });
        setResult(response);
      } catch (error) {
        console.error(error);
        alert("Failed to authenticate the antique. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-headline">Antique Authenticator</CardTitle>
            <CardDescription>
              Upload a photo of your antique and provide any details to get an AI-powered authentication analysis.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/how-to-use/antique-authenticator">
              <HelpCircle className="mr-2 h-4 w-4" />
              How to Use
            </Link>
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="photo" className="text-sm font-medium">Antique Photo</label>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center">
                  {preview ? (
                    <Image src={preview} alt="Antique preview" width={96} height={96} className="object-cover rounded-md" />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="flex-1" />
              </div>
            </div>
            <div>
              <label htmlFor="details" className="text-sm font-medium">Additional Details</label>
              <Textarea
                id="details"
                placeholder="e.g., 'Found in grandmother\'s attic. Has a small chip on the base. Any maker\'s marks?'"
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                className="mt-2"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Analyzing...' : 'Authenticate'}
            </Button>
          </CardFooter>
        </form>
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
