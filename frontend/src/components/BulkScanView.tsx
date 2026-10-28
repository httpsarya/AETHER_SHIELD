import React, { useState } from 'react';
import { BulkScanResponse, BulkItemResult } from '../types';
import { bulkScanTargets } from '../services/api';
import { ListChecks, Play, Download, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

interface BulkScanViewProps {
  onCopyNotice: (msg: string) => void;
  onSelectScanId?: (id: string) => void;
}

export const BulkScanView: React.FC<BulkScanViewProps> = ({ onCopyNotice, onSelectScanId }) => {
  const [urlsInput, setUrlsInput] = useState(
    'https://github.com\nhttps://cloudflare.com\nhttps://wikipedia.org\nhttps://owasp.org'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bulkResult, setBulkResult] = useState<BulkScanResponse | null>(null);

  const handleStartBulk = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawList = urlsInput
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (rawList.length === 0) {
      setError('Please enter at least one URL to scan.');
      return;
    }
    if (rawList.length > 25) {
      setError('Maximum 25 URLs allowed per batch scan.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await bulkScanTargets(rawList);
      setBulkResult(data);
    } catch (err: any) {
      setError(err.message || 'Bulk scan execution failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    if (!bulkResult) return;
    const rows = [
      ['URL', 'Status', 'Score', 'Grade', 'Scan ID'],
      ...bulkResult.results.map((r) => [r.url, r.status, r.score, r.grade, r.scan_id || ''])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bulk_scan_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    onCopyNotice('Bulk audit CSV exported');
  };

  const handleExportJson = () => {
    if (!bulkResult) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bulkResult, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `bulk_scan_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onCopyNotice('Bulk audit JSON exported');
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
            background: 'rgba(30, 218, 37, 0.1)',
            border: '1px solid var(--green-ui)',
            color: 'var(--green-ui)',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '16px'
          }}>
            <ListChecks size={14} />
            <span>High-Throughput Batch Engine</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
            Batch <span style={{ color: 'var(--green-ui)' }}>Bulk Scanner</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Audit multiple microservices or client domains simultaneously with controlled concurrency and export aggregated results.
          </p>
        </div>

        {/* Input Textarea Card */}
        <form onSubmit={handleStartBulk} className="card" style={{ marginBottom: '36px', padding: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#FFFFFF', marginBottom: '8px', fontWeight: 600 }}>
            Target URLs (One per line, up to 25 URLs)
          </label>
          <textarea
            value={urlsInput}
            onChange={(e) => setUrlsInput(e.target.value)}
            rows={5}
            disabled={loading}
            placeholder="https://example.com&#10;https://service-b.net"
            className="input-field"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', resize: 'vertical', marginBottom: '16px' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Concurrency throttled to 5 simultaneous targets with individual SSRF validation.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ minWidth: '170px' }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Scanning Batch...</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>Start Bulk Scan</span>
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

        {/* Bulk Scan Results Table */}
        {bulkResult && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>
                  Batch Results ({bulkResult.results.length} Scans Completed)
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="btn-ghost"
                  style={{ border: '1px solid var(--line)', fontSize: '0.8rem' }}
                >
                  <Download size={14} />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="btn-ghost"
                  style={{ border: '1px solid var(--line)', fontSize: '0.8rem' }}
                >
                  <Download size={14} />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--line)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Target Domain</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Grade</th>
                    <th style={{ padding: '12px 16px' }}>Score</th>
                    <th style={{ padding: '12px 16px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bulkResult.results.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: '#FFFFFF', fontSize: '0.85rem' }}>
                        {item.url}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`status-pill ${item.status === 'success' ? 'pass' : 'fail'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          fontFamily: 'var(--font-brand)',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: item.grade === 'A+' || item.grade === 'A' ? 'var(--green-ui)' : (item.grade === 'B' ? 'var(--accent-cyan)' : 'var(--accent-red)')
                        }}>
                          {item.grade}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: '#FFFFFF' }}>
                        {item.score} / 100
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {item.scan_id && onSelectScanId && (
                          <button
                            type="button"
                            onClick={() => onSelectScanId(item.scan_id!)}
                            className="btn-ghost"
                            style={{ fontSize: '0.75rem', color: 'var(--accent-magenta)', padding: '2px 8px' }}
                          >
                            View Report
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
