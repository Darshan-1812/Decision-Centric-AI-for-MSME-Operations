export type EnterpriseType = 
  | 'micro_kirana' 
  | 'micro_grocery'
  | 'small_restaurant' 
  | 'small_cafe'
  | 'small_startup'
  | 'medium_factory'
  | 'medium_logistics'
  | 'medium_food_processing'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'owner' | 'staff'
  skills: string[]
  is_available: boolean
  enterprise_type?: EnterpriseType
  business_name?: string
  business_category?: 'micro' | 'small' | 'medium'
  created_at: string
  updated_at: string
}

export interface Resource {
  id: string
  name: string
  type: string
  quantity: number
  unit: string
  min_threshold: number
  max_threshold: number
  cost_per_unit: number
  supplier: string | null
  last_restocked_at: string | null
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to: string | null
  created_by: string | null
  due_date: string | null
  completed_at: string | null
  ai_generated: boolean
  created_at: string
  updated_at: string
  assignee?: Profile | null
}

export interface AIDecision {
  id: string
  agent_type: 'task_coordinator' | 'resource_optimizer' | 'inventory_monitor' | 'client_agent' | 'project_agent' | 'staff_agent' | 'decision_agent' | 'email_agent' | 'requirement_agent' | 'monitoring_agent' | 'communication_agent'
  decision_type: string
  title: string
  description: string
  confidence: number
  status: 'pending' | 'approved' | 'rejected' | 'implemented'
  context: Record<string, unknown>
  approved_by: string | null
  approved_at: string | null
  created_at: string
  priority_score?: number
  reasoning?: string[]
}

// Email Intake & Project Request
export interface ProjectRequest {
  id: string
  client_email: string
  client_name: string
  client_company: string
  raw_email_content: string
  project_type: string
  deadline: string
  budget: number
  advance_paid: boolean
  advance_amount?: number
  estimated_effort_days: number
  status: 'new' | 'analyzed' | 'prioritized' | 'assigned' | 'in_progress' | 'delayed' | 'completed'
  priority_score?: number
  priority_level?: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW'
  reasoning?: string[]
  assigned_team?: string[]
  created_at: string
  processed_at?: string
}

// Priority Scoring Factors
export interface PriorityFactors {
  deadline_urgency: number  // 0-40 points (40% weight)
  payment_status: number    // 0-25 points (25% weight)
  project_value: number     // 0-15 points (15% weight)
  client_importance: number // 0-10 points (10% weight)
  team_load_penalty: number // -10 to 0 points (10% penalty)
  total_score: number       // Final priority score
}

export interface InventoryAlert {
  id: string
  resource_id: string
  alert_type: 'low_stock' | 'overstock' | 'expiring' | 'reorder'
  message: string
  severity: 'info' | 'warning' | 'critical'
  is_resolved: boolean
  resolved_at: string | null
  resolved_by: string | null
  created_at: string
  resource?: Resource
}

export interface DashboardStats {
  totalTasks: number
  pendingTasks: number
  completedTasks: number
  totalResources: number
  lowStockItems: number
  activeAlerts: number
  staffCount: number
  availableStaff: number
  aiDecisionsPending: number
}

// Service Startup specific types
export interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string | null
  status: 'active' | 'inactive' | 'prospect'
  contract_value: number
  projects_count: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  client_id: string
  client?: Client
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  start_date: string
  deadline: string
  budget: number
  team_members: string[]
  progress: number
  description: string | null
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  client_id: string
  client?: Client
  project_id: string | null
  project?: Project | null
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  issue_date: string
  due_date: string
  paid_date: string | null
  created_at: string
}

// Enterprise Configuration Types
export type DashboardModule = 
  | 'inventory'
  | 'sales'
  | 'orders'
  | 'staff'
  | 'suppliers'
  | 'deliveries'
  | 'production'
  | 'quality'
  | 'logistics'
  | 'warehouse'
  | 'clients'
  | 'projects'
  | 'billing'

