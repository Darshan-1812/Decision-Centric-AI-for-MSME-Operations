# Quick Start Guide

## 🚀 Setup Instructions

### 1. Create Virtual Environments

Virtual environments are already created! To activate them:

**For Backend:**
```powershell
# Windows PowerShell
backend\venv\Scripts\Activate.ps1

# Command Prompt
backend\venv\Scripts\activate.bat
```

**For AI Agents:**
```powershell
# Windows PowerShell
ai_agents\venv\Scripts\Activate.ps1

# Command Prompt
ai_agents\venv\Scripts\activate.bat
```

### 2. Install Dependencies

**Backend:**
```powershell
# Activate backend venv first
backend\venv\Scripts\Activate.ps1

# Install packages
cd backend
pip install -r requirements.txt
```

**AI Agents:**
```powershell
# Activate ai_agents venv first
ai_agents\venv\Scripts\Activate.ps1

# Install packages
cd ai_agents
pip install -r requirements.txt
```

**Frontend:**
```powershell
cd frontend
npm install
```

### 3. Configure Environment

```powershell
# Copy environment template
cp .env.example .env

# Edit .env file with your API keys
# Add your OpenAI API key and other configurations
```

### 4. Run the Application

Open **3 separate terminals**:

**Terminal 1 - Backend API:**
```powershell
backend\venv\Scripts\Activate.ps1
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```

**Terminal 3 - AI Agents:**
```powershell
ai_agents\venv\Scripts\Activate.ps1
cd ai_agents
python automation_loop.py
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 📦 What's Installed

**Backend packages:**
- FastAPI - Web framework
- SQLAlchemy - Database ORM
- OpenAI - AI integration
- Uvicorn - ASGI server

**AI Agents packages:**
- OpenAI - AI models
- LangChain - Agent framework
- Schedule - Automation

**Frontend packages:**
- React - UI framework
- React Router - Navigation
- Axios - API client
- Recharts - Data visualization

---

## ✅ Verify Installation

```powershell
# Check Python version
python --version

# Check Node version
node --version

# Check npm version
npm --version
```

You're all set! 🎉
