<div align="center">

# 🛡️ SENTINEL AI

### Next-Generation Cybersecurity Intelligence Platform

[![Live Demo](https://img.shields.io/badge/🔴_LIVE-sentinel--secure--ai.vercel.app-0D1220?style=for-the-badge&labelColor=111827)](https://sentinel-secure-ai.vercel.app)
[![React](https://img.shields.io/badge/React_18-0D1220?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-0D1220?style=for-the-badge&logo=vite&logoColor=A855F7)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-0D1220?style=for-the-badge&logo=node.js&logoColor=68A063)](https://nodejs.org)
[![Vercel](https://img.shields.io/badge/Vercel-0D1220?style=for-the-badge&logo=vercel&logoColor=fff)](https://vercel.com)

<br/>

> **⚡ AI-powered threat analysis engine that identifies phishing, malware, and social engineering attacks in real-time.**

<br/>

<img src="https://img.shields.io/badge/STATUS-PRODUCTION_READY-0D1220?style=flat-square&labelColor=111827" />
<img src="https://img.shields.io/badge/BUILD-PASSING-0D1220?style=flat-square&labelColor=111827" />
<img src="https://img.shields.io/badge/LICENSE-MIT-0D1220?style=flat-square&labelColor=111827" />

---

</div>

## 🎯 What is SENTINEL AI?

**SENTINEL AI** is a full-stack cybersecurity intelligence platform that uses AI to detect and analyze digital threats in real-time. Paste any suspicious email, URL, message, or code — SENTINEL will tell you exactly what's wrong, why it's dangerous, and what to do about it.

> Think of it as your personal cybersecurity analyst — always watching, always learning.

---

## ✨ Core Features

### ⚡ Threat Analyzer
The flagship feature — a dual-panel analysis engine with real-time AI classification.

| Feature | Description |
|---------|-------------|
| **Multi-Type Analysis** | Supports EMAIL, URL, MESSAGE, and CODE content types |
| **Threat Classification** | Categorizes as Phishing, Malware, Social Engineering, or Safe |
| **Severity Scoring** | Low / Medium / High with visual threat meter |
| **Confidence Rating** | 0–100% AI confidence score |
| **Threat DNA** | 5-axis breakdown: Urgency, Impersonation, Link Manipulation, Authority Abuse, Fear Tactics |
| **Attack Vector ID** | Identifies the specific attack technique used |
| **Threat Indicators** | Highlights specific red flags found in the content |
| **Educational Tips** | Learn from each analysis with actionable security advice |
| **Deep Scan Mode** | Enhanced analysis depth for obfuscated threats |

---

### 🎯 Phishing Simulator
Interactive training module with real-world phishing scenarios.

- ⏱️ **30-second timed challenges** — think fast under pressure
- 🔴 **Red flag highlighting** — shows exactly what to look for
- 📊 **Scoring system** — earn points for correct identifications
- 📝 **Detailed explanations** — learn why each email is safe or dangerous
- 🏆 **Performance rating** — from Novice to Cyber Defender

---

### 🤖 SENTINEL Chat
AI-powered cybersecurity assistant for learning and Q&A.

- Pre-built suggestion chips for common security questions
- Explains phishing, malware, social engineering, safe browsing
- Fallback knowledge base for offline use

---

### 📊 Intelligence Dashboard
Real-time analytics and session overview.

- **KPI Cards** — Total Scans, Threats Found, Safe Cleared, Awareness Score
- **Threat Type Breakdown** — Visual chart of detection categories
- **Severity Distribution** — Bar chart of Low / Medium / High threats
- **Live Threat Feed** — Real-time log of all analyses

---

### 📋 Threat History
Complete audit log with full report drill-down.

- Searchable and filterable scan history
- Slide-out drawer with full analysis details
- Classification badges, severity chips, confidence scores

---

### 🧠 Awareness Score Hub
Gamified cybersecurity learning with achievement badges.

- **Dynamic Score Ring** — Visual progress indicator (0–100)
- **6 Achievement Badges** — First Catch, Eagle Eye, Safe Zone, Simulator Pro, Speed Analyst, Perfect Score
- **Score Progression Chart** — Track your growth over time
- **Level System** — Novice → Trainee → Cyber Aware → Security Pro → Cyber Defender

---

### 📄 Report Center
Export professional reports for submission and documentation.

- **PDF Export** — Print-ready formatted report
- **JSON Export** — Machine-readable data export
- **Clipboard Copy** — Quick summary sharing

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | Component-based UI with HMR |
| **Styling** | Custom CSS + Tailwind | Glassmorphism design system |
| **Animations** | Framer Motion | Smooth page transitions & micro-interactions |
| **Charts** | Recharts | Data visualization (line, bar, pie) |
| **Typography** | Syne + Space Mono | Premium cyber aesthetic |
| **Backend** | Express.js + Node.js | RESTful API server |
| **AI Engine** | OpenAI GPT-4o | Intelligent threat analysis |
| **Fallback** | Heuristic Engine | Pattern-matching analysis (works offline) |
| **Deployment** | Vercel Serverless | Auto-deployed from GitHub |
| **Notifications** | React Hot Toast | Real-time feedback system |

---

## 🎨 Design System

SENTINEL uses a custom **cybersecurity-themed design system** built from scratch:

```
Background:     #080C18  (Deep Navy)
Cyan Accent:    #00FFEA  (Primary — actions, highlights)
Red Alert:      #FF2052  (Threats, danger indicators)
Green Safe:     #00FFA3  (Safe content, success states)
Amber Warning:  #FFB700  (Medium severity, achievements)
```

**Key design features:**
- Glassmorphism cards with `rgba(255,255,255,0.03)` backgrounds
- 44px grid overlay for subtle cyber-grid aesthetic
- 210px fixed sidebar with gradient logo and pulse indicators
- Monospace data display using Space Mono for all metrics

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/SouLfieRce/Sentinal_Ai.git
cd Sentinal_Ai/sentinel-ai

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### Running Locally

```bash
# Terminal 1 — Start the backend server
cd server
node index.js
# ⚡ Server running on port 3001

# Terminal 2 — Start the frontend
cd client
npm run dev
# ➜ http://localhost:5173/
```

### Environment Variables

Create a `.env` file in the root `sentinel-ai/` directory:

```env
# Optional: AI-powered analysis (leave default for heuristic fallback)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Server configuration
PORT=3001
CLIENT_URL=http://localhost:5173
```

> 💡 **No API key needed!** SENTINEL works out of the box with its built-in heuristic analysis engine. Add an API key for enhanced AI-powered analysis.

---

## 📁 Project Structure

```
sentinel-ai/
├── client/                    # React Frontend (Vite)
│   ├── api/                   # Vercel Serverless Functions
│   │   ├── analyze.js         # POST /api/analyze
│   │   ├── chat.js            # POST /api/chat
│   │   └── health.js          # GET  /api/health
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── ThreatMeter.jsx
│   │   │   ├── ThreatDNA.jsx
│   │   │   └── ScoreRing.jsx
│   │   ├── pages/             # Application pages
│   │   │   ├── Analyzer.jsx   # ⚡ Threat Analyzer
│   │   │   ├── Dashboard.jsx  # 📊 Intelligence HQ
│   │   │   ├── Simulator.jsx  # 🎯 Phishing Simulator
│   │   │   ├── Chat.jsx       # 🤖 SENTINEL Chat
│   │   │   ├── History.jsx    # 📋 Threat History
│   │   │   ├── Reports.jsx    # 📄 Report Center
│   │   │   └── AwarenessHub.jsx
│   │   ├── context/           # State management
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Utilities
│   │   ├── App.jsx            # Root layout + routing
│   │   ├── index.css          # Design system
│   │   └── main.jsx           # Entry point
│   ├── vercel.json
│   └── package.json
├── server/                    # Express Backend
│   ├── routes/
│   │   ├── analyze.js
│   │   └── chat.js
│   └── index.js
└── .env
```

---

## 🔒 How the Analysis Engine Works

SENTINEL uses a **dual-layer analysis architecture**:

### Layer 1 — AI-Powered Analysis *(with API key)*
Uses GPT-4o for deep semantic understanding of threats:
- Obfuscated phishing attempts
- Context-aware social engineering
- Subtle malware distribution patterns

### Layer 2 — Heuristic Fallback *(no API key needed)*
Built-in pattern-matching engine scanning for:

```
📧 Phishing Signals    → "verify your account", "click here", "urgent", "suspended"
🦠 Malware Signals     → "download", "exe", ".bat", "powershell", "macro"
🧠 Social Eng Signals  → "wire transfer", "gift card", "confidential", "trust me"
🔗 URL Analysis        → IP addresses, shortened URLs, typosquatting detection
```

Both layers produce identical output: **classification, severity, confidence, threat DNA, indicators, and educational tips**.

---

## 🏆 Scoring & Achievements

| Action | Points |
|--------|--------|
| Correctly identify a threat | +15 |
| Correctly clear safe content | +10 |
| Complete simulator correctly | +20 |
| False positive (wrong flag) | −5 |

### Achievement Badges

| Badge | Requirement |
|-------|------------|
| 🎯 First Catch | Detect your first threat |
| 🦅 Eagle Eye | 5 threats detected in a row |
| 🟢 Safe Zone | 3 safe contents cleared correctly |
| 🏆 Simulator Pro | Complete all training scenarios |
| ⚡ Speed Analyst | Analyze 10+ items |
| 💎 Perfect Score | Reach 100 awareness score |

---

## 🌐 Deployment

### Vercel (Production)

The app auto-deploys from GitHub to Vercel with serverless API functions:

- **Frontend** → Static build from `client/dist/`
- **API Routes** → Serverless functions from `client/api/`
- **Zero backend** → Everything runs on Vercel's edge network

🔗 **Live:** [sentinel-secure-ai.vercel.app](https://sentinel-secure-ai.vercel.app)

### Build for Production

```bash
cd client
npm run build
# Output → client/dist/
```

---

## 👥 Team

<div align="center">

| Member | Role |
|--------|------|
| **Nandish Patel** | Lead Developer & UI/UX |
| **Dhairya Jain** | Full-Stack Developer |
| **Ansh Shah** | Backend & AI Integration |
| **Dhara Riteshkumar** | Research & Testing |

<br/>

*Built at **GTU School of Engineering***

</div>

---

## 📝 License

This project is open source under the [MIT License](LICENSE).

---

<div align="center">

**🛡️ SENTINEL AI — Protecting the digital world, one scan at a time.**

[![Deploy with Vercel](https://img.shields.io/badge/DEPLOY_WITH_VERCEL-0D1220?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/new/clone?repository-url=https://github.com/SouLfieRce/Sentinal_Ai)

</div>
