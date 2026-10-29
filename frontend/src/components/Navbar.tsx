import React, { useState } from 'react';
import { 
  Shield, 
  Menu, 
  X, 
  Terminal, 
  BookOpen, 
  Layers, 
  GitCompare, 
  ListChecks, 
  History, 
  FileText, 
  Sliders, 
  Bolt, 
  Download,
  Sparkles 
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onQuickScanClick: () => void;
  onExportSarifClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentTab, 
  onSelectTab, 
  onQuickScanClick,
  onExportSarifClick 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'scanner', label: 'Scanner', icon: Shield },
    { id: 'csp', label: 'Policy Generator', icon: Sliders },
    { id: 'diff', label: 'Diff Benchmark', icon: GitCompare },
    { id: 'fixes', label: 'Remediation', icon: Layers },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'bulk', label: 'Bulk Audit', icon: ListChecks },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'history', label: 'History', icon: History },
    { id: 'api', label: 'API Docs', icon: FileText }
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-panel" style={{ height: 'var(--nav-h)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Lockup */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div 
            onClick={() => handleNavClick('scanner')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              background: 'rgba(0, 240, 255, 0.15)',
              border: '1px solid var(--primary-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0, 240, 255, 0.3)'
            }}>
              <Shield size={20} color="var(--primary-cyan)" />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-tactical)',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: 'var(--text-primary)',
                lineHeight: 1
              }}>
                AETHER<span style={{ color: 'var(--primary-cyan)' }}>_SHIELD</span>
              </div>
              <div style={{ fontSize: '0.62rem', color: 'var(--secondary-emerald)', fontFamily: 'var(--font-tactical)', letterSpacing: '0.12em', fontWeight: 600, marginTop: '2px' }}>
                // SEC-OPS ANALYZER
              </div>
            </div>
          </div>

          {/* Scope Indicator (From Stitch) */}
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-tactical)'
          }} className="scope-pill">
            <style>{`
              @media (min-width: 1080px) {
                .scope-pill { display: flex !important; }
              }
            `}</style>
            <span style={{ color: 'var(--text-muted)' }}>scope:</span>
            <span style={{ color: 'var(--secondary-emerald)', fontWeight: 600 }}>PRODUCTION_VPC</span>
            <span style={{
              fontSize: '0.65rem',
              padding: '1px 5px',
              borderRadius: '3px',
              background: 'var(--surface-high)',
              color: 'var(--primary-cyan)',
              border: '1px solid var(--border-subtle)'
            }}>
              LIVE_INGEST
            </span>
          </div>
        </div>

        {/* Desktop Navigation Segmented Pill Strip */}
        <nav className="desktop-nav-strip" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                title={item.label}
              >
                <Icon size={13} color={isActive ? 'var(--primary-cyan)' : 'currentColor'} />
                <span>{item.label}</span>
                {isActive && <span className="nav-tab-glow-indicator" />}
              </button>
            );
          })}
        </nav>

        {/* Action Cluster (From Stitch) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onExportSarifClick && (
            <button
              type="button"
              onClick={onExportSarifClick}
              className="btn-secondary"
              style={{
                display: 'none',
                height: '34px',
                padding: '0 12px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-tactical)'
              }}
              id="nav-export-sarif"
            >
              <style>{`
                @media (min-width: 720px) {
                  #nav-export-sarif { display: inline-flex !important; }
                }
              `}</style>
              <Download size={13} />
              <span>EXPORT SARIF</span>
            </button>
          )}

          <button
            type="button"
            onClick={onQuickScanClick}
            className="btn-primary"
            style={{
              height: '34px',
              padding: '0 15px',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-tactical)'
            }}
          >
            <Bolt size={14} />
            <span>NEW SCAN</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: 'var(--nav-h)',
          left: 0,
          right: 0,
          background: 'var(--surface-1)',
          borderBottom: '1px solid var(--border-cyan)',
          padding: '16px 20px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.85)',
          backdropFilter: 'blur(20px)',
          zIndex: 100
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    background: isActive ? 'rgba(0, 240, 255, 0.12)' : 'var(--surface-card)',
                    border: isActive ? '1px solid var(--border-cyan)' : '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: isActive ? 'var(--primary-cyan)' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-tactical)',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 150ms ease'
                  }}
                >
                  <Icon size={14} color={isActive ? 'var(--primary-cyan)' : 'currentColor'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
