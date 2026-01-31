"""
Simple Test: Decision Agent with Gemini API
Direct test without relative imports
"""

import json
import sys
import os
from datetime import datetime

# Set environment variable
os.environ['GEMINI_API_KEY'] = 'AIzaSyCBYmzR1R1CwZauoHa7onLoSxPsEt-B88A'

# Import Gemini
import google.generativeai as genai

print("\n" + "=" * 80)
print("TESTING DECISION AGENT WITH GOOGLE GEMINI")
print("=" * 80 + "\n")

# Test 1: Simple Gemini API call
print("Test 1: Basic Gemini API Connection")
print("-" * 80)

try:
    genai.configure(api_key=os.environ['GEMINI_API_KEY'])
    model = genai.GenerativeModel(
        model_name="models/gemini-2.5-flash-lite-preview-09-2025",
        generation_config={
            "temperature": 0.3,
        }
    )
    
    # Simple test prompt
    test_prompt = """You are a decision-making AI. Given the following task, provide a JSON response with decisions.

Task: Assign task T101 (order fulfillment, deadline in 6 hours) to staff S1 who has packing skills and is available.

Respond with JSON in this format:
{
  "decisions": [
    {
      "action": "assign_task",
      "task_id": "T101",
      "staff_id": "S1",
      "reasoning": "explain why"
    }
  ],
  "alerts": []
}

Respond with valid JSON only."""
    
    print("\nSending test prompt to Gemini...")
    response = model.generate_content(test_prompt)
    
    print("\n[SUCCESS] Gemini Response Received!")
    print("\nRaw Response:")
    print(response.text)
    
    # Parse JSON - handle markdown code blocks
    response_text = response.text.strip()
    
    # Remove markdown code blocks if present
    if response_text.startswith("```json"):
        response_text = response_text[7:]  # Remove ```json
    if response_text.startswith("```"):
        response_text = response_text[3:]  # Remove ```
    if response_text.endswith("```"):
        response_text = response_text[:-3]  # Remove trailing ```
    
    response_text = response_text.strip()
    
    decision = json.loads(response_text)
    print("\n[SUCCESS] JSON Parsed Successfully!")
    print("\nParsed Decision:")
    print(json.dumps(decision, indent=2))
    
    if "decisions" in decision:
        print(f"\n[OK] Found {len(decision['decisions'])} decision(s)")
        for d in decision['decisions']:
            print(f"  - Action: {d.get('action')}")
            print(f"    Task: {d.get('task_id')}")
            print(f"    Staff: {d.get('staff_id')}")
            print(f"    Reasoning: {d.get('reasoning')}")
    
    print("\n" + "=" * 80)
    print("[SUCCESS] GEMINI API TEST PASSED!")
    print("=" * 80)
    print("\nGemini API is working correctly!")
    print("Model: gemini-1.5-flash")
    print("Temperature: 0.3")
    print("Response Format: JSON")
    print("\n")
    
except Exception as e:
    print(f"\n[ERROR] Test failed: {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
