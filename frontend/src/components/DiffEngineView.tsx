import React, { useState } from 'react';
import { GitCompare, CheckCircle2, AlertTriangle, XCircle, ArrowRight, Shield, Sparkles, Copy, Check } from 'lucide-react';
import { ScanResponse } from '../types';

interface DiffEngineViewProps {
  activeScan?: ScanResponse | null;
}

export const DiffEngineView: React.FC<DiffEngineViewProps> = ({ activeScan }) => {
  const [selectedTarget, setSelectedTarget] = useState<'scan' | 'github' | 'legacy'>('scan');
  const [copied, setCopied] = useState(false);

  // OWASP 2025 Gold Standard Benchmark
  const owaspStandard = [
    {
      header: 'Strict-Transport-Security',
      recommended: 'max-age=63072000; includeSubDomains; preload',
      importance: 'Mandatory',
      description: 'Enforces HTTPS for 2 years with subdomain coverage and HSTS browser preload.'
    },
    {
      header: 'Content-Security-Policy',
      recommended: "default-src 'self'; script-src 'self' 'nonce-r4nd0m'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'",
      importance: 'Mandatory',
      description: 'Zero-trust script execution via cryptographic nonces; prevents stored and reflected XSS.'
    },
    {
      header: 'X-Content-Type-Options',
      recommended: 'nosniff',
      importance: 'Mandatory',
      description: 'Prevents MIME confusion and executable polyglot file attacks.'
    },
    {
      header: 'X-Frame-Options',
      recommended: 'DENY',
      importance: 'Mandatory',
      description: 'Prevents UI redressing, iframe embedding, and clickjacking attacks.'
    },
    {
      header: 'Referrer-Policy',
      recommended: 'strict-origin-when-cross-origin',
      importance: 'High',
      description: 'Strips sensitive URL paths and tokens on cross-origin requests.'
    },
    {
      header: 'Permissions-Policy',
      recommended: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()',
      importance: 'High',
      description: 'Restricts sensitive hardware APIs and disables tracking topics.'
    },
    {
      header: 'Cross-Origin-Embedder-Policy',
      recommended: 'require-corp',
      importance: 'Medium',
      description: 'Isolates the browsing context to prevent Spectre CPU vulnerability leaks.'
    },
    {
      header: 'Cross-Origin-Opener-Policy',
      recommended: 'same-origin',
      importance: 'Medium',
      description: 'Isolates window.opener references from cross-origin hostile tabs.'
    },
    {
      header: 'Server / X-Powered-By',
      recommended: '[SUPPRESSED / REMOVED]',
      importance: 'Medium',
      description: 'Removes backend framework banners to prevent targeted CVE reconnaissance.'
    }
  ];

  const getTargetValues = () => {
    if (selectedTarget === 'scan' && activeScan) {
      return {
        url: activeScan.url,
        score: activeScan.score,
        grade: activeScan.grade,
        headers: activeScan.raw_headers || {}
      };
    } else if (selectedTarget === 'github') {
      return {
        url: 'https://github.com',
        score: 69,
        grade: 'C',
        headers: {
          'strict-transport-security': 'max-age=31536000; includeSubdomains; preload',
          'content-security-policy': "default-src 'none'; base-uri 'self'; connect-src 'self' https://api.github.com...",
          'x-content-type-options': 'nosniff',
          'x-frame-options': 'deny',
          'referrer-policy': 'origin-when-cross-origin, strict-origin-when-cross-origin',
          'permissions-policy': 'geolocation=(), microphone=(), camera=()'
        }
      };
    } else {
      return {
        url: 'https://legacy-internal.dev',
        score: 15,
        grade: 'F',
        headers: {
          'server': 'Apache/2.2.15 (CentOS) PHP/5.3.3',
          'x-powered-by': 'PHP/5.3.3'
        }
      };
    }
  };

  const targetData = getTargetValues();

  const handleCopyStandard = () => {
    const text = owaspStandard.map(item => `${item.header}: ${item.recommended}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Header Title */}
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
            <GitCompare size={14} color="var(--primary-cyan)" />
            <span>CONFIGURATION DRIFT ANALYSIS</span>
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
            Live Header Diff vs OWASP Secure Headers 2025
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '780px' }}>
            Direct side-by-side gap analysis comparing target server headers against OWASP Level 3 production security specifications. Spot configuration drift, missing directives, and banner leakages instantly.
          </p>
        </div>

        {/* Target Benchmark Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '14px 20px',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-tactical)', color: 'var(--text-muted)' }}>
              BENCHMARK TARGET:
            </span>
            {activeScan && (
              <button
                type="button"
                onClick={() => setSelectedTarget('scan')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-tactical)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: selectedTarget === 'scan' ? '1px solid var(--primary-cyan)' : '1px solid var(--border-subtle)',
                  background: selectedTarget === 'scan' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                  color: selectedTarget === 'scan' ? 'var(--primary-cyan)' : 'var(--text-secondary)'
                }}
              >
                Active Target ({activeScan.url.replace(/^https?:\/\//, '').slice(0, 24)}...)
              </button>
            )}
            <button
              type="button"
              onClick={() => setSelectedTarget('github')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-tactical)',
                fontWeight: 600,
                cursor: 'pointer',
                border: selectedTarget === 'github' ? '1px solid var(--primary-cyan)' : '1px solid var(--border-subtle)',
                background: selectedTarget === 'github' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                color: selectedTarget === 'github' ? 'var(--primary-cyan)' : 'var(--text-secondary)'
              }}
            >
              github.com (Grade {selectedTarget === 'github' ? 'C' : 'C'})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTarget('legacy')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-tactical)',
                fontWeight: 600,
                cursor: 'pointer',
                border: selectedTarget === 'legacy' ? '1px solid var(--danger-rose)' : '1px solid var(--border-subtle)',
                background: selectedTarget === 'legacy' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                color: selectedTarget === 'legacy' ? 'var(--danger-rose)' : 'var(--text-secondary)'
              }}
            >
              legacy-internal.dev (Grade F Drifted)
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyStandard}
            className="btn-secondary"
            style={{ height: '36px', fontSize: '0.8rem', fontFamily: 'var(--font-tactical)', padding: '0 14px' }}
          >
            {copied ? <Check size={14} color="var(--secondary-emerald)" /> : <Copy size={14} />}
            <span>{copied ? 'COPIED' : 'COPY OWASP SPEC'}</span>
          </button>
        </div>

        {/* Side-by-Side Diff Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* Target Scanned Column */}
          <div style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-tactical)', color: 'var(--text-muted)' }}>INSPECTED TARGET</span>
                <div style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontFamily: 'var(--font-tactical)', fontWeight: 600 }}>
                  {targetData.url}
                </div>
              </div>
              <div style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: targetData.score >= 80 ? 'rgba(16, 185, 129, 0.15)' : targetData.score >= 60 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: targetData.score >= 80 ? 'var(--secondary-emerald)' : targetData.score >= 60 ? 'var(--tertiary-amber)' : 'var(--danger-rose)',
                border: `1px solid ${targetData.score >= 80 ? 'var(--secondary-emerald)' : targetData.score >= 60 ? 'var(--tertiary-amber)' : 'var(--danger-rose)'}`,
                fontFamily: 'var(--font-tactical)',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                {targetData.grade} ({targetData.score}/100)
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {owaspStandard.map((std, idx) => {
                const normName = std.header.toLowerCase();
                const matchedVal = Object.entries(targetData.headers).find(([k]) => k.toLowerCase() === normName)?.[1];
                const hasValue = Boolean(matchedVal);

                return (
                  <div key={idx} style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: hasValue ? 'var(--surface-card)' : 'rgba(239, 68, 68, 0.08)',
                    border: hasValue ? '1px solid var(--border-subtle)' : '1px solid rgba(239, 68, 68, 0.3)',
                    fontFamily: 'var(--font-tactical)',
                    fontSize: '0.8rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: hasValue ? 'var(--primary-cyan)' : 'var(--danger-rose)', fontWeight: 600 }}>
                        {std.header}
                      </span>
                      <span style={{
                        fontSize: '0.68rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: hasValue ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: hasValue ? 'var(--secondary-emerald)' : 'var(--danger-rose)',
                        fontWeight: 600
                      }}>
                        {hasValue ? 'PRESENT' : 'DRIFT: MISSING'}
                      </span>
                    </div>
                    <div style={{
                      color: hasValue ? 'var(--text-secondary)' : 'var(--danger-rose)',
                      fontSize: '0.75rem',
                      wordBreak: 'break-all'
                    }}>
                      {matchedVal || 'Directive not returned by target endpoint'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* OWASP Standard Column */}
          <div style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--secondary-emerald)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 0 24px rgba(16, 185, 129, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-tactical)', color: 'var(--secondary-emerald)' }}>GOLD STANDARD</span>
                <div style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontFamily: 'var(--font-tactical)', fontWeight: 600 }}>
                  OWASP Secure Headers 2025 Level 3
                </div>
              </div>
              <div style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--secondary-emerald)',
                border: '1px solid var(--secondary-emerald)',
                fontFamily: 'var(--font-tactical)',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                A+ (100/100)
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {owaspStandard.map((std, idx) => (
                <div key={idx} style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'var(--surface-card)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontFamily: 'var(--font-tactical)',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--secondary-emerald)', fontWeight: 600 }}>
                      {std.header}
                    </span>
                    <span style={{
                      fontSize: '0.68rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--secondary-emerald)',
                      fontWeight: 600
                    }}>
                      REQUIRED
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.75rem', wordBreak: 'break-all' }}>
                    {std.recommended}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '4px' }}>
                    {std.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
