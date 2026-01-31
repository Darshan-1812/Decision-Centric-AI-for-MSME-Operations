'use client'

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Users,
  Brain,
  MessageSquare,
  Settings,
  Home,
  Building2,
  LogOut,
  Briefcase,
  FolderKanban,
  CreditCard,
  Truck,
  Factory,
  FlaskConical,
  Warehouse,
  ShoppingCart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Profile, EnterpriseType } from "@/lib/types"

interface SidebarNavProps {
  user: Profile | null
}

const getNavItemsForEnterprise = (enterpriseType: EnterpriseType | null) => {
  const baseItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/tasks', label: 'Tasks', icon: ClipboardList },
  ]

  let specificItems: any[] = []

  if (!enterpriseType) {
    // Default items when no enterprise type is selected
    specificItems = [
      { href: '/dashboard/inventory', label: 'Inventory', icon: Package },
      { href: '/dashboard/staff', label: 'Staff', icon: Users },
    ]
  } else if (enterpriseType === 'micro_kirana' || enterpriseType === 'micro_grocery') {
    // Micro enterprises: Kirana/Grocery
    specificItems = [
      { href: '/dashboard/inventory', label: 'Inventory', icon: Package },
      { href: '/dashboard/sales', label: 'Sales', icon: ShoppingCart },
      { href: '/dashboard/staff', label: 'Staff', icon: Users },
      { href: '/dashboard/suppliers', label: 'Suppliers', icon: Truck },
    ]
  } else if (enterpriseType === 'small_restaurant' || enterpriseType === 'small_cafe') {
    // Small enterprises: Restaurant/Café
    specificItems = [
      { href: '/dashboard/inventory', label: 'Inventory', icon: Package },
      { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
      { href: '/dashboard/staff', label: 'Staff', icon: Users },
      { href: '/dashboard/sales', label: 'Sales', icon: ShoppingCart },
    ]
  } else if (enterpriseType === 'small_startup') {
    // Small enterprises: Service Startup
    specificItems = [
      { href: '/dashboard/clients', label: 'Clients', icon: Briefcase },
      { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
      { href: '/dashboard/staff', label: 'Team', icon: Users },
      { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
    ]
  } else if (enterpriseType === 'medium_factory') {
    // Medium enterprises: Factory
    specificItems = [
      { href: '/dashboard/production', label: 'Production', icon: Factory },
      { href: '/dashboard/quality', label: 'Quality', icon: FlaskConical },
      { href: '/dashboard/warehouse', label: 'Warehouse', icon: Warehouse },
      { href: '/dashboard/staff', label: 'Staff', icon: Users },
    ]
  } else if (enterpriseType === 'medium_logistics') {
    // Medium enterprises: Logistics
    specificItems = [
      { href: '/dashboard/deliveries', label: 'Deliveries', icon: Truck },
      { href: '/dashboard/fleet', label: 'Fleet', icon: Truck },
      { href: '/dashboard/staff', label: 'Drivers', icon: Users },
      { href: '/dashboard/warehouse', label: 'Warehouse', icon: Warehouse },
    ]
  } else if (enterpriseType === 'medium_food_processing') {
    // Medium enterprises: Food Processing
    specificItems = [
      { href: '/dashboard/production', label: 'Production', icon: Factory },
      { href: '/dashboard/quality', label: 'Quality', icon: FlaskConical },
      { href: '/dashboard/inventory', label: 'Inventory', icon: Package },
      { href: '/dashboard/warehouse', label: 'Cold Storage', icon: Warehouse },
      { href: '/dashboard/staff', label: 'Staff', icon: Users },
    ]
  }

  const endItems = [
    { href: '/dashboard/ai-agents', label: 'AI Agents', icon: MessageSquare },
    { href: '/dashboard/ai-decisions', label: 'AI Decisions', icon: Brain },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  return [...baseItems, ...specificItems, ...endItems]
}

const staffNavItems = [
  { href: '/staff', label: 'My Tasks', icon: ClipboardList },
]

const handleSignOut = () => {
  // Implement sign out logic here
}

export function SidebarNav({ user }: SidebarNavProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const enterpriseType = searchParams.get('type') as EnterpriseType | null

  const navItems = user?.role === 'owner' ? getNavItemsForEnterprise(enterpriseType) : staffNavItems

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <Building2 className="h-6 w-6 text-sidebar-primary" />
          <span className="font-semibold">MSME Operations</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const href = enterpriseType ? `${item.href}?type=${enterpriseType}` : item.href
            return (
              <Link
                key={item.href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          {user && (
            <div className="mb-3">
              <p className="text-sm font-medium">{user.full_name || user.email}</p>
              <p className="text-xs text-sidebar-foreground/60 capitalize">{user.role}</p>
            </div>
          )}
          <Link href="/">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  )
}
