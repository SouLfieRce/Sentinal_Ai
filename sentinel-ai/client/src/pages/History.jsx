import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSentinel } from '../context/SentinelContext';
import ThreatMeter from '../components/ThreatMeter';
import ThreatDNA from '../components/ThreatDNA';
import toast from 'react-hot-toast';

const SEVERITY_SCORES = { Low: 25, Medium: 55, High: 85 };
const CLASSIFICATION_MAP = {
  Phishing: { cls: 'verdict-phishing', icon: '🎣' },
  Malware: { cls: 'verdict-malware', icon: '🦠' },
  'Social Engineering': { cls: 'verdict-social', icon: '🧠' },
  Safe: { cls: 'verdict-safe', icon: '✅' },
};

const FILTER_TABS = ['All', 'Phishing', 'Malware', 'Social Engineering', 'Safe'];

export default function History() {
  const { scanHistory, clearHistory } = useSentinel();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [drawerItem, setDrawerItem] = useState(null);

  const filtered = scanHistory.filter(scan => {
    const matchType = filter === 'All' || scan.analysis?.classification === filter;
    const matchSearch = !search || scan.content?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div>
      {/* Title + Clear */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="page-title">📋 Threat History</div>
          <div className="page-subtitle">{scanHistory.length} scans this session</div>
        </div>
        {scanHistory.length > 0 && (
          <button className="btn-danger" onClick={() => { clearHistory(); toast.success('History cleared'); }}>
            🗑 Clear History
          </button>
        )}
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <input
          style={{
            flex: 1,
            background: 'rgba(0,255,234,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 8,
            color: '#E2E8F0',
            padding: '9px 14px',
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            outline: 'none',
          }}
          placeholder="🔍 Search scans..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          {FILTER_TABS.map(t => (
            <button
              key={t}
              className={`tab-btn ${filter === t ? 'tab-active' : 'tab-inactive'}`}
              style={{ fontSize: 10 }}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#4A5568', fontSize: 13, fontFamily: "'Space Mono', monospace" }}>
            {scanHistory.length === 0 ? '◉ No scans yet. Analyze some content to get started.' : 'No results match your filter.'}
          </div>
        ) : (
          <table className="hist-table">
            <thead>
              <tr>
                <th>#</th>
                <th>PREVIEW</th>
                <th>TYPE</th>
                <th>SEVERITY</th>
                <th>CONFIDENCE</th>
                <th>TIME</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((scan, i) => {
                const vm = CLASSIFICATION_MAP[scan.analysis?.classification] || CLASSIFICATION_MAP.Safe;
                const sevCls = scan.analysis?.severity === 'High' ? 'ind-red' : scan.analysis?.severity === 'Medium' ? 'ind-amber' : 'ind-green';
                return (
                  <tr key={scan.id} onClick={() => setDrawerItem(scan)}>
                    <td style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#4A5568' }}>
                      {scanHistory.length - scanHistory.indexOf(scan)}
                    </td>
                    <td style={{ maxWidth: 200 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>
                        {scan.content?.substring(0, 60)}...
                      </div>
                    </td>
                    <td>
                      <span className={`verdict ${vm.cls}`} style={{ fontSize: 10, padding: '4px 10px', letterSpacing: 1 }}>
                        {vm.icon} {scan.analysis?.classification}
                      </span>
                    </td>
                    <td><span className={`ind-chip ${sevCls}`}>{scan.analysis?.severity}</span></td>
                    <td>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#00FFEA' }}>
                        {scan.analysis?.confidence}%
                      </span>
                    </td>
                    <td style={{ fontFamily: "'Space Mono', monospace", fontSize: 10 }}>
                      {new Date(scan.timestamp).toLocaleTimeString()}
                    </td>
                    <td>
                      <button className="btn-ghost" style={{ padding: '5px 10px', fontSize: 10, fontFamily: "'Space Mono', monospace" }}
                        onClick={e => { e.stopPropagation(); setDrawerItem(scan); }}>
                        VIEW →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {drawerItem && (
          <>
            <div className="drawer-bg" onClick={() => setDrawerItem(null)} />
            <motion.div
              className="drawer"
              initial={{ x: 500 }}
              animate={{ x: 0 }}
              exit={{ x: 500 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div className="sec-label" style={{ margin: 0 }}>FULL ANALYSIS REPORT</div>
                <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setDrawerItem(null)}>✕ Close</button>
              </div>

              {/* Verdict */}
              <div className="card card-glow" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  {(() => {
                    const vm = CLASSIFICATION_MAP[drawerItem.analysis?.classification] || CLASSIFICATION_MAP.Safe;
                    return <span className={`verdict ${vm.cls}`}>{vm.icon} {drawerItem.analysis?.classification}</span>;
                  })()}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: '#4A5568', fontFamily: "'Space Mono', monospace" }}>THREAT ID</div>
                    <div style={{ fontSize: 12, color: '#00FFEA', fontFamily: "'Space Mono', monospace" }}>{drawerItem.analysis?.threat_id}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <ThreatMeter score={SEVERITY_SCORES[drawerItem.analysis?.severity] || 25} severity={drawerItem.analysis?.severity} size={100} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, lineHeight: 1.5 }}>{drawerItem.analysis?.headline}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 10, color: '#718096', fontFamily: "'Space Mono', monospace" }}>CONFIDENCE:</span>
                      <span style={{ fontSize: 11, color: '#00FFEA', fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>{drawerItem.analysis?.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Intelligence Report */}
              <div className="card" style={{ marginBottom: 12 }}>
                <div className="sec-label" style={{ marginBottom: 12 }}>AI INTELLIGENCE REPORT</div>
                <div style={{ fontSize: 13, lineHeight: 1.75, color: '#CBD5E1' }}>
                  <div style={{ marginBottom: 8 }}><span style={{ fontSize: 11, color: '#00FFEA' }}>🔍 DETECTED: </span>{drawerItem.analysis?.explanation}</div>
                  <div style={{ marginBottom: 8 }}><span style={{ fontSize: 11, color: '#FF2052' }}>⚠ DANGEROUS: </span>{drawerItem.analysis?.why_dangerous}</div>
                  <div><span style={{ fontSize: 11, color: '#00FFA3' }}>🛡 ACTION: </span>{drawerItem.analysis?.recommended_action}</div>
                </div>
                {drawerItem.analysis?.indicators?.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div className="sec-label" style={{ marginBottom: 8 }}>THREAT INDICATORS</div>
                    {drawerItem.analysis.indicators.map((ind, i) => (
                      <span key={i} className="ind-chip ind-red">{ind}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* DNA */}
              {drawerItem.analysis?.dna && (
                <div className="card">
                  <div className="sec-label" style={{ marginBottom: 12 }}>THREAT DNA BREAKDOWN</div>
                  <ThreatDNA dna={drawerItem.analysis.dna} />
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
