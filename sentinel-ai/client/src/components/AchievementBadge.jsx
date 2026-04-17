import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function AchievementBadge({ achievement, unlocked = false }) {
  return (
    <motion.div
      className="relative p-4 rounded-lg flex flex-col items-center text-center gap-2 overflow-hidden transition-all"
      style={{
        background: unlocked
          ? 'rgba(255, 215, 0, 0.06)'
          : 'rgba(17, 24, 39, 0.4)',
        border: unlocked
          ? '1px solid rgba(255, 215, 0, 0.2)'
          : '1px solid rgba(30, 41, 59, 0.25)',
      }}
      whileHover={unlocked ? { scale: 1.05, borderColor: 'rgba(255, 215, 0, 0.4)' } : {}}
    >
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center z-10 rounded-lg"
          style={{ background: 'rgba(10, 14, 26, 0.55)' }}>
          <Lock className="w-4 h-4 text-sentinel-text-muted opacity-60" />
        </div>
      )}
      <span className="text-2xl leading-none">{achievement.icon}</span>
      <div>
        <h4 className="text-[11px] font-bold text-white font-mono leading-tight">{achievement.name}</h4>
        <p className="text-[9px] text-sentinel-text-muted leading-tight mt-0.5">{achievement.description}</p>
      </div>
      {unlocked && (
        <motion.div
          className="absolute top-1 right-1 w-2 h-2 rounded-full"
          style={{ background: '#FFD700' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
