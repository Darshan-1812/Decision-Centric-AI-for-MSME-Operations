"""
Demo: Complete Autonomous Email-to-Project System
Simulates the full workflow without requiring actual email setup
"""

import sys
import os
import json
import logging
from datetime import datetime, timedelta

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)


def demo_autonomous_system():
    """
    Demonstrate the complete autonomous system workflow
    """
    
    print("\n" + "="*80)
    print("AUTONOMOUS EMAIL-TO-PROJECT SYSTEM - DEMO")
    print("="*80 + "\n")
    
    # Simulate incoming email
    print("📧 STEP 1: CLIENT EMAIL RECEIVED")
    print("-" * 80)
    
    sample_email = {
        "email_id": "demo_001",
        "from": "john.doe@example.com",
        "subject": "Need a web application for our business",
        "date": datetime.now().isoformat(),
        "body": """Hi,

We need a web application for our e-commerce business. 
Budget is Rs.1.5L and we can pay 50k advance immediately.
Deadline is in 20 days.

The app should have:
- Product catalog
- Shopping cart
- Payment integration
- Admin panel

Please confirm if you can take this project.

Thanks,
John Doe
CEO, Example Corp"""
    }
    
    print(f"From: {sample_email['from']}")
    print(f"Subject: {sample_email['subject']}")
    print(f"Body: {sample_email['body'][:100]}...")
    
    # STEP 2: Requirement Extraction
    print("\n\n🤖 STEP 2: AI EXTRACTS REQUIREMENTS")
    print("-" * 80)
    
    from ai_agents.requirement_agent.requirement_agent import RequirementAgent
    
    req_agent = RequirementAgent()
    requirements = req_agent.extract_requirements(sample_email)
    
    print(f"Project Type: {requirements.get('project_type')}")
    print(f"Budget: Rs.{requirements.get('budget'):,}")
    print(f"Deadline: {requirements.get('deadline')}")
    print(f"Advance Paid: {requirements.get('advance_paid')}")
    print(f"Complexity: {requirements.get('complexity')}")
    print(f"Estimated Effort: {requirements.get('estimated_effort_days')} days")
    
    # STEP 3: Priority Calculation
    print("\n\n⚖️ STEP 3: CALCULATE PRIORITY (INDUSTRY RULES)")
    print("-" * 80)
    
    from ai_agents.decision_agent.priority_scorer import PriorityScorer
    
    scorer = PriorityScorer()
    
    project_for_scoring = {
        "project_id": "P001",
        "deadline": requirements.get('deadline'),
        "budget": requirements.get('budget'),
        "advance_paid": requirements.get('advance_paid'),
        "client_type": "new",
        "team_load": 45  # 45% team capacity used
    }
    
    priority_result = scorer.calculate_priority_score(project_for_scoring)
    
    print(f"Priority Score: {priority_result['priority_score']}")
    print(f"Priority Level: {priority_result['priority_level'].upper()}")
    print(f"\nReasoning:")
    for reason in priority_result['reasoning']:
        print(f"  • {reason}")
    
    print(f"\nScore Breakdown:")
    for key, value in priority_result['breakdown'].items():
        print(f"  • {key.replace('_', ' ').title()}: {value}")
    
    # STEP 4: Team Assignment
    print("\n\n👥 STEP 4: AI ASSIGNS TEAM")
    print("-" * 80)
    
    from ai_agents.team_agent.team_assignment import TeamAssignmentAgent
    
    team_agent = TeamAssignmentAgent()
    
    team_members = [
        {"id": "D1", "name": "Alice", "skills": ["design", "ui", "ux"], "current_workload": 5, "max_capacity": 20},
        {"id": "D2", "name": "Bob", "skills": ["frontend", "react", "javascript"], "current_workload": 8, "max_capacity": 20},
        {"id": "D3", "name": "Charlie", "skills": ["backend", "python", "api"], "current_workload": 6, "max_capacity": 20},
        {"id": "D4", "name": "Diana", "skills": ["testing", "qa"], "current_workload": 3, "max_capacity": 20}
    ]
    
    assignment = team_agent.assign_team(requirements, team_members)
    
    print(f"Tasks Created: {len(assignment.get('tasks', []))}")
    print("\nTask Breakdown:")
    for task in assignment.get('tasks', []):
        print(f"  • {task.get('task_name')}")
        print(f"    Assigned to: {task.get('assigned_to')}")
        print(f"    Estimated: {task.get('estimated_days', 'N/A')} days")
    
    if assignment.get('warnings'):
        print(f"\n⚠️  Warnings:")
        for warning in assignment['warnings']:
            print(f"  • {warning}")
    
    # STEP 5: Client Communication
    print("\n\n✉️ STEP 5: AUTO-GENERATE CLIENT EMAIL")
    print("-" * 80)
    
    from ai_agents.communication_agent.communication_agent import CommunicationAgent
    
    comm_agent = CommunicationAgent()
    
    project_data = {
        **requirements,
        **project_for_scoring,
        'priority_score': priority_result['priority_score']
    }
    
    team_data = {
        'team_members': [m for m in team_members if m['id'] in [t.get('assigned_to') for t in assignment.get('tasks', [])]]
    }
    
    email_content = comm_agent.generate_project_accepted_email(project_data, team_data)
    
    print(f"Subject: {email_content.get('subject')}")
    print(f"\nBody:\n{email_content.get('body')}")
    
    # STEP 6: Progress Monitoring (Simulated)
    print("\n\n📊 STEP 6: CONTINUOUS PROGRESS MONITORING")
    print("-" * 80)
    
    from ai_agents.monitoring_agent.progress_monitor import ProgressMonitor
    
    monitor = ProgressMonitor()
    
    # Simulate project with some progress
    simulated_tasks = [
        {'task_id': 'T1', 'status': 'completed', 'assigned_to': 'D1'},
        {'task_id': 'T2', 'status': 'in_progress', 'assigned_to': 'D2'},
        {'task_id': 'T3', 'status': 'pending', 'assigned_to': 'D3'},
        {'task_id': 'T4', 'status': 'pending', 'assigned_to': 'D4'}
    ]
    
    progress_report = monitor.check_project_progress(project_data, simulated_tasks)
    
    print(f"Progress: {progress_report['progress_percentage']}%")
    print(f"Completed Tasks: {progress_report['completed_tasks']}/{len(simulated_tasks)}")
    print(f"Days Remaining: {progress_report['days_remaining']}")
    print(f"Delay Risk: {progress_report['delay_risk']['message']}")
    
    if progress_report.get('alerts'):
        print(f"\n⚠️  Alerts:")
        for alert in progress_report['alerts']:
            print(f"  • {alert['message']}")
    
    # Summary
    print("\n\n" + "="*80)
    print("✅ AUTONOMOUS SYSTEM DEMO COMPLETE")
    print("="*80 + "\n")
    
    print("What Just Happened:")
    print("1. ✓ Email automatically detected as project request")
    print("2. ✓ AI extracted all project requirements")
    print("3. ✓ Priority calculated using industry rules (40% deadline, 25% payment, etc.)")
    print("4. ✓ AI broke down project into tasks and assigned team")
    print("5. ✓ Professional email auto-generated for client")
    print("6. ✓ Progress monitoring ready to track and predict delays")
    print("\n🎯 ZERO MANUAL COORDINATION REQUIRED!\n")


if __name__ == "__main__":
    demo_autonomous_system()
