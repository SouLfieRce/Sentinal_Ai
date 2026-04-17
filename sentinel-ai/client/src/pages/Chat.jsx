import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send } from 'lucide-react';

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
      content: `I'm SENTINEL, your AI cybersecurity advisor. Ask me anything about phishing, malware, social engineering, or how to stay safe online. What would you like to know?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMsg = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || 'I apologize, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection error. Please ensure the SENTINEL server is running.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatContent = (text) => {
    return text.split('\n').map((line, i) => {
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
      if (line.startsWith('- ')) {
        formatted = `<span class="text-sentinel-cyan mr-1">•</span>${formatted.slice(2)}`;
      }
      return (
        <span key={i} dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    }).reduce((acc, el, i) => {
      if (i > 0) acc.push(<br key={`br-${i}`} />);
      acc.push(el);
      return acc;
    }, []);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Title */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <h1 className="text-xl font-black text-white flex items-center gap-2 font-mono tracking-wide">
          <Bot className="w-6 h-6 text-sentinel-cyan" />
          SENTINEL Chat
        </h1>
        <p className="text-xs text-sentinel-text-muted mt-0.5 font-mono">AI cybersecurity assistant — powered by Claude</p>
      </motion.div>

      {/* Suggestion Chips — Always at top */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={i}
            className="text-[11px] px-3 py-1.5 rounded font-mono transition-all hover:scale-105 cursor-pointer"
            style={{
              background: 'rgba(0, 217, 255, 0.08)',
              border: '1px solid rgba(0, 217, 255, 0.2)',
              color: '#00D9FF',
            }}
            onClick={() => sendMessage(s)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.03 }}
            whileHover={{ backgroundColor: 'rgba(0, 217, 255, 0.15)' }}
          >
            {s}
          </motion.button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 rounded-xl overflow-hidden flex flex-col"
        style={{ background: 'rgba(11, 17, 32, 0.6)', border: '1px solid rgba(0, 217, 255, 0.06)' }}>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(0, 217, 255, 0.1)', border: '1px solid rgba(0, 217, 255, 0.15)' }}>
                  <span className="text-[10px] font-bold text-sentinel-cyan font-mono">S</span>
                </div>
              )}
              <div
                className={`max-w-[80%] px-3.5 py-2.5 rounded-lg text-[13px] leading-relaxed`}
                style={msg.role === 'user' ? {
                  background: 'rgba(0, 217, 255, 0.08)',
                  border: '1px solid rgba(0, 217, 255, 0.12)',
                  color: '#E2E8F0',
                } : {
                  background: 'rgba(17, 24, 39, 0.6)',
                  border: '1px solid rgba(30, 41, 59, 0.3)',
                  color: '#CBD5E1',
                }}
              >
                <div>{formatContent(msg.content)}</div>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <motion.div className="flex gap-2.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ background: 'rgba(0, 217, 255, 0.1)', border: '1px solid rgba(0, 217, 255, 0.15)' }}>
                <span className="text-[10px] font-bold text-sentinel-cyan font-mono">S</span>
              </div>
              <div className="px-3.5 py-2.5 rounded-lg flex items-center gap-1.5"
                style={{ background: 'rgba(17, 24, 39, 0.6)', border: '1px solid rgba(30, 41, 59, 0.3)' }}>
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-sentinel-cyan"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(0, 217, 255, 0.06)' }}>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about phishing, malware, safe browsing..."
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-sentinel-cyan/30"
              style={{
                background: 'rgba(17, 24, 39, 0.6)',
                border: '1px solid rgba(30, 41, 59, 0.3)',
                color: '#E2E8F0',
              }}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="px-5 py-2.5 rounded-lg font-mono text-xs font-bold disabled:opacity-30 transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #00D9FF, #0088FF)',
                color: '#0A0E1A',
              }}
            >
              SEND
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
