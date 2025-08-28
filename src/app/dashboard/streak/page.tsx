import { TrendingUp, Award, Calendar } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function StreakPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg">
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold font-headline">Streak & Rewards</h1>
            <p className="text-muted-foreground">Track your learning consistency and earn rewards for your dedication.</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">12 days</div>
                <p className="text-xs text-muted-foreground">You're on fire! Keep the momentum going.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">1,250</div>
                <p className="text-xs text-muted-foreground">Redeem points for exclusive content.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">30 days</div>
                <p className="text-xs text-muted-foreground">Your personal best! Can you beat it?</p>
            </CardContent>
        </Card>
      </div>

       <div className="text-center py-20 bg-card rounded-lg border border-dashed">
          <h2 className="text-xl font-semibold text-muted-foreground">Rewards Marketplace Coming Soon</h2>
          <p className="text-muted-foreground mt-2">We are working on a rewards system where you can redeem your points. Stay tuned!</p>
      </div>
    </div>
  )
}
