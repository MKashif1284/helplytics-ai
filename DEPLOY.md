# 🚀 Helplytics AI — Deployment Guide

## Complete deployment in 3 steps: GitHub → Render (Backend) → Netlify (Frontend)

---

## Step 1: Push to GitHub

1. Go to **[github.com/new](https://github.com/new)**
2. Create a new repository named: `helplytics-ai`
3. Keep it **Public**, don't add README/gitignore (we already have them)
4. Copy the repo URL and run these commands:

```bash
cd E:\Hackathon
git remote add origin https://github.com/YOUR_USERNAME/helplytics-ai.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend on Render.com (Free)

1. Go to **[render.com](https://render.com)** → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your `helplytics-ai` GitHub repo
4. Configure:
   | Setting | Value |
   |---------|-------|
   | **Name** | `helplytics-ai-backend` |
   | **Root Directory** | `server` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `node index.js` |
   | **Plan** | `Free` |

5. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `PORT` | `10000` |
   | `JWT_SECRET` | `helplytics_ai_secret_key_2026` |
   | `NODE_ENV` | `production` |

6. Click **"Create Web Service"**
7. Wait for deploy → Copy the URL (e.g. `https://helplytics-ai-backend.onrender.com`)

> **Note:** The backend uses in-memory MongoDB, so data resets on restart. This is fine for hackathon demos!

---

## Step 3: Deploy Frontend on Netlify

1. Go to **[app.netlify.com](https://app.netlify.com)** → Sign up with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your `helplytics-ai` GitHub repo
4. Configure:
   | Setting | Value |
   |---------|-------|
   | **Base directory** | `client` |
   | **Build command** | `npm run build` |
   | **Publish directory** | `client/dist` |

5. Add **Environment Variable** (click "Show advanced"):
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://YOUR-RENDER-URL.onrender.com/api` |

   > Replace `YOUR-RENDER-URL` with your actual Render backend URL from Step 2

6. Click **"Deploy site"**
7. Wait for build → Your site is live! 🎉

---

## After Deployment

- **Frontend URL**: `https://your-site-name.netlify.app`
- **Backend URL**: `https://helplytics-ai-backend.onrender.com`
- **Demo Login**: `ahmed@helplytics.com` / `password123`

### Important Notes
- Render free tier spins down after 15 min of inactivity. First request may take 30-60 seconds.
- Data resets when the backend restarts (in-memory MongoDB).
- Every push to `main` branch auto-deploys on both Render and Netlify.
