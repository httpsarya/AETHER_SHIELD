"""
Server and stack specific fix snippets for common security headers.
Supported platforms: Nginx, Apache, Express (Node.js), Flask (Python), Django (Python), Cloudflare, IIS.
"""

TEMPLATES = {
    "Content-Security-Policy": {
        "Nginx": "add_header Content-Security-Policy \"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; frame-ancestors 'self'; form-action 'self'; base-uri 'self';\" always;",
        "Apache": "Header always set Content-Security-Policy \"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; frame-ancestors 'self'; form-action 'self'; base-uri 'self';\"",
        "Express": "// Using helmet:\napp.use(helmet.contentSecurityPolicy({\n  directives: {\n    defaultSrc: [\"'self'\"],\n    scriptSrc: [\"'self'\"],\n    styleSrc: [\"'self'\"],\n    imgSrc: [\"'self'\", \"data:\"],\n    fontSrc: [\"'self'\"],\n    frameAncestors: [\"'self'\"],\n  }\n}));",
        "Flask": "@app.after_request\ndef add_csp(response):\n    response.headers['Content-Security-Policy'] = \"default-src 'self'; script-src 'self'; style-src 'self'; frame-ancestors 'self';\"\n    return response",
        "Django": "# In settings.py using django-csp:\nCSP_DEFAULT_SRC = (\"'self'\",)\nCSP_SCRIPT_SRC = (\"'self'\",)\nCSP_STYLE_SRC = (\"'self'\",)\nCSP_FRAME_ANCESTORS = (\"'self'\",)",
        "Cloudflare": "# In Rules > Transform Rules > Modify Response Header:\nSet dynamic: Content-Security-Policy\nValue: \"default-src 'self'; script-src 'self'; style-src 'self'; frame-ancestors 'self';\"",
        "IIS": "<system.webServer>\n  <httpProtocol>\n    <customHeaders>\n      <add name=\"Content-Security-Policy\" value=\"default-src 'self'; script-src 'self'; style-src 'self';\" />\n    </customHeaders>\n  </httpProtocol>\n</system.webServer>"
    },
    "Strict-Transport-Security": {
        "Nginx": "add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains; preload\" always;",
        "Apache": "Header always set Strict-Transport-Security \"max-age=31536000; includeSubDomains; preload\"",
        "Express": "// Using helmet:\napp.use(helmet.hsts({\n  maxAge: 31536000,\n  includeSubDomains: true,\n  preload: true\n}));",
        "Flask": "@app.after_request\ndef add_hsts(response):\n    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'\n    return response",
        "Django": "# In settings.py:\nSECURE_HSTS_SECONDS = 31536000\nSECURE_HSTS_INCLUDE_SUBDOMAINS = True\nSECURE_HSTS_PRELOAD = True",
        "Cloudflare": "# SSL/TLS > Edge Certificates > HTTP Strict Transport Security (HSTS):\nEnable HSTS, Max Age: 12 months, Include Subdomains: Yes, Preload: Yes",
        "IIS": "<system.webServer>\n  <httpProtocol>\n    <customHeaders>\n      <add name=\"Strict-Transport-Security\" value=\"max-age=31536000; includeSubDomains; preload\" />\n    </customHeaders>\n  </httpProtocol>\n</system.webServer>"
    },
    "X-Content-Type-Options": {
        "Nginx": "add_header X-Content-Type-Options \"nosniff\" always;",
        "Apache": "Header always set X-Content-Type-Options \"nosniff\"",
        "Express": "app.use(helmet.noSniff());",
        "Flask": "@app.after_request\ndef add_nosniff(response):\n    response.headers['X-Content-Type-Options'] = 'nosniff'\n    return response",
        "Django": "# In settings.py:\nSECURE_CONTENT_TYPE_NOSNIFF = True",
        "Cloudflare": "Set response header X-Content-Type-Options to 'nosniff' in Transform Rules.",
        "IIS": "<add name=\"X-Content-Type-Options\" value=\"nosniff\" />"
    },
    "X-Frame-Options": {
        "Nginx": "add_header X-Frame-Options \"DENY\" always;\n# Or for same-origin: add_header X-Frame-Options \"SAMEORIGIN\" always;",
        "Apache": "Header always set X-Frame-Options \"DENY\"",
        "Express": "app.use(helmet.frameguard({ action: 'deny' }));",
        "Flask": "@app.after_request\ndef add_xfo(response):\n    response.headers['X-Frame-Options'] = 'DENY'\n    return response",
        "Django": "# In settings.py:\nX_FRAME_OPTIONS = 'DENY'",
        "Cloudflare": "Set response header X-Frame-Options to 'DENY' in Transform Rules.",
        "IIS": "<add name=\"X-Frame-Options\" value=\"DENY\" />"
    },
    "Referrer-Policy": {
        "Nginx": "add_header Referrer-Policy \"strict-origin-when-cross-origin\" always;",
        "Apache": "Header always set Referrer-Policy \"strict-origin-when-cross-origin\"",
        "Express": "app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));",
        "Flask": "@app.after_request\ndef add_rp(response):\n    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'\n    return response",
        "Django": "# In settings.py:\nSECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'",
        "Cloudflare": "Set response header Referrer-Policy to 'strict-origin-when-cross-origin'.",
        "IIS": "<add name=\"Referrer-Policy\" value=\"strict-origin-when-cross-origin\" />"
    },
    "Permissions-Policy": {
        "Nginx": "add_header Permissions-Policy \"camera=(), microphone=(), geolocation=(), payment=()\" always;",
        "Apache": "Header always set Permissions-Policy \"camera=(), microphone=(), geolocation=(), payment=()\"",
        "Express": "app.use((req, res, next) => {\n  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');\n  next();\n});",
        "Flask": "@app.after_request\ndef add_perm(response):\n    response.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=(), payment=()'\n    return response",
        "Django": "# In custom middleware:\nresponse['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=(), payment=()'",
        "Cloudflare": "Set response header Permissions-Policy to 'camera=(), microphone=(), geolocation=()'.",
        "IIS": "<add name=\"Permissions-Policy\" value=\"camera=(), microphone=(), geolocation=()\" />"
    },
    "Cross-Origin-Opener-Policy": {
        "Nginx": "add_header Cross-Origin-Opener-Policy \"same-origin\" always;",
        "Apache": "Header always set Cross-Origin-Opener-Policy \"same-origin\"",
        "Express": "app.use(helmet.crossOriginOpenerPolicy({ policy: \"same-origin\" }));",
        "Flask": "@app.after_request\ndef add_coop(response):\n    response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'\n    return response",
        "Django": "# In settings / middleware:\nresponse['Cross-Origin-Opener-Policy'] = 'same-origin'",
        "Cloudflare": "Set response header Cross-Origin-Opener-Policy to 'same-origin'.",
        "IIS": "<add name=\"Cross-Origin-Opener-Policy\" value=\"same-origin\" />"
    },
    "Cross-Origin-Resource-Policy": {
        "Nginx": "add_header Cross-Origin-Resource-Policy \"same-origin\" always;",
        "Apache": "Header always set Cross-Origin-Resource-Policy \"same-origin\"",
        "Express": "app.use(helmet.crossOriginResourcePolicy({ policy: \"same-origin\" }));",
        "Flask": "@app.after_request\ndef add_corp(response):\n    response.headers['Cross-Origin-Resource-Policy'] = 'same-origin'\n    return response",
        "Django": "# In settings / middleware:\nresponse['Cross-Origin-Resource-Policy'] = 'same-origin'",
        "Cloudflare": "Set response header Cross-Origin-Resource-Policy to 'same-origin'.",
        "IIS": "<add name=\"Cross-Origin-Resource-Policy\" value=\"same-origin\" />"
    },
    "Cross-Origin-Embedder-Policy": {
        "Nginx": "add_header Cross-Origin-Embedder-Policy \"require-corp\" always;",
        "Apache": "Header always set Cross-Origin-Embedder-Policy \"require-corp\"",
        "Express": "app.use(helmet.crossOriginEmbedderPolicy());",
        "Flask": "@app.after_request\ndef add_coep(response):\n    response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'\n    return response",
        "Django": "# In settings / middleware:\nresponse['Cross-Origin-Embedder-Policy'] = 'require-corp'",
        "Cloudflare": "Set response header Cross-Origin-Embedder-Policy to 'require-corp'.",
        "IIS": "<add name=\"Cross-Origin-Embedder-Policy\" value=\"require-corp\" />"
    },
    "Information-Disclosure": {
        "Nginx": "# In nginx.conf http or server block:\nserver_tokens off;\n# To remove headers completely (with headers-more module):\n# more_clear_headers 'Server' 'X-Powered-By';",
        "Apache": "# In httpd.conf:\nServerTokens Prod\nServerSignature Off\n# If mod_headers enabled:\nHeader unset X-Powered-By",
        "Express": "app.disable('x-powered-by');\n// Helmet disables x-powered-by automatically",
        "Flask": "# Waitress / Gunicorn config: set server header to empty or generic\n# E.g. in Gunicorn: --server-tokens=off",
        "Django": "# Ensure web server (Gunicorn/Nginx) strips server banner and headers",
        "Cloudflare": "# Managed transforms or Workers can strip Server and X-Powered-By headers.",
        "IIS": "<system.webServer>\n  <security>\n    <requestFiltering removeServerHeader=\"true\" />\n  </security>\n  <httpProtocol>\n    <customHeaders>\n      <remove name=\"X-Powered-By\" />\n    </customHeaders>\n  </httpProtocol>\n</system.webServer>"
    }
}

def get_fix_snippets(header_name: str) -> dict:
    return TEMPLATES.get(header_name, {
        "Nginx": f"# Add {header_name} in nginx.conf\nadd_header {header_name} \"value\" always;",
        "Apache": f"# Add {header_name} in httpd.conf or .htaccess\nHeader always set {header_name} \"value\"",
        "Express": f"// In Express:\napp.use((req, res, next) => {{\n  res.setHeader('{header_name}', 'value');\n  next();\n}});",
        "Flask": f"@app.after_request\ndef add_header(response):\n    response.headers['{header_name}'] = 'value'\n    return response",
        "Django": f"# Add in middleware:\nresponse['{header_name}'] = 'value'",
        "Cloudflare": f"# In Transform Rules: set {header_name} = value",
        "IIS": f"<add name=\"{header_name}\" value=\"value\" />"
    })
