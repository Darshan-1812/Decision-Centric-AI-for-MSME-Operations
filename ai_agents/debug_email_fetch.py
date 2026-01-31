"""
Debug Email Fetch - Check what emails are in the inbox
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ai_agents.email_agent.email_connector import EmailConnector

def main():
    email = os.getenv("COMPANY_EMAIL")
    password = os.getenv("EMAIL_PASSWORD")
    
    print(f"\n{'='*80}")
    print(f"DEBUGGING EMAIL FETCH")
    print(f"{'='*80}\n")
    
    print(f"Email: {email}")
    
    connector = EmailConnector(email, password)
    
    if not connector.connect():
        print("❌ Failed to connect to email server")
        return
    
    print("✅ Connected to email server\n")
    
    # Fetch last 5 emails (both read and unread)
    print("Fetching last 5 emails (including read ones)...")
    all_emails = connector.fetch_recent_emails(limit=5)
    
    print(f"\nFound {len(all_emails)} emails:\n")
    
    for i, email_data in enumerate(all_emails, 1):
        print(f"Email #{i}:")
        print(f"  From: {email_data.get('from')}")
        print(f"  Subject: {email_data.get('subject')}")
        print(f"  Date: {email_data.get('date')}")
        print(f"  Body preview: {email_data.get('body', '')[:100]}...")
        print(f"  Email ID: {email_data.get('email_id')}")
        print()
    
    # Now check unread emails
    print("\n" + "="*80)
    print("Checking UNREAD emails only...")
    unread_emails = connector.fetch_unread_emails(limit=10)
    
    print(f"\nFound {len(unread_emails)} UNREAD emails:\n")
    
    for i, email_data in enumerate(unread_emails, 1):
        print(f"Unread Email #{i}:")
        print(f"  From: {email_data.get('from')}")
        print(f"  Subject: {email_data.get('subject')}")
        print(f"  Body preview: {email_data.get('body', '')[:150]}...")
        print()
    
    connector.disconnect()
    print("\n✅ Debug complete!")

if __name__ == "__main__":
    main()
