# System Workflow Documentation

## Overview

The Sydney Events Aggregator is an automated system that scrapes event data from multiple Sydney-based websites, stores it in a database, and displays it through a web interface. This document explains how all components work together.

---

## System Architecture

```
┌─────────────────┐
│  Event Websites │
│  (External)     │
└────────┬────────┘
         │
         │ Scrape (every 6 hours)
         ▼
┌─────────────────┐
│  Web Scrapers   │
│  (Python)       │
└────────┬────────┘
         │
         │ Insert/Update
         ▼
┌─────────────────┐
│   MongoDB       │
│   Database      │
└────────┬────────┘
         │
         │ Query
         ▼
┌─────────────────┐
│  Backend API    │
│  (Express.js)   │
└────────┬────────┘
         │
         │ HTTP Requests
         ▼
┌─────────────────┐
│   Frontend      │
│   (HTML/JS)     │
└────────┬────────┘
         │
         │ User Interaction
         ▼
┌─────────────────┐
│     Users       │
└─────────────────┘
```

---

## Component Workflows

### 1. Event Scraping Workflow

**Frequency**: Every 6 hours (automated)

**Process**:
1. Scheduler triggers `run_scraper.py`
2. For each configured source (TimeOut, Eventbrite, What's On):
   - Fetch webpage
   - Parse HTML for event information
   - Extract: title, date, location, description, image, ticket URL
3. Generate unique hash for each event (title + date + location)
4. Remove duplicates within scraped data
5. Filter out past events
6. Save to MongoDB:
   - If event_hash exists: Update last_updated timestamp
   - If new: Insert event document
7. Log results and errors

**Files Involved**:
- `scraper/scheduler.py` - Automation
- `scraper/run_scraper.py` - Main orchestrator
- `scraper/sources/sydney_events.py` - Scraper implementations
- `scraper/utils/date_parser.py` - Date handling
- `scraper/utils/deduplicate.py` - Duplicate prevention

---

### 2. Database Workflow

**MongoDB Collections**:

**Events Collection**:
```javascript
{
  _id: ObjectId,
  title: String,
  date: Date,
  location: String,
  description: String,
  image_url: String,
  ticket_url: String,
  source: String,
  is_active: Boolean,
  event_hash: String (unique),
  last_updated: Date
}
```

**Emails Collection**:
```javascript
{
  _id: ObjectId,
  email: String,
  event_id: ObjectId (ref: Event),
  consent: Boolean,
  timestamp: Date,
  ip_address: String,
  user_agent: String
}
```

**Indexes**:
- `event_hash` (unique)
- `date` (for upcoming queries)
- `is_active` (for filtering)
- `email + event_id` (compound, unique)

---

### 3. Backend API Workflow

**Server Startup**:
1. Load environment variables from `.env`
2. Connect to MongoDB
3. Initialize Express app with middleware:
   - Helmet (security headers)
   - CORS (cross-origin requests)
   - Body parser (JSON/URL-encoded)
   - Morgan (request logging)
4. Mount API routes
5. Start listening on PORT

**Request Flow**:
```
Client Request
    ↓
CORS Check
    ↓
Route Matching
    ↓
Validation Middleware (if POST)
    ↓
Controller Handler
    ↓
Database Query
    ↓
Response Formatting
    ↓
Error Handler (if error)
    ↓
Client Response
```

**Key Endpoints**:
- `GET /api/events` - All active events
- `GET /api/events/upcoming` - Future events only
- `GET /api/events/search?q=query` - Search events
- `POST /api/subscribe` - Email subscription

---

### 4. Frontend Workflow

**Page Load**:
1. Load HTML structure
2. Load CSS styles
3. Execute JavaScript modules:
   - api.js - Initialize API service
   - app.js - Fetch and render events
   - filters.js - Set up filter listeners
   - modal.js - Initialize modal handlers

**Event Display Flow**:
```
Page Load
    ↓
Show Loading Spinner
    ↓
Fetch Events from API
    ↓
Populate Location Filter
    ↓
Render Event Cards
    ↓
Hide Loading Spinner
    ↓
Enable Filters
```

**Filter Flow**:
```
User Types/Selects Filter
    ↓
Filter Change Event
    ↓
Apply Filter Logic
    ↓
Filter allEvents Array
    ↓
Re-render Event Grid
    ↓
Update Event Count
```

**Email Subscription Flow**:
```
User Clicks "Get Tickets"
    ↓
Store Current Event
    ↓
Open Modal
    ↓
User Enters Email + Consent
    ↓
Validate Form
    ↓
POST to /api/subscribe
    ↓
Close Modal
    ↓
Redirect to Ticket URL
```

---

## Data Flow Examples

### Example 1: New Event Scraped

1. **Scraper** finds new event on TimeOut Sydney
2. **Scraper** creates event object with hash
3. **MongoDB** receives insert request
4. **MongoDB** stores event (is_active: true)
5. **Backend API** can now serve this event
6. **Frontend** fetches and displays event
7. **User** sees event in grid

### Example 2: User Subscribes to Event

1. **User** clicks "Get Tickets" on event card
2. **Frontend** opens email modal
3. **User** enters email and checks consent
4. **Frontend** validates input
5. **Frontend** sends POST to /api/subscribe
6. **Backend** validates request
7. **Backend** checks for duplicate subscription
8. **MongoDB** stores email subscription
9. **Backend** returns success
10. **Frontend** redirects to ticket URL

### Example 3: Expired Event Cleanup

1. **Scheduler** runs daily cleanup job
2. **Cleanup** finds events with date < now
3. **MongoDB** updates is_active = false
4. **Backend** excludes inactive events from queries
5. **Frontend** no longer displays expired events

---

## Error Handling

### Scraper Errors
- **Network failure**: Retry 3 times with delays
- **Parse error**: Log error, skip event, continue
- **Database error**: Log and alert

### API Errors
- **Invalid input**: 400 Bad Request with details
- **Not found**: 404 with helpful message
- **Database error**: 500 Internal Server Error
- **Validation error**: 400 with field-specific errors

### Frontend Errors
- **API unavailable**: Show error state with retry button
- **Empty results**: Show "no events found" message
- **Invalid form**: Show inline error messages

---

## Automation Schedule

| Task | Frequency | Purpose |
|------|-----------|---------|
| Run Scraper | Every 6 hours | Keep events fresh |
| Cleanup Expired | Daily at 2 AM | Mark old events inactive |
| Database Backup | Weekly (manual) | Data protection |
| Dependency Updates | Monthly | Security patches |

---

## Security Measures

1. **Input Validation**:
   - Email regex validation
   - MongoDB ObjectId validation
   - Query parameter sanitization

2. **Database Security**:
   - Unique indexes prevent duplicates
   - Schema validation on models
   - No raw query execution

3. **API Security**:
   - CORS configured for specific origins
   - Helmet.js security headers
   - Error messages don't leak sensitive data

4. **Frontend Security**:
   - HTML escaping (XSS prevention)
   - No eval() or innerHTML with user data
   - HTTPS in production

---

## Monitoring & Logging

### Logs Generated
- **Scraper**: `scraper_scheduler.log`
  - Scraping results
  - Errors encountered
  - Events processed

- **Backend**: Console output (Morgan middleware)
  - HTTP requests
  - Response times
  - Errors

### Metrics to Monitor
- Events count over time
- Scraper success rate
- API response times
- Email subscription rate
- Error frequency

---

## Troubleshooting

### Events Not Displaying
1. Check backend server is running
2. Verify MongoDB connection
3. Check API endpoint in browser
4. Review browser console for errors

### Scraper Not Working
1. Check scraper logs
2. Verify website structure hasn't changed
3. Test MongoDB connection
4. Check Python dependencies

### Email Subscriptions Failing
1. Verify backend API is accessible
2. Check MongoDB emails collection
3. Review validation errors
4. Check CORS configuration

---

## Development Workflow

### Adding New Event Source

1. Create new scraper class in `scraper/sources/`
2. Extend `BaseScraper` class
3. Implement `scrape()` method
4. Add to `ScraperRunner` in `run_scraper.py`
5. Test with `test_integration.py`

### Adding New API Endpoint

1. Add route in `backend/src/routes/`
2. Create controller in `backend/src/controllers/`
3. Add validation if needed
4. Update API documentation
5. Test with `testAPI.js`

### Updating Frontend

1. Modify HTML structure if needed
2. Update CSS styles
3. Add JavaScript logic
4. Test in multiple browsers
5. Verify mobile responsiveness

---

## Deployment Workflow

1. **Prepare**:
   - Update environment variables
   - Build production bundle (if needed)
   - Run all tests

2. **Deploy Backend**:
   - Push to hosting (Render/Railway)
   - Set environment variables
   - Wait for deployment
   - Test health endpoint

3. **Deploy Frontend**:
   - Update API URLs
   - Push to hosting (Vercel/Netlify)
   - Verify deployment
   - Test end-to-end

4. **Deploy Scraper**:
   - Set up as background worker
   - Configure environment
   - Test first run
   - Monitor logs

5. **Verify**:
   - Check all endpoints
   - Test email subscription
   - Monitor for 24 hours

---

## Maintenance Tasks

### Daily
- Check scraper logs
- Monitor error rates

### Weekly
- Review event quality
- Check database size
- Review subscriptions

### Monthly
- Update dependencies
- Review and optimize queries
- Backup database
- Security audit

---

## Future Enhancements

Potential improvements documented in `project-phases.md` Phase 14:
- Email notifications
- Advanced filtering
- User accounts
- Analytics dashboard
- Mobile app
- Admin panel
