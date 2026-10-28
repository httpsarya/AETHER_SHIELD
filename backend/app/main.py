"""
FastAPI Backend Application for HTTP Security Header Analyzer.
"""
import asyncio
import csv
import io
from fastapi import FastAPI, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List

from .models import ScanRequest, ScanResponse, CompareRequest, BulkScanRequest
from .scanner import fetch_and_analyze
from ..analyzer.scoring import analyze_headers, ALL_RULES
from ..analyzer.rubric import RUBRIC_VERSION, MAX_SCORES
from ..analyzer.fix_templates import TEMPLATES

app = FastAPI(
    title="AETHER_SHIELD // HTTP Security Header Analyzer API",
    description="Deterministic HTTP security header scoring, SSRF-safe scanning, and multi-stack fix generation. Developed by Arya Tiwari (Bennett University).",
    version="1.0.0",
    contact={
        "name": "Arya Tiwari",
        "url": "https://httpsarya.github.io/Arya_Tiwari_portfolio_12/",
        "email": "arya2tiwari@gmail.com",
    },
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/v1/openapi.json"
)

# CORS middleware for local frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for recent scans (in production backed by PostgreSQL / Redis)
SCAN_STORE: Dict[str, Dict[str, Any]] = {}

@app.get("/api/v1/health")
async def health():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "rubric_version": RUBRIC_VERSION
    }

@app.post("/api/v1/scan", response_model=ScanResponse)
async def create_scan(request: ScanRequest):
    """
    Initiates an SSRF-safe scan against the specified target URL.
    Returns findings, security score, letter grade, and remediation snippets.
    """
    try:
        result = await fetch_and_analyze(request.url, follow_redirects=request.follow_redirects)
        SCAN_STORE[result["id"]] = result
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Fallback or error notification
        raise HTTPException(status_code=502, detail=f"Target scan failed: {str(e)}")

@app.get("/api/v1/scan/{scan_id}", response_model=ScanResponse)
async def get_scan(scan_id: str):
    """Retrieves an existing scan result by unique ID."""
    if scan_id in SCAN_STORE:
        return SCAN_STORE[scan_id]
    raise HTTPException(status_code=404, detail="Scan not found or expired.")

