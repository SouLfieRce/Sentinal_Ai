import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useThreatAnalysis } from '../hooks/useThreatAnalysis';
import AnalysisLoader from '../components/AnalysisLoader';
import ThreatMeter from '../components/ThreatMeter';
import ThreatDNA from '../components/ThreatDNA';

const TABS = ['EMAIL', 'URL', 'MESSAGE', 'CODE'];
const PLACEHOLDERS = {
  EMAIL: 'Paste a suspicious email here...\n\nFrom: sender@example.com\nSubject: Your account needs attention\n...',
  URL: 'Paste a suspicious URL here:\n\nhttps://...',
  MESSAGE: 'Paste a suspicious message or SMS here...',
  CODE: 'Paste suspicious code or script here...',
};

const SAMPLES = [
  ['🎣 Phishing Email', "Dear Customer,\n\nYour PayPal account has been LIMITED due to suspicious activity. Verify your identity within 24 hours or your account will be permanently closed.\n\nClick here: http://paypa1-secure.net/verify\n\nPayPal Security Team"],
  ['🦠 Malware URL', 'http://free-software-download.xyz/crack-windows11-activator.exe?ref=torrent'],
  ['🧠 Social Eng', 'Hi, this is Mike from IT Support. We detected unusual login to your account. Can you share your employee ID and temporary password so we can secure it? This is urgent - your access will be revoked in 30 mins.'],
  ['✅ Safe URL', 'https://www.google.com/search?q=cybersecurity+best+practices'],
];

const CLASSIFICATION_MAP = {
  Phishing: { cls: 'verdict-phishing', icon: '🎣' },
  Malware: { cls: 'verdict-malware', icon: '🦠' },
  'Social Engineering': { cls: 'verdict-social', icon: '🧠' },
  Safe: { cls: 'verdict-safe', icon: '✅' },
};

const SEVERITY_SCORES = { Low: 25, Medium: 55, High: 85 };

