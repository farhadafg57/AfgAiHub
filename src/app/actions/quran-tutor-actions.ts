'use server';

import {
  getQuranicGuidance,
  QuranicGuidanceInput,
  QuranicGuidanceOutput,
} from '@/ai/flows/quran-tutor-spiritual-guidance';

export async function getGuidanceAction(
  input: QuranicGuidanceInput
): Promise<QuranicGuidanceOutput> {
  return getQuranicGuidance(input);
}
