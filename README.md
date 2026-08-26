# 🛡️ AegisOne

## AI-Powered Cybersecurity & Digital Risk Management Platform

<p align="center">

**AegisOne** is a modular cybersecurity platform designed to provide centralized visibility into digital assets, security risk, security findings, and operational health.

</p>

---

## 🚀 Overview

AegisOne is a security operations platform that brings **asset management, risk analysis, security findings, and API monitoring** into a single dashboard.

The platform is designed with a modular architecture so that additional capabilities such as AI-assisted security analysis, automated testing, containerized deployment, threat intelligence, authentication, and security automation can be added without redesigning the core system.

### Core objectives

- 🔍 Discover and monitor security assets
- 📊 Measure security risk
- ⚠️ Track security findings
- 🧮 Calculate asset-level risk scores
- 🖥️ Provide centralized security visibility
- 🔌 Monitor backend/API health
- 🤖 Extend the platform with AI-assisted security intelligence
- 🐳 Support containerized deployment
- 🧪 Maintain automated verification and testing

---

# ✨ Key Features

## 🖥️ Security Operations Dashboard

AegisOne provides a centralized security dashboard containing:

- Total assets
- Critical-risk assets
- High-risk assets
- Average risk score
- Risk distribution
- Security findings
- Asset overview
- Backend connection status

The dashboard is designed to give security operators a quick overview of the current security posture.

---

## 📦 Asset Management

AegisOne supports centralized management of monitored digital assets.

### Supported asset types

- Server
- Website
- Database
- Application
- Network

### Asset information

Each asset can contain:

```text
ID
Name
Type
Target
Environment
Status
Risk Score
```

### Asset operations

```text
Create Asset
View Assets
Analyze Asset Risk
Delete Asset
```

---

# 🛡️ Risk Analysis Engine

The risk engine evaluates registered assets and produces a numerical risk score with a corresponding risk level.

### Risk levels

| Level | Description |
|---|---|
| 🟢 LOW | Low security risk |
| 🟡 MEDIUM | Moderate security risk |
| 🟠 HIGH | Elevated security risk |
| 🔴 CRITICAL | Severe security risk |

### Example

```text
Asset:
AegisOne Test Server

Risk Score:
45

Risk Level:
MEDIUM
```

Risk calculation endpoint:

```http
POST /api/risk/{asset_id}
```

---

# ⚠️ Security Findings

The findings module provides centralized visibility into detected security issues.

Each finding can contain:

- Finding ID
- Title
- Severity
- Status
- Description
- Recommendation
- Related asset

### Supported severities

```text
LOW
MEDIUM
HIGH
CRITICAL
```

### Example

```text
Finding:
Security Configuration Review

Severity:
MEDIUM

Status:
OPEN
```

---

# 🔌 API Health Monitoring

AegisOne continuously checks backend availability through the health endpoint.

```http
GET /health
```

Example:

```json
{
  "status": "healthy",
  "service": "AegisOne API",
  "version": "1.0.0"
}
```

The frontend exposes the following states:

```text
🟢 API Connected
🟡 Checking API
🔴 API Offline
```

---

# 🏗️ System Architecture

```text
                         ┌───────────────────────┐
                         │       Security        │
                         │       Operator        │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │       Frontend        │
                         │     HTML / CSS / JS   │
                         └───────────┬───────────┘
                                     │
                              REST / HTTP
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │       FastAPI         │
                         │        Backend        │
                         └───────────┬───────────┘
                                     │
                ┌────────────────────┼────────────────────┐
                │                    │                    │
                ▼                    ▼                    ▼
        ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
        │ Asset API    │     │ Risk Engine  │     │ Findings API │
        └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
               │                    │                    │
               └────────────────────┼────────────────────┘
                                    │
                                    ▼
                         ┌───────────────────────┐
                         │       Database        │
                         └───────────────────────┘


             Future Extensions
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   AI Engine    Threat Intel   Automation
```

---

# 🧩 Modular Architecture

AegisOne separates major responsibilities into independent modules.

```text
AegisOne/
│
├── .github/
│   └── workflows/
│
├── ai-engine/
│
├── backend/
│   └── app/
│
├── database/
│
├── docker/
│
├── docs/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── security-engine/
│
├── tests/
│
├── docker-compose.yml
│
└── README.md
```

