# AegisOne Testing Guide

## 1. Overview

Testing is an important part of the AegisOne development workflow.

The testing strategy covers:

- Backend API verification
- Asset management
- Risk calculation
- Security findings
- Frontend integration
- Error handling
- Regression testing
- Future automated testing

The goal is to ensure that changes to one component do not silently break another component.

---

# 2. Testing Strategy

AegisOne uses multiple levels of testing:

```text
                    Testing
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Unit Tests   API Tests   Integration
          │            │            │
          └────────────┼────────────┘
                       ▼
                 System Testing
                       │
                       ▼
               Manual UI Testing
```

---

# 3. Test Categories

## 3.1 Unit Testing

Unit tests verify individual functions or components independently.

Examples:

- Risk calculation
- Severity classification
- Asset validation
- Utility functions

Future unit tests should be implemented using:

```text
pytest
```

---

# 4. API Testing

API testing verifies that FastAPI endpoints return the expected responses.

Current API test targets:

```text
GET  /
GET  /health
GET  /api/info
GET  /api/assets/
POST /api/assets/
DELETE /api/assets/{id}
GET  /api/risk/
POST /api/risk/{id}
GET  /api/findings/
```

---

# 5. Health API Test

## Endpoint

```http
GET /health
```

## Command

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

## Expected Result

```text
status   service       version
------   -------       -------
healthy  AegisOne API  1.0.0
```

### Test Status

```text
🟢 PASS
```

---

# 6. Root API Test

## Endpoint

```http
GET /
```

## Command

```powershell
Invoke-RestMethod http://127.0.0.1:8000/
```

Expected project information should be returned.

### Test Status

```text
🟢 PASS
```

---

# 7. API Information Test

## Endpoint

```http
GET /api/info
```

## Command

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/info
```

The response should contain AegisOne API information.

### Test Status

```text
🟢 PASS
```

---

# 8. Asset API Tests

## 8.1 List Assets

```http
GET /api/assets/
```

Command:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/assets/
```

Verify:

- Request succeeds
- `success` is `True`
- Asset collection is returned
- Total count is correct

---

## 8.2 Create Asset

Create a temporary verification asset.

```powershell
$body = @{
    name = "Verification Server"
    type = "server"
    target = "10.0.0.50"
    environment = "staging"
} | ConvertTo-Json
```

Send request:

```powershell
$response = Invoke-RestMethod `
    -Uri "http://127.0.0.1:8000/api/assets/" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

Verify:

```powershell
$response
```

Expected:

```text
success : True
message : Asset created successfully
```

---

# 9. Asset Validation Tests

Asset creation should be tested with valid and invalid inputs.

### Valid example

```json
{
  "name": "Test Server",
  "type": "server",
  "target": "10.0.0.10",
  "environment": "development"
}
```

### Invalid examples

Missing name:

```json
{
  "type": "server",
  "target": "10.0.0.10",
  "environment": "development"
}
```

Missing target:

```json
{
  "name": "Test Server",
  "type": "server",
  "environment": "development"
}
```

Invalid type:

```json
{
  "name": "Test Server",
  "type": "unknown",
  "target": "10.0.0.10",
  "environment": "development"
}
```

These cases should be covered by automated validation tests as the API validation layer expands.

---

# 10. Risk API Tests

## 10.1 Risk Overview

Endpoint:

```http
GET /api/risk/
```

Command:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/risk/
```

Expected fields:

```text
success
total_assets
critical
high
average
average_risk
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

### Test Status

```text
🟢 PASS
```

---

# 11. Asset Risk Calculation

## Endpoint

```http
POST /api/risk/{asset_id}
```

Example:

```powershell
Invoke-RestMethod `
    -Uri "http://127.0.0.1:8000/api/risk/2" `
    -Method POST
```

Expected response:

```text
success    : True
message    : Risk calculated successfully
asset_id   : 2
risk_score : 45
risk_level : medium
```

### Test Status

```text
🟢 PASS
```

---

# 12. Important Endpoint Regression Test

A previous development mistake involved calling:

```text
/api/risk/2/calculate
```

The registered endpoint is:

```text
/api/risk/{asset_id}
```

Therefore:

```text
POST /api/risk/2
```

is correct.

While:

```text
POST /api/risk/2/calculate
```

