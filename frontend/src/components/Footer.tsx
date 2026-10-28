import React from 'react';
import { Shield, Github, Linkedin, Mail, Phone, MapPin, GraduationCap, ExternalLink, Globe, Heart } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer style={{
      background: 'var(--surface-0)',
      borderTop: '1px solid var(--border-subtle)',
      paddingTop: '64px',
      paddingBottom: '36px'
    }} className="no-print">
      <div className="container">
        {/* Main Columns Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '48px'
        }}>
          {/* Brand & Project Summary */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: 'rgba(0, 240, 255, 0.15)',
                border: '1px solid var(--primary-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(0, 240, 255, 0.3)'
              }}>
                <Shield size={18} color="var(--primary-cyan)" />
              </div>
              <div style={{ fontFamily: 'var(--font-tactical)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                AETHER<span style={{ color: 'var(--primary-cyan)' }}>_SHIELD</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '18px' }}>
              Deterministic HTTP security header audit and remediation engine. Engineered for modern DevOps teams and cybersecurity researchers.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href="https://github.com/httpsarya"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  transition: 'all 150ms ease'
                }}
                title="GitHub @httpsarya"
              >
                <Github size={16} />
              </a>
              <a
                href="https://www.linkedin.com/in/arya-tiwari-01ba84292/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  transition: 'all 150ms ease'
                }}
                title="LinkedIn - Arya Tiwari"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://httpsarya.github.io/Arya_Tiwari_portfolio_12/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  transition: 'all 150ms ease'
                }}
                title="Arya Tiwari Portfolio"
              >
                <Globe size={16} />
              </a>
              <a
                href="mailto:arya2tiwari@gmail.com"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  transition: 'all 150ms ease'
                }}
                title="Email: arya2tiwari@gmail.com"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Project Creator & Identity Details */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontFamily: 'var(--font-tactical)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary-cyan)', marginBottom: '16px' }}>
              Project Architect
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                Arya Tiwari
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--secondary-emerald)', fontFamily: 'var(--font-tactical)', fontSize: '0.78rem' }}>
                <GraduationCap size={14} />
                <span>CSE Student</span>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                Bennett University
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                <MapPin size={13} />
                <span>Greater Noida, India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                <Phone size={13} />
                <span>+91 9999606103</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                <Mail size={13} />
                <a href="mailto:arya2tiwari@gmail.com" style={{ color: 'var(--text-muted)' }}>
                  arya2tiwari@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Scanner Navigation */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontFamily: 'var(--font-tactical)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', marginBottom: '16px' }}>
              Audit Tools
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <li>
                <button type="button" onClick={() => onSelectTab('scanner')} className="btn-ghost" style={{ padding: 0, color: 'var(--text-secondary)' }}>
                  Single URL Scanner
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectTab('csp')} className="btn-ghost" style={{ padding: 0, color: 'var(--text-secondary)' }}>
                  CSP Directives Constructor
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectTab('diff')} className="btn-ghost" style={{ padding: 0, color: 'var(--text-secondary)' }}>
                  OWASP 2025 Diff Benchmark
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectTab('fixes')} className="btn-ghost" style={{ padding: 0, color: 'var(--text-secondary)' }}>
                  Multi-Stack Remediation
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectTab('bulk')} className="btn-ghost" style={{ padding: 0, color: 'var(--text-secondary)' }}>
                  Batch Bulk Scanner
                </button>
              </li>
            </ul>
          </div>

          {/* Online Profiles & Verification */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontFamily: 'var(--font-tactical)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', marginBottom: '16px' }}>
              Profiles & Verify
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <li>
                <a
                  href="https://httpsarya.github.io/Arya_Tiwari_portfolio_12/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-cyan)' }}
                >
                  <Globe size={14} />
                  <span>Personal Portfolio</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/httpsarya"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}
                >
                  <Github size={14} />
                  <span>GitHub: httpsarya</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/arya-tiwari-01ba84292/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}
                >
                  <Linkedin size={14} />
                  <span>LinkedIn Profile</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:8000/api/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}
                >
                  <span>Interactive Swagger API</span>
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-tactical)'
        }}>
          <div>
            Project Architect: <span style={{ color: 'var(--primary-cyan)', fontWeight: 600 }}>Arya Tiwari</span> (CSE Student, Bennett University)
          </div>

          <div>
            © 2026 AETHER_SHIELD. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
