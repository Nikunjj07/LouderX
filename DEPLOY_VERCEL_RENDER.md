# Deployment Guide: Vercel + Render (Free)

## Overview

**Frontend**: Vercel (Free tier)
**Backend**: Render (Free tier)
**Database**: MongoDB Atlas (Your existing URI)
**Scraper**: Render Background Worker (Free tier)

---

## Backend Deployment on Render (FREE)

### Why Render?
- **Completely free** tier (no credit card required initially)
- Auto HTTPS/SSL
- Easy GitHub integration
- Good for Express.js apps
- 750 hours/month (enough for 24/7 with one service)

### ⚠️ Free Tier Limitations
- Service sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds (cold start)
- 512 MB RAM
- Shared CPU

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Click "Get Started"
3. Sign up with GitHub (recommended)

### Step 2: Deploy Backend

1. **Click "New +"** → **"Web Service"**

2. **Connect Repository**:
   - Authorize Render to access your GitHub
   - Select `LouderX` repository

3. **Configure Service**:
   ```
   Name: sydney-events-api
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   MONGODB_URI = <your-mongodb-uri>
   NODE_ENV = production
   PORT = 5000
   FRONTEND_URL = https://your-app.vercel.app
   ```
   
   **Note**: You'll update `FRONTEND_URL` after deploying frontend

5. **Click "Create Web Service"**

6. **Wait for Deployment** (~3-5 minutes)
   - Watch the logs
   - You'll see build and deploy process
   - Service URL will be: `https://sydney-events-api.onrender.com`

7. **Test Backend**:
   - Open: `https://sydney-events-api.onrender.com/health`
   - Should return: `{ "status": "ok" }`
   - Open: `https://sydney-events-api.onrender.com/api/events`
   - Should return events data

### Step 3: Deploy Scraper (Optional Background Worker)

1. **Click "New +"** → **"Background Worker"**

2. **Configure Worker**:
   ```
   Name: sydney-events-scraper
   Region: Same as backend
   Branch: main
   Root Directory: scraper
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: python scheduler.py
   Instance Type: Free
   ```

3. **Environment Variables**:
   ```
   MONGODB_URI = <your-mongodb-uri>
   SCRAPE_INTERVAL_HOURS = 6
   ```

4. **Click "Create Background Worker"**

**Alternative**: Skip the scraper for now, run it manually on your local machine

---

## Frontend Deployment on Vercel (FREE)

### Step 1: Update API URL

**IMPORTANT**: Before deploying, update the API URL in your frontend

1. Open `frontend/js/api.js`
2. Replace the API_BASE_URL:
   ```javascript
   const API_BASE_URL = 'https://sydney-events-api.onrender.com/api';
   ```

3. Save and commit:
   ```bash
   git add frontend/js/api.js
   git commit -m "Update API URL for production"
   git push origin main
   ```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Sign up with GitHub

### Step 3: Deploy Frontend

1. **Click "Add New"** → **"Project"**

2. **Import Repository**:
   - Find `LouderX` repository
   - Click "Import"

3. **Configure Project**:
   ```
   Framework Preset: Other
   Root Directory: frontend
   Build Command: (leave empty)
   Output Directory: (leave empty or "./")
   Install Command: (leave empty)
   ```

4. **Click "Deploy"**

5. **Wait for Deployment** (~1 minute)
   - Vercel will deploy your site
   - You'll get a URL like: `https://louderx.vercel.app`

### Step 4: Update Backend CORS

1. Go back to Render dashboard
2. Open your backend service
3. Go to "Environment"
4. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL = https://louderx.vercel.app
   ```
5. Click "Save Changes"
6. Service will auto-redeploy

---

## Testing Your Deployment

### 1. Test Backend
```bash
# Health check
curl https://sydney-events-api.onrender.com/health

# Get events
curl https://sydney-events-api.onrender.com/api/events

# Get upcoming events
curl https://sydney-events-api.onrender.com/api/events/upcoming
```

### 2. Test Frontend
1. Open your Vercel URL in browser
2. Events should load
3. Try filters
4. Try "Get Tickets" button
5. Test email subscription

### 3. Test Integration
- Submit an email subscription
- Check MongoDB database for new email record
- Verify redirect to ticket URL works

---

## Post-Deployment Updates

### Updating Backend
1. Push changes to GitHub: `git push origin main`
2. Render will auto-deploy (if auto-deploy enabled)
3. Or manually trigger deploy in Render dashboard

### Updating Frontend
1. Push changes to GitHub: `git push origin main`
2. Vercel will auto-deploy
3. Changes live in ~1 minute

---

## Monitoring (Free Options)

### Render Dashboard
- View logs in real-time
- Monitor CPU/memory usage
- Check deploy history

### Vercel Dashboard
- Analytics (limited on free tier)
- Deploy logs
- Performance insights

### MongoDB Atlas
- Database monitoring
- Connection stats
- Storage usage

---

## Managing Free Tier Limitations

### Cold Starts (Render)
**Problem**: Service sleeps after 15 min, slow first request

**Solutions**:
1. **Keep-alive service** (free):
   - Use [UptimeRobot](https://uptimerobot.com) (free)
   - Ping your API every 5 minutes
   - Keeps service awake

2. **Accept cold starts**:
   - Add loading message: "Waking up server..."
   - Most subsequent requests will be fast

3. **Upgrade to paid tier** ($7/month):
   - No cold starts
   - Always-on service

### Implementation: UptimeRobot (Recommended)
1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Create new monitor:
   - Type: HTTP(s)
   - URL: `https://sydney-events-api.onrender.com/health`
   - Interval: 5 minutes
3. Your backend will stay awake!

---

## Cost Summary

| Service | Cost |
|---------|------|
| Render Backend | FREE (750 hrs/month) |
| Render Scraper | FREE (if using background worker) |
| Vercel Frontend | FREE (100 GB bandwidth) |
| MongoDB Atlas | FREE (you already have) |
| UptimeRobot | FREE (50 monitors) |
| **TOTAL** | **$0/month** |

---

## Troubleshooting

### Backend not responding
- Check Render logs
- Verify environment variables
- Check MongoDB URI is correct
- Try manual deploy

### Frontend can't connect to backend
- Check API URL in `api.js`
- Verify CORS settings in backend
- Check browser console for errors
- Verify `FRONTEND_URL` in Render

### Scraper not running
- Check Render worker logs
- Verify MongoDB URI
- Test scraper locally first
- Check Python dependencies

### Cold starts too slow
- Set up UptimeRobot
- Consider upgrading Render tier
- Add better loading states in frontend

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Update `api.js` with Render URL
3. ✅ Deploy frontend to Vercel
4. ✅ Update `FRONTEND_URL` in Render
5. ✅ Test complete flow
6. ✅ Set up UptimeRobot (optional but recommended)
7. ✅ Seed database with events
8. ✅ Monitor for 24 hours

---

## Quick Commands

### Seed Database
```bash
cd backend
npm run seed
```

### Run Manual Scrape
```bash
cd scraper
python run_scraper.py
```

### Check Logs
- Render: Dashboard → Service → Logs
- Vercel: Dashboard → Deployments → Logs

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com

---

## Your URLs (Update After Deployment)

**Backend API**: `https://sydney-events-api.onrender.com`
**Frontend**: `https://louderx.vercel.app`
**Health Check**: `https://sydney-events-api.onrender.com/health`
**API Endpoint**: `https://sydney-events-api.onrender.com/api/events`
