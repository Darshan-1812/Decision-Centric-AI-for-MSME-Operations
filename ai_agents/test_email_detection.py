"""
Test Email Detection - Comprehensive Debug
"""

import os
import sys
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

from ai_agents.email_agent.email_connector import EmailConnector
from ai_agents.email_agent.email_agent import EmailAgent

def main():
    print(f"\n{'='*80}")
    print(f"COMPREHENSIVE EMAIL DETECTION TEST")
    print(f"{'='*80}\n")
    
    email = os.getenv("COMPANY_EMAIL")
    password = os.getenv("EMAIL_PASSWORD")
    
    print(f"Email: {email}\n")
    
    # Test 1: Direct connector test
    print("=" * 80)
    print("TEST 1: Fetching recent emails via connector")
    print("=" * 80)
    
    connector = EmailConnector(email, password)
    
    if not connector.connect():
        print("❌ Failed to connect")
        return
    
    print("✅ Connected\n")
    
    # Fetch recent emails (last 1 day)
    recent_emails = connector.fetch_recent_emails(days=1, limit=10)
    
    print(f"Found {len(recent_emails)} emails from last 24 hours:\n")
    
    for i, email_data in enumerate(recent_emails, 1):
        print(f"Email #{i}:")
        print(f"  From: {email_data.get('from')}")
        print(f"  Subject: {email_data.get('subject')}")
        print(f"  Date: {email_data.get('date')}")
        print(f"  Body preview: {email_data.get('body', '')[:200]}...")
        print(f"  Email ID: {email_data.get('email_id')}")
        
        # Check if it matches project keywords
        subject = email_data.get('subject', '').lower()
        body = email_data.get('body', '').lower()
        text = f"{subject} {body}"
        
        project_keywords = [
            'project', 'website', 'app', 'application', 'development',
            'design', 'build', 'create', 'need', 'require', 'looking for',
            'quote', 'estimate', 'proposal', 'budget', 'deadline',
            'mobile app', 'web app', 'software', 'system', 'e-commerce', 'platform'
        ]
        
        matched_keywords = [kw for kw in project_keywords if kw in text]
        
        if matched_keywords:
            print(f"  ✅ MATCHES project keywords: {matched_keywords}")
        else:
            print(f"  ❌ No project keywords found")
        
        print()
    
    connector.disconnect()
    
    # Test 2: Email Agent test
    print("\n" + "=" * 80)
    print("TEST 2: Using EmailAgent.process_new_emails()")
    print("=" * 80 + "\n")
    
    agent = EmailAgent()
    project_emails = agent.process_new_emails()
    
    print(f"EmailAgent found {len(project_emails)} project emails:\n")
    
    for i, email_data in enumerate(project_emails, 1):
        print(f"Project Email #{i}:")
        print(f"  From: {email_data.get('from')}")
        print(f"  Subject: {email_data.get('subject')}")
        print(f"  Body preview: {email_data.get('body', '')[:200]}...")
        print()
    
    agent.disconnect()
    
    print("\n✅ Test complete!")

if __name__ == "__main__":
    main()
