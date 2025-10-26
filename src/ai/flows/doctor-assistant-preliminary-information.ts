'use server';
/**
 * @fileOverview An AI agent that provides preliminary medical information and suggestions based on user-described symptoms.
 *
 * - getPreliminaryMedicalInformation - A function that handles the process of providing preliminary medical information.
 * - PreliminaryMedicalInformationInput - The input type for the getPreliminaryMedicalInformation function.
 * - PreliminaryMedicalInformationOutput - The return type for the getPreliminaryMedicalInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PreliminaryMedicalInformationInputSchema = z.object({
  symptoms: z.string().describe('A detailed description of the symptoms experienced by the user.'),
});
export type PreliminaryMedicalInformationInput = z.infer<typeof PreliminaryMedicalInformationInputSchema>;

const PreliminaryMedicalInformationOutputSchema = z.object({
  preliminaryInformation: z.string().describe('Preliminary medical information and suggestions based on the described symptoms.'),
  disclaimer: z.string().describe('A disclaimer stating that this information is not a substitute for professional medical advice.'),
});
export type PreliminaryMedicalInformationOutput = z.infer<typeof PreliminaryMedicalInformationOutputSchema>;

export async function getPreliminaryMedicalInformation(input: PreliminaryMedicalInformationInput): Promise<PreliminaryMedicalInformationOutput> {
  return preliminaryMedicalInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'preliminaryMedicalInformationPrompt',
  input: {schema: PreliminaryMedicalInformationInputSchema},
  output: {schema: PreliminaryMedicalInformationOutputSchema},
  prompt: `You are a medical AI assistant providing preliminary medical information and suggestions based on user-described symptoms.

  Symptoms: {{{symptoms}}}

  Provide preliminary information and suggestions. Include a disclaimer that this information is not a substitute for professional medical advice.
  `,
});

const preliminaryMedicalInformationFlow = ai.defineFlow(
  {
    name: 'preliminaryMedicalInformationFlow',
    inputSchema: PreliminaryMedicalInformationInputSchema,
    outputSchema: PreliminaryMedicalInformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
