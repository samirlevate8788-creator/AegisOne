-- ============================================================
-- AegisOne Database Schema
-- Version: 1.0.0
-- ============================================================

CREATE TABLE IF NOT EXISTS assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    target VARCHAR(255) NOT NULL,
    environment VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    risk_score INTEGER DEFAULT 0,
    risk_level VARCHAR(50) DEFAULT 'low'
);

CREATE TABLE IF NOT EXISTS findings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    asset_id INTEGER,
    description TEXT,
    recommendation TEXT,
    FOREIGN KEY (asset_id) REFERENCES assets(id)
);

CREATE INDEX IF NOT EXISTS idx_assets_risk_score
ON assets(risk_score);

CREATE INDEX IF NOT EXISTS idx_findings_severity
ON findings(severity);

CREATE INDEX IF NOT EXISTS idx_findings_status
ON findings(status);
