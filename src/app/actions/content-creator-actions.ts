
'use server';

import {
  getContentIdeas,
  ContentCreatorInput,
  ContentCreatorOutput,
} from '@/ai/flows/content-creator-flow';

export async function getContentIdeasAction(
  input: ContentCreatorInput
): Promise<ContentCreatorOutput> {
  return getContentIdeas(input);
}
