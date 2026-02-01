import { Suspense } from "react"
import { getInvoices } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  CreditCard, 
  Plus, 
  IndianRupee, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Download
} from "lucide-react"

export const dynamic = 'force-dynamic'

async function BillingStats() {
  const invoices = await getInvoices()
  
  const paidInvoices = invoices.filter(i => i.status === 'paid')
  const pendingInvoices = invoices.filter(i => i.status === 'sent')
  const overdueInvoices = invoices.filter(i => i.status === 'overdue')
  
  const totalRevenue = paidInvoices.reduce((sum, i) => sum + i.amount, 0)
  const pendingAmount = pendingInvoices.reduce((sum, i) => sum + i.amount, 0)
  const overdueAmount = overdueInvoices.reduce((sum, i) => sum + i.amount, 0)
  
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{(totalRevenue / 1000).toFixed(0)}K</div>
          <p className="text-xs text-muted-foreground">Paid invoices</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{(pendingAmount / 1000).toFixed(0)}K</div>
          <p className="text-xs text-muted-foreground">Awaiting payment</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{(overdueAmount / 1000).toFixed(0)}K</div>
          <p className="text-xs text-muted-foreground text-red-600">Needs follow-up</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{invoices.length}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>
    </div>
  )
}

async function InvoicesContent() {
  const invoices = await getInvoices()
  
  if (invoices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No invoices yet. Create your first invoice to get started.
      </div>
    )
  }
  
  return (
    <div className="space-y-3">
      {invoices.map((invoice) => (
        <Card key={invoice.id} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                  <IndianRupee className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{invoice.client?.company}</p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.project?.name || 'General Invoice'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">₹{(invoice.amount / 1000).toFixed(1)}K</p>
                      <Badge variant={
                        invoice.status === 'paid' ? 'default' :
                        invoice.status === 'overdue' ? 'destructive' :
                        invoice.status === 'sent' ? 'secondary' :
                        'outline'
                      } className="mt-1">
                        {invoice.status === 'paid' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {invoice.status === 'overdue' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {invoice.status === 'sent' && <Clock className="h-3 w-3 mr-1" />}
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span>Invoice #{invoice.id}</span>
                    <span>Issued: {new Date(invoice.issue_date).toLocaleDateString()}</span>
                    <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                    {invoice.paid_date && (
                      <span className="text-green-600">Paid: {new Date(invoice.paid_date).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing & Invoices</h1>
          <p className="text-muted-foreground">
            Manage invoices and track payments
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <Suspense fallback={
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      }>
        <BillingStats />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>View and manage all your invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
            </div>
          }>
            <InvoicesContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
