import { streamText, tool, convertToModelMessages } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { messages, agentType } = await req.json()

  const supabase = await createClient()

  // Fetch current business data for context
  const [
    { data: tasks },
    { data: resources },
    { data: staff },
    { data: pendingDecisions }
  ] = await Promise.all([
    supabase.from('tasks').select('*').order('created_at', { ascending: false }).limit(50),
    supabase.from('resources').select('*'),
    supabase.from('profiles').select('*').eq('role', 'staff'),
    supabase.from('ai_decisions').select('*').eq('status', 'pending')
  ])

  const businessContext = {
    tasks: tasks || [],
    resources: resources || [],
    staff: staff || [],
    pendingDecisions: pendingDecisions || [],
    lowStockItems: (resources || []).filter(r => r.quantity <= r.min_threshold),
    pendingTasks: (tasks || []).filter(t => t.status === 'pending'),
    availableStaff: (staff || []).filter(s => s.is_available),
  }

  const systemPrompt = getSystemPrompt(agentType, businessContext)

  const result = streamText({
    model: 'openai/gpt-4o-mini',
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools: {
      createAIDecision: tool({
        description: 'Create an AI decision recommendation for the owner to review',
        inputSchema: z.object({
          decisionType: z.string().describe('Type of decision: task_assignment, restock_alert, optimization, workload_balance'),
          title: z.string().describe('Short title for the decision'),
          description: z.string().describe('Detailed description of the recommendation'),
          confidence: z.number().min(0).max(1).describe('Confidence level from 0 to 1'),
          context: z.record(z.any()).optional().describe('Additional context data'),
        }),
        execute: async ({ decisionType, title, description, confidence, context }) => {
          const { data, error } = await supabase.from('ai_decisions').insert({
            agent_type: agentType,
            decision_type: decisionType,
            title,
            description,
            confidence,
            context: context || {},
            status: 'pending'
          }).select().single()

          if (error) {
            return { success: false, error: error.message }
          }
          return { success: true, decision: data }
        }
      }),

      assignTask: tool({
        description: 'Assign a pending task to an available staff member',
        inputSchema: z.object({
          taskId: z.string().describe('ID of the task to assign'),
          staffId: z.string().describe('ID of the staff member to assign'),
          reason: z.string().describe('Reason for this assignment'),
        }),
        execute: async ({ taskId, staffId, reason }) => {
          // First create a decision for owner approval
          const { data, error } = await supabase.from('ai_decisions').insert({
            agent_type: 'task_coordinator',
            decision_type: 'task_assignment',
            title: `Assign task to staff member`,
            description: reason,
            confidence: 0.85,
            context: { taskId, staffId },
            status: 'pending'
          }).select().single()

          if (error) {
            return { success: false, error: error.message }
          }
          return { success: true, message: 'Task assignment queued for owner approval', decision: data }
        }
      }),

      createRestockAlert: tool({
        description: 'Create a restock alert for low inventory items',
        inputSchema: z.object({
          resourceId: z.string().describe('ID of the resource'),
          suggestedQuantity: z.number().describe('Suggested quantity to reorder'),
          urgency: z.enum(['low', 'medium', 'high']).describe('Urgency level'),
          reason: z.string().describe('Reason for the restock recommendation'),
        }),
        execute: async ({ resourceId, suggestedQuantity, urgency, reason }) => {
          const { data, error } = await supabase.from('ai_decisions').insert({
            agent_type: 'inventory_monitor',
            decision_type: 'restock_alert',
            title: `Restock recommendation`,
            description: reason,
            confidence: urgency === 'high' ? 0.95 : urgency === 'medium' ? 0.8 : 0.7,
            context: { resourceId, suggestedQuantity, urgency },
            status: 'pending'
          }).select().single()

          if (error) {
            return { success: false, error: error.message }
          }
          return { success: true, message: 'Restock alert created', decision: data }
        }
      }),

      suggestOptimization: tool({
        description: 'Suggest a resource or process optimization',
        inputSchema: z.object({
          area: z.enum(['staffing', 'inventory', 'workflow', 'cost']).describe('Area of optimization'),
          title: z.string().describe('Title of the optimization'),
          suggestion: z.string().describe('Detailed suggestion'),
          estimatedImpact: z.string().describe('Estimated impact of implementing this suggestion'),
        }),
        execute: async ({ area, title, suggestion, estimatedImpact }) => {
          const { data, error } = await supabase.from('ai_decisions').insert({
            agent_type: 'resource_optimizer',
            decision_type: 'optimization',
            title,
            description: `${suggestion}\n\nEstimated Impact: ${estimatedImpact}`,
            confidence: 0.75,
            context: { area, estimatedImpact },
            status: 'pending'
          }).select().single()

          if (error) {
            return { success: false, error: error.message }
          }
          return { success: true, message: 'Optimization suggestion created', decision: data }
        }
      }),
    },
  })

  return result.toUIMessageStreamResponse()
}

function getSystemPrompt(agentType: string, context: any): string {
  const baseContext = `
Current Business State:
- Total Tasks: ${context.tasks.length} (${context.pendingTasks.length} pending)
- Total Resources: ${context.resources.length} (${context.lowStockItems.length} low stock)
- Staff Members: ${context.staff.length} (${context.availableStaff.length} available)
- Pending AI Decisions: ${context.pendingDecisions.length}

Low Stock Items: ${JSON.stringify(context.lowStockItems.map((r: any) => ({ name: r.name, quantity: r.quantity, min: r.min_threshold })))}
Pending Tasks: ${JSON.stringify(context.pendingTasks.map((t: any) => ({ id: t.id, title: t.title, priority: t.priority, assigned_to: t.assigned_to })))}
Available Staff: ${JSON.stringify(context.availableStaff.map((s: any) => ({ id: s.id, name: s.full_name, skills: s.skills })))}
`

  switch (agentType) {
    case 'task_coordinator':
      return `You are a Task Coordinator AI agent for an MSME operations management system.
Your role is to analyze pending tasks and available staff, then make smart assignment recommendations.

${baseContext}

Guidelines:
- Consider task priority when making assignments
- Balance workload across staff members
- Match staff skills to task requirements when possible
- Create AI decisions for task assignments that require owner approval
- Be concise and actionable in your recommendations`

    case 'resource_optimizer':
      return `You are a Resource Optimizer AI agent for an MSME operations management system.
Your role is to analyze resource usage patterns and suggest optimizations.

${baseContext}

Guidelines:
- Identify inefficiencies in resource allocation
- Suggest cost-saving measures
- Recommend workflow improvements
- Consider staff availability and workload
- Create AI decisions for optimizations that require owner approval`

    case 'inventory_monitor':
      return `You are an Inventory Monitor AI agent for an MSME operations management system.
Your role is to track inventory levels and proactively alert about stock issues.

${baseContext}

Guidelines:
- Monitor items that are at or below minimum threshold
- Create restock alerts with appropriate urgency levels
- Suggest optimal reorder quantities based on usage patterns
- Consider supplier information when making recommendations
- Create AI decisions for restock actions that require owner approval`

    default:
      return `You are an AI assistant for an MSME operations management system.
Help the business owner manage tasks, inventory, and staff efficiently.

${baseContext}

Available actions:
- Create AI decisions for owner review
- Assign tasks to staff (requires approval)
- Create restock alerts
- Suggest optimizations`
  }
}
