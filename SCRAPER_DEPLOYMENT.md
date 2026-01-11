# Scraper Deployment Options

## Overview

The scraper needs to run every 6 hours to keep events fresh. Here are your options from simplest to most automated:

---

## Option 1: Run Manually on Your Computer (Simplest)

**Cost**: FREE
**Effort**: Manual, but simple

### How It Works
1. Run scraper manually whenever you want to update events
2. You control when it runs
3. No deployment needed

### Setup
```bash
# Open terminal
cd scraper

# Run scraper once
python run_scraper.py
```

### Pros
- ✅ Completely free
- ✅ Full control
- ✅ No deployment needed
- ✅ Easy to test and debug

### Cons
- ❌ Must run manually
- ❌ Computer must be on
- ❌ Not automated

### Best For
- Testing and development
- Low-traffic apps
- When you check daily anyway

---

## Option 2: Render Background Worker (Recommended for Free)

**Cost**: FREE (750 hours/month)
**Effort**: One-time setup

### How It Works
1. Deploy scraper to Render as background worker
2. Runs `scheduler.py` continuously
3. Scrapes every 6 hours automatically

### Setup Steps

1. **Go to Render Dashboard**
   - https://dashboard.render.com

2. **Create Background Worker**
   - Click "New +" → "Background Worker"
   - Connect your GitHub repository

3. **Configure**:
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

4. **Add Environment Variables**:
   ```
   MONGODB_URI = <your-mongodb-uri>
   SCRAPE_INTERVAL_HOURS = 6
   ```

5. **Deploy**
   - Click "Create Background Worker"
   - Wait for deployment (~2-3 minutes)

6. **Verify**
   - Check logs: Should see "SCRAPER SCHEDULER STARTED"
   - Should run scraper immediately
   - Then every 6 hours

### Pros
- ✅ Completely automated
- ✅ Runs 24/7
- ✅ Free tier available
- ✅ Easy to monitor via logs

### Cons
- ⚠️ Uses your 750 free hours (but enough for 24/7)
- ⚠️ May slow down if backend also on free tier

### Monitoring
Check Render logs to see scraper runs:
```
2026-01-11 10:00:00 - SCHEDULED SCRAPER RUN
2026-01-11 10:00:05 - [OK] TimeOut: 15 events scraped
2026-01-11 10:00:10 - [OK] Eventbrite: 23 events scraped
2026-01-11 10:00:15 - [OK] Scraper job completed successfully
```

---

## Option 3: Scheduled Task on Your Computer (Automated Local)

**Cost**: FREE
**Effort**: One-time setup

### For Windows (Task Scheduler)

1. **Create Batch File** (`scraper/run_scraper.bat`):
   ```batch
   @echo off
   cd /d "d:\web d\projects\Louderx\scraper"
   python run_scraper.py
   pause
   ```

2. **Open Task Scheduler**:
   - Windows Search → "Task Scheduler"

3. **Create Task**:
   - Action → Create Basic Task
   - Name: "Sydney Events Scraper"
   - Trigger: Daily
   - Time: 6:00 AM
   - Action: Start a program
   - Program: `d:\web d\projects\Louderx\scraper\run_scraper.bat`

4. **Repeat Every 6 Hours**:
   - Edit task → Triggers tab
   - Edit trigger → Advanced settings
   - Repeat task every: 6 hours
   - For a duration of: 1 day
   - Check "Enabled"

### Pros
- ✅ Free
- ✅ Automated on your computer
- ✅ Full control

### Cons
- ❌ Computer must stay on
- ❌ Doesn't run when computer is off
- ❌ Only works when logged in

---

## Option 4: External Cron Service (Cloud Automation)

**Cost**: FREE (most services)
**Effort**: Medium setup

### Using cron-job.org (Recommended)

1. **Create API Endpoint in Backend** (if not exists)
   
   Add to `backend/src/app.js`:
   ```javascript
   app.post('/api/trigger-scraper', (req, res) => {
       // Trigger scraper via webhook
       res.json({ message: 'Scraper triggered' });
   });
   ```

2. **Sign up at cron-job.org**:
   - https://cron-job.org
   - Free account: 50 jobs

