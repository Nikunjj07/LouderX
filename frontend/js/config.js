/**
 * Frontend Configuration
 * This file contains environment-specific settings
 */

// Configuration object
const CONFIG = {
    // API Base URL - Change this based on environment
    // Development: 'http://localhost:5000/api'
    // Production: Set via Vercel environment variables or update manually
    API_BASE_URL: window.ENV?.API_URL || 'http://localhost:5000/api',

    // Other configuration options
    APP_NAME: 'Sydney Events Aggregator',
    VERSION: '1.0.0',

    // Feature flags
    ENABLE_ANALYTICS: false,
    ENABLE_ERROR_TRACKING: false,
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);
