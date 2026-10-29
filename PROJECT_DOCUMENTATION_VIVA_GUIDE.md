# AETHER_SHIELD // Project Technical Documentation & Viva Defense Guide

**Deterministic HTTP Security Header Analyzer & Multi-Stack Remediation Engine**  
*Academic Project Viva Examination Preparation Document*

---

### Project & Candidate Metadata
| Property | Value |
| :--- | :--- |
| **Project Architect** | **Arya Tiwari** |
| **Academic Program** | Bachelor of Technology (B.Tech) — Computer Science & Engineering |
| **Institution** | Bennett University, Greater Noida, UP, India |
| **Specialization** | Cybersecurity, Web Systems & Cloud Infrastructure |
| **System Classification** | Sec-Ops Deterministic HTTP Security Header Inspector & Config Synthesizer |
| **Standards Implemented** | RFC-9110 (HTTP), RFC-6797 (HSTS), W3C CSP Level 3, OASIS SARIF v2.1.0 |
| **GitHub Repository** | [https://github.com/httpsarya/AETHER_SHIELD](https://github.com/httpsarya/AETHER_SHIELD) |
| **Live Deployed Application** | [https://httpsarya.github.io/AETHER_SHIELD/](https://httpsarya.github.io/AETHER_SHIELD/) |
| **Candidate Portfolio** | [https://httpsarya.github.io/Arya_Tiwari_portfolio_12/](https://httpsarya.github.io/Arya_Tiwari_portfolio_12/) |
| **Direct Contact** | arya2tiwari@gmail.com • [LinkedIn Profile](https://www.linkedin.com/in/arya-tiwari-01ba84292/) |

---

## 1. Executive Summary & Problem Statement

### 1.1 The Threat Model
Modern web applications are increasingly vulnerable to client-side attacks that execute directly inside the user's browser:
1. **Cross-Site Scripting (XSS)**: Injection of malicious JavaScript that steals session tokens, keystrokes, and sensitive state.
2. **Clickjacking (UI Redressing)**: Embedding target sites inside transparent iframes to trick users into performing unauthorized actions.
3. **MIME Confusion & Sniffing**: Forcing browsers to execute uploaded data (e.g., avatars or documents) as executable scripts.
4. **SSL Stripping & Downgrade Attacks**: Intercepting unencrypted initial HTTP handshakes to strip encryption (MitM attacks).
5. **Cross-Site Leaks (XS-Leaks) & Side-Channel Attacks**: Exploiting Spectre/Meltdown microarchitectural CPU flaws through high-resolution browser timers.

### 1.2 The Industry Problem
While engineering teams spend enormous resources securing application code, over **70% of production websites omit or misconfigure fundamental HTTP security headers**. The root causes include:
- Intimidating, complex directive syntax in modern specifications (such as CSP Level 3).
- Different configuration formats across web servers (Nginx vs Apache vs Express vs Cloudflare).
- Fear of breaking legacy third-party scripts and marketing pixels.
- The lack of deterministic, transparent scoring tools that can fail builds in automated CI/CD pipelines.

### 1.3 The AETHER_SHIELD Solution
**AETHER_SHIELD** is a deterministic, SSRF-protected HTTP security header inspection and remediation platform. It provides:
- **Transparent 0–100 rubric scoring** and letter grades (A+ to F).
- **Zero-trust SSRF protection** blocking private, loopback, and cloud metadata IPs.
- **Single-resolution DNS pinning** across redirect hops.
- **An interactive CSP constructor** supporting CSP Level 3 `strict-dynamic` and Report-Only mode.
- **Diff benchmarking** to detect security regressions between environments.
- **Batch scanning** of up to 25 domains concurrently.
- **Instant multi-stack configuration synthesis** for 6+ server stacks.
- **SARIF v2.1.0 export** for native integration into GitHub Code Scanning.

---

## 2. Technical Architecture & Engineering Deep-Dive

### 2.1 Technology Stack & Design Decisions
- **Frontend Framework**: React 18 with TypeScript for type safety, maintainability, and deterministic UI state.
- **Build Tooling**: Vite 6 for sub-second hot-module replacement (HMR) and optimized rollup production bundles.
- **Design System**: Vanilla CSS with customized Stitch Cyber Defense tokens (Obsidian `#0A0F1D`, Electric Cyan `#00F0FF`, Emerald `#10B981`). Eliminates heavy CSS runtime dependencies while delivering a military-grade sec-ops cockpit.
- **Ingestion Pipeline**: Multi-tier architecture combining direct origin inspection, public CORS proxy fallback (HackerTarget API), and a dedicated Python FastAPI backend for server-side socket inspection.
- **CLI & Automation**: Independent, zero-dependency Python 3 CLI (`cli/main.py`) utilizing `urllib` and `http.client` for automated terminal execution with exit code assertions.
- **State Persistence**: HTML5 LocalStorage serialization supporting persistent client-side telemetry (last 30 audits) with zero external database dependencies, preserving user privacy.

### 2.2 SSRF & Abuse Prevention Mechanism
Web-based audit engines can easily be abused to launch **Server-Side Request Forgery (SSRF)** attacks against internal infrastructure. AETHER_SHIELD implements defense-in-depth safeguards:
1. **Private Subnet Filter**: Denies all RFC-1918 subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).
2. **Loopback & Link-Local Filter**: Denies localhost (`127.0.0.0/8`, `::1`) and link-local ranges (`169.254.0.0/16`).
3. **Cloud Metadata Shield**: Explicitly blocks instance metadata hostnames (`169.254.169.254`, `metadata.google.internal`).
4. **DNS Pinning & Single-Resolution**: The target hostname is resolved to an IP once. That exact IP is pinned across all HTTP redirect hops to eliminate DNS rebinding (TOCTOU) exploits.

### 2.3 Deterministic 0–100 Scoring Rubric

The scoring algorithm assigns points mathematically across 7 core vectors (Total = 100 Points):

| Security Header | Max Weight | Evaluation Criteria & Penalty Rules |
| :--- | :---: | :--- |
| **Content-Security-Policy (CSP)** | **25 pts** | **Full Credit (25)**: Strict `script-src` with nonces/hashes or restrictive origins.<br>**Penalties**: `-10` for `'unsafe-inline'`, `-8` for `'unsafe-eval'`, `-10` for wildcard `*` hosts, `-5` for missing `object-src 'none'`. |
| **Strict-Transport-Security (HSTS)** | **20 pts** | **Full Credit (20)**: `max-age >= 31536000` (1 year) + `includeSubDomains` + `preload`.<br>**Penalties**: `-5` for `max-age` < 1 year, `-5` for missing `includeSubDomains`, `-2` for missing `preload`. |
| **X-Frame-Options / frame-ancestors** | **15 pts** | **Full Credit (15)**: `DENY` or CSP `frame-ancestors 'none'`.<br>**Partial (10)**: `SAMEORIGIN`.<br>**Zero (0)**: Framing completely unrestricted (vulnerable to Clickjacking). |
| **X-Content-Type-Options** | **10 pts** | **Full Credit (10)**: `nosniff`.<br>**Zero (0)**: Missing (vulnerable to MIME type confusion / script sniffing). |
| **Referrer-Policy** | **10 pts** | **Full Credit (10)**: `strict-origin-when-cross-origin`, `same-origin`, or `no-referrer`.<br>**Penalties**: `-6` for `unsafe-url` or `no-referrer-when-downgrade`. |
| **Permissions-Policy** | **10 pts** | **Full Credit (10)**: Explicitly restricts camera, microphone, geolocation, and payment APIs.<br>**Penalties**: `-5` for unrestricted policy or legacy `Feature-Policy`. |
| **Cross-Origin Isolation (COOP/COEP/CORP)** | **10 pts** | **Full Credit (10)**: Isolates browser process groups via `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy` against Spectre side-channel attacks. |

#### Letter Grade Mapping
- **A+ (95–100)**: Exemplary posture. All critical headers configured with strict directives.
- **A (85–94)**: Strong defense. Minor optimizations recommended (e.g. adding HSTS preload).
- **B (70–84)**: Moderate posture. Permissive directives present (e.g., `'unsafe-inline'`).
- **C (55–69)**: Weak posture. Missing key framing or transport hardening.
- **D (40–54)**: Vulnerable. Multiple missing security headers.
- **F (0–39)**: Critical risk. Completely unhardened server configuration.

---

## 3. Comprehensive Walkthrough of All 9 Tools

### Tool 1: Real-Time Scanner (`currentTab === 'scanner'`)
- **Functionality**: Core analysis engine. Accepts an arbitrary HTTP/HTTPS URL, validates DNS, follows up to 5 redirect hops, and ingests response headers.
- **Outputs**:
  - Tactical Grade Gauge (0–100 score + letter grade).
  - Security Vector Progress Bars.
  - Interactive Findings Cards categorized as Pass (Emerald), Warning (Amber), or Fail (Rose).
  - Redirect Hop Timeline with IP pinning details and latency.
  - Raw Headers Inspector with search and syntax highlighting.

### Tool 2: Policy Generator / CSP Constructor (`currentTab === 'csp'`)
- **Functionality**: Interactive Content-Security-Policy visual builder.
- **Directives Supported**: `default-src`, `script-src`, `style-src`, `img-src`, `connect-src`, `font-src`, `object-src`, `frame-ancestors`, and `base-uri`.
- **Special Features**:
  - CSP Level 3 keywords (`'strict-dynamic'`, nonces, hashes).
  - Toggle between Enforced mode (`Content-Security-Policy`) and Report-Only mode (`Content-Security-Policy-Report-Only`) for safe staging telemetry.
  - Copy-to-clipboard for immediate deployment.

### Tool 3: Diff Benchmark Engine (`currentTab === 'diff'`)
- **Functionality**: Pre-deployment regression detection.
- **Operation**: Compares a **Baseline URL** (e.g., Production) against a **Candidate URL** (e.g., Staging).
- **Metrics**: Computes score delta (`+` or `-` points), alerts on newly introduced weaknesses or removed headers, and highlights newly gained protections.

### Tool 4: Multi-Stack Remediation Guide (`currentTab === 'fixes'`)
- **Functionality**: Instant copy-paste server configuration generator.
- **Supported Stacks**:
  1. **Nginx**: `add_header` directives with `always` parameter.
  2. **Apache 2.4**: `mod_headers` configuration (`Header set` directives).
  3. **Caddy Server**: Clean `header` block configuration.
  4. **Cloudflare**: Transform Rules & Workers response header modification.
  5. **Node.js / Express**: Pre-configured `helmet()` middleware snippet.
  6. **Python (Django & Flask)**: `SecurityMiddleware` and `Flask-Talisman` setups.

### Tool 5: Compare Tool (`currentTab === 'compare'`)
- **Functionality**: Side-by-side comparative inspection between two arbitrary domains.
- **Outputs**: Dual interactive grade gauges, comparative vector scores, and a unified header differential matrix.

### Tool 6: Bulk Audit Engine (`currentTab === 'bulk'`)
- **Functionality**: High-throughput audit tool for DevSecOps managing domain portfolios.
- **Capacity**: Audits up to 25 target URLs in parallel with concurrency rate limiting.
- **Outputs**: Aggregate portfolio grade distribution chart, average portfolio score, and batch CSV/JSON export.

### Tool 7: Learn & Security Encyclopedia (`currentTab === 'learn'`)
- **Functionality**: Educational encyclopedia covering 12+ HTTP security headers.
- **Details Provided**: Plain-English explanation, RFC standard references, attack vectors mitigated, and real-world breach case studies.

### Tool 8: Scan History & Telemetry Store (`currentTab === 'history'`)
- **Functionality**: Persistent client-side audit history powered by HTML5 LocalStorage.
- **Features**: Records last 30 scans with timestamps, scores, and redirect metrics. Allows one-click re-scanning, comparative selection, and history purging.

### Tool 9: Developer API & CLI Docs (`currentTab === 'api'`)
- **Functionality**: Programmatic automation manual.
- **Coverage**: Documents RESTful endpoint schemas, request/response JSON payloads, and CLI commands for automated terminal pipelines.

---

## 4. Academic Viva Defense Guide: 15 Core Questions & Model Answers

### Q1: Why are HTTP security headers necessary if web applications already validate input on the backend?
> **Model Answer:** Backend input validation protects server logic and database integrity, but HTTP security headers enforce browser-level security boundaries. For example, Content-Security-Policy (CSP) restricts script execution inside the user's browser even if an attacker successfully injects an XSS payload into the DOM. Similarly, X-Frame-Options prevents Clickjacking regardless of application code, and HSTS enforces HTTPS encryption before the browser sends the initial request. They represent defense-in-depth at the protocol layer.

### Q2: How does AETHER_SHIELD protect against Server-Side Request Forgery (SSRF)?
> **Model Answer:** AETHER_SHIELD applies multi-tier defense: (1) It parses the destination hostname and resolves DNS to an IP. (2) It validates that the IP does not belong to RFC-1918 private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), loopback (`127.0.0.1`), or link-local/cloud metadata ranges (`169.254.169.254`). (3) It pins the validated IP across all redirect hops to prevent Time-of-Check to Time-of-Use (TOCTOU) DNS rebinding attacks.

### Q3: Explain the difference between CSP Level 2 and Level 3 'strict-dynamic'.
> **Model Answer:** In CSP Level 2, developers had to maintain whitelist domains (e.g., `script-src https://cdn.example.com`). This was brittle and prone to JSONP bypasses. CSP Level 3 introduced `'strict-dynamic'` with cryptographically random nonces. Trust is granted to a root script via a nonce; any subsequent scripts dynamically created by that trusted root script are automatically trusted, eliminating domain whitelists.

### Q4: What is HSTS Preloading and what are the requirements to be on the Chrome preload list?
> **Model Answer:** HSTS Preload is a browser feature where major browsers (Chrome, Firefox, Safari) hardcode domains that must ONLY ever be contacted over HTTPS, eliminating the initial Trust-On-First-Use (TOFU) vulnerability window where SSL stripping could occur. Requirements: (1) Valid TLS certificate, (2) Redirect all HTTP traffic to HTTPS on port 80, (3) Serve HSTS header with `max-age` of at least 31,536,000 seconds (1 year), (4) Include `includeSubDomains`, and (5) Include the `preload` flag.

### Q5: Why did you choose SARIF v2.1.0 format instead of plain JSON for automated reports?
> **Model Answer:** SARIF (Static Analysis Results Interchange Format) is an OASIS standard widely adopted by GitHub Code Scanning, GitLab CI, and Microsoft Azure DevOps. By outputting SARIF 2.1.0, AETHER_SHIELD integrates natively with GitHub Actions, allowing security findings to appear directly as inline code scanning alerts in pull requests with zero third-party plugins.

### Q6: How does the deterministic scoring rubric avoid false positives?
> **Model Answer:** The algorithm evaluates explicit, deterministic rules based on official RFC specifications and OWASP standards rather than heuristic guessing. For example, if a header is present but contains unsafe directives (e.g., CSP with `'unsafe-inline'` or `'unsafe-eval'`), the rubric assigns partial credit with clear, explainable deduction reasons rather than binary pass/fail judgments.

### Q7: What happens when an audited website has HTTP redirects (e.g., HTTP to HTTPS)?
> **Model Answer:** AETHER_SHIELD's redirect tracer tracks each redirect hop sequentially (up to 5 hops). It records the HTTP status code (301, 302, 307, 308), destination URL, IP address, and latency for each hop. The final security score is computed against the terminal response headers that the browser actually receives, while also verifying that the redirect chain properly upgraded from HTTP to HTTPS.

### Q8: How does the web client inspect headers of arbitrary public domains without getting blocked by browser CORS restrictions?
> **Model Answer:** Browsers restrict client-side `fetch` from reading raw response headers of cross-origin domains. AETHER_SHIELD overcomes this using a robust multi-tier fallback pipeline: (1) Direct client inspection if CORS allows, (2) Fallback to a high-availability public header proxy (HackerTarget API), and (3) In production environments, requests route through the AETHER_SHIELD Python FastAPI backend, which executes server-side requests with full raw socket header visibility.

### Q9: What is the difference between 'X-Frame-Options: DENY' and CSP 'frame-ancestors none'?
> **Model Answer:** `X-Frame-Options` is a legacy header defined in RFC 7034 supporting `DENY` and `SAMEORIGIN`. CSP `frame-ancestors` is the modern W3C standard. When both are present, modern browsers give precedence to CSP `frame-ancestors`. However, serving both is considered best practice for backward compatibility with legacy browsers.

### Q10: What is the significance of 'X-Content-Type-Options: nosniff'?
> **Model Answer:** Browsers historically implemented "MIME sniffing" to guess file types if Content-Type was missing or deemed incorrect. An attacker could upload a file containing malicious JavaScript masked as an image (e.g., `avatar.jpg`). If the browser sniffed the file and executed it as JavaScript, it resulted in XSS. The `nosniff` directive strictly forces the browser to honor the declared Content-Type, completely mitigating MIME-confusion attacks.

### Q11: What is Permissions-Policy (formerly Feature-Policy) and what does it restrict?
> **Model Answer:** Permissions-Policy allows site administrators to declare which hardware and browser APIs can be used by the page or embedded iframes. It allows explicitly disabling access to sensitive sensors and APIs such as geolocation, camera, microphone, accelerometer, payment, and autoplay, drastically reducing the attack surface if a third-party script or ad is compromised.

### Q12: Describe the architecture of your Python CLI tool compared to the Web Application.
> **Model Answer:** The CLI tool (`cli/main.py`) is a self-contained, dependency-free utility written in standard Python. It uses `urllib` and `http.client` to perform raw HTTP handshakes, inspect headers, evaluate the scoring rubric, and format results as ANSI terminal tables, JSON, or SARIF files. It returns standard UNIX exit codes (e.g., exit code 1 if score < threshold), making it plug-and-play in shell scripts and automated build pipelines.

### Q13: How is state managed in the web frontend without a dedicated relational database?
> **Model Answer:** The frontend utilizes React state combined with HTML5 LocalStorage for persistent client-side telemetry. Scans, comparative pairs, and custom CSP configurations are serialized as structured JSON in LocalStorage, supporting up to 30 persistent history items with zero server-side storage overhead, ensuring complete data privacy for users auditing internal domains.

### Q14: What are Cross-Origin Isolation headers (COOP, COEP, CORP) and why are they evaluated?
> **Model Answer:** Post-Spectre and Meltdown, microarchitectural side-channel attacks allowed malicious scripts to read memory across origins. Cross-Origin-Opener-Policy (COOP) and Cross-Origin-Embedder-Policy (COEP) place the web page into a separate browser process group, enabling safe access to high-precision timers (`SharedArrayBuffer`, `performance.now()`) without cross-origin memory leakage.

### Q15: What are the primary future enhancements planned for AETHER_SHIELD?
> **Model Answer:** Future roadmap milestones include: (1) Automated CSP violation report collector endpoint (`report-to` / `report-uri` ingest), (2) Cookie security audit (`HttpOnly`, `Secure`, `SameSite=Strict/Lax` flag evaluation), (3) TLS certificate cipher suite and key exchange validation, and (4) An official GitHub Action in the GitHub Marketplace.

---

## 5. Technology Standards & RFC Compliance Matrix

| Standard / Protocol | Formal Specification | Role in AETHER_SHIELD |
| :--- | :--- | :--- |
| **HTTP/1.1 & HTTP/2** | RFC 9110 / RFC 9113 | Raw header parsing, multi-line header folding, status codes |
| **HSTS** | RFC 6797 | Strict-Transport-Security directives and preload evaluation |
| **Content Security Policy** | W3C CSP Level 3 | Directive evaluation, nonces, strict-dynamic, and CSP builder |
| **SARIF** | OASIS Standard v2.1.0 | Machine-readable security alerts for CI/CD and GitHub Code Scanning |
| **MIME Sniffing** | WHATWG Standard | X-Content-Type-Options nosniff validation |
| **Cross-Origin Policies** | W3C COOP / COEP / CORP | Spectre and Meltdown process isolation verification |
| **Frame Options** | RFC 7034 | Clickjacking defense evaluation |

---

*Document compiled for Arya Tiwari • Bennett University • Greater Noida, UP, India*  
*AETHER_SHIELD © 2026. All rights reserved.*
