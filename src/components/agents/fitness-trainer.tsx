"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import {
  FitnessPlanInput,
  FitnessPlanOutput,
} from '@/ai/flows/fitness-trainer-flow';
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
import { Slider } from '@/components/ui/slider';
import { HeartPulse, Dumbbell, Apple, HelpCircle } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getFitnessPlanAction } from '@/app/actions/fitness-trainer-actions';

const formSchema = z.object({
  fitnessGoal: z.string().min(5, 'Please describe your goal.'),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  daysPerWeek: z.number().min(1).max(7),
  availableEquipment: z.string().min(3, 'e.g., "none", "dumbbells", "full gym"'),
});

export default function FitnessTrainer() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<FitnessPlanOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fitnessGoal: '',
      fitnessLevel: 'beginner',
      daysPerWeek: 3,
      availableEquipment: 'none',
    },
  });
  
  const daysPerWeek = form.watch('daysPerWeek');

  function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(null);
    startTransition(async () => {
      try {
        const response = await getFitnessPlanAction(values);
        setResult(response);
      } catch (error) {
        console.error(error);
        toast({
          title: "An error occurred.",
          description: "Failed to create fitness plan. Please try again.",
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
            <CardTitle className="font-headline">AI Fitness Trainer</CardTitle>
            <CardDescription>
              Get a personalized workout and diet plan based on your goals and fitness level.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/how-to-use/fitness-trainer">
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
                name="fitnessGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Fitness Goal</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lose weight, build muscle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="fitnessLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Fitness Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your fitness level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="daysPerWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workout Days Per Week: {daysPerWeek}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={7}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="availableEquipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Equipment</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Dumbbells, resistance bands, full gym" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Generating Plan...' : 'Create My Plan'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isPending && (
         <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <HeartPulse className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Your Fitness Plan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <HeartPulse className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Your Fitness Plan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell className="h-5 w-5 text-muted-foreground"/>
                <h3 className="text-lg font-semibold font-headline">Weekly Workout Plan</h3>
              </div>
              <p className="whitespace-pre-wrap text-muted-foreground">{result.weeklyPlan}</p>
            </div>
             <div>
              <div className="flex items-center gap-2 mb-2">
                <Apple className="h-5 w-5 text-muted-foreground"/>
                <h3 className="text-lg font-semibold font-headline">Dietary Tips</h3>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {result.dietaryTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
