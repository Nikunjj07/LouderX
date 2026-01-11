# LouderX – Sydney Events Aggregator  
### Project Architecture, Workflow & Design Documentation

**LouderX** is a web-based platform that automatically aggregates upcoming events in **Sydney, Australia**.  
It scrapes public event websites, stores event data in a centralized database, and displays them through a clean, user-friendly interface.

---

## 1. Key Features

-  Automated scraping of Sydney-based event websites  
-  Centralized event storage using MongoDB  
-  REST API built with Node.js and Express  
-  Clean, responsive frontend UI  
-  Email capture with user consent  
-  Scheduled updates to keep events fresh  

---

## 2. System Architecture

The application follows a **three-layer modular architecture**:

[ Event Websites ]
↓
[ Python Scraper ]
↓
[ MongoDB Database ]
↓
[ Backend API (Node.js) ]
↓
[ Frontend Website ]
↓
[ User → Email → Redirect ]


This separation makes the system easy to maintain, debug, and extend.

---

## 3. Workflow Overview

### Event Data Flow
1. Python scraper fetches event listing pages
2. HTML is parsed and cleaned
3. Event details are extracted
4. Duplicate events are detected using hashing
5. New events are inserted or existing ones updated in MongoDB

### User Interaction Flow
1. User visits the website
2. Frontend fetches events from backend API
3. Events are displayed as cards
4. User clicks **GET TICKETS**
5. Email is collected with consent
6. User is redirected to the original ticket website

---

## 4. Technology Stack

### Scraping
- Python  
- Requests  
- BeautifulSoup  
- lxml  

### Backend
- Node.js  
- Express.js  
- Mongoose  
- Helmet, CORS, Morgan  

### Database
- MongoDB Atlas  

### Frontend
- HTML  
- CSS  
- Vanilla JavaScript  

### Deployment
- Frontend: Vercel  
- Backend: Render  
- Database: MongoDB Atlas  
- Scraper: Render Cron Job / Local Scheduler  

---

## 5. Project Structure

louderx/
│
├── scraper/
│ ├── sources/ # Website-specific scrapers
│ ├── utils/ # Date parsing & deduplication
│ ├── run_scraper.py
│ └── requirements.txt
│
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ └── server.js
│
├── frontend/
│ ├── index.html
│ ├── css/
│ └── js/
│
├── .env
└── README.md


---

## 6. Automation Strategy

- Scraper runs automatically every **6–12 hours**
- Implemented using cron jobs
- Ensures new events appear without manual updates
- Expired events can be marked inactive

---

## 7. Database Design (Simplified)

### Events Collection
- title  
- date  
- location  
- description  
- image_url  
- ticket_url  
- source  
- is_active  
- last_updated  
- event_hash (for duplicate detection)

### Emails Collection
- email  
- event_id  
- consent  
- created_at  

---

## 8. API Endpoints (Core)

### Fetch Events
GET /api/events

### Subscribe & Redirect
POST /api/subscribe


---

## 9. Scraping Challenges & Solutions

### Inconsistent Website Structures  
Different event websites use different HTML layouts.

**Solution:**  
Each website has its own scraper module, with shared logic extracted into reusable utilities.

---

### Date & Time Format Variations  
Dates appear in multiple formats (e.g., “Jan 21”, “21 January”, “This Weekend”).

**Solution:**  
A date normalization utility converts all dates into a standard ISO format before storage.

---

### Duplicate Events  
The same event may appear multiple times across pages or scraping runs.

**Solution:**  
A unique hash is generated using event title, date, and location to prevent duplicates.

---

### Website Changes & Scraping Failures  
Minor HTML changes can break scrapers.

**Solution:**  
Scrapers are modular and include basic error handling so failures don’t stop the entire system.

---

### Ethical & Rate-Limiting Concerns  
Over-scraping can overload external servers.

**Solution:**  
Scraping frequency is limited, and only publicly available data is collected.

---

## 10. Development Approach

The project was built using an **incremental and modular approach**:

1. Selected easy-to-scrape Sydney event websites  
2. Built and tested the scraper first  
3. Designed the database schema based on scraped data  
4. Developed backend APIs  
5. Built frontend using mock data  
6. Integrated frontend with backend  
7. Added email capture and redirect logic  
8. Automated scraping and finalized documentation  

This approach reduced risk and simplified debugging.

---

## 11. Possible Improvements & Future Enhancements

### Scraping
- Add more event sources  
- Use headless browsers for JS-heavy sites  
- Detect and update only modified events  

### Backend
- Pagination and caching  
- Rate limiting  
- Admin dashboard  

### Frontend
- Event filters and search  
- Calendar-based event view  
- Improved accessibility and animations  

### Features
- Email notifications  
- Saved events  
- Analytics on clicks and subscriptions  

---

## 12. Ethical & Security Considerations

- Only public event data is scraped  
- No ticketing logic is copied  
- Emails are collected only with explicit consent  
- Users are redirected to official sources  
- Sensitive data is stored using environment variables  

---

## 13. Conclusion

LouderX demonstrates a complete full-stack system with automated data collection, clean API design, and a user-friendly frontend.  
The modular architecture ensures maintainability, scalability, and ethical data usage while fully meeting assignment requirements.

---
