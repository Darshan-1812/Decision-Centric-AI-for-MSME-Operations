import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()

  try {
    // Seed sample resources
    const resources = [
      { name: 'Cardboard Boxes (Small)', type: 'Packaging', quantity: 45, unit: 'units', min_threshold: 50, max_threshold: 200, cost_per_unit: 0.50, supplier: 'PackCo Supplies' },
      { name: 'Cardboard Boxes (Large)', type: 'Packaging', quantity: 12, unit: 'units', min_threshold: 25, max_threshold: 100, cost_per_unit: 1.25, supplier: 'PackCo Supplies' },
      { name: 'Bubble Wrap Roll', type: 'Packaging', quantity: 8, unit: 'rolls', min_threshold: 10, max_threshold: 50, cost_per_unit: 15.00, supplier: 'PackCo Supplies' },
      { name: 'Packing Tape', type: 'Supplies', quantity: 24, unit: 'rolls', min_threshold: 15, max_threshold: 60, cost_per_unit: 3.50, supplier: 'Office Depot' },
      { name: 'Label Printer Paper', type: 'Supplies', quantity: 150, unit: 'sheets', min_threshold: 100, max_threshold: 500, cost_per_unit: 0.05, supplier: 'Office Depot' },
      { name: 'Steel Rods (10mm)', type: 'Raw Material', quantity: 35, unit: 'kg', min_threshold: 50, max_threshold: 200, cost_per_unit: 2.80, supplier: 'MetalWorks Inc' },
      { name: 'Aluminum Sheets', type: 'Raw Material', quantity: 18, unit: 'units', min_threshold: 20, max_threshold: 80, cost_per_unit: 12.50, supplier: 'MetalWorks Inc' },
      { name: 'Lubricant Oil', type: 'Equipment', quantity: 5, unit: 'liters', min_threshold: 8, max_threshold: 30, cost_per_unit: 8.00, supplier: 'Industrial Supplies' },
    ]

    await supabase.from('resources').insert(resources)

    // Seed sample tasks (without assignment - will be assigned by AI or manually)
    const tasks = [
      { title: 'Inventory count - warehouse section A', description: 'Complete physical count of all items in warehouse section A', priority: 'high', status: 'pending' },
      { title: 'Package outgoing orders', description: 'Package and label 15 pending customer orders for shipping', priority: 'urgent', status: 'pending' },
      { title: 'Clean and organize workshop', description: 'Weekly cleaning and organization of the main workshop area', priority: 'low', status: 'pending' },
      { title: 'Quality check finished products', description: 'Inspect batch #2024-45 for quality control', priority: 'high', status: 'pending' },
      { title: 'Update inventory system', description: 'Enter recent deliveries into the inventory management system', priority: 'medium', status: 'pending' },
      { title: 'Prepare shipment documentation', description: 'Create shipping labels and documentation for international orders', priority: 'medium', status: 'pending' },
      { title: 'Equipment maintenance check', description: 'Monthly maintenance inspection of CNC machine', priority: 'medium', status: 'pending' },
      { title: 'Restock office supplies', description: 'Order and restock essential office supplies', priority: 'low', status: 'pending' },
    ]

    await supabase.from('tasks').insert(tasks)

    // Seed sample AI decisions
    const aiDecisions = [
      {
        agent_type: 'inventory_monitor',
        decision_type: 'restock_alert',
        title: 'Low stock alert: Cardboard Boxes (Large)',
        description: 'Current stock of large cardboard boxes is at 12 units, below the minimum threshold of 25. Recommend ordering 50 units from PackCo Supplies to reach optimal stock levels.',
        confidence: 0.92,
        status: 'pending',
        context: { resourceId: null, suggestedQuantity: 50, urgency: 'high' }
      },
      {
        agent_type: 'inventory_monitor',
        decision_type: 'restock_alert',
        title: 'Low stock alert: Lubricant Oil',
        description: 'Lubricant oil inventory is at 5 liters, below the minimum threshold of 8 liters. Equipment maintenance is scheduled this week. Recommend ordering 15 liters.',
        confidence: 0.88,
        status: 'pending',
        context: { resourceId: null, suggestedQuantity: 15, urgency: 'medium' }
      },
      {
        agent_type: 'task_coordinator',
        decision_type: 'task_assignment',
        title: 'Urgent: Assign packaging tasks',
        description: 'There are 15 pending customer orders that need packaging today. Recommend assigning this task to available staff members with packaging experience.',
        confidence: 0.85,
        status: 'pending',
        context: { taskPriority: 'urgent', estimatedTime: '3 hours' }
      },
      {
        agent_type: 'resource_optimizer',
        decision_type: 'optimization',
        title: 'Consolidate supplier orders',
        description: 'Multiple items from PackCo Supplies are running low. Consider consolidating orders to reduce shipping costs. Estimated savings: $15-25 per order.',
        confidence: 0.78,
        status: 'pending',
        context: { area: 'cost', estimatedSavings: '$15-25' }
      },
    ]

    await supabase.from('ai_decisions').insert(aiDecisions)

    // Seed inventory alerts
    const { data: resourcesData } = await supabase.from('resources').select('id, name').limit(3)
    
    if (resourcesData && resourcesData.length > 0) {
      const alerts = [
        {
          resource_id: resourcesData[0]?.id,
          alert_type: 'low_stock',
          message: `${resourcesData[0]?.name} is running low. Current stock is below minimum threshold.`,
          severity: 'warning',
          is_resolved: false
        },
      ]
      await supabase.from('inventory_alerts').insert(alerts)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Demo data seeded successfully',
      seeded: {
        resources: resources.length,
        tasks: tasks.length,
        aiDecisions: aiDecisions.length,
      }
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