### Design principles

- Modular components
- Separation of concerns
- API-driven communication
- Extensible security engine
- Independent AI layer
- Testable services
- Deployment-ready architecture

---

# ⚙️ Technology Stack

## Frontend

- HTML5
- CSS3
- JavaScript
- REST API
- Responsive UI

## Backend

- Python
- FastAPI
- Uvicorn
- REST API
- CORS

## Security

- Risk scoring
- Asset analysis
- Security findings
- Security posture monitoring

## Development

- Git
- GitHub
- Visual Studio Code
- PowerShell

## Planned Infrastructure

- Docker
- Docker Compose
- GitHub Actions
- Automated testing

---

# 🔌 REST API

## Health

```http
GET /health
```

Returns backend health status.

---

## API Information

```http
GET /api/info
```

Returns AegisOne API information.

---

## Assets

### List Assets

```http
GET /api/assets/
```

### Create Asset

```http
POST /api/assets/
Content-Type: application/json
```

Example:

```json
{
  "name": "Production Server",
  "type": "server",
  "target": "192.168.1.10",
  "environment": "production"
}
```

### Delete Asset

```http
DELETE /api/assets/{asset_id}
```

---

## Risk

### Risk Overview

```http
GET /api/risk/
```

Example:

```json
{
  "success": true,
  "total_assets": 1,
  "critical": 0,
  "high": 0,
  "average": 45.0,
  "average_risk": 45.0
}
```

### Calculate Asset Risk

```http
POST /api/risk/{asset_id}
```

Example:

```json
{
  "success": true,
  "message": "Risk calculated successfully",
  "asset_id": 2,
  "risk_score": 45,
  "risk_level": "medium"
}
```

---

## Findings

```http
GET /api/findings/
```

Example:

```json
{
  "success": true,
  "total": 1,
  "critical": 0,
  "high": 0,
  "medium": 1,
  "low": 0
}
```

---

# 🧪 Verification & Testing

The current core API has been manually verified through PowerShell.

### Verification matrix

| Component | Test | Result |
|---|---|---|
| Health | `GET /health` | 🟢 PASS |
| Assets | `GET /api/assets/` | 🟢 PASS |
| Create | `POST /api/assets/` | 🟢 PASS |
| Risk Overview | `GET /api/risk/` | 🟢 PASS |
| Risk Calculation | `POST /api/risk/{id}` | 🟢 PASS |
| Findings | `GET /api/findings/` | 🟢 PASS |
| Delete | `DELETE /api/assets/{id}` | 🟢 PASS |
| Frontend | Dashboard | 🟢 PASS |
| Navigation | All sections | 🟢 PASS |
| Risk UI | Risk Analysis | 🟢 PASS |

---

# ▶️ Local Development

## Prerequisites

Install:

- Python 3.x
- VS Code
- Git
- A modern web browser

---

## Backend Setup

Navigate to:

```powershell
cd C:\xampp\htdocs\AegisOne\backend
```

Activate the virtual environment:

```powershell
..\.venv\Scripts\Activate.ps1
```

Start the FastAPI development server:

```powershell
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

---

# 🌐 Frontend Setup

Open the frontend using VS Code Live Server.

Typical development URL:

```text
http://127.0.0.1:5500/frontend/index.html
```

The frontend communicates with:

```text
http://127.0.0.1:8000
```

---

# 🤖 AI Security Intelligence

The `ai-engine/` module is designed as a future extension of the platform.

Potential capabilities include:

### Security Finding Analysis

Analyze findings and generate human-readable explanations.

### Risk Explanation

Explain why an asset received a particular risk score.

### Security Recommendations

Generate contextual recommendations for security findings.

### Threat Context

Provide additional context around security events and findings.

### Natural Language Security Reports

Generate security summaries for operators and management.

The AI layer is intentionally separated from the core FastAPI backend and risk engine.

---

# 🛡️ Security Engine

The `security-engine/` module is responsible for security-specific analysis logic.

Future capabilities include:

```text
Risk scoring
Severity classification
Security rules
Asset posture analysis
Finding generation
Security recommendations
```

The separation allows the security engine to evolve independently from the web interface.

---

# 🗄️ Database Layer

The `database/` module is intended to centralize:

- Database configuration
- Schema definitions
- Initialization
- Migrations
- Database documentation

The goal is to keep persistence concerns separate from API and presentation layers.

---

# 🐳 Containerization

AegisOne is designed to support containerized deployment.

Planned services:

```text
┌────────────────────┐
│     Frontend       │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│      Backend       │
│      FastAPI       │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│      Database      │
└────────────────────┘
```

Docker Compose will eventually provide a single command for starting the platform stack.

---

# ⚙️ CI/CD

The `.github/` directory is reserved for GitHub-based automation.

Planned pipeline:

```text
Developer
    │
    ▼
