"""
Pure rule-based analyzer for HTTP security headers.
Checks:
- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- X-Content-Type-Options
- X-Frame-Options & CSP frame-ancestors
- Referrer-Policy
- Permissions-Policy
- Cross-Origin-Opener-Policy (COOP)
- Cross-Origin-Resource-Policy (CORP)
- Cross-Origin-Embedder-Policy (COEP)
- Information Disclosure (Server, X-Powered-By, etc.)
- Deprecated / Anti-pattern headers (X-XSS-Protection)
"""
import re
from typing import Dict, List, Any, Optional
from .rubric import MAX_SCORES
from .fix_templates import get_fix_snippets

def get_header(headers: Dict[str, str], name: str) -> Optional[str]:
    """Case-insensitive header retrieval."""
    target = name.lower()
    for k, v in headers.items():
        if k.lower() == target:
            return v.strip()
    return None

class CSPRule:
    name = "Content-Security-Policy"
    max_score = MAX_SCORES["Content-Security-Policy"]

    @classmethod
    def evaluate(cls, headers: Dict[str, str]) -> Dict[str, Any]:
        val = get_header(headers, "Content-Security-Policy")
        fixes = get_fix_snippets(cls.name)
        recommended = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; frame-ancestors 'self'; form-action 'self';"
        why_it_matters = (
            "Content-Security-Policy (CSP) is the single most effective defense against Cross-Site Scripting (XSS), "
            "data injection attacks, and clickjacking. It restricts the origins from which scripts, images, and other resources can be loaded."
        )

        if not val:
            return {
                "name": cls.name,
                "status": "fail",
                "severity": "critical",
                "score": 0,
                "max_score": cls.max_score,
                "value": None,
                "message": "Content-Security-Policy header is missing. The site lacks defense against XSS and data injection.",
                "recommendation": recommended,
                "why_it_matters": why_it_matters,
                "fixes": fixes
            }

        lower_val = val.lower()
        has_unsafe_inline = "'unsafe-inline'" in lower_val
        has_unsafe_eval = "'unsafe-eval'" in lower_val
        has_wildcard = ("default-src *" in lower_val) or ("script-src *" in lower_val) or ("default-src 'none'" not in lower_val and "default-src 'self'" not in lower_val and "default-src" not in lower_val)

        issues = []
        if has_unsafe_inline:
            issues.append("contains 'unsafe-inline' (allows attacker-controlled script execution)")
        if has_unsafe_eval:
            issues.append("contains 'unsafe-eval' (allows eval() code execution)")
        if "default-src" not in lower_val and "script-src" not in lower_val:
            issues.append("missing 'default-src' or 'script-src' fallback directive")
        if "*" in lower_val and "img-src *" not in lower_val:
            issues.append("uses wildcard '*' origins in sensitive directives")

        if issues:
            return {
                "name": cls.name,
                "status": "warn",
                "severity": "high",
                "score": 14,
                "max_score": cls.max_score,
                "value": val,
                "message": f"Content-Security-Policy is present but weak: {', '.join(issues)}.",
                "recommendation": recommended,
                "why_it_matters": why_it_matters,
                "fixes": fixes
            }

        return {
            "name": cls.name,
            "status": "pass",
            "severity": "info",
            "score": cls.max_score,
            "max_score": cls.max_score,
            "value": val,
            "message": "Robust Content-Security-Policy enforced without dangerous unsafe-inline/eval directives.",
            "recommendation": recommended,
            "why_it_matters": why_it_matters,
            "fixes": fixes
        }

