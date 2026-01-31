"""
Priority Scoring System - Industry-Standard Decision Rules
Based on real service startup practices (IT services, agencies, consulting firms)
"""

from datetime import datetime
from typing import Dict, List
from enum import Enum


class PriorityLevel(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    NORMAL = "normal"
    LOW = "low"


class PriorityScorer:
    """
    Implements industry-standard priority scoring for service startups.
    
    Scoring Formula:
    Priority Score = 
        (Deadline Urgency × 0.40) +
        (Payment Status × 0.25) +
        (Project Value × 0.15) +
        (Client Importance × 0.10) -
        (Team Load × 0.10)
    """
    
    # Weights (must sum to 1.0 for positive factors)
    WEIGHTS = {
        "deadline_urgency": 0.40,
        "payment_status": 0.25,
        "project_value": 0.15,
        "client_importance": 0.10,
        "team_load_penalty": 0.10
    }
    
    # Thresholds
    HIGH_VALUE_THRESHOLD = 100000  # ₹1L
    MEDIUM_VALUE_THRESHOLD = 50000  # ₹50k
    
    def __init__(self):
        pass
    
    def calculate_priority_score(self, project: Dict) -> Dict:
        """
        Calculate comprehensive priority score for a project.
        
        Args:
            project: Project dictionary with keys:
                - deadline: ISO datetime string
                - budget: float (project value)
                - advance_paid: bool
                - full_payment_done: bool
                - client_type: str (new/repeat/long_term)
                - team_load: float (0-100, percentage)
                - penalty_exists: bool (optional)
                
        Returns:
            Dictionary with score, level, and reasoning
        """
        
        # Calculate individual scores
        deadline_score = self._score_deadline_urgency(project.get("deadline"))
        payment_score = self._score_payment_status(
            project.get("advance_paid", False),
            project.get("full_payment_done", False)
        )
        value_score = self._score_project_value(project.get("budget", 0))
        client_score = self._score_client_importance(project.get("client_type", "new"))
        team_penalty = self._score_team_load(project.get("team_load", 0))
        
        # Apply weights
        weighted_score = (
            deadline_score * self.WEIGHTS["deadline_urgency"] +
            payment_score * self.WEIGHTS["payment_status"] +
            value_score * self.WEIGHTS["project_value"] +
            client_score * self.WEIGHTS["client_importance"] -
            team_penalty * self.WEIGHTS["team_load_penalty"]
        )
        
        # Override for penalty/SLA situations
        if project.get("penalty_exists", False):
            weighted_score = max(weighted_score, 90)  # Force high priority
        
        # Determine priority level
        priority_level = self._get_priority_level(weighted_score)
        
        # Generate reasoning
        reasoning = self._generate_reasoning(
            deadline_score, payment_score, value_score, 
            client_score, team_penalty, project
        )
        
        return {
            "priority_score": round(weighted_score, 2),
            "priority_level": priority_level,
            "reasoning": reasoning,
            "breakdown": {
                "deadline_urgency": deadline_score,
                "payment_status": payment_score,
                "project_value": value_score,
                "client_importance": client_score,
                "team_load_penalty": team_penalty
            }
        }
    
    def _score_deadline_urgency(self, deadline_str: str) -> float:
        """
        RULE CATEGORY 1: DEADLINE URGENCY (40% weight)
        
        Industry practice: Late delivery = penalty, reputation loss, churn
        
        Returns: 0-100 score
        """
        if not deadline_str:
            return 50  # Default medium urgency
        
        try:
            deadline = datetime.fromisoformat(deadline_str.replace('Z', '+00:00'))
            days_remaining = (deadline - datetime.now()).total_seconds() / 86400
            
            if days_remaining <= 3:
                return 100  # CRITICAL
            elif days_remaining <= 7:
                return 80   # HIGH
            elif days_remaining <= 14:
                return 60   # MEDIUM
            elif days_remaining <= 30:
                return 40   # NORMAL
            else:
                return 20   # LOW
                
        except Exception:
            return 50
    
    def _score_payment_status(self, advance_paid: bool, full_payment: bool) -> float:
        """
        RULE CATEGORY 2: PAYMENT STATUS (25% weight)
        
        Industry practice: Paid clients always get priority
        
        Returns: 0-100 score
        """
        if full_payment:
            return 100  # Maximum priority
        elif advance_paid:
            return 70   # High priority
        else:
            return 30   # Lower priority (but not zero - still a client)
    
    def _score_project_value(self, budget: float) -> float:
        """
        RULE CATEGORY 3: PROJECT VALUE / REVENUE IMPACT (15% weight)
        
        Industry practice: High-value projects justify resource focus
        
        Returns: 0-100 score
        """
        # Handle None or invalid budget values
        if budget is None:
            budget = 0
        
        if budget >= self.HIGH_VALUE_THRESHOLD:
            return 100
        elif budget >= self.MEDIUM_VALUE_THRESHOLD:
            return 60
        else:
            # Linear scale for smaller projects
            return min(40, (budget / self.MEDIUM_VALUE_THRESHOLD) * 60)
    
    def _score_client_importance(self, client_type: str) -> float:
        """
        RULE CATEGORY 6: CLIENT IMPORTANCE (10% weight)
        
        Industry practice: Repeat/long-term clients get slight boost
        
        Returns: 0-100 score
        """
        client_scores = {
            "long_term": 100,
            "repeat": 80,
            "new": 50,
            "trial": 30
        }
        return client_scores.get(client_type.lower(), 50)
    
    def _score_team_load(self, team_load_percentage: float) -> float:
        """
        RULE CATEGORY 4: TEAM AVAILABILITY & LOAD (10% penalty)
        
        Industry practice: Overloading teams leads to failure
        
        Returns: 0-100 penalty score (higher = worse)
        """
        if team_load_percentage >= 90:
            return 100  # Team overloaded - major penalty
        elif team_load_percentage >= 80:
            return 70   # Team near capacity
        elif team_load_percentage >= 60:
            return 40   # Team moderately loaded
        else:
            return 10   # Team available
    
    def _get_priority_level(self, score: float) -> str:
        """Convert numeric score to priority level"""
        if score >= 80:
            return PriorityLevel.CRITICAL
        elif score >= 60:
            return PriorityLevel.HIGH
        elif score >= 40:
            return PriorityLevel.NORMAL
        else:
            return PriorityLevel.LOW
    
    def _generate_reasoning(
        self, 
        deadline_score: float, 
        payment_score: float, 
        value_score: float,
        client_score: float,
        team_penalty: float,
        project: Dict
    ) -> List[str]:
        """Generate human-readable reasoning for the priority decision"""
        reasons = []
        
        # Deadline reasoning
        if deadline_score >= 80:
            reasons.append("Urgent deadline (<=7 days)")
        elif deadline_score >= 60:
            reasons.append("Moderate deadline (<=14 days)")
        
        # Payment reasoning
        if project.get("full_payment_done"):
            reasons.append("Full payment received")
        elif project.get("advance_paid"):
            reasons.append("Advance payment received")
        else:
            reasons.append("Payment pending")
        
        # Value reasoning
        if value_score >= 80:
            reasons.append("High-value project")
        
        # Client reasoning
        if project.get("client_type") in ["repeat", "long_term"]:
            reasons.append(f"{project.get('client_type').replace('_', ' ').title()} client")
        
        # Team load reasoning
        if team_penalty >= 70:
            reasons.append("[!] Team near/at capacity")
        elif team_penalty <= 20:
            reasons.append("Team available")
        
        # Penalty override
        if project.get("penalty_exists"):
            reasons.append("[!!] SLA/Penalty risk - OVERRIDE PRIORITY")
        
        return reasons


def rank_projects(projects: List[Dict]) -> List[Dict]:
    """
    Rank multiple projects by priority score.
    
    Args:
        projects: List of project dictionaries
        
    Returns:
        List of projects sorted by priority (highest first) with scores
    """
    scorer = PriorityScorer()
    
    # Calculate scores for all projects
    scored_projects = []
    for project in projects:
        score_result = scorer.calculate_priority_score(project)
        project_with_score = {
            **project,
            "priority_score": score_result["priority_score"],
            "priority_level": score_result["priority_level"],
            "priority_reasoning": score_result["reasoning"],
            "score_breakdown": score_result["breakdown"]
        }
        scored_projects.append(project_with_score)
    
    # Sort by score (descending)
    ranked = sorted(scored_projects, key=lambda x: x["priority_score"], reverse=True)
    
    return ranked


# Example usage and testing
if __name__ == "__main__":
    import json
    
    # Test Case: Two competing projects (from your example)
    project_a = {
        "project_id": "P101",
        "project_type": "Web Application",
        "deadline": "2026-02-03T18:00:00",  # 3 days
        "budget": 80000,
        "advance_paid": True,
        "full_payment_done": False,
        "client_type": "new",
        "team_load": 50
    }
    
    project_b = {
        "project_id": "P102",
        "project_type": "Mobile App",
        "deadline": "2026-02-10T18:00:00",  # 10 days
        "budget": 150000,
        "advance_paid": False,
        "full_payment_done": False,
        "client_type": "repeat",
        "team_load": 60
    }
    
    scorer = PriorityScorer()
    
    print("=" * 60)
    print("PROJECT A - Priority Analysis")
    print("=" * 60)
    result_a = scorer.calculate_priority_score(project_a)
    print(json.dumps(result_a, indent=2))
    
    print("\n" + "=" * 60)
    print("PROJECT B - Priority Analysis")
    print("=" * 60)
    result_b = scorer.calculate_priority_score(project_b)
    print(json.dumps(result_b, indent=2))
    
    print("\n" + "=" * 60)
    print("RANKED PROJECTS")
    print("=" * 60)
    ranked = rank_projects([project_a, project_b])
    for i, proj in enumerate(ranked, 1):
        print(f"\n{i}. {proj['project_id']} - Score: {proj['priority_score']} ({proj['priority_level']})")
        print(f"   Reasoning: {', '.join(proj['priority_reasoning'])}")
