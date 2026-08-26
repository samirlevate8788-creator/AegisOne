/* =========================================================
   AEGISONE - FRONTEND APPLICATION
   Full Dashboard JavaScript
   ========================================================= */

"use strict";

/* =========================================================
   API CONFIGURATION
   ========================================================= */

const API_BASE = "https://aegisone-rngk.onrender.com";


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let currentSection = "dashboard";

let assetsCache = [];
let findingsCache = [];
let riskCache = null;


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("AegisOne frontend initialized");

    initializeNavigation();
    initializeButtons();

    checkBackendHealth();

    loadDashboard();

});


/* =========================================================
   NAVIGATION
   ========================================================= */

function initializeNavigation() {

    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(item => {

        item.addEventListener("click", () => {

            const section = item.dataset.section;

            if (section) {
                showSection(section);
            }

        });

    });

}


/* =========================================================
   BUTTON INITIALIZATION
   ========================================================= */

function initializeButtons() {

    const refreshButtons = document.querySelectorAll(
        '[onclick="refreshDashboard()"]'
    );

    refreshButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            refreshDashboard();

        });

    });

}


/* =========================================================
   SHOW SECTION
   ========================================================= */

function showSection(section) {

    currentSection = section;

    const sections = document.querySelectorAll(".page-section");

    sections.forEach(page => {

        page.classList.remove("active-section");

    });


    const targetSection =
        document.getElementById(`${section}Section`);

    if (targetSection) {

        targetSection.classList.add("active-section");

    }


    /* -----------------------------------------
       Update navigation active state
       ----------------------------------------- */

    const navItems =
        document.querySelectorAll(".nav-item");

    navItems.forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.section === section
        );

    });


    /* -----------------------------------------
       Update page title
       ----------------------------------------- */

    const pageTitle =
        document.getElementById("pageTitle");

    const pageEyebrow =
        document.getElementById("pageEyebrow");


    const titles = {

        dashboard: {
            eyebrow: "SECURITY OPERATIONS",
            title: "Security Dashboard"
        },

        assets: {
            eyebrow: "ASSET MANAGEMENT",
            title: "Security Assets"
        },

        findings: {
            eyebrow: "SECURITY INTELLIGENCE",
            title: "Security Findings"
        },

        risk: {
            eyebrow: "RISK ENGINE",
            title: "Risk Analysis"
        },

        system: {
            eyebrow: "PLATFORM",
            title: "System Status"
        }

    };


    const data =
        titles[section] || titles.dashboard;


    if (pageTitle) {
        pageTitle.textContent = data.title;
    }

    if (pageEyebrow) {
        pageEyebrow.textContent = data.eyebrow;
    }


    /* -----------------------------------------
       Load section-specific data
       ----------------------------------------- */

    if (section === "dashboard") {

        loadDashboard();

    }

    else if (section === "assets") {

        loadAssets();

    }

    else if (section === "findings") {

        loadFindings();

    }

    else if (section === "risk") {

        loadRiskOverview();

    }

    else if (section === "system") {

        checkBackendHealth();

    }


    /* -----------------------------------------
       Close mobile sidebar
       ----------------------------------------- */

    const sidebar =
        document.getElementById("sidebar");

    if (sidebar) {

        sidebar.classList.remove("sidebar-open");

    }

}


/* =========================================================
   SIDEBAR TOGGLE
   ========================================================= */

function toggleSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    if (!sidebar) return;

    sidebar.classList.toggle("sidebar-open");

}


/* =========================================================
   API REQUEST HELPER
   ========================================================= */

async function apiRequest(
    endpoint,
    options = {}
) {

    const url = `${API_BASE}${endpoint}`;

    const response =
        await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        });


    let data = null;

    try {

        data = await response.json();

    } catch {

        data = null;

    }


    if (!response.ok) {

        const message =
            data?.detail ||
            data?.message ||
            `API Error: ${response.status}`;

        throw new Error(message);

    }


    return data;

}


/* =========================================================
   BACKEND HEALTH
   ========================================================= */

