# Deployment Checklist

## Pre-Deployment

### 1. Code Preparation
- [ ] All tests passing (backend, frontend, scraper)
- [ ] No console.log statements in production code
- [ ] Environment variables documented
- [ ] Dependencies up to date
- [ ] Code reviewed and approved
- [ ] Git repository clean (no uncommitted changes)

### 2. Database Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with strong password
- [ ] IP whitelist configured (0.0.0.0/0 or specific IPs)
- [ ] Connection string obtained
- [ ] Database seeded with initial data

### 3. Configuration Files
- [ ] Production .env files created
- [ ] API URLs updated for production
- [ ] CORS origins configured
- [ ] Security headers enabled

---

## Backend Deployment (Render/Railway)

### Initial Setup
- [ ] Create account on hosting platform
- [ ] Connect GitHub repository
- [ ] Select Node.js environment

### Configuration
- [ ] Set root directory to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Set Node version: 18.x or higher

### Environment Variables
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/sydney-events
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Post-Deployment
- [ ] Service deployed successfully
- [ ] Health endpoint accessible: `/health`
- [ ] API endpoints responding: `/api/events`
- [ ] No errors in logs

---

## Frontend Deployment (Vercel/Netlify)

### Initial Setup
- [ ] Create account on hosting platform
- [ ] Connect GitHub repository
- [ ] Select static site configuration

### Configuration
- [ ] Set root directory to `frontend`
- [ ] Build command: (none needed)
- [ ] Output directory: `.` or `frontend`

### Update API URL
In `frontend/js/api.js`:
```javascript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

### Post-Deployment
- [ ] Site deployed successfully
- [ ] Homepage loads correctly
- [ ] Events display properly
- [ ] Filters work
- [ ] Modal functionality works
- [ ] Mobile responsive

---

## Scraper Deployment

### Option A: Background Worker (Render/Railway)
- [ ] Create new service
- [ ] Set Type: Background Worker
- [ ] Root directory: `scraper`
- [ ] Build: `pip install -r requirements.txt`
- [ ] Start: `python scheduler.py`

### Option B: Serverless Function
- [ ] Create HTTP endpoint in backend
- [ ] Deploy scraper as function
- [ ] Use external cron service (cron-job.org)
- [ ] Schedule: Every 6 hours

### Environment Variables
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/sydney-events
SCRAPE_INTERVAL_HOURS=6
```

### Post-Deployment
- [ ] Scraper running
- [ ] Logs show successful runs
- [ ] Events being added to database
- [ ] No errors in logs

---

## DNS & Domain (Optional)

### If Using Custom Domain
- [ ] Domain purchased
- [ ] DNS configured
- [ ] A/CNAME records added
- [ ] SSL certificate provisioned (auto on most platforms)
- [ ] HTTPS working

---

## Security Configuration

### Backend
- [ ] NODE_ENV=production set
- [ ] CORS configured with production URL
- [ ] Helmet.js enabled
- [ ] Rate limiting considered
- [ ] No sensitive data in logs

### Database
- [ ] Strong password used
- [ ] Network access restricted
- [ ] Backup schedule configured
- [ ] Monitoring enabled

### Frontend
- [ ] API URLs use HTTPS
- [ ] No API keys exposed
- [ ] Content Security Policy considered

---

## Monitoring & Alerts

### Platform Monitoring
- [ ] Uptime monitoring enabled
- [ ] Error alerts configured
- [ ] Resource usage alerts set
- [ ] Deployment notifications enabled

### Application Monitoring
- [ ] Backend health checks working
- [ ] Database connection monitored
- [ ] Scraper success rate tracked
- [ ] API response times logged

### Recommended Tools
- [ ] Sentry (error tracking)
- [ ] UptimeRobot (uptime monitoring)
- [ ] MongoDB Atlas alerts
- [ ] Platform-native monitoring

---

## Testing Production

### Backend API Tests
- [ ] GET /health returns 200
- [ ] GET /api/events returns events
- [ ] GET /api/events/upcoming works
- [ ] POST /api/subscribe accepts valid data
- [ ] CORS working from frontend domain
- [ ] Error handling works

### Frontend Tests
- [ ] Page loads in <2 seconds
- [ ] Events display correctly
- [ ] Search filter works
- [ ] Date filter works
- [ ] Location filter works
- [ ] Email modal opens and submits
- [ ] Redirect to tickets works
- [ ] Mobile view works

### Integration Tests
- [ ] Frontend can fetch from backend
- [ ] Email subscriptions save to database
- [ ] Scraper adds events to database
- [ ] API serves scraped events

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari
- [ ] Mobile Chrome

---

## Performance Optimization

### Backend
- [ ] MongoDB indexes verified
- [ ] Response times <200ms
- [ ] Compression enabled
- [ ] Caching headers set

### Frontend
- [ ] Images optimized
- [ ] CSS minified (if applicable)
- [ ] JavaScript optimized
- [ ] First contentful paint <1.5s

---

## Documentation Updates

### Update URLs
- [ ] README.md with production URLs
- [ ] API docs with production endpoint
- [ ] User guide with live site URL

### Deployment Docs
- [ ] Document hosting platforms used
- [ ] Environment variables documented
- [ ] Backup procedures documented
- [ ] Rollback procedures documented

---

## Post-Launch

### Immediate (First 24 Hours)
- [ ] Monitor error logs continuously
- [ ] Check database growth
- [ ] Verify scraper runs
- [ ] Test all user flows
- [ ] Monitor performance metrics

### First Week
- [ ] Review analytics
- [ ] Check email subscriptions
- [ ] Monitor uptime
- [ ] Gather user feedback
- [ ] Fix any critical bugs

### Ongoing
- [ ] Weekly log reviews
- [ ] Monthly dependency updates
- [ ] Quarterly security audits
- [ ] Regular backups
- [ ] Performance optimization

---

## Rollback Plan

### If Issues Arise
1. Identify the problem
2. Check error logs
3. Verify environment variables
4. Test database connection
5. Roll back to previous deployment if needed

### Rollback Steps
- Hosting platforms usually have one-click rollback
- Restore database from backup if needed
- Update DNS if domain-related
- Notify users if extended downtime

---

## Success Criteria

### Deployment Successful When:
- [ ] All services running without errors
- [ ] Frontend accessible and functional
- [ ] Backend API responding correctly
- [ ] Database connected and accessible
- [ ] Scraper running on schedule
- [ ] All tests passing in production
- [ ] Monitoring and alerts working
- [ ] Performance metrics met
- [ ] No critical security issues

---

## Sign-Off

**Deployed By**: _______________  
**Date**: _______________  
**Backend URL**: _______________  
**Frontend URL**: _______________  
**Database**: _______________  
**Status**: _______________

---

## Maintenance Schedule

### Daily
- Monitor error logs
- Check scraper runs

### Weekly
- Review performance metrics
- Check database size
- Review subscriptions

### Monthly
- Update dependencies
- Security review
- Backup verification

### Quarterly
- Full system audit
- Performance optimization
- Feature review
