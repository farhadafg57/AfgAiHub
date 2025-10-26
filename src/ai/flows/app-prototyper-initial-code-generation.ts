'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating initial code snippets for an application based on a textual description provided by the user.
 *
 * - `generateInitialCode` - An async function that takes a textual description of an application and returns initial code snippets.
 * - `AppPrototyperInput` - The input type for the `generateInitialCode` function, which is a textual description of the application.
 * - `AppPrototyperOutput` - The output type for the `generateInitialCode` function, which is the generated initial code snippets.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AppPrototyperInputSchema = z.object({
  description: z.string().describe('A textual description of the application.'),
});
export type AppPrototyperInput = z.infer<typeof AppPrototyperInputSchema>;

const AppPrototyperOutputSchema = z.object({
  codeSnippets: z.string().describe('The generated initial code snippets for the application.'),
});
export type AppPrototyperOutput = z.infer<typeof AppPrototyperOutputSchema>;

export async function generateInitialCode(input: AppPrototyperInput): Promise<AppPrototyperOutput> {
  return appPrototyperFlow(input);
}

const appPrototyperPrompt = ai.definePrompt({
  name: 'appPrototyperPrompt',
  input: {schema: AppPrototyperInputSchema},
  output: {schema: AppPrototyperOutputSchema},
  prompt: `You are an AI agent that generates initial code snippets for applications based on a textual description provided by the user.

  Generate the initial code snippets based on the following description:
  {{{description}}}
  `,
});

const appPrototyperFlow = ai.defineFlow(
  {
    name: 'appPrototyperFlow',
    inputSchema: AppPrototyperInputSchema,
    outputSchema: AppPrototyperOutputSchema,
  },
  async input => {
    const {output} = await appPrototyperPrompt(input);
    return output!;
  }
);
