# Decision-Centric AI for MSME Operations

> **A unified agentic AI system where autonomous agents continuously observe operations, reason over constraints, and take coordinated decisions, removing the need for manual task orchestration.**

## 🎯 Project Overview

This platform provides **ONE WEBSITE** that works for ALL MSMEs, enabling:
- **Owners** to see everything in one place
- **Staff** to automatically receive tasks
- **AI** to decide what to do next (priority-based)
- **Zero** WhatsApp chaos or Excel juggling

### Key Features

✅ **Autonomous Email-to-Project Pipeline** - Emails automatically become projects  
✅ **AI-Powered Priority Scoring** - Industry-standard decision rules  
✅ **Smart Team Assignment** - Skills-based task allocation  
✅ **Real-time Dashboard** - Modern Next.js UI with live updates  
✅ **Multi-Agent System** - Specialized agents for each function  

## 🏗️ Architecture

```
Email Inbox → Email Agent → Requirement Agent → Priority Scorer → Team Assignment → Dashboard
                    ↓              ↓                   ↓                ↓
              Fetch emails    Extract specs     Calculate score    Assign team
```

### AI Agents

| Agent | Role |
|-------|------|
| 📧 **Email Agent** | Monitors inbox, filters project emails |
| 📋 **Requirement Agent** | Extracts project specifications from emails |
| 🎯 **Decision Agent** | Calculates priority using business rules |
| 👥 **Team Agent** | Assigns tasks based on skills matching |
| 💬 **Communication Agent** | Generates client responses |
| 📊 **Monitoring Agent** | Tracks project progress |

## 📁 Project Structure

```
Decision-Centric-AI-for-MSME-Operations/
│
├── ai_agents/                  # 🤖 AI Agent System
│   ├── email_agent/           # Email monitoring & classification
│   ├── requirement_agent/     # Requirement extraction
│   ├── decision_agent/        # Priority scoring engine
│   ├── team_agent/            # Team assignment logic
│   ├── communication_agent/   # Client communication
│   ├── monitoring_agent/      # Progress tracking
│   ├── prompts/               # AI prompts library
│   └── autonomous_system.py   # Main orchestrator
│
├── backend/                    # 🔧 FastAPI Backend
│   ├── api/
│   │   ├── autonomous_routes.py  # Main API endpoints
│   │   └── routes/               # Additional routes
│   ├── models/                   # Data models
│   └── app.py                    # Entry point
│
├── msme-ai-system/             # 🎨 Next.js Frontend
│   ├── app/                    # App router pages
│   │   ├── dashboard/          # Dashboard views
│   │   └── layout.tsx          # Root layout
│   ├── components/             # UI components
│   ├── lib/                    # Actions & utilities
│   └── styles/                 # Styling
│
├── docs/                       # 📚 Documentation
│   ├── architecture/
│   ├── EMAIL_SETUP_GUIDE.md
│   └── PRIORITY_DECISION_AGENT.md
│
├── tests/                      # 🧪 Test suites
├── config/                     # ⚙️ Configuration
├── scripts/                    # 🔨 Utility scripts
│
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── README.md                  # This file
├── QUICKSTART.md              # Quick setup guide
├── setup.ps1                  # Windows setup script
└── run.ps1                    # Windows run script
```

## 🚀 Getting Started

### Prerequisites

- Python 3.9+ with pip
- Node.js 18+ with npm/pnpm
- Gmail account with [App Password](https://support.google.com/accounts/answer/185833)
- [Google Gemini API Key](https://aistudio.google.com/apikey) (free tier available)

### Quick Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Decision-Centric-AI-for-MSME-Operations.git
   cd Decision-Centric-AI-for-MSME-Operations
   ```

2. **Setup environment**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your credentials
   # - GEMINI_API_KEY
   # - COMPANY_EMAIL
   # - EMAIL_PASSWORD (App Password)
   ```

3. **Backend Setup**
   ```bash
   # Create virtual environment
   python -m venv .venv
   
   # Activate (Windows)
   .\.venv\Scripts\Activate.ps1
   
   # Activate (Linux/Mac)
   source .venv/bin/activate
   
   # Install dependencies
   pip install -r ai_agents/requirements.txt
   pip install -r backend/requirements.txt
   
   # Run backend
   python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000
   ```

4. **Frontend Setup**
   ```bash
   cd msme-ai-system
   npm install  # or pnpm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 🧠 How It Works

### Priority Scoring Algorithm

The Decision Agent uses industry-standard rules:

| Factor | Weight | Description |
|--------|--------|-------------|
| Deadline | 40% | Days until due date |
| Payment | 25% | Advance payment status |
| Project Value | 15% | Budget amount |
| Client Type | 10% | New vs returning client |
| Team Load | 10% | Current workload capacity |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React 19, TailwindCSS, shadcn/ui |
| **Backend** | Python, FastAPI, Uvicorn |
| **AI/ML** | Google Gemini API, LangChain patterns |
| **Email** | IMAP (Gmail supported) |
| **State** | In-memory (production: PostgreSQL/MongoDB) |

