"""
Autonomous Decision Agent - The BOSS Agent
Coordinates all other agents and makes final decisions
Enhanced with Industry-Standard Priority Scoring
"""

import os
import json
from typing import List, Dict, Optional
from datetime import datetime
import google.generativeai as genai
from ..prompts.agent_prompts import DECISION_AGENT_PROMPT, AGENT_CONFIGS
from .priority_scorer import PriorityScorer, rank_projects


class DecisionAgent:
    """
    BOSS Agent - Coordinates all operations
    This agent:
    - Sees ALL data (tasks, projects, resources, staff)
    - Uses industry-standard priority scoring
    - Decides what should happen next
    - Coordinates other agents
    
    Supports both:
    1. Traditional MSME task management
    2. Service startup project prioritization (email-to-project workflow)
    """
    
    def __init__(self, api_key: str = None):
        # Configure Gemini API
        genai.configure(api_key=api_key or os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel(
            model_name="models/gemini-2.5-flash-lite-preview-09-2025",
            generation_config={
                "temperature": AGENT_CONFIGS["decision_agent"]["temperature"],
            }
        )
        self.config = AGENT_CONFIGS["decision_agent"]
        self.name = self.config["name"]
        self.priority_scorer = PriorityScorer()
        
    def make_decision(
        self,
        tasks: List[Dict],
        resources: List[Dict],
        staff: List[Dict]
    ) -> Dict:
        """
        Main decision-making function
        
        Args:
            tasks: List of current tasks
            resources: List of available resources
            staff: List of staff members
            
        Returns:
            Decision object with actions and reasoning
        """
        
        # Prepare context for AI
        context = self._prepare_context(tasks, resources, staff)
        
        # Create full prompt with system instructions and context
        full_prompt = f"""{DECISION_AGENT_PROMPT}

{context}

Respond with valid JSON only."""
        
        # Call Gemini API
        response = self.model.generate_content(full_prompt)
        
        # Parse response
        decision = json.loads(response.text)
        
        # Add metadata
        decision["timestamp"] = datetime.now().isoformat()
        decision["agent_name"] = self.name
        
        return decision
    
    def _prepare_context(
        self,
        tasks: List[Dict],
        resources: List[Dict],
        staff: List[Dict]
    ) -> str:
        """Prepare context string for AI"""
        
        context = f"""
Current Operational State:

TASKS ({len(tasks)} total):
{json.dumps(tasks, indent=2)}

RESOURCES:
{json.dumps(resources, indent=2)}

STAFF:
{json.dumps(staff, indent=2)}

Analyze the situation and provide:
1. Priority-ordered task assignments
2. Resource alerts if any
3. Staffing recommendations
4. Reasoning for each decision
"""
        return context
    
    def prioritize_projects(self, projects: List[Dict]) -> Dict:
        """
        Prioritize multiple competing projects using industry-standard rules.
        
        This is the CORE DECISION ENGINE for service startups.
        
        Args:
            projects: List of project dictionaries with fields:
                - project_id, deadline, budget, advance_paid, 
                  client_type, team_load, etc.
        
        Returns:
            Decision object with ranked projects and actions
        """
        
        # Use priority scorer to rank projects
        ranked_projects = rank_projects(projects)
        
        # Generate decisions based on rankings
        decisions = []
        alerts = []
        
        for i, project in enumerate(ranked_projects):
            priority_level = project["priority_level"]
            
            # Decision logic based on priority
            if priority_level == "critical" or priority_level == "high":
                # Accept and assign immediately
                decisions.append({
                    "action": "accept_and_assign",
                    "project_id": project["project_id"],
                    "priority_rank": i + 1,
                    "reasoning": f"Priority Score: {project['priority_score']}. " + 
                                ", ".join(project["priority_reasoning"])
                })
            elif priority_level == "normal":
                # Accept but schedule based on team availability
                decisions.append({
                    "action": "accept_and_schedule",
                    "project_id": project["project_id"],
                    "priority_rank": i + 1,
                    "reasoning": f"Priority Score: {project['priority_score']}. " +
                                "Schedule after higher priority projects."
                })
            else:  # low priority
                # Consider delaying or negotiating
                decisions.append({
                    "action": "negotiate_timeline",
                    "project_id": project["project_id"],
                    "priority_rank": i + 1,
                    "reasoning": f"Priority Score: {project['priority_score']}. " +
                                "Consider timeline negotiation or delay."
                })
            
            # Generate alerts for special conditions
            if project.get("team_load", 0) >= 80:
                alerts.append({
                    "type": "team_overload_risk",
                    "project_id": project["project_id"],
                    "message": f"Team load at {project['team_load']}% - Risk of overload"
                })
            
            if not project.get("advance_paid") and project.get("budget", 0) > 100000:
                alerts.append({
                    "type": "payment_risk",
                    "project_id": project["project_id"],
                    "message": "High-value project without advance payment"
                })
        
        return {
            "decision_type": "project_prioritization",
            "ranked_projects": ranked_projects,
            "decisions": decisions,
            "alerts": alerts,
            "timestamp": datetime.now().isoformat(),
            "agent_name": self.name
        }
    
    def evaluate_urgency(self, task: Dict) -> int:
        """Calculate urgency score (0-100) for traditional tasks"""
        deadline = datetime.fromisoformat(task["deadline"])
        time_remaining = (deadline - datetime.now()).total_seconds()
        hours_remaining = time_remaining / 3600
        
        # Urgency increases as deadline approaches
        if hours_remaining < 2:
            return 100
        elif hours_remaining < 6:
            return 80
        elif hours_remaining < 24:
            return 60
        else:
            return 40


if __name__ == "__main__":
    # Example usage
    agent = DecisionAgent()
    
    sample_tasks = [
        {
            "task_id": "T101",
            "type": "order_fulfillment",
            "priority": "high",
            "deadline": "2026-02-01T18:00:00",
            "status": "pending"
        }
    ]
    
    sample_resources = [
        {
            "resource_name": "Item_X",
            "available": 50,
            "required": 30
        }
    ]
    
    sample_staff = [
        {
            "staff_id": "S1",
            "skills": ["packing"],
            "availability": True,
            "current_workload": 2
        }
    ]
    
    decision = agent.make_decision(sample_tasks, sample_resources, sample_staff)
    print(json.dumps(decision, indent=2))
