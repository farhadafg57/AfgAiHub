
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
  notes: z.string().optional().describe('Any additional notes or specific requests, like "prefer less touristy spots" or "traveling with children".'),
});
export type TravelItineraryInput = z.infer<typeof TravelItineraryInputSchema>;

export const TravelItineraryOutputSchema = z.object({
  itinerary: z.string().describe('A detailed day-by-day travel itinerary with suggested activities, timings, and restaurant recommendations.'),
  packingList: z.array(z.string()).describe('A suggested packing list tailored to the destination and activities.'),
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
  Additional Notes: {{{notes}}}

  Provide a structured itinerary with specific activity suggestions for morning, afternoon, and evening. Include at least one restaurant recommendation per day that fits the budget.
  Also, suggest a packing list of 5-10 essential items relevant to the destination and planned activities.`,
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
