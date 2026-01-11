# Quick Deployment Steps

## Prerequisites
- [x] MongoDB URI ready
- [ ] GitHub repository pushed
- [ ] Render account created
- [ ] Vercel account created

## Step 1: Deploy Backend to Render (10 minutes)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
6. Add environment variables:
   ```
   MONGODB_URI=<your-uri>
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://temp.vercel.app
   ```
7. Deploy (wait 3-5 minutes)
8. Copy your backend URL: `https://sydney-events-api.onrender.com`

## Step 2: Update Frontend API URL (2 minutes)

1. Open `frontend/js/api.js`
2. Change line 6:
   ```javascript
   const API_BASE_URL = 'https://sydney-events-api.onrender.com/api';
   ```
3. Save and commit:
   ```bash
   git add frontend/js/api.js
   git commit -m "Update API URL"
   git push
   ```

## Step 3: Deploy Frontend to Vercel (5 minutes)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your repository
5. Configure:
   - Root Directory: `frontend`
   - Framework: Other
6. Click "Deploy"
7. Copy your frontend URL: `https://louderx.vercel.app`

## Step 4: Update Backend CORS (2 minutes)

1. Back to Render dashboard
2. Open your backend service
3. Environment tab
4. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://louderx.vercel.app
   ```
5. Save (auto-redeploys)

## Step 5: Test Everything (5 minutes)

### Test Backend
Open in browser:
- https://sydney-events-api.onrender.com/health
- https://sydney-events-api.onrender.com/api/events

### Test Frontend
1. Open your Vercel URL
2. Events should load
3. Test filters
4. Test email subscription

## Step 6: Seed Database (Optional)

```bash
cd backend
node src/scripts/seed.js
```

## Step 7: Keep Backend Awake (Optional, 5 minutes)

1. Go to https://uptimerobot.com
2. Sign up (free)
3. Add monitor:
   - URL: `https://sydney-events-api.onrender.com/health`
   - Interval: 5 minutes
4. Your backend stays awake!

---

## ✅ Done!

Your app is live at: `https://louderx.vercel.app`

**Total Time**: ~30 minutes
**Total Cost**: $0

---

## Troubleshooting

**Events not loading?**
- Check browser console (F12)
- Verify backend URL in api.js
- Check Render logs

**Backend slow?**
- First request after sleep is slow (cold start)
- Set up UptimeRobot to keep it awake

**CORS error?**
- Update FRONTEND_URL in Render
- Make sure it matches your Vercel URL exactly

---

## Update Your App

**Backend changes**:
```bash
git add .
git commit -m "Update backend"
git push
```
Render auto-deploys in ~2 minutes

**Frontend changes**:
```bash
git add .
git commit -m "Update frontend"
git push
```
Vercel auto-deploys in ~1 minute
