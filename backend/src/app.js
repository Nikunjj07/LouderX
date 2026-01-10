const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const eventRoutes = require('./routes/events.routes');
const emailRoutes = require('./routes/email.routes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Create Express app
const app = express();

// Security Middleware
app.use(helmet()); // Adds security headers

// CORS Configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // Detailed logging in development
} else {
    app.use(morgan('combined')); // Standard Apache combined log in production
}

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Sydney Events Aggregator API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/subscribe', emailRoutes);

// API Documentation Endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'Sydney Events Aggregator API',
        version: '1.0.0',
        endpoints: {
            events: {
                'GET /api/events': 'Get all active events',
                'GET /api/events/:id': 'Get event by ID',
                'GET /api/events/upcoming': 'Get upcoming events'
            },
            subscriptions: {
                'POST /api/subscribe': 'Subscribe to event notifications',
                'GET /api/subscribe/stats': 'Get subscription statistics'
            },
            health: {
                'GET /health': 'Check API health status'
            }
        },
        documentation: '/api-docs'
    });
});

// 404 Handler - Must be after all routes
app.use(notFound);

// Error Handler - Must be last
app.use(errorHandler);

module.exports = app;
