"""
Email Connector - Gmail API / IMAP Integration
Handles email fetching and parsing
"""

import os
import imaplib
import email
from email.header import decode_header
from typing import List, Dict, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class EmailConnector:
    """
    Email connector using IMAP
    Supports Gmail and other IMAP providers
    """
    
    def __init__(self, 
                 email_address: str = None,
                 password: str = None,
                 imap_server: str = "imap.gmail.com",
                 imap_port: int = 993):
        """
        Initialize email connector
        
        Args:
            email_address: Email account to monitor
            password: App password (for Gmail, use App Password, not regular password)
            imap_server: IMAP server address
            imap_port: IMAP port (usually 993 for SSL)
        """
        self.email_address = email_address or os.getenv("COMPANY_EMAIL")
        self.password = password or os.getenv("EMAIL_PASSWORD")
        self.imap_server = imap_server
        self.imap_port = imap_port
        self.connection = None
    
    def connect(self) -> bool:
        """
        Connect to email server
        
        Returns:
            True if connected successfully
        """
        try:
            self.connection = imaplib.IMAP4_SSL(self.imap_server, self.imap_port)
            self.connection.login(self.email_address, self.password)
            logger.info(f"Connected to {self.email_address}")
            return True
        except Exception as e:
            logger.error(f"Failed to connect: {e}")
            return False
    
    def disconnect(self):
        """Disconnect from email server"""
        if self.connection:
            try:
                self.connection.close()
                self.connection.logout()
                logger.info("Disconnected from email server")
            except:
                pass
    
    def fetch_unread_emails(self, folder: str = "INBOX", limit: int = 10) -> List[Dict]:
        """
        Fetch unread emails from specified folder
        
        Args:
            folder: Email folder to check (default: INBOX)
            limit: Maximum number of emails to fetch
            
        Returns:
            List of email dictionaries with parsed content
        """
        if not self.connection:
            if not self.connect():
                return []
        
        try:
            # Select folder
            self.connection.select(folder)
            
            # Search for unread emails
            status, messages = self.connection.search(None, 'UNSEEN')
            
            if status != 'OK':
                logger.warning("No unread emails found")
                return []
            
            email_ids = messages[0].split()
            
            # Limit number of emails
            email_ids = email_ids[-limit:] if len(email_ids) > limit else email_ids
            
            emails = []
            
            for email_id in email_ids:
                try:
                    # Fetch email
                    status, msg_data = self.connection.fetch(email_id, '(RFC822)')
                    
                    if status != 'OK':
                        continue
                    
                    # Parse email
                    raw_email = msg_data[0][1]
                    email_message = email.message_from_bytes(raw_email)
                    
                    # Extract email details
                    parsed_email = self._parse_email(email_message, email_id.decode())
                    emails.append(parsed_email)
                    
                except Exception as e:
                    logger.error(f"Error parsing email {email_id}: {e}")
                    continue
            
            logger.info(f"Fetched {len(emails)} unread emails")
            return emails
            
        except Exception as e:
            logger.error(f"Error fetching emails: {e}")
            return []
    
    def fetch_recent_emails(self, folder: str = "INBOX", days: int = 1, limit: int = 20) -> List[Dict]:
        """
        Fetch recent emails from last N days (regardless of read status)
        
        Args:
            folder: Email folder to check (default: INBOX)
            days: Number of days to look back (default: 1)
            limit: Maximum number of emails to fetch
            
        Returns:
            List of email dictionaries with parsed content
        """
        logger.info(f"fetch_recent_emails called: folder={folder}, days={days}, limit={limit}")
        
        if not self.connection:
            logger.info("No connection, attempting to connect...")
            if not self.connect():
                logger.error("Failed to connect!")
                return []
            logger.info("Connected successfully")
        
        try:
            from datetime import datetime, timedelta
            
            # Select folder
            logger.info(f"Selecting folder: {folder}")
            self.connection.select(folder)
            
            # Instead of using SINCE (which has timezone issues), 
            # fetch ALL emails and filter by date in Python
            # This is more reliable across different IMAP servers
            logger.info("Searching for ALL emails...")
            status, messages = self.connection.search(None, 'ALL')
            
            if status != 'OK':
                logger.warning(f"Search returned status: {status}")
                return []
            
            email_ids = messages[0].split()
            logger.info(f"Found {len(email_ids)} total emails in inbox")
            
            # Get most recent emails (last N)
            # Fetch more than limit to account for filtering
            fetch_count = min(len(email_ids), limit * 3)
            email_ids = email_ids[-fetch_count:] if len(email_ids) > fetch_count else email_ids
            
            logger.info(f"Will fetch {len(email_ids)} most recent emails")
            
            emails = []
            cutoff_date = datetime.now() - timedelta(days=days)
            logger.info(f"Cutoff date: {cutoff_date}")
            
            for i, email_id in enumerate(reversed(email_ids)):  # Start from most recent
                try:
                    # Fetch email
                    status, msg_data = self.connection.fetch(email_id, '(RFC822)')
                    
                    if status != 'OK':
                        logger.warning(f"Failed to fetch email {email_id}")
                        continue
                    
                    # Parse email
                    raw_email = msg_data[0][1]
                    email_message = email.message_from_bytes(raw_email)
                    
                    # Extract email details
                    parsed_email = self._parse_email(email_message, email_id.decode())
                    
                    # Check if email is within date range
                    # Use received_at timestamp
                    email_date = datetime.fromisoformat(parsed_email['received_at'])
                    
                    if email_date >= cutoff_date:
                        emails.append(parsed_email)
                        logger.info(f"Email {i+1}: '{parsed_email.get('subject', '(no subject)')}' - INCLUDED (date: {email_date})")
                        
                        # Stop if we have enough
                        if len(emails) >= limit:
                            logger.info(f"Reached limit of {limit} emails")
                            break
                    else:
                        logger.debug(f"Email {i+1}: '{parsed_email.get('subject', '(no subject)')}' - SKIPPED (too old: {email_date})")
                    
                except Exception as e:
                    logger.error(f"Error parsing email {email_id}: {e}")
                    continue
            
            logger.info(f"Returning {len(emails)} recent emails from last {days} day(s)")
            return emails
            
        except Exception as e:
            logger.error(f"Error fetching recent emails: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return []
    
    def _parse_email(self, email_message, email_id: str) -> Dict:
        """
        Parse email message into structured dictionary
        
        Args:
            email_message: Email message object
            email_id: Email ID
            
        Returns:
            Dictionary with email details
        """
        # Decode subject
        subject = email_message.get("Subject", "")
        if subject:
            decoded_subject = decode_header(subject)[0]
            if isinstance(decoded_subject[0], bytes):
                subject = decoded_subject[0].decode(decoded_subject[1] or 'utf-8')
            else:
                subject = decoded_subject[0]
        
        # Get sender
        from_header = email_message.get("From", "")
        
        # Get date
        date_header = email_message.get("Date", "")
        
        # Extract body
        body = self._extract_body(email_message)
        
        return {
            "email_id": email_id,
            "from": from_header,
            "subject": subject,
            "date": date_header,
            "body": body,
            "received_at": datetime.now().isoformat()
        }
    
    def _extract_body(self, email_message) -> str:
        """
        Extract email body (text or HTML)
        
        Args:
            email_message: Email message object
            
        Returns:
            Email body as string
        """
        body = ""
        
        if email_message.is_multipart():
            # Multipart email
            for part in email_message.walk():
                content_type = part.get_content_type()
                content_disposition = str(part.get("Content-Disposition", ""))
                
                # Skip attachments
                if "attachment" in content_disposition:
                    continue
                
                # Get text content
                if content_type == "text/plain":
                    try:
                        body = part.get_payload(decode=True).decode()
                        break
                    except:
                        pass
                elif content_type == "text/html" and not body:
                    try:
                        # Fallback to HTML if no plain text
                        body = part.get_payload(decode=True).decode()
                    except:
                        pass
        else:
            # Simple email
            try:
                body = email_message.get_payload(decode=True).decode()
            except:
                body = str(email_message.get_payload())
        
        return body.strip()
    
    def mark_as_read(self, email_id: str):
        """
        Mark email as read
        
        Args:
            email_id: Email ID to mark as read
        """
        if not self.connection:
            return
        
        try:
            self.connection.store(email_id.encode(), '+FLAGS', '\\Seen')
            logger.info(f"Marked email {email_id} as read")
        except Exception as e:
            logger.error(f"Error marking email as read: {e}")


# Example usage
if __name__ == "__main__":
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    
    # Create connector
    connector = EmailConnector()
    
    # Fetch unread emails
    emails = connector.fetch_unread_emails(limit=5)
    
    print(f"\nFound {len(emails)} unread emails:\n")
    for email_data in emails:
        print(f"From: {email_data['from']}")
        print(f"Subject: {email_data['subject']}")
        print(f"Body preview: {email_data['body'][:100]}...")
        print("-" * 80)
    
    # Disconnect
    connector.disconnect()
