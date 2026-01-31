import React from "react"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import type { Profile } from "@/lib/types"

// Demo staff profile for no-auth mode
const demoStaff: Profile = {
  id: 'demo-staff',
  email: 'staff@demo.com',
  full_name: 'Demo Staff',
  role: 'staff',
  skills: ['inventory', 'packaging'],
  is_available: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarNav user={demoStaff} />
      <main className="pl-64">
        <div className="container py-6 px-8 max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  )
}
