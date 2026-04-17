import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ScoreRing({ score = 0, size = 180, strokeWidth = 10 }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = score;
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setAnimatedScore(current);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const getColor = (s) => {
    if (s >= 81) return '#00D9FF';
    if (s >= 61) return '#00E676';
    if (s >= 41) return '#FFB300';
    if (s >= 21) return '#FF8C00';
    return '#FF2D55';
  };

  const getLevel = (s) => {
    if (s >= 81) return 'Cyber Defender';
    if (s >= 61) return 'Security Pro';
    if (s >= 41) return 'Cyber Aware';
    if (s >= 21) return 'Trainee';
    return 'Novice Analyst';
  };

  const color = getColor(animatedScore);
  const level = getLevel(animatedScore);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(30, 41, 59, 0.3)"
            strokeWidth={strokeWidth}
          />
          {/* Score ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black font-mono" style={{ color }}>
            {animatedScore}
          </span>
        </div>
      </div>
      {/* Level label with colored dot */}
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
        <span className="text-base font-bold font-mono" style={{ color }}>{level}</span>
      </div>
    </div>
  );
}
