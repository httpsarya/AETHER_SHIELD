import React from 'react';
import { TlsSummary } from '../types';
import { Lock, ShieldCheck, Key, CheckCircle2 } from 'lucide-react';

interface TlsSummaryCardProps {
  tls: TlsSummary;
}

export const TlsSummaryCard: React.FC<TlsSummaryCardProps> = ({ tls }) => {
  return (
    <div className="card-navy">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={18} color="var(--accent-cyan)" />
          <h4 style={{ fontSize: '1rem', color: '#FFFFFF' }}>TLS & Transport Security</h4>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.75rem',
          color: 'var(--green-ui)',
          background: 'rgba(30, 218, 37, 0.1)',
          padding: '2px 8px',
          borderRadius: '4px',
          border: '1px solid rgba(30, 218, 37, 0.3)'
        }}>
          <CheckCircle2 size={12} />
          <span>Encrypted</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px'
      }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--line)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Protocol</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 600, marginTop: '4px' }}>
            {tls.protocol || 'TLSv1.3'}
          </div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--line)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cipher Suite</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '4px', wordBreak: 'break-all' }}>
            {tls.cipher || 'TLS_AES_256_GCM_SHA384'}
          </div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--line)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Certificate Authority</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#FFFFFF', marginTop: '4px' }}>
            {tls.issuer || "Let's Encrypt / DigiCert"}
          </div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--line)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--green-ui)', fontWeight: 600, marginTop: '4px' }}>
            {tls.expiry || 'Valid'}
          </div>
        </div>
      </div>
    </div>
  );
};
