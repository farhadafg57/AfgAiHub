
'use server';

import {
  getTravelItinerary,
  TravelItineraryInput,
  TravelItineraryOutput,
} from '@/ai/flows/travel-planner-flow';

export async function getTravelItineraryAction(
  input: TravelItineraryInput
): Promise<TravelItineraryOutput> {
  return getTravelItinerary(input);
}