returns:

```json
{
  "detail": "Not Found"
}
```

This should remain documented as a regression case to prevent incorrect frontend/API integration.

---

# 13. Findings API Tests

## Endpoint

```http
GET /api/findings/
```

Command:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/findings/
```

Expected fields include:

```text
success
total
critical
high
medium
low
findings
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

### Test Status

```text
🟢 PASS
```

---

# 14. Delete Asset Test

After creating a temporary asset, remove it.

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

Confirm that the deleted asset is no longer returned.

---

# 15. Frontend Testing

The frontend should be tested through the browser.

## Dashboard

Verify:

```text
[ ] Dashboard loads
[ ] API status loads
[ ] Total assets displayed
[ ] Critical count displayed
[ ] High-risk count displayed
[ ] Average risk displayed
[ ] Risk distribution displayed
[ ] Findings displayed
[ ] Asset overview displayed
```

---

# 16. Navigation Tests

Verify each navigation item:

```text
[ ] Dashboard
[ ] Assets
[ ] Findings
[ ] Risk Analysis
[ ] System
```

Each section should become visible without a full page reload.

---

# 17. Asset UI Tests

Test the following:

```text
[ ] Open Assets page
[ ] Asset table loads
[ ] Add Asset form appears
[ ] Enter asset information
[ ] Submit form
[ ] Success message appears
[ ] New asset appears
[ ] Refresh works
[ ] Delete action works
```

---

# 18. Findings UI Tests

Verify:

```text
[ ] Findings page loads
[ ] Total findings displayed
[ ] Critical count displayed
[ ] High count displayed
[ ] Open findings displayed
[ ] Finding table loads
[ ] Severity displayed
[ ] Status displayed
[ ] Description displayed
```

---

# 19. Risk UI Tests

Verify:

```text
[ ] Risk Analysis page opens
[ ] Risk data loads
[ ] Asset risk appears
[ ] Risk score appears
[ ] Risk level appears
[ ] Recalculate button works
```

---

# 20. System UI Tests

Verify:

```text
[ ] System page opens
[ ] API Server status appears
[ ] Risk Engine status appears
[ ] Database status appears
[ ] Platform status appears
[ ] API URL appears
[ ] Swagger link works
```

---

# 21. Refresh Testing

The dashboard refresh button should reload the latest API data.

Test:

```text
1. Open Dashboard
2. Record asset count
3. Add an asset through API/UI
4. Click Refresh
5. Verify asset count changes
6. Verify risk information updates
7. Verify findings update
```

---

# 22. API Offline Testing

This verifies graceful failure handling.

## Step 1

Stop FastAPI:

```text
Ctrl + C
```

## Step 2

Refresh the frontend.

Expected:

```text
🔴 API Offline
```

The UI should remain usable rather than crashing.

## Step 3

Restart:

```powershell
uvicorn app.main:app --reload
```

## Step 4

Refresh frontend.

Expected:

```text
🟢 API Connected
```

---

# 23. Browser Console Testing

Open browser developer tools:

```text
F12
```

Check:

```text
Console
Network
```

Look for:

- JavaScript errors
- Failed API requests
- CORS errors
- 404 responses
- 500 responses

Successful API requests should appear in the Network tab.

---

# 24. Integration Testing

Integration tests verify interaction between multiple components.

Example:

```text
Frontend
   │
   ▼
Asset API
   │
   ▼
Asset Storage
   │
   ▼
Risk API
   │
   ▼
Risk Engine
   │
   ▼
Frontend Dashboard
```

A complete integration test should verify that changes propagate correctly through the system.

---

# 25. Regression Testing

Regression testing ensures previously working functionality remains functional after changes.

Before committing major changes, verify:

```text
[ ] /health
[ ] /api/info
[ ] /api/assets/
[ ] POST /api/assets/
[ ] /api/risk/
[ ] POST /api/risk/{id}
[ ] /api/findings/
[ ] Frontend navigation
[ ] Dashboard refresh
[ ] Asset creation
[ ] Asset deletion
```

---

# 26. Automated Testing with Pytest

The future automated test structure is:

```text
tests/
├── __init__.py
├── conftest.py
├── test_health.py
├── test_assets.py
├── test_risk.py
├── test_findings.py
└── test_integration.py
```

