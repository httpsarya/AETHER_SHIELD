import React, { useState } from 'react';
import { Terminal, Copy, Check, Search } from 'lucide-react';

interface RawHeadersViewerProps {
  headers: Record<string, string>;
  onCopyNotice: (msg: string) => void;
}

export const RawHeadersViewer: React.FC<RawHeadersViewerProps> = ({ headers, onCopyNotice }) => {
  const [filter, setFilter] = useState('');
  const [copied, setCopied] = useState(false);

  const headerEntries = Object.entries(headers || {});
  const filtered = headerEntries.filter(([k, v]) => 
    k.toLowerCase().includes(filter.toLowerCase()) || 
    v.toLowerCase().includes(filter.toLowerCase())
  );

  const rawText = headerEntries.map(([k, v]) => `${k}: ${v}`).join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    onCopyNotice('Copied raw response headers to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card-navy">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={18} color="var(--accent-magenta)" />
          <h4 style={{ fontSize: '1rem', color: '#FFFFFF' }}>Raw HTTP Response Headers ({headerEntries.length})</h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Quick search */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', border: '1px solid var(--line)', borderRadius: '4px', padding: '4px 10px' }}>
            <Search size={14} color="var(--text-muted)" style={{ marginRight: '6px' }} />
            <input
              type="text"
              placeholder="Search headers..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '0.8rem',
                outline: 'none',
                width: '120px'
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="btn-ghost"
            style={{ fontSize: '0.75rem', padding: '6px 12px', border: '1px solid var(--line)' }}
          >
            {copied ? <Check size={14} color="var(--green-ui)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy All'}</span>
          </button>
        </div>
      </div>

      <div className="snippet-box" style={{ maxHeight: '320px', overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '16px' }}>No headers match filter</div>
        ) : (
          filtered.map(([k, v]) => (
            <div key={k} style={{ marginBottom: '6px', lineHeight: 1.4 }}>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{k}</span>
              <span style={{ color: 'var(--text-muted)' }}>: </span>
              <span style={{ color: '#E2E8F0', wordBreak: 'break-all' }}>{v}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
