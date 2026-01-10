/**
 * 404 Not Found Middleware
 * Handles requests to undefined routes
 */

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;

    res.status(404).json({
        success: false,
        error: `Not Found - ${req.originalUrl}`,
        message: 'The requested resource does not exist',
        availableEndpoints: {
            events: '/api/events',
            subscribe: '/api/subscribe',
            health: '/health',
            apiInfo: '/api'
        }
    });
};

module.exports = notFound;
