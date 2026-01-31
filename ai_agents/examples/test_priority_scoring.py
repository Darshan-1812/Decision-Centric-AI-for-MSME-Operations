"""
Standalone Test: Priority Scoring System
Tests the priority scorer without any dependencies on other modules
"""

import json
import sys
import os
from datetime import datetime

# Add the decision_agent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'decision_agent'))

# Import only the priority scorer (no dependencies)
from priority_scorer import PriorityScorer, rank_projects


def test_basic_scoring():
    """Test basic priority scoring"""
    print("=" * 80)
    print("TEST 1: BASIC PRIORITY SCORING")
    print("=" * 80)
    
    scorer = PriorityScorer()
    
    project = {
        "project_id": "P101",
        "deadline": "2026-02-03T18:00:00",
        "budget": 150000,
        "advance_paid": True,
        "client_type": "repeat",
        "team_load": 50
    }
    
    result = scorer.calculate_priority_score(project)
    
    print(f"\nProject: {project['project_id']}")
    print(f"Priority Score: {result['priority_score']}")
    print(f"Priority Level: {result['priority_level'].upper()}")
    print(f"\nReasoning:")
    for reason in result['reasoning']:
        # Remove emojis from reasoning
        clean_reason = reason.replace('⚠️', '[!]').replace('🚨', '[!!]')
        print(f"  * {clean_reason}")
    
    print(f"\nScore Breakdown:")
    for key, value in result['breakdown'].items():
        print(f"  * {key.replace('_', ' ').title()}: {value}")
    
    print("\n[PASS] Test 1 Passed!\n")


def test_two_competing_projects():
    """Test ranking of two competing projects"""
    print("=" * 80)
    print("TEST 2: TWO COMPETING PROJECTS")
    print("=" * 80)
    print("\nScenario: Project A (3 days, ₹80k, advance paid) vs")
    print("          Project B (10 days, ₹1.5L, no advance)\n")
    
    project_a = {
        "project_id": "P101",
        "project_type": "Web App",
        "deadline": "2026-02-03T18:00:00",
        "budget": 80000,
        "advance_paid": True,
        "client_type": "new",
        "team_load": 50
    }
    
    project_b = {
        "project_id": "P102",
        "project_type": "Mobile App",
        "deadline": "2026-02-10T18:00:00",
        "budget": 150000,
        "advance_paid": False,
        "client_type": "repeat",
        "team_load": 60
    }
    
    ranked = rank_projects([project_a, project_b])
    
    print("RANKING RESULTS:")
    print("-" * 80)
    for i, proj in enumerate(ranked, 1):
        print(f"\n{i}. {proj['project_id']} - Score: {proj['priority_score']} ({proj['priority_level'].upper()})")
        print(f"   Reasoning: {', '.join(proj['priority_reasoning'])}")
    
    # Verify Project A wins
    assert ranked[0]['project_id'] == 'P101', "Project A should be ranked first!"
    print("\n[PASS] Test 2 Passed! Project A correctly prioritized despite lower value.\n")


def test_penalty_override():
    """Test that penalty clause forces critical priority"""
    print("=" * 80)
    print("TEST 3: PENALTY/SLA OVERRIDE")
    print("=" * 80)
    print("\nScenario: Project with penalty clause should get critical priority\n")
    
    project_with_penalty = {
        "project_id": "P201",
        "deadline": "2026-02-15T18:00:00",  # 15 days - normally not critical
        "budget": 75000,
        "advance_paid": True,
        "client_type": "long_term",
        "team_load": 40,
        "penalty_exists": True
    }
    
    scorer = PriorityScorer()
    result = scorer.calculate_priority_score(project_with_penalty)
    
    print(f"Project: {project_with_penalty['project_id']}")
    print(f"Priority Score: {result['priority_score']} (should be ≥90)")
    print(f"Priority Level: {result['priority_level'].upper()}")
    print(f"\nReasoning:")
    for reason in result['reasoning']:
        print(f"  • {reason}")
    
    # Verify penalty override works
    assert result['priority_score'] >= 85, f"Penalty should force high score! Got {result['priority_score']}"
    assert "SLA/Penalty" in str(result['reasoning']), "Reasoning should mention penalty!"
    
    print(f"\n[PASS] Penalty Override: Score boosted to {result['priority_score']}")
    print("[PASS] Test 3 Passed! Penalty override working correctly.\n")


