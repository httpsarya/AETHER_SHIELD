import React, { useState } from 'react';
import { FileText, Copy, Check, Terminal, ExternalLink, Code2, Server } from 'lucide-react';

interface ApiDocsViewProps {
  onCopyNotice: (msg: string) => void;
}

export const ApiDocsView: React.FC<ApiDocsViewProps> = ({ onCopyNotice }) => {
  const [activeTab, setActiveTab] = useState<'curl' | 'python' | 'js'>('curl');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onCopyNotice('Copied API sample code to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const curlExample = `# 1. Scan a target website
curl -X POST "http://localhost:8000/api/v1/scan" \\
     -H "Content-Type: application/json" \\
     -d '{"url": "https://example.com", "follow_redirects": true}'

# 2. Retrieve a previous scan by ID
curl "http://localhost:8000/api/v1/scan/scan_abc123"

# 3. Export audit findings as CSV
curl "http://localhost:8000/api/v1/export/scan_abc123?format=csv" -o audit.csv`;

  const pythonExample = `import httpx

API_BASE = "http://localhost:8000/api/v1"

# Trigger SSRF-safe scan
payload = {"url": "https://example.com", "follow_redirects": True}
resp = httpx.post(f"{API_BASE}/scan", json=payload, timeout=15.0)
audit = resp.json()

print(f"Target: {audit['url']}")
print(f"Grade:  {audit['grade']} ({audit['score']}/100)")

for finding in audit["findings"]:
    if finding["status"] != "pass":
        print(f"[-] {finding['name']}: {finding['message']}")
        print(f"    Fix (Nginx): {finding['fixes'].get('Nginx')}")`;

  const jsExample = `// Native fetch example for Node.js / Browser
const response = await fetch('/api/v1/scan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://example.com',
    follow_redirects: true
  })
});

const result = await response.json();
console.log(\`Grade: \${result.grade}, Score: \${result.score}/100\`);`;

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Title */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
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
            <Code2 size={14} />
            <span>Developer API Reference</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
            REST API & <span style={{ color: 'var(--accent-cyan)' }}>Automation</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Integrate security header audits into your CI pipelines, monitoring scripts, and infrastructure deployment pipelines.
          </p>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href="AETHER_SHIELD_Project_Documentation_Viva_Guide.pdf"
              download="AETHER_SHIELD_Project_Documentation_Viva_Guide.pdf"
              className="btn-primary"
              style={{ fontSize: '0.85rem', height: '42px', padding: '0 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <FileText size={16} />
              <span>Download Viva Defense Guide (PDF)</span>
            </a>
            <a
              href="http://localhost:8000/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ fontSize: '0.85rem', height: '42px', padding: '0 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <span>Interactive Swagger UI</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Code Sample Tabs */}
        <div className="card" style={{ marginBottom: '40px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['curl', 'python', 'js'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: activeTab === tab ? 'var(--accent-cyan)' : 'var(--bg-input)',
                    color: activeTab === tab ? '#000009' : '#FFFFFF',
                    border: activeTab === tab ? 'none' : '1px solid var(--line)',
                    borderRadius: '4px',
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {tab === 'curl' ? 'cURL' : (tab === 'python' ? 'Python' : 'JavaScript / Node')}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleCopy('sample', activeTab === 'curl' ? curlExample : (activeTab === 'python' ? pythonExample : jsExample))}
              className="btn-ghost"
              style={{ fontSize: '0.75rem', border: '1px solid var(--line)' }}
            >
              {copiedKey === 'sample' ? <Check size={14} color="var(--green-ui)" /> : <Copy size={14} />}
              <span>{copiedKey === 'sample' ? 'Copied' : 'Copy Snippet'}</span>
            </button>
          </div>

          <div className="snippet-box">
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#F1F5F9' }}>
              {activeTab === 'curl' ? curlExample : (activeTab === 'python' ? pythonExample : jsExample)}
            </pre>
          </div>
        </div>

        {/* Endpoints Table */}
        <div className="card" style={{ padding: '24px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '16px' }}>Core REST Endpoints</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { method: 'POST', path: '/api/v1/scan', desc: 'Trigger SSRF-safe scan against target URL and compute deterministic scores.' },
              { method: 'GET', path: '/api/v1/scan/{scan_id}', desc: 'Retrieve cached scan result by unique audit token.' },
              { method: 'POST', path: '/api/v1/compare', desc: 'Compute head-to-head diff analysis between two target URLs.' },
              { method: 'POST', path: '/api/v1/bulk', desc: 'Batch scan up to 25 target URLs with 5 concurrent workers.' },
              { method: 'GET', path: '/api/v1/headers', desc: 'Educational encyclopedia of all security headers, rules, and attacks mitigated.' },
              { method: 'GET', path: '/api/v1/export/{scan_id}?format=csv', desc: 'Export scan results directly to CSV format.' }
            ].map((ep) => (
              <div key={ep.path} style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--line)',
                borderRadius: '6px',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                width: '100%'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: ep.method === 'POST' ? 'rgba(254, 1, 255, 0.15)' : 'rgba(30, 218, 37, 0.15)',
                    color: ep.method === 'POST' ? 'var(--accent-magenta)' : 'var(--green-ui)',
                    border: ep.method === 'POST' ? '1px solid var(--magenta-border)' : '1px solid rgba(30,218,37,0.3)'
                  }}>
                    {ep.method}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', color: '#FFFFFF', fontWeight: 600 }}>
                    {ep.path}
                  </span>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', flex: 1, minWidth: '280px', textAlign: 'right' }}>
                  {ep.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CI/CD & SARIF Integration Section */}
        <div className="card-navy" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Terminal size={20} color="var(--accent-green)" />
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>CI/CD & GitHub Actions Automation (CLI)</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
            Integrate our CLI runner (<code style={{ color: 'var(--accent-cyan)' }}>cli/main.py</code>) into your workflow to enforce security headers before deploying to production.
          </p>
          <div className="snippet-box">
            <pre style={{ margin: 0, color: '#A7F3D0', fontSize: '0.85rem' }}>
{`# Run CLI scan and fail build if score is below 80:
python -m cli.main https://your-staging-site.com --fail-under 80

# Output SARIF format for GitHub Code Scanning / Security Alerts:
python -m cli.main https://your-staging-site.com --sarif > results.sarif`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
