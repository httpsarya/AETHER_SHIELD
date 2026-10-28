import React, { useState } from 'react';
import { Shield, Sparkles, Radar, Lock, CheckCircle2, ArrowRight, Download, FileCode, Check, RefreshCw } from 'lucide-react';

interface HeroProps {
  onScan: (url: string, followRedirects: boolean) => void;
  isLoading: boolean;
  onQuickExportSarif?: () => void;
  onQuickExportJson?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScan, isLoading, onQuickExportSarif, onQuickExportJson }) => {
  const [url, setUrl] = useState('https://api.sentinel-defense.cloud/v2/telemetry');
  const [followRedirects, setFollowRedirects] = useState(true);
  const [inputError, setInputError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setInputError('Please enter a target URL (e.g. https://example.com)');
      return;
    }
    setInputError('');
    onScan(trimmed, followRedirects);
  };

  const handlePreset = (presetUrl: string) => {
    setUrl(presetUrl);
    setInputError('');
    onScan(presetUrl, followRedirects);
  };

  return (
    <section className="circuit-overlay" style={{ paddingTop: '20px', paddingBottom: '28px', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Top Eyebrow */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 12px',
            borderRadius: '999px',
            background: 'rgba(0, 240, 255, 0.12)',
            border: '1px solid var(--border-cyan)',
            color: 'var(--primary-cyan)',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-tactical)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            <Sparkles size={13} color="var(--primary-cyan)" />
            <span>AETHER_SHIELD // SEC-OPS HTTP SECURITY HEADER AUDITOR</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 16px auto' }}>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 1.25rem + 1.2vw, 2.25rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '8px',
            letterSpacing: '-0.02em'
          }}>
            Deterministic HTTP Security <span style={{ color: 'var(--primary-cyan)', textShadow: 'var(--glow-cyan)' }}>Header Inspection</span> & Remediation
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.45, maxWidth: '680px', margin: '0 auto' }}>
            Deterministic 0–100 rubric compliance, SSRF-protected deep inspection, and instant copy-paste hardened server configurations.
          </p>
        </div>

        {/* ==================================================== */}
        {/* STITCH TOP CYBER SCANNER BAR                          */}
        {/* ==================================================== */}
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          background: 'var(--surface-1)',
          border: inputError ? '1px solid var(--danger-rose)' : '1px solid var(--border-cyan)',
          borderRadius: '12px',
          padding: '12px 14px',
          boxShadow: '0 0 25px rgba(0, 240, 255, 0.12)',
          backdropFilter: 'blur(16px)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '4px 8px',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {/* Terminal Prefix */}
              <span style={{
                fontFamily: 'var(--font-tactical)',
                fontSize: '0.85rem',
                color: 'var(--primary-cyan)',
                fontWeight: 700,
                paddingLeft: '4px',
                userSelect: 'none'
              }}>
                target://
              </span>

              {/* URL Input */}
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-domain.io"
                disabled={isLoading}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-tactical)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  height: '36px'
                }}
              />

              {/* Integrated Status Badges inside the scanner bar */}
              <div style={{
                display: 'none',
                alignItems: 'center',
                gap: '6px',
                borderLeft: '1px solid var(--border-subtle)',
                paddingLeft: '10px'
              }} className="scanner-pills">
                <style>{`
                  @media (min-width: 768px) {
                    .scanner-pills { display: flex !important; }
                  }
                `}</style>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-tactical)',
                  color: 'var(--secondary-emerald)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '2px 7px',
                  borderRadius: '4px'
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--secondary-emerald)' }}></span>
                  TLS 1.3 STRICT
                </span>

                <span style={{
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-tactical)',
                  color: 'var(--text-muted)',
                  background: 'var(--surface-high)',
                  border: '1px solid var(--border-subtle)',
                  padding: '2px 7px',
                  borderRadius: '4px'
                }}>
                  184ms
                </span>

                <span style={{
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-tactical)',
                  color: 'var(--secondary-emerald)',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  padding: '2px 7px',
                  borderRadius: '4px'
                }}>
                  HTTP/2 200 OK
                </span>
              </div>

              {/* Primary Analyze Headers Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
                style={{
                  height: '38px',
                  padding: '0 18px',
                  borderRadius: '6px',
                  fontSize: '0.82rem'
                }}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>AUDITING...</span>
                  </>
                ) : (
                  <>
                    <Radar size={15} />
                    <span>ANALYZE HEADERS</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Validation Error Message */}
          {inputError && (
            <div style={{ color: 'var(--danger-rose)', fontSize: '0.78rem', fontFamily: 'var(--font-tactical)', marginTop: '6px', paddingLeft: '4px' }}>
              {inputError}
            </div>
          )}

          {/* Presets and Quick Export Bar (From Stitch) */}
          <div style={{
            marginTop: '10px',
            paddingTop: '8px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {/* Presets */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-tactical)', color: 'var(--text-muted)' }}>
                TARGET PRESETS:
              </span>
              <button
                type="button"
                onClick={() => handlePreset('https://github.com')}
                style={{
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-tactical)',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                github.com <span style={{ color: 'var(--secondary-emerald)', fontWeight: 700 }}>(A+)</span>
              </button>
              <button
                type="button"
                onClick={() => handlePreset('https://cloudflare.com')}
                style={{
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-tactical)',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                cloudflare.com <span style={{ color: 'var(--secondary-emerald)', fontWeight: 700 }}>(A+)</span>
              </button>
              <button
                type="button"
                onClick={() => handlePreset('https://google.com')}
                style={{
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-tactical)',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                google.com <span style={{ color: 'var(--primary-cyan)', fontWeight: 700 }}>(A)</span>
              </button>
              <button
                type="button"
                onClick={() => handlePreset('https://legacy-internal.dev')}
                style={{
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-tactical)',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                legacy-internal.dev <span style={{ color: 'var(--danger-rose)', fontWeight: 700 }}>(F)</span>
              </button>
            </div>

            {/* Quick Export Tools */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {onQuickExportSarif && (
                <button
                  type="button"
                  onClick={onQuickExportSarif}
                  style={{
                    background: 'var(--surface-high)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-tactical)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <FileCode size={11} color="var(--primary-cyan)" />
                  <span>SARIF 2.1</span>
                </button>
              )}
              {onQuickExportJson && (
                <button
                  type="button"
                  onClick={onQuickExportJson}
                  style={{
                    background: 'var(--surface-high)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-tactical)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <Download size={11} color="var(--primary-cyan)" />
                  <span>JSON Report</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4 Feature Telemetry Bento Highlights */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px',
          maxWidth: '1100px',
          margin: '20px auto 0 auto'
        }}>
          <div style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <span style={{ padding: '8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--secondary-emerald)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <Shield size={18} />
            </span>
            <div>
              <div style={{ fontFamily: 'var(--font-tactical)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                SSRF & Abuse Protected
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                RFC-1918 / Loopback blocked, DNS single-resolution, IP pinning across redirect hops.
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <span style={{ padding: '8px', borderRadius: '6px', background: 'rgba(0, 240, 255, 0.15)', color: 'var(--primary-cyan)', border: '1px solid var(--border-cyan)' }}>
              <Radar size={18} />
            </span>
            <div>
              <div style={{ fontFamily: 'var(--font-tactical)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Deterministic 0–100 Rubric
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Transparent letter grading (A+ to F) evaluating CSP, HSTS, XFO, XCTO, and privacy.
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <span style={{ padding: '8px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--tertiary-amber)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <FileCode size={18} />
            </span>
            <div>
              <div style={{ fontFamily: 'var(--font-tactical)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                6+ Stack Code Generators
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Instant copy-paste configs for Nginx, Apache 2.4, Express.js, Cloudflare, Flask/Django.
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <span style={{ padding: '8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--secondary-emerald)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <CheckCircle2 size={18} />
            </span>
            <div>
              <div style={{ fontFamily: 'var(--font-tactical)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                CI/CD SARIF 2.1 Ready
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Automate GitHub Code Scanning alerts with native SARIF output and threshold flags.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
