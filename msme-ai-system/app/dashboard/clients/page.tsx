import { Suspense } from "react"
import { getClients, getProjects } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Briefcase, Mail, Phone, Plus, TrendingUp } from "lucide-react"

async function ClientStats() {
  const clients = await getClients()
  const projects = await getProjects()
  
  const activeClients = clients.filter(c => c.status === 'active').length
  const prospectClients = clients.filter(c => c.status === 'prospect').length
  const totalContractValue = clients.reduce((sum, c) => sum + (c.contract_value || 0), 0)
  const totalProjects = projects.length
  
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{clients.length}</div>
          <p className="text-xs text-muted-foreground">{activeClients} active, {prospectClients} prospect</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Contract Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{(totalContractValue / 1000).toFixed(0)}K</div>
          <p className="text-xs text-muted-foreground">Active contracts</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProjects}</div>
          <p className="text-xs text-muted-foreground">Across all clients</p>
        </CardContent>
      </Card>
    </div>
  )
}

async function ClientsContent() {
  const clients = await getClients()
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {clients.map((client) => (
        <Card key={client.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <Avatar className="h-12 w-12 bg-purple-100">
                <AvatarFallback className="text-purple-600 font-semibold text-lg">
                  {client.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Badge variant={client.status === 'active' ? 'default' : client.status === 'prospect' ? 'secondary' : 'outline'}>
                {client.status}
              </Badge>
            </div>
            <CardTitle className="mt-4">{client.name}</CardTitle>
            <CardDescription>{client.company}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {client.email}
            </div>
            {client.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {client.phone}
              </div>
            )}
            <div className="pt-3 border-t flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contract Value</p>
                <p className="text-lg font-bold">₹{(client.contract_value / 1000).toFixed(0)}K</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Projects</p>
                <p className="text-lg font-bold">{client.projects_count}</p>
              </div>
            </div>
            <Button className="w-full" variant="outline" size="sm">
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client relationships and contracts
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <Suspense fallback={
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      }>
        <ClientStats />
      </Suspense>
    </div>
  )
}
