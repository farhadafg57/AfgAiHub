'use server';
/**
 * @fileOverview A Genkit flow for processing successful payment transactions.
 *
 * - processPayment - A function that takes payment details and returns a summary.
 * - ProcessPaymentInput - The input type for the processPayment function.
 * - ProcessPaymentOutput - The return type for the processPayment function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
});

const ProcessPaymentInputSchema = z.object({
  sessionId: z.string().describe('The unique identifier for the payment session.'),
  userId: z.string().optional().describe('The ID of the user who made the payment.'),
  email: z.string().optional().describe('The email of the user.'),
  items: z.array(ItemSchema).describe('The items purchased.'),
  totalAmount: z.number().describe('The total amount of the transaction.'),
});
export type ProcessPaymentInput = z.infer<typeof ProcessPaymentInputSchema>;

const ProcessPaymentOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the processed transaction.'),
});
export type ProcessPaymentOutput = z.infer<typeof ProcessPaymentOutputSchema>;

export async function processPayment(
  input: ProcessPaymentInput
): Promise<ProcessPaymentOutput> {
  return processPaymentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processPaymentPrompt',
  input: { schema: ProcessPaymentInputSchema },
  output: { schema: ProcessPaymentOutputSchema },
  prompt: `You are an AI assistant for a merchant dashboard. 
  Summarize the following successful transaction in a single, concise sentence.
  
  Session ID: {{{sessionId}}}
  User ID: {{{userId}}}
  User Email: {{{email}}}
  Total Amount: {{{totalAmount}}} AFN
  
  Generate a summary suitable for a log or notification. Example: 'Payment of 1000 AFN from user jane.doe@example.com (ID: xyz) for 2 items was successful.'`,
});

const processPaymentFlow = ai.defineFlow(
  {
    name: 'processPaymentFlow',
    inputSchema: ProcessPaymentInputSchema,
    outputSchema: ProcessPaymentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    // In a real scenario, you would trigger other actions here,
    // like sending notifications or calling distributePaymentToVendors.
    console.log('Payment Summary:', output?.summary);
    return output!;
  }
);
