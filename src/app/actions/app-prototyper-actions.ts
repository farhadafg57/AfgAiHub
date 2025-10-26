'use server';

import {
  generateInitialCode,
  AppPrototyperInput,
  AppPrototyperOutput,
} from '@/ai/flows/app-prototyper-initial-code-generation';

export async function getAppCodeAction(
  input: AppPrototyperInput
): Promise<AppPrototyperOutput> {
  return generateInitialCode(input);
}
