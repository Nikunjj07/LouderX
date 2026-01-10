# Sydney Events Aggregator - API Documentation

Base URL: `http://localhost:5000/api`

## Overview

The Sydney Events Aggregator API provides endpoints for accessing Sydney event information and managing email subscriptions. All endpoints return JSON responses.

## Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10  // For list endpoints
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

---

## Authentication

Currently, all endpoints are public and do not require authentication.

---

## Events Endpoints

### Get All Active Events

Retrieves all active events from the database.

**Endpoint:** `GET /api/events`

**Response:**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "title": "Sydney Festival 2026",
      "date": "2026-01-15T19:00:00.000Z",
      "location": "Sydney Opera House",
      "description": "Join us for the opening night...",
      "image_url": "https://example.com/sydney-festival.jpg",
      "ticket_url": "https://sydneyfestival.org.au/tickets",
      "source": "sydneyfestival.org.au",
      "is_active": true,
      "last_updated": "2026-01-10T12:00:00.000Z"
    }
  ]
}
```

---

### Get Upcoming Events

Retrieves only events scheduled for future dates.

**Endpoint:** `GET /api/events/upcoming`

**Response:** Same format as Get All Events, but filtered for future dates.

---

### Get Event by ID

Retrieves a single event by its unique identifier.

**Endpoint:** `GET /api/events/:id`

**Parameters:**
- `id` (required) - MongoDB ObjectId of the event

**Success Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "title": "Sydney Festival 2026",
    ...
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Event not found"
}
```

**Error Response (400 - Invalid ID):**
```json
{
  "success": false,
  "message": "Invalid event ID format"
}
```

---

### Get Events by Source

Retrieves events from a specific source website.

**Endpoint:** `GET /api/events/source/:source`

**Parameters:**
- `source` (required) - Source website identifier (e.g., "sydneyfestival.org.au")

**Response:**
```json
{
  "success": true,
  "count": 3,
  "source": "sydneyfestival.org.au",
  "data": [ ... ]
}
```

---

### Get Events by Date Range

Retrieves events within a specified date range.

**Endpoint:** `GET /api/events/range?start=YYYY-MM-DD&end=YYYY-MM-DD`

**Query Parameters:**
- `start` (required) - Start date in YYYY-MM-DD format
- `end` (required) - End date in YYYY-MM-DD format

**Example:** `/api/events/range?start=2026-05-01&end=2026-05-31`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "dateRange": {
    "start": "2026-05-01",
    "end": "2026-05-31"
  },
  "data": [ ... ]
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Please provide both start and end dates"
}
```

---

### Search Events

Search events by title, location, or description.

**Endpoint:** `GET /api/events/search?q=searchterm`

**Query Parameters:**
- `q` (required) - Search query string

**Example:** `/api/events/search?q=festival`

**Response:**
```json
{
  "success": true,
  "count": 3,
  "query": "festival",
  "data": [ ... ]
}
```

---

### Get Event Statistics

Retrieves statistics about events in the database.

**Endpoint:** `GET /api/events/stats`

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 10,
    "active": 8,
    "upcoming": 6,
    "sources": 5,
    "sourcesList": [
      "sydneyfestival.org.au",
      "vividsydney.com",
      "nye.sydney.com"
    ]
  }
}
```

---

## Email Subscription Endpoints

### Subscribe to Event

Subscribe an email address to receive notifications for an event.

**Endpoint:** `POST /api/subscribe`

**Request Body:**
```json
{
  "email": "user@example.com",
  "eventId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "consent": true
}
```

**Validation Rules:**
- `email` - Must be a valid email address (required)
- `eventId` - Must be a valid MongoDB ObjectId (required)
- `consent` - Must be `true` (required)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Email subscription successful",
  "data": {
    "email": "user@example.com",
    "event": "Sydney Festival 2026",
    "timestamp": "2026-01-10T12:30:00.000Z"
  }
}
```

**Error Response (400 - Already Subscribed):**
```json
{
  "success": false,
  "message": "You are already subscribed to this event"
}
```

**Error Response (404 - Event Not Found):**
```json
{
  "success": false,
  "message": "Event not found"
}
```

**Error Response (400 - Validation):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    }
  ]
}
```

---

### Get Subscription Statistics

Retrieves statistics about email subscriptions.

