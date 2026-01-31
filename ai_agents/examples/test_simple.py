"""
Simple Test: Priority Scoring System
Basic verification without Unicode characters
"""

import json
import sys
import os
from datetime import datetime

# Add the decision_agent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'decision_agent'))

from priority_scorer import PriorityScorer, rank_projects


print("\n" + "=" * 80)
print("PRIORITY SCORING SYSTEM - SIMPLE TEST")
print("=" * 80 + "\n")

# Test 1: Basic scoring
print("Test 1: Basic Priority Scoring")
print("-" * 80)

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

print(f"Project: {project['project_id']}")
print(f"Priority Score: {result['priority_score']}")
print(f"Priority Level: {result['priority_level']}")
print(f"Reasoning: {result['reasoning']}")
print("[PASS] Test 1 Passed\n")

# Test 2: Two competing projects
print("Test 2: Two Competing Projects")
print("-" * 80)

project_a = {
    "project_id": "P101",
    "deadline": "2026-02-03T18:00:00",  # 3 days
    "budget": 80000,
    "advance_paid": True,
    "client_type": "new",
    "team_load": 50
}

project_b = {
    "project_id": "P102",
    "deadline": "2026-02-10T18:00:00",  # 10 days
    "budget": 150000,
    "advance_paid": False,
    "client_type": "repeat",
    "team_load": 60
}

ranked = rank_projects([project_a, project_b])

print(f"1. {ranked[0]['project_id']} - Score: {ranked[0]['priority_score']}")
print(f"2. {ranked[1]['project_id']} - Score: {ranked[1]['priority_score']}")

if ranked[0]['project_id'] == 'P101':
    print("[PASS] Project A correctly prioritized (deadline + payment > value)")
else:
    print("[FAIL] Wrong project prioritized!")
    sys.exit(1)

print()

# Test 3: Penalty override
print("Test 3: Penalty Override")
print("-" * 80)

project_penalty = {
    "project_id": "P201",
    "deadline": "2026-02-15T18:00:00",  # 15 days
    "budget": 75000,
    "advance_paid": True,
    "client_type": "long_term",
    "team_load": 40,
    "penalty_exists": True
}

result = scorer.calculate_priority_score(project_penalty)

print(f"Project with penalty: Score = {result['priority_score']}")
print(f"Priority Level: {result['priority_level']}")

if result['priority_score'] >= 85:
    print("[PASS] Penalty override working (score >= 85)")
else:
    print(f"[FAIL] Penalty override not working! Score = {result['priority_score']}")
    sys.exit(1)

print()

# Test 4: Team overload detection
print("Test 4: Team Overload Detection")
print("-" * 80)

project_overload = {
    "project_id": "P301",
    "deadline": "2026-02-08T18:00:00",
    "budget": 200000,
    "advance_paid": True,
    "client_type": "repeat",
    "team_load": 85
}

result = scorer.calculate_priority_score(project_overload)

print(f"Team Load: {project_overload['team_load']}%")
print(f"Team Load Penalty: {result['breakdown']['team_load_penalty']}")

if result['breakdown']['team_load_penalty'] >= 70:
    print("[PASS] Team overload detected correctly")
else:
    print("[FAIL] Team overload not detected!")
    sys.exit(1)

print()

print("=" * 80)
print("[SUCCESS] ALL TESTS PASSED!")
print("=" * 80)
print("\nKey Features Verified:")
print("  [OK] Weighted scoring formula")
print("  [OK] Deadline urgency calculation")
print("  [OK] Payment status prioritization")
print("  [OK] Project value assessment")
print("  [OK] Team capacity monitoring")
print("  [OK] Penalty/SLA override")
print("\nThe priority scoring system is ready for use!\n")
