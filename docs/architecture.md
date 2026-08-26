# AegisOne Architecture

## 1. Overview

AegisOne follows a modular, API-driven architecture designed for cybersecurity and digital risk management.

The platform separates presentation, API services, security analysis, AI capabilities, database responsibilities, testing, and deployment concerns.

The architecture is designed to support future expansion without requiring major changes to the core application.

---

## 2. High-Level Architecture

```text
                         ┌───────────────────────┐
                         │    Security Operator  │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │       Frontend        │
                         │     HTML / CSS / JS   │
                         └───────────┬───────────┘
                                     │
                              HTTP / REST API
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │       FastAPI         │
                         │        Backend        │
                         └───────────┬───────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
       ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
       │ Asset API   │        │ Risk Engine │        │ Findings API│
       └──────┬──────┘        └──────┬──────┘        └──────┬──────┘
              │                      │                      │
              └──────────────────────┼──────────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │    Database     │
                            └─────────────────┘

                         Future Extensions
                                  │
                 ┌────────────────┼────────────────┐
                 ▼                ▼                ▼
            ┌─────────┐     ┌─────────────┐  ┌────────────┐
            │AI Engine│     │Threat Intel │  │ Automation │
            └─────────┘     └─────────────┘  └────────────┘
```

---

## 3. Frontend Layer

The frontend is responsible for the user interface and interaction with the security platform.

### Current technologies

- HTML5
- CSS3
- JavaScript
- REST API integration

### Responsibilities

The frontend handles:

- Dashboard rendering
- Navigation
- Asset management interface
- Security findings interface
- Risk analysis interface
- System status
- API connectivity state
- User actions
- Data refresh

The frontend communicates with the backend through HTTP requests.

---

## 4. Backend Layer

The backend is implemented using FastAPI.

### Responsibilities

The backend provides:

- REST APIs
- Asset management
- Risk analysis
- Security findings
- Health monitoring
- API information
- CORS configuration
- Business logic integration

The backend acts as the central service layer between the frontend and underlying security/data components.

---

## 5. Asset Management

Assets represent infrastructure or digital resources monitored by AegisOne.

### Asset attributes

```text
ID
Name
Type
Target
Environment
Status
Risk Score
```

### Supported types

```text
server
website
database
application
network
```

### Asset lifecycle

```text
Create
  │
  ▼
Register
  │
  ▼
Monitor
  │
  ▼
Calculate Risk
  │
  ▼
Review Findings
  │
  ▼
Update / Delete
```

---

## 6. Risk Engine

The risk engine provides security risk calculation for assets.

The current API exposes:

```http
POST /api/risk/{asset_id}
```

The calculation returns:

```text
Asset ID
Risk Score
Risk Level
```

### Risk levels

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Example:

```text
Asset ID: 2
Risk Score: 45
Risk Level: MEDIUM
```

The risk engine is separated conceptually from the frontend so that risk logic can evolve independently.

---

## 7. Findings Layer

Security findings represent security issues associated with monitored assets.

A finding can contain:

```text
ID
Title
Severity
Status
Asset
Description
Recommendation
```

The current findings API is:

```http
GET /api/findings/
```

Findings are presented to the security operator through the dashboard and findings page.

---

## 8. AI Engine

The `ai-engine` directory is reserved for AI-assisted security intelligence.

The AI layer is intentionally separated from the core backend.

### Planned capabilities

- Finding analysis
- Risk explanations
- Security recommendations
- Threat context
- Natural-language security reports
- AI-assisted remediation suggestions

### Architectural principle

The AI engine should not become tightly coupled to the frontend.

Instead:

```text
Frontend
   │
   ▼
Backend API
   │
   ▼
AI Service
   │
   ▼
AI Analysis
```

This allows the AI implementation to be replaced or upgraded independently.

---

## 9. Database Layer

The `database` module is intended to contain database-related responsibilities.

Potential responsibilities include:

- Database configuration
- Schema
- Initialization
- Migrations
- Seed data
- Database documentation

The API layer should communicate with persistence through a clearly defined data-access layer.

---

## 10. Security Engine

The `security-engine` module is intended to contain reusable security analysis logic.

Potential responsibilities:

- Risk scoring rules
- Severity classification
- Security checks
- Asset posture analysis
- Finding generation
- Security recommendations

The security engine should remain independent of the frontend.

---

## 11. Testing Layer

The `tests` directory is reserved for automated verification.

Testing categories include:

### Unit tests

Individual functions and components.

### API tests

FastAPI endpoint behavior.

### Integration tests

Interaction between multiple services.

### Regression tests

Protection against previously fixed bugs returning.

---

## 12. Docker Architecture

AegisOne is designed to support containerized deployment.

A future deployment can contain:

```text
┌────────────────────────────┐
│      Docker Compose        │
├────────────────────────────┤
│                            │
│  Frontend Container        │
│           │                │
│           ▼                │
│  Backend Container         │
│           │                │
│           ▼                │
│  Database Container        │
│                            │
└────────────────────────────┘
```

Docker configuration will isolate services and simplify deployment.

---

## 13. CI/CD Architecture

The `.github` directory is intended for GitHub Actions automation.

Future pipeline:

```text
Git Push
   │
   ▼
GitHub Actions
   │
   ├── Lint
   │
   ├── Unit Tests
   │
   ├── API Tests
   │
   ├── Build
   │
   └── Deployment Checks
```

---

## 14. API Communication

Frontend-to-backend communication uses REST APIs.

Current backend:

```text
http://127.0.0.1:8000
```

Frontend development server:

```text
http://127.0.0.1:5500
```

CORS is configured so that the frontend can communicate with the backend during local development.

---

## 15. Error Handling

The frontend handles backend availability through the `/health` endpoint.

Possible states:

```text
CHECKING
ONLINE
OFFLINE
```

API failures should result in:

- User-visible error messages
- Safe fallback UI
- No application crash
- Console diagnostics for development

---

## 16. Security Boundaries

The architecture separates major trust boundaries.

```text
Browser
   │
   │ HTTP
   ▼
API Boundary
   │
   ▼
Application Logic
   │
   ├── Security Engine
   ├── AI Engine
   └── Database
```

Production deployment should add:

- Authentication
- Authorization
- HTTPS
- Rate limiting
- Secure secrets
- Audit logging
- Database access controls

---

## 17. Scalability Strategy

AegisOne can evolve from a local development platform into a multi-service architecture.

Potential scaling path:

```text
Single Application
       │
       ▼
Modular Application
       │
       ▼
Separated Services
       │
       ▼
Containerized Services
       │
       ▼
Cloud / Production Infrastructure
```

The modular directory structure is intended to support this evolution.

---

## 18. Design Principles

AegisOne follows these principles:

### Separation of Concerns

Each component should have a clear responsibility.

### Modularity

New security capabilities should be addable without rewriting unrelated modules.

### API-First Communication

The frontend communicates with backend services through defined APIs.

### Security by Design

Security considerations should be included throughout development.

### Testability

Important application behavior should be independently testable.

### Extensibility

The architecture should support AI, threat intelligence, automation, and production deployment.

---

## 19. Current Architecture Status

| Component | Status |
|---|---|
| Frontend | 🟢 Operational |
| FastAPI Backend | 🟢 Operational |
| Asset API | 🟢 Operational |
| Risk API | 🟢 Operational |
| Findings API | 🟢 Operational |
| Health API | 🟢 Operational |
| AI Engine | 🟡 Planned / Expansion |
| Database Module | 🟡 Expansion |
| Security Engine Module | 🟡 Expansion |
| Automated Tests | 🟡 Expansion |
| Docker | 🟡 Expansion |
| CI/CD | 🟡 Expansion |

---

## 20. Future Architecture

The long-term architecture can evolve toward:

```text
                    ┌───────────────────────┐
                    │    Security Users     │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Web Dashboard       │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │      API Gateway      │
                    └───────────┬───────────┘
                                │
            ┌───────────────────┼───────────────────┐
            ▼                   ▼                   ▼
      Asset Service       Risk Service        Finding Service
            │                   │                   │
            └───────────────────┼───────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
              Security Engine          AI Engine
                    │                       │
                    └───────────┬───────────┘
                                ▼
                         Database Layer
```

This architecture provides a foundation for future cybersecurity automation and AI-assisted security operations.