**Endpoint:** `GET /api/subscribe/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSubscriptions": 25,
    "uniqueEmails": 15,
    "totalEvents": 6,
    "averageSubscriptionsPerEvent": "4.17"
  }
}
```

---

### Check Subscription Status

Check if an email is subscribed to a specific event.

**Endpoint:** `GET /api/subscribe/check?email=user@example.com&eventId=65a1b2c3d4e5f6g7h8i9j0k1`

**Query Parameters:**
- `email` (required) - Email address to check
- `eventId` (required) - Event ID to check

**Response:**
```json
{
  "success": true,
  "isSubscribed": true,
  "subscription": {
    "timestamp": "2026-01-10T12:30:00.000Z",
    "isRecent": true
  }
}
```

---

### Get Subscriptions by Event

Retrieves all email subscriptions for a specific event.

**Endpoint:** `GET /api/subscribe/event/:eventId`

**Parameters:**
- `eventId` (required) - MongoDB ObjectId of the event

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "email": "user1@example.com",
      "event_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "consent": true,
      "timestamp": "2026-01-10T12:30:00.000Z"
    }
  ]
}
```

---

### Get Subscriptions by User

Retrieves all event subscriptions for a specific email address.

**Endpoint:** `GET /api/subscribe/user/:email`

**Parameters:**
- `email` (required) - User's email address

**Response:**
```json
{
  "success": true,
  "count": 3,
  "email": "user@example.com",
  "data": [
    {
      "_id": "...",
      "email": "user@example.com",
      "event_id": {
        "_id": "...",
        "title": "Sydney Festival 2026",
        "date": "2026-01-15T19:00:00.000Z"
      },
      "consent": true,
      "timestamp": "2026-01-10T12:30:00.000Z"
    }
  ]
}
```

---

## Health Check

### API Health Status

Check if the API is running and healthy.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "OK",
  "message": "Sydney Events Aggregator API is running",
  "timestamp": "2026-01-10T12:00:00.000Z",
  "environment": "development"
}
```

---

## API Information

### Get API Info

Retrieves information about available endpoints.

**Endpoint:** `GET /api`

**Response:**
```json
{
  "message": "Sydney Events Aggregator API",
  "version": "1.0.0",
  "endpoints": {
    "events": {
      "GET /api/events": "Get all active events",
      "GET /api/events/:id": "Get event by ID",
      "GET /api/events/upcoming": "Get upcoming events"
    },
    "subscriptions": {
      "POST /api/subscribe": "Subscribe to event notifications",
      "GET /api/subscribe/stats": "Get subscription statistics"
    },
    "health": {
      "GET /health": "Check API health status"
    }
  },
  "documentation": "/api-docs"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

Currently, there is no rate limiting implemented. This may be added in future versions.

---

## CORS

CORS is enabled for all origins in development. In production, configure `FRONTEND_URL` in `.env` to restrict access.

---

## Examples

### JavaScript/Fetch Example

```javascript
// Get all events
fetch('http://localhost:5000/api/events')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Subscribe to event
fetch('http://localhost:5000/api/subscribe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    eventId: '65a1b2c3d4e5f6g7h8i9j0k1',
    consent: true
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### cURL Examples

```bash
# Get all events
curl http://localhost:5000/api/events

# Get upcoming events
curl http://localhost:5000/api/events/upcoming

# Search events
curl "http://localhost:5000/api/events/search?q=festival"

# Subscribe to event
curl -X POST http://localhost:5000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "eventId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "consent": true
  }'

# Check subscription
curl "http://localhost:5000/api/subscribe/check?email=user@example.com&eventId=65a1b2c3d4e5f6g7h8i9j0k1"
```

---

## Testing the API

### Using the Test Script

Run the complete API test suite:

```bash
cd backend
npm run test:api
```

### Manual Testing

1. Start the server:
   ```bash
   npm run dev
   ```

2. Test endpoints using:
   - Browser (for GET requests)
   - Postman
   - Thunder Client (VS Code extension)
   - cURL commands

---

## Support

For issues or questions:
1. Check error messages in API responses
2. Review server logs
3. Ensure MongoDB is running
4. Verify environment variables in `.env`

---

**Last Updated:** January 2026  
**API Version:** 1.0.0
