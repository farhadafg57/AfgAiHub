'use client';

import { useState, useTransition } from 'react';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HeartPulse, Dumbbell, Apple, HelpCircle, Loader2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { getFitnessPlanAction } from '@/app/actions/fitness-trainer-actions';

export default function FitnessTrainer() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<FitnessPlanOutput | null>(null);
  const [formData, setFormData] = useState<FitnessPlanInput>({
    fitnessGoal: '',
    fitnessLevel: 'beginner',
    daysPerWeek: 3,
    availableEquipment: 'none',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.fitnessGoal.length < 5) {
      alert('Please describe your goal.');
      return;
    }
     if (formData.availableEquipment.length < 3) {
      alert('e.g., "none", "dumbbells", "full gym"');
      return;
    }
    setResult(null);
    startTransition(async () => {
      try {
        const response = await getFitnessPlanAction(formData);
        setResult(response);
      } catch (error) {
        console.error(error);
        alert("Failed to create fitness plan. Please try again.");
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setFormData(prev => ({ ...prev, daysPerWeek: Number(e.target.value) }));
  };

  const handleSelectChange = (value: 'beginner' | 'intermediate' | 'advanced') => {
    setFormData(prev => ({ ...prev, fitnessLevel: value }));
  };

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
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Primary Fitness Goal</label>
              <Input name="fitnessGoal" value={formData.fitnessGoal} onChange={handleInputChange} placeholder="e.g., Lose weight, build muscle" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Current Fitness Level</label>
              <Select onValueChange={handleSelectChange} defaultValue={formData.fitnessLevel}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your fitness level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Workout Days Per Week: {formData.daysPerWeek}</label>
              <Input
                type="range"
                min="1"
                max="7"
                step="1"
                value={formData.daysPerWeek}
                onChange={handleRangeChange}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Available Equipment</label>
              <Input name="availableEquipment" value={formData.availableEquipment} onChange={handleInputChange} placeholder="e.g., Dumbbells, resistance bands, full gym" className="mt-2" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Generating Plan...' : 'Create My Plan'}
            </Button>
          </CardFooter>
        </form>
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
