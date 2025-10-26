'use server';

/**
 * @fileOverview An AI agent specializing in spiritual guidance and knowledge of the Quran.
 *
 * - getQuranicGuidance - A function that handles the spiritual guidance process.
 * - QuranicGuidanceInput - The input type for the getQuranicGuidance function.
 * - QuranicGuidanceOutput - The return type for the getQuranicGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuranicGuidanceInputSchema = z.object({
  query: z.string().describe('The query or question about the Quran.'),
});
export type QuranicGuidanceInput = z.infer<typeof QuranicGuidanceInputSchema>;

const QuranicGuidanceOutputSchema = z.object({
  guidance: z.string().describe('The spiritual guidance or knowledge from the Quran.'),
});
export type QuranicGuidanceOutput = z.infer<typeof QuranicGuidanceOutputSchema>;

export async function getQuranicGuidance(input: QuranicGuidanceInput): Promise<QuranicGuidanceOutput> {
  return quranicGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'quranicGuidancePrompt',
  input: {schema: QuranicGuidanceInputSchema},
  output: {schema: QuranicGuidanceOutputSchema},
  prompt: `You are an AI agent specializing in spiritual guidance and knowledge of the Quran.

  Provide spiritual guidance and knowledge from the Quran based on the user's query.

  Query: {{{query}}}`,
});

const quranicGuidanceFlow = ai.defineFlow(
  {
    name: 'quranicGuidanceFlow',
    inputSchema: QuranicGuidanceInputSchema,
    outputSchema: QuranicGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
