import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, BookOpen, Award, BarChart3, ArrowRight, Target, BrainCircuit } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">Welcome Back!</h1>
        <p className="text-muted-foreground text-lg">Here's your progress summary for today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12 days</div>
            <p className="text-xs text-muted-foreground">Keep it up! Consistency is key.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rewards Earned</CardTitle>
            <Award className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,250 pts</div>
            <p className="text-xs text-muted-foreground">+200 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">75%</div>
            <Progress value={75} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Learning</CardTitle>
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5 Modules</div>
            <p className="text-xs text-muted-foreground">Completed this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-2 bg-primary/10 border-primary/20">
              <CardHeader>
                  <CardTitle className="font-headline text-2xl">Start Your Journey Here</CardTitle>
                  <CardDescription className="text-muted-foreground">Identify your skills gaps to get a personalized learning plan.</CardDescription>
              </CardHeader>
              <CardContent>
                  <p className="text-muted-foreground mb-6">Analyze your current skillset against your desired career path. Our AI will generate a tailored roadmap to help you bridge the gap and achieve your goals.</p>
                  <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/dashboard/skill-gap">
                        <Target className="mr-2"/>
                        Analyze My Skills
                    </Link>
                  </Button>
              </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline">Career Prediction</CardTitle>
                <CardDescription>Unsure about your path?</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-4">Take our psychometric test to discover careers that match your personality.</p>
            </CardContent>
            <CardFooter>
                <Button variant="outline" asChild className="w-full">
                    <Link href="/dashboard/career-prediction">
                        <BrainCircuit className="mr-2"/>
                        Take the Test
                    </Link>
                </Button>
            </CardFooter>
          </Card>
      </div>
    </div>
  )
}