---

# 27. Example Pytest Test

A basic health test can follow this structure:

```python
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health():
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "healthy"
```

This example should be added to the actual test suite only after confirming the project's current test configuration and dependency setup.

---

# 28. Running Automated Tests

Once pytest is configured:

```powershell
pytest
```

Verbose mode:

```powershell
pytest -v
```

Run a specific test file:

```powershell
pytest tests/test_health.py -v
```

Run a specific test:

```powershell
pytest tests/test_health.py::test_health -v
```

---

# 29. Test Coverage

Future coverage measurement can use:

```powershell
pytest --cov=app
```

Coverage should eventually include:

```text
API routes
Risk engine
Asset operations
Finding operations
Validation
Error handling
Integration flows
```

High coverage alone does not guarantee security or correctness. Tests should focus on meaningful application behavior.

---

# 30. Test Data

Testing should use isolated test data whenever possible.

Recommended:

```text
Development Data
       │
       ├── Local Development
       │
       └── Manual Verification

Test Data
       │
       ├── Unit Tests
       ├── API Tests
       └── Integration Tests
```

Production data should never be used directly for automated testing.

---

# 31. Security Testing

Future security testing should include:

- Input validation
- Authentication testing
- Authorization testing
- CORS validation
- Rate-limit testing
- Dependency scanning
- Secret detection
- API abuse testing
- Injection resistance
- Access-control testing

Only authorized systems and environments should be used for security testing.

---

# 32. CI Testing

The future GitHub Actions pipeline should execute:

```text
Git Push
   │
   ▼
Install Dependencies
   │
   ▼
Lint
   │
   ▼
Unit Tests
   │
   ▼
API Tests
   │
   ▼
Integration Tests
   │
   ▼
Build Verification
```

A failed test should prevent the pipeline from being considered successful.

---

# 33. Test Result Matrix

| Area | Current Verification |
|---|---|
| Health API | 🟢 PASS |
| Root API | 🟢 PASS |
| API Info | 🟢 PASS |
| Assets API | 🟢 PASS |
| Asset Creation | 🟢 PASS |
| Risk Overview | 🟢 PASS |
| Risk Calculation | 🟢 PASS |
| Findings API | 🟢 PASS |
| Asset Deletion | 🟢 PASS |
| Dashboard | 🟢 PASS |
| Navigation | 🟢 PASS |
| API Offline Handling | 🟡 Manual verification |
| Automated Pytest Suite | 🟡 Expansion |
| CI Testing | 🟡 Planned |
| Security Testing | 🟡 Planned |

---

# 34. Pre-Commit Checklist

Before committing code:

```text
[ ] Code saved
[ ] No obvious syntax errors
[ ] Backend starts successfully
[ ] /health returns 200
[ ] Assets API works
[ ] Risk API works
[ ] Findings API works
[ ] Frontend loads
[ ] Navigation works
[ ] Changed feature manually tested
[ ] Regression checks completed
[ ] No accidental secrets committed
```

---

# 35. Test Philosophy

AegisOne testing follows these principles:

### Test behavior, not implementation

Tests should verify what the application does rather than depend unnecessarily on internal implementation details.

### Fail fast

Critical failures should be detected as early as possible.

### Repeatability

Tests should produce consistent results.

### Isolation

Tests should avoid depending on unrelated external state.

### Regression protection

Previously fixed issues should have tests where practical.

### Security awareness

Security-sensitive behavior should receive additional verification.

---

# 36. Definition of Done

A feature should be considered complete when:

```text
Implementation
      │
      ▼
Manual Verification
      │
      ▼
Automated Test
      │
      ▼
Regression Test
      │
      ▼
Documentation
      │
      ▼
Code Review
      │
      ▼
Commit
```

---

# 37. Final Testing Goal

The long-term testing architecture for AegisOne is:

```text
             ┌──────────────────────┐
             │   Automated Tests    │
             └──────────┬───────────┘
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
     Unit Tests      API Tests      Integration
        │               │                │
        └───────────────┼────────────────┘
                        ▼
                Security Testing
                        │
                        ▼
                  CI Verification
                        │
                        ▼
                 Production Ready
```

The objective is to make every important AegisOne component independently testable, reproducible, and protected against regressions.
