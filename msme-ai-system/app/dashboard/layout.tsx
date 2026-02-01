import React, { Suspense } from "react"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import type { Profile } from "@/lib/types"

// Demo owner profile for no-auth mode
const demoOwner: Profile = {
  id: 'demo-owner',
  email: 'owner@demo.com',
  full_name: 'Demo Owner',
  role: 'owner',
  skills: [],
  is_available: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Loading fallback for sidebar
function SidebarFallback() {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-card border-r animate-pulse">
      <div className="p-4 space-y-4">
        <div className="h-8 bg-muted rounded w-3/4"></div>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<SidebarFallback />}>
        <SidebarNav user={demoOwner} />
      </Suspense>
      <main className="pl-64">
        <div className="container py-6 px-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
