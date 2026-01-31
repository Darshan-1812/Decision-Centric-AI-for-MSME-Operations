# Deployment Guide for MSME AI Operations System

## Overview
This project has two parts:
1. **Frontend (Next.js)** → Deploy on **Vercel**
2. **Backend (Python FastAPI)** → Deploy on **Railway** or **Render**

---

## Step 1: Deploy Backend (Python) on Railway

### Option A: Railway (Recommended)

1. **Go to Railway**: https://railway.app
2. **Sign in with GitHub**
3. **New Project** → **Deploy from GitHub repo**
4. Select your repository: `Darshan-1812/Decision-Centric-AI-for-MSME-Operations`
5. **Configure Build Settings**:
   - Root Directory: `/`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python -m uvicorn backend.app:app --host 0.0.0.0 --port $PORT`

6. **Add Environment Variables**:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   COMPANY_EMAIL=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

7. **Deploy** → Copy the deployed URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. **Go to Render**: https://render.com
2. **New** → **Web Service**
3. Connect your GitHub repo
4. **Settings**:
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
5. Add same environment variables as above
6. Deploy and copy URL

---

## Step 2: Deploy Frontend (Next.js) on Vercel

### Quick Deploy

1. **Go to Vercel**: https://vercel.com
2. **Sign in with GitHub**
3. **Import Project** → Select `Decision-Centric-AI-for-MSME-Operations`
4. **Configure Project**:
   - Framework Preset: Next.js
   - Root Directory: `msme-ai-system`
   
5. **Environment Variables** (Click "Environment Variables"):
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```
   (Use the URL from Step 1)

6. **Deploy**

### Manual Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd msme-ai-system

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: msme-ai-system
# - Directory: ./
# - Override settings? No

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL

# Deploy to production
vercel --prod
```

---

## Step 3: Update CORS on Backend

After deploying, update the backend to allow your Vercel domain:

In `backend/app.py`, the CORS is already configured to allow all origins with:
```python
allow_origins=["*"]
```

For production, you may want to restrict to specific domains:
```python
allow_origins=[
    "https://your-app.vercel.app",
    "https://your-custom-domain.com"
]
```

---

## Environment Variables Summary

### Backend (Railway/Render)
| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key |
| `COMPANY_EMAIL` | Gmail address for email agent |
| `EMAIL_PASSWORD` | Gmail app password |

### Frontend (Vercel)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL from Railway/Render |

---

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set correctly
- [ ] CORS configured for frontend domain
- [ ] Test email checking functionality
- [ ] Test project creation flow
- [ ] Test all dashboard pages

---

## Troubleshooting

### Backend not responding
- Check Railway/Render logs
- Verify environment variables are set
- Check if port is correctly configured

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings on backend
- Test backend URL directly in browser

### Email agent not working
- Verify Gmail app password is correct
- Enable "Less secure apps" or use App Password
- Check IMAP is enabled in Gmail settings

---

## URLs After Deployment

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.railway.app/api/autonomous/projects`
- **API Docs**: `https://your-backend.railway.app/docs`
