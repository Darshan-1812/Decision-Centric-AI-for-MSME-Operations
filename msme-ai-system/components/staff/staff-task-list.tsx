'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle,
  Play,
  Check
} from "lucide-react"
import type { Task } from "@/lib/types"
import { updateTask } from "@/lib/actions"
import { useTransition } from "react"
import { cn } from "@/lib/utils"

interface StaffTaskListProps {
  tasks: Task[]
}

const priorityConfig = {
  low: { icon: Circle, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Low' },
  medium: { icon: Clock, color: 'text-primary', bg: 'bg-primary/10', label: 'Medium' },
  high: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', label: 'High' },
  urgent: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Urgent' },
}

export function StaffTaskList({ tasks }: StaffTaskListProps) {
  const [isPending, startTransition] = useTransition()

  const handleStart = (taskId: string) => {
    startTransition(async () => {
      await updateTask(taskId, { status: 'in_progress' })
    })
  }

  const handleComplete = (taskId: string) => {
    startTransition(async () => {
      await updateTask(taskId, { status: 'completed' })
    })
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-success/50 mb-3" />
        <p className="text-muted-foreground font-medium">All caught up!</p>
        <p className="text-sm text-muted-foreground mt-1">
          You have no pending tasks
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const priority = priorityConfig[task.priority]
        const PriorityIcon = priority.icon
        const isInProgress = task.status === 'in_progress'

        return (
          <Card 
            key={task.id} 
            className={cn(
              "transition-all",
              isPending && "opacity-50",
              isInProgress && "border-primary/50 bg-primary/5"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  priority.bg
                )}>
                  <PriorityIcon className={cn("h-5 w-5", priority.color)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className={cn("text-xs", priority.color)}>
                          {priority.label} Priority
                        </Badge>
                        
                        {task.due_date && (
                          <span className="text-xs text-muted-foreground">
                            Due {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                        
                        {task.ai_generated && (
                          <Badge variant="outline" className="text-xs bg-primary/5">
                            AI Assigned
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {task.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStart(task.id)}
                          disabled={isPending}
                        >
                          <Play className="mr-1 h-3 w-3" />
                          Start
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant={isInProgress ? "default" : "outline"}
                        onClick={() => handleComplete(task.id)}
                        disabled={isPending}
                      >
                        <Check className="mr-1 h-3 w-3" />
                        {isInProgress ? 'Complete' : 'Done'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
