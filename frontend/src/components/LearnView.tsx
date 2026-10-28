import React, { useState } from 'react';
import { HeaderInfo } from '../types';
import { BookOpen, Search, ShieldAlert, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';

interface LearnViewProps {
  headers: HeaderInfo[];
  onScanTarget: (exampleUrl: string) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({ headers, onScanTarget }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...new Set(headers.map((h) => h.category))];

  const filtered = headers.filter((h) => {
    const matchesCategory = selectedCategory === 'All' || h.category === selectedCategory;
    const matchesSearch = 
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.attacks_prevented.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Header Title */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 14px',
            borderRadius: '999px',
            background: 'rgba(34, 214, 243, 0.1)',
            border: '1px solid var(--accent-cyan)',
            color: 'var(--accent-cyan)',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '16px'
          }}>
            <BookOpen size={14} />
            <span>Educational Knowledge Base</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
            HTTP Security Header <span style={{ color: 'var(--accent-cyan)' }}>Encyclopedia</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Deep-dive into every major browser security header, learn the attacks each directive neutralizes, and follow industry best practices.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '36px',
          flexWrap: 'wrap'
        }}>
          {/* Search Field */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-input)',
            border: '1px solid var(--line)',
            borderRadius: '6px',
            padding: '8px 16px',
            flex: 1,
            minWidth: '260px'
          }}>
            <Search size={18} color="var(--text-muted)" style={{ marginRight: '10px' }} />
            <input
              type="text"
              placeholder="Search headers, attack vectors (e.g., XSS, Clickjacking)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                outline: 'none',
                width: '100%',
                fontFamily: 'var(--font-sans)'
              }}
            />
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? 'var(--accent-cyan)' : 'var(--bg-surface)',
                  color: selectedCategory === cat ? '#000009' : 'var(--text-secondary)',
                  border: selectedCategory === cat ? 'none' : '1px solid var(--line)',
                  borderRadius: '4px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Header Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px'
        }}>
          {filtered.map((h) => (
            <div key={h.name} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--accent-cyan)',
                    background: 'rgba(34, 214, 243, 0.1)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {h.category}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--green-ui)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    Max {h.max_points} pts
                  </span>
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.2rem',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  {h.name}
                </h3>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                  {h.description}
                </p>

                {/* Attacks Prevented */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--accent-red)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>
                    <ShieldAlert size={14} />
                    <span>Attacks Mitigated</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {h.attacks_prevented.map((attack) => (
                      <span
                        key={attack}
                        style={{
                          fontSize: '0.75rem',
                          background: 'rgba(255, 31, 66, 0.1)',
                          border: '1px solid rgba(255, 31, 66, 0.25)',
                          color: '#FFA3B0',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        {attack}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Value */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--green-ui)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
                    Recommended Value
                  </div>
                  <div className="snippet-box" style={{ fontSize: '0.8rem', border: '1px solid rgba(30, 218, 37, 0.35)', color: 'var(--green-ui)' }}>
                    {h.recommended_value}
                  </div>
                </div>
              </div>

              {/* MDN / External link */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <a
                  href={h.mdn_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                  style={{ padding: 0, fontSize: '0.8rem', color: 'var(--accent-cyan)' }}
                >
                  <span>Official Documentation</span>
                  <ExternalLink size={14} />
                </a>

                <button
                  type="button"
                  onClick={() => onScanTarget('https://developer.mozilla.org')}
                  className="btn-ghost"
                  style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                >
                  <span>Test Sample Site</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
