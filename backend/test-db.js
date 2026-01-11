// Test script to directly query MongoDB using the backend's setup
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('='.repeat(70));
console.log('BACKEND DATABASE DIAGNOSTIC');
console.log('='.repeat(70));
console.log('MongoDB URI:', MONGODB_URI ? 'SET' : 'NOT SET');
console.log();

async function diagnose() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log(`✅ Connected to: ${mongoose.connection.name}`);
        console.log(`   Host: ${mongoose.connection.host}`);
        console.log();

        // Get the native collection (bypass Mongoose model)
        const db = mongoose.connection.db;
        const eventsCollection = db.collection('events');

        // Count documents
        const totalCount = await eventsCollection.countDocuments({});
        console.log(`📊 Total documents in 'events' collection: ${totalCount}`);

        const activeCount = await eventsCollection.countDocuments({ is_active: true });
        console.log(`📊 Active events: ${activeCount}`);

        const upcomingCount = await eventsCollection.countDocuments({
            is_active: true,
            date: { $gte: new Date() }
        });
        console.log(`📊 Upcoming events (active + future date): ${upcomingCount}`);
        console.log();

        // Show sample event
        console.log('Sample event from collection:');
        console.log('-'.repeat(70));
        const sample = await eventsCollection.findOne();
        if (sample) {
            console.log(JSON.stringify(sample, null, 2));
        } else {
            console.log('❌ No events found!');
        }
        console.log();

        // Now test with Mongoose model
        console.log('Testing with Mongoose Event model:');
        console.log('-'.repeat(70));

        // Import the Event model
        const Event = require('./src/models/Event');

        const modelCount = await Event.countDocuments({});
        console.log(`📊 Event.countDocuments(): ${modelCount}`);

        const upcomingEvents = await Event.find({
            is_active: true,
            date: { $gte: new Date() }
        });
        console.log(`📊 Event.find(upcoming query): ${upcomingEvents.length} events`);

        if (upcomingEvents.length > 0) {
            console.log('Sample upcoming event:');
            console.log(JSON.stringify(upcomingEvents[0], null, 2));
        }

        await mongoose.connection.close();
        console.log('\n✅ Diagnostic complete');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    }
}

diagnose();
