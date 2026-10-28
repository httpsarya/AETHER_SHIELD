# HTTP Security Header Analyzer 🛡️⚡

A deterministic, privacy-first HTTP security header audit engine and remediation code generator designed for modern engineering teams.

![Dark Neon Visual System](frontend/public/hero_shield.jpg)

---

## 🚀 Key Features

- **Stitch Cyber Defense Telemetry Design System**: High-tech tactical aesthetic with obsidian dark mode (`#0A0F1D`), electric cyan & emerald glows, animated concentric pulse gauges, and subtle matrix background.
- **Top Cyber Scanner Bar**: Monospaced `target://` address bar with inline TLS 1.3 indicator, latency meter, HTTP/2 status pill, and instant target presets (`github.com`, `cloudflare.com`, `google.com`, `legacy-internal.dev`).
- **Executive Telemetry Bento Grid**: Bento overview featuring an animated Grade Badge (0–100, A+ to F), SSRF Enforced defense vector, Core Headers baseline, and Threat Mitigation scores.
- **Interactive CSP Rollout Constructor**: Real-time directives toggle builder with cryptographic nonce support and Report-Only vs Active Enforcement modes.
- **Live Header Diff Benchmark**: Direct gap analysis comparing inspected target configurations against the OWASP Secure Headers 2025 Gold Standard.
- **Multi-Stack Remediation Snippets**: One-click copy production configs for **Nginx**, **Apache 2.4**, **Node.js (Express/Helmet)**, **Cloudflare Workers**, and **Python (Django / Flask)**.
- **SSRF & Abuse Protected**: Enforces DNS single-resolution, verifies public global IP routing, and pins IPs across all redirect hops.
- **CI/CD SARIF 2.1 & JSON Exports**: Export native SARIF 2.1.0 for GitHub Code Scanning directly from the UI or CLI.
- **Batch Bulk Scanner & Compare**: Concurrency-throttled bulk scanning and side-by-side header diffs.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Stitch Cyber Defense Telemetry Design System, Lucide Icons |
| **Backend** | Python 3.12+, FastAPI, Pydantic v2, Uvicorn, httpx (async) |
| **Security Controls** | SSRF verification (`ipaddress`, `socket`), redirect validation, port restrictions |
| **CLI & Automation** | Python CLI with SARIF v2.1.0 and configurable `--fail-under` threshold |

---

## 💻 Quickstart

### 1. Start the Backend API
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
- API Health: `http://127.0.0.1:8000/api/v1/health`
- Swagger UI: `http://127.0.0.1:8000/api/docs`

### 2. Start the Frontend Application
```bash
cd frontend
npm.cmd install
npm.cmd run dev
```
- Web Application: `http://localhost:5173/`

### 3. Run Backend Test Suite
```bash
python -m pytest backend/tests
```

### 4. Run CLI Audit
```bash
# Terminal audit
python -m cli.main https://github.com --fail-under 70

# SARIF output for GitHub Actions / CI
python -m cli.main https://github.com --sarif > audit.sarif
```

---

## 👤 Author & Project Maintainer

- **Full Name**: **Arya Tiwari**
- **Professional Title**: CSE Student
- **Institution**: Bennett University
- **Location**: Greater Noida, India
- **Email**: [arya2tiwari@gmail.com](mailto:arya2tiwari@gmail.com)
- **Mobile**: `+91 9999606103`
- **Portfolio**: [httpsarya.github.io/Arya_Tiwari_portfolio_12/](https://httpsarya.github.io/Arya_Tiwari_portfolio_12/)
- **GitHub**: [@httpsarya](https://github.com/httpsarya)
- **LinkedIn**: [in/arya-tiwari-01ba84292](https://www.linkedin.com/in/arya-tiwari-01ba84292/)

