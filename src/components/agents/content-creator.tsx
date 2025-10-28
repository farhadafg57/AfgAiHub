'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  ContentCreatorOutput,
  ContentCreatorInput,
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PenSquare, Lightbulb, FileText, HelpCircle, Loader2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { getContentIdeasAction } from '@/app/actions/content-creator-actions';

export default function ContentCreator() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ContentCreatorOutput | null>(null);
  const [formData, setFormData] = useState<ContentCreatorInput>({
    topic: '',
    contentType: 'blog_post',
    targetAudience: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.topic.length < 3) {
      alert('Please enter a topic.');
      return;
    }
    if (formData.targetAudience.length < 3) {
      alert('Please describe the target audience.');
      return;
    }
    setResult(null);
    startTransition(async () => {
      try {
        const response = await getContentIdeasAction(formData);
        setResult(response);
      } catch (error) {
        console.error(error);
        alert("Failed to generate content. Please try again.");
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: 'blog_post' | 'tweet_thread' | 'video_script') => {
    setFormData(prev => ({ ...prev, contentType: value }));
  };

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
        <form onSubmit={handleSubmit}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="topic" className="text-sm font-medium">Topic</label>
              <Input
                id="topic"
                name="topic"
                placeholder="e.g., 'The Future of AI'"
                value={formData.topic}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Format</label>
              <Select onValueChange={handleSelectChange} defaultValue={formData.contentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog_post">Blog Post</SelectItem>
                  <SelectItem value="tweet_thread">Tweet Thread</SelectItem>
                  <SelectItem value="video_script">Video Script</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="targetAudience" className="text-sm font-medium">Target Audience</label>
              <Input
                id="targetAudience"
                name="targetAudience"
                placeholder="e.g., Tech enthusiasts, beginners in marketing"
                value={formData.targetAudience}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Generating...' : 'Generate Content'}
            </Button>
          </CardFooter>
        </form>
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
