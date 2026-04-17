import { useState, useEffect } from 'react';
import { useSentinel } from '../context/SentinelContext';

export default function Header() {
  const { stats, sessionStart } = useSentinel();
  const [timer, setTimer] = useState('00:00');

  useEffect(() => {
    const iv = setInterval(() => {
      const s = Math.floor((Date.now() - sessionStart) / 1000);
      const m = Math.floor(s / 60).toString().padStart(2, '0');
      const sec = (s % 60).toString().padStart(2, '0');
      setTimer(`${m}:${sec}`);
    }, 1000);
    return () => clearInterval(iv);
  }, [sessionStart]);

  return (
    <div className="topbar no-print">
      <span className="topbar-title">CODESTORM 2K26</span>
      <div className="live-badge"><div className="live-dot" />&nbsp;LIVE</div>
      <span className="topbar-chip chip-threats">🚨 {stats.threatsDetected} Threats</span>
      <span className="topbar-chip chip-safe">✅ {stats.safeCleared} Safe</span>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
        <span className="timer-display">⏱ {timer}</span>
        <span style={{ fontSize: 11, color: '#475569', fontFamily: "'Space Mono', monospace" }}>ANALYST MODE</span>
      </div>
    </div>
  );
}
