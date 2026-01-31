'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Brain, Zap, Package, Users, Briefcase, FolderKanban, UserCog } from "lucide-react"
import type { AIDecision } from "@/lib/types"
import { approveAIDecision, rejectAIDecision } from "@/lib/actions"
import { useTransition } from "react"
import { cn } from "@/lib/utils"

interface AIDecisionCardProps {
  decision: AIDecision
  onAction?: () => void
}

const agentIcons = {
  task_coordinator: Users,
  resource_optimizer: Zap,
  inventory_monitor: Package,
  client_agent: Briefcase,
  project_agent: FolderKanban,
  staff_agent: UserCog,
  decision_agent: Brain,
}

const agentLabels = {
  task_coordinator: 'Task Coordinator',
  resource_optimizer: 'Resource Optimizer',
  inventory_monitor: 'Inventory Monitor',
  client_agent: 'Client Agent',
  project_agent: 'Project Agent',
  staff_agent: 'Staff Agent',
  decision_agent: 'Decision Agent (BOSS)',
}

const agentColors = {
  task_coordinator: 'bg-blue-100 text-blue-600',
  resource_optimizer: 'bg-amber-100 text-amber-600',
  inventory_monitor: 'bg-green-100 text-green-600',
  client_agent: 'bg-purple-100 text-purple-600',
  project_agent: 'bg-blue-100 text-blue-600',
  staff_agent: 'bg-green-100 text-green-600',
  decision_agent: 'bg-amber-100 text-amber-600',
}

export function AIDecisionCard({ decision, onAction }: AIDecisionCardProps) {
  const [isPending, startTransition] = useTransition()
  const Icon = agentIcons[decision.agent_type as keyof typeof agentIcons] || Brain
  const agentColor = agentColors[decision.agent_type as keyof typeof agentColors] || 'bg-gray-100 text-gray-600'

  const handleApprove = () => {
    startTransition(async () => {
      await approveAIDecision(decision.id)
      onAction?.()
    })
  }

  const handleReject = () => {
    startTransition(async () => {
      await rejectAIDecision(decision.id)
      onAction?.()
    })
  }

  const confidenceColor = 
    decision.confidence >= 0.8 ? 'text-success' :
    decision.confidence >= 0.6 ? 'text-warning' : 'text-destructive'

  return (
    <Card className={cn("transition-all", isPending && "opacity-50")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", agentColor)}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">
                {decision.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {agentLabels[decision.agent_type as keyof typeof agentLabels]}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={cn("text-xs", confidenceColor)}>
            {Math.round(decision.confidence * 100)}% confident
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{decision.description}</p>
        
        {decision.status === 'pending' && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleApprove}
              disabled={isPending}
              className="flex-1"
            >
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReject}
              disabled={isPending}
              className="flex-1 bg-transparent"
            >
              <XCircle className="mr-1 h-3 w-3" />
              Reject
            </Button>
          </div>
        )}
        
        {decision.status !== 'pending' && (
          <Badge 
            variant={decision.status === 'approved' ? 'default' : 'destructive'}
            className="text-xs"
          >
            {decision.status.charAt(0).toUpperCase() + decision.status.slice(1)}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
