# AegisOne Setup & Installation Guide

## 1. Overview

This document explains how to set up and run AegisOne in a local development environment.

The guide covers:

- Project prerequisites
- Project structure
- Python virtual environment
- Backend setup
- FastAPI server
- Frontend setup
- API verification
- Troubleshooting
- Development workflow

---

# 2. Prerequisites

Before running AegisOne, install the following:

| Software | Purpose |
|---|---|
| Python 3.x | Backend development |
| Visual Studio Code | Development environment |
| Git | Version control |
| Modern Web Browser | Frontend |
| VS Code Live Server | Frontend development server |

Optional tools:

- PowerShell
- Docker
- Docker Compose
- GitHub account

---

# 3. Project Location

The current local development project is structured as:

```text
C:\xampp\htdocs\AegisOne
```

The project root should contain:

```text
AegisOne/
├── .github/
├── ai-engine/
├── backend/
├── database/
├── docker/
├── docs/
├── frontend/
├── security-engine/
├── tests/
├── docker-compose.yml
└── README.md
```

---

# 4. Backend Setup

Open PowerShell.

Navigate to the backend:

```powershell
cd C:\xampp\htdocs\AegisOne\backend
```

---

# 5. Python Virtual Environment

AegisOne uses a Python virtual environment to isolate backend dependencies.

The expected environment is:

```text
AegisOne/
└── .venv/
```

Activate it from the backend directory:

```powershell
..\.venv\Scripts\Activate.ps1
```

After activation, PowerShell should show:

```text
(.venv)
```

Example:

```text
(.venv) PS C:\xampp\htdocs\AegisOne\backend>
```

---

# 6. PowerShell Execution Policy

If PowerShell blocks activation, the execution policy can be changed only for the current PowerShell process:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
```

Then activate:

```powershell
..\.venv\Scripts\Activate.ps1
```

This process-scoped configuration does not permanently modify the machine-wide execution policy.

---

# 7. Backend Dependencies

If a dependency file exists, install the backend dependencies with:

```powershell
pip install -r requirements.txt
```

To inspect installed packages:

```powershell
pip list
```

If dependencies need to be frozen:

```powershell
pip freeze > requirements.txt
```

The exact dependency list should match the actual backend implementation.

---

# 8. Start FastAPI

From:

```text
C:\xampp\htdocs\AegisOne\backend
```

run:

```powershell
uvicorn app.main:app --reload
```

A successful startup should display messages similar to:

```text
Application startup complete.
```

The API will normally be available at:

```text
http://127.0.0.1:8000
```

---

# 9. Verify Backend

## Root Endpoint

Open:

```text
http://127.0.0.1:8000
```

Expected response:

```json
{
  "project": "AegisOne",
  "status": "online",
  "version": "1.0.0",
  "docs": "/docs"
}
```

---

# 10. Verify Health

PowerShell:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

Expected result:

```text
status   service       version
------   -------       -------
healthy  AegisOne API  1.0.0
```

If this works, the backend is operational.

---

# 11. Verify API Routes

From the backend directory:

```powershell
python -c "from app.main import app; print([(r.path, sorted(r.methods)) for r in app.routes])"
```

This can be used to inspect the routes currently registered by FastAPI.

For risk routes:

```powershell
python -c "from app.main import app; print([(r.path, sorted(r.methods)) for r in app.routes if 'risk' in r.path])"
```

The current risk API includes:

```text
GET  /api/risk/
POST /api/risk/{asset_id}
```

---

# 12. Swagger Documentation

Open:

```text
http://127.0.0.1:8000/docs
```

Swagger provides an interactive interface for inspecting and testing the API.

Recommended workflow:

```text
Open Swagger
     │
     ▼
Select API endpoint
     │
     ▼
Click "Try it out"
     │
     ▼
Provide request data
     │
     ▼
Execute
     │
     ▼
Inspect response
```

---

# 13. Frontend Setup

The frontend is located at:

```text
AegisOne/frontend/
```

Expected files:

```text
frontend/
├── index.html
├── style.css
└── app.js
```

The frontend communicates with:

```text
http://127.0.0.1:8000
```

---

# 14. Start Frontend with Live Server

Open the project in Visual Studio Code.

Install the **Live Server** extension if it is not already installed.

Right-click:

```text
frontend/index.html
```

Select:

```text
Open with Live Server
```

A typical development URL is:

```text
http://127.0.0.1:5500/frontend/index.html
```

---

# 15. Frontend API Configuration

The frontend API base URL is configured in:

```text
frontend/app.js
```

Development configuration:

```javascript
const API_BASE = "http://127.0.0.1:8000";
```

This means browser requests are sent to the local FastAPI server.

---

# 16. CORS Configuration

The backend allows the local development frontend to communicate with the API.

Development origins include:

```text
http://127.0.0.1:5500
http://localhost:5500
```

CORS should be restricted to trusted origins in production.

---

# 17. Verify Assets API

Run:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/assets/
```

The response should indicate successful retrieval.

Example:

```text
success : True
total   : 1
```

---

# 18. Verify Risk API

Run:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/risk/
```

Example:

```text
success      : True
total_assets : 1
critical     : 0
high         : 0
average      : 45.0
average_risk : 45.0
```

---

# 19. Verify Risk Calculation

The current asset-level risk endpoint is:

```text
POST /api/risk/{asset_id}
```

Example:

```powershell
Invoke-RestMethod `
    -Uri "http://127.0.0.1:8000/api/risk/1" `
    -Method POST
```

Example response:

```text
success    : True
message    : Risk calculated successfully
asset_id   : 1
risk_score : 45
risk_level : medium
```

Important:

The current API does not use:

```text
/api/risk/{asset_id}/calculate
```

The correct route is:

```text
/api/risk/{asset_id}
```

---

# 20. Verify Findings API

Run:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/findings/
```

