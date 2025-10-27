
'use server';
/**
 * @fileOverview An AI agent that creates fitness plans.
 *
 * - getFitnessPlan - A function that creates a fitness plan.
 * - FitnessPlanInput - The input type for the getFitnessPlan function.
 * - FitnessPlanOutput - The return type for the getFitnessPlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const FitnessPlanInputSchema = z.object({
  fitnessGoal: z.string().describe('The user\'s primary fitness goal (e.g., "lose weight", "build muscle").'),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']).describe('The user\'s current fitness level.'),
  daysPerWeek: z.number().min(1).max(7).describe('How many days per week the user can work out.'),
  availableEquipment: z.string().describe('A list of available equipment (e.g., "dumbbells, yoga mat", "full gym", "none").'),
});
export type FitnessPlanInput = z.infer<typeof FitnessPlanInputSchema>;

export const FitnessPlanOutputSchema = z.object({
  weeklyPlan: z.string().describe('A structured, detailed weekly workout plan, including specific exercises, sets, reps, and rest periods for each day.'),
  dietaryTips: z.array(z.string()).describe('A list of general dietary tips and meal suggestions to support the fitness goal.'),
});
export type FitnessPlanOutput = z.infer<typeof FitnessPlanOutputSchema>;

export async function getFitnessPlan(input: FitnessPlanInput): Promise<FitnessPlanOutput> {
  return fitnessPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fitnessPlanPrompt',
  input: { schema: FitnessPlanInputSchema },
  output: { schema: FitnessPlanOutputSchema },
  prompt: `You are an expert fitness trainer. Create a personalized and detailed weekly workout plan based on the user's profile.

  Goal: {{{fitnessGoal}}}
  Level: {{{fitnessLevel}}}
  Days per Week: {{{daysPerWeek}}}
  Equipment: {{{availableEquipment}}}

  Provide a structured, day-by-day weekly workout schedule. For each workout day, list specific exercises with the number of sets, reps, and recommended rest times. Include warm-up and cool-down routines.
  Also, provide 3-5 actionable dietary tips and example meal ideas to complement the workout plan. Format the output clearly.`,
});

const fitnessPlanFlow = ai.defineFlow(
  {
    name: 'fitnessPlanFlow',
    inputSchema: FitnessPlanInputSchema,
    outputSchema: FitnessPlanOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
