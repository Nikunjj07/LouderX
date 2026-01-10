const app = require('./app');
const { connectDB } = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start Express server
        const server = app.listen(PORT, () => {
            console.log('═════════════════════════════════════════════════════════');
            console.log(`🚀 Sydney Events Aggregator API`);
            console.log('═════════════════════════════════════════════════════════');
            console.log(`📡 Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 API Base URL: http://localhost:${PORT}`);
            console.log(`💚 Health Check: http://localhost:${PORT}/health`);
            console.log(`📚 API Info: http://localhost:${PORT}/api`);
            console.log('═════════════════════════════════════════════════════════');
            console.log('✅ Server is ready to accept requests');
            console.log('═════════════════════════════════════════════════════════\n');
        });

        // Graceful shutdown
        const gracefulShutdown = (signal) => {
            console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);

            server.close(() => {
                console.log('✅ Express server closed');
                process.exit(0);
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                console.error('❌ Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        // Handle shutdown signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

// Start the server
startServer();
