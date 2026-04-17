import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Copy, FileJson, Printer, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSentinel } from '../context/SentinelContext';
import { generateReportText, generateReportJSON } from '../utils/reportGenerator';

const getLevel = (s) => {
  if (s >= 81) return { label: 'Cyber Defender', dot: '🔵' };
  if (s >= 61) return { label: 'Security Pro', dot: '🟢' };
  if (s >= 41) return { label: 'Cyber Aware', dot: '🟡' };
  if (s >= 21) return { label: 'Trainee', dot: '🟠' };
  return { label: 'Novice Analyst', dot: '🔴' };
};

export default function Reports() {
  const { scanHistory, awarenessScore, stats, simulatorScore, sessionStart } = useSentinel();
  const level = getLevel(awarenessScore);

  const reportId = `RPT-${Date.now().toString(36).toUpperCase().slice(0, 8)}`;

  const handleExportPDF = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const handleExportJSON = () => {
    const data = generateReportJSON(scanHistory, awarenessScore, stats, simulatorScore, sessionStart);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('JSON report downloaded');
  };

  const handleCopySummary = () => {
    const { report } = generateReportText(scanHistory, awarenessScore, stats, simulatorScore, sessionStart);
    navigator.clipboard.writeText(report);
    toast.success('Report copied to clipboard');
  };

  return (
    <div className="space-y-5">
      {/* Title + Export Buttons */}
      <motion.div className="flex items-start justify-between" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2 font-mono tracking-wide">
            <FileText className="w-6 h-6 text-sentinel-cyan" />
            Report Center
          </h1>
          <p className="text-xs text-sentinel-text-muted mt-0.5 font-mono">Export your session findings</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-4 py-2 rounded text-[11px] font-bold font-mono transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #00D9FF, #0088FF)', color: '#0A0E1A' }}>
            <Printer className="w-3.5 h-3.5" /> Export PDF
          </button>
          <button onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-4 py-2 rounded text-[11px] font-bold font-mono transition-all hover:scale-105"
            style={{ background: 'rgba(0, 217, 255, 0.08)', color: '#00D9FF', border: '1px solid rgba(0, 217, 255, 0.2)' }}>
            <FileJson className="w-3.5 h-3.5" /> JSON
          </button>
          <button onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-4 py-2 rounded text-[11px] font-bold font-mono transition-all hover:scale-105"
            style={{ background: 'rgba(30, 41, 59, 0.3)', color: '#94A3B8', border: '1px solid rgba(30, 41, 59, 0.3)' }}>
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
        </div>
      </motion.div>

      {/* Report Preview — White Card */}
      <motion.div
        className="print-container rounded-xl overflow-hidden"
        style={{ background: '#f8fafc', border: '1px solid rgba(0, 217, 255, 0.06)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Report Header */}
        <div className="p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-wide">SENTINEL AI</h2>
              <p className="text-xs text-gray-500 font-mono tracking-[0.15em] uppercase mt-1">
                CYBERSECURITY INTELLIGENCE REPORT
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-500 font-mono">REPORT ID: {reportId}</p>
              <p className="text-[11px] text-gray-500 font-mono">GENERATED: {new Date().toLocaleString()}</p>
              <p className="text-[11px] text-gray-500 font-mono">CODESTORM HACKATHON 2K26</p>
            </div>
          </div>

          {/* Analyst Score + Session Summary */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-[10px] text-gray-500 font-mono tracking-[0.15em] uppercase mb-2">Analyst Score</p>
              <p className="text-4xl font-black text-gray-900 font-mono">{awarenessScore}/100</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-sm">{level.dot}</span>
                <span className="text-sm text-gray-600">{level.label}</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-mono tracking-[0.15em] uppercase mb-2">Session Summary</p>
              <div className="space-y-0">
                <div className="flex items-center justify-between py-2.5 border-b border-gray-200">
                  <span className="text-sm text-gray-700">Total Scans</span>
                  <span className="text-sm font-bold text-gray-900 font-mono">{stats.totalScans}</span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-gray-200">
                  <span className="text-sm text-gray-700">Threats Found</span>
                  <span className="text-sm font-bold font-mono" style={{ color: '#FF2D55' }}>{stats.threatsDetected}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-gray-700">Safe Content</span>
                  <span className="text-sm font-bold font-mono" style={{ color: '#00C853' }}>{stats.safeCleared}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Scan Results */}
          {scanHistory.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] text-gray-500 font-mono tracking-[0.15em] uppercase mb-3">Detailed Findings</p>
              <div className="space-y-3">
                {scanHistory.map((scan, i) => (
                  <div key={scan.id} className="p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-gray-400">#{i + 1}</span>
                      <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded"
                        style={{
                          background: scan.analysis.classification === 'Safe' ? '#dcfce7' : '#fef2f2',
                          color: scan.analysis.classification === 'Safe' ? '#166534' : '#991b1b',
                        }}>
                        {scan.analysis.classification}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">{scan.analysis.threat_id}</span>
                    </div>
                    <p className="text-xs text-gray-700">{scan.analysis.headline}</p>
                    <p className="text-[10px] text-gray-500 mt-1">→ {scan.analysis.recommended_action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-[11px] text-gray-400 font-mono">
              Generated by SENTINEL AI — CODESTORM HACKATHON 2K26 · ATU School of Engineering · Powered by Claude AI
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
