"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import {
  AppPrototyperInput,
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { AppWindow, Copy, Check, HelpCircle, Loader2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { getAppCodeAction } from '@/app/actions/app-prototyper-actions';

const formSchema = z.object({
  description: z.string().min(20, 'Please provide a more detailed description of your app idea.'),
});

export default function AppPrototyper() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AppPrototyperOutput | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.codeSnippets);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(null);
    startTransition(async () => {
      try {
        const response = await getAppCodeAction(values);
        setResult(response);
      } catch (error) {
        console.error(error);
        alert("Failed to generate code. Please try again.");
      }
    });
  }

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>App Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'A simple to-do list app with features to add, remove, and mark tasks as complete.'"
                        className="min-h-[150px] font-code"
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
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? 'Generating Code...' : 'Generate Code'}
              </Button>
            </CardFooter>
          </form>
        </Form>
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
