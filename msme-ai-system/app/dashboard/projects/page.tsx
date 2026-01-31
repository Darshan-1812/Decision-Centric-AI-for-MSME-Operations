import { Suspense } from "react"
import { getProjects, getClients, getStaffMembers } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  FolderKanban, 
  Plus, 
  Calendar, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle2
} from "lucide-react"

async function ProjectStats() {
  const projects = await getProjects()
  
  const totalProjects = projects.length
  const inProgress = projects.filter(p => ['in_progress', 'planning', 'review'].includes(p.status)).length
  const completed = projects.filter(p => p.status === 'completed').length
  const totalValue = projects.reduce((sum, p) => sum + (p.budget || 0), 0)
  
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProjects}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgress}</div>
          <p className="text-xs text-muted-foreground">Active work</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completed}</div>
          <p className="text-xs text-muted-foreground">Successfully delivered</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{(totalValue / 1000).toFixed(0)}K</div>
          <p className="text-xs text-muted-foreground">All projects</p>
        </CardContent>
      </Card>
    </div>
  )
}

async function ProjectsContent() {
  const projects = await getProjects()
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <CardDescription className="mt-1">
                  {project.client?.company || project.client?.name || ''}
                </CardDescription>
              </div>
              <Badge variant={
                project.status === 'completed' ? 'default' :
                project.status === 'in_progress' ? 'default' :
                project.status === 'review' ? 'secondary' :
                project.status === 'on_hold' ? 'destructive' :
                'outline'
              }>
                {project.status.replace('_', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div>
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="font-semibold">₹{(project.budget / 1000).toFixed(0)}K</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Priority</p>
                <Badge variant={project.priority === 'urgent' ? 'destructive' : 'secondary'} className="text-xs">
                  {project.priority}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm pt-2 border-t">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{project.team_members.length} members</span>
              </div>
            </div>

            <Button className="w-full" variant="outline" size="sm">
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Track project progress and manage deliverables
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <Suspense fallback={
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      }>
        <ProjectStats />
      </Suspense>

      <Suspense fallback={
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-80" />)}
        </div>
      }>
        <ProjectsContent />
      </Suspense>
    </div>
  )
}