class HSTSRule:
    name = "Strict-Transport-Security"
    max_score = MAX_SCORES["Strict-Transport-Security"]

    @classmethod
    def evaluate(cls, headers: Dict[str, str], is_https: bool = True) -> Dict[str, Any]:
        val = get_header(headers, "Strict-Transport-Security")
        fixes = get_fix_snippets(cls.name)
        recommended = "max-age=31536000; includeSubDomains; preload"
        why_it_matters = (
            "HTTP Strict Transport Security (HSTS) prevents man-in-the-middle (MitM) and SSL-stripping attacks "
            "by forcing browsers to connect strictly over secure HTTPS connections, even if a user types http://."
        )

        if not val:
            return {
                "name": cls.name,
                "status": "fail",
                "severity": "critical",
                "score": 0,
                "max_score": cls.max_score,
                "value": None,
                "message": "Strict-Transport-Security is missing. Browsers may be downgraded to unencrypted HTTP.",
                "recommendation": recommended,
                "why_it_matters": why_it_matters,
                "fixes": fixes
            }

        lower_val = val.lower()
        max_age_match = re.search(r"max-age=(\d+)", lower_val)
        max_age = int(max_age_match.group(1)) if max_age_match else 0
        min_seconds = 15552000  # 180 days

        has_subdomains = "includesubdomains" in lower_val
        has_preload = "preload" in lower_val

        if max_age < min_seconds or not has_subdomains:
            reasons = []
            if max_age < min_seconds:
                reasons.append(f"max-age ({max_age}s) is under recommended 6 months ({min_seconds}s)")
            if not has_subdomains:
                reasons.append("missing 'includeSubDomains' (leaves subdomains unprotected)")
            
            return {
                "name": cls.name,
                "status": "warn",
                "severity": "medium",
                "score": 10,
                "max_score": cls.max_score,
                "value": val,
                "message": f"HSTS is present but suboptimal: {', '.join(reasons)}.",
                "recommendation": recommended,
                "why_it_matters": why_it_matters,
                "fixes": fixes
            }

        score = cls.max_score
        bonus_msg = " and eligible for HSTS browser preload list" if has_preload else ""
        return {
            "name": cls.name,
            "status": "pass",
            "severity": "info",
            "score": score,
            "max_score": cls.max_score,
            "value": val,
            "message": f"Strong HSTS configuration with long max-age and includeSubDomains{bonus_msg}.",
            "recommendation": recommended,
            "why_it_matters": why_it_matters,
            "fixes": fixes
        }

class XContentTypeOptionsRule:
    name = "X-Content-Type-Options"
    max_score = MAX_SCORES["X-Content-Type-Options"]

    @classmethod
    def evaluate(cls, headers: Dict[str, str]) -> Dict[str, Any]:
        val = get_header(headers, "X-Content-Type-Options")
        fixes = get_fix_snippets(cls.name)
        recommended = "nosniff"
        why_it_matters = (
            "Prevents MIME-sniffing attacks where browsers attempt to guess the content type of a resource, "
            "potentially executing malicious user uploads (e.g., an image file containing executable HTML/JS) as scripts."
        )

        if val and val.lower().strip() == "nosniff":
            return {
                "name": cls.name,
                "status": "pass",
                "severity": "info",
                "score": cls.max_score,
                "max_score": cls.max_score,
                "value": val,
                "message": "MIME-type sniffing is securely prevented with 'nosniff'.",
                "recommendation": recommended,
                "why_it_matters": why_it_matters,
                "fixes": fixes
            }

        return {
            "name": cls.name,
            "status": "fail",
            "severity": "medium",
            "score": 0,
            "max_score": cls.max_score,
            "value": val,
            "message": "X-Content-Type-Options is missing or not set to 'nosniff'. Browsers may perform unsafe MIME sniffing.",
            "recommendation": recommended,
            "why_it_matters": why_it_matters,
            "fixes": fixes
        }

class XFrameOptionsRule:
    name = "X-Frame-Options"
    max_score = MAX_SCORES["X-Frame-Options"]

    @classmethod
    def evaluate(cls, headers: Dict[str, str]) -> Dict[str, Any]:
        val = get_header(headers, "X-Frame-Options")
        csp = get_header(headers, "Content-Security-Policy") or ""
        fixes = get_fix_snippets(cls.name)
        recommended = "DENY"
        why_it_matters = (
            "X-Frame-Options protects against Clickjacking attacks, preventing malicious sites from embedding "
            "your application inside an invisible <iframe> and tricking users into clicking unauthorized actions."
        )

        # Check if CSP frame-ancestors is present (modern successor)
        has_frame_ancestors = "frame-ancestors" in csp.lower()

        if val:
            upper_val = val.upper().strip()
            if upper_val in ["DENY", "SAMEORIGIN"]:
                return {
                    "name": cls.name,
                    "status": "pass",
                    "severity": "info",
                    "score": cls.max_score,
                    "max_score": cls.max_score,
                    "value": val,
                    "message": f"Frame embedding restricted via {upper_val}.",
                    "recommendation": recommended,
                    "why_it_matters": why_it_matters,
                    "fixes": fixes
                }
            elif "ALLOW-FROM" in upper_val:
                return {
                    "name": cls.name,
                    "status": "warn",
                    "severity": "medium",
                    "score": 5,
                    "max_score": cls.max_score,
                    "value": val,
                    "message": "ALLOW-FROM is deprecated and ignored by modern browsers. Use CSP frame-ancestors instead.",
                    "recommendation": recommended,
                    "why_it_matters": why_it_matters,
                    "fixes": fixes
                }

        if has_frame_ancestors:
            return {
                "name": cls.name,
                "status": "pass",
                "severity": "info",
                "score": cls.max_score,
                "max_score": cls.max_score,
                "value": "CSP frame-ancestors defined",
                "message": "Protected via modern Content-Security-Policy 'frame-ancestors' directive.",
                "recommendation": recommended,
                "why_it_matters": why_it_matters,
                "fixes": fixes
            }

        return {
            "name": cls.name,
            "status": "fail",
            "severity": "high",
            "score": 0,
            "max_score": cls.max_score,
            "value": None,
            "message": "X-Frame-Options is missing and no CSP frame-ancestors directive is defined. Vulnerable to Clickjacking.",
            "recommendation": recommended,
            "why_it_matters": why_it_matters,
            "fixes": fixes
        }

