
'use server';

import {
  getLegalInformation,
  LegalInformationInput,
  LegalInformationOutput,
} from '@/ai/flows/legal-assistant-flow';

export async function getLegalInfoAction(
  input: LegalInformationInput
): Promise<LegalInformationOutput> {
  return getLegalInformation(input);
}
