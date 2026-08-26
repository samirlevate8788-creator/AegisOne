# AegisOne API Reference

## Overview

AegisOne exposes a REST API through the FastAPI backend.

### Development Base URL

```text
http://127.0.0.1:8000
```

### Interactive API Documentation

```text
http://127.0.0.1:8000/docs
```

### OpenAPI Specification

```text
http://127.0.0.1:8000/openapi.json
```

---

# API Design

The API follows standard HTTP methods:

| Method | Purpose |
|---|---|
| GET | Retrieve resources |
| POST | Create or process resources |
| DELETE | Remove resources |

Responses are returned as JSON.

---

# 1. Health API

## GET `/health`

Checks whether the AegisOne backend is operational.

### Request

```http
GET /health
```

### Example PowerShell

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

### Example Response

```json
{
  "status": "healthy",
  "service": "AegisOne API",
  "version": "1.0.0"
}
```

### Expected Status

```text
200 OK
```

---

# 2. Root API

## GET `/`

Returns basic AegisOne API information.

### Request

```http
GET /
```

### Example Response

```json
{
  "project": "AegisOne",
  "status": "online",
  "version": "1.0.0",
  "docs": "/docs"
}
```

---

# 3. API Information

## GET `/api/info`

Returns information about the AegisOne API.

### Request

```http
GET /api/info
```

### Example

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/info
```

---

# 4. Asset API

The Asset API manages digital assets monitored by AegisOne.

---

## GET `/api/assets/`

Returns the registered assets.

### Request

```http
GET /api/assets/
```

### Example

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/assets/
```

### Response Structure

The endpoint returns:

```text
success
total
assets
```

An asset contains information such as:

```text
id
name
type
target
environment
status
risk_score
```

### Example

```json
{
  "success": true,
  "total": 1,
  "assets": [
    {
      "id": 1,
      "name": "AegisOne Test Server",
      "type": "server",
      "target": "192.168.1.100",
      "environment": "development",
      "status": "active",
      "risk_score": 45
    }
  ]
}
```

---

# 5. Create Asset

## POST `/api/assets/`

Creates a new security asset.

### Request

```http
POST /api/assets/
Content-Type: application/json
```

### Request Body

```json
{
  "name": "Verification Server",
  "type": "server",
  "target": "10.0.0.50",
  "environment": "staging"
}
```

### PowerShell

```powershell
$body = @{
    name = "Verification Server"
    type = "server"
    target = "10.0.0.50"
    environment = "staging"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "http://127.0.0.1:8000/api/assets/" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Expected Response

```json
{
  "success": true,
  "message": "Asset created successfully",
  "asset": {
    "id": 2,
    "name": "Verification Server",
    "type": "server",
    "target": "10.0.0.50",
    "environment": "staging"
  }
}
```

---

# 6. Delete Asset

## DELETE `/api/assets/{asset_id}`

Deletes a registered asset.

### Example

```http
DELETE /api/assets/2
```

### PowerShell

```powershell
Invoke-RestMethod `
    -Uri "http://127.0.0.1:8000/api/assets/2" `
    -Method DELETE
```

### Expected Result

The asset is removed from the asset inventory.

---

# 7. Risk API

The Risk API provides aggregate security risk information and asset-level risk calculation.

---

## GET `/api/risk/`

Returns the overall risk posture.

### Request

```http
GET /api/risk/
```

### PowerShell

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/risk/
```

### Example Response

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

### Response Fields

| Field | Description |
|---|---|
| `success` | Indicates successful API execution |
| `total_assets` | Number of monitored assets |
| `critical` | Number of critical-risk assets |
| `high` | Number of high-risk assets |
| `average` | Average risk score |
| `average_risk` | Average risk score |

---

# 8. Calculate Asset Risk

## POST `/api/risk/{asset_id}`

Calculates the security risk for a specific asset.

### Request

```http
POST /api/risk/2
```

### PowerShell

```powershell
Invoke-RestMethod `
    -Uri "http://127.0.0.1:8000/api/risk/2" `
    -Method POST
```

### Example Response

```json
{
  "success": true,
  "message": "Risk calculated successfully",
  "asset_id": 2,
  "risk_score": 45,
  "risk_level": "medium"
}
```

### Risk Levels

```text
low
medium
high
critical
```

---

# 9. Security Findings API

## GET `/api/findings/`

Returns security findings identified by AegisOne.

### Request

```http
GET /api/findings/
```

