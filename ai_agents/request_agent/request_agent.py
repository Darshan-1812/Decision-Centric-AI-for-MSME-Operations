"""
Request Agent - Processes incoming requests
Converts all requests into standardized Task objects
"""

import os
import json
from typing import Dict
from datetime import datetime, timedelta
from openai import OpenAI
from ..prompts.agent_prompts import REQUEST_AGENT_PROMPT, AGENT_CONFIGS


class RequestAgent:
    """
    Processes incoming customer requests/orders
    Converts them into standardized Task objects
    """
    
    def __init__(self, api_key: str = None):
        self.client = OpenAI(api_key=api_key or os.getenv("OPENAI_API_KEY"))
        self.config = AGENT_CONFIGS["request_agent"]
        self.name = self.config["name"]
    
    def process_request(self, raw_request: Dict) -> Dict:
        """
        Convert raw request into Task object
        
        Args:
            raw_request: Raw customer request/order data
            
        Returns:
            Standardized Task object
        """
        
        # Prepare prompt
        prompt = f"""
Convert this customer request into a standardized Task object:

{json.dumps(raw_request, indent=2)}

Follow the Task schema and extract all relevant information.
"""
        
        # Call AI
        response = self.client.chat.completions.create(
            model=self.config["model"],
            temperature=self.config["temperature"],
            messages=[
                {"role": "system", "content": REQUEST_AGENT_PROMPT},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        task = json.loads(response.choices[0].message.content)
        
        # Add metadata
        task["created_at"] = datetime.now().isoformat()
        task["processed_by"] = self.name
        
        return task
    
    def determine_priority(self, request: Dict) -> str:
        """Determine task priority based on request details"""
        
        # Simple priority rules
        if "urgent" in str(request).lower():
            return "urgent"
        elif "customer_tier" in request and request["customer_tier"] == "premium":
            return "high"
        else:
            return "medium"
    
    def extract_deadline(self, request: Dict) -> str:
        """Extract or generate deadline"""
        
        if "deadline" in request:
            return request["deadline"]
        else:
            # Default: 24 hours from now
            deadline = datetime.now() + timedelta(hours=24)
            return deadline.isoformat()


if __name__ == "__main__":
    # Example usage
    agent = RequestAgent()
    
    sample_request = {
        "customer_name": "ABC Corp",
        "order_items": ["Product A x10", "Product B x5"],
        "delivery_date": "2026-02-02",
        "notes": "Urgent - Premium customer"
    }
    
    task = agent.process_request(sample_request)
    print(json.dumps(task, indent=2))
