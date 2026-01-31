"""
Email Storage - Track processed emails
Prevents duplicate processing
"""

import json
import os
from typing import Dict, List, Set
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class EmailStorage:
    """
    Simple file-based storage for tracking processed emails
    In production, use a database
    """
    
    def __init__(self, storage_file: str = "processed_emails.json"):
        """
        Initialize email storage
        
        Args:
            storage_file: Path to storage file
        """
        self.storage_file = storage_file
        self.processed_emails: Set[str] = set()
        self.email_project_mapping: Dict[str, str] = {}
        self._load()
    
    def _load(self):
        """Load processed emails from file"""
        if os.path.exists(self.storage_file):
            try:
                with open(self.storage_file, 'r') as f:
                    data = json.load(f)
                    self.processed_emails = set(data.get('processed_emails', []))
                    self.email_project_mapping = data.get('email_project_mapping', {})
                logger.info(f"Loaded {len(self.processed_emails)} processed emails")
            except Exception as e:
                logger.error(f"Error loading storage: {e}")
    
    def _save(self):
        """Save processed emails to file"""
        try:
            data = {
                'processed_emails': list(self.processed_emails),
                'email_project_mapping': self.email_project_mapping,
                'last_updated': datetime.now().isoformat()
            }
            with open(self.storage_file, 'w') as f:
                json.dump(data, f, indent=2)
            logger.debug("Saved processed emails")
        except Exception as e:
            logger.error(f"Error saving storage: {e}")
    
    def is_processed(self, email_id: str) -> bool:
        """
        Check if email has been processed
        
        Args:
            email_id: Email ID to check
            
        Returns:
            True if email has been processed
        """
        return email_id in self.processed_emails
    
    def mark_processed(self, email_id: str, project_id: str = None):
        """
        Mark email as processed
        
        Args:
            email_id: Email ID
            project_id: Associated project ID (optional)
        """
        self.processed_emails.add(email_id)
        
        if project_id:
            self.email_project_mapping[email_id] = project_id
        
        self._save()
        logger.info(f"Marked email {email_id} as processed")
    
    def get_project_id(self, email_id: str) -> str:
        """
        Get project ID associated with email
        
        Args:
            email_id: Email ID
            
        Returns:
            Project ID or None
        """
        return self.email_project_mapping.get(email_id)
    
    def get_stats(self) -> Dict:
        """
        Get storage statistics
        
        Returns:
            Dictionary with stats
        """
        return {
            'total_processed': len(self.processed_emails),
            'total_projects': len(self.email_project_mapping)
        }
