import { TestTube } from "lucide-react"
import { KnowledgeTest } from "./knowledge-test"

export default function KnowledgeTestPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg">
          <TestTube className="h-6 w-6 text-primary" />
        </div>
        <div>
            <h1 className="text-3xl font-bold font-headline">Knowledge Test</h1>
            <p className="text-muted-foreground">Test your skills with quizzes based on your learning goals.</p>
        </div>
      </div>
      <KnowledgeTest />
    </div>
  )
}