Example:

```text
success  : True
total    : 1
critical : 0
high     : 0
medium   : 1
low      : 0
```

---

# 21. Create Test Asset

A temporary test asset can be created using PowerShell.

```powershell
$body = @{
    name = "Verification Server"
    type = "server"
    target = "10.0.0.50"
    environment = "staging"
} | ConvertTo-Json
```

Send the request:

```powershell
Invoke-RestMethod `
    -Uri "http://127.0.0.1:8000/api/assets/" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

Verify:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/assets/
```

---

# 22. Delete Test Asset

After testing, remove the temporary asset.

Example:

```powershell
Invoke-RestMethod `
    -Uri "http://127.0.0.1:8000/api/assets/2" `
    -Method DELETE
```

Then verify:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/assets/
```

The asset count should return to the expected value.

---

# 23. Browser Verification

After starting both backend and frontend, verify the following UI sections.

## Dashboard

Check:

- Dashboard loads
- API status appears
- Asset count appears
- Risk information appears
- Findings appear
- Refresh button works

## Assets

Check:

- Assets page opens
- Existing assets appear
- Add Asset form works
- Asset refresh works
- Delete action works

## Findings

Check:

- Findings page opens
- Findings appear
- Severity is displayed
- Status is displayed

## Risk Analysis

Check:

- Risk page opens
- Asset risk is displayed
- Risk score appears
- Risk level appears
- Recalculate works

## System

Check:

- API Server status
- Risk Engine status
- Database status
- Platform status
- Swagger link

---

# 24. API Offline Test

The frontend should handle backend failure gracefully.

### Step 1

Stop the FastAPI server.

For example, in the terminal running Uvicorn:

```text
Ctrl + C
```

### Step 2

Refresh the frontend.

The dashboard should show:

```text
API Offline
```

### Step 3

Start the backend again:

```powershell
uvicorn app.main:app --reload
```

### Step 4

Refresh the dashboard.

Expected:

```text
API Connected
```

---

# 25. Common Problems

## Problem: `ModuleNotFoundError: No module named 'app'`

Make sure the current directory is:

```text
C:\xampp\htdocs\AegisOne\backend
```

Then run:

```powershell
python -c "from app.main import app; print([r.path for r in app.routes])"
```

---

## Problem: `Unable to connect to the remote server`

This normally means the FastAPI server is not running.

Start:

```powershell
uvicorn app.main:app --reload
```

Then retry:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

---

## Problem: `404 Not Found`

First inspect registered routes:

```powershell
python -c "from app.main import app; print([(r.path, sorted(r.methods)) for r in app.routes])"
```

Never assume an endpoint exists just because it is written in frontend code.

---

## Problem: Frontend says API Offline

Check:

1. FastAPI is running.
2. Port `8000` is available.
3. `/health` works.
4. `API_BASE` in `app.js` is correct.
5. Browser console for CORS/network errors.

---

## Problem: Frontend does not update

Try a hard refresh:

```text
Ctrl + Shift + R
```

This forces the browser to reload the latest JavaScript and CSS.

---

# 26. Development Workflow

Recommended workflow:

```text
Start Project
     │
     ▼
Activate .venv
     │
     ▼
Start FastAPI
     │
     ▼
Verify /health
     │
     ▼
Start Frontend
     │
     ▼
Verify Dashboard
     │
     ▼
Develop / Test
     │
     ▼
Run API Verification
     │
     ▼
Commit Changes
```

---

# 27. Safe Development Practices

Before making major changes:

1. Save all files.
2. Create a backup.
3. Confirm the backend is working.
4. Make one logical change at a time.
5. Test the changed feature.
6. Run regression checks.
7. Commit successful changes.

Avoid changing multiple core modules simultaneously without testing.

---

# 28. Production Considerations

The current setup is intended for local development.

Production deployment should additionally configure:

- Environment variables
- Production database
- HTTPS
- Authentication
- Authorization
- Secure CORS
- Logging
- Monitoring
- Rate limiting
- Secret management
- Backups
- Container security
- Dependency scanning

Development addresses such as:

```text
127.0.0.1
localhost
```

should not be used as production service addresses.

---

# 29. Quick Start

For experienced developers:

### Terminal 1 — Backend

```powershell
cd C:\xampp\htdocs\AegisOne\backend
..\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

### Terminal 2 — Frontend

Open:

```text
frontend/index.html
```

with VS Code Live Server.

### Verify

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

Then open:

```text
http://127.0.0.1:8000/docs
```

and:

```text
http://127.0.0.1:5500/frontend/index.html
```

---

# 30. Setup Completion Checklist

```text
[ ] Python installed
[ ] Virtual environment activated
[ ] Backend dependencies installed
[ ] FastAPI server started
[ ] /health verified
[ ] Swagger verified
[ ] Frontend opened
[ ] Dashboard verified
[ ] Assets verified
[ ] Findings verified
[ ] Risk Analysis verified
[ ] System page verified
[ ] API Offline behavior verified
[ ] Changes backed up
[ ] Changes committed to Git
```

---

# 31. Final Verification

AegisOne should be considered ready for local development when:

```text
Backend             🟢 Running
Health API          🟢 Working
Assets API          🟢 Working
Risk API            🟢 Working
Findings API        🟢 Working
Frontend             🟢 Working
Dashboard            🟢 Working
Navigation            🟢 Working
Risk Analysis        🟢 Working
API Offline Handling 🟢 Working
```

This setup guide describes the current local development workflow and should be updated whenever the project architecture or development commands change.
