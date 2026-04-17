import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSentinel } from '../context/SentinelContext';
import toast from 'react-hot-toast';

const SCENARIOS = [
  {
    id: 1, isPhishing: true,
    from: 'security-alert@paypa1.com', fromDisplay: 'PayPal Security Team',
    subject: '⚠️ Your account has been LIMITED - Action Required',
    body: `Dear Valued Customer,\n\nWe have noticed suspicious activity on your PayPal account. Your account access has been temporarily LIMITED.\n\nTo restore full access, you must verify your identity within 24 HOURS or your account will be permanently suspended.\n\n[ VERIFY ACCOUNT NOW → http://paypa1-secure-login.net/verify ]\n\nIf you do not act immediately, we will close your account.\n\nRegards,\nPayPal Security Department`,
    redFlags: ['paypa1.com', '24 HOURS', 'permanently suspended', 'paypa1-secure-login.net', 'do not act immediately'],
    explanation: 'Classic PayPal phishing: misspelled domain (paypa1 not paypal), extreme urgency, fear of account closure, and a fake verification link to steal credentials.',
    indicators: ['FAKE DOMAIN', 'URGENCY PRESSURE', 'FEAR TACTICS', 'CREDENTIAL HARVEST'],
  },
  {
    id: 2, isPhishing: false,
    from: 'no-reply@github.com', fromDisplay: 'GitHub',
    subject: '[GitHub] A third-party OAuth application has been authorized',
    body: `Hi there,\n\nA third-party OAuth application called "VS Code GitHub Copilot" was recently authorized to access your GitHub account.\n\nIf you did not authorize this application, you can revoke access at: https://github.com/settings/applications\n\nThis email was sent to confirm the authorization. No action is required if you recognize this activity.\n\nThe GitHub Team`,
    redFlags: [],
    explanation: "This is a legitimate GitHub notification. Real domain, informational tone, no urgency, no suspicious links, and it reassures the user 'no action required'.",
    indicators: [],
  },
  {
    id: 3, isPhishing: true,
    from: 'hr.team@company-benefits2024.ru', fromDisplay: 'HR Department',
    subject: '🎉 You have been selected for a $500 Gift Card!',
    body: `Congratulations!\n\nYou have been randomly selected by our HR team to receive a $500 Amazon Gift Card as a thank you for your hard work!\n\nThis offer EXPIRES in 2 hours. Click below to claim:\n\n[ CLAIM YOUR REWARD → http://bit.ly/claim-reward-2024 ]\n\nPlease keep this confidential and do not share with colleagues.\n\nBest,\nHR Benefits Team`,
    redFlags: ['company-benefits2024.ru', 'EXPIRES in 2 hours', 'bit.ly/claim-reward', 'keep this confidential', 'do not share'],
    explanation: "Multiple red flags: .ru domain, extreme time pressure, suspicious shortened URL, 'too good to be true' prize, and instruction to keep secret.",
    indicators: ['SUSPICIOUS DOMAIN', 'URGENCY', 'SHORTENED URL', 'SECRECY REQUEST', 'PRIZE SCAM'],
  },
  {
    id: 4, isPhishing: true,
    from: 'it.support@mircosoft-helpdesk.com', fromDisplay: 'Microsoft IT Support',
    subject: 'URGENT: Your Microsoft 365 License Expires Today',
    body: `Dear User,\n\nYour Microsoft 365 subscription will EXPIRE TODAY at midnight.\n\nTo continue using Office apps, Teams, and OneDrive without interruption, you must update your payment information NOW.\n\n[ UPDATE BILLING → https://mircosoft-helpdesk.com/renew ]\n\nFailure to update will result in immediate loss of access to all Microsoft services.\n\nMicrosoft Support Team\nRef: MS-20241234`,
    redFlags: ['mircosoft-helpdesk.com', 'EXPIRE TODAY', 'NOW', 'mircosoft', 'Failure to update'],
    explanation: 'IT support phishing: misspelled Microsoft domain (mircosoft), manufactured urgency, threatens immediate service loss.',
    indicators: ['TYPOSQUATTING', 'URGENCY PRESSURE', 'IMPERSONATION', 'FAKE BILLING PAGE'],
  },
  {
    id: 5, isPhishing: false,
    from: 'security@google.com', fromDisplay: 'Google Security',
    subject: 'New sign-in from Chrome on Windows',
    body: `Hi,\n\nA new sign-in to your Google Account was detected.\n\nDevice: Chrome on Windows\nLocation: Mumbai, Maharashtra\nTime: Today at 3:42 PM\n\nIf this was you, no action is needed.\n\nIf you don't recognize this sign-in, secure your account at:\nhttps://myaccount.google.com/security\n\nThe Google Account Team`,
    redFlags: [],
    explanation: "Legitimate Google security alert. Real google.com domain, factual information, no urgency language.",
    indicators: [],
  },
  {
    id: 6, isPhishing: true,
    from: 'fedex.tracking@fedex-delivery-status.com', fromDisplay: 'FedEx Delivery',
    subject: 'Your package could not be delivered - Final Attempt',
    body: `Dear Customer,\n\nWe attempted to deliver your package (ID: FX-847291-IN) but were UNABLE to complete delivery.\n\nThis is your FINAL delivery attempt. If you do not reschedule within 48 hours, your package will be RETURNED to sender and you will be charged a $3.99 storage fee.\n\n[ RESCHEDULE DELIVERY → http://fedex-redelivery-now.com/track?id=FX847291 ]\n\nNote: You will need to enter your card details to pay the storage fee.\n\nFedEx Customer Service`,
    redFlags: ['fedex-delivery-status.com', 'FINAL delivery attempt', 'storage fee', 'fedex-redelivery-now.com', 'enter your card details'],
    explanation: 'Fake delivery phishing: not from fedex.com, creates urgency with final attempt, extracts card details.',
    indicators: ['FAKE DOMAIN', 'URGENCY', 'FINANCIAL BAIT', 'CARD SKIMMING', 'IMPERSONATION'],
  },
];

