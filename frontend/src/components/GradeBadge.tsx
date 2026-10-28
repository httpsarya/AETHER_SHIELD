import React from 'react';

interface GradeBadgeProps {
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  score: number;
  size?: 'normal' | 'compact';
}

export const GradeBadge: React.FC<GradeBadgeProps> = ({ grade, score, size = 'normal' }) => {
  const isCompact = size === 'compact';

  const getGradeTheme = () => {
    switch (grade) {
      case 'A+':
      case 'A':
        return {
          color: 'var(--secondary-emerald)',
          ringBorder: 'rgba(16, 185, 129, 0.4)',
          glow: 'var(--glow-green)',
          statusText: 'EXCELLENT POSTURE - PRODUCTION READY',
          subtitle: 'Zero critical gaps detected. Matches OWASP Level 3 standard.',
          tag: 'ISO/IEC 27001 COMPLIANT'
        };
      case 'B':
        return {
          color: 'var(--primary-cyan)',
          ringBorder: 'rgba(0, 240, 255, 0.4)',
          glow: 'var(--glow-cyan)',
          statusText: 'HARDENED POSTURE - MINOR REVIEWS',
          subtitle: 'Solid transport encryption with minor directive optimizations.',
          tag: 'OWASP TOP-10 SATISFIED'
        };
      case 'C':
        return {
          color: 'var(--tertiary-amber)',
          ringBorder: 'rgba(245, 158, 11, 0.4)',
          glow: 'var(--glow-amber)',
          statusText: 'MODERATE RISK - DRIFT DETECTED',
          subtitle: 'Missing key defenses (e.g. CSP or Permissions-Policy).',
          tag: 'NEEDS REMEDIATION'
        };
      case 'D':
        return {
          color: '#FB923C',
          ringBorder: 'rgba(251, 146, 60, 0.4)',
          glow: '0 0 20px rgba(251, 146, 60, 0.4)',
          statusText: 'ELEVATED THREAT EXPOSURE',
          subtitle: 'Multiple core headers absent or permissive.',
          tag: 'VULNERABILITY WARNING'
        };
      case 'F':
      default:
        return {
          color: 'var(--danger-rose)',
          ringBorder: 'rgba(239, 68, 68, 0.5)',
          glow: 'var(--glow-red)',
          statusText: 'CRITICAL VULNERABILITY EXPOSURE',
          subtitle: 'Zero core headers detected. Exposed to clickjacking & XSS attacks.',
          tag: 'AUDIT FAILED'
        };
    }
  };

  const theme = getGradeTheme();

  if (isCompact) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: '#060913',
          border: `2px solid ${theme.color}`,
          boxShadow: theme.glow,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontFamily: 'var(--font-tactical)', fontSize: '1.4rem', fontWeight: 800, color: theme.color, lineHeight: 1 }}>
            {grade}
          </span>
          <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-tactical)', color: 'var(--text-muted)' }}>
            {score}
          </span>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-tactical)', fontWeight: 700, color: theme.color }}>
            {score}/100
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {theme.tag}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Top Posture Status Pill */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        borderRadius: '4px',
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.7rem',
        fontFamily: 'var(--font-tactical)',
        color: 'var(--text-muted)',
        marginBottom: '16px'
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.color }}></span>
        <span>{theme.tag}</span>
      </div>

      {/* Concentric Glowing Animated Rings (From Stitch) */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '12px 0 20px 0' }}>
        {/* Outer Glowing Pulse Ring */}
        <div
          className="neon-pulse-ring"
          style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            border: `2px solid ${theme.ringBorder}`,
            position: 'absolute'
          }}
        />

        {/* Middle subtle boundary ring */}
        <div style={{
          width: '154px',
          height: '154px',
          borderRadius: '50%',
          border: '1px solid var(--border-subtle)',
          position: 'absolute'
        }} />

        {/* Center Grade Plate */}
        <div style={{
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #0F172A 0%, #060913 100%)',
          border: `2px solid ${theme.color}`,
          boxShadow: theme.glow,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2
        }}>
          <span style={{
            fontFamily: 'var(--font-tactical)',
            fontSize: '3.6rem',
            fontWeight: 800,
            color: theme.color,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            textShadow: theme.glow
          }}>
            {grade}
          </span>
          <span style={{
            fontSize: '0.85rem',
            fontFamily: 'var(--font-tactical)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginTop: '2px'
          }}>
            {score} / 100
          </span>
        </div>
      </div>

      {/* Posture Statement */}
      <div style={{ textAlign: 'center', marginTop: '4px' }}>
        <div style={{
          fontFamily: 'var(--font-tactical)',
          fontSize: '0.95rem',
          fontWeight: 700,
          color: theme.color,
          letterSpacing: '0.04em'
        }}>
          {theme.statusText}
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '340px' }}>
          {theme.subtitle}
        </p>
      </div>
    </div>
  );
};
