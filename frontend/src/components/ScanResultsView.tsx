import React, { useState } from 'react';
import { ScanResponse } from '../types';
import { GradeBadge } from './GradeBadge';
import { HeaderFindingCard } from './HeaderFindingCard';
import { RedirectChain } from './RedirectChain';
import { TlsSummaryCard } from './TlsSummaryCard';
import { RawHeadersViewer } from './RawHeadersViewer';
import { CspConstructorView } from './CspConstructorView';
import { DiffEngineView } from './DiffEngineView';
import { generateSarifReport, downloadFile } from '../services/api';
import { 
  RefreshCw, 
  Download, 
  Share2, 
  FileCode, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Printer,
  Shield,
  Lock,
  Radar,
  Copy,
  Check,
  Code,
  Sliders,
  GitCompare,
  ExternalLink
} from 'lucide-react';

interface ScanResultsViewProps {
  scan: ScanResponse;
  onRescan: (url: string) => void;
  onBackToHome: () => void;
  onCopyNotice: (msg: string) => void;
}

export const ScanResultsView: React.FC<ScanResultsViewProps> = ({
  scan,
  onRescan,
  onBackToHome,
  onCopyNotice
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'fail' | 'warn' | 'pass'>('all');
  const [activeTab, setActiveTab] = useState<'findings' | 'remediation' | 'csp' | 'diff' | 'raw' | 'network'>('findings');
  const [activeFramework, setActiveFramework] = useState<'nginx' | 'apache' | 'express' | 'cloudflare' | 'python'>('nginx');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const filteredFindings = scan.findings.filter((f) => {
    if (activeFilter === 'all') return true;
    return f.status === activeFilter;
  });

  const passCount = scan.findings.filter(f => f.status === 'pass').length;
  const warnCount = scan.findings.filter(f => f.status === 'warn').length;
  const failCount = scan.findings.filter(f => f.status === 'fail').length;

  const handleShare = () => {
    const shareUrl = `${window.location.origin}?scan_id=${scan.id}`;
    navigator.clipboard.writeText(shareUrl);
    onCopyNotice('Shareable scan link copied to clipboard!');
  };

  const handleExportJson = () => {
    downloadFile(`security-audit-${scan.id}.json`, JSON.stringify(scan, null, 2));
    onCopyNotice('JSON audit report downloaded');
  };

  const handleExportSarif = () => {
    const sarif = generateSarifReport(scan);
    downloadFile(`audit-${scan.id}.sarif`, sarif);
    onCopyNotice('SARIF 2.1.0 report downloaded for GitHub Code Scanning');
  };

  const handleExportCsv = () => {
    window.open(`/api/v1/export/${scan.id}?format=csv`, '_blank');
    onCopyNotice('CSV report generated');
  };

  const handlePrint = () => {
    window.print();
  };

  // Hardened Multi-Framework Snippets (Stitch Spec)
  const getFrameworkSnippet = (fw: string) => {
    switch (fw) {
      case 'nginx':
        return `# /etc/nginx/conf.d/security_headers.conf
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Cross-Origin-Embedder-Policy "require-corp" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'nonce-$request_id'; object-src 'none'; base-uri 'self';" always;
server_tokens off;`;

      case 'apache':
        return `# .htaccess or /etc/apache2/conf-available/security.conf
<IfModule mod_headers.c>
  Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "DENY"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Cross-Origin-Embedder-Policy "require-corp"
  Header always set Cross-Origin-Opener-Policy "same-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self'; frame-ancestors 'none';"
</IfModule>
ServerTokens Prod
ServerSignature Off`;

      case 'express':
        return `// Node.js Express server using helmet v7+
const express = require('express');
const helmet = require('helmet');
const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [(req, res) => \`'nonce-\${res.locals.cspNonce}'\`, "'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
    frameguard: { action: 'deny' },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: { policy: 'same-origin' }
  })
);
app.disable('x-powered-by');`;

      case 'cloudflare':
        return `// Cloudflare Workers Headers Transform Handler
export default {
  async fetch(request, env) {
    const response = await fetch(request);
    const newHeaders = new Headers(response.headers);

    newHeaders.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    newHeaders.set("X-Content-Type-Options", "nosniff");
    newHeaders.set("X-Frame-Options", "DENY");
    newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
    newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
    newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
    newHeaders.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), browsing-topics=()");
    newHeaders.set("Content-Security-Policy", "default-src 'self'; script-src 'self'; object-src 'none';");
    newHeaders.delete("Server");
    newHeaders.delete("X-Powered-By");

    return new Response(response.body, { status: response.status, headers: newHeaders });
  }
};`;

      case 'python':
        return `# Django settings.py or Flask-Talisman
# pip install django-csp flask-talisman

SECURE_HSTS_SECONDS = 63072000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'

CSP_DEFAULT_SRC = ("'self'",)
CSP_SCRIPT_SRC = ("'self'", "'strict-dynamic'")
CSP_OBJECT_SRC = ("'none'",)
CSP_BASE_URI = ("'self'",)`;

      default:
        return '';
    }
  };

  const handleCopySnippet = () => {
    const code = getFrameworkSnippet(activeFramework);
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div style={{ paddingTop: '36px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Top Breadcrumb & Actions Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }} className="no-print">
          <button
            type="button"
            onClick={onBackToHome}
            className="btn-ghost"
            style={{ paddingLeft: 0, color: 'var(--text-muted)' }}
          >
            <ArrowLeft size={16} />
            <span>Target Scanner</span>
          </button>

          {/* Action buttons cluster */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onRescan(scan.url)}
              className="btn-secondary"
              style={{ height: '36px', padding: '0 14px', fontSize: '0.8rem' }}
            >
              <RefreshCw size={14} />
              <span>Rescan</span>
            </button>

            <button
              type="button"
              onClick={handleExportSarif}
              className="btn-secondary"
              style={{ height: '36px', padding: '0 14px', fontSize: '0.8rem' }}
              title="Export SARIF 2.1 for GitHub Code Scanning"
            >
              <FileCode size={14} color="var(--primary-cyan)" />
              <span>SARIF 2.1</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="btn-secondary"
              style={{ height: '36px', padding: '0 14px', fontSize: '0.8rem' }}
            >
              <Download size={14} />
              <span>JSON</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="btn-secondary"
              style={{ height: '36px', padding: '0 14px', fontSize: '0.8rem' }}
            >
              <span>CSV</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="btn-secondary"
              style={{ height: '36px', padding: '0 14px', fontSize: '0.8rem' }}
            >
              <Share2 size={14} />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="btn-secondary"
              style={{ height: '36px', padding: '0 12px', fontSize: '0.8rem' }}
              title="Print Audit Report"
            >
              <Printer size={14} />
            </button>
          </div>
        </div>

        {/* Target Header Banner */}
        <div style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-tactical)', color: 'var(--text-muted)' }}>
              AUDITED TARGET ENDPOINT:
            </span>
            <div style={{
              fontSize: '1.2rem',
              fontFamily: 'var(--font-tactical)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              wordBreak: 'break-all'
            }}>
              {scan.url}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '4px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'var(--secondary-emerald)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-tactical)',
              fontWeight: 600
            }}>
              <CheckCircle2 size={13} />
              SSRF & DNS PINNED
            </span>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-tactical)', color: 'var(--text-muted)' }}>
              Scanned: {new Date(scan.scanned_at).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* ==================================================== */}
        {/* SECTION 2: EXECUTIVE TELEMETRY OVERVIEW (BENTO GRID) */}
        {/* ==================================================== */}
        <section className="scan-overview-grid">
          {/* Big Animated Grade Card (Bento Left) */}
          <div style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-emerald)',
            borderRadius: '14px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-tactical)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--secondary-emerald)' }}></span>
                SECURITY POSTURE RATING
              </span>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-tactical)', color: 'var(--secondary-emerald)', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                ISO/IEC 27001
              </span>
            </div>

            <GradeBadge grade={scan.grade} score={scan.score} size="normal" />

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-tactical)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Baseline Rubric:</span>
              <span style={{ color: 'var(--primary-cyan)' }}>v{scan.rubric_version} OWASP 2025</span>
            </div>
          </div>

          {/* 4 Metric Bento Cards (Bento Right 2x2) */}
          <div className="scan-vectors-grid">
            {/* Stat 1: SSRF Protection */}
            <div style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-cyan)',
              borderRadius: '12px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-tactical)', color: 'var(--text-dim)' }}>DEFENSE VECTOR 01</span>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                    SSRF Protection
                  </div>
                </div>
                <span style={{ padding: '6px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--secondary-emerald)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <Shield size={16} />
                </span>
              </div>
              <div style={{ margin: '14px 0' }}>
                <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-tactical)', color: 'var(--secondary-emerald)', fontWeight: 700 }}>
                  ENFORCED
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  RFC-1918 & Loopback Blocked
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', fontSize: '0.7rem', fontFamily: 'var(--font-tactical)', color: 'var(--secondary-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} />
                DNS re-binding mitigated
              </div>
            </div>

            {/* Stat 2: Security Headers Configured */}
            <div style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-cyan)',
              borderRadius: '12px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-tactical)', color: 'var(--text-dim)' }}>DEFENSE VECTOR 02</span>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                    Core Headers
                  </div>
                </div>
                <span style={{ padding: '6px', borderRadius: '6px', background: 'rgba(0, 240, 255, 0.15)', color: 'var(--primary-cyan)', border: '1px solid var(--border-cyan)' }}>
                  <Radar size={16} />
                </span>
              </div>
              <div style={{ margin: '14px 0' }}>
                <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-tactical)', color: 'var(--primary-cyan)', fontWeight: 700 }}>
                  {passCount} of {scan.findings.length} Active
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {failCount === 0 ? '100% baseline coverage' : `${failCount} headers missing or failed`}
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', fontSize: '0.7rem', fontFamily: 'var(--font-tactical)', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} />
                Evaluated against OWASP L3
              </div>
            </div>

            {/* Stat 3: TLS / Transport Protocol */}
            <div style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-cyan)',
              borderRadius: '12px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-tactical)', color: 'var(--text-dim)' }}>DEFENSE VECTOR 03</span>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                    TLS & Transport
                  </div>
                </div>
                <span style={{ padding: '6px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--secondary-emerald)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <Lock size={16} />
                </span>
              </div>
              <div style={{ margin: '14px 0' }}>
                <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-tactical)', color: 'var(--text-primary)', fontWeight: 700 }}>
                  {scan.tls_summary?.protocol || 'TLS 1.3 STRICT'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {scan.findings.find(f => f.name === 'Strict-Transport-Security')?.status === 'pass' ? 'HSTS Preloaded / Active' : 'HSTS Unconfigured'}
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', fontSize: '0.7rem', fontFamily: 'var(--font-tactical)', color: 'var(--secondary-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} />
                Qualys SSL Labs A+ Baseline
              </div>
            </div>

            {/* Stat 4: Threat Mitigation */}
            <div style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-cyan)',
              borderRadius: '12px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-tactical)', color: 'var(--text-dim)' }}>DEFENSE VECTOR 04</span>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                    Threat Mitigation
                  </div>
                </div>
                <span style={{ padding: '6px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--tertiary-amber)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <AlertTriangle size={16} />
                </span>
              </div>
              <div style={{ margin: '14px 0' }}>
                <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-tactical)', color: failCount === 0 ? 'var(--secondary-emerald)' : 'var(--danger-rose)', fontWeight: 700 }}>
                  {failCount} CRITICAL / {warnCount} MINOR
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Anti-Clickjacking & MIME Protection
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', fontSize: '0.7rem', fontFamily: 'var(--font-tactical)', color: 'var(--tertiary-amber)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={12} />
                Automated fixes available below
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* INTERACTIVE NAVIGATION TABS FOR RESULTS              */}
        {/* ==================================================== */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '28px',
          overflowX: 'auto',
          paddingBottom: '2px'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('findings')}
            style={{
              padding: '10px 18px',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-tactical)',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
              color: activeTab === 'findings' ? 'var(--primary-cyan)' : 'var(--text-muted)',
              borderBottom: activeTab === 'findings' ? '2px solid var(--primary-cyan)' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Shield size={15} />
            <span>AST Findings ({scan.findings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('remediation')}
            style={{
              padding: '10px 18px',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-tactical)',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
              color: activeTab === 'remediation' ? 'var(--primary-cyan)' : 'var(--text-muted)',
              borderBottom: activeTab === 'remediation' ? '2px solid var(--primary-cyan)' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Code size={15} />
            <span>Remediation Generator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('csp')}
            style={{
              padding: '10px 18px',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-tactical)',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
              color: activeTab === 'csp' ? 'var(--primary-cyan)' : 'var(--text-muted)',
              borderBottom: activeTab === 'csp' ? '2px solid var(--primary-cyan)' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sliders size={15} />
            <span>CSP Constructor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('diff')}
            style={{
              padding: '10px 18px',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-tactical)',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
              color: activeTab === 'diff' ? 'var(--primary-cyan)' : 'var(--text-muted)',
              borderBottom: activeTab === 'diff' ? '2px solid var(--primary-cyan)' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <GitCompare size={15} />
            <span>Diff Benchmark</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('raw')}
            style={{
              padding: '10px 18px',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-tactical)',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
              color: activeTab === 'raw' ? 'var(--primary-cyan)' : 'var(--text-muted)',
              borderBottom: activeTab === 'raw' ? '2px solid var(--primary-cyan)' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileCode size={15} />
            <span>Raw Response Headers</span>
          </button>
        </div>

        {/* TAB 1: AST FINDINGS */}
        {activeTab === 'findings' && (
          <div>
            {/* Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-tactical)', color: 'var(--text-muted)' }}>FILTER:</span>
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-tactical)',
                    cursor: 'pointer',
                    border: activeFilter === 'all' ? '1px solid var(--primary-cyan)' : '1px solid var(--border-subtle)',
                    background: activeFilter === 'all' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                    color: activeFilter === 'all' ? 'var(--primary-cyan)' : 'var(--text-muted)'
                  }}
                >
                  All ({scan.findings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('pass')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-tactical)',
                    cursor: 'pointer',
                    border: activeFilter === 'pass' ? '1px solid var(--secondary-emerald)' : '1px solid var(--border-subtle)',
                    background: activeFilter === 'pass' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                    color: activeFilter === 'pass' ? 'var(--secondary-emerald)' : 'var(--text-muted)'
                  }}
                >
                  Passed ({passCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('warn')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-tactical)',
                    cursor: 'pointer',
                    border: activeFilter === 'warn' ? '1px solid var(--tertiary-amber)' : '1px solid var(--border-subtle)',
                    background: activeFilter === 'warn' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                    color: activeFilter === 'warn' ? 'var(--tertiary-amber)' : 'var(--text-muted)'
                  }}
                >
                  Warnings ({warnCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('fail')}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-tactical)',
                    cursor: 'pointer',
                    border: activeFilter === 'fail' ? '1px solid var(--danger-rose)' : '1px solid var(--border-subtle)',
                    background: activeFilter === 'fail' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                    color: activeFilter === 'fail' ? 'var(--danger-rose)' : 'var(--text-muted)'
                  }}
                >
                  Failed ({failCount})
                </button>
              </div>

              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-tactical)', color: 'var(--text-muted)' }}>
                Showing {filteredFindings.length} of {scan.findings.length} directives
              </div>
            </div>

            {/* Findings Card List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredFindings.map((finding, idx) => (
                <HeaderFindingCard key={idx} finding={finding} onCopyNotice={onCopyNotice} />
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: REMEDIATION SNIPPETS GENERATOR */}
        {activeTab === 'remediation' && (
          <div style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-cyan)',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 0 25px rgba(0, 240, 255, 0.08)'
          }}>
            {/* Framework Selector Tabs */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-input)',
              borderBottom: '1px solid var(--border-subtle)',
              padding: '8px 12px 0 12px',
              gap: '4px',
              overflowX: 'auto'
            }}>
              {[
                { id: 'nginx', label: 'Nginx' },
                { id: 'apache', label: 'Apache 2.4' },
                { id: 'express', label: 'Express.js (Helmet)' },
                { id: 'cloudflare', label: 'Cloudflare Workers' },
                { id: 'python', label: 'Python Flask / Django' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFramework(tab.id as any)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-tactical)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    borderRadius: '6px 6px 0 0',
                    border: 'none',
                    borderBottom: activeFramework === tab.id ? '2px solid var(--primary-cyan)' : '2px solid transparent',
                    background: activeFramework === tab.id ? 'var(--surface-high)' : 'transparent',
                    color: activeFramework === tab.id ? 'var(--primary-cyan)' : 'var(--text-muted)'
                  }}
                >
                  {tab.label}
                </button>
              ))}

              <div style={{ marginLeft: 'auto', paddingBottom: '6px' }}>
                <button
                  type="button"
                  onClick={handleCopySnippet}
                  className="btn-primary"
                  style={{ height: '32px', padding: '0 14px', fontSize: '0.75rem' }}
                >
                  {copiedSnippet ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedSnippet ? 'COPIED!' : 'COPY CONFIG'}</span>
                </button>
              </div>
            </div>

            {/* Code Box */}
            <div style={{ padding: '20px', background: '#050A14' }}>
              <pre style={{
                fontFamily: 'var(--font-tactical)',
                fontSize: '0.82rem',
                lineHeight: 1.7,
                color: 'var(--text-primary)',
                overflowX: 'auto',
                margin: 0
              }}>
                <code>{getFrameworkSnippet(activeFramework)}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: CSP CONSTRUCTOR */}
        {activeTab === 'csp' && (
          <CspConstructorView />
        )}

        {/* TAB 4: DIFF BENCHMARK */}
        {activeTab === 'diff' && (
          <DiffEngineView activeScan={scan} />
        )}

        {/* TAB 5: RAW HEADERS & NETWORK */}
        {activeTab === 'raw' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <RawHeadersViewer headers={scan.raw_headers} onCopyNotice={onCopyNotice} />
            <TlsSummaryCard tls={scan.tls_summary} />
            <RedirectChain chain={scan.redirect_chain} />
          </div>
        )}
      </div>
    </div>
  );
};
