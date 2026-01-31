'use client'

import React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Edit, Trash2, AlertTriangle } from "lucide-react"
import type { Resource } from "@/lib/types"
import { cn } from "@/lib/utils"

interface InventoryTableProps {
  resources: Resource[]
  onEdit?: (resource: Resource) => void
  onDelete?: (resource: Resource) => void
}

export function InventoryTable({ resources, onEdit, onDelete }: InventoryTableProps) {
  const getStockStatus = (resource: Resource) => {
    const percentage = (resource.quantity / resource.max_threshold) * 100
    
    if (resource.quantity <= resource.min_threshold) {
      return { label: 'Low Stock', variant: 'destructive' as const, percentage }
    }
    if (percentage > 90) {
      return { label: 'Overstock', variant: 'secondary' as const, percentage }
    }
    return { label: 'In Stock', variant: 'default' as const, percentage }
  }

  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg">
        <Package className="h-12 w-12 text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground">No inventory items</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Item</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Stock Level</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => {
            const status = getStockStatus(resource)
            const isLow = resource.quantity <= resource.min_threshold
            
            return (
              <TableRow key={resource.id} className={cn(isLow && "bg-destructive/5")}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {isLow && <AlertTriangle className="h-4 w-4 text-destructive" />}
                    {resource.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {resource.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {resource.quantity} {resource.unit}
                </TableCell>
                <TableCell>
                  <div className="w-24">
                    <Progress 
                      value={Math.min(status.percentage, 100)} 
                      className={cn(
                        "h-2",
                        isLow && "[&>div]:bg-destructive"
                      )}
                    />
                    <span className="text-xs text-muted-foreground">
                      {resource.min_threshold} - {resource.max_threshold}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(resource)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => onDelete(resource)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

function Package(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}
