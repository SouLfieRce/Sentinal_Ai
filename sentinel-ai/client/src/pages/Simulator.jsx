import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle, XCircle, Clock, ArrowRight, RotateCcw, Trophy, AlertTriangle } from 'lucide-react';
import { useSentinel } from '../context/SentinelContext';

const SCENARIOS = [
  {
    id: 1,
    type: 'PayPal Phishing',
    from: 'security-alerts@paypal-secure-login.com',
    fromDisplay: 'PayPal Security Team',
    subject: '⚠ Your account has been LIMITED – Action Required',
    body: `Dear Valued Customer,

We have noticed suspicious activity on your PayPal account. Your account access has been temporarily LIMITED.

To restore full access, you must verify your identity within 24 HOURS or your account will be permanently suspended.

[ VERIFY ACCOUNT NOW → http://paypal-secure-login.net/verify ]

If you do not act immediately, we will close your account.

Regards,
PayPal Security Department`,
    isPhishing: true,
    redFlags: [
      { text: 'paypal-secure-login.com', reason: 'Fake domain — real PayPal uses paypal.com' },
      { text: 'LIMITED', reason: 'Urgency language to pressure immediate action' },
      { text: '24 HOURS', reason: 'Artificial time pressure to bypass critical thinking' },
      { text: 'paypal-secure-login.net/verify', reason: 'Phishing URL — not a real PayPal domain' },
      { text: 'act immediately', reason: 'Fear tactic to prevent careful review' },
    ],
  },
  {
    id: 2,
    type: 'Prize Scam',
    from: 'winner-notification@google-prizes.net',
    fromDisplay: 'Google Rewards Team',
    subject: '🎉 Congratulations! You Won a $1,000 Google Gift Card!',
    body: `Congratulations!

You have been randomly selected as our WINNER of the month! Your Google account has been chosen to receive a $1,000 Google Play Gift Card.

This is NOT spam. You were selected from 10,000,000 users.

To claim your prize, simply complete a short verification:

🎁 CLAIM YOUR PRIZE NOW
https://google-prizes-claim.net/winner?id=28491

⏰ This offer expires in 2 HOURS. Don't miss out!

Google Rewards Division
Mountain View, CA`,
    isPhishing: true,
    redFlags: [
      { text: 'google-prizes.net', reason: 'Fake domain — Google uses google.com' },
      { text: 'randomly selected as our WINNER', reason: 'Classic prize scam language' },
      { text: 'This is NOT spam', reason: 'Legitimate companies don\'t need to say this' },
      { text: 'google-prizes-claim.net', reason: 'Phishing URL to steal personal data' },
      { text: '2 HOURS', reason: 'Extreme urgency to prevent verification' },
    ],
  },
  {
    id: 3,
    type: 'IT Help Desk',
    from: 'it-support@yourcompany-helpdesk.com',
    fromDisplay: 'IT Department',
    subject: 'ACTION REQUIRED: Email Migration — Password Reset Needed',
    body: `Hello,

The IT Department is performing an urgent email system migration this weekend. All employees must reset their passwords before Friday 5:00 PM to avoid losing email access.

Please click the secure link below to update your credentials:

🔐 Reset Your Password Now
https://yourcompany-helpdesk.com/password-reset

Your current password will expire if not updated.

If you have questions, do NOT reply to this email. Contact the help desk directly.

Best regards,
IT Support Team
Internal Memo — Confidential`,
    isPhishing: true,
    redFlags: [
      { text: 'yourcompany-helpdesk.com', reason: 'Suspicious domain, not your actual company domain' },
      { text: 'urgent email system migration', reason: 'Creates artificial urgency' },
      { text: 'do NOT reply to this email', reason: 'Prevents verification of legitimacy' },
      { text: 'password-reset', reason: 'Credential harvesting link' },
      { text: 'Confidential', reason: 'Discourages sharing with security team' },
    ],
  },
  {
    id: 4,
    type: 'Package Delivery',
    from: 'tracking@fedex-delivery-notice.com',
    fromDisplay: 'FedEx Delivery',
    subject: '📦 Your Package Could Not Be Delivered — Action Required',
    body: `Dear Customer,

We attempted to deliver your package today but no one was available to sign.

Tracking Number: FDX-8847291055
Status: DELIVERY FAILED — Address Verification Needed

To reschedule delivery, please confirm your address and pay the $2.99 redelivery fee:

📦 Reschedule Delivery
https://fedex-redelivery.com/confirm

If not confirmed within 48 hours, your package will be returned to sender.

Thank you,
FedEx Customer Service`,
    isPhishing: true,
    redFlags: [
      { text: 'fedex-delivery-notice.com', reason: 'Not the real FedEx domain (fedex.com)' },
      { text: '$2.99 redelivery fee', reason: 'FedEx doesn\'t charge redelivery via email links' },
      { text: 'fedex-redelivery.com', reason: 'Phishing URL to steal payment info' },
      { text: '48 hours', reason: 'Artificial deadline creates pressure' },
    ],
  },
  {
    id: 5,
    type: 'LinkedIn Scam',
    from: 'recruiter@linkedin-careers-pro.com',
    fromDisplay: 'LinkedIn Recruiter',
    subject: '💼 Remote Position — $85/hr — Immediate Start',
    body: `Hi there,

I came across your LinkedIn profile and was impressed by your experience. I'd like to offer you an exclusive position:

Position: Remote Data Entry Specialist  
Salary: $85/hour  
Schedule: Flexible, work from anywhere  
Start: Immediately

No experience needed! We provide full training.

📋 Apply Now: https://linkedin-careers-pro.com/apply

Looking forward to working with you!

Sarah Mitchell
Senior Recruiter, LinkedIn Talent Solutions`,
    isPhishing: true,
    redFlags: [
      { text: 'linkedin-careers-pro.com', reason: 'Not LinkedIn\'s real domain (linkedin.com)' },
      { text: '$85/hour', reason: 'Unrealistically high pay for data entry' },
      { text: 'No experience needed', reason: 'Too good to be true for high-paying role' },
      { text: 'Immediately', reason: 'Pressures quick action without research' },
    ],
  },
  {
    id: 6,
    type: 'Legitimate Email',
    from: 'no-reply@github.com',
    fromDisplay: 'GitHub',
    subject: 'Your repository received a new star ⭐',
    body: `Hey there,

Your repository sentinel-ai just received a new star from @developer123!

Your repository now has 42 stars. Keep up the great work!

You can view your repository stats at:
https://github.com/your-username/sentinel-ai

— 
You're receiving this because you're watching this repository.
Manage your notification settings:
https://github.com/settings/notifications

GitHub, Inc. · 88 Colin P Kelly Jr St · San Francisco, CA 94107`,
    isPhishing: false,
    redFlags: [],
    safeIndicators: [
      'Legitimate github.com domain',
      'No urgency or pressure language',
      'No request for credentials or payment',
      'Standard notification format',
      'Proper unsubscribe link to github.com',
    ],
  },
];

