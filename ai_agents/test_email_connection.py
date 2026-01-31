"""
Test Email Connection
Verify Gmail IMAP connection with configured credentials
"""

import os
import sys
import logging
from dotenv import load_dotenv

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(levelname)s - %(message)s'
)

from ai_agents.email_agent.email_connector import EmailConnector

def test_email_connection():
    """Test email connection"""
    
    print("\n" + "="*80)
    print("EMAIL CONNECTION TEST")
    print("="*80 + "\n")
    
    # Get credentials from environment
    email = os.getenv("COMPANY_EMAIL")
    password = os.getenv("EMAIL_PASSWORD")
    company = os.getenv("COMPANY_NAME")
    
    print(f"Company: {company}")
    print(f"Email: {email}")
    print(f"Password: {'*' * len(password) if password else 'NOT SET'}")
    
    if not email or not password:
        print("\n❌ ERROR: Email credentials not configured in .env file")
        return False
    
    print("\n📧 Attempting to connect to Gmail IMAP...")
    
    try:
        # Create connector
        connector = EmailConnector(email, password)
        
        # Try to connect
        if connector.connect():
            print("✅ Successfully connected to Gmail!")
            
            # Try to fetch emails
            print("\n📬 Checking inbox for unread emails...")
            emails = connector.fetch_unread_emails(limit=5)
            
            print(f"\n✅ Found {len(emails)} unread email(s)")
            
            if emails:
                print("\nRecent emails:")
                for i, email_data in enumerate(emails[:3], 1):
                    print(f"\n{i}. From: {email_data.get('from', 'Unknown')}")
                    print(f"   Subject: {email_data.get('subject', 'No subject')}")
                    print(f"   Date: {email_data.get('date', 'Unknown')}")
            
            # Disconnect
            connector.disconnect()
            
            print("\n" + "="*80)
            print("✅ EMAIL CONNECTION TEST PASSED!")
            print("="*80 + "\n")
            
            return True
            
        else:
            print("\n❌ Failed to connect to Gmail")
            print("\nPossible issues:")
            print("1. Check if 2-Factor Authentication is enabled")
            print("2. Verify App Password is correct (16 characters, no spaces)")
            print("3. Make sure 'Less secure app access' is not blocking")
            return False
            
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nTroubleshooting:")
        print("1. Verify email and password in .env file")
        print("2. Generate new App Password: https://myaccount.google.com/apppasswords")
        print("3. Remove spaces from App Password")
        return False


if __name__ == "__main__":
    test_email_connection()
