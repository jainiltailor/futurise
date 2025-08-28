
"use client"

import { useActionState, useEffect, useRef, useState, useTransition } from "react"
import { generateLearningPlan, type FormState } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowRight, Book, Video, Rss, Mic, FileText, Clock, AlertTriangle, Target, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const initialState: FormState = {
  status: "idle",
  message: "",
}

const typeIconMap = {
  Article: <FileText className="h-5 w-5 text-primary" />,
  Video: <Video className="h-5 w-5 text-primary" />,
  Course: <Book className="h-5 w-5 text-primary" />,
  Book: <Book className="h-5 w-5 text-primary" />,
  Podcast: <Mic className="h-5 w-5 text-primary" />,
}

export function LearningPlan() {
  const [state, formAction] = useActionState(generateLearningPlan, initialState)
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast()
  const [skills, setSkills] = useState<string[] | null>(null)

  const fetchSkillsAndGeneratePlan = () => {
    try {
      const storedSkills = localStorage.getItem('missingSkills');
      if (storedSkills) {
        const parsedSkills = JSON.parse(storedSkills);
        setSkills(parsedSkills);
        
        startTransition(() => {
            const formData = new FormData();
            formData.append('learningGoals', 'To bridge my skill gaps for my desired career.');
            formData.append('topicsOfInterest', parsedSkills.join(', '));
            formAction(formData);
        });
      } else {
        setSkills([]); // Set to empty array if no skills found
      }
    } catch (error) {
        console.error("Failed to parse skills from local storage", error);
        setSkills([]);
    }
  };

  useEffect(() => {
    fetchSkillsAndGeneratePlan();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'missingSkills') {
        fetchSkillsAndGeneratePlan();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.status === "error") {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      })
    }
  }, [state, toast])

  if (skills === null || isPending) {
    return (
        <Card className="flex flex-col items-center justify-center p-10 text-center min-h-[400px]">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Generating your personalized learning plan...</p>
            <p className="text-sm text-muted-foreground/80">Our AI is curating the best resources for you.</p>
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
                    To get personalized learning suggestions, you first need to identify your skill gaps.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Head over to the Skill Gap Analyzer, tell us about your goals, and we'll create a tailored plan for you to follow.
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
    <>
      {state.status === "success" && state.data && (
        <div className="space-y-8">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline text-2xl">Your Learning Focus</CardTitle>
                  <CardDescription>This plan is based on the following skill gaps we identified for you:</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                  {skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="text-base py-1 px-3 border-2 border-transparent">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-400"/>
                          {skill}
                      </Badge>
                  ))}
              </CardContent>
          </Card>

          <h2 className="text-3xl font-bold font-headline text-center">Your Personalized Learning Plan</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {state.data.suggestions.map((suggestion, index) => (
              <Card key={index} className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                           {typeIconMap[suggestion.type] || <Rss className="h-5 w-5 text-primary" />}
                        </div>
                        <div>
                            <Badge variant="outline" className="mb-2">{suggestion.type}</Badge>
                            <CardTitle className="font-headline text-lg leading-tight">{suggestion.title}</CardTitle>
                        </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <CardDescription>{suggestion.description}</CardDescription>
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4"/>
                        <span>{suggestion.estimatedTime}</span>
                    </div>
                    <Button variant="outline" size="sm" asChild className="w-full">
                        <Link href={suggestion.url} target="_blank" rel="noopener noreferrer">
                            Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
       {state.status === "error" && (
            <Card className="flex flex-col items-center justify-center p-10 text-center min-h-[400px]">
                <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
                <p className="text-destructive font-semibold text-xl">Oops! Something went wrong.</p>
                <p className="text-muted-foreground mt-2">{state.message}</p>
            </Card>
       )}
    </>
  )
}
