# AegisOne AI Risk Engine

The AegisOne AI Risk Engine provides defensive security-risk analysis
for the AegisOne cybersecurity platform.

## Purpose

The engine supports:

- Risk-score classification
- Security severity analysis
- Defensive recommendations
- Security posture assessment

## Risk Levels

| Score | Level |
|---:|---|
| 0–24 | Low |
| 25–49 | Medium |
| 50–74 | High |
| 75–100 | Critical |

## Components

```text
ai-engine/
├── README.md
├── ai_config.json
└── risk_analyzer.py
