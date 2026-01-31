"""
Requirement Understanding Agent
Extracts structured project requirements from email text using AI
"""

import os
import json
import logging
from typing import Dict
from datetime import datetime, timedelta
import re
import google.generativeai as genai

logger = logging.getLogger(__name__)


# Requirement extraction prompt
REQUIREMENT_AGENT_PROMPT = """You are an AI requirement analyst for a service startup.

Your task is to read client project request emails and extract structured information.

Extract the following details:
1. **project_type**: Type of project (e.g., "Web Application", "Mobile App", "Website", "Software Development", "Design")
2. **deadline**: Project deadline (extract date, if relative like "in 20 days" calculate from today)
3. **budget**: Project budget in rupees (extract number, handle formats like "1.5L", "Rs.50000", "50k")
4. **advance_paid**: Whether advance payment is mentioned (true/false)
5. **advance_amount**: Advance payment amount if mentioned
6. **full_payment_done**: Whether full payment is done (true/false)
7. **client_name**: Client name if mentioned
8. **client_email**: Client email address
9. **scope**: Brief project scope/description
10. **complexity**: Estimated complexity (low/medium/high) based on description
11. **estimated_effort_days**: Estimated effort in days based on scope

**Important Rules:**
- If deadline is relative (e.g., "in 20 days", "within 3 weeks"), calculate actual date from today
- Budget formats: "1.5L" = 150000, "50k" = 50000, "Rs.1,00,000" = 100000
- If advance is mentioned (e.g., "paid 50k advance", "advance of Rs.30000"), set advance_paid=true
- Be conservative with complexity - only mark as "high" if clearly complex
- Estimate effort based on project type and scope

**Today's Date:** {today_date}

**Email Content:**
From: {from_email}
Subject: {subject}

{body}

**Output Format (JSON only):**
{{
  "project_type": "string",
  "deadline": "YYYY-MM-DDTHH:MM:SS",
  "budget": number,
  "advance_paid": boolean,
  "advance_amount": number or null,
  "full_payment_done": boolean,
  "client_name": "string or null",
  "client_email": "string",
  "scope": "string",
  "complexity": "low|medium|high",
  "estimated_effort_days": number
}}

Respond with valid JSON only. No explanations.
"""


