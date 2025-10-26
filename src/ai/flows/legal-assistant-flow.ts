
'use server';
/**
 * @fileOverview An AI agent that provides preliminary legal information.
 *
 * - getLegalInformation - A function that handles the process of providing legal info.
 * - LegalInformationInput - The input type for the getLegalInformation function.
 * - LegalInformationOutput - The return type for the getLegalInformation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const LegalInformationInputSchema = z.object({
  legalQuery: z.string().describe('The user\'s legal question or topic.'),
});
export type LegalInformationInput = z.infer<typeof LegalInformationInputSchema>;

export const LegalInformationOutputSchema = z.object({
  information: z.string().describe('Preliminary legal information about the query.'),
  disclaimer: z.string().describe('A disclaimer that this is not legal advice.'),
});
export type LegalInformationOutput = z.infer<typeof LegalInformationOutputSchema>;

export async function getLegalInformation(input: LegalInformationInput): Promise<LegalInformationOutput> {
  return legalInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'legalInformationPrompt',
  input: { schema: LegalInformationInputSchema },
  output: { schema: LegalInformationOutputSchema },
  prompt: `You are an AI legal assistant. Provide preliminary, general information based on the user's query.

  Query: {{{legalQuery}}}

  Provide a general overview of the topic. CRITICALLY IMPORTANT: You must include a clear, prominent disclaimer that you are not a lawyer and this is not legal advice, and the user should consult with a qualified attorney.`,
});

const legalInformationFlow = ai.defineFlow(
  {
    name: 'legalInformationFlow',
    inputSchema: LegalInformationInputSchema,
    outputSchema: LegalInformationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
