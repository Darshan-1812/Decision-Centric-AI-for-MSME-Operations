"""
Debug Autonomous System Failure
"""
import sys
import os
import codecs
from dotenv import load_dotenv

# Fix output encoding
if sys.platform == 'win32':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

load_dotenv()
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

print("="*60)
print("TESTING AUTONOMOUS SYSTEM PIPELINE")
print("="*60)

try:
    from ai_agents.autonomous_system import AutonomousSystem
    
    print("1. Initializing System...")
    system = AutonomousSystem()
    print("✅ System initialized")
    
    print("\n2. Processing emails...")
    # This will trigger the full pipeline
    system.process_new_emails()
    
    print("\n✅ Processing complete")
    print(f"Active projects: {len(system.active_projects)}")
    
except Exception as e:
    print("\n❌ ERROR DETECTED:")
    import traceback
    traceback.print_exc()
