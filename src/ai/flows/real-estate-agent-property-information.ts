'use server';
/**
 * @fileOverview An AI agent that provides information about real estate properties.
 *
 * - getPropertyInformation - A function that handles retrieving property information.
 * - GetPropertyInformationInput - The input type for the getPropertyInformation function.
 * - GetPropertyInformationOutput - The return type for the getPropertyInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetPropertyInformationInputSchema = z.object({
  propertyAddress: z
    .string()
    .describe('The address of the property to get information about.'),
  userQuestion: z
    .string()
    .describe('The specific question the user has about the property.'),
});
export type GetPropertyInformationInput = z.infer<
  typeof GetPropertyInformationInputSchema
>;

const GetPropertyInformationOutputSchema = z.object({
  propertyInformation: z
    .string()
    .describe('Detailed information about the property in response to the user question.'),
});
export type GetPropertyInformationOutput = z.infer<
  typeof GetPropertyInformationOutputSchema
>;

export async function getPropertyInformation(
  input: GetPropertyInformationInput
): Promise<GetPropertyInformationOutput> {
  return getPropertyInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getPropertyInformationPrompt',
  input: {schema: GetPropertyInformationInputSchema},
  output: {schema: GetPropertyInformationOutputSchema},
  prompt: `You are a real estate expert providing information about properties.

  Address: {{{propertyAddress}}}
  Question: {{{userQuestion}}}

  Provide detailed information about the property based on the user's question.
  Be specific and helpful.`,
});

const getPropertyInformationFlow = ai.defineFlow(
  {
    name: 'getPropertyInformationFlow',
    inputSchema: GetPropertyInformationInputSchema,
    outputSchema: GetPropertyInformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
