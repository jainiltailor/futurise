"use server"

import { careerPrediction, type CareerPredictionInput, type CareerPredictionOutput } from "@/ai/flows/career-prediction"
import { z } from "zod"
import { psychometricQuestions } from "@/lib/constants"

const answersSchema = z.array(z.string().min(1, "Please select an answer.")).min(psychometricQuestions.length, "Please answer all questions.")

const CareerFormSchema = z.object({
  answers: answersSchema,
  careerAspirations: z.string().optional(),
})

export type FormState = {
  status: "success" | "error" | "idle"
  message: string
  data?: CareerPredictionOutput
}

export async function predictCareer(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const answers = psychometricQuestions.map(q => formData.get(q.id) as string)
  const careerAspirations = formData.get("careerAspirations") as string

  const validatedFields = CareerFormSchema.safeParse({ answers, careerAspirations });
  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.issues.map((issue) => issue.message).join(", ");
    return {
      status: "error",
      message: errorMessage || "Please answer all questions before submitting.",
    }
  }

  try {
    const input: CareerPredictionInput = {
      answers: validatedFields.data.answers,
      careerAspirations: validatedFields.data.careerAspirations || "None specified",
    }
    const result = await careerPrediction(input)
    
    return {
      status: "success",
      message: "Prediction successful!",
      data: result,
    }
  } catch (error) {
    console.error("Career prediction failed:", error)
    return {
      status: "error",
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}