export default function Analyzer() {
  const [tab, setTab] = useState('EMAIL');
  const [content, setContent] = useState('');
  const [deepScan, setDeepScan] = useState(false);
  const { loading, result, error, loadingStage, loadingStages, analyze, reset } = useThreatAnalysis();

  const handleAnalyze = () => {
    if (!content.trim()) {
      toast.error('Enter content to analyze');
      return;
    }
    analyze(content, tab, deepScan);
  };

  const handleCopyReport = () => {
    if (!result) return;
    navigator.clipboard?.writeText(JSON.stringify(result, null, 2));
    toast.success('Report copied to clipboard');
  };

  const vmap = CLASSIFICATION_MAP[result?.classification] || CLASSIFICATION_MAP.Safe;

  return (
    <div>
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && <AnalysisLoader stage={loadingStage} stages={loadingStages} />}
      </AnimatePresence>

      {/* Title + Deep Scan */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="page-title">⚡ Threat Analyzer</div>
          <div className="page-subtitle">AI-powered threat classification engine</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#718096', fontFamily: "'Space Mono', monospace" }}>DEEP SCAN</span>
          <div
            onClick={() => setDeepScan(d => !d)}
            style={{
              width: 36, height: 20,
              background: deepScan ? 'rgba(0,255,234,0.3)' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${deepScan ? 'rgba(0,255,234,0.5)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 99, cursor: 'pointer', position: 'relative', transition: 'all 0.3s',
            }}
          >
            <div style={{
              position: 'absolute', top: 2, left: deepScan ? 18 : 2,
              width: 14, height: 14,
              background: deepScan ? '#00FFEA' : '#475569',
              borderRadius: '50%', transition: 'all 0.3s',
            }} />
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Input Panel */}
        <div className="card card-glow" style={{ position: 'relative' }}>
          <div className="sec-label">INPUT TYPE</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {TABS.map(t => (
              <button key={t} className={`tab-btn ${tab === t ? 'tab-active' : 'tab-inactive'}`} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
          <textarea
            className="threat-input"
            rows={14}
            placeholder={PLACEHOLDERS[tab]}
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <button className="btn-primary" style={{ flex: 1, padding: 13 }} onClick={handleAnalyze} disabled={loading}>
              ANALYZE THREAT ⚡
            </button>
            <button className="btn-ghost" style={{ padding: '13px 16px' }} onClick={() => { setContent(''); reset(); }}>CLEAR</button>
          </div>
          {/* Sample Inputs */}
          <div style={{ marginTop: 12 }}>
            <div className="sec-label">SAMPLE INPUTS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SAMPLES.map(([label, sample]) => (
                <button key={label} className="btn-ghost" style={{ fontSize: 10, padding: '5px 10px', fontFamily: "'Space Mono', monospace" }}
                  onClick={() => { setContent(sample); setTab('EMAIL'); }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div>
          {!result && !loading && (
            <div className="card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, minHeight: 400 }}>
              <div style={{ fontSize: 48, opacity: 0.15 }}>🛡️</div>
              <div style={{ fontSize: 13, color: '#4A5568', fontFamily: "'Space Mono', monospace", textAlign: 'center', lineHeight: 1.8 }}>
                SENTINEL AWAITING INPUT<br/>
                <span style={{ fontSize: 10 }}>Paste content on the left to begin analysis</span>
              </div>
            </div>
          )}

          {error && (
            <div className="card" style={{ borderColor: 'rgba(255,32,82,0.3)' }}>
              <div style={{ fontSize: 13, color: '#FF2052', fontFamily: "'Space Mono', monospace" }}>⚠️ {error}</div>
              <button className="btn-ghost" style={{ marginTop: 12, fontSize: 11 }} onClick={reset}>Try Again</button>
            </div>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Card 1: Verdict */}
              <motion.div className="card card-glow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span className={`verdict ${vmap.cls}`}>{vmap.icon} {result.classification}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: '#4A5568', fontFamily: "'Space Mono', monospace" }}>THREAT ID</div>
                    <div style={{ fontSize: 12, color: '#00FFEA', fontFamily: "'Space Mono', monospace" }}>{result.threat_id || `SENT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <ThreatMeter score={SEVERITY_SCORES[result.severity] || 25} severity={result.severity} size={100} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, lineHeight: 1.5 }}>{result.headline}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 10, color: '#718096', fontFamily: "'Space Mono', monospace" }}>CONFIDENCE:</span>
                      <span style={{ fontSize: 11, color: '#00FFEA', fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>{result.confidence}%</span>
                      <span style={{ fontSize: 10, color: '#718096', fontFamily: "'Space Mono', monospace" }}>VECTOR:</span>
                      <span style={{ fontSize: 10, color: '#FFB700', fontFamily: "'Space Mono', monospace" }}>{result.attack_vector}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Intelligence Report */}
              <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="sec-label" style={{ marginBottom: 12 }}>AI INTELLIGENCE REPORT</div>
                <div style={{ fontSize: 13, lineHeight: 1.75, color: '#CBD5E1', marginBottom: 12 }}>
                  <div style={{ marginBottom: 8 }}><span style={{ fontSize: 11, color: '#00FFEA' }}>🔍 DETECTED: </span>{result.explanation}</div>
                  <div style={{ marginBottom: 8 }}><span style={{ fontSize: 11, color: '#FF2052' }}>⚠ DANGEROUS: </span>{result.why_dangerous}</div>
                  <div><span style={{ fontSize: 11, color: '#00FFA3' }}>🛡 ACTION: </span>{result.recommended_action}</div>
                </div>
                <div>
                  <div className="sec-label" style={{ marginBottom: 8 }}>THREAT INDICATORS ({result.indicators?.length || 0})</div>
                  {(result.indicators || []).map((ind, i) => (
                    <span key={i} className="ind-chip ind-red">{ind}</span>
                  ))}
                </div>
                {result.educational_tip && (
                  <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(0,255,234,0.05)', borderRadius: 8, borderLeft: '2px solid #00FFEA', fontSize: 12, color: '#718096', lineHeight: 1.6 }}>
                    💡 <strong style={{ color: '#00FFEA' }}>TIP:</strong> {result.educational_tip}
                  </div>
                )}
              </motion.div>

              {/* Card 3: Threat DNA */}
              {result.dna && (
                <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="sec-label" style={{ marginBottom: 12 }}>THREAT DNA BREAKDOWN</div>
                  <ThreatDNA dna={result.dna} />
                </motion.div>
              )}

              {/* Card 4: Quick Actions */}
              <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="sec-label" style={{ marginBottom: 12 }}>QUICK ACTIONS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <button className="btn-ghost" style={{ padding: '8px 14px', fontSize: 11, fontFamily: "'Space Mono', monospace" }} onClick={handleCopyReport}>📋 Copy Report</button>
                  <button className="btn-ghost" style={{ padding: '8px 14px', fontSize: 11, fontFamily: "'Space Mono', monospace" }} onClick={() => toast.success('Marked as safe')}>✅ Mark Safe</button>
                  <button className="btn-ghost" style={{ padding: '8px 14px', fontSize: 11, fontFamily: "'Space Mono', monospace" }} onClick={() => toast.success('Reported')}>🚩 False Positive</button>
                  <button className="btn-ghost" style={{ padding: '8px 14px', fontSize: 11, fontFamily: "'Space Mono', monospace" }} onClick={() => toast.success('Added to watchlist')}>📌 Watchlist</button>
                </div>
              </motion.div>

              {/* New Analysis */}
              <button className="btn-primary" style={{ padding: '12px 32px', alignSelf: 'center' }} onClick={() => { reset(); setContent(''); }}>
                NEW ANALYSIS ⚡
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
