'use server';

import {
  authenticateAntique,
  AuthenticateAntiqueInput,
  AuthenticateAntiqueOutput,
} from '@/ai/flows/antique-authentication-insights';

export async function authenticateAction(
  input: AuthenticateAntiqueInput
): Promise<AuthenticateAntiqueOutput> {
  return authenticateAntique(input);
}
