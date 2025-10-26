'use server';

import {
  processPayment,
  ProcessPaymentInput,
  ProcessPaymentOutput,
} from '@/ai/flows/process-payment-flow';

export async function processPaymentAction(
  input: ProcessPaymentInput
): Promise<ProcessPaymentOutput> {
  console.log('Processing payment action for session:', input.sessionId);
  return processPayment(input);
}
