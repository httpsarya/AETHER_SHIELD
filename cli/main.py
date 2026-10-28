#!/usr/bin/env python3
"""
Command-line interface for HTTP Security Header Analyzer.
Evaluates security headers for a target URL and returns human-readable audit or SARIF/JSON.
"""
import argparse
import asyncio
import json
import sys
from backend.app.scanner import fetch_and_analyze

def generate_sarif(result: dict) -> dict:
    """Generates SARIF v2.1.0 output for CI/CD integration and GitHub Code Scanning."""
    rules = []
    results = []

    for idx, f in enumerate(result.get("findings", [])):
        rule_id = f"SEC-HDR-{f['name'].upper().replace('-', '_')}"
        rules.append({
            "id": rule_id,
            "name": f["name"],
            "shortDescription": {"text": f["message"]},
            "helpUri": f.get("recommendation", "")
        })

        if f["status"] != "pass":
            level = "error" if f["severity"] == "critical" else "warning"
            results.append({
                "ruleId": rule_id,
                "ruleIndex": idx,
                "level": level,
                "message": {"text": f"{f['name']}: {f['message']}. Recommendation: {f['recommendation']}"},
                "locations": [{
                    "physicalLocation": {
                        "artifactLocation": {"uri": result.get("url", "")}
                    }
                }]
            })

    return {
        "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
        "version": "2.1.0",
        "runs": [{
            "tool": {
                "driver": {
                    "name": "HTTP Security Header Analyzer",
                    "version": "1.0.0",
                    "rules": rules
                }
            },
            "results": results
        }]
    }

async def run_cli():
    parser = argparse.ArgumentParser(description="HTTP Security Header Analyzer CLI")
    parser.add_argument("url", help="Target URL to scan (e.g., https://example.com)")
    parser.add_argument("--json", action="store_true", help="Output raw JSON scan results")
    parser.add_argument("--sarif", action="store_true", help="Output SARIF format for CI/CD and GitHub Actions")
    parser.add_argument("--fail-under", type=int, default=70, help="Minimum score required to pass (default: 70)")
    parser.add_argument("--no-redirects", action="store_true", help="Disable following redirects")

    args = parser.parse_args()

    try:
        res = await fetch_and_analyze(args.url, follow_redirects=not args.no_redirects)
    except Exception as e:
        print(f"[ERROR] Scan failed: {e}", file=sys.stderr)
        sys.exit(2)

    if args.sarif:
        print(json.dumps(generate_sarif(res), indent=2))
    elif args.json:
        print(json.dumps(res, indent=2))
    else:
        print("\n=======================================================")
        print(f" AETHER_SHIELD HTTP Security Header Analyzer - by Arya Tiwari")
        print("=======================================================")
        print(f" Target: {res['url']}")
        print(f" Grade:  [{res['grade']}] (Score: {res['score']}/100)")
        print(f" Summary: {res['summary']['passed']} Passed, {res['summary']['warnings']} Warnings, {res['summary']['failed']} Failed")
        print("-------------------------------------------------------")
        for f in res["findings"]:
            tag = "[PASS]" if f["status"] == "pass" else ("[WARN]" if f["status"] == "warn" else "[FAIL]")
            print(f" {tag:<6} {f['name']:<30} {f['score']}/{f['max_score']} pts")
            if f["status"] != "pass":
                print(f"        -> {f['message']}")
        print("=======================================================\n")

    if res["score"] < args.fail_under:
        sys.exit(1)

def main():
    asyncio.run(run_cli())

if __name__ == "__main__":
    main()
