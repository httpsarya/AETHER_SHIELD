import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "AETHER_SHIELD // Project Technical Documentation & Viva Defense Guide")
            self.drawRightString(558, 750, "Candidate: Arya Tiwari (Bennett University)")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 744, 558, 744)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        self.drawString(54, 32, "AETHER_SHIELD © 2026 • Deterministic HTTP Security Header Audit Engine • Confidential / Academic Viva Defense")
        self.drawRightString(558, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_pdf(filename="AETHER_SHIELD_Project_Documentation_Viva_Guide.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Cyber Color Palette
    PRIMARY = colors.HexColor("#0284C7")      # Cyan Blue
    PRIMARY_DARK = colors.HexColor("#0F172A") # Slate Navy
    SECONDARY = colors.HexColor("#0D9488")    # Emerald Teal
    ACCENT_AMBER = colors.HexColor("#D97706") # Amber
    TEXT_DARK = colors.HexColor("#1E293B")    # Slate 800
    TEXT_MUTED = colors.HexColor("#475569")   # Slate 600
    BG_LIGHT = colors.HexColor("#F8FAFC")     # Soft light gray
    BG_CALLOUT = colors.HexColor("#F0FDF4")   # Soft emerald callout
    BG_WARN = colors.HexColor("#FFFBEB")      # Soft amber callout
    LINE_COLOR = colors.HexColor("#E2E8F0")

    # Typography styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY_DARK,
        alignment=0,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=16,
        textColor=PRIMARY,
        alignment=0,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=PRIMARY_DARK,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=PRIMARY,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'Heading3_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=TEXT_DARK,
        spaceBefore=6,
        spaceAfter=2,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=TEXT_DARK,
        spaceAfter=6
    )

    body_bold = ParagraphStyle(
        'BodyBold_Custom',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=11,
        textColor=PRIMARY_DARK,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'Callout_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12.5,
        textColor=TEXT_DARK
    )

    meta_label = ParagraphStyle(
        'MetaLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=PRIMARY_DARK
    )

    meta_val = ParagraphStyle(
        'MetaVal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=TEXT_MUTED
    )

    q_style = ParagraphStyle(
        'Question_Style',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13.5,
        textColor=PRIMARY,
        spaceBefore=6,
        spaceAfter=2,
        keepWithNext=True
    )

    a_style = ParagraphStyle(
        'Answer_Style',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=TEXT_DARK,
        spaceAfter=6
    )

    story = []

    # ====================================================
    # COVER / HEADER SECTION
    # ====================================================
    story.append(Paragraph("AETHER_SHIELD", title_style))
    story.append(Paragraph("Deterministic HTTP Security Header Analyzer & Multi-Stack Remediation Engine", subtitle_style))

    # Project Metadata Box
    meta_data = [
        [Paragraph("Project Architect:", meta_label), Paragraph("Arya Tiwari (CSE Student, Bennett University, Greater Noida, India)", meta_val)],
        [Paragraph("System Class:", meta_label), Paragraph("Sec-Ops Deterministic HTTP Response Header Auditor & Config Synthesizer", meta_val)],
        [Paragraph("Standard Protocols:", meta_label), Paragraph("RFC-9110 (HTTP), RFC-6797 (HSTS), W3C CSP Level 3, SARIF v2.1.0", meta_val)],
        [Paragraph("Core Repositories:", meta_label), Paragraph("https://github.com/httpsarya/AETHER_SHIELD (Live: https://httpsarya.github.io/AETHER_SHIELD/)", meta_val)],
        [Paragraph("Primary Purpose:", meta_label), Paragraph("Complete technical guide & model Q&A for Academic Viva Defense & Technical Audits", meta_val)],
    ]
    meta_table = Table(meta_data, colWidths=[120, 384])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, LINE_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, LINE_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))

    # ====================================================
    # 1. EXECUTIVE SUMMARY & PROBLEM STATEMENT
    # ====================================================
    story.append(Paragraph("1. Executive Summary & Problem Statement", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=8))
    
    story.append(Paragraph(
        "Modern web applications are increasingly vulnerable to client-side attacks, including Cross-Site Scripting (XSS), "
        "Clickjacking (UI Redressing), MIME-confusion sniffing, SSL stripping, and cross-origin data leaks. While developers invest "
        "heavily in application-layer defenses, HTTP security headers serve as the critical, standardized contract between the server "
        "and the user's browser, enforcing security boundaries directly at the networking protocol level.",
        body_style
    ))
    story.append(Paragraph(
        "<b>The Problem:</b> Over 70% of enterprise and consumer web applications fail to configure security headers correctly. "
        "Configuration errors stem from complex directive syntax (notably in Content Security Policy Level 3), stack-specific config idiosyncrasies, "
        "fear of breaking legacy third-party scripts, and the lack of deterministic, automated scoring tools in CI/CD pipelines.",
        body_style
    ))
    story.append(Paragraph(
        "<b>The AETHER_SHIELD Solution:</b> AETHER_SHIELD is an end-to-end cybersecurity telemetry platform that provides "
        "real-time, deterministic 0–100 rubric auditing, Server-Side Request Forgery (SSRF) safe target ingestion, redirect hop tracking, "
        "baseline regression diffing, batch multi-target auditing, and instant copy-paste configuration synthesis for 6+ web server stacks.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # ====================================================
    # 2. ARCHITECTURE & TECHNICAL FOUNDATION
    # ====================================================
    story.append(Paragraph("2. System Architecture & Technical Foundations", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=8))
    
    story.append(Paragraph("2.1 Technology Stack", h2_style))
    tech_data = [
        [Paragraph("Layer", meta_label), Paragraph("Technology Selection", meta_label), Paragraph("Architectural Rationale", meta_label)],
        [Paragraph("Frontend UI", body_bold), Paragraph("React 18, TypeScript, Vite 6", body_style), Paragraph("High performance, typed interfaces, sub-second HMR, and zero runtime bloat.", body_style)],
        [Paragraph("Design System", body_bold), Paragraph("Vanilla CSS (Stitch Theme Tokens)", body_style), Paragraph("Obsidian & electric cyan cyber aesthetic; eliminates Tailwind bundle overhead.", body_style)],
        [Paragraph("Ingestion Engine", body_bold), Paragraph("CORS Safe Ingestion Pipeline + RFC-9110 Parser", body_style), Paragraph("Multi-tier header fetcher supporting browser client, proxy fallback, and backend proxy.", body_style)],
        [Paragraph("CLI & Automation", body_bold), Paragraph("Python 3.12 (urllib / requests / argparse)", body_style), Paragraph("Zero-dependency terminal execution with exit code assertions for CI/CD pipelines.", body_style)],
        [Paragraph("Report Standards", body_bold), Paragraph("SARIF v2.1.0 & JSON Specification", body_style), Paragraph("OASIS standard interchange format for native GitHub Code Scanning integration.", body_style)],
    ]
    tech_table = Table(tech_data, colWidths=[90, 150, 264])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, LINE_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, LINE_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(tech_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph("2.2 SSRF Guard & Network Abuse Prevention", h2_style))
    story.append(Paragraph(
        "A critical vulnerability in web-based scanners is <b>Server-Side Request Forgery (SSRF)</b>, where attackers attempt to use the scanner "
        "as an internal proxy to query internal network services or cloud metadata. AETHER_SHIELD implements defense-in-depth SSRF protection:",
        body_style
    ))
    story.append(Paragraph("• <b>RFC-1918 Private IP Filter:</b> Blocks private subnets (<code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code>).", body_style))
    story.append(Paragraph("• <b>Loopback & Link-Local Filter:</b> Denies loopback addresses (<code>127.0.0.0/8</code>, <code>::1</code>) and link-local ranges (<code>169.254.0.0/16</code>).", body_style))
    story.append(Paragraph("• <b>Cloud Metadata Shield:</b> Explicitly blocks AWS/GCP/Azure instance metadata endpoints (e.g., <code>169.254.169.254</code>, <code>metadata.google.internal</code>).", body_style))
    story.append(Paragraph("• <b>DNS Single-Resolution & IP Pinning:</b> Resolves target DNS once and pins the destination IP across all HTTP redirect hops to eliminate DNS rebinding (TOCTOU) attacks.", body_style))
    story.append(Spacer(1, 8))

    story.append(Paragraph("2.3 The Deterministic 0–100 Scoring Rubric", h2_style))
    story.append(Paragraph(
        "Unlike arbitrary grading tools, AETHER_SHIELD employs a transparent, weighted mathematical model evaluating security posture across 7 key vectors:",
        body_style
    ))

    rubric_data = [
        [Paragraph("Security Header Vector", meta_label), Paragraph("Max Points", meta_label), Paragraph("Evaluation Criteria & Penalty Rules", meta_label)],
        [Paragraph("Content-Security-Policy (CSP)", body_bold), Paragraph("25 pts", body_style), Paragraph("Full points for strict script-src / nonces / hashes. Deductions: -10 for 'unsafe-inline', -8 for 'unsafe-eval', -10 for wildcards (*).", body_style)],
        [Paragraph("Strict-Transport-Security (HSTS)", body_bold), Paragraph("20 pts", body_style), Paragraph("Full points for max-age >= 31536000 + includeSubDomains + preload. Deductions: -5 for max-age < 1 yr, -5 for missing subdomains.", body_style)],
        [Paragraph("X-Frame-Options / frame-ancestors", body_bold), Paragraph("15 pts", body_style), Paragraph("15 pts for DENY or frame-ancestors 'none'. 10 pts for SAMEORIGIN. 0 pts if framing is unrestricted (Clickjacking risk).", body_style)],
        [Paragraph("X-Content-Type-Options", body_bold), Paragraph("10 pts", body_style), Paragraph("10 pts for 'nosniff'. 0 pts if missing (prevents MIME confusion and script execution from user uploads).", body_style)],
        [Paragraph("Referrer-Policy", body_bold), Paragraph("10 pts", body_style), Paragraph("10 pts for strict-origin-when-cross-origin, same-origin, or no-referrer. Deductions: -6 for unsafe-url or no-referrer-when-downgrade.", body_style)],
        [Paragraph("Permissions-Policy", body_bold), Paragraph("10 pts", body_style), Paragraph("10 pts for restricting geolocation, camera, microphone, and payment APIs. Deductions: -5 if unrestricted or legacy Feature-Policy.", body_style)],
        [Paragraph("Cross-Origin Isolation (COOP/COEP/CORP)", body_bold), Paragraph("10 pts", body_style), Paragraph("10 pts for isolating process threads (Cross-Origin-Opener-Policy & Cross-Origin-Embedder-Policy) against Spectre/Meltdown.", body_style)],
    ]
    rubric_table = Table(rubric_data, colWidths=[150, 70, 284])
    rubric_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, LINE_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, LINE_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(rubric_table)
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Letter Grade Scale:</b> A+ (95–100) | A (85–94) | B (70–84) | C (55–69) | D (40–54) | F (0–39).", body_style))
    story.append(Spacer(1, 10))

    # ====================================================
    # 3. DETAILED WORKING OF ALL 9 TOOLS
    # ====================================================
    story.append(PageBreak())
    story.append(Paragraph("3. Detailed Functional Walkthrough of All 9 Tools", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=8))

    tools = [
        ("Tool 1: Real-Time Scanner",
         "The central audit engine of AETHER_SHIELD. Upon URL submission, the engine validates the target, executes DNS single-resolution, "
         "traces up to 5 HTTP redirect hops, and ingests raw HTTP response headers. The rubric calculates a 0–100 score and assigns a letter grade (A+ to F). "
         "The dashboard displays: (1) Tactical Grade Gauge, (2) Security Vector Breakdown, (3) Pass/Warn/Fail Finding Cards with OWASP citations, "
         "(4) Redirect Chain with IP and latency metrics, and (5) Raw Headers Inspector."),

        ("Tool 2: Policy Generator (CSP Constructor)",
         "An interactive Content-Security-Policy (CSP) visual builder. Allows security engineers to construct robust policies without syntax errors. "
         "Features directive toggles for default-src, script-src, style-src, img-src, connect-src, font-src, and frame-ancestors. "
         "Supports CSP Level 3 keywords ('strict-dynamic', nonces, hashes), and includes a 'Content-Security-Policy-Report-Only' toggle "
         "to enable safe telemetry testing before full enforcement."),

        ("Tool 3: Diff Benchmark Engine",
         "A regression detection tool designed for pre-deployment auditing. Compares a Baseline URL (e.g., Production) against a Candidate URL (e.g., Staging). "
         "Computes the score delta (+/- points), alerts on weakened or removed headers, highlights newly implemented protections, "
         "and generates a diff matrix to prevent security regressions from reaching production."),

        ("Tool 4: Multi-Stack Remediation Guide",
         "Eliminates the friction between identifying a vulnerability and fixing it. Generates tailored, production-ready configuration snippets "
         "for 6+ web server and framework stacks: (1) Nginx (add_header directives), (2) Apache 2.4 (mod_headers), (3) Caddy, "
         "(4) Cloudflare Workers / Transform Rules, (5) Express.js (Helmet middleware config), and (6) Python Django / Flask (SecurityMiddleware and Talisman)."),

        ("Tool 5: Compare Tool",
         "Enables side-by-side comparative inspection between two arbitrary websites (e.g., comparing your organization's posture against competitors, "
         "or comparing cloud providers). Renders dual grade gauges, comparative vector scores, and a side-by-side header presence matrix."),

        ("Tool 6: Bulk Audit Engine",
         "Built for DevSecOps and penetration testers managing domain portfolios. Audits up to 25 target URLs concurrently with built-in concurrency throttling. "
         "Renders an aggregate letter grade distribution chart, average portfolio score, and enables one-click batch export to CSV and JSON."),

        ("Tool 7: Learn & Security Encyclopedia",
         "An educational knowledge base explaining 12+ security headers in plain English. Includes RFC citations, attack models mitigated "
         "(XSS, Clickjacking, MIME sniffing, Protocol Downgrade), threat severity ratings, and interactive test buttons to scan real-world target implementations."),

        ("Tool 8: Scan History & Telemetry Store",
         "A persistent client-side audit log powered by LocalStorage. Automatically records the last 30 scans with URL, timestamp, score, grade, "
         "and redirect metrics. Supports re-scanning with a single click, multi-scan selection for comparison, and history backup/export."),

        ("Tool 9: Developer API & CLI Documentation",
         "Comprehensive technical documentation for programmatic automation. Details the REST API endpoints, request/response JSON schemas, "
         "and the standalone Python CLI tool (cli/main.py) which supports SARIF 2.1.0 output, customizable failure thresholds (--fail-under 80), "
         "and direct integration into GitHub Actions CI/CD workflows.")
    ]

    for title, desc in tools:
        story.append(Paragraph(title, h2_style))
        story.append(Paragraph(desc, body_style))
        story.append(Spacer(1, 4))

    # ====================================================
    # 4. VIVA DEFENSE PREPARATION GUIDE (15 CORE QUESTIONS)
    # ====================================================
    story.append(PageBreak())
    story.append(Paragraph("4. Academic Viva Defense Guide: 15 Core Questions & Answers", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "This section prepares the candidate for technical questioning by external examiners and professors during project defense.",
        callout_style
    ))
    story.append(Spacer(1, 8))

    qa_list = [
        ("Q1: Why are HTTP security headers necessary if web applications already implement application-level input validation?",
         "A: Application-level validation protects server-side logic from malicious input, but HTTP security headers enforce browser-level security boundaries. For example, Content-Security-Policy (CSP) restricts what scripts can execute even if an attacker successfully injects XSS payloads into the DOM. Similarly, X-Frame-Options prevents Clickjacking regardless of application code, and HSTS enforces encrypted transport before the browser even sends the initial request. They represent defense-in-depth at the protocol level."),

        ("Q2: How does AETHER_SHIELD prevent Server-Side Request Forgery (SSRF) during scanning?",
         "A: AETHER_SHIELD applies multi-tier SSRF protection: (1) It parses the destination hostname and resolves DNS to an IP address. (2) It validates that the IP does not fall into RFC-1918 private subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), loopback (127.0.0.1), or link-local/cloud metadata ranges (169.254.169.254). (3) It pins the validated IP across redirect hops to prevent Time-of-Check to Time-of-Use (TOCTOU) DNS rebinding attacks."),

        ("Q3: What is the difference between CSP Level 2 and CSP Level 3 'strict-dynamic'?",
         "A: In CSP Level 2, developers had to whitelist domain origins (e.g., script-src https://cdn.example.com). This approach proved brittle and vulnerable to JSONP bypasses. CSP Level 3 introduced 'strict-dynamic' with cryptographically random nonces (number used once). With 'strict-dynamic', trust is granted to a root script via a nonce, and any subsequent scripts dynamically created by that trusted root script are automatically trusted, eliminating the need for complex domain whitelists."),

        ("Q4: What is HSTS Preloading and what are the requirements for a domain to be eligible?",
         "A: HSTS Preload is a browser feature where major browsers (Chrome, Firefox, Safari) hardcode domains that must ONLY ever be contacted over HTTPS. This eliminates the vulnerability window during a user's first visit (TOFU - Trust On First Use) where SSL stripping could occur. Requirements: (1) Valid TLS certificate, (2) Redirect all HTTP to HTTPS on port 80, (3) Serve HSTS header with max-age of at least 31536000 (1 year), (4) Include the 'includeSubDomains' directive, and (5) Include the 'preload' flag."),

        ("Q5: Why did you choose SARIF v2.1.0 instead of plain JSON for automated reports?",
         "A: SARIF (Static Analysis Results Interchange Format) is an OASIS standard widely adopted by GitHub Code Scanning, GitLab CI, and Microsoft Azure DevOps. By outputting SARIF 2.1.0, AETHER_SHIELD integrates natively with GitHub Actions, allowing security findings to appear directly as inline code scanning alerts in pull requests with zero third-party plugins."),

        ("Q6: How does the deterministic scoring algorithm avoid false positives?",
         "A: The algorithm evaluates explicit, deterministic rules based on official RFC specifications and OWASP standards rather than heuristic guessing. For example, if a header is present but contains unsafe directives (e.g., CSP with 'unsafe-inline' or 'unsafe-eval'), the rubric assigns partial credit with clear, explainable deduction reasons rather than binary pass/fail judgments."),

        ("Q7: What happens when an audited website has HTTP redirects (e.g. HTTP to HTTPS)?",
         "A: AETHER_SHIELD's redirect tracer tracks each redirect hop sequentially (up to 5 hops). It records the HTTP status code (301, 302, 307, 308), the destination URL, and latency for each hop. The final security score is computed against the terminal response headers that the end user's browser actually receives, while also verifying that the redirect chain properly upgraded from HTTP to HTTPS."),

        ("Q8: How does the web client inspect headers of arbitrary public domains without getting blocked by browser CORS restrictions?",
         "A: Modern browsers restrict web apps from reading raw response headers of cross-origin domains via client-side fetch. AETHER_SHIELD overcomes this using a robust multi-tier fallback pipeline: (1) It attempts direct inspection if CORS permits, (2) Fallback to a high-availability public header proxy (HackerTarget API), and (3) In production environments, requests route through the AETHER_SHIELD Python FastAPI backend, which executes server-side requests with full raw socket header visibility."),

        ("Q9: What is the difference between 'X-Frame-Options: DENY' and CSP 'frame-ancestors none'?",
         "A: X-Frame-Options is an older header defined in RFC 7034 that only supports DENY, SAMEORIGIN, or ALLOW-FROM (deprecated). CSP 'frame-ancestors' is the modern W3C standard. When both are present, CSP frame-ancestors takes precedence according to modern browser specifications. However, serving both is considered best practice for backward compatibility with legacy browsers."),

        ("Q10: Why is 'X-Content-Type-Options: nosniff' so critical even if the server sets Content-Type?",
         "A: Browsers historically implemented 'MIME sniffing' to guess file types if Content-Type was missing or deemed incorrect. An attacker could upload a file containing malicious JavaScript masked as an image (e.g., avatar.jpg). If the browser sniffed the file and executed it as JavaScript, it resulted in XSS. The 'nosniff' directive strictly forces the browser to honor the declared Content-Type, completely mitigating MIME-confusion attacks."),

        ("Q11: What is Permissions-Policy (formerly Feature-Policy) and what does it restrict?",
         "A: Permissions-Policy allows site administrators to declare which hardware and browser APIs can be used by the page or embedded iframes. It allows explicitly disabling access to sensitive sensors and APIs such as geolocation, camera, microphone, accelerometer, payment, and autoplay, drastically reducing the attack surface if a third-party script or ad is compromised."),

        ("Q12: Describe the architecture of your Python CLI tool compared to the Web Application.",
         "A: The CLI tool (cli/main.py) is a self-contained, dependency-free utility written in standard Python. It uses urllib and http.client to perform raw HTTP handshakes, inspect headers, evaluate the scoring rubric, and format results as ANSI terminal tables, JSON, or SARIF files. It returns standard UNIX exit codes (e.g., exit code 1 if score < threshold), making it plug-and-play in shell scripts and automated build pipelines."),

        ("Q13: How is state managed in the web frontend without a dedicated relational database?",
         "A: The frontend utilizes React state combined with HTML5 LocalStorage for persistent client-side telemetry. Scans, comparative pairs, and custom CSP configurations are serialized as structured JSON in LocalStorage, supporting up to 30 persistent history items with zero server-side storage overhead, ensuring complete data privacy for users auditing internal domains."),

        ("Q14: What are Cross-Origin Isolation headers (COOP, COEP, CORP) and why are they evaluated?",
         "A: Post-Spectre and Meltdown, microarchitectural side-channel attacks allowed malicious scripts to read memory across origins. Cross-Origin-Opener-Policy (COOP) and Cross-Origin-Embedder-Policy (COEP) place the web page into a separate browser process group, enabling safe access to high-precision timers (SharedArrayBuffer, performance.now()) without cross-origin memory leakage."),

        ("Q15: What are the primary future enhancements planned for AETHER_SHIELD?",
         "A: Future roadmap milestones include: (1) Automated CSP violation report collector endpoint (report-to / report-uri ingest), (2) Cookie security audit (HttpOnly, Secure, SameSite=Strict/Lax flag evaluation), (3) TLS certificate cipher suite and key exchange validation, and (4) An official GitHub Action in the GitHub Marketplace.")
    ]

    for q, a in qa_list:
        story.append(Paragraph(q, q_style))
        story.append(Paragraph(a, a_style))
        story.append(Spacer(1, 2))

    # ====================================================
    # 5. CANDIDATE PROFILE & CERTIFICATION
    # ====================================================
    story.append(PageBreak())
    story.append(Paragraph("5. Project Candidate Profile & Academic Endorsement", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=8))

    story.append(Paragraph(
        "This project documentation and technical implementation were designed and developed independently by <b>Arya Tiwari</b> "
        "as part of the Computer Science & Engineering curriculum at <b>Bennett University</b>, Greater Noida, India.",
        body_style
    ))

    cand_data = [
        [Paragraph("Candidate Name:", meta_label), Paragraph("Arya Tiwari", meta_val)],
        [Paragraph("Institution:", meta_label), Paragraph("Bennett University, Greater Noida, UP, India", meta_val)],
        [Paragraph("Degree Program:", meta_label), Paragraph("Bachelor of Technology (B.Tech) - Computer Science & Engineering", meta_val)],
        [Paragraph("Specialization:", meta_label), Paragraph("Cybersecurity, Cloud Infrastructure & Web Engineering", meta_val)],
        [Paragraph("Professional Portfolio:", meta_label), Paragraph("https://httpsarya.github.io/Arya_Tiwari_portfolio_12/", meta_val)],
        [Paragraph("GitHub Profile:", meta_label), Paragraph("https://github.com/httpsarya", meta_val)],
        [Paragraph("LinkedIn:", meta_label), Paragraph("https://www.linkedin.com/in/arya-tiwari-01ba84292/", meta_val)],
        [Paragraph("Contact Email:", meta_label), Paragraph("arya2tiwari@gmail.com", meta_val)],
    ]
    cand_table = Table(cand_data, colWidths=[130, 374])
    cand_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, LINE_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, LINE_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(cand_table)
    story.append(Spacer(1, 20))

    story.append(Paragraph("6. Technology Reference Checklist for Viva", h2_style))
    ref_data = [
        [Paragraph("Feature / Standard", meta_label), Paragraph("Specification Reference", meta_label), Paragraph("Status", meta_label)],
        [Paragraph("HTTP Semantics", body_style), Paragraph("RFC 9110 (IETF Standard)", body_style), Paragraph("Verified", body_bold)],
        [Paragraph("HSTS Policy", body_style), Paragraph("RFC 6797 (IETF Standard)", body_style), Paragraph("Verified", body_bold)],
        [Paragraph("Content Security Policy", body_style), Paragraph("W3C Recommendation CSP Level 3", body_style), Paragraph("Verified", body_bold)],
        [Paragraph("SARIF Interchange", body_style), Paragraph("OASIS SARIF v2.1.0", body_style), Paragraph("Verified", body_bold)],
        [Paragraph("MIME Sniffing", body_style), Paragraph("WHATWG MIME Sniffing Standard", body_style), Paragraph("Verified", body_bold)],
        [Paragraph("Cross-Origin Resource Policy", body_style), Paragraph("W3C Cross-Origin Embedder / Opener", body_style), Paragraph("Verified", body_bold)],
    ]
    ref_table = Table(ref_data, colWidths=[160, 244, 100])
    ref_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, LINE_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, LINE_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(ref_table)

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated: {filename}")

if __name__ == "__main__":
    out_file = sys.argv[1] if len(sys.argv) > 1 else "AETHER_SHIELD_Project_Documentation_Viva_Guide.pdf"
    build_pdf(out_file)
