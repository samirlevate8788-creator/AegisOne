# AegisOne Database

The AegisOne database layer stores security assets, risk information,
and security findings used by the platform.

## Architecture

AegisOne uses:

- SQLite for the development database
- SQLAlchemy for database interaction
- Relational tables for assets and findings

## Schema

```text
assets
  │
  │ 1-to-many
  ▼
findings
