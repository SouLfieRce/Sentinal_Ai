import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ShieldAlert, ShieldCheck, Bug, Users, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, Cell, ResponsiveContainer } from 'recharts';
import { useSentinel } from '../context/SentinelContext';

const COLORS = {
  Phishing: '#FF2D55',
  Malware: '#A855F7',
  'Social Engineering': '#FFB300',
  Safe: '#00E676',
};

function AnimatedCounter({ value, duration = 1500 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (value - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);
  return <span>{display}</span>;
}

export default function Dashboard() {
  const { stats, awarenessScore, scoreHistory, scanHistory } = useSentinel();

  const barData = [
    { name: 'Low', value: stats.lowSeverity, fill: '#00E676' },
    { name: 'Medium', value: stats.mediumSeverity, fill: '#FFB300' },
    { name: 'High', value: stats.highSeverity, fill: '#FF2D55' },
  ];

  const lineData = scoreHistory.map((entry, i) => ({
    name: `#${i}`,
    score: entry.score,
  }));

  const kpis = [
    { label: 'Total Scans', value: stats.totalScans, icon: BarChart3, color: '#00D9FF' },
    { label: 'Threats Detected', value: stats.threatsDetected, icon: ShieldAlert, color: '#FF2D55' },
    { label: 'Safe Cleared', value: stats.safeCleared, icon: ShieldCheck, color: '#00E676' },
    { label: 'Awareness Score', value: awarenessScore, icon: TrendingUp, color: '#FFB300' },
  ];

  const categories = [
    { name: 'Phishing', count: stats.phishingCount, icon: ShieldAlert, color: '#FF2D55', pct: stats.totalScans ? Math.round((stats.phishingCount / stats.totalScans) * 100) : 0 },
    { name: 'Malware', count: stats.malwareCount, icon: Bug, color: '#A855F7', pct: stats.totalScans ? Math.round((stats.malwareCount / stats.totalScans) * 100) : 0 },
    { name: 'Social Engineering', count: stats.socialEngCount, icon: Users, color: '#FFB300', pct: stats.totalScans ? Math.round((stats.socialEngCount / stats.totalScans) * 100) : 0 },
    { name: 'Safe', count: stats.safeCleared, icon: ShieldCheck, color: '#00E676', pct: stats.totalScans ? Math.round((stats.safeCleared / stats.totalScans) * 100) : 0 },
  ];

  const recentScans = scanHistory.slice(0, 5);

  const tooltipStyle = {
    backgroundColor: '#111827',
    border: '1px solid rgba(30, 41, 59, 0.5)',
    borderRadius: '6px',
    padding: '8px 12px',
    color: '#E2E8F0',
    fontSize: '11px',
    fontFamily: "'JetBrains Mono', monospace",
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-black text-white flex items-center gap-2 font-mono tracking-wide">
          <BarChart3 className="w-6 h-6 text-sentinel-cyan" />
          Intelligence HQ
        </h1>
        <p className="text-xs text-sentinel-text-muted mt-0.5 font-mono">Real-time security operations overview</p>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            className="p-4 rounded-xl"
            style={{ background: 'rgba(11, 17, 32, 0.6)', border: '1px solid rgba(0, 217, 255, 0.06)' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              <span className="text-[9px] uppercase tracking-[0.15em] text-sentinel-text-muted font-mono">{kpi.label}</span>
            </div>
            <p className="text-3xl font-black font-mono" style={{ color: kpi.color }}>
              <AnimatedCounter value={kpi.value} />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Line Chart */}
        <motion.div
          className="p-5 rounded-xl"
          style={{ background: 'rgba(11, 17, 32, 0.6)', border: '1px solid rgba(0, 217, 255, 0.06)' }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="text-xs font-semibold text-white mb-4 font-mono">Awareness Score Progression</h3>
          {lineData.length > 1 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30, 41, 59, 0.2)" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10, fontFamily: "'JetBrains Mono'" }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 10, fontFamily: "'JetBrains Mono'" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="score" stroke="#00D9FF" strokeWidth={2}
                  dot={{ fill: '#00D9FF', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-sentinel-text-muted text-xs font-mono">
              Score will update after scans
            </div>
          )}
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          className="p-5 rounded-xl"
          style={{ background: 'rgba(11, 17, 32, 0.6)', border: '1px solid rgba(0, 217, 255, 0.06)' }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xs font-semibold text-white mb-4 font-mono">Severity Distribution</h3>
          {stats.totalScans > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30, 41, 59, 0.2)" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10, fontFamily: "'JetBrains Mono'" }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10, fontFamily: "'JetBrains Mono'" }} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-sentinel-text-muted text-xs font-mono">
              Severity data appears after scans
            </div>
          )}
        </motion.div>
      </div>

      {/* Live Feed + Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Live Feed */}
        <motion.div
          className="p-5 rounded-xl"
          style={{ background: 'rgba(11, 17, 32, 0.6)', border: '1px solid rgba(0, 217, 255, 0.06)' }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className="text-xs font-semibold text-white mb-3 flex items-center gap-2 font-mono">
            <span className="w-1.5 h-1.5 bg-sentinel-green rounded-full pulse-dot" />
            Live Scanning
            <span className="text-sentinel-text-muted">●</span>
            <span className="text-sentinel-text-muted">Safe</span>
          </h3>
          <div className="space-y-1.5 max-h-56 overflow-y-auto">
            {recentScans.length > 0 ? recentScans.map((scan, i) => (
              <motion.div
                key={scan.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px]"
                style={{ background: 'rgba(17, 24, 39, 0.4)' }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <span className="badge text-[9px] py-0.5 px-1.5" style={{
                  background: `${COLORS[scan.analysis.classification] || '#00D9FF'}10`,
                  color: COLORS[scan.analysis.classification] || '#00D9FF',
                  border: `1px solid ${COLORS[scan.analysis.classification] || '#00D9FF'}20`,
                }}>
                  {scan.analysis.classification}
                </span>
                <span className="text-sentinel-text-muted truncate flex-1 font-mono">
                  {scan.content?.substring(0, 30)}...
                </span>
                <span className="text-sentinel-text-muted text-[9px] font-mono">
                  {new Date(scan.timestamp).toLocaleTimeString()}
                </span>
              </motion.div>
            )) : (
              <div className="text-center text-sentinel-text-muted text-xs font-mono py-8">
                ● No scans yet — analyze your first threat
              </div>
            )}
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          className="p-5 rounded-xl"
          style={{ background: 'rgba(11, 17, 32, 0.6)', border: '1px solid rgba(0, 217, 255, 0.06)' }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xs font-semibold text-white mb-3 font-mono">Threat Categories</h3>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                className="p-3 rounded-lg"
                style={{
                  background: `${cat.color}05`,
                  border: `1px solid ${cat.color}12`,
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + i * 0.05 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <cat.icon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                  <span className="text-[11px] font-semibold text-sentinel-text-dim">{cat.name}</span>
                </div>
                <p className="text-xl font-black font-mono" style={{ color: cat.color }}>
                  {cat.count}
                </p>
                <p className="text-[9px] text-sentinel-text-muted mt-0.5 font-mono">{cat.pct}% of total</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
