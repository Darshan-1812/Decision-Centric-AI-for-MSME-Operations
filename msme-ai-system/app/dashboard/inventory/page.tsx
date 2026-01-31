'use client'

import React from "react"

import { useEffect, useState, useTransition } from "react"
import { getResources, createResource, updateResource, deleteResource } from "@/lib/actions"
import { InventoryTable } from "@/components/dashboard/inventory-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Package } from "lucide-react"
import type { Resource } from "@/lib/types"

const resourceTypes = [
  'Raw Material',
  'Equipment',
  'Supplies',
  'Packaging',
  'Finished Goods',
  'Other'
]

export default function InventoryPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'Raw Material',
    quantity: 0,
    unit: 'units',
    min_threshold: 10,
    max_threshold: 100,
    cost_per_unit: 0,
    supplier: '',
  })

  const loadResources = async () => {
    const data = await getResources()
    setResources(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadResources()
  }, [])

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Raw Material',
      quantity: 0,
      unit: 'units',
      min_threshold: 10,
      max_threshold: 100,
      cost_per_unit: 0,
      supplier: '',
    })
    setEditingResource(null)
  }

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource)
    setFormData({
      name: resource.name,
      type: resource.type,
      quantity: resource.quantity,
      unit: resource.unit,
      min_threshold: resource.min_threshold,
      max_threshold: resource.max_threshold,
      cost_per_unit: resource.cost_per_unit,
      supplier: resource.supplier || '',
    })
    setDialogOpen(true)
  }

  const handleDelete = (resource: Resource) => {
    if (!confirm(`Are you sure you want to delete "${resource.name}"?`)) return
    
    startTransition(async () => {
      await deleteResource(resource.id)
      loadResources()
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    startTransition(async () => {
      if (editingResource) {
        await updateResource(editingResource.id, formData)
      } else {
        await createResource(formData)
      }
      setDialogOpen(false)
      resetForm()
      loadResources()
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Track and manage your inventory levels
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingResource ? 'Edit Item' : 'Add Inventory Item'}
                </DialogTitle>
                <DialogDescription>
                  {editingResource ? 'Update inventory item details' : 'Add a new item to your inventory'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Item name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {resourceTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="e.g., units, kg, liters"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_threshold">Min Threshold</Label>
                    <Input
                      id="min_threshold"
                      type="number"
                      min="0"
                      value={formData.min_threshold}
                      onChange={(e) => setFormData(prev => ({ ...prev, min_threshold: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_threshold">Max Threshold</Label>
                    <Input
                      id="max_threshold"
                      type="number"
                      min="0"
                      value={formData.max_threshold}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_threshold: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cost_per_unit">Cost per Unit</Label>
                    <Input
                      id="cost_per_unit"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.cost_per_unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost_per_unit: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input
                      id="supplier"
                      value={formData.supplier}
                      onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                      placeholder="Supplier name"
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Saving...' : editingResource ? 'Update' : 'Add Item'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading inventory...</p>
          </CardContent>
        </Card>
      ) : (
        <InventoryTable 
          resources={resources} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
