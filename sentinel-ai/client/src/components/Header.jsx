import { useState, useEffect } from 'react';
import { Clock, User } from 'lucide-react';
import { useSentinel } from '../context/SentinelContext';

function formatTime(ms) {
  const secs = Math.floor(ms / 1000);
  const mins = Math.floor(secs / 60);
  const hrs = Math.floor(mins / 60);
  return `${String(hrs).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
}

export default function Header() {
  const { awarenessScore, stats, sessionStart } = useSentinel();
  const [elapsed, setElapsed] = useState('00:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(formatTime(Date.now() - sessionStart));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStart]);

  return (
    <header className="header-bar sticky top-0 z-20 flex items-center justify-between px-5 h-11"
      style={{
        background: 'rgba(11, 17, 32, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 217, 255, 0.06)',
      }}
    >
      {/* Left — event name + badges */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-bold text-sentinel-text-dim tracking-wider">CODESTORM 2K26</span>
        
        {/* LIVE badge */}
        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold"
          style={{ background: 'rgba(0, 230, 118, 0.15)', color: '#00E676', border: '1px solid rgba(0, 230, 118, 0.25)' }}>
          <span className="w-1.5 h-1.5 bg-sentinel-green rounded-full pulse-dot" />
          LIVE
        </span>

        {/* Threats badge */}
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold"
          style={{ background: 'rgba(255, 45, 85, 0.12)', color: '#FF2D55', border: '1px solid rgba(255, 45, 85, 0.2)' }}>
          <User className="w-3 h-3" />
          {stats.threatsDetected} Threats
        </span>

        {/* Safe badge */}
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold"
          style={{ background: 'rgba(0, 230, 118, 0.1)', color: '#00E676', border: '1px solid rgba(0, 230, 118, 0.2)' }}>
          <span className="text-[10px]">■</span>
          {stats.safeCleared} Safe
        </span>
      </div>

      {/* Right — timer + mode */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-sentinel-text-dim font-mono">
          <Clock className="w-3.5 h-3.5" />
          {elapsed}
        </div>
        <span className="text-[11px] font-mono text-sentinel-text-muted tracking-wider">ANALYST MODE</span>
      </div>
    </header>
  );
}
