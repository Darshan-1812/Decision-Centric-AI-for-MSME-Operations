"""
Complete Autonomous Email-to-Project System
Integrates all agents for end-to-end automation
"""

import os
import sys
import time
import logging
from datetime import datetime
from typing import Dict, List

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import all agents
from ai_agents.email_agent.email_agent import EmailAgent
from ai_agents.requirement_agent.requirement_agent import RequirementAgent
from ai_agents.decision_agent.decision_agent import DecisionAgent
from ai_agents.team_agent.team_assignment import TeamAssignmentAgent
from ai_agents.communication_agent.communication_agent import CommunicationAgent
from ai_agents.monitoring_agent.progress_monitor import ProgressMonitor

logger = logging.getLogger(__name__)


class AutonomousSystem:
    """
    Complete Autonomous Email-to-Project System
    
    Workflow:
    1. Email Agent → Monitors inbox
    2. Requirement Agent → Extracts project details
    3. Decision Agent → Prioritizes projects
    4. Team Agent → Assigns tasks
    5. Communication Agent → Notifies client
    6. Monitoring Agent → Tracks progress
    """
    
    def __init__(self):
        """Initialize all agents"""
        logger.info("Initializing Autonomous System...")
        
        # Initialize agents
        self.email_agent = EmailAgent()
        self.requirement_agent = RequirementAgent()
        self.decision_agent = DecisionAgent()
        self.team_agent = TeamAssignmentAgent()
        self.communication_agent = CommunicationAgent()
        self.progress_monitor = ProgressMonitor()
        
        # Storage for active projects
        self.active_projects = []
        self.team_members = self._load_team_members()
        
        logger.info("Autonomous System initialized successfully")
    
    def _load_team_members(self) -> List[Dict]:
        """Load team members (in production, load from database)"""
        return [
            {
                "id": "D1",
                "name": "Alice",
                "skills": ["design", "ui", "ux"],
                "current_workload": 0,
                "max_capacity": 20
            },
            {
                "id": "D2",
                "name": "Bob",
                "skills": ["frontend", "react", "javascript"],
                "current_workload": 0,
                "max_capacity": 20
            },
            {
                "id": "D3",
                "name": "Charlie",
                "skills": ["backend", "python", "api", "database"],
                "current_workload": 0,
                "max_capacity": 20
            },
            {
                "id": "D4",
                "name": "Diana",
                "skills": ["testing", "qa", "automation"],
                "current_workload": 0,
                "max_capacity": 20
            }
        ]
    
    def process_new_emails(self):
        """Process new project emails"""
        logger.info("\n" + "="*80)
        logger.info("STEP 1: CHECKING FOR NEW EMAILS")
        logger.info("="*80)
        
        # Get new project emails
        project_emails = self.email_agent.process_new_emails()
        
        if not project_emails:
            logger.info("No new project emails found")
            return
        
        logger.info(f"Found {len(project_emails)} new project emails")
        
        for email_data in project_emails:
            self._process_single_project(email_data)
    
    def _process_single_project(self, email_data: Dict):
        """Process a single project from email to team assignment"""
        
        # STEP 2: Extract Requirements
        logger.info("\n" + "="*80)
        logger.info("STEP 2: EXTRACTING REQUIREMENTS")
        logger.info("="*80)
        
        requirements = self.requirement_agent.extract_requirements(email_data)
        logger.info(f"Extracted: {requirements.get('project_type')}, "
                   f"Budget: Rs.{requirements.get('budget')}, "
                   f"Deadline: {requirements.get('deadline')}")
        
        # STEP 3: Prioritize Project
        logger.info("\n" + "="*80)
        logger.info("STEP 3: CALCULATING PRIORITY")
        logger.info("="*80)
        
        # Calculate team load
        avg_team_load = sum(m['current_workload'] for m in self.team_members) / len(self.team_members)
        team_load_percentage = (avg_team_load / 20) * 100
        
        # Prepare project for priority scoring
        project_for_scoring = {
            "project_id": f"P{len(self.active_projects) + 1:03d}",
            "deadline": requirements.get('deadline'),
            "budget": requirements.get('budget'),
            "advance_paid": requirements.get('advance_paid'),
            "client_type": "new",  # Could be enhanced with client history
            "team_load": team_load_percentage
        }
        
        priority_result = self.decision_agent.priority_scorer.calculate_priority_score(project_for_scoring)
        
        logger.info(f"Priority Score: {priority_result['priority_score']} "
                   f"({priority_result['priority_level'].upper()})")
        logger.info(f"Reasoning: {', '.join(priority_result['reasoning'])}")
        
        # STEP 4: Assign Team
        logger.info("\n" + "="*80)
        logger.info("STEP 4: ASSIGNING TEAM")
        logger.info("="*80)
        
        team_assignment = self.team_agent.assign_team(requirements, self.team_members)
        
        logger.info(f"Created {len(team_assignment.get('tasks', []))} tasks")
        for task in team_assignment.get('tasks', []):
            logger.info(f"  - {task.get('task_name')}: assigned to {task.get('assigned_to')}")
        
        # STEP 5: Send Client Communication
        logger.info("\n" + "="*80)
        logger.info("STEP 5: NOTIFYING CLIENT")
        logger.info("="*80)
        
        project_data = {
            **requirements,
            **project_for_scoring,
            'priority_score': priority_result['priority_score'],
            'priority_level': priority_result['priority_level']
        }
        
        team_data = {
            'team_members': [
                m for m in self.team_members 
                if m['id'] in [t.get('assigned_to') for t in team_assignment.get('tasks', [])]
            ]
        }
        
        email_content = self.communication_agent.generate_project_accepted_email(
            project_data, team_data
        )
        
        client_email = requirements.get('client_email')
        self.communication_agent.send_email(client_email, email_content)
        
        # Mark email as processed
        self.email_agent.mark_email_processed(
            email_data['email_id'],
            project_for_scoring['project_id']
        )
        
        # Store project
        project_record = {
            **project_data,
            'tasks': team_assignment.get('tasks', []),
            'team_assignment': team_assignment,
            'status': 'active',
            'created_at': datetime.now().isoformat()
        }
        
        self.active_projects.append(project_record)
        
        logger.info(f"\n✓ Project {project_for_scoring['project_id']} successfully processed!")
    
    def monitor_active_projects(self):
        """Monitor all active projects for progress and delays"""
        logger.info("\n" + "="*80)
        logger.info("MONITORING ACTIVE PROJECTS")
        logger.info("="*80)
        
        for project in self.active_projects:
            if project.get('status') != 'active':
                continue
            
            # Check progress
            progress_report = self.progress_monitor.check_project_progress(
                project,
                project.get('tasks', [])
            )
            
            logger.info(f"\nProject {project['project_id']}: "
                       f"{progress_report['progress_percentage']}% complete")
            
            # Handle alerts
            for alert in progress_report.get('alerts', []):
                logger.warning(f"  ⚠ {alert['message']}")
                
                # Send delay alert if needed
                if alert['type'] == 'delay_risk' and alert['severity'] == 'high':
                    delay_email = self.communication_agent.generate_delay_alert_email(
                        project,
                        {
                            'new_deadline': project.get('deadline'),
                            'reason': alert['message'],
                            'progress_percentage': progress_report['progress_percentage']
                        }
                    )
                    
                    self.communication_agent.send_email(
                        project.get('client_email'),
                        delay_email
                    )
    
    def run_continuous_loop(self, interval_minutes: int = 10):
        """
        Run continuous autonomous loop
        
        Args:
            interval_minutes: Minutes between checks
        """
        logger.info(f"\n{'='*80}")
        logger.info("STARTING AUTONOMOUS SYSTEM")
        logger.info(f"{'='*80}\n")
        logger.info(f"Checking every {interval_minutes} minutes...")
        logger.info("Press Ctrl+C to stop\n")
        
        try:
            while True:
                # Process new emails
                self.process_new_emails()
                
                # Monitor active projects
                if self.active_projects:
                    self.monitor_active_projects()
                
                # Wait for next iteration
                logger.info(f"\nWaiting {interval_minutes} minutes until next check...")
                time.sleep(interval_minutes * 60)
                
        except KeyboardInterrupt:
            logger.info("\n\nStopping autonomous system...")
            self.email_agent.disconnect()
            logger.info("System stopped")
    
    def run_once(self):
        """Run one iteration (useful for testing)"""
        self.process_new_emails()
        if self.active_projects:
            self.monitor_active_projects()


# Example usage
if __name__ == "__main__":
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    
    # Create autonomous system
    system = AutonomousSystem()
    
    # Run once for testing
    system.run_once()
    
    # For continuous operation, use:
    # system.run_continuous_loop(interval_minutes=10)
