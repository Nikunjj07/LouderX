# Sydney Events Aggregator

> Automated event scraping and web display system for Sydney-based events

## 📋 Overview

The Sydney Events Aggregator is a web-based application that automatically collects event information from multiple Sydney-based event listing websites and displays them on a single, clean, and user-friendly platform.

### Key Features
- ✅ Automatic event scraping from multiple Sydney event websites
- ✅ Continuous updates as new events are published
- ✅ Email capture with user consent before redirecting to ticket providers
- ✅ Clean, modular three-layer architecture
- ✅ All open-source technology stack

## 🏗️ Architecture

```
Event Websites → Scraper Scripts → Database → Backend API → Frontend → User
```

### Three-Layer System
1. **Scraping Layer** - Python-based scrapers using BeautifulSoup
2. **Backend API Layer** - Node.js + Express.js + MongoDB
3. **Frontend Layer** - HTML/CSS/JavaScript

## 🚀 Quick Start

### Prerequisites
- **Python** 3.8+ (for scraper)
- **Node.js** 16+ and npm (for backend & frontend)
- **MongoDB** 4.4+ (local or cloud instance)
- **Git** for version control

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd Louderx
```

#### 2. Set Up Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
# Update MongoDB URI, ports, and other settings
```

#### 3. Set Up Python Scraper
```bash
# Navigate to scraper directory
cd scraper

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

cd ..
```

#### 4. Set Up Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

cd ..
```

#### 5. Set Up Frontend
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

cd ..
```

#### 6. Set Up MongoDB

**Option A: Local MongoDB**
1. Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # Windows (as Administrator)
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```
3. Verify connection:
   ```bash
   mongo --eval "db.version()"
   ```

**Option B: MongoDB Atlas (Cloud)**
1. Sign up for free at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Get your connection string
5. Update `MONGODB_URI` in `.env` file:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sydney-events
   ```

## 🏃 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run at `http://localhost:5000`

### Start Frontend Server
```bash
cd frontend
npm run dev
```
Frontend will run at `http://localhost:8080` (or the port live-server assigns)

### Run Scraper (Manual)
```bash
cd scraper
# Activate virtual environment first
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux

# Run scraper
python run_scraper.py
```

## 📁 Project Structure

```
Louderx/
│
├── scraper/                  # Python web scraper
│   ├── sources/              # Event source scrapers
│   │   ├── __init__.py
│   │   └── sydney_events.py
│   ├── utils/                # Scraper utilities
│   │   ├── __init__.py
│   │   ├── date_parser.py
│   │   └── deduplicate.py
│   ├── run_scraper.py        # Main scraper script
│   └── requirements.txt      # Python dependencies
│
├── backend/                  # Node.js Express API
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   │   ├── events.controller.js
│   │   │   └── email.controller.js
│   │   ├── routes/           # API routes
│   │   │   ├── events.routes.js
│   │   │   └── email.routes.js
│   │   ├── models/           # MongoDB models
│   │   │   ├── Event.js
│   │   │   └── Email.js
│   │   ├── app.js            # Express app setup
│   │   └── server.js         # Server entry point
│   └── package.json
│
├── frontend/                 # Frontend web application
│   ├── public/
│   │   └── index.html        # Main HTML file
│   ├── src/
│   │   ├── components/       # UI components
│   │   │   ├── EventCard.js
│   │   │   └── EmailModal.js
│   │   ├── services/         # API services
│   │   │   └── api.js
│   │   ├── styles/           # CSS styles
│   │   │   └── main.css
│   │   └── main.js           # Main JS file
│   └── package.json
│
├── docs/                     # Documentation
│   ├── workflow.md
│   └── api-docs.md
│
├── .env.example              # Environment variables template
├── .gitignore
├── project.md                # Project specification
├── project-phases.md         # Development phases
└── README.md
```

## 🛠️ Technology Stack

### Scraping Layer
- **Python** 3.8+
- **Requests** - HTTP library
- **BeautifulSoup** - HTML parsing
- **lxml** - XML/HTML parser

### Backend Layer
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger

### Database
- **MongoDB** - NoSQL database

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling
- **JavaScript** - Interactivity
- **Live-server** - Development server

### Automation
- **node-cron** / System cron - Scheduled tasks

## 🗄️ Database Design

### Events Collection
| Field | Type | Description |
|-------|------|-------------|
| title | String | Event name |
| date | Date | Event date & time |
| location | String | Venue/location |
| description | String | Event description |
| image_url | String | Event image URL |
| ticket_url | String | Original ticket link |
| source | String | Source website |
| is_active | Boolean | Event status |
| last_updated | Date | Last scrape timestamp |

### Emails Collection
| Field | Type | Description |
|-------|------|-------------|
| email | String | User email address |
| event_id | ObjectId | Associated event reference |
| consent | Boolean | User consent flag |
| timestamp | Date | Submission time |

## 🔌 API Endpoints

### GET /api/events
Fetch all active events

**Response:**
```json
[
  {
    "_id": "...",
    "title": "Sydney Festival 2026",
    "date": "2026-01-15T19:00:00.000Z",
    "location": "Sydney Opera House",
    "description": "...",
    "image_url": "...",
    "ticket_url": "...",
    "source": "sydneyfestival.com",
    "is_active": true
  }
]
```

### POST /api/subscribe
Save email subscription

**Request Body:**
```json
{
  "email": "user@example.com",
  "eventId": "65a1b2c3d4e5f6g7h8i9j0k1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email saved successfully"
}
```

## 🤖 Automation

The scraper runs automatically every 6-12 hours using scheduled tasks:
- Fetches latest events from configured sources
- Updates database with new events
- Marks expired events as inactive
- Prevents duplicate entries

## 🔒 Security & Ethics

- ✅ Only public event data is scraped
- ✅ No copyrighted content is duplicated
- ✅ User emails collected with explicit consent
- ✅ Users redirected to official ticket providers
- ✅ Input validation and sanitization
- ✅ CORS and Helmet security middleware

## 📈 Development Phases

The project is divided into 14 phases. See [project-phases.md](project-phases.md) for detailed breakdown.

### Current Progress
- ✅ **Phase 1**: Project Setup & Environment Configuration (COMPLETED)
- ⏳ **Phase 2**: Database Design & Setup (NEXT)

## 🧪 Testing

```bash
# Backend tests (to be implemented)
cd backend
npm test

# Scraper tests (to be implemented)
cd scraper
pytest
```

## 🚀 Deployment

Recommended platforms:
- **Backend & Scraper**: Railway, Render, or Heroku
- **Frontend**: Vercel, Netlify, or GitHub Pages
- **Database**: MongoDB Atlas (cloud)

Deployment guide will be added in Phase 12.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open-source and available under the MIT License.

## 🔮 Future Enhancements

- [ ] Advanced event filtering (category, price range, date)
- [ ] Search functionality
- [ ] Email notifications for new events
- [ ] Admin dashboard for event management
- [ ] User accounts and saved events
- [ ] Event recommendations algorithm
- [ ] Analytics dashboard
- [ ] Social media integration
- [ ] Calendar view
- [ ] Map view for event locations

## 📧 Contact

For questions or suggestions, please open an issue in the repository.

---

**Built with ❤️ using open-source technologies**
