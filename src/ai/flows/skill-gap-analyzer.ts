
'use server';
/**
 * @fileOverview A skill gap analysis AI agent.
 *
 * - skillGapAnalysis - A function that analyzes skill gaps for a desired career.
 * - SkillGapAnalysisInput - The input type for the skillGapAnalysis function.
 * - SkillGapAnalysisOutput - The return type for the skillGapAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {Model} from 'genkit/model';

const SkillGapAnalysisInputSchema = z.object({
  currentSkills: z.string().describe("A description of the user's current skills, experience, and qualifications."),
  desiredRole: z.string().describe('The specific job role or career the user is aspiring to achieve.'),
  careerGoals: z.string().describe("Any additional context about the user's long-term career goals."),
});
export type SkillGapAnalysisInput = z.infer<typeof SkillGapAnalysisInputSchema>;

const SkillGapAnalysisOutputSchema = z.object({
  missingSkills: z
    .array(z.string())
    .describe('A list of 5-8 crucial skills or knowledge areas the user is missing for their desired role.'),
  learningPlan: z.string().describe('A detailed, actionable, and encouraging step-by-step learning plan (3-5 steps) to acquire the missing skills. It MUST be formatted as Markdown with "###" for headings and "-" for bullet points.'),
});
export type SkillGapAnalysisOutput = z.infer<typeof SkillGapAnalysisOutputSchema>;

export async function skillGapAnalysis(input: SkillGapAnalysisInput): Promise<SkillGapAnalysisOutput> {
  return skillGapAnalysisFlow(input);
}

const skillGapAnalysisSystemPrompt = `
You are an expert career coach and talent development specialist. Your task is to provide a detailed skill gap analysis for a user aspiring to a new role.

Analyze the user's current skills, desired role, and career goals to identify the most critical skills they are missing. Then, create a step-by-step learning plan to help them acquire these skills.

**User's Information:**

*   **Current Skills & Experience:** {{{currentSkills}}}
*   **Desired Role:** {{{desiredRole}}}
*   **Career Goals:** {{{careerGoals}}}

**Your Instructions:**

1.  **Identify Missing Skills:**
    *   Compare the user's skills with the requirements of the desired role.
    *   List 5-8 of the most important **missing skills**. These should be specific and actionable (e.g., "Advanced Python for Machine Learning" instead of just "Python").

2.  **Create a Learning Plan:**
    *   Develop a 3-5 step learning plan to acquire the missing skills.
    *   The plan should be encouraging and provide a logical progression.
    *   Suggest specific types of resources for each step (e.g., online courses, projects, certifications).
    *   **CRITICAL FORMATTING:** The 'learningPlan' must be formatted using Markdown. Use "### " for each step's heading and "- " for bullet points. For example:
        \`\`\`markdown
        ### Step 1: Master Foundational Concepts
        - Enroll in an online course on Coursera or edX covering the basics.
        - Read the book "..." to build a strong theoretical foundation.

        ### Step 2: Build Practical Skills
        - Complete 2-3 hands-on projects on GitHub.
        - Contribute to an open-source project in this domain.
        \`\`\`

Provide a practical and motivational report that empowers the user to take the next steps in their career journey.
`;

const prompt = ai.definePrompt({
  name: 'skillGapAnalysisPrompt',
  input: {schema: SkillGapAnalysisInputSchema},
  output: {schema: SkillGapAnalysisOutputSchema},
  prompt: skillGapAnalysisSystemPrompt,
});

const fallbackModel: Model = 'googleai/gemini-1.5-flash';

const skillGapAnalysisFlow = ai.defineFlow(
  {
    name: 'skillGapAnalysisFlow',
    inputSchema: SkillGapAnalysisInputSchema,
    outputSchema: SkillGapAnalysisOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.log('Primary model failed, switching to fallback.', error);
      const {output} = await ai.generate({
        model: fallbackModel,
        prompt: skillGapAnalysisSystemPrompt,
        input: input,
        output: {
          schema: SkillGapAnalysisOutputSchema,
        },
      });
      return output!;
    }
  }
);
