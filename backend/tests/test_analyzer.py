import pytest
from backend.analyzer.rules import (
    CSPRule,
    HSTSRule,
    XContentTypeOptionsRule,
    XFrameOptionsRule,
    ReferrerPolicyRule,
    PermissionsPolicyRule,
    CrossOriginPoliciesRule,
    InformationDisclosureRule,
    get_header
)
from backend.analyzer.scoring import analyze_headers
from backend.analyzer.rubric import calculate_grade, RUBRIC_VERSION
from backend.analyzer.fix_templates import TEMPLATES, get_fix_snippets
from backend.app.ssrf import validate_url_and_resolve_ip

def test_csp_rule_missing():
    res = CSPRule.evaluate({})
    assert res["status"] == "fail"
    assert res["score"] == 0
    assert res["severity"] == "critical"
    assert "missing" in res["message"].lower()

def test_csp_rule_weak():
    res = CSPRule.evaluate({"Content-Security-Policy": "default-src 'self' 'unsafe-inline'"})
    assert res["status"] == "warn"
    assert res["score"] < res["max_score"]
    assert "unsafe-inline" in res["message"]

def test_csp_rule_pass():
    res = CSPRule.evaluate({"Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self'"})
    assert res["status"] == "pass"
    assert res["score"] == res["max_score"]

def test_hsts_rule_missing():
    res = HSTSRule.evaluate({})
    assert res["status"] == "fail"
    assert res["score"] == 0

def test_hsts_rule_weak_maxage():
    res = HSTSRule.evaluate({"Strict-Transport-Security": "max-age=3600"})
    assert res["status"] == "warn"
    assert res["score"] == 10

def test_hsts_rule_strong():
    res = HSTSRule.evaluate({"Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"})
    assert res["status"] == "pass"
    assert res["score"] == 20

def test_x_content_type_options():
    res_fail = XContentTypeOptionsRule.evaluate({})
    assert res_fail["status"] == "fail"
    
    res_pass = XContentTypeOptionsRule.evaluate({"X-Content-Type-Options": "nosniff"})
    assert res_pass["status"] == "pass"
    assert res_pass["score"] == 10

def test_x_frame_options():
    res_fail = XFrameOptionsRule.evaluate({})
    assert res_fail["status"] == "fail"

    res_deny = XFrameOptionsRule.evaluate({"X-Frame-Options": "DENY"})
    assert res_deny["status"] == "pass"

    res_ancestors = XFrameOptionsRule.evaluate({"Content-Security-Policy": "frame-ancestors 'none'"})
    assert res_ancestors["status"] == "pass"

def test_information_disclosure():
    res_clean = InformationDisclosureRule.evaluate({})
    assert res_clean["status"] == "pass"
    assert res_clean["score"] == 5

    res_leaked = InformationDisclosureRule.evaluate({"Server": "Apache/2.4.41 (Ubuntu)", "X-Powered-By": "PHP/7.4.3"})
    assert res_leaked["status"] == "fail"
    assert res_leaked["score"] == 0

def test_scoring_and_grade_a_plus():
    perfect_headers = {
        "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self'",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Resource-Policy": "same-origin"
    }
    result = analyze_headers(perfect_headers, url="https://secure.example.com")
    assert result["score"] >= 95
    assert result["grade"] == "A+"
    assert result["summary"]["failed"] == 0

def test_scoring_grade_f():
    result = analyze_headers({}, url="http://insecure.example.com")
    assert result["score"] < 40
    assert result["grade"] == "F"
    assert result["summary"]["failed"] >= 5

def test_ssrf_blocks_private_and_loopback():
    with pytest.raises(ValueError, match=r"private|loopback|reserved"):
        validate_url_and_resolve_ip("http://127.0.0.1:8080")

    with pytest.raises(ValueError, match=r"private|loopback|reserved|not allowed"):
        validate_url_and_resolve_ip("http://localhost")

def test_fix_templates():
    assert "Content-Security-Policy" in TEMPLATES
    snippets = get_fix_snippets("Content-Security-Policy")
    assert "Nginx" in snippets
    assert "Apache" in snippets
    assert "Express" in snippets
    assert "Flask" in snippets
    assert "Django" in snippets
    assert "Cloudflare" in snippets
