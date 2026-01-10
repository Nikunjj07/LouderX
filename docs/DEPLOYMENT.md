# Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- MongoDB Atlas account (or cloud MongoDB instance)
- Hosting platform account (Render, Railway, Vercel, etc.)
- Domain name (optional)

## Configuration

### 1. Environment Variables

Create production `.env` file with:

```env
# Backend
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/sydney-events
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

# Scraper
SCRAPE_INTERVAL_HOURS=6
```

### 2. Update Frontend API URL

In `frontend/js/api.js`, update:
```javascript
const API_BASE_URL = 'https://your-backend-domain.com/api';
```

## Backend Deployment

### Option 1: Render

1. Create new Web Service
2. Connect GitHub repository
3. Configure:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
4. Add environment variables
5. Deploy

### Option 2: Railway

1. Create new project
2. Deploy from GitHub
3. Add environment variables
4. Configure root directory: `backend`
5. Deploy

## Frontend Deployment

### Option 1: Vercel

1. Create new project
2. Connect GitHub repository
3. Configure:
   - Framework: None
   - Root Directory: `frontend`
4. Deploy

### Option 2: Netlify

1. Create new site
2. Connect GitHub repository
3. Configure:
   - Base directory: `frontend`
   - Publish directory: `.`
4. Deploy

## Scraper Deployment

### Option 1: Cron Job Service

Use a cron job service like EasyCron or cron-job.org to trigger scraper:
- Set up HTTP endpoint in backend to trigger scraper
- Schedule every 6 hours

### Option 2: Background Worker

Deploy scraper as separate worker on Render/Railway:
- Build Command: `cd scraper && pip install -r requirements.txt`
- Start Command: `cd scraper && python scheduler.py`

## MongoDB Setup

### MongoDB Atlas

1. Create free cluster
2. Add database user
3. Whitelist IP addresses (0.0.0.0/0 for development)
4. Get connection string
5. Update MONGODB_URI

## Post-Deployment

### 1. Seed Database

On first deployment:
```bash
npm run seed
```

### 2. Test Endpoints

Verify:
- `GET /health` - Returns 200
- `GET /api/events` - Returns events
- `POST /api/subscribe` - Accepts subscriptions

### 3. Monitor

Set up monitoring for:
- Application uptime
- API response times
- Error rates
- Database connections

## Security Checklist

- [ ] Environment variables secured
- [ ] CORS configured correctly
- [ ] MongoDB authentication enabled
- [ ] Rate limiting implemented (optional)
- [ ] HTTPS enabled
- [ ] Input validation on all endpoints

## Maintenance

### Regular Tasks

- Monitor scraper logs
- Check database size
- Review error logs
- Update dependencies
- Backup database

### Scaling Considerations

As traffic grows:
- Add caching (Redis)
- Implement CDN for frontend
- Database indexing optimization
- Load balancing