@app.post("/api/v1/compare")
async def compare_targets(request: CompareRequest):
    """Runs scans for two targets or URLs and returns a comparative diff."""
    try:
        res_a = await fetch_and_analyze(request.url_a)
        res_b = await fetch_and_analyze(request.url_b)

        # Diff calculation
        diff_map = {}
        for fa in res_a["findings"]:
            name = fa["name"]
            fb = next((x for x in res_b["findings"] if x["name"] == name), None)
            
            status_a = fa["status"]
            status_b = fb["status"] if fb else "missing"
            
            status_rank = {"pass": 3, "warn": 2, "fail": 1, "missing": 0}
            rank_a = status_rank.get(status_a, 0)
            rank_b = status_rank.get(status_b, 0)
            
            if rank_b > rank_a:
                comparison = "improved"
            elif rank_b < rank_a:
                comparison = "regressed"
            else:
                comparison = "unchanged"

            diff_map[name] = {
                "header": name,
                "target_a": {"status": status_a, "score": fa["score"], "value": fa.get("value")},
                "target_b": {"status": status_b, "score": fb["score"] if fb else 0, "value": fb.get("value") if fb else None},
                "comparison": comparison
            }

        return {
            "target_a": res_a,
            "target_b": res_b,
            "score_delta": res_b["score"] - res_a["score"],
            "comparisons": list(diff_map.values())
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

@app.post("/api/v1/bulk")
async def bulk_scan(request: BulkScanRequest):
    """Performs concurrent scans for up to 25 target URLs with a concurrency limit of 5."""
    semaphore = asyncio.Semaphore(5)

    async def _safe_scan(url: str):
        async with semaphore:
            try:
                res = await fetch_and_analyze(url)
                return {"url": url, "status": "success", "score": res["score"], "grade": res["grade"], "scan_id": res["id"]}
            except Exception as e:
                return {"url": url, "status": "failed", "error": str(e), "score": 0, "grade": "F"}

    tasks = [_safe_scan(u) for u in request.urls]
    results = await asyncio.gather(*tasks)
    return {
        "total": len(request.urls),
        "results": results
    }

@app.get("/api/v1/headers")
async def list_headers_info():
    """Educational index of all monitored security headers, descriptions, and attack vectors."""
    headers_info = [
        {
            "name": "Content-Security-Policy",
            "category": "Injection & XSS Defense",
            "max_points": 25,
            "description": "Restricts resources (such as JavaScript, CSS, Images) that the browser is allowed to load for a given page.",
            "attacks_prevented": ["Cross-Site Scripting (XSS)", "Clickjacking", "Packet Sniffing / Mixed Content", "Data Injection"],
            "recommended_value": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:;",
            "mdn_url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP"
        },
        {
            "name": "Strict-Transport-Security",
            "category": "Transport Encryption",
            "max_points": 20,
            "description": "Enforces HTTPS encryption and prevents SSL-stripping man-in-the-middle attacks.",
            "attacks_prevented": ["Man-in-the-Middle (MitM)", "SSL Stripping", "Cookie Hijacking over HTTP"],
            "recommended_value": "max-age=31536000; includeSubDomains; preload",
            "mdn_url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security"
        },
        {
            "name": "X-Content-Type-Options",
            "category": "MIME Security",
            "max_points": 10,
            "description": "Stops browsers from MIME-sniffing a response away from the declared content-type.",
            "attacks_prevented": ["MIME Confusion Attacks", "Drive-by Executable Downloads"],
            "recommended_value": "nosniff",
            "mdn_url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options"
        },
        {
            "name": "X-Frame-Options",
            "category": "Framing & Clickjacking",
            "max_points": 10,
            "description": "Controls whether the browser is allowed to render a page in a <frame>, <iframe>, <embed> or <object>.",
            "attacks_prevented": ["Clickjacking", "UI Redressing Attacks"],
            "recommended_value": "DENY",
            "mdn_url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options"
        },
        {
            "name": "Referrer-Policy",
            "category": "Privacy & Leakage",
            "max_points": 10,
            "description": "Controls how much referrer information (URL paths, sensitive query parameters) is included with requests.",
            "attacks_prevented": ["Token Leakage via URL", "Privacy Leaks", "Sensitive Path Disclosures"],
            "recommended_value": "strict-origin-when-cross-origin",
            "mdn_url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy"
        },
        {
            "name": "Permissions-Policy",
            "category": "Browser Capabilities",
            "max_points": 10,
            "description": "Allows web developers to selectively enable, disable, and modify the behavior of browser APIs and hardware features.",
            "attacks_prevented": ["Unauthorized Camera/Microphone Access", "Geolocation Tracking", "Sensor Probing"],
            "recommended_value": "camera=(), microphone=(), geolocation=(), payment=()",
            "mdn_url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy"
        },
        {
            "name": "Cross-Origin Policies (COOP/CORP/COEP)",
            "category": "Origin Isolation",
            "max_points": 10,
            "description": "Enables cross-origin isolation to safeguard sensitive memory and block Spectre side-channel attacks.",
            "attacks_prevented": ["Spectre Side-Channel Attacks", "Cross-Window DOM Leaks", "Hotlinking Exploitation"],
            "recommended_value": "Cross-Origin-Opener-Policy: same-origin; Cross-Origin-Resource-Policy: same-origin",
            "mdn_url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP)"
        },
        {
            "name": "Information Disclosure Prevention",
            "category": "Reconnaissance Defense",
            "max_points": 5,
            "description": "Strips verbose server software and framework version banners to prevent targeted CVE reconnaissance.",
            "attacks_prevented": ["Targeted Vulnerability Exploitation", "Automated Scanner Fingerprinting"],
            "recommended_value": "Mask or remove Server and X-Powered-By",
            "mdn_url": "https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/02-Fingerprint_Web_Server"
        }
    ]
    return headers_info

@app.get("/api/v1/export/{scan_id}")
async def export_scan(scan_id: str, format: str = Query("json", enum=["json", "csv"])):
    """Exports scan report in JSON or CSV format."""
    if scan_id not in SCAN_STORE:
        raise HTTPException(status_code=404, detail="Scan not found.")

    scan = SCAN_STORE[scan_id]

    if format == "csv":
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Header", "Status", "Severity", "Score", "Max Score", "Current Value", "Recommendation"])
        for f in scan["findings"]:
            writer.writerow([
                f["name"],
                f["status"],
                f["severity"],
                f["score"],
                f["max_score"],
                f.get("value") or "MISSING",
                f["recommendation"]
            ])
        output.seek(0)
        return Response(
            content=output.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=header-audit-{scan_id}.csv"}
        )

    return scan
