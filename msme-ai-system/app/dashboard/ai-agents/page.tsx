import { AIChat } from "@/components/dashboard/ai-chat"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Users, Zap, Package, Briefcase, FolderKanban, UserCog, Mail, FileSearch, ArrowRight, CheckCircle2, Clock } from "lucide-react"
import { getAutomationFlow, getProjectRequests } from "@/lib/actions"

export default async function AIAgentsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const params = await searchParams
  const isStartup = params.type === 'small_startup'

  if (isStartup) {
    const automationFlow = await getAutomationFlow()
    const projectRequests = await getProjectRequests()

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Automation System</h1>
          <p className="text-muted-foreground">
            Client emails automatically become prioritized, staffed, and monitored projects
          </p>
        </div>

        {/* Automation Flow Visualization */}
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-purple-600" />
              Email-to-Project Automation Flow
            </CardTitle>
            <CardDescription>
              Autonomous agents handle everything from email intake to project delivery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              {automationFlow.flowSteps.map((step) => (
                <div key={step.step} className="relative">
                  <Card className={step.status === 'Active' ? 'border-green-300 bg-green-50' : step.status === 'Processing' ? 'border-blue-300 bg-blue-50' : ''}>
                    <CardContent className="pt-4 pb-4">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">Step {step.step}</div>
                        <div className="font-semibold text-sm mb-2">{step.agent}</div>
                        <Badge variant={step.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                          {step.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-2">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                  {step.step < 6 && (
                    <ArrowRight className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Emails Today</div>
              <div className="text-2xl font-bold">{automationFlow.stats.emailsProcessedToday}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Accepted</div>
              <div className="text-2xl font-bold text-green-600">{automationFlow.stats.projectsAccepted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Pending</div>
              <div className="text-2xl font-bold text-amber-600">{automationFlow.stats.projectsPending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Auto Replies</div>
              <div className="text-2xl font-bold">{automationFlow.stats.autoResponsesSent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Response Time</div>
              <div className="text-lg font-bold text-blue-600">{automationFlow.stats.averageResponseTime}</div>
            </CardContent>
          </Card>
        </div>

        {/* Incoming Project Requests with Priority Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-blue-600" />
              Incoming Project Requests (Auto-Prioritized)
            </CardTitle>
            <CardDescription>
              Decision Agent using industry-standard weighted scoring: Deadline (40%) + Payment (25%) + Value (15%) + Client (10%) - Team Load (10%)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {projectRequests.map((request) => (
              <Card key={request.id} className={
                request.priority_level === 'CRITICAL' ? 'border-red-300 bg-red-50' :
                request.priority_level === 'HIGH' ? 'border-orange-300 bg-orange-50' :
                'border-gray-200'
              }>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={request.priority_level === 'CRITICAL' ? 'destructive' : request.priority_level === 'HIGH' ? 'default' : 'secondary'}>
                          {request.priority_level} - Score: {request.priority_score}/100
                        </Badge>
                        <span className="font-semibold">{request.client_company}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{request.raw_email_content}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><strong>Project:</strong> {request.project_type}</div>
                        <div><strong>Deadline:</strong> {Math.ceil((new Date(request.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days</div>
                        <div><strong>Budget:</strong> ₹{(request.budget / 1000).toFixed(0)}K</div>
                        <div><strong>Advance:</strong> {request.advance_paid ? `₹${(request.advance_amount! / 1000).toFixed(0)}K` : 'None'}</div>
                      </div>
                      {request.reasoning && (
                        <div className="mt-3 space-y-1">
                          <div className="text-xs font-semibold text-purple-700">AI Reasoning:</div>
                          {request.reasoning.map((reason, idx) => (
                            <div key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                              <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              {reason}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Agent Cards - Email-to-Project Flow */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              How Email-to-Project Automation Works
            </CardTitle>
            <CardDescription>
              7 autonomous agents working together without human coordination
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 flex-shrink-0">
                    <Mail className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">1. Email Agent</p>
                    <p className="text-xs text-muted-foreground">
                      Monitors inbox 24/7. Detects new project emails. Auto-extracts content. No human opens emails.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 flex-shrink-0">
                    <FileSearch className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">2. Requirement Agent</p>
                    <p className="text-xs text-muted-foreground">
                      Uses NLP/LLM to understand: project type, scope, deadline, budget, advance payment. Outputs structured JSON.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 flex-shrink-0">
                    <Brain className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">3. Decision Agent (BOSS) ⚖️</p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Weighted Scoring:</strong> Deadline (40%) + Payment (25%) + Value (15%) + Client (10%) - Team Load (10%). Ranks all projects.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 flex-shrink-0">
                    <UserCog className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">4. Staff Agent</p>
                    <p className="text-xs text-muted-foreground">
                      Checks team availability, skills, workload. Assigns best-fit team automatically. Prevents overload.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 flex-shrink-0">
                    <FolderKanban className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">5. Task Assignment Agent</p>
                    <p className="text-xs text-muted-foreground">
                      Breaks project into tasks. Assigns roles (UI → Designer, Backend → Developer). Staff see tasks instantly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 flex-shrink-0">
                    <Clock className="h-4 w-4 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">6. Monitoring Agent</p>
                    <p className="text-xs text-muted-foreground">
                      Runs continuously. Tracks progress, missed milestones, overload risk. Auto-triggers reassignment or alerts.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 flex-shrink-0">
                    <Mail className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">7. Communication Agent</p>
                    <p className="text-xs text-muted-foreground">
                      Auto-sends: project acceptance, team assigned, delay alerts, payment reminders. No manual follow-up.
                    </p>
                  </div>
                </div>

                <Card className="bg-amber-50 border-amber-200 mt-4">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-xs font-semibold text-amber-900 mb-2">🔁 Autonomous Loop:</p>
                    <code className="text-xs text-amber-800">
                      while True:<br/>
                      &nbsp;&nbsp;check_emails()<br/>
                      &nbsp;&nbsp;analyze_requirements()<br/>
                      &nbsp;&nbsp;compute_priority()<br/>
                      &nbsp;&nbsp;assign_teams()<br/>
                      &nbsp;&nbsp;monitor_progress()<br/>
                      &nbsp;&nbsp;send_updates()<br/>
                      &nbsp;&nbsp;sleep(10min)
                    </code>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <UserCog className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Staff Agent</p>
                  <p className="text-xs text-muted-foreground">Manages team workload</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <Brain className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Decision Agent</p>
                  <p className="text-xs text-muted-foreground">Coordinates all agents (BOSS)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              How AI Agents Work
            </CardTitle>
            <CardDescription>
              Autonomous agents continuously observe operations and make intelligent recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 flex-shrink-0">
                  <Briefcase className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Client Agent</p>
                  <p className="text-sm text-muted-foreground">
                    Tracks client engagement, payment status, and relationship health. Sends reminders for overdue invoices and suggests follow-ups with prospects.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 flex-shrink-0">
                  <FolderKanban className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Project Agent</p>
                  <p className="text-sm text-muted-foreground">
                    Monitors project progress, deadlines, and milestones. Alerts on approaching deadlines and recommends resource allocation adjustments.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 flex-shrink-0">
                  <UserCog className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Staff Agent</p>
                  <p className="text-sm text-muted-foreground">
                    Manages team workload and skills. Assigns tasks based on expertise and availability. Balances workload across team members.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 flex-shrink-0">
                  <Brain className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Decision Agent (BOSS)</p>
                  <p className="text-sm text-muted-foreground">
                    Coordinates all other agents. Makes high-level strategic decisions about resource allocation, prioritization, and workflow optimization.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <AIChat
            agentType="client_agent"
            title="Client Agent"
            placeholder="Ask about client relationships and payments..."
          />

          <AIChat
            agentType="project_agent"
            title="Project Agent"
            placeholder="Ask about project timelines and progress..."
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <AIChat
            agentType="staff_agent"
            title="Staff Agent"
            placeholder="Ask about team workload and skills..."
          />

          <AIChat
            agentType="decision_agent"
            title="Decision Agent (BOSS)"
            placeholder="Ask for strategic recommendations..."
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Agents</h1>
        <p className="text-muted-foreground">
          Chat with AI agents to get recommendations and automate tasks
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Task Coordinator</p>
                <p className="text-xs text-muted-foreground">Smart task assignment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Resource Optimizer</p>
                <p className="text-xs text-muted-foreground">Efficiency suggestions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                <Package className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="font-medium">Inventory Monitor</p>
                <p className="text-xs text-muted-foreground">Stock level tracking</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AIChat
          agentType="task_coordinator"
          title="Task Coordinator"
          placeholder="Ask about task assignments..."
        />

        <AIChat
          agentType="inventory_monitor"
          title="Inventory Monitor"
          placeholder="Ask about stock levels..."
        />
      </div>

      <AIChat
        agentType="resource_optimizer"
        title="Resource Optimizer"
        placeholder="Ask about optimizations..."
      />
    </div>
  )
}
