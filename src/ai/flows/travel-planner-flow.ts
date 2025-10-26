
'use server';
/**
 * @fileOverview An AI agent that plans travel itineraries.
 *
 * - getTravelItinerary - A function that creates a travel plan.
 * - TravelItineraryInput - The input type for the getTravelItinerary function.
 * - TravelItineraryOutput - The return type for the getTravelItinerary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const TravelItineraryInputSchema = z.object({
  destination: z.string().describe('The travel destination.'),
  duration: z.string().describe('The duration of the trip (e.g., "7 days").'),
  interests: z.string().describe('User\'s interests (e.g., "history, food, hiking").'),
  budget: z.enum(['budget', 'mid-range', 'luxury']).describe('The user\'s budget for the trip.'),
});
export type TravelItineraryInput = z.infer<typeof TravelItineraryInputSchema>;

export const TravelItineraryOutputSchema = z.object({
  itinerary: z.string().describe('A detailed day-by-day travel itinerary.'),
  packingList: z.array(z.string()).describe('A suggested packing list.'),
});
export type TravelItineraryOutput = z.infer<typeof TravelItineraryOutputSchema>;

export async function getTravelItinerary(input: TravelItineraryInput): Promise<TravelItineraryOutput> {
  return travelItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'travelItineraryPrompt',
  input: { schema: TravelItineraryInputSchema },
  output: { schema: TravelItineraryOutputSchema },
  prompt: `You are an expert travel planner. Create a detailed, day-by-day itinerary for a trip based on the user's preferences.

  Destination: {{{destination}}}
  Duration: {{{duration}}}
  Interests: {{{interests}}}
  Budget: {{{budget}}}

  Provide a structured itinerary. Also, suggest a packing list of 5-10 essential items.`,
});

const travelItineraryFlow = ai.defineFlow(
  {
    name: 'travelItineraryFlow',
    inputSchema: TravelItineraryInputSchema,
    outputSchema: TravelItineraryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
