
'use server';
/**
 * @fileOverview Career prediction AI agent that uses a psychometric test to recommend careers.
 *
 * - careerPrediction - A function that handles the career prediction process.
 * - CareerPredictionInput - The input type for the careerPrediction function.
 * - CareerPredictionOutput - The return type for the careerPrediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {Model} from 'genkit/model';

const CareerPredictionInputSchema = z.object({
  answers: z
    .array(z.string())
    .describe('An array of answers from the psychometric test. There are 50 answers in total.'),
  careerAspirations: z
    .string()
    .describe('The careers the student is interested in.'),
});
export type CareerPredictionInput = z.infer<typeof CareerPredictionInputSchema>;

const CareerPredictionOutputSchema = z.object({
  suggestedCareers: z
    .array(z.string())
    .describe('A list of 3-5 careers suggested for the student.'),
  reasoning: z.string().describe('A detailed reasoning (2-3 paragraphs) behind the career suggestions, analyzing the user\'s personality, behavior, interests, and reasoning based on their answers.'),
});
export type CareerPredictionOutput = z.infer<typeof CareerPredictionOutputSchema>;

export async function careerPrediction(input: CareerPredictionInput): Promise<CareerPredictionOutput> {
  return careerPredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerPredictionPrompt',
  input: {schema: CareerPredictionInputSchema},
  output: {schema: CareerPredictionOutputSchema},
  prompt: `You are an expert career counselor and psychometric analyst. Your task is to provide insightful career recommendations to a student based on their answers to a comprehensive 50-question psychometric test.

The test covers the following categories:
- Personality (Questions 1-5)
- Behavior (Questions 6-10)
- Domain Knowledge & Interests (Questions 11-15)
- Reasoning (Questions 16-20)
- Work-Life Balance (Questions 21-25)
- Communication Style (Questions 26-30)
- Leadership Style (Questions 31-35)
- Adaptability (Questions 36-40)
- Values (Questions 41-45)
- Motivation (Questions 46-50)

**Student's Information:**

*   **Psychometric Test Answers:** {{{answers}}}
*   **Stated Career Aspirations:** {{{careerAspirations}}}

**Your Task:**

1.  **Analyze the Answers:** Carefully analyze the student's answers across all categories. Identify key traits, strengths, weaknesses, preferences, and patterns.
2.  **Synthesize Findings:** In the 'reasoning' field, provide a detailed, multi-paragraph analysis.
    *   Start with a summary of the student's overall profile (e.g., "Based on your answers, you appear to be an analytical and introverted individual with a strong interest in technology and a preference for structured work environments...").
    *   Discuss how their personality, behavior, values, and motivations align or misalign with their stated career aspirations.
    *   Explain the logic behind your career suggestions, connecting them directly to specific answers or patterns you observed in the test results.
3.  **Suggest Careers:** Based on your comprehensive analysis, suggest 3 to 5 specific career paths that would be a good fit for the student. These should be listed in the 'suggestedCareers' array.
    *   If the student's aspirations are a good match, include them and explain why.
    *   If their aspirations are not a strong match, gently explain the potential challenges and offer alternative paths that better align with their profile.
    *   Suggest at least one "out-of-the-box" career they might not have considered.

Provide a thoughtful, empowering, and actionable report that will genuinely help the student in their career journey.
`,
});

const fallbackModel: Model = 'googleai/gemini-1.5-flash';

const careerPredictionFlow = ai.defineFlow(
  {
    name: 'careerPredictionFlow',
    inputSchema: CareerPredictionInputSchema,
    outputSchema: CareerPredictionOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.log('Primary model failed, switching to fallback.', error);
      const {output} = await ai.generate({
        model: fallbackModel,
        prompt: prompt.prompt,
        input: input,
        output: {
          schema: CareerPredictionOutputSchema,
        },
      });
      return output!;
    }
  }
);
