import React, { useState } from 'react';
import { ScanResponse } from '../types';
import { History, Trash2, ArrowUpRight, RefreshCw, GitCompare, ExternalLink } from 'lucide-react';

interface ScanHistoryViewProps {
  history: ScanResponse[];
  onSelectScan: (scan: ScanResponse) => void;
  onRescan: (url: string) => void;
  onClearHistory: () => void;
  onCompareTwo: (urlA: string, urlB: string) => void;
}

export const ScanHistoryView: React.FC<ScanHistoryViewProps> = ({
  history,
  onSelectScan,
  onRescan,
  onClearHistory,
  onCompareTwo
}) => {
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

  const toggleSelectUrl = (url: string) => {
    if (selectedUrls.includes(url)) {
      setSelectedUrls(selectedUrls.filter((u) => u !== url));
    } else {
      if (selectedUrls.length < 2) {
        setSelectedUrls([...selectedUrls, url]);
      } else {
        setSelectedUrls([selectedUrls[1], url]);
      }
    }
  };

  const handleRunCompare = () => {
    if (selectedUrls.length === 2) {
      onCompareTwo(selectedUrls[0], selectedUrls[1]);
    }
  };

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Title */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 14px',
            borderRadius: '999px',
            background: 'rgba(254, 1, 255, 0.1)',
            border: '1px solid var(--accent-magenta)',
            color: 'var(--accent-magenta)',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '16px'
          }}>
            <History size={14} />
            <span>Local Anonymous Audit Log</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
            Scan <span style={{ color: 'var(--accent-magenta)' }}>History</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Retained locally in your browser. Re-run scans, inspect previous audit reports, or select two scans to compare diffs.
          </p>
        </div>

        {/* Action Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 600 }}>
            {history.length} Previous Audits
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {selectedUrls.length === 2 && (
              <button
                type="button"
                onClick={handleRunCompare}
                className="btn-primary"
                style={{ height: '36px', padding: '0 14px', fontSize: '0.8rem' }}
              >
                <GitCompare size={14} />
                <span>Compare Selected (2)</span>
              </button>
            )}

            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="btn-ghost"
                style={{ height: '36px', padding: '0 14px', color: 'var(--accent-red)', border: '1px solid rgba(255,31,66,0.3)', fontSize: '0.8rem' }}
              >
                <Trash2 size={14} />
                <span>Clear History</span>
              </button>
            )}
          </div>
        </div>

        {/* History Table */}
        {history.length === 0 ? (
          <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No scan history recorded yet.</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Run a scan from the home page or try example targets to start building your audit log.
            </p>
          </div>
        ) : (
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--line)', background: 'rgba(255, 255, 255, 0.02)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '14px 16px', width: '40px' }}>Diff</th>
                    <th style={{ padding: '14px 16px' }}>Target Website</th>
                    <th style={{ padding: '14px 16px' }}>Grade</th>
                    <th style={{ padding: '14px 16px' }}>Score</th>
                    <th style={{ padding: '14px 16px' }}>Passed / Total</th>
                    <th style={{ padding: '14px 16px' }}>Scanned At</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => {
                    const isSelected = selectedUrls.includes(item.url);
                    return (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          background: isSelected ? 'rgba(254, 1, 255, 0.05)' : 'transparent',
                          transition: 'background 150ms ease'
                        }}
                      >
                        <td style={{ padding: '14px 16px' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectUrl(item.url)}
                            style={{ accentColor: 'var(--accent-magenta)' }}
                            title="Select for comparison (choose up to 2)"
                          />
                        </td>
                        <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: '#FFFFFF', fontSize: '0.85rem' }}>
                          {item.url}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            fontFamily: 'var(--font-brand)',
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            color: item.grade === 'A+' || item.grade === 'A' ? 'var(--green-ui)' : (item.grade === 'B' ? 'var(--accent-cyan)' : 'var(--accent-red)')
                          }}>
                            {item.grade}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: '#FFFFFF', fontSize: '0.85rem' }}>
                          {item.score} / 100
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <span style={{ color: 'var(--green-ui)' }}>{item.summary.passed}</span> / {item.summary.total_rules}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(item.scanned_at).toLocaleString()}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => onSelectScan(item)}
                              className="btn-ghost"
                              style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}
                            >
                              <span>View</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onRescan(item.url)}
                              className="btn-ghost"
                              style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                            >
                              <RefreshCw size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
