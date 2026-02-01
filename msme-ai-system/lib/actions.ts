'use server'

// import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'
import type { Task, Resource, AIDecision, Profile, DashboardStats, Client, Project, Invoice, ProjectRequest, PriorityFactors } from './types'

// Backend API URL - uses environment variable for production
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Safe fetch wrapper with timeout and error handling
async function safeFetch(url: string, options?: RequestInit): Promise<Response | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    return response
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log(`Request to ${url} timed out`)
    } else {
      console.log(`Fetch error for ${url}:`, error.message || error)
    }
    return null
  }
}

// DECISION AGENT - INDUSTRY-STANDARD PRIORITY SCORING RULES
function calculatePriorityScore(request: ProjectRequest, teamLoad: number): { score: number, level: string, reasoning: string[], factors: PriorityFactors } {
  const reasoning: string[] = []
  
  // RULE 1: DEADLINE URGENCY (40% weight - MOST IMPORTANT)
  const daysToDeadline = Math.ceil((new Date(request.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  let deadlineScore = 0
  if (daysToDeadline <= 3) {
    deadlineScore = 40
    reasoning.push(`CRITICAL: Deadline in ${daysToDeadline} days`)
  } else if (daysToDeadline <= 7) {
    deadlineScore = 30
    reasoning.push(`HIGH URGENCY: Deadline in ${daysToDeadline} days`)
  } else if (daysToDeadline <= 14) {
    deadlineScore = 20
    reasoning.push(`Moderate urgency: ${daysToDeadline} days deadline`)
  } else {
    deadlineScore = 10
    reasoning.push(`Standard timeline: ${daysToDeadline} days`)
  }

  // RULE 2: PAYMENT STATUS (25% weight - VERY REAL)
  let paymentScore = 0
  if (request.advance_paid && request.advance_amount && request.advance_amount >= request.budget * 0.3) {
    paymentScore = 25
    reasoning.push(`✓ Advance paid: ₹${(request.advance_amount / 1000).toFixed(0)}K (${Math.round(request.advance_amount / request.budget * 100)}%)`)
  } else if (request.advance_paid) {
    paymentScore = 15
    reasoning.push(`Partial advance received`)
  } else {
    paymentScore = 0
    reasoning.push(`⚠ No advance payment`)
  }

  // RULE 3: PROJECT VALUE / REVENUE IMPACT (15% weight)
  let valueScore = 0
  if (request.budget >= 200000) {
    valueScore = 15
    reasoning.push(`High-value project: ₹${(request.budget / 1000).toFixed(0)}K`)
  } else if (request.budget >= 100000) {
    valueScore = 10
    reasoning.push(`Medium-value project: ₹${(request.budget / 1000).toFixed(0)}K`)
  } else {
    valueScore = 5
    reasoning.push(`Standard project value: ₹${(request.budget / 1000).toFixed(0)}K`)
  }

  // RULE 4: CLIENT IMPORTANCE (10% weight)
  const clientScore = 10 // For now, treat all as important. Can enhance with repeat client logic
  reasoning.push(`New client engagement`)

  // RULE 5: TEAM LOAD PENALTY (-10% for overload)
  let teamLoadPenalty = 0
  if (teamLoad > 80) {
    teamLoadPenalty = -10
    reasoning.push(`⚠ Team overloaded (${teamLoad}% capacity)`)
  } else if (teamLoad > 60) {
    teamLoadPenalty = -5
    reasoning.push(`Team moderately busy (${teamLoad}% capacity)`)
  } else {
    teamLoadPenalty = 0
    reasoning.push(`✓ Team available (${teamLoad}% capacity)`)
  }

  const totalScore = deadlineScore + paymentScore + valueScore + clientScore + teamLoadPenalty
  
  let priorityLevel = 'NORMAL'
  if (totalScore >= 75) priorityLevel = 'CRITICAL'
  else if (totalScore >= 60) priorityLevel = 'HIGH'
  else if (totalScore >= 40) priorityLevel = 'NORMAL'
  else priorityLevel = 'LOW'

  const factors: PriorityFactors = {
    deadline_urgency: deadlineScore,
    payment_status: paymentScore,
    project_value: valueScore,
    client_importance: clientScore,
    team_load_penalty: teamLoadPenalty,
    total_score: totalScore
  }

  return { score: totalScore, level: priorityLevel, reasoning, factors }
}

// Mock incoming project requests (simulating client emails)
// Will be populated from email fetching
const mockProjectRequests: ProjectRequest[] = []

// Mock data for development without Supabase
const mockProfiles: Profile[] = [
  { id: '1', email: 'dev@startup.com', full_name: 'Alex Kumar', role: 'staff', skills: ['React', 'Node.js', 'TypeScript'], is_available: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', email: 'designer@startup.com', full_name: 'Priya Sharma', role: 'staff', skills: ['UI/UX', 'Figma', 'Branding'], is_available: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', email: 'marketing@startup.com', full_name: 'Rahul Singh', role: 'staff', skills: ['SEO', 'Content', 'Social Media'], is_available: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', email: 'owner@startup.com', full_name: 'Owner Admin', role: 'owner', skills: ['Management', 'Sales'], is_available: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

// Clients will be populated from email fetching
const mockClients: Client[] = []

// Projects will be populated from email fetching
const mockProjects: Project[] = []

// Invoices will be populated as projects progress
const mockInvoices: Invoice[] = []

// Tasks will be created as projects are assigned
const mockTasks: Task[] = []

// Resources for manufacturing businesses
const mockResources: Resource[] = []

// AI Decisions will be populated as the system processes emails
const mockDecisions: AIDecision[] = []

// Profile actions
export async function getCurrentUser() {
  // Return mock owner profile
  return mockProfiles[3]
}

export async function getStaffMembers() {
  return mockProfiles.filter(p => p.role === 'staff')
}

// Task actions
export async function getTasks(status?: string) {
  try {
    // Fetch projects with tasks from backend
    const response = await safeFetch(`${API_URL}/api/autonomous/projects`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    })
    if (response?.ok) {
      console.log('Fetching tasks from backend, status:', response.status)
      const data = await response.json()
      const projects = data.projects || []
      
      // Extract all tasks from all projects
      const allTasks: Task[] = []
      projects.forEach((project: any, projectIndex: number) => {
        const tasks = project.tasks || []
        tasks.forEach((task: any, taskIndex: number) => {
          // Find team member info
          const assignedTeamMember = project.assigned_team?.find((t: any) => t.task === task.task_name)
          
          allTasks.push({
            id: `${project.id}-${task.task_id}`,
            title: task.task_name,
            description: `Project: ${project.name} - ${project.scope || 'No description'}`,
            status: 'pending', // Default status
            priority: project.priority === 'critical' ? 'critical' : project.priority === 'high' ? 'high' : 'medium',
            assigned_to: assignedTeamMember?.id || task.assigned_to,
            created_by: 'system',
            due_date: project.deadline,
            completed_at: null,
            ai_generated: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            // Extra info for display
            assignee: assignedTeamMember ? {
              id: assignedTeamMember.id,
              name: assignedTeamMember.name,
              email: `${assignedTeamMember.name.toLowerCase()}@company.com`,
              role: 'staff',
              avatar_url: null,
              created_at: new Date().toISOString()
            } : undefined,
            project_name: project.name,
            estimated_days: task.estimated_days
          })
        })
      })
      
      if (status) {
        return allTasks.filter(t => t.status === status)
      }
      return allTasks
    }
  } catch (error) {
    console.error('Error fetching tasks from backend:', error)
  }
  
  // Fallback to mock data
  if (status) {
    return mockTasks.filter(t => t.status === status).map(t => ({
      ...t,
      assignee: mockProfiles.find(p => p.id === t.assigned_to)
    }))
  }
  return mockTasks.map(t => ({
    ...t,
    assignee: mockProfiles.find(p => p.id === t.assigned_to)
  }))
}

export async function getMyTasks(userId: string) {
  return mockTasks.filter(t => t.assigned_to === userId && ['pending', 'in_progress'].includes(t.status))
}

export async function createTask(task: Partial<Task>) {
  const newTask: Task = {
    id: String(mockTasks.length + 1),
    title: task.title || '',
    description: task.description || null,
    status: 'pending',
    priority: task.priority || 'medium',
    assigned_to: task.assigned_to || null,
    created_by: '3',
    due_date: task.due_date || null,
    completed_at: null,
    ai_generated: task.ai_generated || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  mockTasks.push(newTask)
  revalidateTag('tasks', 'max')
  return newTask
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const taskIndex = mockTasks.findIndex(t => t.id === id)
  if (taskIndex >= 0) {
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      ...updates,
      updated_at: new Date().toISOString(),
      ...(updates.status === 'completed' ? { completed_at: new Date().toISOString() } : {})
    }
    revalidateTag('tasks', 'max')
    return mockTasks[taskIndex]
  }
  throw new Error('Task not found')
}

export async function deleteTask(id: string) {
  const index = mockTasks.findIndex(t => t.id === id)
  if (index >= 0) mockTasks.splice(index, 1)
  revalidateTag('tasks', 'max')
}

// Resource actions
export async function getResources() {
  return mockResources
}

export async function createResource(resource: Partial<Resource>) {
  const newResource: Resource = {
    id: String(mockResources.length + 1),
    name: resource.name || '',
    type: resource.type || 'raw_material',
    quantity: resource.quantity || 0,
    unit: resource.unit || 'units',
    min_threshold: resource.min_threshold || 10,
    max_threshold: resource.max_threshold || 100,
    cost_per_unit: resource.cost_per_unit || 0,
    supplier: resource.supplier || null,
    last_restocked_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  mockResources.push(newResource)
  revalidateTag('resources', 'max')
  return newResource
}

export async function updateResource(id: string, updates: Partial<Resource>) {
  const index = mockResources.findIndex(r => r.id === id)
  if (index >= 0) {
    mockResources[index] = {
      ...mockResources[index],
      ...updates,
      updated_at: new Date().toISOString()
    }
    revalidateTag('resources', 'max')
    return mockResources[index]
  }
  throw new Error('Resource not found')
}

export async function deleteResource(id: string) {
  const index = mockResources.findIndex(r => r.id === id)
  if (index >= 0) mockResources.splice(index, 1)
  revalidateTag('resources', 'max')
}

// AI Decision actions
export async function getAIDecisions(status?: string) {
  if (status) {
    return mockDecisions.filter(d => d.status === status)
  }
  return mockDecisions
}

export async function createAIDecision(decision: Partial<AIDecision>) {
  const newDecision: AIDecision = {
    id: String(mockDecisions.length + 1),
    agent_type: decision.agent_type || 'task_coordinator',
    decision_type: decision.decision_type || 'task_assignment',
    title: decision.title || '',
    description: decision.description || '',
    confidence: decision.confidence || 0.8,
    status: 'pending',
    context: decision.context || {},
    approved_by: null,
    approved_at: null,
    created_at: new Date().toISOString(),
  }
  mockDecisions.push(newDecision)
  revalidateTag('ai_decisions', 'max')
  return newDecision
}

export async function approveAIDecision(id: string) {
  const index = mockDecisions.findIndex(d => d.id === id)
  if (index >= 0) {
    mockDecisions[index] = {
      ...mockDecisions[index],
      status: 'approved',
      approved_by: '3',
      approved_at: new Date().toISOString()
    }
    revalidateTag('ai_decisions', 'max')
    return mockDecisions[index]
  }
  throw new Error('Decision not found')
}

export async function rejectAIDecision(id: string) {
  const index = mockDecisions.findIndex(d => d.id === id)
  if (index >= 0) {
    mockDecisions[index] = {
      ...mockDecisions[index],
      status: 'rejected',
      approved_by: '3',
      approved_at: new Date().toISOString()
    }
    revalidateTag('ai_decisions', 'max')
    return mockDecisions[index]
  }
  throw new Error('Decision not found')
}

// Inventory alerts
export async function getInventoryAlerts(resolved?: boolean) {
  // Mock inventory alerts based on low stock items
  const alerts = mockResources
    .filter(r => r.quantity <= r.min_threshold)
    .map(r => ({
      id: `alert-${r.id}`,
      resource_id: r.id,
      alert_type: 'low_stock' as const,
      message: `${r.name} is running low (${r.quantity} ${r.unit})`,
      severity: (r.quantity < r.min_threshold * 0.5 ? 'critical' : 'warning') as 'info' | 'warning' | 'critical',
      is_resolved: false,
      resolved_at: null,
      resolved_by: null,
      created_at: new Date().toISOString(),
      resource: r
    }))
  
  if (resolved !== undefined) {
    return alerts.filter(a => a.is_resolved === resolved)
  }
  return alerts
}

export async function resolveInventoryAlert(id: string) {
  // Mock resolution - in real app would update database
  revalidateTag('inventory_alerts', 'max')
}

// Dashboard stats
export async function getDashboardStats(): Promise<DashboardStats> {
  const lowStockItems = mockResources.filter(r => r.quantity <= r.min_threshold).length
  const pendingTasks = mockTasks.filter(t => t.status === 'pending').length
  const completedTasks = mockTasks.filter(t => t.status === 'completed').length
  const availableStaff = mockProfiles.filter(p => p.role === 'staff' && p.is_available).length
  const staffCount = mockProfiles.filter(p => p.role === 'staff').length
  const aiDecisionsPending = mockDecisions.filter(d => d.status === 'pending').length
  
  return {
    totalTasks: mockTasks.length,
    pendingTasks,
    completedTasks,
    totalResources: mockResources.length,
    lowStockItems,
    activeAlerts: lowStockItems,
    staffCount,
    availableStaff,
    aiDecisionsPending,
  }
}

// Service Startup specific functions
export async function getClients() {
  try {
    // Try to fetch from backend first
    const response = await safeFetch(`${API_URL}/api/autonomous/projects`)
    if (response?.ok) {
      const data = await response.json()
      // Extract unique clients from projects
      const clientsMap = new Map()
      data.projects?.forEach((p: any) => {
        const clientEmail = p.client || ''
        const clientName = clientEmail.split('<')[0].trim() || clientEmail
        if (clientEmail && !clientsMap.has(clientEmail)) {
          clientsMap.set(clientEmail, {
            id: clientEmail,
            name: clientName,
            company: '',
            email: clientEmail.match(/<(.+)>/)?.[1] || clientEmail,
            phone: '',
            status: 'active',
            contract_value: 0,
            projects_count: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        } else if (clientsMap.has(clientEmail)) {
          const existing = clientsMap.get(clientEmail)
          existing.projects_count++
        }
      })
      const backendClients = Array.from(clientsMap.values())
      // Merge with any local mock clients
      return [...backendClients, ...mockClients].map(client => ({
        ...client,
        projects_count: mockProjects.filter(p => p.client_id === client.id).length || client.projects_count
      }))
    }
  } catch (error) {
    console.log('Backend not available, using local data')
  }
  return mockClients.map(client => ({
    ...client,
    projects_count: mockProjects.filter(p => p.client_id === client.id).length
  }))
}

export async function getProjects() {
  try {
    // Try to fetch from backend first
    const response = await safeFetch(`${API_URL}/api/autonomous/projects`)
    if (response?.ok) {
      const data = await response.json()
      const backendProjects = (data.projects || []).map((p: any) => ({
        id: p.id,
        name: p.name || 'New Project',
        client_id: p.client,
        status: p.status?.toLowerCase() === 'active' ? 'in_progress' : p.status?.toLowerCase() || 'planning',
        priority: p.priority || 'medium',
        start_date: new Date().toISOString(),
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        budget: 0,
        team_members: [],
        progress: p.progress || 0,
        description: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        client: { name: p.client?.split('<')[0].trim() || 'Unknown', email: p.client?.match(/<(.+)>/)?.[1] || p.client }
      }))
      return [...backendProjects, ...mockProjects.map(project => ({
        ...project,
        client: mockClients.find(c => c.id === project.client_id)
      }))]
    }
  } catch (error) {
    console.log('Backend not available, using local data')
  }
  return mockProjects.map(project => ({
    ...project,
    client: mockClients.find(c => c.id === project.client_id)
  }))
}

export async function getInvoices() {
  return mockInvoices.map(invoice => ({
    ...invoice,
    client: mockClients.find(c => c.id === invoice.client_id),
    project: invoice.project_id ? mockProjects.find(p => p.id === invoice.project_id) : null
  }))
}

export async function getStartupStats() {
  // Try to get stats from backend
  let backendProjectCount = 0
  let backendClients = new Set()
  
  try {
    const response = await safeFetch(`${API_URL}/api/autonomous/projects`)
    if (response?.ok) {
      const data = await response.json()
      backendProjectCount = data.projects?.length || 0
      data.projects?.forEach((p: any) => {
        if (p.client) backendClients.add(p.client)
      })
    }
  } catch (error) {
    console.log('Backend not available for stats')
  }
  
  const activeClients = mockClients.filter(c => c.status === 'active').length + backendClients.size
  const totalProjects = mockProjects.length + backendProjectCount
  const activeProjects = mockProjects.filter(p => ['in_progress', 'planning', 'review'].includes(p.status)).length + backendProjectCount
  const completedProjects = mockProjects.filter(p => p.status === 'completed').length
  
  const totalRevenue = mockInvoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)
  const pendingRevenue = mockInvoices.filter(i => i.status === 'sent').reduce((sum, inv) => sum + inv.amount, 0)
  const overdueRevenue = mockInvoices.filter(i => i.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0)
  
  const totalTeam = mockProfiles.filter(p => p.role === 'staff').length
  const availableTeam = mockProfiles.filter(p => p.role === 'staff' && p.is_available).length
  
  return {
    clients: {
      total: mockClients.length + backendClients.size,
      active: activeClients,
      prospects: mockClients.filter(c => c.status === 'prospect').length
    },
    projects: {
      total: totalProjects,
      active: activeProjects,
      completed: completedProjects,
      onHold: mockProjects.filter(p => p.status === 'on_hold').length
    },
    revenue: {
      total: totalRevenue,
      pending: pendingRevenue,
      overdue: overdueRevenue,
      monthlyTarget: 200000
    },
    team: {
      total: totalTeam,
      available: availableTeam,
      onLeave: totalTeam - availableTeam
    },
    tasks: {
      total: mockTasks.length,
      pending: mockTasks.filter(t => t.status === 'pending').length,
      inProgress: mockTasks.filter(t => t.status === 'in_progress').length,
      completed: mockTasks.filter(t => t.status === 'completed').length
    }
  }
}

// Email-to-Project Automation Functions
export async function getProjectRequests() {
  const currentTeamLoad = 45 // Simulate team at 45% capacity
  
  return mockProjectRequests.map(request => {
    const { score, level, reasoning, factors } = calculatePriorityScore(request, currentTeamLoad)
    return {
      ...request,
      priority_score: score,
      priority_level: level as 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW',
      reasoning
    }
  }).sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0)) // Sort by priority
}

export async function getAutomationFlow() {
  return {
    flowSteps: [
      { step: 1, agent: 'Email Agent', status: 'Active', description: 'Monitoring inbox for new project emails' },
      { step: 2, agent: 'Requirement Agent', status: 'Processing', description: 'Analyzing 3 new requests' },
      { step: 3, agent: 'Decision Agent', status: 'Active', description: 'Computing priority scores' },
      { step: 4, agent: 'Staff Agent', status: 'Ready', description: 'Team allocation pending approval' },
      { step: 5, agent: 'Communication Agent', status: 'Ready', description: 'Awaiting client response drafts' },
      { step: 6, agent: 'Monitoring Agent', status: 'Active', description: 'Continuous workload tracking' }
    ],
    stats: {
      emailsProcessedToday: 3,
      projectsAccepted: 1,
      projectsPending: 2,
      autoResponsesSent: 1,
      averageResponseTime: '< 10 minutes'
    }
  }
}

