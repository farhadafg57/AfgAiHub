"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import {
  ContentCreatorInput,
  ContentCreatorOutput,
} from '@/ai/flows/content-creator-flow';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PenSquare, Lightbulb, FileText, HelpCircle } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getContentIdeasAction } from '@/app/actions/content-creator-actions';

const formSchema = z.object({
  topic: z.string().min(3, 'Please enter a topic.'),
  contentType: z.enum(['blog_post', 'tweet_thread', 'video_script']),
  targetAudience: z.string().min(3, 'Please describe the target audience.'),
});

export default function ContentCreator() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ContentCreatorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      contentType: 'blog_post',
      targetAudience: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(null);
    startTransition(async () => {
      try {
        const response = await getContentIdeasAction(values);
        setResult(response);
      } catch (error) {
        console.error(error);
        toast({
          title: "An error occurred.",
          description: "Failed to generate content. Please try again.",
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
            <CardTitle className="font-headline">Content Creator Assistant</CardTitle>
            <CardDescription>
              Generate ideas and drafts for your next piece of content.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/how-to-use/content-creator">
              <HelpCircle className="mr-2 h-4 w-4" />
              How to Use
            </Link>
          </Button>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'The Future of AI'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="contentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Format</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="blog_post">Blog Post</SelectItem>
                        <SelectItem value="tweet_thread">Tweet Thread</SelectItem>
                        <SelectItem value="video_script">Video Script</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Tech enthusiasts, beginners in marketing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Generating...' : 'Generate Content'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isPending && (
         <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <PenSquare className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Your Content</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <PenSquare className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Your Content</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-muted-foreground"/>
                <h3 className="text-lg font-semibold font-headline">Content Ideas</h3>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {result.ideas.map((idea, index) => (
                  <li key={index}>{idea}</li>
                ))}
              </ul>
            </div>
             <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-muted-foreground"/>
                <h3 className="text-lg font-semibold font-headline">Content Draft</h3>
              </div>
              <p className="whitespace-pre-wrap text-muted-foreground bg-muted/50 p-4 rounded-md">{result.draft}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
