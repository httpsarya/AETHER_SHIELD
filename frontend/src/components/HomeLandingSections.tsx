import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  Cpu, 
  CheckCircle, 
  Zap, 
  Lock, 
  Code, 
  Users, 
  GraduationCap, 
  Server, 
  ArrowRight,
  Terminal
} from 'lucide-react';

interface HomeLandingSectionsProps {
  onScanClick: () => void;
  onExploreLearn: () => void;
  onExploreFixes: () => void;
}

export const HomeLandingSections: React.FC<HomeLandingSectionsProps> = ({
  onScanClick,
  onExploreLearn,
  onExploreFixes
}) => {
  return (
    <div>
      {/* How It Works Infographic Flow */}
      <section style={{ padding: '96px 0', background: 'var(--bg-navy)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 56px' }}>
            <h2 style={{ marginBottom: '16px' }}>
              How the <span style={{ color: 'var(--accent-magenta)' }}>Audit Engine</span> Works
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              From initial request to verified fix snippet in 5 deterministic, automated steps.
            </p>
          </div>

          <div className="engine-steps-grid">
            {[
              { step: '01', title: 'Target Validation', desc: 'SSRF guard checks IP routing, blocking private/internal IP ranges and metadata hostnames.', color: 'var(--accent-cyan)' },
              { step: '02', title: 'Async Header Fetch', desc: 'Fetches headers, follows up to 5 redirect hops, and validates IP pinning on each hop.', color: 'var(--accent-magenta)' },
              { step: '03', title: 'Rule Evaluation', desc: 'Evaluates CSP directives, HSTS max-age, framing protections, and information leakage.', color: 'var(--warn-amber)' },
              { step: '04', title: 'Grading & Scoring', desc: 'Calculates deterministic 0-100 score and assigns letter grade (A+ to F).', color: 'var(--green-ui)' },
              { step: '05', title: 'Fix Generation', desc: 'Delivers ready-to-paste configurations for Nginx, Apache, Express, Flask, Django & Cloudflare.', color: '#A51FD7' }
            ].map((item) => (
              <div key={item.step} className="card" style={{ padding: '24px 20px', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{
                  fontFamily: 'var(--font-brand)',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: item.color,
                  marginBottom: '12px',
                  lineHeight: 1
                }}>
                  {item.step}
                </div>
                <h4 style={{ fontSize: '1rem', marginBottom: '8px', color: '#FFFFFF' }}>{item.title}</h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Audience Cards */}
      <section style={{ padding: '96px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 56px' }}>
            <h2 style={{ marginBottom: '16px' }}>Built for Modern Engineering Teams</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Whether you are shipping microservices, learning OWASP standards, or automating CI/CD.
            </p>
          </div>

          <div className="audience-grid">
            {/* Developers */}
            <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Code size={24} color="var(--green-ui)" />
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--green-ui)' }}>Web Developers</h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Stop guessing complex CSP syntax or HSTS parameters. Get the exact config block for your exact server stack in one click.
                </p>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} color="var(--green-ui)" /> Instant copy-paste snippets
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} color="var(--green-ui)" /> Safe CSP rollout report-only policy
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} color="var(--green-ui)" /> Re-scan to verify score jump
                </li>
              </ul>
            </div>

            {/* Students & Beginners */}
            <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <GraduationCap size={24} color="var(--accent-cyan)" />
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--accent-cyan)' }}>Security Students</h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Learn how each header protects users from real-world attacks like XSS, Clickjacking, MIME confusion, and packet sniffing.
                </p>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} color="var(--accent-cyan)" /> Plain-English explanations
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} color="var(--accent-cyan)" /> Threat model breakdowns
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} color="var(--accent-cyan)" /> Curated MDN & OWASP references
                </li>
              </ul>
            </div>

            {/* DevOps / SRE */}
            <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Server size={24} color="var(--accent-magenta)" />
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--accent-magenta)' }}>DevOps & SRE</h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Automate compliance checks in GitHub Actions, fail builds below required security scores, and run batch audits on client domains.
                </p>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} color="var(--accent-magenta)" /> Standard SARIF v2.1.0 output
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} color="var(--accent-magenta)" /> Bulk scanning of up to 25 URLs
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} color="var(--accent-magenta)" /> Automated CSV and JSON exports
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Project Creator & Identity Details */}
      <section style={{ padding: '80px 0', background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{
            width: '100%',
            margin: '0 auto',
            background: 'var(--surface-card)',
            border: '1px solid var(--border-cyan)',
            borderRadius: '16px',
            padding: '48px 36px',
            boxShadow: '0 0 35px rgba(0, 240, 255, 0.12)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 14px',
                borderRadius: '999px',
                background: 'rgba(0, 240, 255, 0.12)',
                border: '1px solid var(--border-cyan)',
                color: 'var(--primary-cyan)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-tactical)',
                letterSpacing: '0.08em',
                marginBottom: '12px'
              }}>
                <GraduationCap size={14} />
                <span>PROJECT ARCHITECT & IDENTITY</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '6px' }}>
                Arya Tiwari
              </h3>
              <p style={{ color: 'var(--secondary-emerald)', fontFamily: 'var(--font-tactical)', fontSize: '0.95rem', fontWeight: 600 }}>
                CSE Student • Bennett University, Greater Noida, India
              </p>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '780px', fontSize: '0.9rem', marginTop: '12px', lineHeight: 1.6 }}>
                Architect of the AETHER_SHIELD HTTP Security Header Analyzer. Designed to provide deterministic, SSRF-safe header inspection, RFC-compliant scoring, and instant server remediation configs for web engineering teams.
              </p>
            </div>

            {/* Identity & Contact Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              fontFamily: 'var(--font-tactical)',
              fontSize: '0.8rem'
            }}>
              <a
                href="https://httpsarya.github.io/Arya_Tiwari_portfolio_12/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'var(--surface-high)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--primary-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                  transition: 'all 150ms ease'
                }}
              >
                <span>🌐 Portfolio: Arya Tiwari</span>
              </a>

              <a
                href="https://github.com/httpsarya"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'var(--surface-high)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                  transition: 'all 150ms ease'
                }}
              >
                <span>💻 GitHub: @httpsarya</span>
              </a>

              <a
                href="https://www.linkedin.com/in/arya-tiwari-01ba84292/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'var(--surface-high)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                  transition: 'all 150ms ease'
                }}
              >
                <span>🔗 LinkedIn Profile</span>
              </a>

              <a
                href="mailto:arya2tiwari@gmail.com"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'var(--surface-high)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                  transition: 'all 150ms ease'
                }}
              >
                <span>✉️ arya2tiwari@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Footer Call to Action Band */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(180deg, var(--bg-navy) 0%, var(--bg-void) 100%)',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{
            width: '100%',
            margin: '0 auto',
            padding: '56px 40px',
            borderRadius: '16px',
            background: 'rgba(254, 1, 255, 0.04)',
            border: '1px solid rgba(254, 1, 255, 0.3)',
            boxShadow: '0 0 40px rgba(254, 1, 255, 0.15)'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>
              Ready to harden your website?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '32px' }}>
              Run your first scan right now. No credit card, no registration, and no delay.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={onScanClick}
                className="btn-primary"
                style={{ padding: '0 32px' }}
              >
                <span>Audit Your Headers</span>
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                onClick={onExploreFixes}
                className="btn-secondary"
                style={{ padding: '0 24px' }}
              >
                <span>Browse Fix Templates</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
