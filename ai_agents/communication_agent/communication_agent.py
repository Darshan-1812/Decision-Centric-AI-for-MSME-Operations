"""
Client Communication Agent
Generates and sends professional emails to clients
"""

import os
import json
import logging
from typing import Dict
from datetime import datetime
import google.generativeai as genai

logger = logging.getLogger(__name__)


COMMUNICATION_PROMPT = """You are a professional client communication agent for a service startup.

Generate a professional email for the following scenario:

**Email Type:** {email_type}

**Context:**
{context}

**Guidelines:**
- Professional and friendly tone
- Clear and concise
- Transparent about timelines and expectations
- Include relevant details
- End with appropriate call-to-action

**Output Format (JSON):**
{{
  "subject": "string",
  "body": "string (professional email body)",
  "tone": "professional|friendly|formal"
}}

Respond with valid JSON only.
"""


class CommunicationAgent:
    """
    Client Communication Agent
    
    Generates professional emails for various scenarios
    """
    
    def __init__(self, api_key: str = None):
        """Initialize Communication Agent"""
        genai.configure(api_key=api_key or os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel(
            model_name="models/gemini-2.5-flash-lite-preview-09-2025",
            generation_config={"temperature": 0.4}
        )
        self.name = "CommunicationAgent"
        self.company_name = os.getenv("COMPANY_NAME", "Our Company")
    
    def generate_project_accepted_email(self, project_data: Dict, team_data: Dict) -> Dict:
        """Generate project acceptance email"""
        context = f"""
Project Type: {project_data.get('project_type')}
Deadline: {project_data.get('deadline')}
Budget: Rs.{project_data.get('budget')}
Team Assigned: {', '.join([m.get('name', '') for m in team_data.get('team_members', [])])}
Estimated Completion: {project_data.get('estimated_effort_days')} days
"""
        
        return self._generate_email("project_accepted", context)
    
    def generate_delay_alert_email(self, project_data: Dict, delay_info: Dict) -> Dict:
        """Generate delay alert email"""
        context = f"""
Project: {project_data.get('project_type')}
Original Deadline: {project_data.get('deadline')}
New Estimated Completion: {delay_info.get('new_deadline')}
Reason: {delay_info.get('reason')}
Current Progress: {delay_info.get('progress_percentage')}%
"""
        
        return self._generate_email("delay_alert", context)
    
    def generate_completion_email(self, project_data: Dict) -> Dict:
        """Generate project completion email"""
        context = f"""
Project: {project_data.get('project_type')}
Completed On: {datetime.now().strftime('%Y-%m-%d')}
Deliverables: Ready for review
"""
        
        return self._generate_email("project_completed", context)
    
    def _generate_email(self, email_type: str, context: str) -> Dict:
        """Generate email using AI"""
        try:
            prompt = COMMUNICATION_PROMPT.format(
                email_type=email_type,
                context=context
            )
            
            response = self.model.generate_content(prompt)
            
            # Parse response
            response_text = response.text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            email_data = json.loads(response_text.strip())
            
            logger.info(f"Generated {email_type} email")
            return email_data
            
        except Exception as e:
            logger.error(f"Error generating email: {e}")
            return self._get_template(email_type, context)
    
    def _get_template(self, email_type: str, context: str) -> Dict:
        """Fallback email templates"""
        templates = {
            "project_accepted": {
                "subject": "Project Accepted - We're Ready to Start!",
                "body": f"""Dear Client,

Thank you for choosing {self.company_name}!

We're excited to inform you that we've accepted your project and assigned our best team to work on it.

{context}

We'll keep you updated on the progress. Feel free to reach out if you have any questions.

Best regards,
{self.company_name} Team""",
                "tone": "professional"
            },
            "delay_alert": {
                "subject": "Project Update - Timeline Adjustment",
                "body": f"""Dear Client,

We wanted to keep you informed about your project status.

{context}

We apologize for any inconvenience and are working to minimize the delay. We'll keep you updated on progress.

Best regards,
{self.company_name} Team""",
                "tone": "professional"
            },
            "project_completed": {
                "subject": "Project Completed - Ready for Review",
                "body": f"""Dear Client,

Great news! Your project is complete and ready for review.

{context}

Please review the deliverables and let us know if you need any adjustments.

Best regards,
{self.company_name} Team""",
                "tone": "friendly"
            }
        }
        
        return templates.get(email_type, {
            "subject": "Project Update",
            "body": context,
            "tone": "professional"
        })
    
    def send_email(self, to_email: str, email_data: Dict) -> bool:
        """
        Send email (placeholder - implement SMTP in production)
        
        Args:
            to_email: Recipient email
            email_data: Email dictionary with subject and body
            
        Returns:
            True if sent successfully
        """
        logger.info(f"Sending email to {to_email}: {email_data.get('subject')}")
        
        # In production, implement SMTP sending here
        # For now, just log
        print(f"\n{'='*80}")
        print(f"EMAIL TO: {to_email}")
        print(f"SUBJECT: {email_data.get('subject')}")
        print(f"{'='*80}")
        print(email_data.get('body'))
        print(f"{'='*80}\n")
        
        return True


# Example usage
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    agent = CommunicationAgent()
    
    # Test project accepted email
    project = {
        "project_type": "Web Application",
        "deadline": "2026-02-20",
        "budget": 150000,
        "estimated_effort_days": 20
    }
    
    team = {
        "team_members": [
            {"name": "Alice"},
            {"name": "Bob"},
            {"name": "Charlie"}
        ]
    }
    
    email = agent.generate_project_accepted_email(project, team)
    agent.send_email("client@example.com", email)