async function checkBackendHealth() {

    updateConnectionStatus(
        "checking",
        "Checking API..."
    );


    const apiStatus =
        document.getElementById("apiServerStatus");

    if (apiStatus) {

        apiStatus.textContent = "CHECKING";

    }


    try {

        const data =
            await apiRequest("/health");


        if (
            data &&
            (
                data.status === "healthy" ||
                data.status === "online"
            )
        ) {

            updateConnectionStatus(
                "online",
                "API Connected"
            );


            if (apiStatus) {

                apiStatus.textContent = "ONLINE";

                apiStatus.className =
                    "system-online";

            }

            showToast(
                "AegisOne API connected successfully.",
                "success"
            );

            return true;

        }


        throw new Error("Unexpected health response");

    }

    catch (error) {

        console.error(
            "Backend health check failed:",
            error
        );


        updateConnectionStatus(
            "offline",
            "API Offline"
        );


        if (apiStatus) {

            apiStatus.textContent = "OFFLINE";

            apiStatus.className =
                "system-offline";

        }


        showToast(
            "AegisOne API is offline.",
            "error"
        );

        return false;

    }

}


/* =========================================================
   CONNECTION STATUS UI
   ========================================================= */

function updateConnectionStatus(
    status,
    text
) {

    const connection =
        document.getElementById(
            "connectionStatus"
        );

    const connectionText =
        document.getElementById(
            "connectionText"
        );


    if (connection) {

        connection.classList.remove(
            "online",
            "offline",
            "checking"
        );

        connection.classList.add(status);

    }


    if (connectionText) {

        connectionText.textContent = text;

    }


    /* Sidebar status */

    const sidebarStatus =
        document.querySelector(
            ".security-indicator strong"
        );

    const sidebarText =
        document.querySelector(
            ".security-indicator small"
        );


    if (sidebarStatus) {

        if (status === "online") {

            sidebarStatus.textContent =
                "System Online";

        }

        else if (status === "offline") {

            sidebarStatus.textContent =
                "System Offline";

        }

        else {

            sidebarStatus.textContent =
                "Checking System";

        }

    }


    if (sidebarText) {

        sidebarText.textContent =
            status === "online"
                ? "API connected"
                : status === "offline"
                    ? "API unavailable"
                    : "Checking API...";

    }

}


/* =========================================================
   REFRESH DASHBOARD
   ========================================================= */

async function refreshDashboard() {

    showToast(
        "Refreshing AegisOne dashboard...",
        "info"
    );


    await checkBackendHealth();

    await loadDashboard();


    showToast(
        "Dashboard refreshed.",
        "success"
    );

}


/* =========================================================
   LOAD DASHBOARD
   ========================================================= */

async function loadDashboard() {

    try {

        await Promise.all([
            loadAssets(true),
            loadRiskSummary(true),
            loadFindings(true)
        ]);

    }

    catch (error) {

        console.error(
            "Dashboard loading failed:",
            error
        );

    }

}


/* =========================================================
   LOAD ASSETS
   ========================================================= */

async function loadAssets(silent = false) {

    const tbody =
        document.getElementById("assetList");


    if (tbody && !silent) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="table-empty">
                    Loading assets...
                </td>
            </tr>
        `;

    }


    try {

        const data =
            await apiRequest("/api/assets/");


        assetsCache =
            normalizeAssets(data);


        renderAssetsTable();
        renderDashboardAssets();
        updateAssetCounters();


        return assetsCache;

    }

    catch (error) {

        console.error(
            "Asset loading failed:",
            error
        );


        if (tbody) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="table-empty">
                        Unable to load assets.
                    </td>
                </tr>
            `;

        }


        if (!silent) {

            showToast(
                "Failed to load assets.",
                "error"
            );

        }


        return [];

    }

}


/* =========================================================
   NORMALIZE ASSET RESPONSE
   ========================================================= */

function normalizeAssets(data) {

    if (Array.isArray(data)) {

        return data;

    }


    if (Array.isArray(data?.assets)) {

        return data.assets;

    }


    if (Array.isArray(data?.data)) {

        return data.data;

    }


    return [];

}


/* =========================================================
   UPDATE ASSET COUNTERS
   ========================================================= */

function updateAssetCounters() {

    const total =
        assetsCache.length;


    setText(
        "totalAssets",
        total
    );


    const badge =
        document.getElementById(
            "assetCountBadge"
        );


    if (badge) {

        badge.textContent =
            `${total} Asset${total === 1 ? "" : "s"}`;

    }

}


/* =========================================================
   RENDER ASSET TABLE
   ========================================================= */

