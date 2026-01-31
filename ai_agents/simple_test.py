# -*- coding: utf-8 -*-
import sys
import os
from dotenv import load_dotenv

# Fix encoding for Windows
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

load_dotenv()
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ai_agents.email_agent.email_connector import EmailConnector

email = os.getenv("COMPANY_EMAIL")
password = os.getenv("EMAIL_PASSWORD")

print("Testing fetch_recent_emails...")
print("="*60)

connector = EmailConnector(email, password)

if connector.connect():
    print("Connected!")
    
    # Call the exact method
    emails = connector.fetch_recent_emails(days=1, limit=20)
    
    print(f"\nResult: {len(emails)} emails")
    
    for i, e in enumerate(emails[:5], 1):  # Show first 5
        subject = e.get('subject', '(no subject)')
        from_addr = e.get('from', '(unknown)')
        print(f"{i}. {subject[:50]} from {from_addr[:30]}")
    
    connector.disconnect()
else:
    print("Failed to connect")
