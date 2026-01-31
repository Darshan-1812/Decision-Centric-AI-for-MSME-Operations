"""
Direct test of the exact API endpoint logic
"""
import os
import sys
from dotenv import load_dotenv

load_dotenv()
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ai_agents.email_agent.email_agent import EmailAgent

print("="*80)
print("TESTING EXACT API LOGIC")
print("="*80)

agent = EmailAgent()

# This is exactly what the API does
print("\n1. Fetching recent emails...")
all_recent = agent.connector.fetch_recent_emails(days=1, limit=20)
print(f"   Found {len(all_recent)} total emails from last 24 hours")

print("\n2. Processing to find project emails...")
project_emails = agent.process_new_emails()
print(f"   Found {len(project_emails)} project emails after filtering")

if len(all_recent) > 0 and len(project_emails) == 0:
    print("\n⚠️  PROBLEM: Found emails but 0 project emails!")
    print("   This means emails are being filtered out.")
    print("\n   Checking why...")
    
    # Check each email manually
    for i, email_data in enumerate(all_recent, 1):
        email_id = email_data['email_id']
        is_processed = agent.storage.is_processed(email_id)
        is_project = agent.is_project_email(email_data)
        
        print(f"\n   Email {i}: {email_data.get('subject', '(no subject)')}")
        print(f"      From: {email_data.get('from')}")
        print(f"      Already processed: {is_processed}")
        print(f"      Matches project keywords: {is_project}")
        
        if is_processed:
            print(f"      ❌ FILTERED OUT - Already processed")
        elif not is_project:
            print(f"      ❌ FILTERED OUT - Not a project email")
        else:
            print(f"      ✅ SHOULD BE INCLUDED")

print("\n" + "="*80)
print(f"RESULT: {len(project_emails)} project emails")
print("="*80)

agent.disconnect()
