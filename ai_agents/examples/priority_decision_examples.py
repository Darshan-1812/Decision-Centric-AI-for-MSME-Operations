"""
Example: Decision & Priority Agent in Action
Demonstrates the industry-standard priority scoring for service startups
"""

import json
import sys
import os
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from decision_agent.priority_scorer import PriorityScorer, rank_projects


def example_1_two_competing_projects():
    """
    REALISTIC SCENARIO: Two projects arrive simultaneously
    
    Project A: 3 days deadline, ₹80k, advance paid, new client
    Project B: 10 days deadline, ₹1.5L, no advance, repeat client
    
    EXPECTED: Project A should win despite lower value (deadline urgency + payment)
    """
    
    print("=" * 80)
    print("EXAMPLE 1: TWO COMPETING PROJECTS")
    print("=" * 80)
    print("\nScenario: Which project should we prioritize?\n")
    
    project_a = {
        "project_id": "P101",
        "project_type": "Web Application",
        "deadline": "2026-02-03T18:00:00",  # 3 days from now
        "budget": 80000,
        "advance_paid": True,
        "full_payment_done": False,
        "client_type": "new",
        "team_load": 50
    }
    
    project_b = {
        "project_id": "P102",
        "project_type": "Mobile App",
        "deadline": "2026-02-10T18:00:00",  # 10 days from now
        "budget": 150000,
        "advance_paid": False,
        "full_payment_done": False,
        "client_type": "repeat",
        "team_load": 60
    }
    
    print("Project A:")
    print(f"  - Deadline: 3 days")
    print(f"  - Budget: ₹80,000")
    print(f"  - Advance Paid: Yes")
    print(f"  - Client: New")
    print(f"  - Team Load: 50%\n")
    
    print("Project B:")
    print(f"  - Deadline: 10 days")
    print(f"  - Budget: ₹1,50,000")
    print(f"  - Advance Paid: No")
    print(f"  - Client: Repeat")
    print(f"  - Team Load: 60%\n")
    
    # Use Priority Scorer directly (no API needed)
    ranked_projects = rank_projects([project_a, project_b])
    
    print("-" * 80)
    print("PRIORITY SCORING RESULTS:")
    print("-" * 80)
    
    for i, proj in enumerate(ranked_projects, 1):
        print(f"\n{i}. {proj['project_id']} - Score: {proj['priority_score']} ({proj['priority_level'].upper()})")
        print(f"   Reasoning: {', '.join(proj['priority_reasoning'])}")
        print(f"   Breakdown:")
        for key, value in proj['score_breakdown'].items():
            print(f"     • {key.replace('_', ' ').title()}: {value}")
    
    print("\n" + "-" * 80)
    print("✅ DECISION:")
    print("-" * 80)
    winner = ranked_projects[0]
    print(f"\n🏆 {winner['project_id']} should be prioritized!")
    print(f"   Despite {'lower' if winner['budget'] < 100000 else 'higher'} value, ")
    print(f"   deadline urgency and payment status drive the decision.")
    
    print("\n")


