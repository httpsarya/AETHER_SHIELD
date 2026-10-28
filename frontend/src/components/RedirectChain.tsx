import React from 'react';
import { RedirectHop } from '../types';
import { ArrowDown, ShieldCheck } from 'lucide-react';

interface RedirectChainProps {
  chain: RedirectHop[];
}

export const RedirectChain: React.FC<RedirectChainProps> = ({ chain }) => {
  if (!chain || chain.length === 0) {
    return (
      <div className="card-navy" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No redirects followed. Target responded directly on initial request.
      </div>
    );
  }

  const getStatusBadgeStyle = (code: number) => {
    if (code >= 200 && code < 300) {
      return { bg: 'rgba(30, 218, 37, 0.15)', text: 'var(--green-ui)', border: 'rgba(30, 218, 37, 0.4)' };
    }
    if (code >= 300 && code < 400) {
      return { bg: 'rgba(34, 214, 243, 0.15)', text: 'var(--accent-cyan)', border: 'rgba(34, 214, 243, 0.4)' };
    }
    return { bg: 'rgba(255, 31, 66, 0.15)', text: 'var(--accent-red)', border: 'rgba(255, 31, 66, 0.4)' };
  };

  return (
    <div className="card-navy">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h4 style={{ fontSize: '1rem', color: '#FFFFFF' }}>Redirect & Connection Path</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--accent-green)' }}>
          <ShieldCheck size={16} />
          <span>SSRF Validated Hops</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {chain.map((hop, index) => {
          const badgeStyle = getStatusBadgeStyle(hop.status_code);
          const isLast = index === chain.length - 1;

          return (
            <div key={hop.hop} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative' }}>
              {/* Stepper Dot & Line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '24px' }}>
                <div style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: isLast ? 'var(--green-ui)' : 'var(--accent-magenta)',
                  boxShadow: isLast ? 'var(--glow-green)' : 'var(--glow-magenta)',
                  marginTop: '4px',
                  flexShrink: 0
                }} />
                {!isLast && (
                  <div style={{
                    width: '2px',
                    height: '42px',
                    background: 'var(--magenta-border)',
                    margin: '4px 0'
                  }} />
                )}
              </div>

              {/* Hop Information */}
              <div style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--line)',
                borderRadius: '6px',
                padding: '10px 14px',
                marginBottom: isLast ? '0' : '10px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '220px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)'
                  }}>
                    Hop {hop.hop}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: '#FFFFFF',
                    wordBreak: 'break-all'
                  }}>
                    {hop.url}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)'
                  }}>
                    Pinned IP: <span style={{ color: 'var(--accent-cyan)' }}>{hop.ip}</span>
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: badgeStyle.bg,
                    color: badgeStyle.text,
                    border: `1px solid ${badgeStyle.border}`
                  }}>
                    {hop.status_code} {hop.reason}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
