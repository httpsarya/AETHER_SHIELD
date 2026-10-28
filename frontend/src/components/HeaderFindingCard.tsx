import React, { useState } from 'react';
import { HeaderFinding } from '../types';
import { Check, Copy, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface HeaderFindingCardProps {
  finding: HeaderFinding;
  onCopyNotice: (msg: string) => void;
}

export const HeaderFindingCard: React.FC<HeaderFindingCardProps> = ({ finding, onCopyNotice }) => {
  const [expanded, setExpanded] = useState(finding.status !== 'pass');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('Nginx');
  const [copied, setCopied] = useState(false);

  const platforms = Object.keys(finding.fixes || {});
  const currentSnippet = finding.fixes[selectedPlatform] || Object.values(finding.fixes)[0] || '';

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    onCopyNotice(`Copied ${selectedPlatform} fix snippet to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBorder = () => {
    if (finding.status === 'pass') return 'var(--green-ui)';
    if (finding.status === 'warn') return 'var(--warn-amber)';
    return 'var(--accent-red)';
  };

  const getStatusIcon = () => {
    if (finding.status === 'pass') return <CheckCircle2 size={16} color="var(--green-ui)" />;
    if (finding.status === 'warn') return <AlertTriangle size={16} color="var(--warn-amber)" />;
    return <AlertCircle size={16} color="var(--accent-red)" />;
  };

  const getSeverityBadge = () => {
    const sev = finding.severity.toLowerCase();
    const colors: Record<string, { bg: string; text: string }> = {
      critical: { bg: 'rgba(255, 31, 66, 0.2)', text: 'var(--accent-red)' },
      high: { bg: 'rgba(255, 122, 26, 0.2)', text: '#FF7A1A' },
      medium: { bg: 'rgba(255, 176, 32, 0.2)', text: 'var(--warn-amber)' },
      low: { bg: 'rgba(34, 214, 243, 0.2)', text: 'var(--accent-cyan)' },
      info: { bg: 'rgba(255, 255, 255, 0.1)', text: 'var(--text-secondary)' }
    };
    const c = colors[sev] || colors.info;

    return (
      <span style={{
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: '4px',
        background: c.bg,
        color: c.text,
        letterSpacing: '0.05em'
      }}>
        {finding.severity}
      </span>
    );
  };

  return (
    <div
      style={{
        background: 'var(--grad-card)',
        borderRadius: '10px',
        border: `1px solid rgba(255, 255, 255, 0.08)`,
        borderLeft: `4px solid ${getStatusBorder()}`,
        marginBottom: '16px',
        overflow: 'hidden',
        transition: 'all 200ms ease'
      }}
    >
      {/* Header Row */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          background: 'rgba(255, 255, 255, 0.015)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {getStatusIcon()}
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem',
            fontWeight: 600,
            color: '#FFFFFF'
          }}>
            {finding.name}
          </span>
          {getSeverityBadge()}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: finding.score === finding.max_score ? 'var(--green-ui)' : (finding.score > 0 ? 'var(--warn-amber)' : 'var(--accent-red)')
          }}>
            {finding.score} / {finding.max_score} pts
          </div>
          <div className={`status-pill ${finding.status}`}>
            {finding.status}
          </div>
          <button
            type="button"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px'
            }}
            aria-label="Expand details"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Expanded Details Body */}
      {expanded && (
        <div style={{ padding: '0 20px 24px', borderTop: '1px solid var(--line)' }}>
          {/* Finding Message */}
          <div style={{ marginTop: '16px', marginBottom: '16px' }}>
            <p style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 500 }}>
              {finding.message}
            </p>
          </div>

          {/* Current & Recommended Values */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '20px'
          }}>
            {/* Current Value */}
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
                Current Observed Header
              </div>
              <div className="snippet-box" style={{ wordBreak: 'break-all', minHeight: '44px' }}>
                {finding.value ? (
                  <span style={{ color: 'var(--accent-cyan)' }}>{finding.value}</span>
                ) : (
                  <span style={{ color: 'var(--accent-red)', fontStyle: 'italic' }}>Header not set (Missing in response)</span>
                )}
              </div>
            </div>

            {/* Recommended Value */}
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--green-ui)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
                Recommended Best Practice
              </div>
              <div className="snippet-box" style={{ border: '1px solid rgba(30, 218, 37, 0.4)', wordBreak: 'break-all', minHeight: '44px' }}>
                <span style={{ color: 'var(--green-ui)' }}>{finding.recommendation}</span>
              </div>
            </div>
          </div>

          {/* Why it matters */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--line)',
            borderRadius: '6px',
            padding: '14px 16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Info size={16} color="var(--accent-cyan)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>Why This Matters</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {finding.why_it_matters}
            </p>
          </div>

          {/* Platform Fix Tabs & Snippets */}
          {platforms.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>
                  Copy-Paste Fix Snippet
                </div>

                {/* Platform select pills */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {platforms.map((plat) => (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => setSelectedPlatform(plat)}
                      style={{
                        background: selectedPlatform === plat ? 'var(--accent-magenta)' : 'var(--bg-input)',
                        color: selectedPlatform === plat ? '#000009' : 'var(--text-secondary)',
                        border: selectedPlatform === plat ? 'none' : '1px solid var(--line)',
                        borderRadius: '4px',
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 150ms ease'
                      }}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code display with copy button */}
              <div className="snippet-box" style={{ position: 'relative', padding: '16px' }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '0.85rem', color: '#E2E8F0' }}>
                  {currentSnippet}
                </pre>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="btn-primary"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    height: '32px',
                    padding: '0 12px',
                    fontSize: '0.75rem',
                    background: copied ? 'var(--green-ui)' : 'var(--accent-magenta)',
                    color: '#000009'
                  }}
                  title="Copy configuration snippet"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy Fix'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
