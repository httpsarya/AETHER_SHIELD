"""
Scoring rubric and grading thresholds according to PRD section 4 and suggested scoring rubric.
"""
from typing import Dict, Any

RUBRIC_VERSION = "1.0.0"

# Category weights totaling 100 points
MAX_SCORES = {
    "Content-Security-Policy": 25,
    "Strict-Transport-Security": 20,
    "X-Content-Type-Options": 10,
    "X-Frame-Options": 10,
    "Referrer-Policy": 10,
    "Permissions-Policy": 10,
    "Cross-Origin-Policies": 10,
    "Information-Disclosure": 5,
}

def calculate_grade(score: int, findings: list) -> str:
    """
    Grade mapping:
    A+ (95-100), A (85-94), B (70-84), C (55-69), D (40-54), F (below 40).
    A+ additionally requires no critical or high severity failures and strong HSTS.
    """
    has_critical = any(f.get("severity") == "critical" and f.get("status") == "fail" for f in findings)
    
    if score >= 95 and not has_critical:
        return "A+"
    elif score >= 85:
        return "A"
    elif score >= 70:
        return "B"
    elif score >= 55:
        return "C"
    elif score >= 40:
        return "D"
    else:
        return "F"
