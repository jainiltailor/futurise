
'use server';
/**
 * @fileOverview Generates personalized learning suggestions.
 *
 * - getLearningSuggestions - A function that returns a list of learning resources.
 * - LearningSuggestionsInput - The input type for the getLearningSuggestions function.
 * - LearningSuggestionsOutput - The return type for the getLearningSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {Model} from 'genkit/model';

const LearningSuggestionsInputSchema = z.object({
  learningGoals: z.string().describe("The user's primary learning objectives for the day or week."),
  topicsOfInterest: z
    .array(z.string())
    .describe('A list of topics the user is interested in learning more about.'),
});
export type LearningSuggestionsInput = z.infer<typeof LearningSuggestionsInputSchema>;

const LearningSuggestionSchema = z.object({
    title: z.string().describe('The title of the learning resource.'),
    description: z.string().describe('A brief, one-sentence summary of what the resource is about.'),
    type: z.enum(['Article', 'Video', 'Course', 'Book', 'Podcast']).describe('The type of the learning resource.'),
    url: z.string().url().describe('A URL to the learning resource. This should be a real, accessible URL.'),
    estimatedTime: z.string().describe('An estimated time to complete the resource (e.g., "15 min read", "1 hour video").'),
});

const LearningSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(LearningSuggestionSchema)
    .describe('A list of 5-7 personalized learning suggestions.'),
});
export type LearningSuggestionsOutput = z.infer<typeof LearningSuggestionsOutputSchema>;

export async function getLearningSuggestions(input: LearningSuggestionsInput): Promise<LearningSuggestionsOutput> {
  return getLearningSuggestionsFlow(input);
}

const learningSystemPrompt = `You are an expert curriculum designer and learning assistant. Your task is to create a personalized list of 5-7 learning resources for a user based on their goals and interests.

**User's Information:**

*   **Learning Goals:** {{{learningGoals}}}
*   **Topics of Interest:** {{{topicsOfInterest}}}

**Your Task:**

1.  **Analyze Input:** Understand the user's goals and interests.
2.  **Generate Suggestions:** Find a variety of high-quality, real-world learning resources (articles, videos, courses, books, podcasts) that align with the user's input.
3.  **Format Output:** For each suggestion, you MUST provide:
    *   A clear and concise \`title\`.
    *   A one-sentence \`description\`.
    *   The \`type\` of resource (must be one of: 'Article', 'Video', 'Course', 'Book', 'Podcast').
    *   A real, valid, and accessible \`url\`.
    *   An \`estimatedTime\` to consume the resource (e.g., "15 min read", "1 hour video").
4.  **Ensure Variety:** Provide a mix of resource types to keep the learning experience engaging.
5.  **CRITICAL:** You must strictly adhere to the output schema and not generate any extra fields or properties. The final output must be a valid JSON object matching the requested schema.
`;

const prompt = ai.definePrompt({
  name: 'learningSuggestionsPrompt',
  input: {schema: LearningSuggestionsInputSchema},
  output: {schema: LearningSuggestionsOutputSchema},
  prompt: learningSystemPrompt,
});

const fallbackModel: Model = 'googleai/gemini-1.5-flash';

const getLearningSuggestionsFlow = ai.defineFlow(
  {
    name: 'getLearningSuggestionsFlow',
    inputSchema: LearningSuggestionsInputSchema,
    outputSchema: LearningSuggestionsOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.log('Primary model failed, switching to fallback.', error);
      const {output} = await ai.generate({
        model: fallbackModel,
        prompt: learningSystemPrompt,
        input: input,
        output: {
          schema: LearningSuggestionsOutputSchema,
        },
      });
      return output!;
    }
  }
);
