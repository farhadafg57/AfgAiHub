'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  AppPrototyperOutput,
} from '@/ai/flows/app-prototyper-initial-code-generation';
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
import { AppWindow, Copy, Check, HelpCircle, Loader2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { getAppCodeAction } from '@/app/actions/app-prototyper-actions';

export default function AppPrototyper() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AppPrototyperOutput | null>(null);
  const [copied, setCopied] = useState(false);
  const [description, setDescription] = useState('');

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.codeSnippets);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (description.length < 20) {
      alert('Please provide a more detailed description of your app idea.');
      return;
    }
    setResult(null);
    startTransition(async () => {
      try {
        const response = await getAppCodeAction({ description });
        setResult(response);
      } catch (error) {
        console.error(error);
        alert("Failed to generate code. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-headline">App Prototyper</CardTitle>
            <CardDescription>
              Describe the app you want to build, and the AI will generate initial
              code snippets to get you started.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/how-to-use/app-prototyper">
              <HelpCircle className="mr-2 h-4 w-4" />
              How to Use
            </Link>
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div>
              <label htmlFor="description" className="text-sm font-medium">App Description</label>
              <Textarea
                id="description"
                placeholder="e.g., 'A simple to-do list app with features to add, remove, and mark tasks as complete.'"
                className="min-h-[150px] font-code mt-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Generating Code...' : 'Generate Code'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isPending && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AppWindow className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Generated Code</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AppWindow className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline">Generated Code</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code className="font-code text-sm">{result.codeSnippets}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
