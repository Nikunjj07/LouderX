const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection configuration
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Mongoose 6+ no longer requires these options, but keeping for compatibility
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });

        console.log(`[OK] MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database Name: ${conn.connection.name}`);

        // Connection event listeners
        mongoose.connection.on('connected', () => {
            console.log('[OK] Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('[ERROR] Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('[WARNING] Mongoose disconnected from MongoDB');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('[STOP] Mongoose connection closed due to app termination');
            process.exit(0);
        });

        return conn;
    } catch (error) {
        console.error('[ERROR] MongoDB Connection Error:', error.message);
        console.error('[INFO] Make sure MongoDB is running and MONGODB_URI is set correctly in .env');
        process.exit(1);
    }
};

// Function to disconnect from database
const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('[OK] MongoDB Disconnected');
    } catch (error) {
        console.error('[ERROR] Error disconnecting from MongoDB:', error.message);
    }
};

// Function to check database connection status
const checkConnection = () => {
    const state = mongoose.connection.readyState;
    const states = {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting'
    };
    return {
        state,
        status: states[state] || 'Unknown',
        isConnected: state === 1
    };
};

module.exports = {
    connectDB,
    disconnectDB,
    checkConnection
};
