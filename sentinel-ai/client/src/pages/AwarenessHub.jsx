import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useSentinel } from '../context/SentinelContext';
import ScoreRing from '../components/ScoreRing';

const levelFor = (s) => {
  if (s >= 81) return '🔵 Cyber Defender';
  if (s >= 61) return '🟢 Security Pro';
  if (s >= 41) return '🟡 Cyber Aware';
  if (s >= 21) return '🟠 Trainee';
  return '🔴 Novice Analyst';
};

const ACHS = [
  { key: 'firstCatch', icon: '🎯', name: 'First Catch', desc: 'Detected your first threat' },
  { key: 'eagleEye', icon: '🦅', name: 'Eagle Eye', desc: '5 threats in a row' },
  { key: 'safeZone', icon: '🛡️', name: 'Safe Zone', desc: '3 safe items cleared correctly' },
  { key: 'simPro', icon: '🎮', name: 'Simulator Pro', desc: 'Completed phishing training' },
  { key: 'speedAnalyst', icon: '⚡', name: 'Speed Analyst', desc: 'Analyzed 10+ items' },
  { key: 'perfectScore', icon: '💯', name: 'Perfect Score', desc: 'Reached 100 awareness score' },
];

export default function AwarenessHub() {
  const { awarenessScore, scoreHistory, achievements, achievementDefs } = useSentinel();

  const nextLevelScore = awarenessScore >= 81 ? 100 : awarenessScore >= 61 ? 81 : awarenessScore >= 41 ? 61 : awarenessScore >= 21 ? 41 : 21;
  const pts = nextLevelScore - awarenessScore;

  const chartData = scoreHistory.map((entry, i) => ({
    name: `#${i + 1}`,
    score: entry.score,
  }));

  // Map achievementDefs to ACHS format for display
  const displayAchs = achievementDefs?.length > 0
    ? achievementDefs.map(a => ({
        key: a.id,
        icon: ACHS.find(ac => ac.key === a.id)?.icon || '🏆',
        name: a.name || a.id,
        desc: a.description || '',
        unlocked: achievements.includes(a.id),
      }))
    : ACHS.map(a => ({ ...a, unlocked: achievements.includes(a.key) }));

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div className="page-title">🧠 Awareness Score Hub</div>
        <div className="page-subtitle">Track your cybersecurity knowledge growth</div>
      </div>

      {/* Score Ring + How Score Works */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        {/* Score Ring */}
        <div className="card card-glow" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 32 }}>
          <ScoreRing score={awarenessScore} size={200} strokeWidth={12} />
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 12 }}>{levelFor(awarenessScore)}</div>
          <div style={{ fontSize: 12, color: '#718096', marginTop: 4, fontFamily: "'Space Mono', monospace" }}>
            {pts > 0 ? `${pts} pts to next level` : 'MAX LEVEL REACHED'}
          </div>
          <div className="prog-track" style={{ width: '100%', height: 6, marginTop: 12 }}>
            <div className="prog-fill" style={{ width: `${awarenessScore}%`, background: 'linear-gradient(90deg, #00FFEA, #00FFA3)' }} />
          </div>
        </div>

        {/* How Score Works */}
        <div className="card">
          <div className="sec-label" style={{ marginBottom: 16 }}>HOW SCORE WORKS</div>
          {[
            ['+15 pts', 'Correctly identify a threat', '#FF2052'],
            ['+10 pts', 'Correctly clear safe content', '#00FFA3'],
            ['+20 pts', 'Complete simulator correctly', '#00FFEA'],
            ['-5 pts', 'False positive (wrong flag)', '#FFB700'],
          ].map(([p, desc, color]) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 60, fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, color, flexShrink: 0 }}>{p}</div>
              <div style={{ fontSize: 13, color: '#718096' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="sec-label" style={{ marginBottom: 16 }}>ACHIEVEMENT BADGES</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
          {displayAchs.map(a => (
            <motion.div
              key={a.key}
              style={{ textAlign: 'center' }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <div className={`ach-badge ${a.unlocked ? 'ach-unlocked' : 'ach-locked'}`}
                style={{ margin: '0 auto 8px', width: 64, height: 64, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                {a.icon}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: a.unlocked ? '#FFB700' : '#4A5568', marginBottom: 2 }}>{a.name}</div>
              <div style={{ fontSize: 10, color: '#4A5568', lineHeight: 1.4 }}>{a.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Score Progression Chart */}
      {chartData.length > 1 && (
        <div className="card">
          <div className="sec-label" style={{ marginBottom: 12 }}>SCORE PROGRESSION</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: '#4A5568', fontSize: 9, fontFamily: "'Space Mono'" }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#4A5568', fontSize: 9, fontFamily: "'Space Mono'" }} />
              <Tooltip contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8,
                color: '#E2E8F0',
                fontSize: 11,
                fontFamily: "'Space Mono', monospace",
              }} />
              <Line type="monotone" dataKey="score" stroke="#00FFEA" strokeWidth={2}
                dot={{ fill: '#00FFEA', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
