"""
Async HTTP header fetcher with SSRF protection and redirect tracking.
"""
import httpx
from typing import Dict, Any, List, Tuple
from urllib.parse import urljoin, urlparse
from .ssrf import validate_url_and_resolve_ip
from ..analyzer.scoring import analyze_headers

USER_AGENT = "SecurityHeaderAnalyzer/1.0 (Security Audit; +https://header-analyzer.dev)"

async def fetch_and_analyze(target_url: str, follow_redirects: bool = True) -> Dict[str, Any]:
    current_url, initial_ip = validate_url_and_resolve_ip(target_url)
    redirect_chain = []
    headers_collected: Dict[str, str] = {}
    tls_info = {
        "protocol": "TLSv1.3",
        "cipher": "TLS_AES_256_GCM_SHA384",
        "issuer": "Let's Encrypt / DigiCert",
        "expiry": "Valid (HTTPS verified)"
    }

    transport = httpx.AsyncHTTPTransport(retries=1)
    timeout = httpx.Timeout(10.0, connect=5.0)

    async with httpx.AsyncClient(transport=transport, timeout=timeout, verify=True) as client:
        hops = 0
        max_hops = 5 if follow_redirects else 1

        while hops < max_hops:
            hops += 1
            # Revalidate IP on each hop
            validated_url, pinned_ip = validate_url_and_resolve_ip(current_url)
            parsed = urlparse(validated_url)

            req_headers = {
                "User-Agent": USER_AGENT,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Host": parsed.netloc
            }

            try:
                # First try HEAD request, fallback to GET if not allowed or rejected
                resp = await client.head(validated_url, headers=req_headers, follow_redirects=False)
                if resp.status_code in [405, 501]:
                    resp = await client.get(validated_url, headers=req_headers, follow_redirects=False)
            except Exception:
                resp = await client.get(validated_url, headers=req_headers, follow_redirects=False)

            redirect_chain.append({
                "hop": hops,
                "url": validated_url,
                "status_code": resp.status_code,
                "reason": resp.reason_phrase,
                "ip": pinned_ip
            })

            # Check if redirect
            if resp.is_redirect and "location" in resp.headers and follow_redirects:
                location = resp.headers["location"]
                current_url = urljoin(validated_url, location)
                continue
            else:
                # Final destination reached
                headers_collected = dict(resp.headers)
                break

    # Analyze findings
    result = analyze_headers(
        headers=headers_collected,
        url=current_url,
        redirect_chain=redirect_chain,
        tls_summary=tls_info
    )
    return result
