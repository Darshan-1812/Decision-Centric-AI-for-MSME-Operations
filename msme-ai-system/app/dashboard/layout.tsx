import React from "react"
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

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarNav user={demoOwner} />
      <main className="pl-64">
        <div className="container py-6 px-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