Git Commit
    │
    ▼
GitHub
    │
    ▼
GitHub Actions
    │
    ├── Lint
    ├── Test
    ├── Build
    └── Verify
```

This will help prevent broken code from being merged into the main project.

---

# 🔐 Security Considerations

For production deployment, AegisOne should implement:

- Authentication
- Authorization
- Role-Based Access Control
- HTTPS
- Secure cookies
- API rate limiting
- Input validation
- Output encoding
- Secret management
- Audit logging
- Database access controls
- Secure CORS configuration
- Error handling
- Dependency security scanning

Development configuration should not be reused directly for production deployment.

---

# 🗺️ Development Roadmap

## Phase 1 — Core Platform

- [x] FastAPI backend
- [x] Security dashboard
- [x] Asset management
- [x] Risk overview
- [x] Risk calculation
- [x] Security findings
- [x] API health monitoring
- [x] Frontend navigation

## Phase 2 — Engineering

- [ ] Modular security engine
- [ ] Automated test suite
- [ ] Database organization
- [ ] AI security analysis
- [ ] Docker deployment
- [ ] GitHub Actions

## Phase 3 — Advanced Security

- [ ] Authentication
- [ ] RBAC
- [ ] Audit logging
- [ ] Threat intelligence
- [ ] Security alerts
- [ ] AI-assisted remediation
- [ ] Security reporting

## Phase 4 — Production

- [ ] HTTPS deployment
- [ ] Production database
- [ ] Monitoring
- [ ] Logging
- [ ] Backup strategy
- [ ] CI/CD deployment
- [ ] Security hardening

---

# 📊 Current Project Status

```text
AegisOne v1.0.0

Core Platform
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Backend             🟢 Operational
Frontend            🟢 Operational
Asset API           🟢 Operational
Risk Engine         🟢 Operational
Findings API        🟢 Operational
Health API          🟢 Operational
Dashboard           🟢 Operational

Engineering Modules
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI Engine           🟡 In Development
Security Engine     🟡 In Development
Database Layer      🟡 In Development
Testing             🟡 In Development
Docker              🟡 In Development
CI/CD               🟡 In Development
```

---

# 🎯 Project Goals

AegisOne aims to evolve into a unified cybersecurity platform capable of providing:

```text
Asset Visibility
       ↓
Security Assessment
       ↓
Risk Calculation
       ↓
Finding Detection
       ↓
AI-Assisted Analysis
       ↓
Security Recommendations
       ↓
Continuous Monitoring
```

The long-term objective is to provide security teams with a centralized platform for understanding and improving digital security posture.

---

# 📚 Documentation

Technical documentation is maintained inside:

```text
docs/
```

Planned documentation:

- Architecture
- API Reference
- Installation
- Development Guide
- Testing Guide
- Security Model
- Deployment Guide
- AI Engine Documentation

---

# 🤝 Development Philosophy

AegisOne follows a modular and maintainable engineering approach.

Key principles:

- **Security First**
- **Modular Architecture**
- **API-Driven Design**
- **Separation of Concerns**
- **Testable Components**
- **Extensible Services**
- **Clear Documentation**
- **Production-Oriented Development**

---

# 📄 License

This project is currently intended for educational, development, and portfolio purposes.

A formal open-source license can be added before public distribution.

---

# 🛡️ AegisOne

### Monitor. Analyze. Protect.

**A modular cybersecurity and digital risk platform built for modern security operations.**


## 🌐 Live Demo

🚀 **AegisOne Live Website:** https://aegisone-frontend.onrender.com