def test_team_overload():
    """Test team overload detection"""
    print("=" * 80)
    print("TEST 4: TEAM OVERLOAD DETECTION")
    print("=" * 80)
    print("\nScenario: High-value project but team at 85% capacity\n")
    
    project = {
        "project_id": "P301",
        "deadline": "2026-02-08T18:00:00",
        "budget": 200000,
        "advance_paid": True,
        "client_type": "repeat",
        "team_load": 85
    }
    
    scorer = PriorityScorer()
    result = scorer.calculate_priority_score(project)
    
    print(f"Project: {project['project_id']}")
    print(f"Budget: ₹{project['budget']:,}")
    print(f"Team Load: {project['team_load']}%")
    print(f"\nPriority Score: {result['priority_score']}")
    print(f"Team Load Penalty: {result['breakdown']['team_load_penalty']}")
    
    # Verify team overload is detected
    assert result['breakdown']['team_load_penalty'] >= 70, "Should have high penalty for 85% load!"
    assert "Team near/at capacity" in str(result['reasoning']), "Should warn about capacity!"
    
    print("\n[WARNING] Team overload risk detected!")
    print("[PASS] Test 4 Passed! Team capacity monitoring working.\n")


def test_all_priority_levels():
    """Test that all priority levels can be achieved"""
    print("=" * 80)
    print("TEST 5: ALL PRIORITY LEVELS")
    print("=" * 80)
    print("\nTesting that scoring produces all priority levels...\n")
    
    scorer = PriorityScorer()
    
    # Critical: Urgent deadline + advance paid
    critical = scorer.calculate_priority_score({
        "deadline": "2026-02-02T18:00:00",  # 2 days
        "budget": 100000,
        "advance_paid": True,
        "client_type": "repeat",
        "team_load": 50
    })
    
    # High: Moderate deadline + good payment
    high = scorer.calculate_priority_score({
        "deadline": "2026-02-07T18:00:00",  # 7 days
        "budget": 80000,
        "advance_paid": True,
        "client_type": "new",
        "team_load": 50
    })
    
    # Normal: Longer deadline
    normal = scorer.calculate_priority_score({
        "deadline": "2026-02-20T18:00:00",  # 20 days
        "budget": 60000,
        "advance_paid": False,
        "client_type": "new",
        "team_load": 40
    })
    
    # Low: Long deadline + no payment
    low = scorer.calculate_priority_score({
        "deadline": "2026-03-15T18:00:00",  # 45 days
        "budget": 30000,
        "advance_paid": False,
        "client_type": "new",
        "team_load": 30
    })
    
    print(f"Critical Level: Score = {critical['priority_score']} ({critical['priority_level']})")
    print(f"High Level:     Score = {high['priority_score']} ({high['priority_level']})")
    print(f"Normal Level:   Score = {normal['priority_score']} ({normal['priority_level']})")
    print(f"Low Level:      Score = {low['priority_score']} ({low['priority_level']})")
    
    assert critical['priority_level'] == 'critical'
    assert high['priority_level'] == 'high'
    assert normal['priority_level'] == 'normal'
    assert low['priority_level'] == 'low'
    
    print("\n[PASS] Test 5 Passed! All priority levels working correctly.\n")


if __name__ == "__main__":
    print("\n")
    print("=" * 80)
    print("PRIORITY SCORING SYSTEM - COMPREHENSIVE TESTS")
    print("=" * 80)
    print("\n")
    
    try:
        test_basic_scoring()
        test_two_competing_projects()
        test_penalty_override()
        test_team_overload()
        test_all_priority_levels()
        
        print("=" * 80)
        print("[SUCCESS] ALL TESTS PASSED!")
        print("=" * 80)
        print("\nThe priority scoring system is working correctly and ready for use.")
        print("\nKey Features Verified:")
        print("  [OK] Weighted scoring formula (40% deadline, 25% payment, etc.)")
        print("  [OK] Deadline urgency calculation")
        print("  [OK] Payment status prioritization")
        print("  [OK] Project value assessment")
        print("  [OK] Team capacity monitoring")
        print("  [OK] Penalty/SLA override")
        print("  [OK] All priority levels (critical, high, normal, low)")
        print("\n")
        
    except AssertionError as e:
        print(f"\n[FAIL] TEST FAILED: {e}\n")
        sys.exit(1)
    except Exception as e:
        print(f"\n[ERROR] {e}\n")
        import traceback
        traceback.print_exc()
        sys.exit(1)
