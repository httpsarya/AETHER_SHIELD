export interface HeaderFinding {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  score: number;
  max_score: number;
  value: string | null;
  message: string;
  recommendation: string;
  why_it_matters: string;
  fixes: Record<string, string>;
}

export interface ScanSummary {
  passed: number;
  warnings: number;
  failed: number;
  total_rules: number;
}

export interface RedirectHop {
  hop: number;
  url: string;
  status_code: number;
  reason: string;
  ip: string;
}

export interface TlsSummary {
  protocol: string;
  cipher: string;
  issuer: string;
  expiry: string;
}

export interface ScanResponse {
  id: string;
  url: string;
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  rubric_version: string;
  summary: ScanSummary;
  findings: HeaderFinding[];
  raw_headers: Record<string, string>;
  redirect_chain: RedirectHop[];
  tls_summary: TlsSummary;
  scanned_at: string;
}

export interface CompareComparison {
  header: string;
  target_a: {
    status: string;
    score: number;
    value: string | null;
  };
  target_b: {
    status: string;
    score: number;
    value: string | null;
  };
  comparison: 'improved' | 'regressed' | 'unchanged';
}

export interface CompareResponse {
  target_a: ScanResponse;
  target_b: ScanResponse;
  score_delta: number;
  comparisons: CompareComparison[];
}

export interface BulkItemResult {
  url: string;
  status: 'success' | 'failed';
  score: number;
  grade: string;
  scan_id?: string;
  error?: string;
}

export interface BulkScanResponse {
  total: number;
  results: BulkItemResult[];
}

export interface HeaderInfo {
  name: string;
  category: string;
  max_points: number;
  description: string;
  attacks_prevented: string[];
  recommended_value: string;
  mdn_url: string;
}
