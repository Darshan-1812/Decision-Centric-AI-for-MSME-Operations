import os
import sys
from dotenv import load_dotenv

load_dotenv()
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ai_agents.email_agent.email_connector import EmailConnector

email = os.getenv("COMPANY_EMAIL")
password = os.getenv("EMAIL_PASSWORD")

print(f"Testing email: {email}")
print("="*80)

connector = EmailConnector(email, password)

if connector.connect():
    print("✅ Connected successfully")
    
    # Fetch recent emails
    emails = connector.fetch_recent_emails(days=1, limit=10)
    
    print(f"\nFound {len(emails)} emails from last 24 hours:\n")
    
    for i, e in enumerate(emails, 1):
        print(f"{i}. Subject: {e.get('subject')}")
        print(f"   From: {e.get('from')}")
        print(f"   Date: {e.get('date')}")
        print(f"   Body preview: {e.get('body', '')[:150]}...")
        
        # Check for project keywords
        subject = e.get('subject', '').lower()
        body = e.get('body', '').lower()
        text = f"{subject} {body}"
        
        keywords = ['project', 'website', 'app', 'development', 'e-commerce', 'platform', 'need', 'urgent']
        found = [kw for kw in keywords if kw in text]
        
        if found:
            print(f"   ✅ MATCHES keywords: {found}")
        else:
            print(f"   ❌ No project keywords found")
        print()
    
    connector.disconnect()
else:
    print("❌ Failed to connect")