3. **Create Cron Job**:
   - Title: "Sydney Events Scraper"
   - URL: `https://your-backend.onrender.com/api/trigger-scraper`
   - Schedule: Every 6 hours
   - Method: POST

### Pros
- ✅ Free
- ✅ Runs 24/7
- ✅ No local resources needed

### Cons
- ❌ Requires API endpoint modification
- ❌ More complex setup
- ❌ Depends on third-party service

---

## Option 5: GitHub Actions (Free CI/CD)

**Cost**: FREE (2000 minutes/month)
**Effort**: Medium-high setup

### Setup

1. Create `.github/workflows/scraper.yml`:
   ```yaml
   name: Run Scraper
   
   on:
     schedule:
       - cron: '0 */6 * * *'  # Every 6 hours
     workflow_dispatch:  # Manual trigger
   
   jobs:
     scrape:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-python@v4
           with:
             python-version: '3.10'
         - name: Install dependencies
           run: |
             cd scraper
             pip install -r requirements.txt
         - name: Run scraper
           env:
             MONGODB_URI: ${{ secrets.MONGODB_URI }}
           run: |
             cd scraper
             python run_scraper.py
   ```

2. Add Secret in GitHub:
   - Repo → Settings → Secrets → New secret
   - Name: `MONGODB_URI`
   - Value: Your MongoDB URI

### Pros
- ✅ Free
- ✅ Runs in cloud
- ✅ Version controlled
- ✅ Easy to modify schedule

### Cons
- ❌ More complex setup
- ❌ Limited to 2000 minutes/month
- ❌ Cold start every time

---

## Comparison Table

| Option | Cost | Automation | Setup | Best For |
|--------|------|------------|-------|----------|
| Manual | FREE | ❌ Manual | Easy | Testing |
| Render Worker | FREE | ✅ 24/7 | Easy | **Production** |
| Task Scheduler | FREE | ✅ Local | Medium | Personal |
| Cron Service | FREE | ✅ Cloud | Medium | Alternative |
| GitHub Actions | FREE | ✅ Cloud | Hard | CI/CD fans |

---

## My Recommendation for You

**Use Option 2: Render Background Worker**

### Why?
1. **Completely free** (same tier as backend)
2. **Easiest to set up** (5 minutes)
3. **Fully automated** (no computer needed)
4. **Easy to monitor** (real-time logs)
5. **Same platform** as your backend

### Quick Setup (5 minutes)

1. Go to https://dashboard.render.com
2. Click "New +" → "Background Worker"
3. Select your repository
4. Configure:
   - Root: `scraper`
   - Build: `pip install -r requirements.txt`
   - Start: `python scheduler.py`
5. Add environment variable: `MONGODB_URI`
6. Click "Create"

Done! Your scraper will run every 6 hours automatically.

---

## Alternative: Run Locally for Now

If you want to start simple:

1. **Run manually when needed**:
   ```bash
   cd scraper
   python run_scraper.py
   ```

2. **Set a reminder** on your phone:
   - Run scraper every morning
   - Takes 1 minute

3. **Upgrade later** to Render when you want automation

---

## Monitoring Your Scraper

### Render Dashboard
- Real-time logs
- See each scraper run
- Error notifications

### MongoDB Atlas
- Check events collection
- See new events being added
- Monitor `last_updated` field

### Your Frontend
- Visit your site
- See updated events
- Check event timestamps

---

## Troubleshooting

### Scraper Not Running
1. Check Render logs
2. Verify `MONGODB_URI` is set
3. Check Python dependencies installed

### No New Events
1. Check scraper ran successfully
2. Verify websites haven't changed structure
3. Check `is_active` field in database
4. Look for errors in logs

### Memory/CPU Issues on Free Tier
1. Reduce scraper frequency (12 hours instead of 6)
2. Scrape fewer sources
3. Add delays between requests

---

## Next Steps

1. **Choose your option** (I recommend Render)
2. **Deploy scraper**
3. **Monitor first few runs**
4. **Verify events updating**
5. **Set it and forget it!** ✨

Need help with deployment? Let me know!
