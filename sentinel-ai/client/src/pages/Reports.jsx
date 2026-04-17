import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSentinel } from '../context/SentinelContext';
import { generateReportText, generateReportJSON } from '../utils/reportGenerator';

const levelFor = (s) => {
  if (s >= 81) return '🔵 Cyber Defender';
  if (s >= 61) return '🟢 Security Pro';
  if (s >= 41) return '🟡 Cyber Aware';
  if (s >= 21) return '🟠 Trainee';
  return '🔴 Novice Analyst';
};

export default function Reports() {
  const { scanHistory, awarenessScore, stats, simulatorScore, sessionStart } = useSentinel();
  const threats = scanHistory.filter(h => h.analysis?.classification !== 'Safe');
  const safe = scanHistory.filter(h => h.analysis?.classification === 'Safe');

  const reportId = `RPT-${Date.now().toString(36).toUpperCase()}`;
  const date = new Date().toLocaleString();

  const exportJSON = () => {
    const data = generateReportJSON(scanHistory, awarenessScore, stats, simulatorScore, sessionStart);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel-report-${reportId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('JSON report downloaded!');
  };

  const exportPDF = () => { window.print(); };

  const copySummary = () => {
    const { report } = generateReportText(scanHistory, awarenessScore, stats, simulatorScore, sessionStart);
    navigator.clipboard?.writeText(report);
    toast.success('Summary copied!');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="page-title">📄 Report Center</div>
          <div className="page-subtitle">Export your session findings</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-primary" style={{ padding: '10px 18px', fontSize: 12 }} onClick={exportPDF}>📄 Export PDF</button>
          <button className="btn-ghost" style={{ padding: '10px 16px', fontSize: 12 }} onClick={exportJSON}>📦 JSON</button>
          <button className="btn-ghost" style={{ padding: '10px 16px', fontSize: 12 }} onClick={copySummary}>📋 Copy</button>
        </div>
      </div>

      <div className="report-preview">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 16, borderBottom: '2px solid #080C18' }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#080C18', letterSpacing: 1 }}>SENTINEL AI</div>
            <div style={{ fontSize: 12, color: '#6B7280', letterSpacing: 2, fontFamily: 'monospace' }}>CYBERSECURITY INTELLIGENCE REPORT</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#6B7280', fontFamily: 'monospace' }}>REPORT ID: {reportId}</div>
            <div style={{ fontSize: 11, color: '#6B7280', fontFamily: 'monospace' }}>GENERATED: {date}</div>
            <div style={{ fontSize: 11, color: '#6B7280', fontFamily: 'monospace' }}>CODESTORM HACKATHON 2K26</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#6B7280', marginBottom: 8 }}>ANALYST SCORE</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#080C18' }}>{awarenessScore}/100</div>
            <div style={{ fontSize: 14, color: '#374151' }}>{levelFor(awarenessScore)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#6B7280', marginBottom: 8 }}>SESSION SUMMARY</div>
            <table style={{ width: '100%', fontSize: 13 }}>
              <tbody>
                <tr><td style={{ color: '#6B7280', padding: 8 }}>Total Scans</td><td style={{ fontWeight: 700, textAlign: 'right', padding: 8 }}>{stats.totalScans}</td></tr>
                <tr><td style={{ color: '#6B7280', padding: 8 }}>Threats Found</td><td style={{ fontWeight: 700, textAlign: 'right', color: '#dc2626', padding: 8 }}>{stats.threatsDetected}</td></tr>
                <tr><td style={{ color: '#6B7280', padding: 8 }}>Safe Content</td><td style={{ fontWeight: 700, textAlign: 'right', color: '#16a34a', padding: 8 }}>{stats.safeCleared}</td></tr>
                {simulatorScore !== null && <tr><td style={{ color: '#6B7280', padding: 8 }}>Simulator Score</td><td style={{ fontWeight: 700, textAlign: 'right', padding: 8 }}>{simulatorScore}pts</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {scanHistory.length > 0 && (
          <div style={{ marginTop: 20, borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#374151', marginBottom: 12 }}>DETAILED FINDINGS</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', border: '1px solid #e5e7eb' }}>Classification</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', border: '1px solid #e5e7eb' }}>Severity</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', border: '1px solid #e5e7eb' }}>Confidence</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', border: '1px solid #e5e7eb' }}>Attack Vector</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', border: '1px solid #e5e7eb' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {scanHistory.map((scan, i) => (
                  <tr key={i}>
                    <td style={{ padding: '8px 10px', border: '1px solid #e5e7eb', fontWeight: 700 }}>{scan.analysis?.classification}</td>
                    <td style={{ padding: '8px 10px', border: '1px solid #e5e7eb' }}>{scan.analysis?.severity}</td>
                    <td style={{ padding: '8px 10px', border: '1px solid #e5e7eb' }}>{scan.analysis?.confidence}%</td>
                    <td style={{ padding: '8px 10px', border: '1px solid #e5e7eb' }}>{scan.analysis?.attack_vector}</td>
                    <td style={{ padding: '8px 10px', border: '1px solid #e5e7eb', fontSize: 11, color: '#374151' }}>{scan.analysis?.recommended_action?.substring(0, 80)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: 24, paddingTop: 12, borderTop: '1px solid #e5e7eb', fontSize: 10, color: '#9CA3AF', textAlign: 'center', fontFamily: 'monospace' }}>
          Generated by SENTINEL AI — CODESTORM HACKATHON 2K26 · GTU School of Engineering · Powered by Claude AI
        </div>
      </div>
    </div>
  );
}
