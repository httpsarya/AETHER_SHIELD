import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ScanResultsView } from './components/ScanResultsView';
import { HomeLandingSections } from './components/HomeLandingSections';
import { LearnView } from './components/LearnView';
import { FixGuideView } from './components/FixGuideView';
import { CompareView } from './components/CompareView';
import { BulkScanView } from './components/BulkScanView';
import { ScanHistoryView } from './components/ScanHistoryView';
import { ApiDocsView } from './components/ApiDocsView';
import { CspConstructorView } from './components/CspConstructorView';
import { DiffEngineView } from './components/DiffEngineView';
import { Footer } from './components/Footer';
import { scanUrl, getScanById, fetchHeadersInfo, generateSarifReport, downloadFile } from './services/api';
import { ScanResponse, HeaderInfo } from './types';
import { Shield, AlertTriangle, CheckCircle, X, Sparkles, RefreshCw, Radar } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('scanner');
  const [activeScan, setActiveScan] = useState<ScanResponse | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgressStep, setScanProgressStep] = useState<string>('');
  const [scanError, setScanError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [headersInfo, setHeadersInfo] = useState<HeaderInfo[]>([]);
  const [history, setHistory] = useState<ScanResponse[]>(() => {
    try {
      const saved = localStorage.getItem('header_analyzer_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load knowledge base info & handle share link scan_id query param
  useEffect(() => {
    fetchHeadersInfo().then((data) => {
      if (data && data.length > 0) setHeadersInfo(data);
    });

    const params = new URLSearchParams(window.location.search);
    const scanId = params.get('scan_id');
    if (scanId) {
      setIsScanning(true);
      setScanProgressStep('Loading shared audit result...');
      getScanById(scanId)
        .then((scan) => {
          setActiveScan(scan);
          setCurrentTab('scanner');
        })
        .catch(() => {
          setScanError('Shared scan link is expired or invalid.');
        })
        .finally(() => setIsScanning(false));
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleRunScan = async (targetUrl: string, followRedirects: boolean = true) => {
    setIsScanning(true);
    setScanError(null);
    setScanProgressStep('Validating DNS & checking SSRF IP protections...');

    const stepTimer1 = setTimeout(() => {
      setScanProgressStep('Connecting to target & capturing HTTP response headers...');
    }, 600);

    const stepTimer2 = setTimeout(() => {
      setScanProgressStep('Evaluating CSP, HSTS, frame-ancestors, & scoring rubric...');
    }, 1200);

    try {
      const result = await scanUrl(targetUrl, followRedirects);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      setActiveScan(result);
      setCurrentTab('scanner');

      // Update local storage history
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.url !== result.url);
        const updated = [result, ...filtered].slice(0, 30);
        try {
          localStorage.setItem('header_analyzer_history', JSON.stringify(updated));
        } catch (e) {
          console.warn('Could not save to localStorage', e);
        }
        return updated;
      });

      showToast(`Audit completed! Grade: ${result.grade} (${result.score}/100)`);
    } catch (err: any) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setScanError(err.message || 'Target scan failed. Verify the URL is reachable.');
    } finally {
      setIsScanning(false);
      setScanProgressStep('');
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem('header_analyzer_history');
    setHistory([]);
    showToast('Scan history cleared');
  };

  const handleGlobalSarifExport = () => {
    if (activeScan) {
      const sarif = generateSarifReport(activeScan);
      downloadFile(`audit-${activeScan.id}.sarif`, sarif);
      showToast('SARIF 2.1 report generated for active audit');
    } else {
      // Export sample
      scanUrl('https://api.sentinel-defense.cloud/v2/telemetry').then((sample) => {
        const sarif = generateSarifReport(sample);
        downloadFile(`sample-audit.sarif`, sarif);
        showToast('Sample SARIF 2.1 report generated');
      });
    }
  };

  const handleGlobalJsonExport = () => {
    if (activeScan) {
      downloadFile(`audit-${activeScan.id}.json`, JSON.stringify(activeScan, null, 2));
      showToast('JSON report generated for active audit');
    } else {
      scanUrl('https://api.sentinel-defense.cloud/v2/telemetry').then((sample) => {
        downloadFile(`sample-audit.json`, JSON.stringify(sample, null, 2));
        showToast('Sample JSON report generated');
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice">
          <CheckCircle size={18} color="var(--secondary-emerald)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '6px' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onQuickScanClick={() => {
          setCurrentTab('scanner');
          setActiveScan(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExportSarifClick={handleGlobalSarifExport}
      />

      {/* Scanning Progress Overlay Modal with Stitch Radar Effect */}
      {isScanning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 15, 29, 0.88)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '440px', width: '90%', padding: '36px 28px', textAlign: 'center', border: '1px solid var(--border-cyan)', boxShadow: '0 0 35px rgba(0, 240, 255, 0.25)' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              margin: '0 auto 20px',
              border: '2px solid rgba(0, 240, 255, 0.3)',
              borderTopColor: 'var(--primary-cyan)',
              animation: 'spin 0.9s linear infinite',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Radar size={32} color="var(--primary-cyan)" className="animate-pulse" />
            </div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '10px', fontFamily: 'var(--font-tactical)' }}>
              SECURITY AUDIT IN PROGRESS
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', fontFamily: 'var(--font-tactical)' }}>
              {scanProgressStep || 'Inspecting HTTP response headers...'}
            </p>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '14px', fontFamily: 'var(--font-tactical)' }}>
              Verifying SSRF single-resolution DNS pinning & redirect hops
            </div>
          </div>
        </div>
      )}

      {/* Scan Error Alert Modal */}
      {scanError && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 15, 29, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '480px', width: '90%', padding: '32px', textAlign: 'center', border: '1px solid var(--danger-rose)', boxShadow: 'var(--glow-red)' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid var(--danger-rose)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <AlertTriangle size={28} color="var(--danger-rose)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '12px', fontFamily: 'var(--font-tactical)' }}>
              Audit Interrupted
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
              {scanError}
            </p>
            <button
              type="button"
              onClick={() => setScanError(null)}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              Dismiss & Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Body Router */}
      <main style={{ flex: 1 }}>
        {currentTab === 'scanner' && (
          <>
            {activeScan ? (
              <ScanResultsView
                scan={activeScan}
                onRescan={(url) => handleRunScan(url)}
                onBackToHome={() => setActiveScan(null)}
                onCopyNotice={showToast}
              />
            ) : (
              <>
                <Hero 
                  onScan={handleRunScan} 
                  isLoading={isScanning}
                  onQuickExportSarif={handleGlobalSarifExport}
                  onQuickExportJson={handleGlobalJsonExport}
                />
                <HomeLandingSections
                  onScanClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  onExploreLearn={() => setCurrentTab('learn')}
                  onExploreFixes={() => setCurrentTab('fixes')}
                />
              </>
            )}
          </>
        )}

        {currentTab === 'csp' && (
          <CspConstructorView />
        )}

        {currentTab === 'diff' && (
          <DiffEngineView activeScan={activeScan} />
        )}

        {currentTab === 'learn' && (
          <LearnView
            headers={headersInfo}
            onScanTarget={(sample) => {
              setCurrentTab('scanner');
              handleRunScan(sample);
            }}
          />
        )}

        {currentTab === 'fixes' && (
          <FixGuideView onCopyNotice={showToast} />
        )}

        {currentTab === 'compare' && (
          <CompareView onCopyNotice={showToast} />
        )}

        {currentTab === 'bulk' && (
          <BulkScanView
            onCopyNotice={showToast}
            onSelectScanId={async (id) => {
              try {
                const s = await getScanById(id);
                setActiveScan(s);
                setCurrentTab('scanner');
              } catch {
                showToast('Could not load scan details');
              }
            }}
          />
        )}

        {currentTab === 'history' && (
          <ScanHistoryView
            history={history}
            onSelectScan={(s) => {
              setActiveScan(s);
              setCurrentTab('scanner');
            }}
            onRescan={(url) => handleRunScan(url)}
            onClearHistory={handleClearHistory}
            onCompareTwo={() => {
              setCurrentTab('compare');
            }}
          />
        )}

        {currentTab === 'api' && (
          <ApiDocsView onCopyNotice={showToast} />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={(tab) => {
        setCurrentTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
    </div>
  );
};
