"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Briefcase,
  FolderKanban,
  Users,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  IndianRupee,
  Calendar,
  MoreVertical,
  Phone,
  Mail,
  Bot,
  Zap,
  MailCheck
} from "lucide-react"
import type { Client, Project, Invoice, Profile } from "@/lib/types"

interface StartupDashboardProps {
  stats: any
  clients: Client[]
  projects: Project[]
  invoices: Invoice[]
  team: Profile[]
}

export function StartupDashboard({ stats, clients, projects, invoices, team }: StartupDashboardProps) {
  const [emailStatus, setEmailStatus] = useState<any>(null)
  const [checking, setChecking] = useState(false)
  const [emailResult, setEmailResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch autonomous system status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('http://localhost:8000/api/autonomous/status')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setEmailStatus(data)
      } catch (err: any) {
        console.error('Error fetching status:', err)
        setError(err.message || 'Failed to connect to backend')
        // Set default values so UI doesn't break
        setEmailStatus({
          status: 'unknown',
          stats: {
            emails_processed: 0,
            projects_created: 0,
            active_projects: 0
          }
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()

    // Refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  // Check emails manually
  const handleCheckEmails = async () => {
    setChecking(true)
    setEmailResult(null)
    try {
      const response = await fetch('http://localhost:8000/api/autonomous/check-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setEmailResult(data)

      // Refresh status
      const statusRes = await fetch('http://localhost:8000/api/autonomous/status')
      if (statusRes.ok) {
        const statusData = await statusRes.json()
        setEmailStatus(statusData)
      }
    } catch (error: any) {
      console.error('Error checking emails:', error)
      setEmailResult({
        success: false,
        error: error.message || 'Failed to check emails. Make sure backend is running on port 8000.'
      })
    }
    setChecking(false)
  }

  return (
    <div className="space-y-6">
      {/* Autonomous Email Monitoring Alert */}
      {emailResult && (
        <Alert className={emailResult.success ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
          <AlertDescription>
            {emailResult.success ? (
              <div>
                <strong className="text-green-700">✅ Email check complete!</strong>
                <p className="text-green-600 text-sm mt-1">
                  Found {emailResult.emails_found} project email(s)
                </p>
                {emailResult.emails && emailResult.emails.length > 0 && (
                  <ul className="mt-2 text-sm text-green-600 list-disc list-inside">
                    {emailResult.emails.map((email: any, idx: number) => (
                      <li key={idx}>
                        <strong>{email.subject}</strong> from {email.from}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div>
                <strong className="text-red-700">❌ Error:</strong>
                <p className="text-red-600 text-sm">{emailResult.error}</p>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Backend Connection Error */}
      {error && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertDescription>
            <div>
              <strong className="text-yellow-700">⚠️ Backend Connection Issue:</strong>
              <p className="text-yellow-600 text-sm mt-1">{error}</p>
              <p className="text-yellow-600 text-sm mt-2">
                Make sure the backend is running: <code className="bg-yellow-100 px-2 py-1 rounded">cd backend; python app.py</code>
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Autonomous Email System Card */}
      <Card className="md:col-span-2 lg:col-span-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-600" />
                Autonomous Email-to-Project System
              </CardTitle>
              <CardDescription>
                Automatically converts client emails to managed projects
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={emailStatus?.status === 'running' ? 'default' : 'secondary'} className="bg-green-100 text-green-700">
                <Zap className="h-3 w-3 mr-1" />
                {emailStatus?.status || 'Unknown'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {emailStatus?.stats?.emails_processed || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Emails Processed</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {emailStatus?.stats?.projects_created || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Projects Created</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {emailStatus?.stats?.active_projects || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Active Projects</p>
            </div>
            <div className="flex items-center justify-center">
              <Button
                onClick={handleCheckEmails}
                disabled={checking}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <MailCheck className="h-4 w-4 mr-2" />
                {checking ? 'Checking...' : 'Check Emails Now'}
              </Button>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>How it works:</strong> System monitors darshangirase18@gmail.com → AI extracts requirements →
              Calculates priority (40% deadline + 25% payment) → Assigns team → Sends professional response
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Briefcase className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clients.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.clients.prospects} prospects
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projects.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.projects.completed} completed
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Available</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.team.available}/{stats.team.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.team.onLeave} on leave
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (Paid)</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.revenue.total / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              {stats.revenue.overdue > 0 && `₹${(stats.revenue.overdue / 1000).toFixed(0)}K overdue`}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Clients Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                  Clients
                </CardTitle>
                <CardDescription>Your active and prospect clients</CardDescription>
              </div>
              <Button size="sm" variant="outline">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {clients.slice(0, 3).map((client) => (
              <div key={client.id} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 bg-purple-100">
                    <AvatarFallback className="text-purple-600 font-semibold">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.company}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {client.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{client.projects_count} projects</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">₹{(client.contract_value / 1000).toFixed(0)}K</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FolderKanban className="h-5 w-5 text-blue-600" />
                  Active Projects
                </CardTitle>
                <CardDescription>Ongoing work and deadlines</CardDescription>
              </div>
              <Button size="sm" variant="outline">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.filter(p => p.status !== 'completed').slice(0, 3).map((project) => (
              <div key={project.id} className="border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">{project.client?.company}</p>
                  </div>
                  <Badge variant={
                    project.status === 'in_progress' ? 'default' :
                      project.status === 'review' ? 'secondary' :
                        'outline'
                  }>
                    {project.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due: {new Date(project.deadline).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {project.team_members.length} members
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Team Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Team Members
                </CardTitle>
                <CardDescription>Staff skills and availability</CardDescription>
              </div>
              <Button size="sm" variant="outline">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {team.map((member) => (
              <div key={member.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 bg-gradient-to-br from-green-400 to-blue-500">
                    <AvatarFallback className="text-white font-semibold">
                      {member.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.full_name}</p>
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      {member.skills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Badge variant={member.is_available ? 'default' : 'secondary'} className="bg-green-100 text-green-700">
                  {member.is_available ? 'Available' : 'On Leave'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Billing Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  Recent Invoices
                </CardTitle>
                <CardDescription>Payment status and tracking</CardDescription>
              </div>
              <Button size="sm" variant="outline">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {invoices.slice(0, 4).map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{invoice.client?.company}</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.project?.name || 'General Invoice'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Due: {new Date(invoice.due_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{(invoice.amount / 1000).toFixed(1)}K</p>
                  <Badge variant={
                    invoice.status === 'paid' ? 'default' :
                      invoice.status === 'overdue' ? 'destructive' :
                        'secondary'
                  } className="mt-1">
                    {invoice.status === 'paid' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {invoice.status === 'overdue' && <AlertCircle className="h-3 w-3 mr-1" />}
                    {invoice.status === 'sent' && <Clock className="h-3 w-3 mr-1" />}
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
