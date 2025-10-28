'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  TravelItineraryInput,
  TravelItineraryOutput,
} from '@/ai/flows/travel-planner-flow';
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
import { Plane, Map, Backpack, HelpCircle, Loader2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { getTravelItineraryAction } from '@/app/actions/travel-planner-actions';
import { Textarea } from '../ui/textarea';

export default function TravelPlanner() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<TravelItineraryOutput | null>(null);
  const [formData, setFormData] = useState<TravelItineraryInput>({
    destination: '',
    duration: '7 days',
    interests: '',
    budget: 'mid-range',
    notes: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.destination.length < 2) {
      alert('Please enter a valid destination.');
      return;
    }
    if (formData.duration.length < 2) {
      alert('Please enter a trip duration.');
      return;
    }
    if (formData.interests.length < 5) {
      alert('Please list at least one interest.');
      return;
    }
    setResult(null);
    startTransition(async () => {
      try {
        const response = await getTravelItineraryAction(formData);
        setResult(response);
      } catch (error) {
        console.error(error);
        alert("Failed to create itinerary. Please try again.");
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: 'budget' | 'mid-range' | 'luxury') => {
    setFormData(prev => ({ ...prev, budget: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-headline">Travel Planner</CardTitle>
            <CardDescription>
              Plan your next adventure. Tell us where you want to go, and we'll create a custom itinerary.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/how-to-use/travel-planner">
              <HelpCircle className="mr-2 h-4 w-4" />
              How to Use
            </Link>
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="destination" className="text-sm font-medium">Destination</label>
              <Input id="destination" name="destination" placeholder="e.g., Tokyo, Japan" value={formData.destination} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium">Trip Duration</label>
              <Input id="duration" name="duration" placeholder="e.g., 7 days" value={formData.duration} onChange={handleInputChange} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="interests" className="text-sm font-medium">Interests</label>
              <Input id="interests" name="interests" placeholder="e.g., History, food, hiking, museums" value={formData.interests} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Budget</label>
              <Select onValueChange={handleSelectChange} defaultValue={formData.budget}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a budget level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="mid-range">Mid-Range</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Additional Notes</label>
              <Textarea id="notes" name="notes" placeholder="e.g., 'Traveling with two young children' or 'Prefer to avoid crowded tourist traps'" value={formData.notes} onChange={handleInputChange} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Planning...' : 'Create Itinerary'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isPending && (
         <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Plane className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Your Travel Plan</CardTitle>
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
              <Plane className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Your Travel Plan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Map className="h-5 w-5 text-muted-foreground"/>
                <h3 className="text-lg font-semibold font-headline">Day-by-Day Itinerary</h3>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: result.itinerary.replace(/\n/g, '<br />') }} />
            </div>
             <div>
              <div className="flex items-center gap-2 mb-2">
                <Backpack className="h-5 w-5 text-muted-foreground"/>
                <h3 className="text-lg font-semibold font-headline">Packing List</h3>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {result.packingList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
