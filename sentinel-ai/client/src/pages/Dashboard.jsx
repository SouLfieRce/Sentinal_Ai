import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, Cell, ResponsiveContainer } from 'recharts';
import { useSentinel } from '../context/SentinelContext';

const CLASSIFICATION_MAP = {
  Phishing: { cls: 'verdict-phishing', icon: '🎣' },
  Malware: { cls: 'verdict-malware', icon: '🦠' },
  'Social Engineering': { cls: 'verdict-social', icon: '🧠' },
  Safe: { cls: 'verdict-safe', icon: '✅' },
};

export default function Dashboard() {
  const { stats, awarenessScore, scoreHistory, scanHistory } = useSentinel();

  const barData = [
    { name: 'Low', value: stats.lowSeverity, fill: '#00FFA3' },
    { name: 'Medium', value: stats.mediumSeverity, fill: '#FFB700' },
    { name: 'High', value: stats.highSeverity, fill: '#FF2052' },
  ];

  const lineData = scoreHistory.map((entry, i) => ({
    name: `#${i + 1}`,
    score: entry.score,
  }));

  const kpis = [
    { label: 'TOTAL SCANS', val: stats.totalScans, color: '#00FFEA' },
    { label: 'THREATS FOUND', val: stats.threatsDetected, color: '#FF2052' },
    { label: 'SAFE CLEARED', val: stats.safeCleared, color: '#00FFA3' },
    { label: 'AWARENESS SCORE', val: awarenessScore, color: '#FFB700' },
  ];

  const tooltipStyle = {
    backgroundColor: '#111827',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '8px',
    color: '#E2E8F0',
    fontSize: '11px',
    fontFamily: "'Space Mono', monospace",
  };

  const recentScans = scanHistory.slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div className="page-title">📊 Intelligence HQ</div>
        <div className="page-subtitle">Real-time threat analytics & session overview</div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            className="kpi-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ color: k.color }}>{k.val}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
        <div className="card">
          <div className="sec-label" style={{ marginBottom: 12 }}>THREAT TYPE BREAKDOWN</div>
          {lineData.length > 1 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#4A5568', fontSize: 9, fontFamily: "'Space Mono'" }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#4A5568', fontSize: 9, fontFamily: "'Space Mono'" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="score" stroke="#00FFEA" strokeWidth={2} dot={{ fill: '#00FFEA', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', color: '#4A5568', fontSize: 12, padding: 40, fontFamily: "'Space Mono', monospace" }}>No scans yet</div>
          )}
        </div>

        <div className="card">
          <div className="sec-label" style={{ marginBottom: 12 }}>SEVERITY DISTRIBUTION</div>
          {stats.totalScans > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#4A5568', fontSize: 10, fontFamily: "'Space Mono'" }} />
                <YAxis tick={{ fill: '#4A5568', fontSize: 10, fontFamily: "'Space Mono'" }} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', color: '#4A5568', fontSize: 12, padding: 40, fontFamily: "'Space Mono', monospace" }}>No scans yet</div>
          )}
        </div>
      </div>

      {/* Score Progression */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="sec-label" style={{ marginBottom: 12 }}>AWARENESS SCORE PROGRESSION</div>
        {lineData.length > 1 ? (
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={lineData}>
              <XAxis dataKey="name" tick={{ fill: '#4A5568', fontSize: 9 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#4A5568', fontSize: 9 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="score" stroke="#00FFEA" strokeWidth={2} fill="rgba(0,255,234,0.08)" dot={{ fill: '#00FFEA', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', color: '#4A5568', fontSize: 12, padding: 20, fontFamily: "'Space Mono', monospace" }}>Run some analyses to see your progress</div>
        )}
      </div>

      {/* Live Threat Feed */}
      <div className="card">
        <div className="sec-label" style={{ marginBottom: 12 }}>LIVE THREAT FEED</div>
        {recentScans.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#4A5568', fontSize: 12, padding: 20, fontFamily: "'Space Mono', monospace" }}>◉ Monitoring... No events yet</div>
        ) : (
          recentScans.map((h, i) => {
            const vm = CLASSIFICATION_MAP[h.analysis?.classification] || CLASSIFICATION_MAP.Safe;
            const sevCls = h.analysis?.severity === 'High' ? 'ind-red' : h.analysis?.severity === 'Medium' ? 'ind-amber' : 'ind-green';
            return (
              <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                <span className={`verdict ${vm.cls}`} style={{ fontSize: 10, padding: '4px 10px', letterSpacing: 1 }}>{vm.icon} {h.analysis?.classification}</span>
                <span className={`ind-chip ${sevCls}`}>{h.analysis?.severity}</span>
                <span style={{ fontSize: 11, color: '#718096', fontFamily: "'Space Mono', monospace", flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.content?.substring(0, 50)}...</span>
                <span style={{ fontSize: 10, color: '#4A5568', fontFamily: "'Space Mono', monospace", flexShrink: 0 }}>{new Date(h.timestamp).toLocaleTimeString()}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
