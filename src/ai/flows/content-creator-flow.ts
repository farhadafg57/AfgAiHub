
'use server';
/**
 * @fileOverview An AI agent that helps with content creation.
 *
 * - getContentIdeas - A function that generates content ideas and a draft.
 * - ContentCreatorInput - The input type for the getContentIdeas function.
 * - ContentCreatorOutput - The return type for the getContentIdeas function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const ContentCreatorInputSchema = z.object({
  topic: z.string().describe('The central topic for content creation.'),
  contentType: z.enum(['blog_post', 'tweet_thread', 'video_script']).describe('The desired content format.'),
  targetAudience: z.string().describe('The target audience for the content.'),
});
export type ContentCreatorInput = z.infer<typeof ContentCreatorInputSchema>;

export const ContentCreatorOutputSchema = z.object({
  ideas: z.array(z.string()).describe('A list of 3-5 content ideas or titles.'),
  draft: z.string().describe('A draft of the content for one of the generated ideas.'),
});
export type ContentCreatorOutput = z.infer<typeof ContentCreatorOutputSchema>;

export async function getContentIdeas(input: ContentCreatorInput): Promise<ContentCreatorOutput> {
  return contentCreatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentCreatorPrompt',
  input: { schema: ContentCreatorInputSchema },
  output: { schema: ContentCreatorOutputSchema },
  prompt: `You are a creative content strategist. Generate content ideas and a sample draft based on the user's request.

  Topic: {{{topic}}}
  Content Type: {{{contentType}}}
  Target Audience: {{{targetAudience}}}

  First, generate 3-5 compelling ideas or headlines. Then, choose the most promising idea and write a starter draft for it.`,
});

const contentCreatorFlow = ai.defineFlow(
  {
    name: 'contentCreatorFlow',
    inputSchema: ContentCreatorInputSchema,
    outputSchema: ContentCreatorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
