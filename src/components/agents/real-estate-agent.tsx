"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  GetPropertyInformationInput,
  GetPropertyInformationOutput,
} from '@/ai/flows/real-estate-agent-property-information';
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
import { Home } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getPropertyInfoAction } from '@/app/actions/real-estate-agent-actions';

const formSchema = z.object({
  propertyAddress: z.string().min(5, 'Please enter a valid address.'),
  userQuestion: z.string().min(10, 'Please ask a more detailed question.'),
});

export default function RealEstateAgent() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GetPropertyInformationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyAddress: '',
      userQuestion: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(null);
    startTransition(async () => {
      try {
        const response = await getPropertyInfoAction(values);
        setResult(response);
      } catch (error) {
        console.error(error);
        toast({
          title: "An error occurred.",
          description: "Failed to get property information. Please try again.",
          variant: "destructive"
        })
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Property Assistant</CardTitle>
          <CardDescription>
            Enter a property address and your question to get detailed
            information.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="propertyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Address</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 123 Main St, Anytown, USA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userQuestion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Question</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'What are the nearby schools and their ratings?'"
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
                {isPending ? 'Searching...' : 'Get Information'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isPending && (
         <Card>
          <CardHeader>
             <div className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Property Details</CardTitle>
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
              <Home className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Property Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{result.propertyInformation}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
