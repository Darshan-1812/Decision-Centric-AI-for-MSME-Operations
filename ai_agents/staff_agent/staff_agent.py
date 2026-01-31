"""
Staff Agent - Manages workforce allocation
Assigns tasks based on skills and availability
"""

import os
import json
from typing import List, Dict
from openai import OpenAI
from ..prompts.agent_prompts import STAFF_AGENT_PROMPT, AGENT_CONFIGS


class StaffAgent:
    """
    Manages staff allocation and task assignment
    Balances workload and matches skills
    """
    
    def __init__(self, api_key: str = None):
        self.client = OpenAI(api_key=api_key or os.getenv("OPENAI_API_KEY"))
        self.config = AGENT_CONFIGS["staff_agent"]
        self.name = self.config["name"]
    
    def assign_tasks(
        self,
        tasks: List[Dict],
        staff: List[Dict]
    ) -> Dict:
        """
        Assign tasks to staff members
        
        Args:
            tasks: List of unassigned tasks
            staff: List of available staff
            
        Returns:
            Task assignments and recommendations
        """
        
        # Prepare context
        context = f"""
Unassigned Tasks:
{json.dumps(tasks, indent=2)}

Available Staff:
{json.dumps(staff, indent=2)}

Provide optimal task-to-staff assignments considering:
1. Skill matching
2. Workload balance
3. Task priorities
"""
        
        # Call AI
        response = self.client.chat.completions.create(
            model=self.config["model"],
            temperature=self.config["temperature"],
            messages=[
                {"role": "system", "content": STAFF_AGENT_PROMPT},
                {"role": "user", "content": context}
            ],
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        result["agent_name"] = self.name
        
        return result
    
    def check_overload(self, staff_member: Dict) -> bool:
        """Check if staff member is overloaded"""
        
        if "current_workload" not in staff_member or "max_capacity" not in staff_member:
            return False
        
        utilization = staff_member["current_workload"] / staff_member["max_capacity"]
        return utilization > 0.8  # 80% threshold
    
    def match_skills(self, task_requirements: List[str], staff_skills: List[str]) -> float:
        """Calculate skill match score (0-1)"""
        
        if not task_requirements:
            return 1.0
        
        matches = sum(1 for req in task_requirements if req in staff_skills)
        return matches / len(task_requirements)


if __name__ == "__main__":
    # Example usage
    agent = StaffAgent()
    
    sample_tasks = [
        {
            "task_id": "T101",
            "type": "packing",
            "priority": "high",
            "required_skills": ["packing"]
        },
        {
            "task_id": "T102",
            "type": "quality_check",
            "priority": "medium",
            "required_skills": ["quality_control"]
        }
    ]
    
    sample_staff = [
        {
            "staff_id": "S1",
            "name": "John",
            "skills": ["packing", "loading"],
            "availability": True,
            "current_workload": 2,
            "max_capacity": 5
        },
        {
            "staff_id": "S2",
            "name": "Jane",
            "skills": ["quality_control"],
            "availability": True,
            "current_workload": 1,
            "max_capacity": 5
        }
    ]
    
    assignments = agent.assign_tasks(sample_tasks, sample_staff)
    print(json.dumps(assignments, indent=2))
