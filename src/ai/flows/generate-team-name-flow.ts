'use server';
/**
 * @fileOverview A flow for generating creative team names.
 *
 * - generateTeamName - A function that generates a space-themed team name.
 * - GenerateTeamNameInput - The input type for the generateTeamName function.
 * - GenerateTeamNameOutput - The return type for the generateTeamName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTeamNameInputSchema = z.object({
  topic: z.string().optional().describe('An optional topic to base the name on.'),
});
export type GenerateTeamNameInput = z.infer<typeof GenerateTeamNameInputSchema>;

const GenerateTeamNameOutputSchema = z.object({
  teamName: z.string().describe('A creative, space-themed team name.'),
});
export type GenerateTeamNameOutput = z.infer<typeof GenerateTeamNameOutputSchema>;

export async function generateTeamName(input: GenerateTeamNameInput): Promise<GenerateTeamNameOutput> {
  return generateTeamNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTeamNamePrompt',
  input: {schema: GenerateTeamNameInputSchema},
  output: {schema: GenerateTeamNameOutputSchema},
  prompt: `You are a creative assistant for the NASA International Space Apps Challenge. Your task is to generate a cool, creative, and memorable team name. The name should be space-themed, inspiring, and suitable for a hackathon.
{{#if topic}}
Base the name around the topic of: {{{topic}}}
{{/if}}
Do not use colons or other special characters that are not allowed in team names. Be creative!
`,
});

const generateTeamNameFlow = ai.defineFlow(
  {
    name: 'generateTeamNameFlow',
    inputSchema: GenerateTeamNameInputSchema,
    outputSchema: GenerateTeamNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