export interface EnterpriseConfig {
  type: EnterpriseType
  category: 'micro' | 'small' | 'medium'
  name: string
  icon: string
  description: string
  features: string[]
  dashboardModules: DashboardModule[]
  primaryColor: string
}

// Enterprise-specific configurations
export const ENTERPRISE_CONFIGS: Record<EnterpriseType, EnterpriseConfig> = {
  micro_kirana: {
    type: 'micro_kirana',
    category: 'micro',
    name: 'Kirana Store',
    icon: '🏪',
    description: 'Small neighborhood grocery store',
    features: ['Daily sales tracking', 'Inventory management', 'Customer billing', 'Quick restocking'],
    dashboardModules: ['inventory', 'sales', 'orders', 'suppliers'],
    primaryColor: 'hsl(142, 76%, 36%)'
  },
  micro_grocery: {
    type: 'micro_grocery',
    category: 'micro',
    name: 'Grocery Shop',
    icon: '🛒',
    description: 'Local grocery retail shop',
    features: ['Stock management', 'Daily sales', 'Vendor management', 'Perishable tracking'],
    dashboardModules: ['inventory', 'sales', 'orders', 'suppliers'],
    primaryColor: 'hsl(142, 76%, 36%)'
  },
  small_restaurant: {
    type: 'small_restaurant',
    category: 'small',
    name: 'Local Restaurant',
    icon: '🍽️',
    description: 'Small dining establishment',
    features: ['Menu management', 'Kitchen operations', 'Staff scheduling', 'Order tracking', 'Table management'],
    dashboardModules: ['inventory', 'orders', 'staff', 'sales', 'suppliers'],
    primaryColor: 'hsl(24, 95%, 53%)'
  },
  small_cafe: {
    type: 'small_cafe',
    category: 'small',
    name: 'Café',
    icon: '☕',
    description: 'Coffee shop and light dining',
    features: ['Beverage inventory', 'Table management', 'Staff shifts', 'Daily sales', 'Recipe management'],
    dashboardModules: ['inventory', 'orders', 'staff', 'sales'],
    primaryColor: 'hsl(35, 91%, 56%)'
  },
  small_startup: {
    type: 'small_startup',
    category: 'small',
    name: 'Service Startup',
    icon: '💼',
    description: 'Service-based startup company',
    features: ['Client management', 'Project tracking', 'Staff allocation', 'Billing & invoicing', 'Service delivery', 'Performance metrics'],
    dashboardModules: ['clients', 'projects', 'staff', 'billing', 'orders'],
    primaryColor: 'hsl(280, 85%, 60%)'
  },
  medium_factory: {
    type: 'medium_factory',
    category: 'medium',
    name: 'Manufacturing Factory',
    icon: '🏭',
    description: 'Medium-scale production facility',
    features: ['Production planning', 'Quality control', 'Warehouse management', 'Staff shifts', 'Equipment tracking'],
    dashboardModules: ['production', 'inventory', 'quality', 'staff', 'warehouse', 'logistics'],
    primaryColor: 'hsl(217, 91%, 60%)'
  },
  medium_logistics: {
    type: 'medium_logistics',
    category: 'medium',
    name: 'Logistics & Transport',
    icon: '🚚',
    description: 'Regional delivery and transport services',
    features: ['Fleet management', 'Route optimization', 'Delivery tracking', 'Driver management', 'Fuel monitoring'],
    dashboardModules: ['deliveries', 'logistics', 'staff', 'orders', 'warehouse'],
    primaryColor: 'hsl(262, 83%, 58%)'
  },
  medium_food_processing: {
    type: 'medium_food_processing',
    category: 'medium',
    name: 'Food Processing Unit',
    icon: '🏭',
    description: 'Food manufacturing and packaging',
    features: ['Production batches', 'Quality assurance', 'Packaging tracking', 'Cold storage', 'Safety compliance'],
    dashboardModules: ['production', 'quality', 'inventory', 'warehouse', 'staff', 'suppliers'],
    primaryColor: 'hsl(173, 80%, 40%)'
  }
}
