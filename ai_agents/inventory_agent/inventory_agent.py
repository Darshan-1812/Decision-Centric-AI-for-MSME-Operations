"""
Inventory Agent - Monitors resource availability
Detects shortages and predicts future needs
"""

import os
import json
from typing import List, Dict
from openai import OpenAI
from ..prompts.agent_prompts import INVENTORY_AGENT_PROMPT, AGENT_CONFIGS


class InventoryAgent:
    """
    Monitors inventory and resource levels
    Raises alerts for shortages
    """
    
    def __init__(self, api_key: str = None):
        self.client = OpenAI(api_key=api_key or os.getenv("OPENAI_API_KEY"))
        self.config = AGENT_CONFIGS["inventory_agent"]
        self.name = self.config["name"]
    
    def check_inventory(
        self,
        resources: List[Dict],
        upcoming_tasks: List[Dict]
    ) -> Dict:
        """
        Check inventory against upcoming requirements
        
        Args:
            resources: List of current resource levels
            upcoming_tasks: List of tasks requiring resources
            
        Returns:
            Inventory status and alerts
        """
        
        # Prepare context
        context = f"""
Current Inventory:
{json.dumps(resources, indent=2)}

Upcoming Tasks:
{json.dumps(upcoming_tasks, indent=2)}

Analyze and provide:
1. Overall inventory status
2. Alerts for any shortages
3. Impacted tasks
4. Recommended actions
"""
        
        # Call AI
        response = self.client.chat.completions.create(
            model=self.config["model"],
            temperature=self.config["temperature"],
            messages=[
                {"role": "system", "content": INVENTORY_AGENT_PROMPT},
                {"role": "user", "content": context}
            ],
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        result["agent_name"] = self.name
        
        return result
    
    def predict_shortage(self, resource: Dict, consumption_rate: float) -> bool:
        """Predict if resource will run out soon"""
        
        if "available" not in resource or "reorder_level" not in resource:
            return False
        
        # Simple prediction: will we hit reorder level in next 24 hours?
        hours_until_shortage = resource["available"] / consumption_rate
        
        return hours_until_shortage < 24


if __name__ == "__main__":
    # Example usage
    agent = InventoryAgent()
    
    sample_resources = [
        {
            "resource_name": "Item_X",
            "available": 15,
            "reorder_level": 20,
            "unit": "units"
        },
        {
            "resource_name": "Item_Y",
            "available": 100,
            "reorder_level": 30,
            "unit": "units"
        }
    ]
    
    sample_tasks = [
        {
            "task_id": "T101",
            "type": "production",
            "requirements": {"Item_X": 20}
        }
    ]
    
    status = agent.check_inventory(sample_resources, sample_tasks)
    print(json.dumps(status, indent=2))