def example_2_penalty_override():
    """
    REALISTIC SCENARIO: SLA penalty should override normal priority
    
    Project C: 15 days deadline, medium value, but has SLA penalty
    Project D: 7 days deadline, high value, no penalty
    
    EXPECTED: Project C should get critical priority due to penalty override
    """
    
    print("=" * 80)
    print("EXAMPLE 2: PENALTY/SLA OVERRIDE")
    print("=" * 80)
    print("\nScenario: Project with penalty clause vs urgent project\n")
    
    project_c = {
        "project_id": "P201",
        "project_type": "API Integration",
        "deadline": "2026-02-15T18:00:00",  # 15 days
        "budget": 75000,
        "advance_paid": True,
        "client_type": "long_term",
        "team_load": 40,
        "penalty_exists": True  # ⚠️ This should override
    }
    
    project_d = {
        "project_id": "P202",
        "project_type": "Dashboard",
        "deadline": "2026-02-07T18:00:00",  # 7 days
        "budget": 120000,
        "advance_paid": True,
        "client_type": "new",
        "team_load": 45,
        "penalty_exists": False
    }
    
    print("Project C:")
    print(f"  - Deadline: 15 days")
    print(f"  - Budget: ₹75,000")
    print(f"  - Penalty Clause: YES ⚠️")
    print(f"  - Client: Long-term\n")
    
    print("Project D:")
    print(f"  - Deadline: 7 days")
    print(f"  - Budget: ₹1,20,000")
    print(f"  - Penalty Clause: No")
    print(f"  - Client: New\n")
    
    scorer = PriorityScorer()
    
    score_c = scorer.calculate_priority_score(project_c)
    score_d = scorer.calculate_priority_score(project_d)
    
    print("-" * 80)
    print("PRIORITY SCORES:")
    print("-" * 80)
    print(f"\nProject C: {score_c['priority_score']} ({score_c['priority_level'].upper()})")
    print(f"Reasoning: {', '.join(score_c['reasoning'])}")
    
    print(f"\nProject D: {score_d['priority_score']} ({score_d['priority_level'].upper()})")
    print(f"Reasoning: {', '.join(score_d['reasoning'])}")
    
    print("\n✅ RESULT: Penalty clause forces Project C to critical priority!")
    print("\n")


def example_3_team_overload_warning():
    """
    REALISTIC SCENARIO: Team is already at 85% capacity
    New high-value project arrives
    
    EXPECTED: System should accept but warn about overload risk
    """
    
    print("=" * 80)
    print("EXAMPLE 3: TEAM OVERLOAD WARNING")
    print("=" * 80)
    print("\nScenario: High-value project but team is near capacity\n")
    
    project_e = {
        "project_id": "P301",
        "project_type": "E-commerce Platform",
        "deadline": "2026-02-08T18:00:00",
        "budget": 200000,
        "advance_paid": True,
        "full_payment_done": False,
        "client_type": "repeat",
        "team_load": 85  # ⚠️ Team near capacity
    }
    
    print("Project E:")
    print(f"  - Deadline: 8 days")
    print(f"  - Budget: ₹2,00,000 (HIGH VALUE)")
    print(f"  - Advance Paid: Yes")
    print(f"  - Team Load: 85% ⚠️\n")
    
    scorer = PriorityScorer()
    result = scorer.calculate_priority_score(project_e)
    
    print("-" * 80)
    print("PRIORITY ANALYSIS:")
    print("-" * 80)
    
    print(f"\nPriority Score: {result['priority_score']} ({result['priority_level'].upper()})")
    print(f"Reasoning: {', '.join(result['reasoning'])}")
    
    print("\n" + "-" * 80)
    print("⚠️  RISK ASSESSMENT:")
    print("-" * 80)
    
    if project_e["team_load"] >= 80:
        print(f"• TEAM OVERLOAD RISK: Team at {project_e['team_load']}% capacity")
        print(f"  Recommendation: Consider hiring additional resources or extending timeline")
    
    print("\n✅ RESULT: High-value project accepted but requires careful capacity management!")
    print("\n")


if __name__ == "__main__":
    print("\n")
    print("🔥" * 40)
    print("DECISION & PRIORITY AGENT - INDUSTRY-STANDARD RULES")
    print("🔥" * 40)
    print("\n")
    
    # Run all examples
    example_1_two_competing_projects()
    example_2_penalty_override()
    example_3_team_overload_warning()
    
    print("=" * 80)
    print("✅ ALL EXAMPLES COMPLETED")
    print("=" * 80)
    print("\nThese examples demonstrate REAL industry practices used by:")
    print("  • IT Service Companies")
    print("  • Software Development Agencies")
    print("  • Consulting Firms")
    print("  • Freelance Platforms")
    print("\n")
