import React, { useState } from 'react';
import { Shield, Sparkles, Radar, CheckCircle2, Download, FileCode, RefreshCw, ChevronDown } from 'lucide-react';

interface HeroProps {
  onScan: (url: string, followRedirects: boolean) => void;
  isLoading: boolean;
  onQuickExportSarif?: () => void;
  onQuickExportJson?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScan, isLoading, onQuickExportSarif, onQuickExportJson }) => {
  const [url, setUrl] = useState('https://api.sentinel-defense.cloud/v2/telemetry');
  const [followRedirects] = useState(true);
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
    <section 
      className="circuit-overlay" 
      style={{ 
        paddingTop: 'clamp(28px, 4.5vh, 52px)', 
        paddingBottom: 'clamp(32px, 5vh, 60px)', 
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <div className="container">
        {/* Top Eyebrow Badge */}
        <div className="animate-fade-in-up" style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 14px',
            borderRadius: '999px',
            background: 'rgba(0, 240, 255, 0.08)',
            border: '1px solid var(--border-cyan)',
            color: 'var(--primary-cyan)',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-tactical)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            boxShadow: '0 0 16px rgba(0, 240, 255, 0.12)'
          }}>
            <Sparkles size={13} color="var(--primary-cyan)" />
            <span>AETHER_SHIELD // SEC-OPS HTTP SECURITY HEADER AUDITOR</span>
            <span className="cyber-pill-dot" />
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="animate-fade-in-up delay-100" style={{ textAlign: 'center', maxWidth: '1100px', margin: '0 auto 24px auto' }}>
          <h1 style={{
            fontSize: 'clamp(2.1rem, 1.7rem + 1.8vw, 3.1rem)',
            fontWeight: 700,
            lineHeight: 1.22,
            marginBottom: '12px',
            letterSpacing: '-0.025em',
            textWrap: 'balance'
          }}>
            Deterministic HTTP Security <br />
            <span className="neon-glow-text">Header Inspection</span> &amp; Remediation
          </h1>
          <p style={{ 
            fontSize: 'clamp(0.92rem, 0.85rem + 0.25vw, 1.05rem)', 
            color: 'var(--text-secondary)', 
            lineHeight: 1.55, 
            maxWidth: '820px', 
            margin: '0 auto' 
          }}>
            Deterministic 0–100 rubric compliance, SSRF-protected deep inspection, and instant copy-paste hardened server configurations.
          </p>
        </div>

        {/* ==================================================== */}
        {/* STITCH TOP CYBER SCANNER BAR (With Laser Scan Anim)   */}
        {/* ==================================================== */}
        <div 
          className="scanner-container animate-fade-in-up delay-200"
          style={inputError ? { borderColor: 'var(--danger-rose)', boxShadow: 'var(--glow-red)' } : undefined}
        >
          <form onSubmit={handleSubmit}>
            <div className="scanner-form-row">
              {/* Terminal Prefix with Blinking Cursor */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontFamily: 'var(--font-tactical)',
                fontSize: '0.88rem',
                color: 'var(--primary-cyan)',
                fontWeight: 700,
                paddingLeft: '4px',
                userSelect: 'none',
                whiteSpace: 'nowrap'
              }}>
                <span>target://</span>
                <span className="terminal-cursor" />
              </div>

              {/* URL Input */}
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-domain.io"
                disabled={isLoading}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-tactical)',
                  fontSize: '0.94rem',
                  outline: 'none',
                  height: '42px',
                  padding: '0 8px',
                  minWidth: 0
                }}
              />

              {/* Primary Analyze Headers Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
                style={{
                  height: '42px',
                  padding: '0 24px',
                  borderRadius: '6px',
                  fontSize: '0.84rem',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>AUDITING...</span>
                  </>
                ) : (
                  <>
                    <Radar size={15} className="radar-sweep-icon" />
                    <span>ANALYZE HEADERS</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Validation Error Message */}
          {inputError && (
            <div style={{ color: 'var(--danger-rose)', fontSize: '0.78rem', fontFamily: 'var(--font-tactical)', marginTop: '8px', paddingLeft: '4px' }}>
              {inputError}
            </div>
          )}

          {/* Presets and Quick Export Bar (From Stitch) */}
          <div style={{
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {/* Presets */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-tactical)', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                TARGET PRESETS:
              </span>
              <button
                type="button"
                className="target-preset-btn"
                onClick={() => handlePreset('https://github.com')}
              >
                github.com <span style={{ color: 'var(--secondary-emerald)', fontWeight: 700 }}>(A+)</span>
              </button>
              <button
                type="button"
                className="target-preset-btn"
                onClick={() => handlePreset('https://cloudflare.com')}
              >
                cloudflare.com <span style={{ color: 'var(--secondary-emerald)', fontWeight: 700 }}>(A+)</span>
              </button>
              <button
                type="button"
                className="target-preset-btn"
                onClick={() => handlePreset('https://google.com')}
              >
                google.com <span style={{ color: 'var(--primary-cyan)', fontWeight: 700 }}>(A)</span>
              </button>
              <button
                type="button"
                className="target-preset-btn"
                onClick={() => handlePreset('https://legacy-internal.dev')}
              >
                legacy-internal.dev <span style={{ color: 'var(--danger-rose)', fontWeight: 700 }}>(F)</span>
              </button>
            </div>

            {/* Quick Export Tools */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {onQuickExportSarif && (
                <button
                  type="button"
                  className="target-preset-btn"
                  onClick={onQuickExportSarif}
                >
                  <FileCode size={12} color="var(--primary-cyan)" />
                  <span>SARIF 2.1</span>
                </button>
              )}
              {onQuickExportJson && (
                <button
                  type="button"
                  className="target-preset-btn"
                  onClick={onQuickExportJson}
                >
                  <Download size={12} color="var(--primary-cyan)" />
                  <span>JSON Report</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4 Feature Telemetry Bento Highlights */}
        <div className="hero-bento-grid animate-fade-in-up delay-300" style={{
          width: '100%',
          marginTop: '28px'
        }}>
          <div className="hero-bento-card">
            <span style={{ 
              padding: '8px', 
              borderRadius: '6px', 
              background: 'rgba(16, 185, 129, 0.14)', 
              color: 'var(--secondary-emerald)', 
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Shield size={18} />
            </span>
            <div>
              <div style={{ fontFamily: 'var(--font-tactical)', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                SSRF & Abuse Protected
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '3px', lineHeight: 1.45 }}>
                RFC-1918 / Loopback blocked, DNS single-resolution, IP pinning across redirect hops.
              </div>
            </div>
          </div>

          <div className="hero-bento-card">
            <span style={{ 
              padding: '8px', 
              borderRadius: '6px', 
              background: 'rgba(0, 240, 255, 0.14)', 
              color: 'var(--primary-cyan)', 
              border: '1px solid var(--border-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Radar size={18} />
            </span>
            <div>
              <div style={{ fontFamily: 'var(--font-tactical)', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Deterministic 0–100 Rubric
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '3px', lineHeight: 1.45 }}>
                Transparent letter grading (A+ to F) evaluating CSP, HSTS, XFO, XCTO, and privacy.
              </div>
            </div>
          </div>

          <div className="hero-bento-card">
            <span style={{ 
              padding: '8px', 
              borderRadius: '6px', 
              background: 'rgba(245, 158, 11, 0.14)', 
              color: 'var(--tertiary-amber)', 
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <FileCode size={18} />
            </span>
            <div>
              <div style={{ fontFamily: 'var(--font-tactical)', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                6+ Stack Code Generators
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '3px', lineHeight: 1.45 }}>
                Instant copy-paste configs for Nginx, Apache 2.4, Express.js, Cloudflare, Flask/Django.
              </div>
            </div>
          </div>

          <div className="hero-bento-card">
            <span style={{ 
              padding: '8px', 
              borderRadius: '6px', 
              background: 'rgba(16, 185, 129, 0.14)', 
              color: 'var(--secondary-emerald)', 
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <CheckCircle2 size={18} />
            </span>
            <div>
              <div style={{ fontFamily: 'var(--font-tactical)', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                CI/CD SARIF 2.1 Ready
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '3px', lineHeight: 1.45 }}>
                Automate GitHub Code Scanning alerts with native SARIF output and threshold flags.
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Classy Scroll Indicator to Explore Architecture & Specs */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '28px' }}>
          <a
            href="#engine-overview"
            className="hero-scroll-btn"
            title="Scroll to explore audit engine architecture & specifications"
          >
            <ChevronDown size={14} className="animate-bounce" color="var(--primary-cyan)" />
            <span>SCROLL TO EXPLORE ARCHITECTURE &amp; SPECIFICATIONS</span>
          </a>
        </div>
      </div>
    </section>
  );
};
