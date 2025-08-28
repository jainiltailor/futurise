"use server"

import { skillGapAnalysis, type SkillGapAnalysisInput, type SkillGapAnalysisOutput } from "@/ai/flows/skill-gap-analyzer"
import { z } from "zod"

const SkillGapFormSchema = z.object({
  currentSkills: z.string().min(10, "Please provide more detail about your skills."),
  desiredRole: z.string().min(3, "Please enter your desired role."),
  careerGoals: z.string().optional(),
})

export type FormState = {
  status: "success" | "error" | "idle"
  message: string
  data?: SkillGapAnalysisOutput
}

export async function analyzeSkills(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = SkillGapFormSchema.safeParse({
    currentSkills: formData.get("currentSkills"),
    desiredRole: formData.get("desiredRole"),
    careerGoals: formData.get("careerGoals"),
  })

  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.issues.map((issue) => issue.message).join(", ")
    return {
      status: "error",
      message: errorMessage || "Please fill in all required fields.",
    }
  }

  try {
    const input: SkillGapAnalysisInput = {
      currentSkills: validatedFields.data.currentSkills,
      desiredRole: validatedFields.data.desiredRole,
      careerGoals: validatedFields.data.careerGoals || "Not specified",
    }
    const result = await skillGapAnalysis(input)
    
    return {
      status: "success",
      message: "Analysis successful!",
      data: result,
    }
  } catch (error) {
    console.error("Skill gap analysis failed:", error)
    return {
      status: "error",
      message: "An unexpected AI error occurred. Please try again later.",
    }
  }
}