class ReferrerPolicyRule:
    name = "Referrer-Policy"
    max_score = MAX_SCORES["Referrer-Policy"]

    @classmethod
    def evaluate(cls, headers: Dict[str, str]) -> Dict[str, Any]:
        val = get_header(headers, "Referrer-Policy")
        fixes = get_fix_snippets(cls.name)
        recommended = "strict-origin-when-cross-origin"
        why_it_matters = (
            "Referrer-Policy governs how much referrer information (paths, query parameters, auth tokens in URLs) "
            "is transmitted to external sites when users click outbound links or fetch cross-origin resources."
        )

        safe_policies = [
            "no-referrer",
            "same-origin",
            "strict-origin",
            "strict-origin-when-cross-origin"
        ]

        if not val:
            return {
                "name": cls.name,
                "status": "fail",
                "severity": "medium",
                "score": 0,
                "max_score": cls.max_score,
                "value": None,
                "message": "Referrer-Policy is missing. Browsers will use default behavior which may leak query params.",
                "recommendation": recommended,
                "why_it_matters": why_it_matters,
                "fixes": fixes
            }

        lower_val = val.lower().strip()
        if any(p in lower_val for p in safe_policies):
            return {
                "name": cls.name,
                "status": "pass",
                "severity": "info",
                "score": cls.max_score,
                "max_score": cls.max_score,
                "value": val,
                "message": f"Secure Referrer-Policy configured ('{val}').",
                "recommendation": recommended,
                "why_it_matters": why_it_matters,
                "fixes": fixes
            }
        else:
            return {
                "name": cls.name,
                "status": "warn",
                "severity": "medium",
                "score": 5,
                "max_score": cls.max_score,
                "value": val,
                "message": f"Policy '{val}' may leak sensitive query strings or paths to external origins.",
                "recommendation": recommended,
                "why_it_matters": why_it_matters,
                "fixes": fixes
            }

class PermissionsPolicyRule:
    name = "Permissions-Policy"
    max_score = MAX_SCORES["Permissions-Policy"]

    @classmethod
    def evaluate(cls, headers: Dict[str, str]) -> Dict[str, Any]:
        val = get_header(headers, "Permissions-Policy") or get_header(headers, "Feature-Policy")
        fixes = get_fix_snippets(cls.name)
        recommended = "camera=(), microphone=(), geolocation=(), payment=()"
        why_it_matters = (
            "Permissions-Policy allows developers to explicitly restrict access to sensitive browser hardware APIs "
            "such as camera, microphone, geolocation, and payment systems, limiting exploit surface in case of XSS or malicious iframes."
        )

        if not val:
            return {
                "name": cls.name,
                "status": "fail",
                "severity": "low",
                "score": 0,
                "max_score": cls.max_score,
                "value": None,
                "message": "Permissions-Policy is missing. Sensitive browser features (camera, mic, geolocation) remain enabled by default.",
                "recommendation": recommended,
                "why_it_matters": why_it_matters,
                "fixes": fixes
            }

        lower_val = val.lower()
        restricts_camera = "camera=()" in lower_val or "camera 'none'" in lower_val
        restricts_mic = "microphone=()" in lower_val or "microphone 'none'" in lower_val
        restricts_geo = "geolocation=()" in lower_val or "geolocation 'none'" in lower_val

        if restricts_camera and restricts_mic:
            return {
                "name": cls.name,
                "status": "pass",
                "severity": "info",
                "score": cls.max_score,
                "max_score": cls.max_score,
                "value": val,
                "message": "Permissions-Policy explicitly disables unneeded browser features.",
                "recommendation": recommended,
                "why_it_matters": why_it_matters,
                "fixes": fixes
            }
        else:
            return {
                "name": cls.name,
                "status": "warn",
                "severity": "low",
                "score": 6,
                "max_score": cls.max_score,
                "value": val,
                "message": "Permissions-Policy is set, but sensitive APIs like camera or microphone are not explicitly restricted.",
                "recommendation": recommended,
                "why_it_matters": why_it_matters,
                "fixes": fixes
            }

