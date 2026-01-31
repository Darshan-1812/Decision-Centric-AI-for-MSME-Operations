"""
Progress Monitoring Agent
Tracks task progress and predicts delays
"""

import logging
from typing import Dict, List
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


class ProgressMonitor:
    """
    Progress Monitoring Agent
    
    Tracks project and task progress, predicts delays
    """
    
    def __init__(self):
        """Initialize Progress Monitor"""
        self.name = "ProgressMonitor"
    
    def check_project_progress(self, project: Dict, tasks: List[Dict]) -> Dict:
        """
        Check project progress and detect issues
        
        Args:
            project: Project dictionary
            tasks: List of tasks
            
        Returns:
            Progress report with alerts
        """
        logger.info(f"Checking progress for project: {project.get('project_id')}")
        
        # Calculate overall progress
        total_tasks = len(tasks)
        completed_tasks = sum(1 for t in tasks if t.get('status') == 'completed')
        in_progress_tasks = sum(1 for t in tasks if t.get('status') == 'in_progress')
        
        progress_percentage = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        # Check deadline
        deadline = datetime.fromisoformat(project.get('deadline', datetime.now().isoformat()))
        days_remaining = (deadline - datetime.now()).days
        
        # Predict delay
        delay_risk = self._predict_delay(project, tasks, progress_percentage, days_remaining)
        
        # Generate alerts
        alerts = []
        
        if delay_risk['is_at_risk']:
            alerts.append({
                'type': 'delay_risk',
                'severity': delay_risk['severity'],
                'message': delay_risk['message']
            })
        
        if days_remaining < 3 and progress_percentage < 80:
            alerts.append({
                'type': 'urgent_deadline',
                'severity': 'high',
                'message': f'Only {days_remaining} days remaining with {progress_percentage:.1f}% complete'
            })
        
        # Check team overload
        overload_alerts = self._check_team_overload(tasks)
        alerts.extend(overload_alerts)
        
        return {
            'project_id': project.get('project_id'),
            'progress_percentage': round(progress_percentage, 1),
            'completed_tasks': completed_tasks,
            'in_progress_tasks': in_progress_tasks,
            'pending_tasks': total_tasks - completed_tasks - in_progress_tasks,
            'days_remaining': days_remaining,
            'delay_risk': delay_risk,
            'alerts': alerts,
            'checked_at': datetime.now().isoformat()
        }
    
    def _predict_delay(self, project: Dict, tasks: List[Dict], 
                      progress: float, days_remaining: int) -> Dict:
        """
        Predict if project will be delayed
        
        Args:
            project: Project data
            tasks: Task list
            progress: Current progress percentage
            days_remaining: Days until deadline
            
        Returns:
            Delay prediction dictionary
        """
        # Simple heuristic: if progress rate is too slow
        expected_progress = 100 - (days_remaining / project.get('estimated_effort_days', 30) * 100)
        
        progress_gap = expected_progress - progress
        
        if progress_gap > 20:
            return {
                'is_at_risk': True,
                'severity': 'high',
                'message': f'Project is {progress_gap:.1f}% behind schedule',
                'estimated_delay_days': int(progress_gap / 5)  # Rough estimate
            }
        elif progress_gap > 10:
            return {
                'is_at_risk': True,
                'severity': 'medium',
                'message': f'Project is slightly behind schedule ({progress_gap:.1f}%)',
                'estimated_delay_days': int(progress_gap / 10)
            }
        else:
            return {
                'is_at_risk': False,
                'severity': 'low',
                'message': 'Project is on track'
            }
    
    def _check_team_overload(self, tasks: List[Dict]) -> List[Dict]:
        """Check if any team members are overloaded"""
        alerts = []
        
        # Count tasks per team member
        workload = {}
        for task in tasks:
            assigned_to = task.get('assigned_to')
            if assigned_to:
                workload[assigned_to] = workload.get(assigned_to, 0) + 1
        
        # Check for overload (more than 3 active tasks)
        for member_id, task_count in workload.items():
            if task_count > 3:
                alerts.append({
                    'type': 'team_overload',
                    'severity': 'medium',
                    'message': f'Team member {member_id} has {task_count} active tasks'
                })
        
        return alerts


# Example usage
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    monitor = ProgressMonitor()
    
    # Sample project
    project = {
        'project_id': 'P101',
        'deadline': (datetime.now() + timedelta(days=5)).isoformat(),
        'estimated_effort_days': 20
    }
    
    # Sample tasks
    tasks = [
        {'task_id': 'T1', 'status': 'completed', 'assigned_to': 'D1'},
        {'task_id': 'T2', 'status': 'in_progress', 'assigned_to': 'D2'},
        {'task_id': 'T3', 'status': 'pending', 'assigned_to': 'D2'},
        {'task_id': 'T4', 'status': 'pending', 'assigned_to': 'D3'}
    ]
    
    report = monitor.check_project_progress(project, tasks)
    
    print("\n" + "="*80)
    print("PROGRESS MONITORING REPORT")
    print("="*80 + "\n")
    
    import json
    print(json.dumps(report, indent=2))
