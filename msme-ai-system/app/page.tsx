import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Brain,
  ClipboardList,
  Package,
  Users,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">MSME Operations Hub</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/staff">
              <Button variant="ghost">Staff View</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Owner Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4">
            AI-Powered Operations
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
            Smart Operations Management for Small Businesses
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Streamline your MSME operations with AI agents that help coordinate tasks,
            optimize resources, and monitor inventory automatically.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <Link href="/select-enterprise">
              <Button size="lg" className="gap-2">
                🏪 Select Your Business Type
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg">
                General Dashboard
              </Button>
            </Link>
            <Link href="/staff">
              <Button variant="outline" size="lg">
                Staff View
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">AI Agents Working For You</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Our intelligent agents continuously analyze your operations and provide
              actionable recommendations to improve efficiency.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Task Coordinator</CardTitle>
                <CardDescription>
                  Automatically assigns tasks to available staff based on skills,
                  workload, and priorities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Smart task assignment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Workload balancing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Priority management
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mb-4">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Resource Optimizer</CardTitle>
                <CardDescription>
                  Analyzes resource usage patterns and suggests optimizations
                  to reduce waste and costs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Usage pattern analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Cost reduction tips
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Efficiency recommendations
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10 mb-4">
                  <Package className="h-6 w-6 text-chart-3" />
                </div>
                <CardTitle>Inventory Monitor</CardTitle>
                <CardDescription>
                  Tracks stock levels in real-time and alerts you before
                  items run low.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Low stock alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Reorder suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Trend forecasting
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                For Business Owners
              </Badge>
              <h2 className="text-3xl font-bold">Full Control Dashboard</h2>
              <p className="mt-4 text-muted-foreground">
                Get a complete overview of your operations with real-time metrics,
                AI recommendations, and quick actions all in one place.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <ClipboardList className="h-4 w-4 text-primary" />
                  </div>
                  <span>Task management and tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <span>Inventory and resource management</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                  <span>AI decision review and approval</span>
                </li>
              </ul>
            </div>
            <Card className="p-6 bg-muted/30">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-sm text-muted-foreground">Active Tasks</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-sm text-muted-foreground">Low Stock Items</p>
                    </CardContent>
                  </Card>
                </div>
                <Card className="border-primary/50">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">AI Recommendation</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Assign high-priority packaging tasks to available staff members
                    </p>
                  </CardContent>
                </Card>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Staff Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <Card className="p-6 bg-card order-2 md:order-1">
              <div className="space-y-3">
                {[
                  { title: 'Package inventory items', priority: 'High', status: 'In Progress' },
                  { title: 'Update stock counts', priority: 'Medium', status: 'Pending' },
                  { title: 'Clean equipment', priority: 'Low', status: 'Pending' },
                ].map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.priority} Priority</p>
                    </div>
                    <Badge variant={task.status === 'In Progress' ? 'default' : 'outline'}>
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
            <div className="order-1 md:order-2">
              <Badge variant="outline" className="mb-4">
                For Staff Members
              </Badge>
              <h2 className="text-3xl font-bold">Simple Task Interface</h2>
              <p className="mt-4 text-muted-foreground">
                Staff members get a clean, focused view of their assigned tasks
                with easy status updates and priority indicators.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span>Clear task priorities</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span>One-click status updates</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span>Mobile-friendly design</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold">Ready to Optimize Your Operations?</h2>
          <p className="mt-4 text-muted-foreground">
            Join businesses already using AI to streamline their daily operations.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg">
                Owner Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/staff">
              <Button variant="outline" size="lg">
                Staff View
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>MSME Operations Hub</span>
          </div>
          <p>AI-powered operations management</p>
        </div>
      </footer>
    </div>
  )
}
