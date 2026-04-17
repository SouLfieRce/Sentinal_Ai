import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const SUGGESTIONS = [
  'What is phishing?',
  'How to spot a fake URL?',
  'What is social engineering?',
  'How does malware spread?',
  'Why use urgency in scams?',
  'How to protect my email?',
];

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 I\'m SENTINEL, your AI cybersecurity advisor. Ask me anything about phishing, malware, social engineering, or how to stay safe online. What would you like to know?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    setInput('');
    setMessages(m => [...m, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await response.json();
      setMessages(m => [...m, {
        role: 'assistant',
        content: data.response || '⚠️ Connection error. Check your API key.',
      }]);
    } catch (err) {
      setMessages(m => [...m, {
        role: 'assistant',
        content: '⚠️ Connection error. Please ensure the SENTINEL server is running.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div className="page-title">🤖 SENTINEL Chat</div>
        <div className="page-subtitle">AI cybersecurity assistant — powered by Claude</div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
        {/* Suggestions */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {SUGGESTIONS.map(s => (
            <button key={s} className="sug-chip" onClick={() => send(s)}>{s}</button>
          ))}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} className="chat-msg" style={{ display: 'flex', gap: 8, alignItems: 'flex-start', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.role === 'assistant' && (
                <div style={{
                  width: 28, height: 28,
                  background: 'rgba(0,255,234,0.15)',
                  border: '1px solid rgba(0,255,234,0.3)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, flexShrink: 0, color: '#00FFEA',
                  fontFamily: "'Space Mono', monospace",
                }}>S</div>
              )}
              <div className={m.role === 'user' ? 'chat-user-bubble' : 'chat-ai-bubble'} style={{ whiteSpace: 'pre-wrap' }}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{
                width: 28, height: 28,
                background: 'rgba(0,255,234,0.15)',
                border: '1px solid rgba(0,255,234,0.3)',
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: '#00FFEA',
              }}>S</div>
              <div className="chat-ai-bubble" style={{ display: 'flex', gap: 4, padding: '12px 16px' }}>
                <div className="t-dot" /><div className="t-dot" /><div className="t-dot" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="chat-input-wrap" style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 10 }}>
          <input
            className="chat-input"
            style={{
              flex: 1,
              background: 'rgba(0,255,234,0.04)',
              border: '1px solid rgba(0,255,234,0.18)',
              borderRadius: 8,
              color: '#E2E8F0',
              padding: '10px 14px',
              fontFamily: "'Syne', sans-serif",
              fontSize: 13,
              outline: 'none',
            }}
            placeholder="Ask about phishing, malware, safe browsing..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && send()}
            disabled={loading}
          />
          <button className="btn-primary" style={{ padding: '10px 18px', flexShrink: 0 }} onClick={() => send()} disabled={loading}>SEND</button>
        </div>
      </div>
    </div>
  );
}
