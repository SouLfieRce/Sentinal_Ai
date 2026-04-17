import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Search, X, Trash2, ChevronRight, Shield } from 'lucide-react';
import { useSentinel } from '../context/SentinelContext';
import ThreatMeter from '../components/ThreatMeter';
import ThreatDNA from '../components/ThreatDNA';
import toast from 'react-hot-toast';

const SEVERITY_SCORES = { Low: 25, Medium: 55, High: 85 };
const CLASS_COLORS = {
  Phishing: '#FF2D55',
  Malware: '#A855F7',
  'Social Engineering': '#FFB300',
  Safe: '#00E676',
};

const FILTER_TABS = ['All', 'Phishing', 'Malware', 'Social Engineering', 'Safe'];

export default function History() {
  const { scanHistory, clearHistory } = useSentinel();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedScan, setSelectedScan] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filtered = scanHistory.filter(scan => {
    const matchSearch = !search || scan.content?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'All' || scan.analysis.classification === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-5">
      {/* Title Row */}
      <motion.div className="flex items-start justify-between" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2 font-mono tracking-wide">
            <ClipboardList className="w-6 h-6 text-sentinel-cyan" />
            Threat History
          </h1>
          <p className="text-xs text-sentinel-text-muted mt-0.5 font-mono">{scanHistory.length} scans this session</p>
        </div>
        {scanHistory.length > 0 && (
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-bold font-mono transition-all hover:scale-105"
            style={{ background: 'rgba(255, 45, 85, 0.12)', color: '#FF2D55', border: '1px solid rgba(255, 45, 85, 0.25)' }}
            onClick={() => {
              if (showClearConfirm) {
                clearHistory();
                setShowClearConfirm(false);
                toast.success('History cleared');
              } else {
                setShowClearConfirm(true);
                setTimeout(() => setShowClearConfirm(false), 3000);
              }
            }}
          >
            <Trash2 className="w-3 h-3" />
            {showClearConfirm ? 'Confirm?' : 'Clear History'}
          </button>
        )}
      </motion.div>

      {/* Search + Filter Tabs */}
      <motion.div
        className="flex items-center gap-3 p-3 rounded-xl"
        style={{ background: 'rgba(11, 17, 32, 0.6)', border: '1px solid rgba(0, 217, 255, 0.06)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sentinel-text-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search scans..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sentinel-cyan/30"
            style={{ background: 'rgba(17, 24, 39, 0.6)', border: '1px solid rgba(30, 41, 59, 0.3)', color: '#E2E8F0' }}
          />
        </div>
        <div className="flex gap-1">
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className="px-3 py-1.5 rounded text-[11px] font-mono font-semibold transition-all"
              style={{
                background: filterType === tab ? 'rgba(0, 217, 255, 0.12)' : 'transparent',
                color: filterType === tab ? '#00D9FF' : '#64748B',
                border: filterType === tab ? '1px solid rgba(0, 217, 255, 0.2)' : '1px solid transparent',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results */}
      <motion.div
        className="rounded-xl overflow-hidden"
        style={{ background: 'rgba(11, 17, 32, 0.6)', border: '1px solid rgba(0, 217, 255, 0.06)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {filtered.length > 0 ? (
          <div className="divide-y" style={{ borderColor: 'rgba(30, 41, 59, 0.3)' }}>
            {filtered.map((scan, i) => {
              const color = CLASS_COLORS[scan.analysis.classification] || '#00D9FF';
              return (
                <motion.div
                  key={scan.id}
                  className="flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors hover:bg-white/[0.02]"
                  onClick={() => setSelectedScan(scan)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <span className="text-[11px] text-sentinel-text-muted font-mono w-6">{i + 1}</span>
                  <span className="badge text-[10px] py-0.5 px-2" style={{
                    background: `${color}12`, color, border: `1px solid ${color}25`,
                  }}>
                    {scan.analysis.classification}
                  </span>
                  <span className={`text-[11px] font-mono font-semibold w-14 ${
                    scan.analysis.severity === 'High' ? 'text-sentinel-red' :
                    scan.analysis.severity === 'Medium' ? 'text-sentinel-amber' : 'text-sentinel-green'
                  }`}>
                    {scan.analysis.severity}
                  </span>
                  <span className="text-[12px] text-sentinel-text-dim font-mono flex-1 truncate">
                    {scan.content?.substring(0, 50)}...
                  </span>
                  <span className="text-[10px] text-sentinel-text-muted font-mono">
                    {scan.analysis.confidence}%
                  </span>
                  <span className="text-[10px] text-sentinel-text-muted font-mono">
                    {new Date(scan.timestamp).toLocaleTimeString()}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-sentinel-text-muted" />
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-sm text-sentinel-text-muted font-mono">
              ● No scans yet. Analyze some content to get started.
            </p>
          </div>
        )}
      </motion.div>

      {/* Side Drawer */}
      <AnimatePresence>
        {selectedScan && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScan(null)}
            />
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg z-50 overflow-y-auto"
              style={{
                background: '#0B1120',
                borderLeft: '1px solid rgba(0, 217, 255, 0.08)',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-white font-mono">Analysis Detail</h2>
                  <button onClick={() => setSelectedScan(null)} className="p-1.5 rounded hover:bg-white/5">
                    <X className="w-4 h-4 text-sentinel-text-muted" />
                  </button>
                </div>

                <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(17, 24, 39, 0.5)', border: '1px solid rgba(30, 41, 59, 0.3)' }}>
                  <motion.div
                    className="inline-block px-4 py-1.5 rounded text-sm font-black font-mono tracking-wider mb-3"
                    style={{
                      background: `${CLASS_COLORS[selectedScan.analysis.classification]}12`,
                      color: CLASS_COLORS[selectedScan.analysis.classification],
                      border: `1px solid ${CLASS_COLORS[selectedScan.analysis.classification]}30`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    {selectedScan.analysis.classification?.toUpperCase()}
                  </motion.div>
                  <ThreatMeter
                    score={SEVERITY_SCORES[selectedScan.analysis.severity] || 25}
                    severity={selectedScan.analysis.severity}
                    size={150}
                  />
                  <p className="text-[10px] text-sentinel-text-muted mt-2 font-mono">{selectedScan.analysis.threat_id}</p>
                </div>

                <div className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(17, 24, 39, 0.5)', border: '1px solid rgba(30, 41, 59, 0.3)' }}>
                  <h3 className="text-xs font-bold text-white font-mono flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-sentinel-cyan" /> INTELLIGENCE REPORT
                  </h3>
                  <div className="space-y-2 text-[12px] text-sentinel-text-dim">
                    <p>🔍 {selectedScan.analysis.explanation}</p>
                    <p>⚠️ {selectedScan.analysis.why_dangerous}</p>
                    <p>🎯 {selectedScan.analysis.attack_vector}</p>
                    <p>🛡️ {selectedScan.analysis.recommended_action}</p>
                  </div>
                  {selectedScan.analysis.indicators?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2" style={{ borderTop: '1px solid rgba(30, 41, 59, 0.3)' }}>
                      {selectedScan.analysis.indicators.map((ind, i) => (
                        <span key={i} className="indicator-chip text-[9px]">{ind}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl" style={{ background: 'rgba(17, 24, 39, 0.5)', border: '1px solid rgba(30, 41, 59, 0.3)' }}>
                  <h3 className="text-xs font-bold text-white font-mono mb-3">🧬 THREAT DNA</h3>
                  <ThreatDNA dna={selectedScan.analysis.dna} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