function renderAssetsTable() {

    const tbody =
        document.getElementById("assetList");


    if (!tbody) return;


    if (!assetsCache.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="table-empty">
                    No assets registered.
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML =
        assetsCache.map(asset => {

            const risk =
                getAssetRisk(asset);


            return `
                <tr>

                    <td>
                        <strong>
                            ${escapeHtml(
                                asset.name ||
                                "Unnamed Asset"
                            )}
                        </strong>
                    </td>

                    <td>
                        ${escapeHtml(
                            asset.type ||
                            "-"
                        )}
                    </td>

                    <td>
                        <code>
                            ${escapeHtml(
                                asset.target ||
                                "-"
                            )}
                        </code>
                    </td>

                    <td>
                        ${escapeHtml(
                            asset.environment ||
                            "-"
                        )}
                    </td>

                    <td>
                        <span class="risk-badge ${getRiskClass(risk.level)}">
                            ${escapeHtml(
                                risk.label
                            )}
                        </span>
                    </td>

                    <td>
                        <span class="status-badge active">
                            ${escapeHtml(
                                String(
                                    asset.status ||
                                    "active"
                                ).toUpperCase()
                            )}
                        </span>
                    </td>

                    <td>

                        <div class="table-actions">

                            <button
                                type="button"
                                class="btn-small"
                                onclick="calculateAssetRisk(${Number(asset.id)})"
                            >
                                Analyze
                            </button>

                            <button
                                type="button"
                                class="btn-small danger"
                                onclick="deleteAsset(${Number(asset.id)})"
                            >
                                Delete
                            </button>

                        </div>

                    </td>

                </tr>
            `;

        }).join("");

}


/* =========================================================
   DASHBOARD ASSET OVERVIEW
   ========================================================= */

function renderDashboardAssets() {

    const container =
        document.getElementById(
            "dashboardAssetList"
        );


    if (!container) return;


    if (!assetsCache.length) {

        container.innerHTML = `
            <div class="empty-state">

                <span>â–£</span>

                <h4>
                    No assets registered
                </h4>

                <p>
                    Add your first asset to start
                    monitoring security risk.
                </p>

            </div>
        `;

        return;

    }


    container.innerHTML =
        assetsCache.map(asset => {

            const risk =
                getAssetRisk(asset);


            return `
                <div class="asset-preview-item">

                    <div>

                        <strong>
                            ${escapeHtml(
                                asset.name ||
                                "Unnamed Asset"
                            )}
                        </strong>

                        <small>
                            ${escapeHtml(
                                asset.target ||
                                "-"
                            )}
                        </small>

                    </div>

                    <span class="risk-badge ${getRiskClass(risk.level)}">
                        ${risk.label}
                    </span>

                </div>
            `;

        }).join("");

}


/* =========================================================
   GET ASSET RISK
   ========================================================= */

function getAssetRisk(asset) {

    const score =
        Number(
            asset.risk_score ??
            asset.riskScore ??
            0
        );


    let level =
        asset.risk_level ??
        asset.riskLevel ??
        "";


    if (!level) {

        if (score >= 80) {

            level = "critical";

        }

        else if (score >= 60) {

            level = "high";

        }

        else if (score >= 30) {

            level = "medium";

        }

        else {

            level = "low";

        }

    }


    return {
        score,
        level: String(level).toLowerCase(),
        label:
            `${score} Â· ${String(level).toUpperCase()}`
    };

}


/* =========================================================
   LOAD RISK SUMMARY
   ========================================================= */

async function loadRiskSummary(silent = false) {

    try {

        const data =
            await apiRequest("/api/risk/");


        riskCache = data;


        setText(
            "criticalAssets",
            data.critical ?? 0
        );


        setText(
            "highRisk",
            data.high ?? 0
        );


        const average =
            Number(
                data.average_risk ??
                data.average ??
                0
            );


        setText(
            "averageRisk",
            Number.isFinite(average)
                ? average
                : 0
        );


        setText(
            "riskScore",
            Math.round(average)
        );


        /* Risk distribution */

        setText(
            "criticalCount",
            data.critical ?? 0
        );

        setText(
            "highCount",
            data.high ?? 0
        );


        /*
         * The current API gives aggregate risk counts.
         * Medium/Low are calculated from available asset data.
         */

        const medium =
            assetsCache.filter(asset => {

                return getAssetRisk(asset).level === "medium";

            }).length;


        const low =
            assetsCache.filter(asset => {

                return getAssetRisk(asset).level === "low";

            }).length;


        setText(
            "mediumCount",
            medium
        );

        setText(
            "lowCount",
            low
        );


        return data;

    }

    catch (error) {

        console.error(
            "Risk summary loading failed:",
            error
        );


        if (!silent) {

            showToast(
                "Failed to load risk summary.",
                "error"
            );

        }


        return null;

    }

}


/* =========================================================
   LOAD RISK ANALYSIS PAGE
   ========================================================= */

async function loadRiskOverview() {

    const container =
        document.getElementById(
            "riskAssetList"
        );


    if (!container) {

        console.error(
            "riskAssetList not found"
        );

        return;

    }


    container.innerHTML = `
        <div class="empty-state">

            <span>â³</span>

            <h4>
                Loading risk analysis...
            </h4>

            <p>
                Calculating current security posture.
            </p>

        </div>
    `;


    try {

        /* -----------------------------------------
           Get assets
           ----------------------------------------- */

        const data =
            await apiRequest(
                "/api/assets/"
            );


        assetsCache =
            normalizeAssets(data);


        if (!assetsCache.length) {

            container.innerHTML = `
                <div class="empty-state">

                    <span>â—‰</span>

                    <h4>
                        No assets available
                    </h4>

                    <p>
                        Add an asset before calculating risk.
                    </p>

                </div>
            `;

            return;

        }


        /* -----------------------------------------
           Calculate risk for each asset
           IMPORTANT:
           Current backend route is:
           POST /api/risk/{asset_id}
           ----------------------------------------- */

        const results = [];


        for (const asset of assetsCache) {

            try {

                const risk =
                    await apiRequest(
                        `/api/risk/${asset.id}`,
                        {
                            method: "POST"
                        }
                    );


                results.push({
                    asset,
                    risk
                });


            }

            catch (error) {

                console.error(
                    `Risk calculation failed for asset ${asset.id}:`,
                    error
                );


                results.push({
                    asset,
                    risk: {
                        success: false,
                        risk_score:
                            asset.risk_score ?? 0,
                        risk_level:
                            asset.risk_level ?? "unknown"
                    }
                });

            }

        }


        riskCache =
            results;


        /* -----------------------------------------
           Render
           ----------------------------------------- */

        container.innerHTML =
            results.map(item => {

                const asset =
                    item.asset;

                const risk =
                    item.risk;


                const score =
                    Number(
                        risk.risk_score ??
                        asset.risk_score ??
                        0
                    );


                const level =
                    String(
                        risk.risk_level ??
                        asset.risk_level ??
                        getAssetRisk(asset).level ??
                        "unknown"
                    ).toLowerCase();


                const levelClass =
                    getRiskClass(level);


                return `
                    <div class="risk-asset-card">

                        <div class="risk-asset-main">

                            <div class="risk-asset-icon">
                                ðŸ›¡ï¸
                            </div>

                            <div class="risk-asset-info">

                                <h4>
                                    ${escapeHtml(
                                        asset.name ||
                                        "Unnamed Asset"
                                    )}
                                </h4>

                                <p>
                                    ${escapeHtml(
                                        asset.target ||
                                        "No target"
                                    )}
                                </p>

                                <small>
                                    ${escapeHtml(
                                        asset.environment ||
                                        "-"
                                    )}
                                </small>

                            </div>

                        </div>


                        <div class="risk-asset-score">

                            <span class="risk-score-label">
                                RISK SCORE
                            </span>

                            <strong>
                                ${score}
                            </strong>

                        </div>


                        <div class="risk-asset-level ${levelClass}">

                            ${escapeHtml(
                                level.toUpperCase()
                            )}

                        </div>

                    </div>
                `;

            }).join("");


        /* Update dashboard after calculation */

        await loadAssets(true);
        await loadRiskSummary(true);


        showToast(
            "Risk analysis updated successfully.",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Risk overview failed:",
            error
        );


        container.innerHTML = `
            <div class="empty-state">

                <span>âš ï¸</span>

                <h4>
                    Unable to load risk data
                </h4>

                <p>
                    Please check that the AegisOne API
                    is running and try again.
                </p>

            </div>
        `;


        showToast(
            "Risk analysis failed.",
            "error"
        );

    }

}


/* =========================================================
   CALCULATE SINGLE ASSET RISK
   ========================================================= */

async function calculateAssetRisk(assetId) {

    if (!assetId) {

        showToast(
            "Invalid asset ID.",
            "error"
        );

        return;

    }


    try {

        const data =
            await apiRequest(
                `/api/risk/${assetId}`,
                {
                    method: "POST"
                }
            );


        const score =
            data.risk_score ?? 0;

        const level =
            data.risk_level ?? "unknown";


        showModal(
            "Risk Analysis",
            `
                <div class="risk-result">

                    <div class="risk-result-icon">
                        ðŸ›¡ï¸
                    </div>

                    <h4>
                        Risk calculated successfully
                    </h4>

                    <div class="risk-result-score">
                        ${escapeHtml(score)}
                    </div>

                    <div class="risk-result-level">
                        ${escapeHtml(
                            String(level).toUpperCase()
                        )}
                    </div>

                </div>
            `
        );


        await loadAssets(true);
        await loadRiskSummary(true);


        if (currentSection === "risk") {

            await loadRiskOverview();

        }


    }

    catch (error) {

        console.error(
            "Asset risk calculation failed:",
            error
        );


        showToast(
            "Unable to calculate asset risk.",
            "error"
        );

    }

}


/* =========================================================
   LOAD FINDINGS
   ========================================================= */

async function loadFindings(silent = false) {

    const tbody =
        document.getElementById(
            "findingsList"
        );


    if (tbody && !silent) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="table-empty">
                    Loading findings...
                </td>
            </tr>
        `;

    }


    try {

        const data =
            await apiRequest(
                "/api/findings/"
            );


        findingsCache =
            Array.isArray(data)
                ? data
                : (
                    data.findings ||
                    data.data ||
                    []
                );


        renderFindings(
            findingsCache
        );


        updateFindingCounters(
            data
        );


        return findingsCache;

    }

    catch (error) {

        console.error(
            "Findings loading failed:",
            error
        );


        if (tbody) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="table-empty">
                        Unable to load findings.
                    </td>
                </tr>
            `;

        }


        if (!silent) {

            showToast(
                "Failed to load security findings.",
                "error"
            );

        }


        return [];

    }

}