export default function Simulator() {
  const { addScore, completeSimulator } = useSentinel();
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [pts, setPts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showFlags, setShowFlags] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  const scenario = SCENARIOS[idx];

  useEffect(() => {
    if (done || answered !== null) { clearInterval(timerRef.current); return; }
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleAnswer(null); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [idx, done]);

  const handleAnswer = useCallback((isSafe) => {
    if (answered !== null) return;
    clearInterval(timerRef.current);
    setAnswered(isSafe);
    const userSaysPhishing = isSafe === false;
    const isCorrect = scenario.isPhishing ? userSaysPhishing : !userSaysPhishing;
    setCorrect(isCorrect);
    setShowFlags(true);
    const bonus = timeLeft > 15 ? 5 : 0;
    const earned = isSafe === null ? 0 : isCorrect ? 10 + bonus : -5;
    setPts(p => p + earned);
    if (earned > 0) {
      toast.success(`+${earned} points!`);
      addScore(earned, 'Simulator correct');
    } else if (earned < 0) {
      toast.error('-5 points (wrong)');
    } else {
      toast.error("Time's up!");
    }
  }, [answered, scenario, timeLeft, addScore]);

  const next = () => {
    if (idx >= SCENARIOS.length - 1) {
      setDone(true);
      completeSimulator(pts);
    } else {
      setIdx(i => i + 1);
      setAnswered(null);
      setCorrect(null);
      setShowFlags(false);
    }
  };

  const restart = () => {
    setIdx(0); setAnswered(null); setCorrect(null);
    setShowFlags(false); setDone(false); setPts(0);
  };

  const highlight = (text, flags) => {
    if (!showFlags || !flags?.length) return <span>{text}</span>;
    let parts = [{ text, isFlag: false }];
    flags.forEach(flag => {
      parts = parts.flatMap(part => {
        if (!part.isFlag && part.text.includes(flag)) {
          const i = part.text.indexOf(flag);
          return [
            { text: part.text.slice(0, i), isFlag: false },
            { text: flag, isFlag: true },
            { text: part.text.slice(i + flag.length), isFlag: false },
          ].filter(p => p.text);
        }
        return [part];
      });
    });
    return <span>{parts.map((p, i) => p.isFlag ? <span key={i} className="red-flag">{p.text}</span> : <span key={i}>{p.text}</span>)}</span>;
  };

  if (done) {
    const rating = pts >= 90 ? '🏆 Cyber Defender' : pts >= 70 ? '🛡️ Security Aware' : pts >= 40 ? '⚠️ Getting Aware' : '🚨 Needs Training';
    return (
      <div>
        <div style={{ marginBottom: 20 }}><div className="page-title">🎯 Phishing Simulator</div><div className="page-subtitle">Interactive threat recognition training</div></div>
        <div className="card" style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎖️</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Training Complete!</div>
          <div style={{ fontSize: 40, fontWeight: 800, color: '#00FFEA', fontFamily: "'Space Mono', monospace", margin: '20px 0' }}>{pts}</div>
          <div style={{ fontSize: 18, marginBottom: 20 }}>{rating}</div>
          <div style={{ fontSize: 13, color: '#718096', marginBottom: 24 }}>You completed {SCENARIOS.length} phishing simulation scenarios</div>
          <button className="btn-primary" style={{ padding: '12px 32px' }} onClick={restart}>RESTART TRAINING</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="page-title">🎯 Phishing Simulator</div>
          <div className="page-subtitle">Can you spot the threat? Scenario {idx + 1} of {SCENARIOS.length}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 13, color: timeLeft <= 10 ? '#FF2052' : '#00FFEA', fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>⏱ {timeLeft}s</div>
          <span className="ind-chip ind-cyan">Score: {pts}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="prog-track" style={{ height: 4, marginBottom: 16 }}>
        <div className="prog-fill" style={{ width: `${(idx / SCENARIOS.length) * 100}%` }} />
      </div>

      {/* Email Mock */}
      <AnimatePresence mode="wait">
        <motion.div key={scenario.id} className="email-mock" style={{ marginBottom: 16 }}
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <div className="email-hdr">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontSize: 11, color: '#4A5568' }}>FROM</div>
              <div style={{ fontSize: 11, color: '#4A5568' }}>Today, {new Date().toLocaleTimeString()}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0' }}>{highlight(scenario.fromDisplay, scenario.redFlags)}</div>
            <div style={{ fontSize: 11, color: '#4A5568' }}>&lt;{highlight(scenario.from, scenario.redFlags)}&gt;</div>
            <div style={{ marginTop: 8, fontSize: 13, color: '#94A3B8' }}><strong style={{ color: '#CBD5E1' }}>Subject: </strong>{highlight(scenario.subject, scenario.redFlags)}</div>
          </div>
          <div className="email-body">
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{highlight(scenario.body, scenario.redFlags)}</pre>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Answer Buttons / Feedback */}
      {answered === null ? (
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="answer-btn btn-safe-ans" onClick={() => handleAnswer(true)}>✅ SAFE — Looks legitimate</button>
          <button className="answer-btn btn-threat-ans" onClick={() => handleAnswer(false)}>🚨 THREAT — This is suspicious</button>
        </div>
      ) : (
        <div>
          <div className={correct ? 'feedback-correct' : 'feedback-wrong'} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>{correct ? '✅ Correct! Great catch!' : '❌ Not quite!'}</div>
            <div style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.7 }}>{scenario.explanation}</div>
            {scenario.indicators.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <div className="sec-label" style={{ marginBottom: 8, color: '#718096' }}>RED FLAGS FOUND:</div>
                {scenario.indicators.map((ind, i) => <span key={i} className="ind-chip ind-red">{ind}</span>)}
              </div>
            )}
          </div>
          <button className="btn-primary" style={{ padding: '12px 32px' }} onClick={next}>
            {idx >= SCENARIOS.length - 1 ? 'FINISH TRAINING →' : 'NEXT SCENARIO →'}
          </button>
        </div>
      )}
    </div>
  );
}
