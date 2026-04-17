import { NavLink, useLocation } from 'react-router-dom';
import { useSentinel } from '../context/SentinelContext';
import { useState } from 'react';

const NAV_ITEMS = [
  { path: '/', icon: '⚡', label: 'Threat Analyzer' },
  { path: '/dashboard', icon: '📊', label: 'Intelligence HQ' },
  { path: '/simulator', icon: '🎯', label: 'Phishing Sim' },
  { path: '/chat', icon: '🤖', label: 'SENTINEL Chat' },
  { path: '/history', icon: '📋', label: 'Threat History' },
  { path: '/reports', icon: '📄', label: 'Report Center' },
  { path: '/awareness', icon: '🧠', label: 'Awareness Score' },
];

const levelFor = (s) => {
  if (s >= 81) return '🔵 Cyber Defender';
  if (s >= 61) return '🟢 Security Pro';
  if (s >= 41) return '🟡 Cyber Aware';
  if (s >= 21) return '🟠 Trainee';
  return '🔴 Novice Analyst';
};

export default function Sidebar() {
  const location = useLocation();
  const { awarenessScore } = useSentinel();
  const [showApiInput, setShowApiInput] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('sentinel_api_key', apiKey.trim());
      setShowApiInput(false);
      window.location.reload();
    }
  };

  return (
    <nav className="sidebar-container hidden md:flex fixed left-0 top-0 bottom-0 flex-col z-30 no-print">
      {/* Logo */}
      <div className="logo-wrap">
        <div className="logo-icon">S//AI</div>
        <div>
          <div className="logo-text">SENTINEL</div>
          <div className="logo-sub">THREAT INTEL</div>
        </div>
        <div className="pulse-dot" style={{ marginLeft: 'auto' }} />
      </div>

      {/* Navigation Label */}
      <div className="sec-label" style={{ marginBottom: 8, paddingLeft: 4 }}>NAVIGATION</div>

      {/* Nav Items */}
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `sidebar-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <span className="nav-icon" style={{ fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}

      {/* Awareness Score Card */}
      <div className="sidebar-score">
        <div className="score-label">AWARENESS SCORE</div>
        <div className="score-val">{awarenessScore}</div>
        <div className="score-level">{levelFor(awarenessScore)}</div>
        <div className="prog-track" style={{ height: 3, marginTop: 8 }}>
          <div className="prog-fill" style={{ width: `${awarenessScore}%` }} />
        </div>
      </div>

      {/* Change API Key */}
      <div style={{ marginTop: 8, padding: '8px 10px' }}>
        {showApiInput ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              style={{
                width: '100%',
                background: 'rgba(0,255,234,0.04)',
                border: '1px solid rgba(0,255,234,0.25)',
                borderRadius: 8,
                color: '#E2E8F0',
                padding: '8px 12px',
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="btn-ghost" style={{ flex: 1, padding: '6px', fontSize: 10 }} onClick={handleSaveKey}>Save</button>
              <button className="btn-ghost" style={{ flex: 1, padding: '6px', fontSize: 10 }} onClick={() => setShowApiInput(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button
            className="btn-ghost"
            style={{ width: '100%', padding: 7, fontSize: 10, letterSpacing: 1 }}
            onClick={() => setShowApiInput(true)}
          >
            ⚙ CHANGE API KEY
          </button>
        )}
      </div>
    </nav>
  );
}
