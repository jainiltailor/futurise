
"use client"

import { useActionState, useEffect, useState, useRef } from "react"
import { useFormStatus } from "react-dom"
import { generateQuiz, submitAnswers, type GenerateState, type EvaluateState } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Loader2, HelpCircle, Check, X, Award, BarChart, AlertTriangle, Target, TestTube, ArrowRight } from "lucide-react"
import type { Test } from "@/ai/flows/knowledge-test"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const initialGenerateState: GenerateState = { status: "idle", message: "" }
const initialEvaluateState: EvaluateState = { status: "idle", message: "" }

function GenerateButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Quiz...
        </>
      ) : (
        <>
        <TestTube className="mr-2"/>
        Generate Quiz
        </>
      )}
    </Button>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
        </>
      ) : (
        "Submit Answers"
      )}
    </Button>
  )
}

export function KnowledgeTest() {
  const [generateState, generateAction] = useActionState(generateQuiz, initialGenerateState)
  const [evaluateState, evaluateAction] = useActionState(submitAnswers, initialEvaluateState)
  
  const { toast } = useToast()
  const [quiz, setQuiz] = useState<Test | null>(null)
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null)
  const quizRef = useRef<HTMLDivElement>(null)
  const [skills, setSkills] = useState<string[] | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const handleAnswerChange = (questionIndex: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = value;
    setUserAnswers(newAnswers);
  };
  
  const fetchSkills = () => {
      try {
        const storedSkills = localStorage.getItem('missingSkills');
        if (storedSkills) {
          setSkills(JSON.parse(storedSkills));
        } else {
          setSkills([]);
        }
      } catch (error) {
        console.error("Failed to parse skills from local storage", error);
        setSkills([]);
      }
  };

  useEffect(() => {
    fetchSkills();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'missingSkills') {
        fetchSkills();
        setQuiz(null); // Reset quiz if skills change
        setSelectedTopic(""); // Reset selected topic
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (generateState.status === "error") {
      toast({ title: "Error", description: generateState.message, variant: "destructive" })
    }
    if (generateState.status === "success" && generateState.data) {
      setQuiz(generateState.data)
      setUserAnswers(new Array(generateState.data.questions.length).fill(""));
      
      // Reset the evaluation state by calling the action with a reset flag
      if (evaluateState.status !== 'idle') {
          const formData = new FormData();
          formData.append('reset', 'true');
          evaluateAction(formData);
      }

      toast({ title: "Success!", description: "Your quiz is ready." })
      setTimeout(() => quizRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateState, toast]);

  useEffect(() => {
    if (evaluateState.status === "error") {
      toast({ title: "Error", description: evaluateState.message, variant: "destructive" })
    }
    if (evaluateState.status === "success" && evaluateState.data) {
      toast({ title: "Quiz Submitted!", description: "Your results are in." })
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [evaluateState, toast])
  
  if (skills === null) {
      return (
        <Card className="flex flex-col items-center justify-center p-10 text-center min-h-[400px]">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Loading your skill data...</p>
        </Card>
    );
  }

  if (skills.length === 0) {
      return (
        <Card className="text-center">
            <CardHeader>
                 <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <Target className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4 text-2xl">
                    Start with Skill Gap Analysis
                </CardTitle>
                <CardDescription className="text-base">
                    To generate a relevant quiz, you first need to identify your skill gaps.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Head over to the Skill Gap Analyzer, tell us about your goals, and we'll create a plan for you.
                </p>
                <Button asChild>
                    <Link href="/dashboard/skill-gap">
                        Analyze My Skills <ArrowRight className="ml-2"/>
                    </Link>
                </Button>
            </CardContent>
        </Card>
      )
  }

  return (
    <div className="space-y-12">
      <form action={generateAction}>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Create a Knowledge Test</CardTitle>
            <CardDescription>Select one of your identified skill gaps to generate a custom quiz and test your knowledge.</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="topic">Topic</Label>
            <Select name="topic" required value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="text-base">
                    <SelectValue placeholder="Select a skill to test..." />
                </SelectTrigger>
                <SelectContent>
                    {skills.map(skill => (
                        <SelectItem key={skill} value={skill} className="text-base">{skill}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </CardContent>
          <CardFooter>
            <GenerateButton />
          </CardFooter>
        </Card>
      </form>

      {quiz && generateState.status === 'success' && (
        <div ref={quizRef} className="animate-in fade-in-50 duration-500">
            <form action={evaluateAction}>
                <input type="hidden" name="questions" value={JSON.stringify(quiz.questions)} />
                <input type="hidden" name="answers" value={JSON.stringify(userAnswers)} />
                <Card>
                    <CardHeader className="bg-muted/30">
                        <CardTitle className="font-headline text-xl">Quiz on: {quiz.topic}</CardTitle>
                        <CardDescription>Answer the following questions to the best of your ability.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 p-6">
                        {quiz.questions.map((q, index) => (
                            <div key={index}>
                                <Label className="text-base font-medium flex gap-3"><HelpCircle className="mt-1 h-5 w-5 text-primary shrink-0" /><span>{index + 1}. {q.questionText}</span></Label>
                                <RadioGroup 
                                  name={`answer_${index}`} 
                                  className="mt-4 space-y-3 pl-8" 
                                  required 
                                  value={userAnswers[index]}
                                  onValueChange={(value) => handleAnswerChange(index, value)}
                                >
                                    {q.options.map((opt, optIndex) => (
                                    <div key={optIndex} className="flex items-center space-x-3">
                                        <RadioGroupItem value={opt} id={`q${index}-opt${optIndex}`} />
                                        <Label htmlFor={`q${index}-opt${optIndex}`} className="font-normal text-muted-foreground hover:text-foreground cursor-pointer">{opt}</Label>
                                    </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="bg-muted/30 p-6">
                        <SubmitButton />
                    </CardFooter>
                </Card>
            </form>
        </div>
      )}

      {evaluateState.status === "success" && evaluateState.data && (
        <div ref={resultsRef} className="mt-12 space-y-8 animate-in fade-in-50 duration-500">
          <h2 className="text-3xl font-bold font-headline text-center">Your Quiz Results</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><BarChart className="text-primary"/>Your Score</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-7xl font-bold">{evaluateState.data.score}<span className="text-3xl text-muted-foreground">/{evaluateState.data.total}</span></p>
                    <p className="text-xl text-muted-foreground mt-2">Correct Answers</p>
                </CardContent>
            </Card>
            <Card>
              <CardContent className="bg-muted/30">
                  <CardTitle className="font-headline flex items-center gap-2"><Award className="text-primary"/>AI Feedback</CardTitle>
              </CardContent>
              <CardContent>
                  <p className="text-muted-foreground text-base">{evaluateState.data.feedback}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
