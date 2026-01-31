"""
Project Models for Service Startup Operations
Email-to-Project workflow models
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime
from enum import Enum


class ProjectStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    IN_PROGRESS = "in_progress"
    DELAYED = "delayed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class ClientType(str, Enum):
    NEW = "new"
    REPEAT = "repeat"
    LONG_TERM = "long_term"
    TRIAL = "trial"


class Project(BaseModel):
    """
    Universal Project Model for Service Startups
    Represents client projects from email intake to delivery
    """
    project_id: str
    project_type: str  # web_app, mobile_app, consulting, etc.
    deadline: datetime
    budget: float
    advance_paid: bool = False
    full_payment_done: bool = False
    payment_amount_received: float = 0.0
    
    client_name: str
    client_email: str
    client_type: ClientType = ClientType.NEW
    
    status: ProjectStatus = ProjectStatus.PENDING
    assigned_team: Optional[str] = None
    
    # Priority scoring fields
    priority_score: Optional[float] = None
    priority_level: Optional[str] = None
    priority_reasoning: List[str] = Field(default_factory=list)
    
    # Metadata
    estimated_effort_days: Optional[int] = None
    actual_effort_days: Optional[int] = None
    penalty_exists: bool = False
    sla_deadline: Optional[datetime] = None
    
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    metadata: Dict = Field(default_factory=dict)
    
    class Config:
        json_schema_extra = {
            "example": {
                "project_id": "P101",
                "project_type": "web_application",
                "deadline": "2026-02-20T18:00:00",
                "budget": 150000,
                "advance_paid": True,
                "payment_amount_received": 50000,
                "client_name": "ABC Corp",
                "client_email": "client@abc.com",
                "client_type": "new",
                "estimated_effort_days": 18,
                "metadata": {
                    "requirements": "E-commerce platform with payment integration",
                    "tech_stack": ["React", "Node.js", "MongoDB"]
                }
            }
        }


class EmailRequest(BaseModel):
    """
    Incoming email parsed into structured format
    Used by Email Agent and Requirement Agent
    """
    email_id: str
    sender_email: str
    sender_name: Optional[str] = None
    subject: str
    body: str
    received_at: datetime
    
    # Extracted information (filled by Requirement Agent)
    extracted_project_type: Optional[str] = None
    extracted_deadline: Optional[datetime] = None
    extracted_budget: Optional[float] = None
    extracted_advance_mentioned: bool = False
    extracted_requirements: Optional[str] = None
    
    processed: bool = False
    converted_to_project_id: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "email_id": "email_12345",
                "sender_email": "client@example.com",
                "sender_name": "John Doe",
                "subject": "Web App Development Request",
                "body": "We need a web app in 20 days. Budget ₹1.5L. Advance ₹50k paid.",
                "received_at": "2026-01-31T10:00:00"
            }
        }


class TeamAssignment(BaseModel):
    """
    Team assignment for a project
    """
    assignment_id: str
    project_id: str
    team_name: str
    team_members: List[str]  # List of staff IDs
    assigned_at: datetime = Field(default_factory=datetime.now)
    capacity_status: str = "available"  # available, busy, overloaded
    risk_level: str = "low"  # low, medium, high
    
    class Config:
        json_schema_extra = {
            "example": {
                "assignment_id": "A001",
                "project_id": "P101",
                "team_name": "Frontend Team A",
                "team_members": ["S1", "S2", "S3"],
                "capacity_status": "available",
                "risk_level": "low"
            }
        }


class ClientCommunication(BaseModel):
    """
    Auto-generated client communication record
    """
    communication_id: str
    project_id: str
    communication_type: str  # acceptance, delay_notice, payment_reminder, completion
    recipient_email: str
    subject: str
    body: str
    sent_at: datetime = Field(default_factory=datetime.now)
    auto_generated: bool = True
    
    class Config:
        json_schema_extra = {
            "example": {
                "communication_id": "C001",
                "project_id": "P101",
                "communication_type": "acceptance",
                "recipient_email": "client@example.com",
                "subject": "Project Accepted - Team Assigned",
                "body": "Your project has been accepted. Team Frontend A has been assigned...",
                "auto_generated": True
            }
        }
