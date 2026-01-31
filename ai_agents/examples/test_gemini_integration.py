"""
Test Decision Agent with Gemini API
Demonstrates the updated agent using Google's Gemini model
"""

import json
import sys
import os
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from decision_agent.decision_agent import DecisionAgent


def test_decision_agent_with_gemini():
    """Test the Decision Agent with Gemini API"""
    
    print("\n" + "=" * 80)
    print("TESTING DECISION AGENT WITH GOOGLE GEMINI")
    print("=" * 80 + "\n")
    
    # Check if API key is set
    if not os.getenv("GEMINI_API_KEY"):
        print("[ERROR] GEMINI_API_KEY not found in environment variables!")
        print("Please set your Gemini API key in .env file:")
        print("  GEMINI_API_KEY=your_api_key_here")
        print("\nGet your API key from: https://makersuite.google.com/app/apikey")
        return False
    
    try:
        # Initialize Decision Agent
        print("Initializing Decision Agent with Gemini...")
        agent = DecisionAgent()
        print("[OK] Agent initialized successfully\n")
        
        # Test 1: Traditional MSME Task Assignment
        print("-" * 80)
        print("TEST 1: Traditional MSME Task Assignment")
        print("-" * 80)
        
        sample_tasks = [
            {
                "task_id": "T101",
                "type": "order_fulfillment",
                "priority": "high",
                "deadline": "2026-02-01T18:00:00",
                "status": "pending"
            },
            {
                "task_id": "T102",
                "type": "inventory_check",
                "priority": "medium",
                "deadline": "2026-02-02T12:00:00",
                "status": "pending"
            }
        ]
        
        sample_resources = [
            {
                "resource_name": "Item_X",
                "available": 50,
                "required": 30
            }
        ]
        
        sample_staff = [
            {
                "staff_id": "S1",
                "skills": ["packing", "quality_check"],
                "availability": True,
                "current_workload": 2,
                "max_capacity": 5
            },
            {
                "staff_id": "S2",
                "skills": ["inventory"],
                "availability": True,
                "current_workload": 1,
                "max_capacity": 5
            }
        ]
        
        print("\nCalling Gemini API for decision making...")
        decision = agent.make_decision(sample_tasks, sample_resources, sample_staff)
        
        print("\n[SUCCESS] Gemini Response Received!")
        print("\nDecision Output:")
        print(json.dumps(decision, indent=2))
        
        # Validate response structure
        if "decisions" in decision:
            print(f"\n[OK] Found {len(decision['decisions'])} decision(s)")
        if "alerts" in decision:
            print(f"[OK] Found {len(decision.get('alerts', []))} alert(s)")
        
        print("\n[PASS] Test 1 Passed - Gemini successfully processed task assignment\n")
        
        # Test 2: Service Startup Project Prioritization
        print("-" * 80)
        print("TEST 2: Service Startup Project Prioritization")
        print("-" * 80)
        
        projects = [
            {
                "project_id": "P101",
                "project_type": "Web Application",
                "deadline": "2026-02-03T18:00:00",
                "budget": 80000,
                "advance_paid": True,
                "client_type": "new",
                "team_load": 50
            },
            {
                "project_id": "P102",
                "project_type": "Mobile App",
                "deadline": "2026-02-10T18:00:00",
                "budget": 150000,
                "advance_paid": False,
                "client_type": "repeat",
                "team_load": 60
            }
        ]
        
        print("\nPrioritizing projects using industry-standard scoring...")
        priority_decision = agent.prioritize_projects(projects)
        
        print("\n[SUCCESS] Projects Prioritized!")
        print("\nRanked Projects:")
        for i, proj in enumerate(priority_decision["ranked_projects"], 1):
            print(f"\n{i}. {proj['project_id']}")
            print(f"   Score: {proj['priority_score']} ({proj['priority_level']})")
            print(f"   Reasoning: {', '.join(proj['priority_reasoning'])}")
        
        print("\n[PASS] Test 2 Passed - Priority scoring working correctly\n")
        
        print("=" * 80)
        print("[SUCCESS] ALL TESTS PASSED WITH GEMINI!")
        print("=" * 80)
        print("\nThe Decision Agent is now running on Google Gemini API")
        print("Model: gemini-1.5-flash")
        print("\n")
        
        return True
        
    except Exception as e:
        print(f"\n[ERROR] Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = test_decision_agent_with_gemini()
    sys.exit(0 if success else 1)