class RequirementAgent:
    """
    Requirement Understanding Agent
    
    Uses AI to extract structured project requirements from email text
    """
    
    def __init__(self, api_key: str = None):
        """
        Initialize Requirement Agent
        
        Args:
            api_key: Gemini API key
        """
        genai.configure(api_key=api_key or os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel(
            model_name="models/gemini-2.5-flash-lite-preview-09-2025",
            generation_config={"temperature": 0.1}
        )
        self.name = "RequirementAgent"
    
    def extract_requirements(self, email_data: Dict) -> Dict:
        """
        Extract structured requirements from email
        
        Args:
            email_data: Email dictionary with 'from', 'subject', 'body'
            
        Returns:
            Dictionary with extracted requirements
        """
        logger.info(f"Extracting requirements from email: {email_data.get('subject')}")
        
        try:
            # Prepare prompt
            today = datetime.now().strftime("%Y-%m-%d")
            
            prompt = REQUIREMENT_AGENT_PROMPT.format(
                today_date=today,
                from_email=email_data.get('from', ''),
                subject=email_data.get('subject', ''),
                body=email_data.get('body', '')
            )
            
            # Call Gemini API
            response = self.model.generate_content(prompt)
            
            # Parse JSON response
            response_text = response.text.strip()
            
            # Remove markdown code blocks if present
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            response_text = response_text.strip()
            
            requirements = json.loads(response_text)
            
            # Add metadata
            requirements['extracted_at'] = datetime.now().isoformat()
            requirements['email_id'] = email_data.get('email_id')
            requirements['raw_email'] = {
                'from': email_data.get('from'),
                'subject': email_data.get('subject'),
                'date': email_data.get('date')
            }
            
            logger.info(f"Successfully extracted requirements: {requirements['project_type']}")
            return requirements
            
        except Exception as e:
            logger.error(f"Error extracting requirements: {e}")
            
            # Fallback to rule-based extraction
            return self._fallback_extraction(email_data)
    
    def _fallback_extraction(self, email_data: Dict) -> Dict:
        """
        Fallback rule-based extraction if AI fails
        
        Args:
            email_data: Email dictionary
            
        Returns:
            Basic requirements dictionary
        """
        logger.warning("Using fallback rule-based extraction")
        
        body = email_data.get('body', '')
        subject = email_data.get('subject', '')
        
        # Extract budget using regex
        budget = self._extract_budget(body + " " + subject)
        
        # Extract deadline
        deadline = self._extract_deadline(body + " " + subject)
        
        # Detect advance payment
        advance_paid = any(word in body.lower() for word in ['advance', 'paid', 'payment done'])
        
        # Determine project type
        project_type = self._detect_project_type(body + " " + subject)
        
        return {
            "project_type": project_type,
            "deadline": deadline,
            "budget": budget,
            "advance_paid": advance_paid,
            "advance_amount": None,
            "full_payment_done": False,
            "client_name": None,
            "client_email": email_data.get('from', ''),
            "scope": subject,
            "complexity": "medium",
            "estimated_effort_days": 15,
            "extracted_at": datetime.now().isoformat(),
            "email_id": email_data.get('email_id'),
            "extraction_method": "fallback"
        }
    
    def _extract_budget(self, text: str) -> int:
        """Extract budget from text"""
        # Look for patterns like "1.5L", "Rs.50000", "50k"
        patterns = [
            r'(?:Rs\.?|INR)?\s*(\d+(?:\.\d+)?)\s*L(?:akh)?',  # 1.5L, Rs.1L
            r'(?:Rs\.?|INR)?\s*(\d+)\s*k',  # 50k
            r'(?:Rs\.?|INR)?\s*(\d{1,3}(?:,\d{3})*)',  # Rs.1,00,000
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                value = match.group(1).replace(',', '')
                if 'L' in text[match.start():match.end()].upper():
                    return int(float(value) * 100000)
                elif 'k' in text[match.start():match.end()].lower():
                    return int(float(value) * 1000)
                else:
                    return int(float(value))
        
        return 100000  # Default budget
    
    def _extract_deadline(self, text: str) -> str:
        """Extract deadline from text"""
        # Look for patterns like "in 20 days", "within 3 weeks", "by 15th Feb"
        days_pattern = r'(?:in|within)\s+(\d+)\s+days?'
        weeks_pattern = r'(?:in|within)\s+(\d+)\s+weeks?'
        
        match = re.search(days_pattern, text, re.IGNORECASE)
        if match:
            days = int(match.group(1))
            deadline = datetime.now() + timedelta(days=days)
            return deadline.isoformat()
        
        match = re.search(weeks_pattern, text, re.IGNORECASE)
        if match:
            weeks = int(match.group(1))
            deadline = datetime.now() + timedelta(weeks=weeks)
            return deadline.isoformat()
        
        # Default: 30 days from now
        deadline = datetime.now() + timedelta(days=30)
        return deadline.isoformat()
    
    def _detect_project_type(self, text: str) -> str:
        """Detect project type from text"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ['mobile app', 'android', 'ios', 'flutter']):
            return "Mobile Application"
        elif any(word in text_lower for word in ['e-commerce', 'ecommerce', 'e commerce', 'online store', 'shopping']):
            return "E-commerce Platform"
        elif any(word in text_lower for word in ['web app', 'webapp', 'web application']):
            return "Web Application"
        elif any(word in text_lower for word in ['website', 'web site', 'platform']):
            return "Website"
        elif any(word in text_lower for word in ['design', 'ui', 'ux', 'branding', 'logo']):
            return "Design"
        elif any(word in text_lower for word in ['inventory', 'management', 'erp', 'crm']):
            return "Business Software"
        else:
            return "Software Development"


# Example usage
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    # Sample email
    sample_email = {
        "email_id": "12345",
        "from": "client@example.com",
        "subject": "Need a web app in 20 days",
        "body": """Hi,
        
We need a web application for our business. Budget is Rs.1.5L. 
We can pay 50k advance. Deadline is in 20 days.

Please confirm if you can take this project.

Thanks,
John Doe"""
    }
    
    # Create agent
    agent = RequirementAgent()
    
    # Extract requirements
    requirements = agent.extract_requirements(sample_email)
    
    print("\n" + "="*80)
    print("REQUIREMENT EXTRACTION RESULTS")
    print("="*80 + "\n")
    print(json.dumps(requirements, indent=2))
