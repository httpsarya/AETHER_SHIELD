import React, { useState } from 'react';
import { Shield, Check, Copy, Sliders, AlertCircle, FileCode, CheckCircle2, Sparkles, Send } from 'lucide-react';

export const CspConstructorView: React.FC = () => {
  const [reportOnly, setReportOnly] = useState(false);
  const [defaultSrc, setDefaultSrc] = useState(true);
  const [scriptSrc, setScriptSrc] = useState(true);
  const [scriptNonce, setScriptNonce] = useState(true);
  const [styleSrc, setStyleSrc] = useState(true);
  const [imgSrc, setImgSrc] = useState(true);
  const [connectSrc, setConnectSrc] = useState(true);
  const [frameAncestors, setFrameAncestors] = useState(true);
  const [objectSrc, setObjectSrc] = useState(true);
  const [baseUri, setBaseUri] = useState(true);
  const [upgradeInsecure, setUpgradeInsecure] = useState(true);
  const [reportUri, setReportUri] = useState('https://telemetry.your-domain.io/csp-reports');
  const [copied, setCopied] = useState(false);

  // Generate CSP policy string
  const generatePolicy = () => {
    const directives: string[] = [];

    if (defaultSrc) directives.push("default-src 'self'");
    if (scriptSrc) {
      if (scriptNonce) {
        directives.push("script-src 'self' 'nonce-r4nd0mToken'");
      } else {
        directives.push("script-src 'self'");
      }
    }
    if (styleSrc) directives.push("style-src 'self' 'unsafe-inline'");
    if (imgSrc) directives.push("img-src 'self' data: https:");
    if (connectSrc) directives.push("connect-src 'self' https:");
    if (frameAncestors) directives.push("frame-ancestors 'none'");
    if (objectSrc) directives.push("object-src 'none'");
    if (baseUri) directives.push("base-uri 'self'");
    if (upgradeInsecure) directives.push("upgrade-insecure-requests");

    if (reportUri.trim()) {
      directives.push(`report-uri ${reportUri.trim()}`);
    }

    return directives.join('; ') + ';';
  };

  const headerName = reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';
  const policyValue = generatePolicy();
  const fullHeaderOutput = `${headerName}: ${policyValue}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullHeaderOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Title Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: '999px',
            background: 'rgba(0, 240, 255, 0.12)',
            border: '1px solid var(--border-cyan)',
            color: 'var(--primary-cyan)',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-tactical)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '12px'
          }}>
            <Sliders size={14} color="var(--primary-cyan)" />
            <span>INTERACTIVE POLICY BUILDER</span>
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            CSP Rollout & Directives Constructor
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '780px' }}>
            Safely build, configure, and stage zero-regression Content Security Policies. Toggle directives, add cryptographic nonces, and simulate deployment in Report-Only mode before full zero-trust enforcement.
          </p>
        </div>

        {/* Mode Selector */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '12px 20px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-tactical)', color: 'var(--text-muted)' }}>
            DEPLOYMENT PHASE:
          </span>
          <button
            type="button"
            onClick={() => setReportOnly(false)}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-tactical)',
              fontWeight: 600,
              cursor: 'pointer',
              border: !reportOnly ? '1px solid var(--secondary-emerald)' : '1px solid var(--border-subtle)',
              background: !reportOnly ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: !reportOnly ? 'var(--secondary-emerald)' : 'var(--text-muted)',
              transition: 'all 150ms ease'
            }}
          >
            ACTIVE ENFORCEMENT
          </button>
          <button
            type="button"
            onClick={() => setReportOnly(true)}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-tactical)',
              fontWeight: 600,
              cursor: 'pointer',
              border: reportOnly ? '1px solid var(--tertiary-amber)' : '1px solid var(--border-subtle)',
              background: reportOnly ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              color: reportOnly ? 'var(--tertiary-amber)' : 'var(--text-muted)',
              transition: 'all 150ms ease'
            }}
          >
            SAFE REPORT-ONLY (STAGING)
          </button>
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-tactical)' }}>
            {reportOnly ? 'Logs violations without breaking site' : 'Strictly blocks policy violations'}
          </span>
        </div>

        {/* Main Grid: Left Controls / Right Live Preview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* Left: Directives Toggle Cards */}
          <div style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--primary-cyan)" />
              Security Directives Selection
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {/* default-src */}
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'var(--surface-card)',
                border: defaultSrc ? '1px solid var(--border-cyan)' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }} onClick={() => setDefaultSrc(!defaultSrc)}>
                <div>
                  <div style={{ fontFamily: 'var(--font-tactical)', color: 'var(--primary-cyan)', fontSize: '0.875rem', fontWeight: 600 }}>
                    default-src 'self'
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Fallback anchor restricting unspecified resources strictly to host origin.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={defaultSrc}
                  onChange={(e) => setDefaultSrc(e.target.checked)}
                  style={{ accentColor: 'var(--primary-cyan)', width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              {/* script-src */}
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'var(--surface-card)',
                border: scriptSrc ? '1px solid var(--border-cyan)' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }} onClick={() => setScriptSrc(!scriptSrc)}>
                <div>
                  <div style={{ fontFamily: 'var(--font-tactical)', color: 'var(--primary-cyan)', fontSize: '0.875rem', fontWeight: 600 }}>
                    script-src {scriptNonce ? "'self' 'nonce-...'" : "'self'"}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Shields against Stored & Reflected XSS by blocking untrusted inline JS execution.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={scriptSrc}
                  onChange={(e) => setScriptSrc(e.target.checked)}
                  style={{ accentColor: 'var(--primary-cyan)', width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              {/* frame-ancestors */}
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'var(--surface-card)',
                border: frameAncestors ? '1px solid var(--border-cyan)' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }} onClick={() => setFrameAncestors(!frameAncestors)}>
                <div>
                  <div style={{ fontFamily: 'var(--font-tactical)', color: 'var(--primary-cyan)', fontSize: '0.875rem', fontWeight: 600 }}>
                    frame-ancestors 'none'
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Modern replacement for X-Frame-Options; blocks clickjacking across all origins.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={frameAncestors}
                  onChange={(e) => setFrameAncestors(e.target.checked)}
                  style={{ accentColor: 'var(--primary-cyan)', width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              {/* object-src */}
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'var(--surface-card)',
                border: objectSrc ? '1px solid var(--border-cyan)' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }} onClick={() => setObjectSrc(!objectSrc)}>
                <div>
                  <div style={{ fontFamily: 'var(--font-tactical)', color: 'var(--primary-cyan)', fontSize: '0.875rem', fontWeight: 600 }}>
                    object-src 'none'
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Completely disables legacy plugins, Flash, Java Applets, and ActiveX exploits.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={objectSrc}
                  onChange={(e) => setObjectSrc(e.target.checked)}
                  style={{ accentColor: 'var(--primary-cyan)', width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              {/* base-uri */}
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'var(--surface-card)',
                border: baseUri ? '1px solid var(--border-cyan)' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }} onClick={() => setBaseUri(!baseUri)}>
                <div>
                  <div style={{ fontFamily: 'var(--font-tactical)', color: 'var(--primary-cyan)', fontSize: '0.875rem', fontWeight: 600 }}>
                    base-uri 'self'
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Prevents malicious &lt;base&gt; tags from re-routing relative path script fetches.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={baseUri}
                  onChange={(e) => setBaseUri(e.target.checked)}
                  style={{ accentColor: 'var(--primary-cyan)', width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              {/* upgrade-insecure-requests */}
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'var(--surface-card)',
                border: upgradeInsecure ? '1px solid var(--border-cyan)' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }} onClick={() => setUpgradeInsecure(!upgradeInsecure)}>
                <div>
                  <div style={{ fontFamily: 'var(--font-tactical)', color: 'var(--primary-cyan)', fontSize: '0.875rem', fontWeight: 600 }}>
                    upgrade-insecure-requests
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Instructs modern browsers to automatically rewrite legacy HTTP references to HTTPS.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={upgradeInsecure}
                  onChange={(e) => setUpgradeInsecure(e.target.checked)}
                  style={{ accentColor: 'var(--primary-cyan)', width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Violation Reporting URI Input */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-tactical)', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <Send size={14} color="var(--primary-cyan)" />
                VIOLATION REPORTING TELEMETRY ENDPOINT (report-uri):
              </label>
              <input
                type="text"
                value={reportUri}
                onChange={(e) => setReportUri(e.target.value)}
                placeholder="https://telemetry.your-domain.io/csp-reports"
                style={{
                  width: '100%',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  fontFamily: 'var(--font-tactical)',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Right: Real-time Live Policy Preview & Stack Snippets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-cyan)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 0 25px rgba(0, 240, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-tactical)',
                  color: 'var(--primary-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600
                }}>
                  <Sparkles size={14} />
                  REAL-TIME SYNTHESIS
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-tactical)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: reportOnly ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: reportOnly ? 'var(--tertiary-amber)' : 'var(--secondary-emerald)',
                  border: reportOnly ? '1px solid var(--tertiary-amber)' : '1px solid var(--secondary-emerald)'
                }}>
                  {reportOnly ? 'REPORT-ONLY' : 'ENFORCED'}
                </span>
              </div>

              {/* Generated Policy Box */}
              <div style={{
                background: '#050A14',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '16px',
                fontFamily: 'var(--font-tactical)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                wordBreak: 'break-all',
                color: 'var(--text-primary)',
                minHeight: '140px'
              }}>
                <span style={{ color: 'var(--primary-cyan)', fontWeight: 600 }}>{headerName}: </span>
                <span>{policyValue}</span>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--secondary-emerald)', fontFamily: 'var(--font-tactical)' }}>
                  <CheckCircle2 size={14} />
                  <span>OWASP 2025 Hardened Baseline</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="btn-primary"
                  style={{
                    height: '38px',
                    padding: '0 20px',
                    fontSize: '0.825rem',
                    fontFamily: 'var(--font-tactical)',
                    background: copied ? 'var(--secondary-emerald)' : 'var(--primary-cyan)',
                    color: '#0A0F1D'
                  }}
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      <span>COPIED TO CLIPBOARD</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>COPY HEADER</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Framework Staging Code */}
            <div style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <FileCode size={16} color="var(--primary-cyan)" />
                <span style={{ fontFamily: 'var(--font-tactical)', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  Nginx Configuration Block
                </span>
              </div>
              <pre style={{
                background: '#050A14',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '12px',
                fontFamily: 'var(--font-tactical)',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                overflowX: 'auto'
              }}>
                <code>
                  {`# /etc/nginx/conf.d/csp.conf\nadd_header ${headerName} "${policyValue}" always;`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