class CrossOriginPoliciesRule:
    name = "Cross-Origin Policies (COOP/CORP/COEP)"
    max_score = MAX_SCORES["Cross-Origin-Policies"]

    @classmethod
    def evaluate(cls, headers: Dict[str, str]) -> Dict[str, Any]:
        coop = get_header(headers, "Cross-Origin-Opener-Policy")
        corp = get_header(headers, "Cross-Origin-Resource-Policy")
        coep = get_header(headers, "Cross-Origin-Embedder-Policy")
        fixes = get_fix_snippets("Cross-Origin-Opener-Policy")
        recommended = "COOP: same-origin; CORP: same-origin; COEP: require-corp"
        why_it_matters = (
            "Cross-Origin isolation headers isolate browsing contexts from cross-origin attacks, "
            "blocking Spectre-style side-channel data leaks and unauthorized window manipulation."
        )

        present = []
        if coop: present.append(f"COOP: {coop}")
        if corp: present.append(f"CORP: {corp}")
        if coep: present.append(f"COEP: {coep}")

        if len(present) >= 2:
            return {
                "name": cls.name,
                "status": "pass",
                "severity": "info",
                "score": cls.max_score,
                "max_score": cls.max_score,
                "value": "; ".join(present),
                "message": "Cross-Origin isolation headers configured to mitigate cross-origin side-channel leaks.",
                "recommendation": recommended,
                "why_it_matters": why_it_matters,
                "fixes": fixes
            }
        elif len(present) == 1:
            return {
                "name": cls.name,
                "status": "warn",
                "severity": "low",
                "score": 5,
                "max_score": cls.max_score,
                "value": "; ".join(present),
                "message": "Partial cross-origin isolation. Consider enabling both COOP and CORP.",
                "recommendation": recommended,
                "why_it_matters": why_it_matters,
                "fixes": fixes
            }
        else:
            return {
                "name": cls.name,
                "status": "fail",
                "severity": "low",
                "score": 0,
                "max_score": cls.max_score,
                "value": None,
                "message": "Cross-Origin isolation headers (COOP, CORP, COEP) are not set.",
                "recommendation": recommended,
                "why_it_matters": why_it_matters,
                "fixes": fixes
            }

class InformationDisclosureRule:
    name = "Information Disclosure Prevention"
    max_score = MAX_SCORES["Information-Disclosure"]

    @classmethod
    def evaluate(cls, headers: Dict[str, str]) -> Dict[str, Any]:
        leak_headers = ["Server", "X-Powered-By", "X-AspNet-Version", "X-AspNetMvc-Version", "X-Runtime", "Via"]
        leaks = []
        fixes = get_fix_snippets("Information-Disclosure")
        recommended = "Remove or sanitize Server and X-Powered-By headers"
        why_it_matters = (
            "Revealing exact server software, programming language frameworks, and runtime versions enables attackers "
            "to easily query CVE vulnerability databases and target unpatched version-specific exploits."
        )

        for h in leak_headers:
            val = get_header(headers, h)
            if val:
                # check if it leaks version
                if any(c.isdigit() for c in val) or h.lower() != "server" or "/" in val:
                    leaks.append(f"{h}: {val}")

        if leaks:
            return {
                "name": cls.name,
                "status": "fail",
                "severity": "medium",
                "score": 0,
                "max_score": cls.max_score,
                "value": "; ".join(leaks),
                "message": f"Server technology details disclosed: {', '.join(leaks)}. Attackers can target version-specific vulnerabilities.",
                "recommendation": recommended,
                "why_it_matters": why_it_matters,
                "fixes": fixes
            }

        return {
            "name": cls.name,
            "status": "pass",
            "severity": "info",
            "score": cls.max_score,
            "max_score": cls.max_score,
            "value": "No version/technology leakage detected",
            "message": "Technology banners and version numbers are masked or removed.",
            "recommendation": recommended,
            "why_it_matters": why_it_matters,
            "fixes": fixes
        }
