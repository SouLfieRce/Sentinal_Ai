import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useSentinel } from '../context/SentinelContext';
import ScoreRing from '../components/ScoreRing';
import AchievementBadge from '../components/AchievementBadge';

const SCORE_RULES = [
  { action: 'Correctly identify a threat', points: '+15 pts', color: '#00E676' },
  { action: 'Correctly clear safe content', points: '+10 pts', color: '#00E676' },
  { action: 'Complete simulator correctly', points: '+20 pts', color: '#00E676' },
  { action: 'False positive (wrong flag)', points: '-5 pts', color: '#FF2D55' },
];

export default function AwarenessHub() {
  const { awarenessScore, scoreHistory, achievements, achievementDefs } = useSentinel();

  const getNextLevelPts = (s) => {
    if (s >= 81) return 0;
    if (s >= 61) return 81 - s;
    if (s >= 41) return 61 - s;
    if (s >= 21) return 41 - s;
    return 21 - s;
  };

  const ptsToNext = getNextLevelPts(awarenessScore);

  const chartData = scoreHistory.map((entry, i) => ({
    name: `#${i}`,
    score: entry.score,
  }));

  return (
    <div className="space-y-5">
      {/* Title */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-black text-white flex items-center gap-2 font-mono tracking-wide">
          <Brain className="w-6 h-6 text-sentinel-cyan" />
          Awareness Score Hub
        </h1>
        <p className="text-xs text-sentinel-text-muted mt-0.5 font-mono">Track your cybersecurity knowledge growth</p>
      </motion.div>

      {/* Score Ring + How Score Works — side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Score Ring Card */}
        <motion.div
          className="sentinel-card p-8 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <ScoreRing score={awarenessScore} size={180} strokeWidth={10} />
          <p className="text-xs text-sentinel-text-muted font-mono mt-3">
            {ptsToNext > 0 ? `${ptsToNext} pts to next level` : 'Maximum level reached!'}
          </p>
        </motion.div>

        {/* How Score Works Card */}
        <motion.div
          className="sentinel-card p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="sentinel-label mb-5">HOW SCORE WORKS</h3>
          <div className="space-y-4">
            {SCORE_RULES.map((rule, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
              >
                <span className="text-sm font-bold font-mono min-w-[60px]" style={{ color: rule.color }}>
                  {rule.points}
                </span>
                <span className="text-[13px] text-sentinel-text-dim">{rule.action}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Achievement Badges */}
      <motion.div
        className="sentinel-card p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h3 className="sentinel-label mb-4">ACHIEVEMENT BADGES</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {achievementDefs.map((achievement, i) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.04 }}
            >
              <AchievementBadge
                achievement={achievement}
                unlocked={achievements.includes(achievement.id)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Score Progression Chart */}
      {chartData.length > 1 && (
        <motion.div
          className="sentinel-card p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="sentinel-label mb-4">SCORE PROGRESSION</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30, 41, 59, 0.2)" />
              <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} />
              <Tooltip contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid rgba(30, 41, 59, 0.5)',
                borderRadius: '6px',
                color: '#E2E8F0',
                fontSize: '11px',
                fontFamily: "'JetBrains Mono', monospace",
              }} />
              <Line type="monotone" dataKey="score" stroke="#00D9FF" strokeWidth={2}
                dot={{ fill: '#00D9FF', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
}
