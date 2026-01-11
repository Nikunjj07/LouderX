# Frontend Environment Configuration

## For Local Development

The frontend uses `config.js` to manage environment-specific settings.

**Default (Development)**:
```javascript
API_BASE_URL: 'http://localhost:5000/api'
```

## For Vercel Deployment

### Option 1: Update config.js (Simplest)

Before deploying to Vercel, update `frontend/js/config.js`:

```javascript
const CONFIG = {
    API_BASE_URL: 'https://sydney-events-api.onrender.com/api',
    // ... rest of config
};
```

Then commit and push:
```bash
git add frontend/js/config.js
git commit -m "Update API URL for production"
git push
```

### Option 2: Use Vercel Environment Variables (Advanced)

1. **In Vercel Dashboard**:
   - Go to your project
   - Settings → Environment Variables
   - Add variable:
     - Name: `API_URL`
     - Value: `https://sydney-events-api.onrender.com/api`
     - Environment: Production

2. **Update config.js** to use Vercel's injected variable:
```javascript
const CONFIG = {
    API_BASE_URL: process.env.API_URL || 'http://localhost:5000/api',
};
```

**Note**: Static sites on Vercel don't directly support runtime environment variables. The simplest approach is Option 1.

## Testing Locally

1. **With local backend**:
   ```bash
   cd frontend
   npm start
   ```
   Opens at http://localhost:3000
   Uses http://localhost:5000/api

2. **With production backend**:
   Update `config.js` temporarily:
   ```javascript
   API_BASE_URL: 'https://sydney-events-api.onrender.com/api'
   ```
   Then start frontend

## Verification

After deployment, check browser console:
1. Open DevTools (F12)
2. Console tab
3. Should see: "Initializing Sydney Events Aggregator..."
4. Network tab should show requests to correct API URL

## Common Issues

**CORS Error**:
- Backend `FRONTEND_URL` must match your Vercel URL
- Update in Render environment variables

**404 on API calls**:
- Check `API_BASE_URL` is correct
- Verify backend is deployed and running
- Test backend URL directly: `https://your-api.com/api/events`
