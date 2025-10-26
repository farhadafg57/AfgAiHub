'use server';

import {
  processPayment as processPaymentFlow,
  ProcessPaymentInput,
  ProcessPaymentOutput,
} from '@/ai/flows/process-payment-flow';

export async function processPayment(
  input: ProcessPaymentInput
): Promise<ProcessPaymentOutput> {
  return processPaymentFlow(input);
}
