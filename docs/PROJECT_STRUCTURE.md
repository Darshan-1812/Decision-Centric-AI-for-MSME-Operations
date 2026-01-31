# Project Structure

This document outlines the complete folder structure of the Decision-Centric AI for MSME Operations platform.

## Directory Tree

```
Decision-Centric-AI-for-MSME-Operations/
│
├── 📁 backend/                          # Backend API & Business Logic
│   ├── 📄 app.py                        # FastAPI main application
│   ├── 📄 requirements.txt              # Python dependencies
│   │
│   ├── 📁 api/                          # API Layer
│   │   ├── 📁 routes/                   # API endpoints
│   │   │   ├── tasks.py                # Task CRUD routes
│   │   │   ├── decisions.py            # Decision routes
│   │   │   ├── dashboard.py            # Dashboard routes
│   │   │   └── resources.py            # Resource routes
│   │   └── 📁 middleware/               # Middleware
│   │       ├── auth.py                 # Authentication
│   │       └── validation.py           # Request validation
│   │
│   ├── 📁 models/                       # Data Models
│   │   ├── 📄 core_models.py           # Task, Resource, Agent models
│   │   └── database_models.py          # SQLAlchemy models
│   │
│   ├── 📁 services/                     # Business Logic
│   │   ├── task_service.py             # Task management
│   │   ├── resource_service.py         # Resource management
│   │   └── staff_service.py            # Staff management
│   │
│   ├── 📁 database/                     # Database Layer
│   │   ├── connection.py               # DB connection
│   │   └── migrations/                 # DB migrations
│   │
│   └── 📁 utils/                        # Helper Functions
│       ├── helpers.py
│       └── validators.py
│
├── 📁 frontend/                         # React Web Application
│   ├── 📄 package.json                  # Node dependencies
│   │
│   ├── 📁 public/                       # Static Assets
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   └── 📁 src/                          # Source Code
│       ├── 📄 App.jsx                   # Main App component
│       ├── 📄 index.js                  # Entry point
│       │
│       ├── 📁 components/               # React Components
│       │   ├── 📁 owner/                # Owner Dashboard
│       │   │   ├── OwnerDashboard.jsx
│       │   │   ├── DecisionFeed.jsx
│       │   │   └── OverviewCards.jsx
│       │   ├── 📁 staff/                # Staff Interface
│       │   │   ├── StaffInterface.jsx
│       │   │   └── TaskCard.jsx
│       │   └── 📁 common/               # Shared Components
│       │       ├── Navbar.jsx
│       │       └── LoadingSpinner.jsx
│       │
│       ├── 📁 pages/                    # Page Components
│       │   ├── HomePage.jsx
│       │   └── LoginPage.jsx
│       │
│       ├── 📁 services/                 # API Communication
│       │   ├── api.js                  # Axios config
│       │   ├── taskService.js
│       │   └── decisionService.js
│       │
│       ├── 📁 styles/                   # CSS Files
│       │   ├── App.css
│       │   └── components/
│       │
│       └── 📁 utils/                    # Frontend Utilities
│           └── formatters.js
│
├── 📁 ai_agents/                        # AI Agent System
│   ├── 📄 automation_loop.py            # Main automation loop
│   ├── 📄 requirements.txt              # AI dependencies
│   │
│   ├── 📁 decision_agent/               # BOSS Agent
│   │   ├── 📄 decision_agent.py        # Main agent class
│   │   ├── __init__.py
│   │   └── config.py
│   │
│   ├── 📁 request_agent/                # Request Processor
│   │   ├── 📄 request_agent.py
│   │   └── __init__.py
│   │
│   ├── 📁 inventory_agent/              # Inventory Monitor
│   │   ├── 📄 inventory_agent.py
│   │   └── __init__.py
│   │
│   ├── 📁 staff_agent/                  # Workforce Manager
│   │   ├── 📄 staff_agent.py
│   │   └── __init__.py
│   │
│   ├── 📁 prompts/                      # AI Prompts
│   │   ├── 📄 agent_prompts.py         # All agent prompts
│   │   └── README.md                   # Prompt documentation
│   │
│   └── 📁 utils/                        # Agent Utilities
│       ├── llm_client.py               # LLM wrapper
│       └── helpers.py
│
├── 📁 config/                           # Configuration Files
│   ├── database.config.js              # Database config
│   ├── ai.config.js                    # AI model config
│   └── app.config.js                   # App settings
│
├── 📁 docs/                             # Documentation
│   ├── 📁 architecture/                 # Architecture Docs
│   │   ├── 📄 SYSTEM_DESIGN.md         # System design document
│   │   ├── DATA_MODEL.md               # Data model specs
│   │   └── DECISION_FLOW.md            # Decision flow
│   │
│   └── 📁 api/                          # API Documentation
│       └── API_REFERENCE.md            # API endpoints
│
├── 📁 tests/                            # Test Suites
│   ├── 📁 backend/                      # Backend tests
│   │   ├── test_api.py
│   │   └── test_services.py
│   ├── 📁 frontend/                     # Frontend tests
│   │   └── App.test.js
│   └── 📁 ai_agents/                    # Agent tests
│       ├── test_decision_agent.py
│       └── test_inventory_agent.py
│
├── 📁 scripts/                          # Utility Scripts
│   ├── setup.sh                        # Setup script
│   ├── seed_data.py                    # Database seeding
│   └── run_all.sh                      # Run all services
│
├── 📁 logs/                             # Application Logs
│   ├── app.log
│   ├── agents.log
│   └── errors.log
│
├── 📄 .env.example                      # Environment template
├── 📄 .gitignore                        # Git ignore rules
├── 📄 README.md                         # Main documentation
├── 📄 docker-compose.yml                # Docker orchestration
└── 📄 LICENSE                           # License file
```

## Key Files Explained

### Backend
- **app.py**: FastAPI application entry point
- **core_models.py**: Pydantic models for Task, Resource, Agent
- **routes/**: REST API endpoints for different entities

### Frontend
- **App.jsx**: Main React application with routing
- **OwnerDashboard.jsx**: Owner's comprehensive dashboard
- **StaffInterface.jsx**: Simple staff task interface

### AI Agents
- **decision_agent.py**: BOSS agent coordinating all decisions
- **automation_loop.py**: Continuous monitoring and execution
- **agent_prompts.py**: All AI agent prompts in one place

### Configuration
- **.env.example**: Template for environment variables
- **requirements.txt**: Python dependencies for backend and agents
- **package.json**: Node.js dependencies for frontend

## Getting Started

1. **Clone and navigate to the project**
   ```bash
   cd "Decision-Centric AI for MSME Operations"
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd backend && pip install -r requirements.txt

   # Frontend
   cd frontend && npm install

   # AI Agents
   cd ai_agents && pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   # Terminal 1: Backend
   cd backend && python app.py

   # Terminal 2: Frontend
   cd frontend && npm start

   # Terminal 3: AI Agents
   cd ai_agents && python automation_loop.py
   ```

## Development Workflow

1. **Backend Development**: Add routes in `backend/api/routes/`, business logic in `backend/services/`
2. **Frontend Development**: Create components in `frontend/src/components/`, connect to API via `services/`
3. **AI Agent Development**: Modify agent logic in `ai_agents/{agent_name}/`, update prompts in `prompts/`

## Deployment

Use `docker-compose.yml` for containerized deployment:

```bash
docker-compose up -d
```

All services (backend, frontend, agents, database) will run in containers.