### PowerShell

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/findings/
```

### Example Response

```json
{
  "success": true,
  "total": 1,
  "critical": 0,
  "high": 0,
  "medium": 1,
  "low": 0,
  "findings": [
    {
      "id": 1,
      "title": "Security Configuration Review",
      "severity": "medium",
      "status": "open",
      "asset": "AegisOne Test Server",
      "description": "Security configuration requires review."
    }
  ]
}
```

---

# 10. Finding Severity

AegisOne findings use severity classifications.

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Severity should be interpreted as an indicator of the potential security impact of the finding.

---

# 11. Error Responses

FastAPI may return standard HTTP error responses.

### Example

```json
{
  "detail": "Not Found"
}
```

This occurs when a requested endpoint does not exist.

For example, the current risk calculation endpoint is:

```text
POST /api/risk/{asset_id}
```

and not:

```text
POST /api/risk/{asset_id}/calculate
```

---

# 12. HTTP Status Codes

Common responses include:

| Status | Meaning |
|---|---|
| `200` | Successful request |
| `201` | Resource created, when applicable |
| `400` | Invalid request |
| `404` | Resource or endpoint not found |
| `422` | Validation error |
| `500` | Internal server error |

The exact response depends on the endpoint implementation.

---

# 13. CORS

The development frontend runs separately from the FastAPI backend.

Development origins currently include:

```text
http://127.0.0.1:5500
http://localhost:5500
```

This allows the browser-based frontend to communicate with the local API during development.

Production deployments should use a restricted CORS policy appropriate to the deployed frontend.

---

# 14. Frontend API Flow

The frontend uses the backend APIs as follows:

```text
Dashboard
    │
    ├── GET /health
    │
    ├── GET /api/assets/
    │
    ├── GET /api/risk/
    │
    └── GET /api/findings/
    │
    ▼
Dashboard Data
```

Asset risk calculation:

```text
User
 │
 ▼
Risk Analysis
 │
 ▼
POST /api/risk/{asset_id}
 │
 ▼
Risk Engine
 │
 ▼
Risk Score + Risk Level
 │
 ▼
Frontend
```

---

# 15. API Verification

The following endpoints have been manually verified during development:

```text
GET  /health                 🟢 PASS
GET  /api/info               🟢 PASS
GET  /api/assets/            🟢 PASS
POST /api/assets/            🟢 PASS
GET  /api/risk/              🟢 PASS
POST /api/risk/{asset_id}    🟢 PASS
GET  /api/findings/          🟢 PASS
DELETE /api/assets/{id}      🟢 PASS
```

---

# 16. Swagger Testing

AegisOne exposes interactive FastAPI documentation.

Open:

```text
http://127.0.0.1:8000/docs
```

Swagger can be used to inspect and test the available endpoints.

Recommended workflow:

```text
Open Swagger
     │
     ▼
Select Endpoint
     │
     ▼
Try it out
     │
     ▼
Send Request
     │
     ▼
Inspect Response
```

---

# 17. API Security Considerations

The current local development API is not intended to be exposed directly to the public internet.

Before production deployment, implement:

- Authentication
- Authorization
- HTTPS
- Rate limiting
- Secure CORS
- Request validation
- API logging
- Secret management
- Audit logging
- Security headers
- Dependency security scanning

---

# 18. API Design Principles

AegisOne follows these principles:

### Consistent Resource Paths

Resources use predictable API paths.

### HTTP Methods

HTTP methods represent operations:

```text
GET     → Retrieve
POST    → Create / Calculate
DELETE  → Remove
```

### JSON

API requests and responses use JSON where applicable.

### Separation

The API layer remains separate from frontend presentation.

### Extensibility

Additional endpoints can be introduced as the platform grows.

---

# 19. Future API Extensions

Potential future endpoints include:

```text
POST /api/auth/login
GET  /api/users/
GET  /api/assets/{asset_id}
PUT  /api/assets/{asset_id}
POST /api/findings/
PATCH /api/findings/{finding_id}
GET  /api/threat-intelligence/
POST /api/ai/analyze
POST /api/ai/recommend
GET  /api/audit-logs/
```

These endpoints are **future architecture ideas and are not currently claimed as implemented**.

---

# 20. API Versioning

The current API is:

```text
AegisOne API v1.0.0
```

Future production APIs may use versioned routes such as:

```text
/api/v1/assets/
/api/v1/risk/
/api/v1/findings/
```

Versioning can help maintain backward compatibility as the platform evolves.

---

# 21. Development Base URL

For local development:

```text
http://127.0.0.1:8000
```

For production, the base URL should be configured through environment-specific configuration rather than hard-coded frontend values.

---

# 22. Summary

AegisOne currently provides a functional REST API for:

```text
Health Monitoring
      │
      ▼
Asset Management
      │
      ▼
Risk Analysis
      │
      ▼
Security Findings
      │
      ▼
Security Dashboard
```

The API architecture provides the foundation for future AI-assisted analysis, threat intelligence, automation, authentication, and production security controls.
