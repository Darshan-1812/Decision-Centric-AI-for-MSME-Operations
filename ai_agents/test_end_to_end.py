"""
End-to-End Test: Real Email to Project Workflow
Tests the complete autonomous system with real email monitoring
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

from ai_agents.email_agent.email_agent import EmailAgent

def test_email_to_project():
    """
    Test complete email-to-project workflow
    
    This will:
    1. Check your inbox for unread emails
    2. Detect project-related emails
    3. Show what would happen (without processing yet)
    """
    
    print("\n" + "="*80)
    print("END-TO-END TEST: EMAIL TO PROJECT WORKFLOW")
    print("="*80 + "\n")
    
    print("📧 Step 1: Connecting to your inbox...")
    
    # Create email agent
    agent = EmailAgent()
    
    # Check for new emails
    new_emails = agent.check_new_emails(limit=10)
    
    print(f"\n✅ Found {len(new_emails)} unread email(s)\n")
    
    if not new_emails:
        print("ℹ️  No unread emails found.")
        print("\nTo test the system:")
        print("1. Send an email to: darshangirase18@gmail.com")
        print("2. Subject: 'Need a mobile app'")
        print("3. Body: Include budget, deadline, and project details")
        print("4. Run this test again")
        agent.disconnect()
        return
    
    # Show all emails
    print("Unread Emails:")
    print("-" * 80)
    
    for i, email_data in enumerate(new_emails, 1):
        print(f"\n{i}. From: {email_data.get('from')}")
        print(f"   Subject: {email_data.get('subject')}")
        print(f"   Date: {email_data.get('date')}")
        
        # Check if it's a project email
        is_project = agent.is_project_email(email_data)
        
        if is_project:
            print(f"   🎯 PROJECT EMAIL DETECTED!")
            print(f"   Body preview: {email_data.get('body', '')[:150]}...")
        else:
            print(f"   ℹ️  Not a project email")
    
    # Filter project emails
    project_emails = [e for e in new_emails if agent.is_project_email(e)]
    
    print("\n" + "="*80)
    print(f"SUMMARY: {len(project_emails)} project email(s) detected")
    print("="*80 + "\n")
    
    if project_emails:
        print("✅ Ready to process project emails!")
        print("\nNext steps:")
        print("1. The autonomous system will extract requirements")
        print("2. Calculate priority using industry rules")
        print("3. Assign team members")
        print("4. Send professional response to client")
        print("5. Start progress monitoring")
        
        print("\n🚀 To run the full autonomous system:")
        print("   python -c \"from ai_agents.autonomous_system import AutonomousSystem; AutonomousSystem().run_once()\"")
    else:
        print("ℹ️  No project emails found in inbox.")
        print("\nTo test with a sample project email:")
        print("Send an email to yourself with:")
        print("  Subject: Need a web application")
        print("  Body: Budget Rs.1.5L, deadline 20 days, advance 50k paid")
    
    # Disconnect
    agent.disconnect()
    
    print("\n" + "="*80)
    print("✅ END-TO-END TEST COMPLETE")
    print("="*80 + "\n")


if __name__ == "__main__":
    test_email_to_project()
