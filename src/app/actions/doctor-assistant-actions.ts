'use server';

import {
  getPreliminaryMedicalInformation,
  PreliminaryMedicalInformationInput,
  PreliminaryMedicalInformationOutput,
} from '@/ai/flows/doctor-assistant-preliminary-information';

export async function getMedicalInfoAction(
  input: PreliminaryMedicalInformationInput
): Promise<PreliminaryMedicalInformationOutput> {
  return getPreliminaryMedicalInformation(input);
}
