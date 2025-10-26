'use server';

import {
  getPropertyInformation,
  GetPropertyInformationInput,
  GetPropertyInformationOutput,
} from '@/ai/flows/real-estate-agent-property-information';

export async function getPropertyInfoAction(
  input: GetPropertyInformationInput
): Promise<GetPropertyInformationOutput> {
  return getPropertyInformation(input);
}