export default function Simulator() {
  const { addScore, completeSimulator } = useSentinel();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [userAnswer, setUserAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState([]);

  const scenario = SCENARIOS[currentScenario];
  const isCorrect = userAnswer === (scenario?.isPhishing ? 'threat' : 'safe');

  useEffect(() => {
    if (answered || completed) return;
    if (timeLeft <= 0) {
      handleAnswer('timeout');
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, answered, completed]);

  const handleAnswer = useCallback((answer) => {
    if (answered) return;
    setAnswered(true);
    setUserAnswer(answer);

    const correct = answer === (scenario.isPhishing ? 'threat' : 'safe');
    const timeBonus = Math.max(0, Math.floor(timeLeft / 3));
    const points = correct ? 10 + timeBonus : -5;

    setScore(prev => prev + points);
    setResults(prev => [...prev, { scenario: scenario.type, correct, points }]);

    if (correct) {
      addScore(20, 'Simulator scenario correct!');
    }
  }, [answered, scenario, timeLeft, addScore]);

  const nextScenario = () => {
    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setAnswered(false);
      setUserAnswer(null);
      setTimeLeft(30);
    } else {
      setCompleted(true);
      completeSimulator(score);
    }
  };

  const restart = () => {
    setCurrentScenario(0);
    setAnswered(false);
    setUserAnswer(null);
    setScore(0);
    setTimeLeft(30);
    setCompleted(false);
    setResults([]);
  };

  const getScoreRating = (s) => {
    if (s >= 90) return { emoji: '🏆', label: 'Cyber Defender', color: '#00D9FF' };
    if (s >= 70) return { emoji: '🛡️', label: 'Security Aware', color: '#00E676' };
    if (s >= 40) return { emoji: '⚠️', label: 'Getting Aware', color: '#FFB300' };
    return { emoji: '🚨', label: 'Needs Training', color: '#FF2D55' };
  };

  if (completed) {
    const maxPossible = SCENARIOS.length * 20;
    const pct = Math.max(0, Math.round((score / maxPossible) * 100));
    const rating = getScoreRating(pct);

    return (
      <motion.div className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-xl font-black text-white flex items-center gap-2 font-mono tracking-wide">
          <Trophy className="w-6 h-6 text-sentinel-gold" />
          Simulation Complete!
        </h1>
        <motion.div
          className="p-8 rounded-xl text-center max-w-md mx-auto"
          style={{ background: 'rgba(11, 17, 32, 0.6)', border: '1px solid rgba(0, 217, 255, 0.06)' }}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <span className="text-5xl">{rating.emoji}</span>
          <p className="text-3xl font-black font-mono mt-3" style={{ color: rating.color }}>{score}</p>
          <p className="text-xs text-sentinel-text-muted mt-1 font-mono">points earned</p>
          <p className="text-base font-bold mt-2" style={{ color: rating.color }}>{rating.label}</p>

          <div className="mt-5 space-y-1.5 text-left">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-xs px-3 py-2 rounded"
                style={{ background: 'rgba(17, 24, 39, 0.5)' }}>
                <span className="text-sentinel-text-dim font-mono">{r.scenario}</span>
                <span className={`font-mono font-bold ${r.correct ? 'text-sentinel-green' : 'text-sentinel-red'}`}>
                  {r.correct ? '✓' : '✗'} {r.points > 0 ? '+' : ''}{r.points}
                </span>
              </div>
            ))}
          </div>

          <button onClick={restart} className="btn-primary mt-5 text-xs font-mono">
            <RotateCcw className="w-3.5 h-3.5" /> Try Again
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Title + Timer/Score Row */}
      <motion.div className="flex items-start justify-between" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2 font-mono tracking-wide">
            <Target className="w-6 h-6 text-sentinel-cyan" />
            Phishing Simulator
          </h1>
          <p className="text-xs text-sentinel-text-muted mt-0.5 font-mono">
            Can you spot the threat? Scenario {currentScenario + 1} of {SCENARIOS.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono font-bold"
            style={{
              background: timeLeft <= 10 ? 'rgba(255, 45, 85, 0.12)' : 'rgba(0, 217, 255, 0.08)',
              color: timeLeft <= 10 ? '#FF2D55' : '#00D9FF',
              border: `1px solid ${timeLeft <= 10 ? 'rgba(255, 45, 85, 0.2)' : 'rgba(0, 217, 255, 0.15)'}`,
            }}>
            <Clock className="w-3.5 h-3.5" />
            {timeLeft}s
          </div>
          <div className="px-2.5 py-1 rounded text-[11px] font-mono font-bold"
            style={{ background: 'rgba(0, 217, 255, 0.08)', color: '#00D9FF', border: '1px solid rgba(0, 217, 255, 0.15)' }}>
            Score: {score}
          </div>
        </div>
      </motion.div>

      {/* Email Mockup */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scenario.id}
          className="rounded-xl overflow-hidden"
          style={{ background: 'rgba(11, 17, 32, 0.6)', border: '1px solid rgba(0, 217, 255, 0.06)' }}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
        >
          {/* Email Header */}
          <div className="px-5 py-4 flex items-start justify-between"
            style={{ borderBottom: '1px solid rgba(30, 41, 59, 0.3)' }}>
            <div>
              <p className="text-[10px] text-sentinel-text-muted font-mono uppercase tracking-wider mb-1">FROM</p>
              <p className="text-sm font-bold text-white">{scenario.fromDisplay}</p>
              <p className="text-[11px] text-sentinel-text-muted font-mono">&lt;{scenario.from}&gt;</p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="text-sm font-bold text-white">Subject:</span>
                <AlertTriangle className="w-3.5 h-3.5 text-sentinel-amber" />
                <span className="text-sm text-white">{scenario.subject.replace(/[⚠🎉📦💼]/g, '').trim()}</span>
              </div>
            </div>
            <span className="text-[10px] text-sentinel-text-muted font-mono">
              Today, {new Date().toLocaleTimeString()}
            </span>
          </div>

          {/* Email Body */}
          <div className="px-5 py-5">
            <pre className="text-[13px] text-sentinel-text-dim whitespace-pre-wrap leading-relaxed font-mono">
              {answered && scenario.isPhishing
                ? scenario.body.split('\n').map((line, i) => {
                    const flag = scenario.redFlags?.find(f => line.includes(f.text));
                    if (flag) {
                      return (
                        <span key={i}>
                          {line.split(flag.text).map((part, j, arr) => (
                            <span key={j}>
                              {part}
                              {j < arr.length - 1 && (
                                <span className="text-sentinel-red font-semibold underline decoration-sentinel-red/50 decoration-wavy underline-offset-2"
                                  style={{ background: 'rgba(255, 45, 85, 0.1)' }}>
                                  {flag.text}
                                </span>
                              )}
                            </span>
                          ))}
                          {'\n'}
                        </span>
                      );
                    }
                    return <span key={i}>{line}{'\n'}</span>;
                  })
                : scenario.body
              }
            </pre>
          </div>

          {/* Answer Buttons / Result */}
          <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(30, 41, 59, 0.3)' }}>
            {!answered ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAnswer('safe')}
                  className="py-3.5 rounded-lg text-sm font-bold font-mono transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  style={{ background: 'rgba(0, 230, 118, 0.08)', color: '#00E676', border: '1px solid rgba(0, 230, 118, 0.2)' }}
                >
                  ✅ SAFE — Looks legitimate
                </button>
                <button
                  onClick={() => handleAnswer('threat')}
                  className="py-3.5 rounded-lg text-sm font-bold font-mono transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  style={{ background: 'rgba(255, 45, 85, 0.08)', color: '#FF2D55', border: '1px solid rgba(255, 45, 85, 0.2)' }}
                >
                  🚨 THREAT — This is suspicious
                </button>
              </div>
            ) : (
              <motion.div className="space-y-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className={`flex items-center gap-3 p-3 rounded-lg ${isCorrect
                  ? 'border border-sentinel-green/20'
                  : 'border border-sentinel-red/20'}`}
                  style={{ background: isCorrect ? 'rgba(0, 230, 118, 0.05)' : 'rgba(255, 45, 85, 0.05)' }}
                >
                  {isCorrect
                    ? <CheckCircle className="w-5 h-5 text-sentinel-green flex-shrink-0" />
                    : <XCircle className="w-5 h-5 text-sentinel-red flex-shrink-0" />
                  }
                  <div>
                    <p className={`text-sm font-bold font-mono ${isCorrect ? 'text-sentinel-green' : 'text-sentinel-red'}`}>
                      {isCorrect ? 'Correct!' : 'Wrong!'}
                    </p>
                    <p className="text-[11px] text-sentinel-text-dim mt-0.5">
                      This is {scenario.isPhishing ? 'a PHISHING attempt' : 'a LEGITIMATE email'}.
                    </p>
                  </div>
                </div>

                {scenario.isPhishing && scenario.redFlags?.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-mono text-sentinel-text-muted tracking-wider uppercase">Red Flags</p>
                    {scenario.redFlags.map((flag, i) => (
                      <motion.div key={i} className="text-[11px] px-2.5 py-1.5 rounded font-mono"
                        style={{ background: 'rgba(255, 45, 85, 0.04)' }}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <span className="text-sentinel-red">"{flag.text}"</span>
                        <span className="text-sentinel-text-muted"> — {flag.reason}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {!scenario.isPhishing && scenario.safeIndicators?.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-mono text-sentinel-text-muted tracking-wider uppercase">Safe Indicators</p>
                    {scenario.safeIndicators.map((ind, i) => (
                      <motion.div key={i} className="text-[11px] text-sentinel-green px-2.5 py-1.5 rounded font-mono"
                        style={{ background: 'rgba(0, 230, 118, 0.04)' }}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        ✓ {ind}
                      </motion.div>
                    ))}
                  </div>
                )}

                <button onClick={nextScenario}
                  className="w-full py-3 rounded-lg text-sm font-bold font-mono transition-all hover:scale-[1.01]"
                  style={{ background: 'linear-gradient(135deg, #00D9FF, #0088FF)', color: '#0A0E1A' }}>
                  {currentScenario < SCENARIOS.length - 1 ? (
                    <>Next Scenario <ArrowRight className="w-4 h-4 inline ml-1" /></>
                  ) : (
                    <>See Results <Trophy className="w-4 h-4 inline ml-1" /></>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
