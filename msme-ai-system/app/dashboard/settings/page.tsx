'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react"

export default function SettingsPage() {
  const [seeding, setSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSeedData = async () => {
    setSeeding(true)
    setSeedResult(null)

    try {
      const response = await fetch('/api/seed', { method: 'POST' })
      const data = await response.json()
      setSeedResult({
        success: data.success,
        message: data.success ? 'Demo data seeded successfully!' : data.error
      })
    } catch (error) {
      setSeedResult({
        success: false,
        message: 'Failed to seed data. Please try again.'
      })
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application settings
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Demo Data
            </CardTitle>
            <CardDescription>
              Seed the database with sample data for testing and demonstration purposes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              This will add sample:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Inventory items with various stock levels</li>
                <li>Tasks with different priorities</li>
                <li>AI decision recommendations</li>
                <li>Inventory alerts</li>
              </ul>
            </div>
            
            <div className="flex items-center gap-4">
              <Button onClick={handleSeedData} disabled={seeding}>
                {seeding ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Seeding...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Seed Demo Data
                  </>
                )}
              </Button>

              {seedResult && (
                <Badge variant={seedResult.success ? 'default' : 'destructive'}>
                  {seedResult.success ? (
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                  ) : (
                    <AlertTriangle className="mr-1 h-3 w-3" />
                  )}
                  {seedResult.message}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Info</CardTitle>
            <CardDescription>
              Information about this application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Application</span>
                <span className="font-medium">MSME Operations Hub</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">AI Agents</span>
                <span className="font-medium">Task Coordinator, Resource Optimizer, Inventory Monitor</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
