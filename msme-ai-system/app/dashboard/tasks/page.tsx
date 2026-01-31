import { getTasks, getStaffMembers } from "@/lib/actions"
import { TaskList } from "@/components/dashboard/task-list"
import { CreateTaskDialog } from "@/components/dashboard/create-task-dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function TasksPage() {
  const [tasks, staffMembers] = await Promise.all([
    getTasks(),
    getStaffMembers()
  ])

  const pendingTasks = tasks.filter(t => t.status === 'pending')
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track all business tasks
          </p>
        </div>
        <CreateTaskDialog staffMembers={staffMembers} />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({inProgressTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TaskList tasks={tasks} />
        </TabsContent>

        <TabsContent value="pending">
          <TaskList tasks={pendingTasks} />
        </TabsContent>

        <TabsContent value="in_progress">
          <TaskList tasks={inProgressTasks} />
        </TabsContent>

        <TabsContent value="completed">
          <TaskList tasks={completedTasks} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
