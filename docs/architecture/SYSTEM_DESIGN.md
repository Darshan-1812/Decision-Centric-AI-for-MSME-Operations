# System Architecture

## Overview

Decision-Centric AI for MSME is built on an **agentic architecture** where autonomous AI agents continuously monitor operations, reason over constraints, and coordinate decisions.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USER LAYER                           │
├─────────────────┬───────────────────┬──────────────────────┤
│  Owner Dashboard│   Staff Interface  │   External Systems   │
│  (React)        │   (React)          │   (API/Forms)        │
└────────┬────────┴──────────┬────────┴───────────┬──────────┘
         │                   │                    │
         └──────────┬────────┴────────────────────┘
                    │
         ┌──────────▼──────────────────┐
         │     API GATEWAY (FastAPI)   │
         │    - Authentication         │
         │    - Request Routing        │
         │    - Data Validation        │
         └──────────┬──────────────────┘
                    │
         ┌──────────▼──────────────────┐
         │   BUSINESS LOGIC LAYER      │
         │   - Task Service            │
         │   - Resource Service        │
         │   - Staff Service           │
         └──────────┬──────────────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
┌───▼────┐    ┌────▼─────┐    ┌───▼──────┐
│Database│    │AI Agents │    │WebSocket │
│(PostgreSQL)│ │  Layer   │    │  Server  │
└────────┘    └────┬─────┘    └──────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
   ┌────▼───┐ ┌───▼────┐ ┌──▼─────┐
   │Request │ │Inventory│ │Staff   │
   │ Agent  │ │ Agent   │ │Agent   │
   └───┬────┘ └───┬────┘ └──┬─────┘
       │          │          │
       └──────────┼──────────┘
                  │
           ┌──────▼──────┐
           │  Decision   │
           │   Agent     │
           │   (BOSS)    │
           └─────────────┘
```

## Component Descriptions

### 1. Frontend Layer (React)

**Owner Dashboard**
- Real-time overview cards
- AI decision feed
- Approve/Override controls
- Analytics & insights

**Staff Interface**
- Simple task list
- Start/Complete buttons
- Minimal complexity

### 2. Backend API (FastAPI)

**Responsibilities:**
- REST API endpoints
- Authentication & authorization
- Request validation
- Real-time updates via WebSockets
- Database operations

**Key Routes:**
- `/api/tasks` - Task CRUD operations
- `/api/decisions` - AI decision history
- `/api/dashboard/owner` - Owner dashboard data
- `/api/dashboard/staff/{id}` - Staff tasks
- `/api/resources` - Resource management

### 3. AI Agents Layer

**Request Agent**
- Monitors new orders/requests
- Converts to standardized Task objects
- Triggers decision cycle

**Inventory Agent**
- Tracks resource levels
- Predicts shortages
- Raises alerts

**Staff Agent**
- Monitors workforce availability
- Tracks workload
- Suggests assignments

**Decision Agent (BOSS)**
- Coordinates all agents
- Makes final decisions
- Prioritizes actions
- Assigns tasks

### 4. Data Layer

**Database Schema:**

```sql
Tasks
- task_id (PK)
- type
- priority
- deadline
- status
- assigned_to (FK)
- metadata (JSONB)

Resources
- resource_id (PK)
- name
- type
- available
- required
- reorder_level

Staff
- staff_id (PK)
- name
- skills (ARRAY)
- availability
- current_workload

Decisions
- decision_id (PK)
- decision_type
- reasoning
- actions (JSONB)
- timestamp
- agent_name
- status
```

## Decision Flow

1. **Event Trigger**
   - New request arrives
   - Inventory level changes
   - Staff updates status
   - Scheduled check (every 10 min)

2. **Data Collection**
   - Request Agent processes new requests
   - Inventory Agent checks stock levels
   - Staff Agent evaluates availability

3. **Decision Making**
   - Decision Agent receives all data
   - Evaluates constraints:
     - Deadlines
     - Resource availability
     - Staff capacity
   - Generates priority-ordered actions

4. **Execution**
   - Tasks assigned to staff
   - Notifications sent
   - Dashboard updated

5. **Monitoring**
   - Track task progress
   - Detect delays
   - Reassign if needed

## Key Design Principles

### 1. Unified Data Model
All MSMEs use the same core objects (Task, Resource, Agent), with industry-specific details in metadata.

### 2. Autonomous Operation
The system runs continuously without manual intervention. Humans only approve critical decisions.

### 3. Explainable AI
Every AI decision includes reasoning, making it transparent and trustworthy.

### 4. Real-time Updates
WebSocket connections ensure all dashboards show live data.

### 5. Scalability
- Horizontal scaling of API servers
- Agent parallelization
- Database optimization

## Technology Stack

- **Frontend**: React, React Router, Axios, Recharts
- **Backend**: FastAPI, SQLAlchemy, Pydantic
- **Database**: PostgreSQL (primary), MongoDB (optional)
- **AI/ML**: OpenAI API, LangChain
- **Real-time**: WebSockets
- **Deployment**: Docker, Docker Compose

## Security Considerations

- JWT-based authentication
- Role-based access control (Owner, Staff)
- API rate limiting
- Input validation & sanitization
- Secure environment variable management

## Future Enhancements

- Multi-tenant support
- Advanced analytics & predictions
- Mobile app for staff
- Integration with ERPs
- Custom agent training
