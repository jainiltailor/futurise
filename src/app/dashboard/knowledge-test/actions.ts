
"use server"

import { generateTest, evaluateTest, type GenerateTestInput, type Test, type EvaluateTestInput, type EvaluateTestOutput } from "@/ai/flows/knowledge-test"
import { z } from "zod"

const generateTestSchema = z.object({
  topic: z.string().min(3, "Please enter a topic."),
})

export type GenerateState = {
  status: "success" | "error" | "idle"
  message: string
  data?: Test
}

export async function generateQuiz(
  prevState: GenerateState,
  formData: FormData
): Promise<GenerateState> {
  const validatedFields = generateTestSchema.safeParse({ topic: formData.get("topic") });
  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.issues.map((issue) => issue.message).join(", ");
    return {
      status: "error",
      message: errorMessage || "Please provide a valid topic.",
    }
  }

  try {
    const input: GenerateTestInput = { topic: validatedFields.data.topic }
    const result = await generateTest(input)
    
    return {
      status: "success",
      message: "Quiz generated successfully!",
      data: result,
    }
  } catch (error) {
    console.error("Quiz generation failed:", error)
    return {
      status: "error",
      message: "An unexpected error occurred while generating the quiz. Please try again later.",
    }
  }
}

export type EvaluateState = {
    status: "success" | "error" | "idle"
    message: string
    data?: EvaluateTestOutput
}

export async function submitAnswers(prevState: EvaluateState, formData: FormData): Promise<EvaluateState> {
    // Handle the dummy request to reset state
    if (formData.get('reset') === 'true') {
        return { status: 'idle', message: '' };
    }

    const answersData = formData.get("answers");
    if (!answersData) {
        return { status: 'error', message: 'No answers provided.' };
    }
    
    const questionsData = formData.get("questions");
    if (!questionsData) {
        return { status: 'error', message: 'No questions provided.' };
    }

    try {
        const userAnswers = JSON.parse(answersData as string);
        const questions = JSON.parse(questionsData as string);

        const input: EvaluateTestInput = { questions, userAnswers };
        const result = await evaluateTest(input);
        return {
            status: "success",
            message: "Quiz submitted and evaluated!",
            data: result,
        }
    } catch (error) {
        console.error("Quiz evaluation failed:", error)
        return {
            status: "error",
            message: "An unexpected error occurred during evaluation. Please try again.",
        }
    }
}
