"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import {
  CareerAdviceInput,
  CareerAdviceOutput,
} from '@/ai/flows/career-coach-flow';
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
import { Input } from '@/components/ui/input';
import { Briefcase, Link as LinkIcon, Lightbulb, HelpCircle } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getCareerAdviceAction } from '@/app/actions/career-coach-actions';

const formSchema = z.object({
  careerGoal: z.string().min(10, 'Please describe your goal in more detail.'),
  experience: z.string().min(20, 'Please provide a summary of your experience or resume.'),
});

export default function CareerCoach() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CareerAdviceOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      careerGoal: '',
      experience: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(null);
    startTransition(async () => {
      try {
        const response = await getCareerAdviceAction(values);
        setResult(response);
      } catch (error) {
        console.error(error);
        toast({
          title: "An error occurred.",
          description: "Failed to get career advice. Please try again.",
          variant: "destructive"
        })
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-headline">Career Coach</CardTitle>
            <CardDescription>
              Define your career goals and paste your resume/experience to get personalized advice.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/how-to-use/career-coach">
              <HelpCircle className="mr-2 h-4 w-4" />
              How to Use
            </Link>
          </Button>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="careerGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Career Goal</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Transition into a product management role'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Experience / Resume</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your resume or a summary of your work experience here."
                        className="min-h-[200px]"
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
                {isPending ? 'Getting Advice...' : 'Get Career Advice'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isPending && (
         <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Your Career Plan</CardTitle>
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
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Your Career Plan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-muted-foreground"/>
                <h3 className="text-lg font-semibold font-headline">Actionable Advice</h3>
              </div>
              <p className="whitespace-pre-wrap text-muted-foreground">{result.advice}</p>
            </div>
             <div>
              <div className="flex items-center gap-2 mb-2">
                <LinkIcon className="h-5 w-5 text-muted-foreground"/>
                <h3 className="text-lg font-semibold font-headline">Recommended Resources</h3>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {result.resources.map((resource, index) => (
                  <li key={index}>
                    <a href={resource} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {resource}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
