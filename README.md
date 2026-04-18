# 🧠 HelpHub AI — Community Support Platform

> **SMIT Grand Coding Night 2026** — AI-powered community platform connecting students who need help with those who can provide it.

![HelpHub AI](https://img.shields.io/badge/SMIT-Grand%20Coding%20Night%202026-008b7d?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)

---

## 🌍 Problem Statement

In today's learning ecosystem:
- Students struggle to find timely help
- Skilled individuals willing to help lack a platform
- No structured system exists for asking help, offering help, or tracking contributions

**Result:** Slower learning, missed opportunities, and weak community collaboration.

## 💡 Vision

A multi-page, AI-powered community platform that connects people who **need help** with those who **can provide it** — with trust scores, badges, AI-powered matching, and real-time collaboration.

---

## ✨ Platform Pages (14 Total)

| # | Page | Features |
|---|------|----------|
| 1 | **🏠 Landing** | Hero section, community stats, featured requests, platform overview |
| 2 | **🔐 Auth** | Login / Signup with role selection (Need Help, Can Help, Both) |
| 3 | **👤 Onboarding** | AI-powered skill & interest suggestions |
| 4 | **📊 Dashboard** | Trust score, stats cards, recent requests, AI insights, notifications |
| 5 | **🔍 Explore / Feed** | Filterable request feed by category, urgency, status |
| 6 | **📝 Create Request** | AI auto-categorization, urgency detection, tag suggestions, rewrite |
| 7 | **📄 Request Detail** | Full description, AI summary, helper list, I can help / Mark solved |
| 8 | **💬 Messages** | Two-pane chat interface for helper-requester communication |
| 9 | **🏆 Leaderboard** | Rankings with trust scores, badges, solved count |
| 10 | **🤖 AI Center** | Trend pulse, urgency watch, mentor pool, recommendations |
| 11 | **🔔 Notifications** | Filterable notification feed with read/unread tracking |
| 12 | **👤 Profile** | Public profile, skills, trust score, edit functionality |
| 13 | **⚙️ Admin** | Moderation, user management, platform analytics |
| 14 | **🧭 Onboarding** | Profile setup with AI skill suggestion engine |

---

## 🤖 AI Features

| Feature | Description |
|---------|-------------|
| **Auto-Categorization** | Detects request category from title & description |
| **Urgency Detection** | Identifies priority level based on keywords |
| **Tag Suggestions** | Generates relevant tags automatically |
| **Description Rewrite** | Improves clarity and structure of help requests |
| **Trend Analysis** | Shows what the community needs most right now |
| **Smart Recommendations** | Matches helpers to requests based on skills |
| **Skill Suggestions** | AI suggests what you can help with based on interests |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite 8, React Router 7 |
| **Backend** | Node.js, Express 4 |
| **Database** | MongoDB Atlas (cloud) / In-memory (local dev) |
| **AI Engine** | Custom keyword-based intelligence service |
| **Auth** | JWT + bcrypt |
| **Design** | Custom CSS design system (warm beige + dark teal) |
| **Deployment** | Netlify (frontend) + Vercel (backend) |

---

## 🚀 Quick Start (Local Development)

```bash
# Clone the repo
git clone https://github.com/MKashif1284/helplytics-ai.git
cd helplytics-ai

# Start Backend (auto-seeds with in-memory MongoDB)
cd server
npm install
npm start

# Start Frontend (new terminal)
cd client
npm install
npm run dev
```

🔗 **Frontend:** http://localhost:5173  
🔗 **Backend:** http://localhost:5000  
🔑 **Demo Login:** `ahmed@helplytics.com` / `password123`

> The backend automatically starts an in-memory MongoDB and seeds 8 users, 12 requests, messages, and notifications — no MongoDB installation needed!

---

## 📦 Deployment (FREE — No Card Needed)

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Netlify | [Deploy Guide →](./DEPLOY.md) |
| Backend | Vercel | [Deploy Guide →](./DEPLOY.md) |
| Database | MongoDB Atlas (M0 Free) | [Setup Guide →](./DEPLOY.md) |

See **[DEPLOY.md](./DEPLOY.md)** for step-by-step instructions.

---

## 📁 Project Structure

```
helplytics-ai/
├── client/                  # React Frontend (Vite)
│   ├── src/
│   │   ├── pages/           # 13 page components
│   │   ├── components/      # LandingNav, AppNav
│   │   ├── context/         # AuthContext (JWT)
│   │   ├── api.js           # Axios + interceptor
│   │   └── index.css        # Full design system
│   ├── netlify.toml         # Netlify SPA config
│   └── package.json
├── server/                  # Express Backend
│   ├── models/              # User, Request, Message, Notification
│   ├── routes/              # auth, users, requests, messages, notifications, ai
│   ├── services/            # aiEngine.js
│   ├── middleware/           # JWT auth
│   ├── seedFn.js            # Auto-seed function
│   ├── vercel.json          # Vercel serverless config
│   └── package.json
├── DEPLOY.md                # Deployment guide
└── README.md
```

---

## 🎨 Design System

- **Background:** Warm beige `#f5f2e8`
- **Dark Cards:** `#2a2a2a` rounded hero sections
- **Accent:** Emerald teal `#008b7d`
- **Typography:** Inter font, 900-weight headings
- **Radius:** 24px rounded cards
- **Pattern:** Each page has a dark rounded hero card + content below

---

## 👥 Team

Built with ❤️ for **SMIT Grand Coding Night 2026**

---

## 📄 License

This project is built for educational and hackathon purposes.
