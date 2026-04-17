import { NavLink, useLocation } from 'react-router-dom';
import { 
  Zap, BarChart3, Target, Bot, ClipboardList,
  FileText, Brain, Shield, Key
} from 'lucide-react';
import { useSentinel } from '../context/SentinelContext';
import { useState } from 'react';

const NAV_ITEMS = [
  { path: '/', icon: Zap, label: 'Threat Analyzer' },
  { path: '/dashboard', icon: BarChart3, label: 'Intelligence HQ' },
  { path: '/simulator', icon: Target, label: 'Phishing Sim' },
  { path: '/chat', icon: Bot, label: 'SENTINEL Chat' },
  { path: '/history', icon: ClipboardList, label: 'Threat History' },
  { path: '/reports', icon: FileText, label: 'Report Center' },
  { path: '/awareness', icon: Brain, label: 'Awareness Score' },
];

const getLevel = (s) => {
  if (s >= 81) return { label: 'Cyber Defender', color: '#00D9FF', dot: '🔵' };
  if (s >= 61) return { label: 'Security Pro', color: '#00E676', dot: '🟢' };
  if (s >= 41) return { label: 'Cyber Aware', color: '#FFB300', dot: '🟡' };
  if (s >= 21) return { label: 'Trainee', color: '#FF8C00', dot: '🟠' };
  return { label: 'Novice Analyst', color: '#FF2D55', dot: '🔴' };
};

export default function Sidebar() {
  const location = useLocation();
  const { awarenessScore } = useSentinel();
  const [showApiInput, setShowApiInput] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const level = getLevel(awarenessScore);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('sentinel_api_key', apiKey.trim());
      setShowApiInput(false);
      window.location.reload();
    }
  };

  return (
    <aside className="sidebar-container hidden md:flex fixed left-0 top-0 bottom-0 w-[170px] flex-col z-30"
      style={{
        background: '#0B1120',
        borderRight: '1px solid rgba(0, 217, 255, 0.08)',
      }}
    >
      {/* Logo */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black"
            style={{ background: 'linear-gradient(135deg, #0d2137, #0a1628)', border: '1px solid rgba(0, 217, 255, 0.2)' }}>
            <span className="text-sentinel-cyan" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>S/AI</span>
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-wider leading-none">SENTINEL</h1>
            <p className="text-[9px] text-sentinel-text-muted tracking-[0.2em] uppercase mt-0.5 font-mono">THREAT INTEL</p>
          </div>
        </div>
      </div>

      {/* Navigation Label */}
      <div className="px-4 pt-3 pb-1">
        <span className="text-[9px] font-mono text-sentinel-text-muted tracking-[0.2em] uppercase">Navigation</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="text-[13px] truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Awareness Score Card */}
      <div className="mx-3 mb-2">
        <div className="p-3 rounded-lg" style={{ background: 'rgba(0, 217, 255, 0.04)', border: '1px solid rgba(0, 217, 255, 0.08)' }}>
          <p className="text-[9px] font-mono text-sentinel-text-muted tracking-[0.15em] uppercase mb-2">Awareness Score</p>
          <p className="text-xl font-bold text-sentinel-cyan font-mono">{awarenessScore}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full" style={{ background: level.color }} />
            <span className="text-[11px] text-sentinel-text-dim">{level.label}</span>
          </div>
          {/* XP bar */}
          <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(30, 41, 59, 0.5)' }}>
            <div className="h-full rounded-full" style={{ 
              background: level.color, 
              width: `${Math.min(100, (awarenessScore % 20) / 20 * 100)}%`,
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Change API Key Button */}
      <div className="px-3 pb-3">
        {showApiInput ? (
          <div className="space-y-2">
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-2 py-1.5 rounded text-[11px] font-mono focus:outline-none"
              style={{ background: 'rgba(17, 24, 39, 0.8)', border: '1px solid rgba(0, 217, 255, 0.2)', color: '#E2E8F0' }}
            />
            <div className="flex gap-1">
              <button onClick={handleSaveKey} className="flex-1 py-1 rounded text-[10px] font-semibold"
                style={{ background: 'rgba(0, 217, 255, 0.15)', color: '#00D9FF', border: '1px solid rgba(0, 217, 255, 0.2)' }}>
                Save
              </button>
              <button onClick={() => setShowApiInput(false)} className="flex-1 py-1 rounded text-[10px] font-semibold text-sentinel-text-muted"
                style={{ background: 'rgba(30, 41, 59, 0.3)', border: '1px solid rgba(30, 41, 59, 0.3)' }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowApiInput(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-mono text-sentinel-text-muted transition-colors hover:text-sentinel-cyan"
            style={{ background: 'rgba(0, 217, 255, 0.04)', border: '1px solid rgba(0, 217, 255, 0.08)' }}
          >
            <Key className="w-3 h-3" />
            CHANGE API KEY
          </button>
        )}
      </div>
    </aside>
  );
}
