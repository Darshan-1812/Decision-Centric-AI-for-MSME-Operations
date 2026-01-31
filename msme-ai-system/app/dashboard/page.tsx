import { Suspense } from "react"
import { 
  getDashboardStats, 
  getTasks, 
  getAIDecisions, 
  getResources,
  getStaffMembers,
  getClients,
  getProjects,
  getInvoices,
  getStartupStats
} from "@/lib/actions"
import { StatsCard } from "@/components/dashboard/stats-card"
import { AIDecisionCard } from "@/components/dashboard/ai-decision-card"
import { TaskList } from "@/components/dashboard/task-list"
import { CreateTaskDialog } from "@/components/dashboard/create-task-dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  ClipboardList,
  Package,
  Users,
  Brain,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { ENTERPRISE_CONFIGS, EnterpriseType } from "@/lib/types"
import {
  EnterpriseHeader,
  MicroDashboardStats,
  SmallDashboardStats,
  MediumDashboardStats,
} from "@/components/dashboard/enterprise-components"
import { StartupDashboard } from "@/components/dashboard/startup-dashboard"

async function DashboardStats() {
  const stats = await getDashboardStats()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Tasks"
        value={stats.totalTasks}
        description={`${stats.pendingTasks} pending`}
        icon={<ClipboardList className="h-4 w-4" />}
      />
      <StatsCard
        title="Inventory Items"
        value={stats.totalResources}
        description={stats.lowStockItems > 0 ? `${stats.lowStockItems} low stock` : 'All stocked'}
        icon={<Package className="h-4 w-4" />}
        className={stats.lowStockItems > 0 ? "border-destructive/50" : ""}
      />
      <StatsCard
        title="Staff Members"
        value={stats.staffCount}
        description={`${stats.availableStaff} available`}
        icon={<Users className="h-4 w-4" />}
      />
      <StatsCard
        title="AI Decisions"
        value={stats.aiDecisionsPending}
        description="Pending review"
        icon={<Brain className="h-4 w-4" />}
        className={stats.aiDecisionsPending > 0 ? "border-primary/50" : ""}
      />
    </div>
  )
}

async function PendingAIDecisions() {
  const decisions = await getAIDecisions('pending')
  const recentDecisions = decisions.slice(0, 3)

  if (recentDecisions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Brain className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No pending AI decisions</p>
          <p className="text-xs text-muted-foreground mt-1">
            AI agents will suggest optimizations here
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {recentDecisions.map((decision) => (
        <AIDecisionCard key={decision.id} decision={decision} />
      ))}
      {decisions.length > 3 && (
        <Link href="/dashboard/ai-decisions">
          <Button variant="ghost" className="w-full">
            View all {decisions.length} decisions
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  )
}

async function RecentTasks() {
  const [tasks, staffMembers] = await Promise.all([
    getTasks(),
    getStaffMembers()
  ])
  const recentTasks = tasks.slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Recent Tasks</CardTitle>
          <CardDescription>Latest task activity</CardDescription>
        </div>
        <CreateTaskDialog staffMembers={staffMembers} />
      </CardHeader>
      <CardContent>
        <TaskList tasks={recentTasks} />
        {tasks.length > 5 && (
          <Link href="/dashboard/tasks" className="mt-4 block">
            <Button variant="ghost" className="w-full">
              View all {tasks.length} tasks
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

async function LowStockAlerts() {
  const resources = await getResources()
  const lowStock = resources.filter(r => r.quantity <= r.min_threshold)

  if (lowStock.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <TrendingUp className="h-12 w-12 text-success/50 mb-3" />
          <p className="text-muted-foreground">All inventory levels healthy</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Low Stock Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lowStock.slice(0, 4).map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.type}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm text-destructive">
                  {item.quantity} {item.unit}
                </p>
                <p className="text-xs text-muted-foreground">
                  Min: {item.min_threshold}
                </p>
              </div>
            </div>
          ))}
        </div>
        {lowStock.length > 4 && (
          <Link href="/dashboard/inventory" className="mt-4 block">
            <Button variant="outline" className="w-full bg-transparent">
              View all {lowStock.length} alerts
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const params = await searchParams
  const enterpriseType = params.type as EnterpriseType | undefined
  const config = enterpriseType ? ENTERPRISE_CONFIGS[enterpriseType] : null

  // Service Startup - Complete Dashboard
  if (enterpriseType === 'small_startup') {
    const [stats, clients, projects, invoices, team] = await Promise.all([
      getStartupStats(),
      getClients(),
      getProjects(),
      getInvoices(),
      getStaffMembers()
    ])

    return (
      <div className="space-y-6">
        <EnterpriseHeader type={enterpriseType} />
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Service Startup Dashboard</h1>
            <p className="text-muted-foreground">
              Complete overview of clients, projects, team, and revenue
            </p>
          </div>
          <Link href="/select-enterprise">
            <Button variant="outline" size="sm">
              Change Business Type
            </Button>
          </Link>
        </div>

        <StartupDashboard 
          stats={stats}
          clients={clients}
          projects={projects}
          invoices={invoices}
          team={team}
        />

        {/* AI Recommendations */}
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Recommendations
            </CardTitle>
            <CardDescription>AI-powered insights for your startup</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20" />)}</div>}>
              <PendingAIDecisions />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enterprise-specific header */}
      {config && <EnterpriseHeader type={enterpriseType!} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {config ? `${config.name} Dashboard` : 'Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {config ? `${config.description} operations overview` : 'Overview of your business operations'}
          </p>
        </div>
        
        {config && (
          <Link href="/select-enterprise">
            <Button variant="outline" size="sm">
              Change Business Type
            </Button>
          </Link>
        )}
      </div>

      {/* Enterprise-specific stats */}
      {config ? (
        config.category === 'micro' ? (
          <MicroDashboardStats type={enterpriseType!} />
        ) : config.category === 'small' ? (
          <SmallDashboardStats type={enterpriseType!} />
        ) : (
          <MediumDashboardStats type={enterpriseType!} />
        )
      ) : (
        <Suspense fallback={<StatsSkeleton />}>
          <DashboardStats />
        </Suspense>
      )}

      {/* Active modules for this enterprise type */}
      {config && (
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-sm">Active Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {config.dashboardModules.map((module) => (
                <Link key={module} href={`/dashboard/${module}`}>
                  <Badge 
                    variant="secondary" 
                    className="capitalize cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {module}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-96" />}>
            <RecentTasks />
          </Suspense>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Recommendations</CardTitle>
              <CardDescription>Review AI agent suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-48" />}>
                <PendingAIDecisions />
              </Suspense>
            </CardContent>
          </Card>
          
          <Suspense fallback={<Skeleton className="h-48" />}>
            <LowStockAlerts />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
