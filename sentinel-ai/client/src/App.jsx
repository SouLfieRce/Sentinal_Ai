import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { SentinelProvider } from './context/SentinelContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Analyzer from './pages/Analyzer';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';
import Chat from './pages/Chat';
import History from './pages/History';
import Reports from './pages/Reports';
import AwarenessHub from './pages/AwarenessHub';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.25,
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Analyzer /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/simulator" element={<PageWrapper><Simulator /></PageWrapper>} />
        <Route path="/chat" element={<PageWrapper><Chat /></PageWrapper>} />
        <Route path="/history" element={<PageWrapper><History /></PageWrapper>} />
        <Route path="/reports" element={<PageWrapper><Reports /></PageWrapper>} />
        <Route path="/awareness" element={<PageWrapper><AwarenessHub /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

function MobileNav() {
  const location = useLocation();
  const NAV = [
    { path: '/', icon: '⚡', label: 'Analyze' },
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/simulator', icon: '🎯', label: 'Simulate' },
    { path: '/chat', icon: '🤖', label: 'Chat' },
    { path: '/history', icon: '📋', label: 'History' },
    { path: '/reports', icon: '📄', label: 'Reports' },
    { path: '/awareness', icon: '🧠', label: 'Score' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex overflow-x-auto"
      style={{
        background: 'rgba(10, 14, 26, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(30, 41, 59, 0.5)',
      }}
    >
      {NAV.map(item => {
        const active = location.pathname === item.path;
        return (
          <a
            key={item.path}
            href={item.path}
            className="flex flex-col items-center gap-0.5 py-2 px-3 min-w-[60px] transition-colors"
            style={{ color: active ? '#00D9FF' : '#64748B' }}
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', item.path);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[9px] font-medium">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

export default function App() {
  return (
    <SentinelProvider>
      <Router>
        <div className="min-h-screen relative">
          {/* Animated Background */}
          <div className="sentinel-grid-bg" />

          {/* Sidebar (Desktop) */}
          <Sidebar />

          {/* Main Content — using inline style for reliable sidebar offset */}
          <div className="main-content-area relative z-10 min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
              <AnimatedRoutes />
            </main>
          </div>

          {/* Mobile Bottom Nav */}
          <MobileNav />

          {/* Toast */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'linear-gradient(135deg, #1A2332, #111827)',
                color: '#E2E8F0',
                border: '1px solid rgba(30, 41, 59, 0.5)',
                borderRadius: '12px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
              },
              duration: 3000,
            }}
          />
        </div>
      </Router>
    </SentinelProvider>
  );
}
