
"use client"

import { useActionState, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"
import { analyzeSkills, type FormState } from "./actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Zap, Trophy, ClipboardCheck, ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"

const initialState: FormState = {
  status: "idle",
  message: "",
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
        <Zap className="mr-2"/>
        Analyze My Skills
        </>
      )}
    </Button>
  )
}

export function SkillGapForm() {
  const [state, formAction] = useActionState(analyzeSkills, initialState)
  const { toast } = useToast()
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.status === "error") {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      })
    }
    if (state.status === "success" && state.data) {
      toast({
        title: "Success!",
        description: "Your skill gap analysis is ready.",
      })
      // Clear old skills and save new ones to local storage
      localStorage.removeItem('missingSkills');
      localStorage.setItem('missingSkills', JSON.stringify(state.data.missingSkills));
      
      // Dispatch a storage event to notify other open tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'missingSkills',
        newValue: JSON.stringify(state.data.missingSkills)
      }));

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }, [state, toast])

  return (
    <>
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Skill Gap Analysis</CardTitle>
            <CardDescription>
              Tell us about your current skills and your career aspirations to get a personalized analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentSkills" className="font-semibold">Your Current Skills & Experience</Label>
              <Textarea
                id="currentSkills"
                name="currentSkills"
                placeholder="e.g., Proficient in Python, React, and SQL. 2 years of experience in data analysis..."
                required
                rows={4}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desiredRole" className="font-semibold">Your Desired Role</Label>
              <Input
                id="desiredRole"
                name="desiredRole"
                placeholder="e.g., Senior Machine Learning Engineer"
                required
                className="text-base"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="careerGoals" className="font-semibold">Your Career Goals (Optional)</Label>
              <Textarea
                id="careerGoals"
                name="careerGoals"
                placeholder="e.g., I want to lead a team of data scientists, or specialize in natural language processing..."
                rows={3}
                className="text-base"
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>

      {state.status === "success" && state.data && (
        <div ref={resultsRef} className="mt-12 space-y-8 animate-in fade-in-50 duration-500">
          <h2 className="text-3xl font-bold font-headline text-center">Your Personalized Skill Development Plan</h2>
          
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-3"><Trophy className="text-primary"/> Identified Skill Gaps</CardTitle>
              <CardDescription>These are the key areas to focus on to bridge the gap between your current profile and your desired role.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-3">
                    {state.data.missingSkills.map((skill) => (
                        <div key={skill} className="flex items-center gap-2 p-2 px-4 bg-background rounded-full border-2 border-primary/30 shadow-sm">
                            <Zap className="h-5 w-5 text-primary" />
                            <span className="font-semibold text-base text-foreground">{skill}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-3"><ClipboardCheck className="text-primary"/> Your Learning Roadmap</CardTitle>
              <CardDescription>Here is a step-by-step plan to help you acquire the necessary skills.</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground/90 prose-headings:font-headline prose-headings:text-foreground prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-strong:text-foreground/90 prose-ul:list-disc prose-li:marker:text-primary">
              <ReactMarkdown>{state.data.learningPlan}</ReactMarkdown>
            </CardContent>
            <CardFooter>
                <Button asChild className="ml-auto">
                    <Link href="/dashboard/daily-learning">
                        <BookOpen className="mr-2"/>
                        Start Your Learning Plan
                        <ArrowRight className="ml-2"/>
                    </Link>
                </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  )
}
