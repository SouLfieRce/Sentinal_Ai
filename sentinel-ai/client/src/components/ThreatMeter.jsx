import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const COLORS = {
  Low: '#00E676',
  Medium: '#FFB300',
  High: '#FF2D55',
};

export default function ThreatMeter({ score = 0, severity = 'Low', size = 200 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const color = COLORS[severity] || COLORS.Low;
  const radius = (size - 20) / 2;
  const circumference = Math.PI * radius; // semicircle
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 200);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {/* Background arc */}
        <path
          d={`M 10 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
          fill="none"
          stroke="rgba(30, 41, 59, 0.5)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <motion.path
          d={`M 10 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
        {/* Score text */}
        <text
          x={size / 2}
          y={size / 2 - 5}
          textAnchor="middle"
          fill={color}
          fontSize={size / 5}
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="700"
        >
          {animatedScore}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 15}
          textAnchor="middle"
          fill="#94A3B8"
          fontSize="12"
          fontFamily="'Inter', sans-serif"
        >
          SEVERITY
        </text>
      </svg>
      <motion.span
        className="badge text-sm"
        style={{
          background: `${color}20`,
          color: color,
          border: `1px solid ${color}40`,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        {severity}
      </motion.span>
    </div>
  );
}
