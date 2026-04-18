# 🚀 Helplytics AI — Deployment Guide (FREE, No Card Needed)

## Deploy in 3 steps: GitHub → Vercel (Backend) → Netlify (Frontend)

---

## ✅ Step 1: GitHub (DONE)
Repo: https://github.com/MKashif1284/helplytics-ai

---

## Step 2: Free MongoDB Atlas Database

1. Go to **[mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register)** → Sign up (FREE, no card)
2. Create a **FREE Shared Cluster** (M0)
3. Set **Database User**: username `helplytics` / password `helplytics2026`
4. Set **Network Access**: Add `0.0.0.0/0` (allow all IPs)
5. Click **Connect → Drivers** → Copy the connection string:
   ```
   mongodb+srv://helplytics:helplytics2026@cluster0.xxxxx.mongodb.net/helplytics?retryWrites=true&w=majority
   ```
6. After cluster is ready, open **MongoDB Compass** or **Atlas Shell** and run the seed (or the server will auto-seed)

---

## Step 3: Deploy Backend on Vercel (FREE, No Card)

1. Go to **[vercel.com](https://vercel.com)** → Sign up with GitHub (FREE)
2. Click **"Add New Project"**
3. Import your `helplytics-ai` repo
4. Configure:
   | Setting | Value |
   |---------|-------|
   | **Root Directory** | `server` |
   | **Framework Preset** | `Other` |

5. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | `mongodb+srv://helplytics:helplytics2026@cluster0.xxxxx.mongodb.net/helplytics` |
   | `JWT_SECRET` | `helplytics_ai_secret_key_2026` |
   | `NODE_ENV` | `production` |
   | `CLIENT_URL` | `*` |

6. Click **Deploy** → Copy URL (e.g. `https://helplytics-ai-backend.vercel.app`)

---

## Step 4: Deploy Frontend on Netlify (FREE, No Card)

1. Go to **[app.netlify.com](https://app.netlify.com)** → Sign up with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Select your `helplytics-ai` repo
4. Configure:
   | Setting | Value |
   |---------|-------|
   | **Base directory** | `client` |
   | **Build command** | `npm run build` |
   | **Publish directory** | `client/dist` |

5. Click **"Show advanced"** → Add Environment Variable:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://YOUR-VERCEL-URL.vercel.app/api` |

6. Click **"Deploy site"** → Done! 🎉

---

## 🎯 After Deployment

- **Frontend**: `https://your-site.netlify.app`
- **Backend**: `https://your-backend.vercel.app`
- **Demo Login**: `ahmed@helplytics.com` / `password123`

### First Time Setup
After backend deploys, visit `https://your-backend.vercel.app/api/health` to verify it's running.
The database will need to be seeded — hit the signup/login endpoints to create users.
