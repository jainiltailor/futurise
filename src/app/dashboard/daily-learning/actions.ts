
"use server"

import { getLearningSuggestions, type LearningSuggestionsInput, type LearningSuggestionsOutput } from "@/ai/flows/daily-learning"
import { z } from "zod"

const LearningFormSchema = z.object({
  learningGoals: z.string().min(1, "Please enter your learning goals."),
  topicsOfInterest: z.string().min(1, "Please enter at least one topic of interest."),
})

export type FormState = {
  status: "success" | "error" | "idle"
  message: string
  data?: LearningSuggestionsOutput
}

export async function generateLearningPlan(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = LearningFormSchema.safeParse({
    learningGoals: formData.get("learningGoals"),
    topicsOfInterest: formData.get("topicsOfInterest"),
  })

  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.issues.map((issue) => issue.message).join(", ")
    return {
      status: "error",
      message: errorMessage || "Please fill in all required fields.",
    }
  }
  
  const topics = validatedFields.data.topicsOfInterest.split(',').map(topic => topic.trim());

  try {
    const input: LearningSuggestionsInput = {
      learningGoals: validatedFields.data.learningGoals,
      topicsOfInterest: topics,
    }
    const result = await getLearningSuggestions(input)
    
    return {
      status: "success",
      message: "Learning plan generated!",
      data: result,
    }
  } catch (error) {
    console.error("Daily learning suggestion failed:", error)
    return {
      status: "error",
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}
