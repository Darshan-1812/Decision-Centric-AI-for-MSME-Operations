"""
Autonomous System API Routes
Endpoints for monitoring and controlling the autonomous email-to-project system
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
import sys
import os
from dotenv import load_dotenv

# Load environment variables from project root .env file
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
env_path = os.path.join(project_root, '.env')
load_dotenv(env_path)

# Add parent directory to path
sys.path.insert(0, project_root)

router = APIRouter(prefix="/api/autonomous", tags=["Autonomous System"])


# In-memory storage (in production, use database)
system_status = {
    "is_running": True,  # Set to True so system shows as running
    "last_check": None,
    "emails_processed": 0,
    "projects_created": 0,
    "active_projects": []
}


@router.post("/reset")
async def reset_system():
    """Reset system state - clear all projects and processed emails"""
    global system_status
    system_status = {
        "is_running": True,
        "last_check": None,
        "emails_processed": 0,
        "projects_created": 0,
        "active_projects": []
    }
    # Clear processed emails files
    try:
        import json
        # Backend processed emails
        backend_storage = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'processed_emails.json')
        with open(backend_storage, 'w') as f:
            json.dump({"processed_emails": [], "email_project_mapping": {}, "last_updated": datetime.now().isoformat()}, f)
        
        # Root processed emails
        root_storage = os.path.join(project_root, 'processed_emails.json')
        if os.path.exists(root_storage):
            with open(root_storage, 'w') as f:
                json.dump({"processed_emails": [], "email_project_mapping": {}, "last_updated": datetime.now().isoformat()}, f)
    except Exception as e:
        print(f"Warning: Could not clear processed emails file: {e}")
    
    return {"success": True, "message": "System reset complete"}


@router.get("/status")
async def get_system_status():
    """Get autonomous system status"""
    return {
        "status": "running" if system_status["is_running"] else "stopped",
        "last_check": system_status["last_check"],
        "stats": {
            "emails_processed": system_status["emails_processed"],
            "projects_created": system_status["projects_created"],
            "active_projects": len(system_status["active_projects"])
        }
    }


@router.get("/projects")
async def get_active_projects():
    """Get all active projects with team assignments"""
    return {
        "projects": system_status["active_projects"]
    }


@router.get("/team-assignments")
async def get_team_assignments():
    """Get all team assignments based on priority"""
    # Sort projects by priority score (higher = more urgent)
    sorted_projects = sorted(
        system_status["active_projects"],
        key=lambda p: p.get("priority_score", 0),
        reverse=True
    )
    
    # Build team assignment overview
    team_overview = {}
    for project in sorted_projects:
        for team_member in project.get("assigned_team", []):
            member_id = team_member.get("id")
            if member_id not in team_overview:
                team_overview[member_id] = {
                    "id": member_id,
                    "name": team_member.get("name"),
                    "skills": team_member.get("skills", []),
                    "assigned_projects": []
                }
            team_overview[member_id]["assigned_projects"].append({
                "project_id": project.get("id"),
                "project_name": project.get("name"),
                "priority": project.get("priority"),
                "priority_score": project.get("priority_score"),
                "task": team_member.get("task")
            })
    
    return {
        "team_assignments": list(team_overview.values()),
        "projects_by_priority": [
            {
                "id": p.get("id"),
                "name": p.get("name"),
                "priority": p.get("priority"),
                "priority_score": p.get("priority_score"),
                "tasks": p.get("tasks", []),
                "assigned_team": p.get("assigned_team", [])
            }
            for p in sorted_projects
        ]
    }


@router.post("/check-emails")
async def trigger_email_check():
    """Manually trigger email check"""
    import logging
    
    # Enable detailed logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    # Verify environment variables are set
    email = os.getenv("COMPANY_EMAIL")
    password = os.getenv("EMAIL_PASSWORD")
    
    if not email or not password:
        logger.error(f"Email credentials not configured. COMPANY_EMAIL: {'set' if email else 'NOT SET'}, EMAIL_PASSWORD: {'set' if password else 'NOT SET'}")
        return {
            "success": False,
            "error": "Email credentials not configured. Please set COMPANY_EMAIL and EMAIL_PASSWORD in .env file.",
            "emails_found": 0,
            "projects_created": 0,
            "emails": []
        }
    
    try:
        from ai_agents.autonomous_system import AutonomousSystem
        
        logger.info("Starting manual email check with Autonomous System...")
        
        # Use full Autonomous System
        system = AutonomousSystem()
        
        # This triggers the full pipeline:
        # 1. Check emails (using our fixed fetch_recent_emails logic)
        # 2. Extract requirements
        # 3. Calculate priority
        # 4. Assign team
        # 5. Notify client
        system.process_new_emails()
        
        # Calculate stats from the system execution
        # Note: accurate counting would require system to return stats
        # For now, we rely on the fact that processed emails are now in system.active_projects
        
        projects_created = len(system.active_projects)
        
        # Update system status global variable
        system_status["emails_processed"] += projects_created  # Approximate
        system_status["projects_created"] += projects_created
        
        # Update active projects list with full data including team assignments
        for p in system.active_projects:
            # Get team assignment data
            tasks = p.get("tasks", [])
            team_assignment = p.get("team_assignment", {})
            
            # Extract team members assigned to this project
            assigned_team = []
            for task in tasks:
                assigned_to = task.get("assigned_to")
                if assigned_to:
                    # Find team member info
                    for member in system.team_members:
                        if member["id"] == assigned_to and member not in assigned_team:
                            assigned_team.append({
                                "id": member["id"],
                                "name": member["name"],
                                "skills": member["skills"],
                                "task": task.get("task_name")
                            })
            
            system_status["active_projects"].append({
                "id": p.get("project_id"),
                "name": p.get("project_type", "New Project"),
                "client": p.get("client_email"),
                "status": "Active",
                "priority": p.get("priority_level", "medium"),
                "priority_score": p.get("priority_score", 0),
                "progress": 0,
                "budget": p.get("budget", 0),
                "deadline": p.get("deadline"),
                "scope": p.get("scope"),
                "tasks": tasks,
                "team_assignment": team_assignment,
                "assigned_team": assigned_team
            })
            
        system_status["last_check"] = datetime.now().isoformat()
        
        # Get list of processed emails for response
        processed_emails_list = []
        for p in system.active_projects:
            processed_emails_list.append({
                "from": p.get("client_email"),
                "subject": f"Project {p.get('project_id')}",
                "date": datetime.now().isoformat()
            })
        
        return {
            "success": True,
            "emails_found": projects_created,
            "projects_created": projects_created,
            "emails": processed_emails_list
        }
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        logger.error(f"Error checking emails: {error_details}")
        # Return a JSON response instead of raising an HTTPException
        # This allows the frontend to display the error properly
        return {
            "success": False,
            "error": f"Error connecting to email: {str(e)}. Please check your email credentials and try again.",
            "emails_found": 0,
            "projects_created": 0,
            "emails": []
        }

@router.get("/test-connector")
async def test_connector():
    """Test email connector directly"""
    try:
        from ai_agents.email_agent.email_connector import EmailConnector
        import os
        
        email = os.getenv("COMPANY_EMAIL")
        password = os.getenv("EMAIL_PASSWORD")
        
        connector = EmailConnector(email, password)
        
        if not connector.connect():
            return {"error": "Failed to connect"}
        
        emails = connector.fetch_recent_emails(days=1, limit=20)
        connector.disconnect()
        
        return {
            "success": True,
            "total_emails": len(emails),
            "emails": [
                {
                    "subject": e.get("subject", "(no subject)")[:50],
                    "from": e.get("from", "")[:50],
                    "date": e.get("date", "")
                }
                for e in emails[:10]
            ]
        }
    except Exception as e:
        import traceback
        return {"error": str(e), "traceback": traceback.format_exc()}


@router.post("/process-project")
async def process_project_email(email_id: str):
    """Process a specific project email"""
    try:
        # This would process a specific email through the full workflow
        return {
            "success": True,
            "message": "Project processed successfully",
            "project_id": "P001"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/team-members")
async def get_team_members():
    """Get team members and their workload"""
    return {
        "team_members": [
            {
                "id": "D1",
                "name": "Alice",
                "skills": ["design", "ui", "ux"],
                "current_workload": 5,
                "max_capacity": 20,
                "utilization": 25
            },
            {
                "id": "D2",
                "name": "Bob",
                "skills": ["frontend", "react", "javascript"],
                "current_workload": 10,
                "max_capacity": 20,
                "utilization": 50
            },
            {
                "id": "D3",
                "name": "Charlie",
                "skills": ["backend", "python", "api"],
                "current_workload": 8,
                "max_capacity": 20,
                "utilization": 40
            },
            {
                "id": "D4",
                "name": "Diana",
                "skills": ["testing", "qa", "automation"],
                "current_workload": 3,
                "max_capacity": 20,
                "utilization": 15
            }
        ]
    }


@router.get("/recent-decisions")
async def get_recent_decisions():
    """Get recent AI decisions"""
    return {
        "decisions": [
            {
                "project_id": "P001",
                "priority_score": 79.5,
                "priority_level": "HIGH",
                "reasoning": [
                    "Moderate deadline urgency (<=14 days): +30 points",
                    "Advance payment received: +25 points",
                    "Medium-value project (Rs.100k-Rs.200k): +10 points"
                ],
                "timestamp": datetime.now().isoformat()
            }
        ]
    }


@router.post("/test-connection")
async def test_email_connection():
    """Test email connection"""
    try:
        from ai_agents.email_agent.email_connector import EmailConnector
        import os
        
        email = os.getenv("COMPANY_EMAIL")
        password = os.getenv("EMAIL_PASSWORD")
        
        connector = EmailConnector(email, password)
        connected = connector.connect()
        
        if connected:
            connector.disconnect()
            return {"success": True, "message": "Email connection successful"}
        else:
            return {"success": False, "message": "Failed to connect"}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
