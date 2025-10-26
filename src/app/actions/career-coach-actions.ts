
'use server';

import {
  getCareerAdvice,
  CareerAdviceInput,
  CareerAdviceOutput,
} from '@/ai/flows/career-coach-flow';

export async function getCareerAdviceAction(
  input: CareerAdviceInput
): Promise<CareerAdviceOutput> {
  return getCareerAdvice(input);
}
