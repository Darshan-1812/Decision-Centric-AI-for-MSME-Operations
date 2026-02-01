import { getStaffMembers, getTasks } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, CheckCircle2, Clock, AlertTriangle } from "lucide-react"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default async function StaffPage() {
  const [staffMembers, tasks] = await Promise.all([
    getStaffMembers(),
    getTasks()
  ])

  const getStaffTaskStats = (staffId: string) => {
    const staffTasks = tasks.filter(t => t.assigned_to === staffId)
    return {
      total: staffTasks.length,
      pending: staffTasks.filter(t => t.status === 'pending').length,
      inProgress: staffTasks.filter(t => t.status === 'in_progress').length,
      completed: staffTasks.filter(t => t.status === 'completed').length,
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Staff Members</h1>
        <p className="text-muted-foreground">
          Manage your team and view their task assignments
        </p>
      </div>

      <div className="grid gap-4">
        {staffMembers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <User className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground font-medium">No staff members yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Staff members will appear here when they sign up
              </p>
            </CardContent>
          </Card>
        ) : (
          staffMembers.map((staff) => {
            const stats = getStaffTaskStats(staff.id)
            const initials = staff.full_name
              ? staff.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
              : staff.email[0].toUpperCase()

            return (
              <Card key={staff.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {staff.full_name || 'Unnamed'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {staff.email}
                          </p>
                        </div>
                        <Badge variant={staff.is_available ? 'default' : 'secondary'}>
                          {staff.is_available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>

                      {staff.skills && staff.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {staff.skills.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-6 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {stats.pending} pending
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">
                            {stats.inProgress} in progress
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <span className="text-muted-foreground">
                            {stats.completed} completed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
