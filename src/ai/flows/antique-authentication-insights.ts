'use server';

/**
 * @fileOverview Provides authentication insights for antiques based on an image.
 *
 * - authenticateAntique - A function that takes an image of an antique and returns authentication insights.
 * - AuthenticateAntiqueInput - The input type for the authenticateAntique function.
 * - AuthenticateAntiqueOutput - The return type for the authenticateAntique function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AuthenticateAntiqueInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the antique, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  additionalDetails: z
    .string()
    .optional()
    .describe('Any additional details about the antique.'),
});
export type AuthenticateAntiqueInput = z.infer<typeof AuthenticateAntiqueInputSchema>;

const AuthenticateAntiqueOutputSchema = z.object({
  authenticityAssessment: z.string().describe('An assessment of the antique\'s authenticity.'),
  keyFeatures: z
    .string()

    .describe('Key features observed in the image that contribute to the assessment.'),
  potentialValue: z
    .string()
    .describe('An estimate of the antique\'s potential value, if authentic.'),
});
export type AuthenticateAntiqueOutput = z.infer<typeof AuthenticateAntiqueOutputSchema>;

export async function authenticateAntique(input: AuthenticateAntiqueInput): Promise<AuthenticateAntiqueOutput> {
  return authenticateAntiqueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'authenticateAntiquePrompt',
  input: {schema: AuthenticateAntiqueInputSchema},
  output: {schema: AuthenticateAntiqueOutputSchema},
  prompt: `You are an expert antique authenticator. Analyze the provided image and details to assess the antique\'s authenticity and potential value.\n\nImage: {{media url=photoDataUri}}\n\nAdditional Details: {{{additionalDetails}}}\n\nProvide a detailed authenticity assessment, highlighting key features that support your analysis and an estimated potential value if the item is genuine.`,
});

const authenticateAntiqueFlow = ai.defineFlow(
  {
    name: 'authenticateAntiqueFlow',
    inputSchema: AuthenticateAntiqueInputSchema,
    outputSchema: AuthenticateAntiqueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
