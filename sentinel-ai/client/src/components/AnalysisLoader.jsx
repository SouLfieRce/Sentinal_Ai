import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

function BinaryColumn({ index, totalCols }) {
  const chars = useMemo(() => {
    const length = 15 + Math.floor(Math.random() * 20);
    return Array.from({ length }, () => Math.random() > 0.5 ? '1' : '0').join('\n');
  }, []);

  const left = `${(index / totalCols) * 100}%`;
  const duration = 3 + Math.random() * 5;
  const delay = Math.random() * 3;
  const opacity = 0.05 + Math.random() * 0.15;

  return (
    <div
      className="binary-column"
      style={{
        left,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        opacity,
        fontSize: `${10 + Math.random() * 6}px`,
      }}
    >
      {chars}
    </div>
  );
}

export default function AnalysisLoader({ stage = 0, stages = [], progress = 0 }) {
  const columns = useMemo(() => Array.from({ length: 30 }, (_, i) => i), []);
  const [displayedText, setDisplayedText] = useState('');
  const currentStage = stages[stage] || '';

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i <= currentStage.length) {
        setDisplayedText(currentStage.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [currentStage]);

  const progressPercent = Math.min(100, ((stage + 1) / stages.length) * 100);

  return (
    <motion.div
      className="binary-rain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Binary rain columns */}
      {columns.map(i => (
        <BinaryColumn key={i} index={i} totalCols={columns.length} />
      ))}

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg px-6">
        {/* Pulsing shield */}
        <motion.div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, rgba(0, 217, 255, 0.2), transparent)',
            border: '2px solid rgba(0, 217, 255, 0.3)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 20px rgba(0, 217, 255, 0.2)',
              '0 0 40px rgba(0, 217, 255, 0.4)',
              '0 0 20px rgba(0, 217, 255, 0.2)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-3xl">🛡️</span>
        </motion.div>

        {/* Status text with typewriter */}
        <div className="text-center min-h-[3rem]">
          <p className="text-sentinel-cyan font-mono text-sm">
            {displayedText}
            <span className="inline-block w-0.5 h-4 bg-sentinel-cyan ml-0.5 animate-pulse" />
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(30, 41, 59, 0.5)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #00D9FF, #0088FF)',
                boxShadow: '0 0 15px rgba(0, 217, 255, 0.5)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-center text-xs text-sentinel-text-muted mt-2 font-mono">
            {Math.round(progressPercent)}%
          </p>
        </div>

        {/* Stage indicators */}
        <div className="flex gap-2">
          {stages.map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: i <= stage ? '#00D9FF' : 'rgba(30, 41, 59, 0.5)',
              }}
              animate={i === stage ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.6, repeat: i === stage ? Infinity : 0 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
