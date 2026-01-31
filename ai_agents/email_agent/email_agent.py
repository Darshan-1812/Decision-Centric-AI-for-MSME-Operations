"""
Email Agent - Main Agent
Monitors inbox and triggers requirement extraction for project emails
"""

import os
import logging
from typing import List, Dict, Optional
from datetime import datetime
from .email_connector import EmailConnector
from .email_storage import EmailStorage

logger = logging.getLogger(__name__)


class EmailAgent:
    """
    Email Agent - Monitors inbox for new project requests
    
    This agent:
    - Continuously monitors company inbox
    - Detects new project-related emails
    - Filters out non-project emails
    - Triggers requirement extraction for valid projects
    """
    
    def __init__(self, 
                 email_address: str = None,
                 password: str = None):
        """
        Initialize Email Agent
        
        Args:
            email_address: Company email to monitor
            password: Email password (App Password for Gmail)
        """
        self.connector = EmailConnector(email_address, password)
        self.storage = EmailStorage()
        self.name = "EmailAgent"
    
    def check_new_emails(self, limit: int = 10) -> List[Dict]:
        """
        Check for new emails (from last 24 hours)
        
        Args:
            limit: Maximum number of emails to fetch
            
        Returns:
            List of new project-related emails
        """
        logger.info("Checking for new emails...")
        
        # Fetch recent emails (last 24 hours, regardless of read status)
        # This allows us to find emails even if they were opened in Gmail
        emails = self.connector.fetch_recent_emails(days=1, limit=limit)
        
        # Filter out already processed emails
        new_emails = []
        for email_data in emails:
            email_id = email_data['email_id']
            
            if not self.storage.is_processed(email_id):
                new_emails.append(email_data)
        
        logger.info(f"Found {len(new_emails)} new unprocessed emails")
        return new_emails
    
    def is_project_email(self, email_data: Dict) -> bool:
        """
        Determine if email is a project request
        
        Uses keyword matching with exclusions.
        
        Args:
            email_data: Email dictionary
            
        Returns:
            True if email appears to be a project request
        """
        subject = email_data.get('subject', '').lower()
        body = email_data.get('body', '').lower()
        sender = email_data.get('from', '').lower()
        
        # 1. Check EXCLUSIONS first (spam, notifications, etc.)
        exclusions = [
            'security alert', 'no-reply', 'noreply', 'newsletter', 
            'verify', 'verification', 'code', 'otp', 'login', 
            'signin', 'alert', 'update', 'promotion', 'advertisement',
            'linkedin', 'google', 'facebook', 'twitter', 'instagram'
        ]
        
        # Check sender and subject for exclusions
        if any(ex in sender for ex in exclusions):
            logger.debug(f"Email rejected: sender contains exclusion '{sender}'")
            return False
            
        if any(ex in subject for ex in exclusions):
            logger.debug(f"Email rejected: subject contains exclusion '{subject}'")
            return False
        
        # 2. Check PROJECT keywords
        # Use simple word boundary check by padding with spaces
        text = f" {subject} {body} "
        
        project_keywords = [
            ' project ', ' website ', ' mobile app ', ' web app ', ' application ', 
            ' development ', ' design ', ' build ', ' create ', ' looking for ', 
            ' quote ', ' estimate ', ' proposal ', ' budget ', ' deadline ',
            ' software ', ' system ', ' platform ', ' e-commerce ', ' ecommerce ',
            ' need a ', ' require ', ' urgent '
        ]
        
        # Check if any keyword is in subject or body
        found_keywords = [kw.strip() for kw in project_keywords if kw in text]
        
        if found_keywords:
            logger.info(f"Email classified as project request (matched: {found_keywords})")
            return True
        
        logger.debug("Email does not appear to be a project request")
        return False
    
    def process_new_emails(self) -> List[Dict]:
        """
        Process new emails and return project requests
        
        Returns:
            List of project-related emails ready for requirement extraction
        """
        # Check for new emails
        new_emails = self.check_new_emails()
        
        # Filter project emails
        project_emails = []
        
        for email_data in new_emails:
            if self.is_project_email(email_data):
                project_emails.append(email_data)
                logger.info(f"Project email detected: {email_data['subject']}")
            else:
                # Mark non-project emails as processed
                self.storage.mark_processed(email_data['email_id'])
                logger.debug(f"Non-project email marked as processed: {email_data['subject']}")
        
        return project_emails
    
    def mark_email_processed(self, email_id: str, project_id: str = None):
        """
        Mark email as processed
        
        Args:
            email_id: Email ID
            project_id: Associated project ID (optional)
        """
        self.storage.mark_processed(email_id, project_id)
        
        # Also mark as read in inbox
        self.connector.mark_as_read(email_id)
    
    def get_stats(self) -> Dict:
        """
        Get email agent statistics
        
        Returns:
            Dictionary with stats
        """
        return {
            'agent_name': self.name,
            **self.storage.get_stats()
        }
    
    def disconnect(self):
        """Disconnect from email server"""
        self.connector.disconnect()


# Example usage
if __name__ == "__main__":
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Create email agent
    agent = EmailAgent()
    
    # Process new emails
    project_emails = agent.process_new_emails()
    
    print(f"\n{'='*80}")
    print(f"EMAIL AGENT - PROCESSING RESULTS")
    print(f"{'='*80}\n")
    
    print(f"Found {len(project_emails)} project-related emails:\n")
    
    for email_data in project_emails:
        print(f"From: {email_data['from']}")
        print(f"Subject: {email_data['subject']}")
        print(f"Date: {email_data['date']}")
        print(f"Body preview: {email_data['body'][:200]}...")
        print("-" * 80)
    
    # Show stats
    stats = agent.get_stats()
    print(f"\nAgent Statistics:")
    print(f"  Total processed emails: {stats['total_processed']}")
    print(f"  Total projects created: {stats['total_projects']}")
    
    # Disconnect
    agent.disconnect()
