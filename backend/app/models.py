from pydantic import BaseModel, Field, HttpUrl
from typing import List, Dict, Optional, Any

class ScanRequest(BaseModel):
    url: str = Field(..., description="Target website URL to scan (e.g., https://example.com)")
    follow_redirects: bool = Field(True, description="Whether to follow HTTP redirects up to 5 hops")

class HeaderFinding(BaseModel):
    name: str
    status: str
    severity: str
    score: int
    max_score: int
    value: Optional[str] = None
    message: str
    recommendation: str
    why_it_matters: str
    fixes: Dict[str, str]

class ScanSummary(BaseModel):
    passed: int
    warnings: int
    failed: int
    total_rules: int

class ScanResponse(BaseModel):
    id: str
    url: str
    score: int
    grade: str
    rubric_version: str
    summary: ScanSummary
    findings: List[HeaderFinding]
    raw_headers: Dict[str, str]
    redirect_chain: List[Dict[str, Any]]
    tls_summary: Dict[str, Any]
    scanned_at: str

class CompareRequest(BaseModel):
    url_a: str
    url_b: str

class BulkScanRequest(BaseModel):
    urls: List[str] = Field(..., max_length=25, description="Up to 25 URLs to scan")
