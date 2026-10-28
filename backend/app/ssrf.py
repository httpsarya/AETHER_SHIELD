"""
SSRF Protection module according to Tech Stack Document Section 11 & Page 12.
Ensures no private, link-local, loopback, or cloud metadata IP addresses are contacted.
"""
import ipaddress
import socket
from urllib.parse import urlparse

ALLOWED_PORTS = {80, 443, 8080, 8443}

def validate_url_and_resolve_ip(target_url: str) -> tuple[str, str]:
    """
    Validates URL scheme, port, resolves DNS once, and enforces that all resolved
    IPs are public global addresses.
    Returns (normalized_url, resolved_ip).
    """
    if not target_url.startswith(("http://", "https://")):
        target_url = "https://" + target_url

    parsed = urlparse(target_url)
    if not parsed.hostname:
        raise ValueError("Invalid URL: hostname could not be determined.")

    port = parsed.port or (443 if parsed.scheme == "https" else 80)
    if port not in ALLOWED_PORTS:
        raise ValueError(f"Port {port} is not allowed. Only ports {sorted(ALLOWED_PORTS)} are supported.")

    hostname = parsed.hostname.strip()

    # Block common cloud metadata and loopback hostnames
    lowered_host = hostname.lower()
    if lowered_host in ["localhost", "127.0.0.1", "::1", "metadata.google.internal", "instance-data"]:
        raise ValueError("Target address not allowed (private or internal hostname).")

    # Resolve IP address
    try:
        infos = socket.getaddrinfo(hostname, port, type=socket.SOCK_STREAM)
    except socket.gaierror as e:
        raise ValueError(f"Could not resolve host '{hostname}': {str(e)}")

    ips = set()
    for item in infos:
        ip_str = item[4][0]
        try:
            ip_obj = ipaddress.ip_address(ip_str)
            ips.add(ip_obj)
        except ValueError:
            continue

    if not ips:
        raise ValueError(f"No valid IP address found for host '{hostname}'.")

    # Strict check: reject if ANY resolved IP is not globally routable
    for ip in ips:
        if not ip.is_global:
            raise ValueError(f"Target address is in a private, loopback, or reserved IP range ({ip}). SSRF blocked.")

    resolved_ip = str(sorted(ips, key=str)[0])
    return target_url, resolved_ip
