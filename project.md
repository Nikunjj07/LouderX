Sydney Events Aggregator
Automated Event Scraping and Web Display System
1. Introduction

The Sydney Events Aggregator is a web-based application that automatically collects event information from multiple Sydney-based event listing websites and displays them on a single, clean, and user-friendly platform.

The system continuously updates event listings as new events are published on the original websites. Users can browse events, view details, and click a GET TICKETS button, which captures their email (with consent) before redirecting them to the official ticket provider.

2. Objective

The main objectives of this project are:

To automatically scrape and aggregate events occurring in Sydney, Australia

To display these events in a visually appealing web interface

To redirect users to official event websites for ticket booking

To ensure the system updates automatically without manual intervention

To use only open-source tools and technologies

3. System Overview

The system is divided into three independent layers:

Scraping Layer – Collects event data from external websites

Backend API Layer – Stores and serves event data

Frontend Layer – Displays events and handles user interactions

This separation ensures modularity, maintainability, and scalability.

4. End-to-End Workflow
Step 1: Event Scraping

A scraper periodically visits selected Sydney event websites

Event details such as title, date, location, description, and ticket link are extracted

Data is cleaned and formatted

Duplicate events are detected and avoided

Step 2: Data Storage

Scraped data is stored in a database

New events are inserted

Existing events are updated

Expired events can be marked inactive

Step 3: Backend API

The backend exposes REST APIs to:

Fetch all active events

Store user email subscriptions

The frontend communicates only with the backend, not directly with the scraper

Step 4: Frontend Display

Events are fetched from the backend API

Events are displayed as cards with details

Each event includes a GET TICKETS button

Step 5: Email Capture & Redirect

User clicks GET TICKETS

Email input popup appears with consent checkbox

Email is stored in the database

User is redirected to the official event website

Step 6: Automatic Updates

The scraper runs on a scheduled basis

Newly published events appear automatically

Manual updates are not required

5. Architecture Diagram (Conceptual)
[ Event Websites ]
        ↓
[ Scraper Scripts ]
        ↓
[ Database ]
        ↓
[ Backend API ]
        ↓
[ Frontend Website ]
        ↓
[ User → Email Capture → Redirect ]

6. Technology Stack (Open-Source)
Scraping Layer

Python

Requests

BeautifulSoup

lxml

Backend Layer

Node.js

Express.js

Database

MongoDB (NoSQL)

Frontend

HTML

CSS

JavaScript (Vanilla / React optional)

Automation

Cron Jobs / node-cron

Deployment (Optional)

Render / Railway / Vercel

7. Directory Structure
event-aggregator/
│
├── scraper/
│   ├── sources/
│   │   └── sydney_events.py
│   ├── utils/
│   │   ├── date_parser.py
│   │   └── deduplicate.py
│   ├── run_scraper.py
│   └── requirements.txt
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── events.controller.js
│   │   │   └── email.controller.js
│   │   ├── routes/
│   │   │   ├── events.routes.js
│   │   │   └── email.routes.js
│   │   ├── models/
│   │   │   ├── Event.js
│   │   │   └── Email.js
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventCard.js
│   │   │   └── EmailModal.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── main.css
│   │   └── main.js
│   └── package.json
│
├── docs/
│   ├── workflow.md
│   └── api-docs.md
│
├── .env
└── README.md

8. Database Design
Events Collection
Field	Description
title	Event name
date	Event date & time
location	Venue/location
description	Event description
image_url	Event image
ticket_url	Original ticket link
source	Source website
is_active	Event status
last_updated	Last scrape timestamp
Emails Collection
Field	Description
email	User email address
event_id	Associated event
consent	User consent flag
timestamp	Submission time
9. API Endpoints
Fetch Events
GET /api/events


Returns all active events.

Save Email Subscription
POST /api/subscribe


Body:

{
  "email": "user@example.com",
  "eventId": "12345"
}

10. Automation Strategy

Scraper runs automatically every 6–12 hours

Implemented using cron jobs or node-cron

Prevents duplicate entries

Ensures real-time event updates

11. Ethical & Legal Considerations

Only public event data is scraped

No copyrighted ticketing logic is copied

User email is collected with explicit consent

Users are redirected to official ticket providers

12. Challenges & Solutions
Challenge	Solution
Duplicate events	Hash-based comparison
Changing website structure	Modular scraper design
Data inconsistency	Normalization utilities
Frequent updates	Scheduled scraping
13. Future Enhancements

Multiple event sources

Event filtering and search

Email notifications for new events

Admin dashboard

Analytics tracking

14. Conclusion

The Sydney Events Aggregator successfully demonstrates the use of open-source tools to build a real-world data aggregation system. By combining automated scraping, a clean backend API, and an interactive frontend, the project fulfills all assignment requirements while maintaining scalability and ethical data usage.