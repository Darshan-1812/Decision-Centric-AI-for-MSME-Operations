"""
Unified Data Models for MSME Operations
All industries use these universal objects
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime
from enum import Enum


class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    DELAYED = "delayed"
    CANCELLED = "cancelled"


class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class Task(BaseModel):
    """Universal Task Model - Works for ALL MSMEs"""
    task_id: str
    type: str  # order_fulfillment, production, delivery, etc.
    priority: TaskPriority = TaskPriority.MEDIUM
    deadline: datetime
    status: TaskStatus = TaskStatus.PENDING
    assigned_to: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    metadata: Dict = Field(default_factory=dict)
    
    class Config:
        json_schema_extra = {
            "example": {
                "task_id": "T101",
                "type": "order_fulfillment",
                "priority": "high",
                "deadline": "2026-02-02T18:00:00",
                "status": "pending",
                "metadata": {
                    "customer": "ABC Corp",
                    "items": ["Product A", "Product B"]
                }
            }
        }


class Resource(BaseModel):
    """Universal Resource Model - Inventory, Equipment, Materials"""
    resource_id: str
    resource_name: str
    resource_type: str  # inventory, equipment, raw_material
    available: float
    required: Optional[float] = None
    unit: str = "units"
    reorder_level: Optional[float] = None
    metadata: Dict = Field(default_factory=dict)
    
    class Config:
        json_schema_extra = {
            "example": {
                "resource_id": "R001",
                "resource_name": "Inventory_Item_X",
                "resource_type": "inventory",
                "available": 20,
                "required": 30,
                "unit": "units"
            }
        }


class Agent(BaseModel):
    """Universal Agent Model - Staff, Workers, Team Members"""
    staff_id: str
    name: str
    skills: List[str]
    availability: bool = True
    current_workload: int = 0
    max_capacity: int = 5
    metadata: Dict = Field(default_factory=dict)
    
    class Config:
        json_schema_extra = {
            "example": {
                "staff_id": "S1",
                "name": "John Doe",
                "skills": ["packing", "quality_check"],
                "availability": True,
                "current_workload": 2,
                "max_capacity": 5
            }
        }


class Decision(BaseModel):
    """AI Decision Record"""
    decision_id: str
    decision_type: str  # task_assignment, prioritization, resource_allocation
    reasoning: str
    actions: List[Dict]
    timestamp: datetime = Field(default_factory=datetime.now)
    agent_name: str  # Which AI agent made this decision
    status: str = "pending"  # pending, approved, executed, overridden
    
    class Config:
        json_schema_extra = {
            "example": {
                "decision_id": "D001",
                "decision_type": "task_assignment",
                "reasoning": "Task T101 has deadline in 6 hours, sufficient inventory, and staff S1 available",
                "actions": [
                    {"action": "assign_task", "task_id": "T101", "staff_id": "S1"}
                ],
                "agent_name": "DecisionAgent"
            }
        }