/* =========================================================
   RENDER FINDINGS
   ========================================================= */

function renderFindings(findings) {

    const tbody =
        document.getElementById(
            "findingsList"
        );


    const recent =
        document.getElementById(
            "recentFindings"
        );


    if (!tbody) return;


    if (!findings.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="table-empty">
                    No security findings available.
                </td>
            </tr>
        `;

    }

    else {

        tbody.innerHTML =
            findings.map(finding => {

                return `
                    <tr>

                        <td>
                            <strong>
                                ${escapeHtml(
                                    finding.title ||
                                    "Security Finding"
                                )}
                            </strong>
                        </td>

                        <td>
                            <span class="severity-badge ${getSeverityClass(finding.severity)}">
                                ${escapeHtml(
                                    String(
                                        finding.severity ||
                                        "unknown"
                                    ).toUpperCase()
                                )}
                            </span>
                        </td>

                        <td>
                            <span class="status-badge">
                                ${escapeHtml(
                                    String(
                                        finding.status ||
                                        "open"
                                    ).toUpperCase()
                                )}
                            </span>
                        </td>

                        <td>
                            ${escapeHtml(
                                finding.description ||
                                "-"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                finding.recommendation ||
                                "Review and remediate the finding."
                            )}
                        </td>

                    </tr>
                `;

            }).join("");

    }


    /* -----------------------------------------
       Recent findings
       ----------------------------------------- */

    if (recent) {

        if (!findings.length) {

            recent.innerHTML = `
                <div class="empty-state small">

                    <span>âœ“</span>

                    <p>
                        No security findings available.
                    </p>

                </div>
            `;

        }

        else {

            recent.innerHTML =
                findings.slice(0, 5).map(
                    finding => {

                        return `
                            <div class="recent-finding">

                                <div>

                                    <strong>
                                        ${escapeHtml(
                                            finding.title ||
                                            "Security Finding"
                                        )}
                                    </strong>

                                    <small>
                                        ${escapeHtml(
                                            finding.asset ||
                                            "Unknown asset"
                                        )}
                                    </small>

                                </div>

                                <span class="severity-badge ${getSeverityClass(finding.severity)}">
                                    ${escapeHtml(
                                        String(
                                            finding.severity ||
                                            "unknown"
                                        ).toUpperCase()
                                    )}
                                </span>

                            </div>
                        `;

                    }
                ).join("");

        }

    }

}


/* =========================================================
   FINDING COUNTERS
   ========================================================= */

function updateFindingCounters(data) {

    const findings =
        findingsCache;


    const total =
        data?.total ??
        findings.length;


    const critical =
        data?.critical ??
        countSeverity(
            findings,
            "critical"
        );


    const high =
        data?.high ??
        countSeverity(
            findings,
            "high"
        );


    const open =
        countStatus(
            findings,
            "open"
        );


    setText(
        "totalFindings",
        total
    );


    setText(
        "openFindings",
        open
    );


    setText(
        "findingsTotalPage",
        total
    );


    setText(
        "findingsCriticalPage",
        critical
    );


    setText(
        "findingsHighPage",
        high
    );


    setText(
        "findingsOpenPage",
        open
    );

}


/* =========================================================
   CREATE ASSET
   ========================================================= */

async function createAsset(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "assetName"
        )?.value.trim();


    const type =
        document.getElementById(
            "assetType"
        )?.value;


    const target =
        document.getElementById(
            "assetTarget"
        )?.value.trim();


    const environment =
        document.getElementById(
            "assetEnvironment"
        )?.value;


    const message =
        document.getElementById(
            "assetMessage"
        );


    const button =
        document.getElementById(
            "createAssetButton"
        );


    if (!name || !type || !target || !environment) {

        showFormMessage(
            message,
            "Please fill all asset fields.",
            "error"
        );

        return;

    }


    if (button) {

        button.disabled = true;

        button.textContent =
            "Creating...";

    }


    try {

        const data =
            await apiRequest(
                "/api/assets/",
                {
                    method: "POST",
                    body: JSON.stringify({
                        name,
                        type,
                        target,
                        environment
                    })
                }
            );


        showFormMessage(
            message,
            data?.message ||
            "Asset created successfully.",
            "success"
        );


        showToast(
            "Asset created successfully.",
            "success"
        );


        resetAssetForm();


        await loadAssets(true);
        await loadRiskSummary(true);


    }

    catch (error) {

        console.error(
            "Asset creation failed:",
            error
        );


        showFormMessage(
            message,
            error.message ||
            "Failed to create asset.",
            "error"
        );


        showToast(
            "Failed to create asset.",
            "error"
        );

    }

    finally {

        if (button) {

            button.disabled = false;

            button.innerHTML =
                "ï¼‹ Add Asset";

        }

    }

}


/* =========================================================
   RESET ASSET FORM
   ========================================================= */

function resetAssetForm() {

    const form =
        document.getElementById(
            "assetForm"
        );


    if (form) {

        form.reset();

    }


    const message =
        document.getElementById(
            "assetMessage"
        );


    if (message) {

        message.textContent = "";

        message.className =
            "form-message";

    }

}


/* =========================================================
   DELETE ASSET
   ========================================================= */

async function deleteAsset(assetId) {

    if (!assetId) {

        showToast(
            "Invalid asset ID.",
            "error"
        );

        return;

    }


    const asset =
        assetsCache.find(
            item =>
                Number(item.id) ===
                Number(assetId)
        );


    const assetName =
        asset?.name ||
        `Asset #${assetId}`;


    const confirmed =
        window.confirm(
            `Delete "${assetName}"?\n\nThis action cannot be undone.`
        );


    if (!confirmed) {

        return;

    }


    try {

        const data =
            await apiRequest(
                `/api/assets/${assetId}`,
                {
                    method: "DELETE"
                }
            );


        showToast(
            data?.message ||
            "Asset deleted successfully.",
            "success"
        );


        await loadAssets(true);
        await loadRiskSummary(true);
        await loadFindings(true);


        if (currentSection === "risk") {

            await loadRiskOverview();

        }

    }

    catch (error) {

        console.error(
            "Asset deletion failed:",
            error
        );


        showToast(
            error.message ||
            "Failed to delete asset.",
            "error"
        );

    }

}


/* =========================================================
   MODAL
   ========================================================= */

function showModal(
    title,
    body
) {

    const overlay =
        document.getElementById(
            "modalOverlay"
        );


    const modalTitle =
        document.getElementById(
            "modalTitle"
        );


    const modalBody =
        document.getElementById(
            "modalBody"
        );


    if (!overlay) return;


    if (modalTitle) {

        modalTitle.textContent =
            title;

    }


    if (modalBody) {

        modalBody.innerHTML =
            body;

    }


    overlay.classList.add(
        "show"
    );

    overlay.style.display =
        "flex";

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeModal(event) {

    if (
        event &&
        event.target &&
        event.target.id !==
        "modalOverlay"
    ) {

        return;

    }


    const overlay =
        document.getElementById(
            "modalOverlay"
        );


    if (!overlay) return;


    overlay.classList.remove(
        "show"
    );


    overlay.style.display =
        "none";

}


/* =========================================================
   TOAST SYSTEM
   ========================================================= */

function showToast(
    message,
    type = "info"
) {

    const container =
        document.getElementById(
            "toastContainer"
        );


    if (!container) {

        console.log(
            `[${type}] ${message}`
        );

        return;

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `toast toast-${type}`;


    const icon =
        type === "success"
            ? "âœ“"
            : type === "error"
                ? "!"
                : type === "warning"
                    ? "âš "
                    : "i";


    toast.innerHTML = `
        <span class="toast-icon">
            ${icon}
        </span>

        <span class="toast-message">
            ${escapeHtml(message)}
        </span>
    `;


    container.appendChild(
        toast
    );


    requestAnimationFrame(() => {

        toast.classList.add(
            "show"
        );

    });


    setTimeout(() => {

        toast.classList.remove(
            "show"
        );


        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3500);

}


/* =========================================================
   FORM MESSAGE
   ========================================================= */

function showFormMessage(
    element,
    message,
    type
) {

    if (!element) return;


    element.textContent =
        message;


    element.className =
        `form-message ${type}`;

}


/* =========================================================
   TEXT HELPER
   ========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   RISK CLASS
   ========================================================= */

function getRiskClass(value) {

    const level =
        String(value || "")
            .toLowerCase();


    if (
        level.includes("critical")
    ) {

        return "critical";

    }


    if (
        level.includes("high")
    ) {

        return "high";

    }


    if (
        level.includes("medium")
    ) {

        return "medium";

    }


    if (
        level.includes("low")
    ) {

        return "low";

    }


    return "unknown";

}


/* =========================================================
   SEVERITY CLASS
   ========================================================= */

function getSeverityClass(
    severity
) {

    return getRiskClass(
        severity
    );

}


/* =========================================================
   COUNT SEVERITY
   ========================================================= */

function countSeverity(
    items,
    severity
) {

    return items.filter(item => {

        return String(
            item.severity || ""
        ).toLowerCase() ===
        severity.toLowerCase();

    }).length;

}


/* =========================================================
   COUNT STATUS
   ========================================================= */

function countStatus(
    items,
    status
) {

    return items.filter(item => {

        return String(
            item.status || ""
        ).toLowerCase() ===
        status.toLowerCase();

    }).length;

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   KEYBOARD SUPPORT
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   AUTO REFRESH
   ========================================================= */

setInterval(
    async () => {

        if (
            document.hidden
        ) {

            return;

        }


        try {

            await checkBackendHealth();

        }

        catch {

            // Intentionally ignored.
            // Health function handles UI state.

        }

    },
    30000
);


/* =========================================================
   GLOBAL EXPORTS
   Required by inline onclick handlers
   ========================================================= */

window.showSection =
    showSection;

window.toggleSidebar =
    toggleSidebar;

window.refreshDashboard =
    refreshDashboard;

window.checkBackendHealth =
    checkBackendHealth;

window.loadAssets =
    loadAssets;

window.loadFindings =
    loadFindings;

window.loadRiskOverview =
    loadRiskOverview;

window.createAsset =
    createAsset;

window.resetAssetForm =
    resetAssetForm;

window.deleteAsset =
    deleteAsset;

window.calculateAssetRisk =
    calculateAssetRisk;

window.showModal =
    showModal;

window.closeModal =
    closeModal;

window.showToast =
    showToast;


/* =========================================================
   END OF AEGISONE APP.JS
   ========================================================= */
   
