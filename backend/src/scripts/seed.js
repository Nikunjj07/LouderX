#!/usr/bin/env node

/**
 * Database Seeding Script
 * 
 * Usage:
 *   node src/scripts/seed.js
 * 
 * This script populates the database with sample event data
 */

const { connectDB, disconnectDB } = require('../config/database');
const { seedDatabase } = require('../utils/seedData');

const runSeed = async () => {
    try {
        // Connect to database
        await connectDB();

        // Run seeding
        await seedDatabase();

        console.log('\n🎉 Seeding process completed successfully!');
    } catch (error) {
        console.error('\n❌ Seeding failed:', error.message);
        process.exit(1);
    } finally {
        // Disconnect
        await disconnectDB();
        process.exit(0);
    }
};

// Run the seed function
runSeed();
