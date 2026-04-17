import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

const SentinelContext = createContext(null);

const ACHIEVEMENT_DEFS = [
  { id: 'first_catch', name: 'First Catch', description: 'Detect your first threat', icon: '🎯' },
  { id: 'eagle_eye', name: 'Eagle Eye', description: '5 threats detected in a row', icon: '🦅' },
  { id: 'safe_zone', name: 'Safe Zone', description: '3 safe contents cleared correctly', icon: '🟢' },
  { id: 'simulator_pro', name: 'Simulator Pro', description: 'Complete all training scenarios', icon: '🏆' },
  { id: 'speed_analyst', name: 'Speed Analyst', description: 'Analyze 10 items', icon: '⚡' },
  { id: 'perfect_score', name: 'Perfect Score', description: 'Reach 100 awareness score', icon: '💎' },
];

export function SentinelProvider({ children }) {
  const [scanHistory, setScanHistory] = useState([]);
  const [awarenessScore, setAwarenessScore] = useState(0);
  const [scoreHistory, setScoreHistory] = useState([{ time: Date.now(), score: 0 }]);
  const [achievements, setAchievements] = useState([]);
  const [simulatorScore, setSimulatorScore] = useState(null);
  const [sessionStart] = useState(Date.now());
  const consecutiveThreats = useRef(0);
  const safeClears = useRef(0);

  const unlockAchievement = useCallback((id) => {
    setAchievements(prev => {
      if (prev.includes(id)) return prev;
      const def = ACHIEVEMENT_DEFS.find(a => a.id === id);
      if (def) {
        toast(`🏆 Achievement Unlocked: ${def.name}!`, {
          style: {
            background: 'linear-gradient(135deg, #1A2332, #111827)',
            color: '#FFD700',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            fontFamily: "'Inter', sans-serif",
          },
          duration: 4000,
        });
      }
      return [...prev, id];
    });
  }, []);

  const addScore = useCallback((points, reason) => {
    setAwarenessScore(prev => {
      const newScore = Math.max(0, Math.min(100, prev + points));
      // Use setTimeout to avoid setState-in-setState warning
      setTimeout(() => {
        setScoreHistory(h => [...h, { time: Date.now(), score: newScore }]);
        if (newScore >= 100) {
          unlockAchievement('perfect_score');
        }
      }, 0);
      return newScore;
    });
    if (points > 0) {
      toast(`+${points} Awareness Points! ${reason || ''}`, {
        style: {
          background: 'linear-gradient(135deg, #1A2332, #111827)',
          color: '#00D9FF',
          border: '1px solid rgba(0, 217, 255, 0.3)',
          fontFamily: "'Inter', sans-serif",
        },
        duration: 2500,
      });
    }
  }, [unlockAchievement]);

  const addScan = useCallback((scan) => {
    const entry = {
      ...scan,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    setScanHistory(prev => [entry, ...prev]);

    // Achievement tracking
    if (scan.analysis.classification !== 'Safe') {
      consecutiveThreats.current += 1;
      safeClears.current = 0;

      if (scanHistory.length === 0) {
        unlockAchievement('first_catch');
      }
      if (consecutiveThreats.current >= 5) {
        unlockAchievement('eagle_eye');
      }

      addScore(15, 'Threat identified!');

      const severity = scan.analysis.severity;
      toast.error(`🚨 Threat Detected — ${severity} severity`, {
        style: {
          background: 'linear-gradient(135deg, #1A2332, #111827)',
          color: '#FF2D55',
          border: '1px solid rgba(255, 45, 85, 0.3)',
          fontFamily: "'Inter', sans-serif",
        },
        duration: 3000,
      });
    } else {
      consecutiveThreats.current = 0;
      safeClears.current += 1;
      if (safeClears.current >= 3) {
        unlockAchievement('safe_zone');
      }
      addScore(10, 'Safe content verified!');

      toast.success('✅ Content Cleared — Safe', {
        style: {
          background: 'linear-gradient(135deg, #1A2332, #111827)',
          color: '#00E676',
          border: '1px solid rgba(0, 230, 118, 0.3)',
          fontFamily: "'Inter', sans-serif",
        },
        duration: 3000,
      });
    }

    // Speed analyst: 10 total scans
    if (scanHistory.length + 1 >= 10) {
      unlockAchievement('speed_analyst');
    }
  }, [scanHistory, addScore, unlockAchievement]);

  const completeSimulator = useCallback((score) => {
    setSimulatorScore(score);
    unlockAchievement('simulator_pro');
  }, [unlockAchievement]);

  const clearHistory = useCallback(() => {
    setScanHistory([]);
  }, []);

  // Stats derived from history
  const stats = {
    totalScans: scanHistory.length,
    threatsDetected: scanHistory.filter(s => s.analysis.classification !== 'Safe').length,
    safeCleared: scanHistory.filter(s => s.analysis.classification === 'Safe').length,
    phishingCount: scanHistory.filter(s => s.analysis.classification === 'Phishing').length,
    malwareCount: scanHistory.filter(s => s.analysis.classification === 'Malware').length,
    socialEngCount: scanHistory.filter(s => s.analysis.classification === 'Social Engineering').length,
    highSeverity: scanHistory.filter(s => s.analysis.severity === 'High').length,
    mediumSeverity: scanHistory.filter(s => s.analysis.severity === 'Medium').length,
    lowSeverity: scanHistory.filter(s => s.analysis.severity === 'Low').length,
  };

  const value = {
    scanHistory,
    awarenessScore,
    scoreHistory,
    achievements,
    achievementDefs: ACHIEVEMENT_DEFS,
    simulatorScore,
    sessionStart,
    stats,
    addScan,
    addScore,
    clearHistory,
    unlockAchievement,
    completeSimulator,
  };

  return (
    <SentinelContext.Provider value={value}>
      {children}
    </SentinelContext.Provider>
  );
}

export function useSentinel() {
  const ctx = useContext(SentinelContext);
  if (!ctx) throw new Error('useSentinel must be used within SentinelProvider');
  return ctx;
}
