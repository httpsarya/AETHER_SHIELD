import React, { useState } from 'react';
import { Layers, Copy, Check, AlertTriangle, ShieldCheck, Terminal, Server } from 'lucide-react';

interface FixGuideViewProps {
  onCopyNotice: (msg: string) => void;
}

export const FixGuideView: React.FC<FixGuideViewProps> = ({ onCopyNotice }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('Nginx');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const platforms = [
    { id: 'Nginx', label: 'Nginx' },
    { id: 'Apache', label: 'Apache' },
    { id: 'Express', label: 'Express (Node.js)' },
    { id: 'Flask', label: 'Flask (Python)' },
    { id: 'Django', label: 'Django (Python)' },
    { id: 'Cloudflare', label: 'Cloudflare' },
    { id: 'IIS', label: 'Microsoft IIS' }
  ];

  const fullConfigs: Record<string, string> = {
    Nginx: `# ==============================================================================
# Production Security Headers Configuration for Nginx
# Place inside server { ... } or http { ... } block
# ==============================================================================

# Content Security Policy (Adjust domains as needed for your application)
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; frame-ancestors 'self'; form-action 'self'; base-uri 'self';" always;

# HTTP Strict Transport Security (HSTS) - 1 Year with Subdomains and Preload
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Prevent MIME type sniffing
add_header X-Content-Type-Options "nosniff" always;

# Defense against Clickjacking
add_header X-Frame-Options "DENY" always;

# Referrer Policy to prevent token leakage in URL query parameters
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Permissions Policy: restrict intrusive hardware and tracking APIs
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;

# Cross-Origin Policies for Spectre side-channel mitigation
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Resource-Policy "same-origin" always;

# Hide server software version in response banners
server_tokens off;`,

    Apache: `# ==============================================================================
# Production Security Headers Configuration for Apache (.htaccess or httpd.conf)
# Requires mod_headers enabled: a2enmod headers
# ==============================================================================

<IfModule mod_headers.c>
  # Content Security Policy
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; frame-ancestors 'self'; form-action 'self'; base-uri 'self';"

  # HTTP Strict Transport Security (HSTS)
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

  # Prevent MIME-Sniffing
  Header always set X-Content-Type-Options "nosniff"

  # Clickjacking Protection
  Header always set X-Frame-Options "DENY"

  # Referrer Policy
  Header always set Referrer-Policy "strict-origin-when-cross-origin"

  # Permissions Policy
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"

  # Cross-Origin Policies
  Header always set Cross-Origin-Opener-Policy "same-origin"
  Header always set Cross-Origin-Resource-Policy "same-origin"

  # Strip Information Leaks
  Header unset X-Powered-By
</IfModule>

# Hide Apache version banner
ServerTokens Prod
ServerSignature Off`,

    Express: `// ==============================================================================
// Production Security Headers for Node.js / Express using Helmet
// Install: npm install helmet
// ==============================================================================

import express from 'express';
import helmet from 'helmet';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        fontSrc: ["'self'"],
        frameAncestors: ["'self'"],
        formAction: ["'self'"],
        baseUri: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

// Explicitly set Permissions-Policy
app.use((req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );
  next();
});

// Explicitly disable X-Powered-By
app.disable('x-powered-by');`,

    Flask: `# ==============================================================================
# Production Security Headers for Python Flask
# ==============================================================================

from flask import Flask, Response

app = Flask(__name__)

@app.after_request
def apply_security_headers(response: Response):
    # Enforce HTTPS HSTS
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
    
    # Restrict Resource Loading
    response.headers['Content-Security-Policy'] = (
        "default-src 'self'; script-src 'self'; style-src 'self'; "
        "img-src 'self' data:; font-src 'self'; frame-ancestors 'self';"
    )
    
    # MIME Sniffing & Framing
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    
    # Privacy & Origin Isolation
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=(), payment=()'
    response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
    response.headers['Cross-Origin-Resource-Policy'] = 'same-origin'
    
    # Mask server information
    response.headers.pop('Server', None)
    response.headers.pop('X-Powered-By', None)
    return response`,

    Django: `# ==============================================================================
# Production Security Headers for Django (settings.py)
# ==============================================================================

# Enable SecurityMiddleware in MIDDLEWARE:
# 'django.middleware.security.SecurityMiddleware',

# HTTP Strict Transport Security (HSTS)
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_SSL_REDIRECT = True

# MIME sniffing & Frame Guard
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Referrer Policy
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'

# Browser Cross-Origin Isolation (via django-csp or custom middleware)
# response['Cross-Origin-Opener-Policy'] = 'same-origin'
# response['Cross-Origin-Resource-Policy'] = 'same-origin'
# response['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()'`,

    Cloudflare: `# ==============================================================================
# Cloudflare Dashboard Configuration Guide
# ==============================================================================

1. HTTP Strict Transport Security (HSTS):
   - Go to SSL/TLS > Edge Certificates > HTTP Strict Transport Security (HSTS).
   - Set Enable HSTS: On
   - Set Max Age: 12 months (31536000 seconds)
   - Enable Apply HSTS policy to subdomains
   - Enable Preload

2. Custom Security Headers via Transform Rules:
   - Go to Rules > Transform Rules > Modify Response Header.
   - Click "Create rule" and name it "Global Security Headers".
   - When incoming requests match: All incoming requests.
   - Set dynamic/static headers:
     * Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self';
     * X-Content-Type-Options: nosniff
     * X-Frame-Options: DENY
     * Referrer-Policy: strict-origin-when-cross-origin
     * Permissions-Policy: camera=(), microphone=(), geolocation=()
     * Cross-Origin-Opener-Policy: same-origin
     * Cross-Origin-Resource-Policy: same-origin`,

    IIS: `<!-- ==============================================================================
     Production Security Headers for Microsoft IIS (web.config)
     ============================================================================== -->
<configuration>
  <system.webServer>
    <httpProtocol>
      <customHeaders>
        <add name="Content-Security-Policy" value="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; frame-ancestors 'self';" />
        <add name="Strict-Transport-Security" value="max-age=31536000; includeSubDomains; preload" />
        <add name="X-Content-Type-Options" value="nosniff" />
        <add name="X-Frame-Options" value="DENY" />
        <add name="Referrer-Policy" value="strict-origin-when-cross-origin" />
        <add name="Permissions-Policy" value="camera=(), microphone=(), geolocation=(), payment=()" />
        <add name="Cross-Origin-Opener-Policy" value="same-origin" />
        <add name="Cross-Origin-Resource-Policy" value="same-origin" />
        <remove name="X-Powered-By" />
      </customHeaders>
    </httpProtocol>
    <security>
      <requestFiltering removeServerHeader="true" />
    </security>
  </system.webServer>
</configuration>`
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onCopyNotice(`Copied ${id} configuration snippet`);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
            background: 'rgba(254, 1, 255, 0.1)',
            border: '1px solid var(--accent-magenta)',
            color: 'var(--accent-magenta)',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '16px'
          }}>
            <Layers size={14} />
            <span>Multi-Stack Configuration Generator</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
            Production <span style={{ color: 'var(--accent-magenta)' }}>Fix Guides</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Production-tested security header recipes for all primary web servers, reverse proxies, and backend application frameworks.
          </p>
        </div>

        {/* CSP Report-Only Callout Card */}
        <div style={{
          background: 'rgba(255, 176, 32, 0.05)',
          border: '1px solid var(--warn-amber)',
          boxShadow: '0 0 25px rgba(255, 176, 32, 0.12)',
          borderRadius: '10px',
          padding: '24px',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(255, 176, 32, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AlertTriangle size={20} color="var(--warn-amber)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '8px' }}>
                Safe CSP Rollout Assistant: Use <code style={{ color: 'var(--warn-amber)', background: 'rgba(255,176,32,0.1)', padding: '2px 6px', borderRadius: '4px' }}>Content-Security-Policy-Report-Only</code>
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
                Content Security Policy is the most powerful header, but an overly strict policy can accidentally break inline scripts or legitimate analytics. 
                Before deploying an enforcing CSP header in production, deploy with the <strong style={{ color: '#FFFFFF' }}>Report-Only</strong> variant and inspect your browser console or endpoint:
              </p>
              <div className="snippet-box" style={{ border: '1px solid rgba(255, 176, 32, 0.35)', color: '#FFD382', fontSize: '0.8rem' }}>
                Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self'; style-src 'self'; report-uri /api/csp-violations;
              </div>
            </div>
          </div>
        </div>

        {/* Platform Switcher Tabs */}
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '24px'
        }}>
          {platforms.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPlatform(p.id)}
              style={{
                background: selectedPlatform === p.id ? 'var(--accent-magenta)' : 'var(--bg-surface)',
                color: selectedPlatform === p.id ? '#000009' : '#FFFFFF',
                border: selectedPlatform === p.id ? 'none' : '1px solid var(--line)',
                borderRadius: '6px',
                padding: '10px 20px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 150ms ease'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Selected Config Box */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Server size={20} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>
                Complete {selectedPlatform} Security Configuration
              </h3>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(selectedPlatform, fullConfigs[selectedPlatform])}
              className="btn-primary"
              style={{ height: '38px', padding: '0 18px', fontSize: '0.85rem' }}
            >
              {copiedId === selectedPlatform ? <Check size={16} /> : <Copy size={16} />}
              <span>{copiedId === selectedPlatform ? 'Copied to Clipboard' : 'Copy Full Config'}</span>
            </button>
          </div>

          <div className="snippet-box" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#F1F5F9', fontSize: '0.875rem' }}>
              {fullConfigs[selectedPlatform]}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
