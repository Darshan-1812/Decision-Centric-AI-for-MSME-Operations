"""
FastAPI Backend Entry Point
Main application server
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import uvicorn
import sys
import os
from dotenv import load_dotenv

# Load environment variables from .env file (look in parent directory)
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
load_dotenv(env_path)

# Add ai_agents to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = FastAPI(
    title="Decision-Centric AI for MSME",
    description="Autonomous AI system for MSME operations management",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React app
        "http://localhost:3001",  # Next.js app  
        "http://localhost:3002",  # Alternative port
        "http://localhost:5173"   # Vite
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include autonomous system routes
try:
    from backend.api.autonomous_routes import router as autonomous_router
    app.include_router(autonomous_router)
except Exception as e:
    print(f"Warning: Could not load autonomous routes: {e}")


# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "Decision-Centric AI for MSME - API Server",
        "status": "running",
        "version": "1.0.0",
        "features": [
            "Autonomous Email-to-Project System",
            "Priority Scoring Engine",
            "Team Assignment",
            "Progress Monitoring"
        ]
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# API route placeholders
@app.get("/api/dashboard/owner")
async def get_owner_dashboard():
    """Owner dashboard data"""
    return {
        "new_requests": 5,
        "tasks_in_progress": 12,
        "inventory_alerts": 2,
        "delayed_items": 1,
        "ai_decisions": []
    }


@app.get("/api/dashboard/staff/{staff_id}")
async def get_staff_tasks(staff_id: str):
    """Staff task list"""
    return {
        "staff_id": staff_id,
        "tasks": []
    }


@app.get("/api/tasks")
async def get_all_tasks():
    """Get all tasks"""
    return {"tasks": []}


@app.post("/api/tasks")
async def create_task(task: Dict):
    """Create new task"""
    return {"message": "Task created", "task_id": "T123"}


@app.get("/api/decisions")
async def get_ai_decisions():
    """Get AI decision history"""
    return {"decisions": []}


if __name__ == "__main__":
    print("\n" + "="*80)
    print("🚀 Starting Decision-Centric AI Backend")
    print("="*80)
    print("\n📍 Server will be available at:")
    print("   - API: http://localhost:8000")
    print("   - Docs: http://localhost:8000/docs")
    print("   - Autonomous System: http://localhost:8000/api/autonomous")
    print("\n" + "="*80 + "\n")
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

