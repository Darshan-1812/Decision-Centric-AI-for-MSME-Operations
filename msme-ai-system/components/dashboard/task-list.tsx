'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle,
  MoreVertical,
  User
} from "lucide-react"
import type { Task } from "@/lib/types"
import { updateTask } from "@/lib/actions"
import { useTransition } from "react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TaskListProps {
  tasks: Task[]
  showAssignee?: boolean
  onTaskUpdate?: () => void
}

const priorityConfig = {
  low: { icon: Circle, color: 'text-muted-foreground', bg: 'bg-muted' },
  medium: { icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
  high: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
  urgent: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
}

const statusConfig = {
  pending: { label: 'Pending', variant: 'outline' as const },
  in_progress: { label: 'In Progress', variant: 'secondary' as const },
  completed: { label: 'Completed', variant: 'default' as const },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const },
}

export function TaskList({ tasks, showAssignee = true, onTaskUpdate }: TaskListProps) {
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    startTransition(async () => {
      await updateTask(taskId, { status: newStatus })
      onTaskUpdate?.()
    })
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No tasks to display</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const priority = priorityConfig[task.priority]
        const status = statusConfig[task.status]
        const PriorityIcon = priority.icon

        return (
          <Card 
            key={task.id} 
            className={cn(
              "transition-all",
              isPending && "opacity-50",
              task.status === 'completed' && "opacity-60"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", priority.bg)}>
                  <PriorityIcon className={cn("h-4 w-4", priority.color)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className={cn(
                        "font-medium text-sm",
                        task.status === 'completed' && "line-through"
                      )}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {task.status !== 'pending' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'pending')}>
                            Mark as Pending
                          </DropdownMenuItem>
                        )}
                        {task.status !== 'in_progress' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'in_progress')}>
                            Start Working
                          </DropdownMenuItem>
                        )}
                        {task.status !== 'completed' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'completed')}>
                            Mark Complete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant={status.variant} className="text-xs">
                      {status.label}
                    </Badge>
                    
                    {task.ai_generated && (
                      <Badge variant="outline" className="text-xs bg-primary/5">
                        AI Generated
                      </Badge>
                    )}
                    
                    {showAssignee && task.assignee && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {task.assignee.name || task.assignee.full_name || task.assignee.email}
                      </div>
                    )}
                    
                    {(task as any).project_name && (
                      <Badge variant="secondary" className="text-xs">
                        {(task as any).project_name}
                      </Badge>
                    )}
                    
                    {(task as any).estimated_days && (
                      <span className="text-xs text-muted-foreground">
                        Est: {(task as any).estimated_days} days
                      </span>
                    )}
                    
                    {task.due_date && (
                      <span className="text-xs text-muted-foreground">
                        Due {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
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
