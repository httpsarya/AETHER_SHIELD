import React, { useState } from 'react';
import { CompareResponse } from '../types';
import { compareTargets } from '../services/api';
import { GradeBadge } from './GradeBadge';
import { GitCompare, ArrowRight, ArrowUpRight, ArrowDownRight, Minus, AlertCircle, RefreshCw } from 'lucide-react';

interface CompareViewProps {
  onCopyNotice: (msg: string) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({ onCopyNotice }) => {
  const [urlA, setUrlA] = useState('https://example.com');
  const [urlB, setUrlB] = useState('https://github.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CompareResponse | null>(null);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlA.trim() || !urlB.trim()) {
      setError('Please provide two valid URLs to compare.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await compareTargets(urlA.trim(), urlB.trim());
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Comparison failed. Check target URLs.');
    } finally {
      setLoading(false);
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
            <GitCompare size={14} />
            <span>Side-by-Side Target Audit</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
            Compare Security <span style={{ color: 'var(--accent-magenta)' }}>Posture</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Compare two different web assets or verify before-and-after improvements on a single application.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCompare} className="card" style={{ marginBottom: '40px', padding: '24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                TARGET A (Baseline)
              </label>
              <input
                type="text"
                value={urlA}
                onChange={(e) => setUrlA(e.target.value)}
                placeholder="https://baseline.example.com"
                className="input-field"
                disabled={loading}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                TARGET B (Comparison or Staging)
              </label>
              <input
                type="text"
                value={urlB}
                onChange={(e) => setUrlB(e.target.value)}
                placeholder="https://staging.example.com"
                className="input-field"
                disabled={loading}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ minWidth: '180px' }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Auditing Targets...</span>
                </>
              ) : (
                <>
                  <GitCompare size={18} />
                  <span>Run Comparison</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: 'rgba(255, 31, 66, 0.1)',
              border: '1px solid var(--accent-red)',
              borderRadius: '6px',
              color: 'var(--accent-red)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Results Comparison View */}
        {result && (
          <div>
            {/* Header Score Delta Card */}
            <div className="card" style={{ marginBottom: '32px', padding: '32px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '24px',
                alignItems: 'center'
              }}>
                {/* Target A Summary */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>TARGET A</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: '#FFFFFF', marginBottom: '14px', wordBreak: 'break-all' }}>
                    {result.target_a.url}
                  </div>
                  <GradeBadge grade={result.target_a.grade} score={result.target_a.score} size="compact" />
                </div>

                {/* Score Delta Indicator */}
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    NET SCORE DELTA
                  </div>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: result.score_delta > 0 ? 'var(--green-ui)' : (result.score_delta < 0 ? 'var(--accent-red)' : 'var(--text-secondary)')
                  }}>
                    {result.score_delta > 0 ? `+${result.score_delta}` : result.score_delta}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {result.score_delta > 0 ? 'Target B is significantly more secure' : (result.score_delta < 0 ? 'Target B has degraded security posture' : 'Identical security scores')}
                  </div>
                </div>

                {/* Target B Summary */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>TARGET B</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: '#FFFFFF', marginBottom: '14px', wordBreak: 'break-all' }}>
                    {result.target_b.url}
                  </div>
                  <GradeBadge grade={result.target_b.grade} score={result.target_b.score} size="compact" />
                </div>
              </div>
            </div>

            {/* Detailed Header Diff Table */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: '#FFFFFF' }}>
                Header-by-Header Detailed Diff
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--line)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 16px' }}>Security Header</th>
                      <th style={{ padding: '12px 16px' }}>Target A Status</th>
                      <th style={{ padding: '12px 16px' }}>Target B Status</th>
                      <th style={{ padding: '12px 16px' }}>Comparison Diff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.comparisons.map((diff) => {
                      let tagBg = 'rgba(255, 255, 255, 0.05)';
                      let tagColor = 'var(--text-muted)';
                      let icon = <Minus size={14} />;

                      if (diff.comparison === 'improved') {
                        tagBg = 'rgba(30, 218, 37, 0.15)';
                        tagColor = 'var(--green-ui)';
                        icon = <ArrowUpRight size={14} />;
                      } else if (diff.comparison === 'regressed') {
                        tagBg = 'rgba(255, 31, 66, 0.15)';
                        tagColor = 'var(--accent-red)';
                        icon = <ArrowDownRight size={14} />;
                      }

                      return (
                        <tr key={diff.header} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                          <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: '#FFFFFF', fontSize: '0.85rem' }}>
                            {diff.header}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span className={`status-pill ${diff.target_a.status}`}>
                              {diff.target_a.status} ({diff.target_a.score}pts)
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span className={`status-pill ${diff.target_b.status}`}>
                              {diff.target_b.status} ({diff.target_b.score}pts)
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 10px',
                              borderRadius: '4px',
                              background: tagBg,
                              color: tagColor,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              textTransform: 'uppercase'
                            }}>
                              {icon}
                              <span>{diff.comparison}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
