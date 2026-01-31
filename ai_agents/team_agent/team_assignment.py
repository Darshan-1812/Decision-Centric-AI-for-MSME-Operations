"""
Team Assignment Agent
Breaks projects into tasks and assigns to team members
"""

import os
import json
import logging
from typing import Dict, List
import google.generativeai as genai

logger = logging.getLogger(__name__)


TEAM_ASSIGNMENT_PROMPT = """You are an AI project manager for a service startup.

Your task is to break down a project into tasks and assign roles.

**Project Details:**
Type: {project_type}
Scope: {scope}
Complexity: {complexity}
Estimated Effort: {estimated_effort_days} days
Budget: Rs.{budget}

**Available Team Members:**
{team_members}

**Your Task:**
1. Break the project into specific tasks
2. Assign appropriate team members to each task
3. Estimate time for each task
4. Ensure workload is balanced

**Output Format (JSON only):**
{{
  "tasks": [
    {{
      "task_id": "T1",
      "task_name": "string",
      "description": "string",
      "assigned_to": "team_member_id",
      "estimated_days": number,
      "skills_required": ["skill1", "skill2"]
    }}
  ],
  "team_assignments": [
    {{
      "team_member_id": "string",
      "role": "string",
      "tasks_assigned": ["T1", "T2"],
      "total_workload_days": number
    }}
  ],
  "warnings": ["string"] // Any concerns about capacity or skills
}}

Respond with valid JSON only.
"""


class TeamAssignmentAgent:
    """
    Team Assignment Agent
    
    Breaks projects into tasks and assigns to team members
    """
    
    def __init__(self, api_key: str = None):
        """Initialize Team Assignment Agent"""
        genai.configure(api_key=api_key or os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel(
            model_name="models/gemini-2.5-flash-lite-preview-09-2025",
            generation_config={"temperature": 0.3}
        )
        self.name = "TeamAssignmentAgent"
    
    def assign_team(self, project_requirements: Dict, team_members: List[Dict]) -> Dict:
        """
        Assign team to project
        
        Args:
            project_requirements: Requirements from RequirementAgent
            team_members: List of available team members with skills
            
        Returns:
            Dictionary with task breakdown and assignments
        """
        logger.info(f"Assigning team for project: {project_requirements.get('project_type')}")
        
        try:
            # Format team members for prompt
            team_info = "\n".join([
                f"- {member['id']}: {member['name']} (Skills: {', '.join(member['skills'])}, "
                f"Current Load: {member.get('current_workload', 0)} days, "
                f"Capacity: {member.get('max_capacity', 20)} days)"
                for member in team_members
            ])
            
            # Prepare prompt
            prompt = TEAM_ASSIGNMENT_PROMPT.format(
                project_type=project_requirements.get('project_type', 'Unknown'),
                scope=project_requirements.get('scope', 'Not specified'),
                complexity=project_requirements.get('complexity', 'medium'),
                estimated_effort_days=project_requirements.get('estimated_effort_days', 15),
                budget=project_requirements.get('budget', 0),
                team_members=team_info
            )
            
            # Call Gemini
            response = self.model.generate_content(prompt)
            
            # Parse response
            response_text = response.text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            assignment = json.loads(response_text.strip())
            
            logger.info(f"Team assigned: {len(assignment.get('tasks', []))} tasks created")
            return assignment
            
        except Exception as e:
            logger.error(f"Error assigning team: {e}")
            return self._fallback_assignment(project_requirements, team_members)
    
    def _fallback_assignment(self, requirements: Dict, team_members: List[Dict]) -> Dict:
        """Fallback assignment logic"""
        logger.warning("Using fallback team assignment")
        
        project_type = requirements.get('project_type', '').lower()
        
        # Simple task breakdown based on project type
        if 'web' in project_type or 'app' in project_type:
            tasks = [
                {"task_id": "T1", "task_name": "UI/UX Design", "skills_required": ["design", "ui"]},
                {"task_id": "T2", "task_name": "Frontend Development", "skills_required": ["frontend", "react"]},
                {"task_id": "T3", "task_name": "Backend Development", "skills_required": ["backend", "api"]},
                {"task_id": "T4", "task_name": "Testing & QA", "skills_required": ["testing", "qa"]}
            ]
        else:
            tasks = [
                {"task_id": "T1", "task_name": "Analysis & Planning", "skills_required": []},
                {"task_id": "T2", "task_name": "Development", "skills_required": []},
                {"task_id": "T3", "task_name": "Testing", "skills_required": ["testing"]}
            ]
        
        # Simple skill matching
        assignments = []
        for task in tasks:
            # Find best match
            best_member = None
            for member in team_members:
                if any(skill in member.get('skills', []) for skill in task['skills_required']):
                    best_member = member
                    break
            
            if not best_member and team_members:
                best_member = team_members[0]  # Assign to first available
            
            if best_member:
                task['assigned_to'] = best_member['id']
                task['estimated_days'] = requirements.get('estimated_effort_days', 15) // len(tasks)
        
        return {
            "tasks": tasks,
            "team_assignments": [],
            "warnings": ["Fallback assignment used - manual review recommended"]
        }


# Example usage
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    # Sample data
    requirements = {
        "project_type": "Web Application",
        "scope": "E-commerce platform with payment integration",
        "complexity": "high",
        "estimated_effort_days": 30,
        "budget": 200000
    }
    
    team = [
        {"id": "D1", "name": "Alice", "skills": ["design", "ui", "ux"], "current_workload": 5, "max_capacity": 20},
        {"id": "D2", "name": "Bob", "skills": ["frontend", "react", "javascript"], "current_workload": 10, "max_capacity": 20},
        {"id": "D3", "name": "Charlie", "skills": ["backend", "python", "api"], "current_workload": 8, "max_capacity": 20},
        {"id": "D4", "name": "Diana", "skills": ["testing", "qa", "automation"], "current_workload": 3, "max_capacity": 20}
    ]
    
    agent = TeamAssignmentAgent()
    result = agent.assign_team(requirements, team)
    
    print("\n" + "="*80)
    print("TEAM ASSIGNMENT RESULTS")
    print("="*80 + "\n")
    print(json.dumps(result, indent=2))
