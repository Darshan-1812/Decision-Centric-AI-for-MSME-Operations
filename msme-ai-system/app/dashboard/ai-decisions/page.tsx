import { getAIDecisions } from "@/lib/actions"
import { AIDecisionCard } from "@/components/dashboard/ai-decision-card"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain } from "lucide-react"

export default async function AIDecisionsPage() {
  const decisions = await getAIDecisions()
  
  const pendingDecisions = decisions.filter(d => d.status === 'pending')
  const approvedDecisions = decisions.filter(d => d.status === 'approved')
  const rejectedDecisions = decisions.filter(d => d.status === 'rejected')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Decisions</h1>
        <p className="text-muted-foreground">
          Review and approve AI agent recommendations
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingDecisions.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedDecisions.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedDecisions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pendingDecisions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Brain className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No pending decisions</p>
                <p className="text-xs text-muted-foreground mt-1">
                  AI agents will suggest optimizations here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingDecisions.map((decision) => (
                <AIDecisionCard key={decision.id} decision={decision} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved">
          {approvedDecisions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">No approved decisions yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {approvedDecisions.map((decision) => (
                <AIDecisionCard key={decision.id} decision={decision} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected">
          {rejectedDecisions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">No rejected decisions</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rejectedDecisions.map((decision) => (
                <AIDecisionCard key={decision.id} decision={decision} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
