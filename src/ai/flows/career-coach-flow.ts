
'use server';
/**
 * @fileOverview An AI agent that provides career coaching.
 *
 * - getCareerAdvice - A function that provides career advice.
 * - CareerAdviceInput - The input type for the getCareerAdvice function.
 * - CareerAdviceOutput - The return type for the getCareerAdvice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const CareerAdviceInputSchema = z.object({
  careerGoal: z.string().describe('The user\'s career goal or question.'),
  experience: z.string().describe('A summary of the user\'s current experience or resume.'),
});
export type CareerAdviceInput = z.infer<typeof CareerAdviceInputSchema>;

export const CareerAdviceOutputSchema = z.object({
  advice: z.string().describe('Actionable career advice and next steps.'),
  resources: z.array(z.string()).describe('A list of recommended resources (articles, courses, etc.).'),
});
export type CareerAdviceOutput = z.infer<typeof CareerAdviceOutputSchema>;

export async function getCareerAdvice(input: CareerAdviceInput): Promise<CareerAdviceOutput> {
  return careerAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerAdvicePrompt',
  input: { schema: CareerAdviceInputSchema },
  output: { schema: CareerAdviceOutputSchema },
  prompt: `You are an expert career coach. Analyze the user's goal and experience to provide actionable advice.

  Goal: {{{careerGoal}}}
  Experience: {{{experience}}}

  Provide specific, actionable steps the user can take. Also, suggest 3-5 relevant online resources like articles, courses, or tools.`,
});

const careerAdviceFlow = ai.defineFlow(
  {
    name: 'careerAdviceFlow',
    inputSchema: CareerAdviceInputSchema,
    outputSchema: CareerAdviceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
