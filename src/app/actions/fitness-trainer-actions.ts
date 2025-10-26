
'use server';

import {
  getFitnessPlan,
  FitnessPlanInput,
  FitnessPlanOutput,
} from '@/ai/flows/fitness-trainer-flow';

export async function getFitnessPlanAction(
  input: FitnessPlanInput
): Promise<FitnessPlanOutput> {
  return getFitnessPlan(input);
}
