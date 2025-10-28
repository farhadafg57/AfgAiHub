'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  QuranicGuidanceOutput,
} from '@/ai/flows/quran-tutor-spiritual-guidance';
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
import { Skeleton } from '../ui/skeleton';
import { BookOpen, HelpCircle, Loader2 } from 'lucide-react';
import { getGuidanceAction } from '@/app/actions/quran-tutor-actions';

export default function QuranTutor() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<QuranicGuidanceOutput | null>(null);
  const [query, setQuery] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.length < 10) {
      alert('Please enter a more detailed query.');
      return;
    }
    setResult(null);
    startTransition(async () => {
      try {
        const response = await getGuidanceAction({ query });
        setResult(response);
      } catch (error) {
        console.error(error);
        alert("Failed to get guidance. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-headline">Ask the Quran</CardTitle>
            <CardDescription>
              Enter your question or the topic you seek guidance on, and the AI
              will provide insights from the Quran.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/how-to-use/quran-tutor">
              <HelpCircle className="mr-2 h-4 w-4" />
              How to Use
            </Link>
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div>
              <label htmlFor="query" className="text-sm font-medium">Your Question</label>
              <Textarea
                id="query"
                placeholder="e.g., 'What does the Quran say about patience?'"
                className="min-h-[100px] mt-2"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Getting Guidance...' : 'Get Guidance'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isPending && (
         <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Spiritual Guidance</CardTitle>
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
              <BookOpen className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Spiritual Guidance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{result.guidance}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
