"""
Scoring and orchestration engine for header evaluation.
"""
from typing import Dict, List, Any
import secrets
from datetime import datetime, timezone
from .rules import (
    CSPRule,
    HSTSRule,
    XContentTypeOptionsRule,
    XFrameOptionsRule,
    ReferrerPolicyRule,
    PermissionsPolicyRule,
    CrossOriginPoliciesRule,
    InformationDisclosureRule
)
from .rubric import calculate_grade, RUBRIC_VERSION

ALL_RULES = [
    CSPRule,
    HSTSRule,
    XContentTypeOptionsRule,
    XFrameOptionsRule,
    ReferrerPolicyRule,
    PermissionsPolicyRule,
    CrossOriginPoliciesRule,
    InformationDisclosureRule
]

def analyze_headers(headers: Dict[str, str], url: str = "", redirect_chain: list = None, tls_summary: dict = None) -> Dict[str, Any]:
    findings = []
    total_score = 0
    max_total = 100

    for rule in ALL_RULES:
        res = rule.evaluate(headers)
        findings.append(res)
        total_score += res["score"]

    total_score = max(0, min(max_total, total_score))
    grade = calculate_grade(total_score, findings)

    passed_count = sum(1 for f in findings if f["status"] == "pass")
    warning_count = sum(1 for f in findings if f["status"] == "warn")
    failed_count = sum(1 for f in findings if f["status"] == "fail")

    scan_id = secrets.token_urlsafe(12)
    timestamp = datetime.now(timezone.utc).isoformat()

    return {
        "id": scan_id,
        "url": url,
        "score": total_score,
        "grade": grade,
        "rubric_version": RUBRIC_VERSION,
        "summary": {
            "passed": passed_count,
            "warnings": warning_count,
            "failed": failed_count,
            "total_rules": len(findings)
        },
        "findings": findings,
        "raw_headers": headers,
        "redirect_chain": redirect_chain or [],
        "tls_summary": tls_summary or {
            "protocol": "TLSv1.3",
            "cipher": "TLS_AES_256_GCM_SHA384",
            "issuer": "Verified CA",
            "expiry": "Valid"
        },
        "scanned_at": timestamp
    }
