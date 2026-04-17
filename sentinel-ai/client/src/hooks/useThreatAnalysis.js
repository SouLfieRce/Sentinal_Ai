import { useState, useCallback } from 'react';
import { useSentinel } from '../context/SentinelContext';

export function useThreatAnalysis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loadingStage, setLoadingStage] = useState(0);
  const { addScan } = useSentinel();

  const LOADING_STAGES = [
    'Initializing neural threat engine...',
    'Scanning for social engineering patterns...',
    'Cross-referencing threat signature database...',
    'Calculating risk entropy score...',
    'Generating human-readable report...',
  ];

  const analyze = useCallback(async (content, contentType = 'EMAIL', deepScan = false) => {
    setLoading(true);
    setResult(null);
    setError(null);
    setLoadingStage(0);

    // Progress through stages
    const stageInterval = setInterval(() => {
      setLoadingStage(prev => {
        if (prev < LOADING_STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 800);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, contentType, deepScan }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();

      if (data.success && data.analysis) {
        // Ensure we show all loading stages
        clearInterval(stageInterval);
        setLoadingStage(LOADING_STAGES.length - 1);

        await new Promise(resolve => setTimeout(resolve, 600));

        setResult(data.analysis);
        addScan({
          content: content.substring(0, 200),
          contentType,
          analysis: data.analysis,
        });
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(stageInterval);
      setLoading(false);
    }
  }, [addScan]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoadingStage(0);
  }, []);

  return {
    loading,
    result,
    error,
    loadingStage,
    loadingStages: LOADING_STAGES,
    analyze,
    reset,
  };
}
