"""
FINAL COMPREHENSIVE TEST - Direct API simulation
"""
import sys
import os
from dotenv import load_dotenv

load_dotenv()
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up logging FIRST
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

print("\n" + "="*80)
print("SIMULATING EXACT API CALL")
print("="*80 + "\n")

# This is EXACTLY what the API does
from ai_agents.email_agent.email_agent import EmailAgent

agent = EmailAgent()

print("Step 1: Calling agent.connector.fetch_recent_emails(days=1, limit=20)")
print("-" * 80)
all_recent = agent.connector.fetch_recent_emails(days=1, limit=20)
print(f"\nRESULT: Found {len(all_recent)} total emails\n")

print("Step 2: Calling agent.process_new_emails()")
print("-" * 80)
project_emails = agent.process_new_emails()
print(f"\nRESULT: Found {len(project_emails)} project emails\n")

agent.disconnect()

print("="*80)
print(f"FINAL RESULT: {len(project_emails)} project emails would be returned by API")
print("="*80)

if len(project_emails) > 0:
    print("\n✅ SUCCESS! Emails found:")
    for i, e in enumerate(project_emails, 1):
        print(f"  {i}. {e.get('subject')} from {e.get('from')}")
else:
    print("\n❌ PROBLEM: No emails found")
    print(f"   Total recent emails: {len(all_recent)}")
    if len(all_recent) > 0:
        print("   Emails exist but were filtered out!")
