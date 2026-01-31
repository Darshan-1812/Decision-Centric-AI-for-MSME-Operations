"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ENTERPRISE_CONFIGS, EnterpriseType } from "@/lib/types"
import { 
  Package, 
  ShoppingCart, 
  ClipboardList, 
  Users,
  Truck,
  Factory,
  FlaskConical,
  Warehouse,
  BarChart3,
  TrendingUp,
  Briefcase,
  FolderKanban,
  CreditCard
} from "lucide-react"

interface EnterpriseHeaderProps {
  type: EnterpriseType
}

export function EnterpriseHeader({ type }: EnterpriseHeaderProps) {
  const config = ENTERPRISE_CONFIGS[type]

  return (
    <Card className="mb-6 border-2" style={{ borderColor: config.primaryColor }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="flex h-16 w-16 items-center justify-center rounded-xl text-4xl"
              style={{ backgroundColor: `${config.primaryColor}15` }}
            >
              {config.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-2xl">{config.name}</CardTitle>
                <Badge variant="outline" className="capitalize">
                  {config.category} Enterprise
                </Badge>
              </div>
              <CardDescription className="text-base">
                {config.description}
              </CardDescription>
            </div>
          </div>
          <Badge 
            className="px-4 py-2 text-sm"
            style={{ backgroundColor: config.primaryColor }}
          >
            Active
          </Badge>
        </div>
      </CardHeader>
    </Card>
  )
}

interface ModuleIconProps {
  module: string
}

export function ModuleIcon({ module }: ModuleIconProps) {
  const iconMap: Record<string, React.ReactNode> = {
    inventory: <Package className="h-5 w-5" />,
    sales: <TrendingUp className="h-5 w-5" />,
    orders: <ShoppingCart className="h-5 w-5" />,
    staff: <Users className="h-5 w-5" />,
    suppliers: <Truck className="h-5 w-5" />,
    deliveries: <Truck className="h-5 w-5" />,
    production: <Factory className="h-5 w-5" />,
    quality: <FlaskConical className="h-5 w-5" />,
    logistics: <Truck className="h-5 w-5" />,
    warehouse: <Warehouse className="h-5 w-5" />,
    clients: <Briefcase className="h-5 w-5" />,
    projects: <FolderKanban className="h-5 w-5" />,
    billing: <CreditCard className="h-5 w-5" />,
  }

  return iconMap[module] || <ClipboardList className="h-5 w-5" />
}

interface MicroDashboardStatsProps {
  type: EnterpriseType
}

export function MicroDashboardStats({ type }: MicroDashboardStatsProps) {
  const config = ENTERPRISE_CONFIGS[type]

  // Micro enterprise specific stats
  const stats = [
    { 
      title: "Today's Sales", 
      value: "₹12,450", 
      change: "+18%",
      module: "sales" 
    },
    { 
      title: "Items in Stock", 
      value: "342", 
      change: "12 low",
      module: "inventory" 
    },
    { 
      title: "Pending Orders", 
      value: "8", 
      change: "2 urgent",
      module: "orders" 
    },
    { 
      title: "Suppliers", 
      value: "15", 
      change: "3 active today",
      module: "suppliers" 
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <Card key={idx} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${config.primaryColor}15` }}
            >
              <ModuleIcon module={stat.module} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.change} from yesterday
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function SmallDashboardStats({ type }: { type: EnterpriseType }) {
  const config = ENTERPRISE_CONFIGS[type]

  const isRestaurant = type === 'small_restaurant'
  const isCafe = type === 'small_cafe'
  const isStartup = type === 'small_startup'

  const stats = isRestaurant ? [
    { title: "Today's Revenue", value: "₹45,230", change: "+12%", module: "sales" },
    { title: "Active Tables", value: "8/15", change: "53% occupied", module: "orders" },
    { title: "Kitchen Orders", value: "23", change: "5 pending", module: "orders" },
    { title: "Staff On Duty", value: "6/8", change: "2 on break", module: "staff" },
  ] : isCafe ? [
    { title: "Today's Revenue", value: "₹18,450", change: "+8%", module: "sales" },
    { title: "Orders Served", value: "87", change: "+15 from avg", module: "orders" },
    { title: "Inventory Items", value: "156", change: "8 low stock", module: "inventory" },
    { title: "Staff On Shift", value: "4/5", change: "1 on break", module: "staff" },
  ] : [
    { title: "Active Clients", value: "24", change: "+3 this month", module: "clients" },
    { title: "Ongoing Projects", value: "12", change: "5 near deadline", module: "projects" },
    { title: "Team Members", value: "8/10", change: "2 on leave", module: "staff" },
    { title: "Monthly Revenue", value: "₹2.4L", change: "+18% MoM", module: "billing" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <Card key={idx} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${config.primaryColor}15` }}
            >
              <ModuleIcon module={stat.module} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function MediumDashboardStats({ type }: { type: EnterpriseType }) {
  const config = ENTERPRISE_CONFIGS[type]

  const isFactory = type === 'medium_factory'
  const isLogistics = type === 'medium_logistics'
  const isFoodProcessing = type === 'medium_food_processing'

  let stats
  
  if (isFactory) {
    stats = [
      { title: "Production Today", value: "1,245 units", change: "+5%", module: "production" },
      { title: "Quality Pass Rate", value: "98.2%", change: "+0.5%", module: "quality" },
      { title: "Warehouse Stock", value: "8,450 units", change: "85% capacity", module: "warehouse" },
      { title: "Staff on Floor", value: "45/50", change: "5 on break", module: "staff" },
    ]
  } else if (isLogistics) {
    stats = [
      { title: "Active Deliveries", value: "34", change: "12 in transit", module: "deliveries" },
      { title: "Fleet Utilization", value: "78%", change: "18 vehicles", module: "logistics" },
      { title: "On-Time Rate", value: "94.5%", change: "+2.1%", module: "deliveries" },
      { title: "Drivers Active", value: "22/25", change: "3 on rest", module: "staff" },
    ]
  } else {
    stats = [
      { title: "Batches Today", value: "12", change: "8 completed", module: "production" },
      { title: "Quality Checks", value: "98.5%", change: "147 passed", module: "quality" },
      { title: "Cold Storage", value: "82%", change: "Optimal temp", module: "warehouse" },
      { title: "Production Staff", value: "32/35", change: "3 on break", module: "staff" },
    ]
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <Card key={idx} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${config.primaryColor}15` }}
            >
              <ModuleIcon module={stat.module} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
