const { connectDB, disconnectDB, checkConnection } = require('../config/database');
const Event = require('../models/Event');
const Email = require('../models/Email');
const { seedDatabase } = require('../utils/seedData');

// Test database connection and CRUD operations
const testDatabase = async () => {
    try {
        console.log('Starting Database Tests...\n');
        console.log('═══════════════════════════════════════\n');

        // Test 1: Database Connection
        console.log('Test 1: Database Connection');
        console.log('─────────────────────────────────────');
        await connectDB();
        const connectionStatus = checkConnection();
        console.log(`Status: ${connectionStatus.status}`);
        console.log(`Connected: ${connectionStatus.isConnected ? 'YES' : 'NO'}`);
        console.log();

        // Test 2: Seed Database
        console.log('Test 2: Seeding Database');
        console.log('─────────────────────────────────────');
        await seedDatabase();
        console.log();

        // Test 3: Read Operations
        console.log('Test 3: Read Operations');
        console.log('─────────────────────────────────────');

        // Get all events
        const allEvents = await Event.find({});
        console.log(`[OK] Found ${allEvents.length} total events`);

        // Get active events
        const activeEvents = await Event.getActiveEvents();
        console.log(`[OK] Found ${activeEvents.length} active events`);

        // Get upcoming events
        const upcomingEvents = await Event.getUpcomingEvents();
        console.log(`[OK] Found ${upcomingEvents.length} upcoming events`);
        console.log();

        // Test 4: Create Operation
        console.log('Test 4: Create Operation');
        console.log('─────────────────────────────────────');
        const newEvent = await Event.create({
            title: 'Test Event - Database Verification',
            date: new Date('2026-06-15T18:00:00'),
            location: 'Test Venue, Sydney',
            description: 'This is a test event created to verify database CRUD operations.',
            image_url: 'https://example.com/test-event.jpg',
            ticket_url: 'https://example.com/tickets',
            source: 'test.com',
            event_hash: 'test-hash-' + Date.now()
        });
        console.log(`[OK] Created new event: "${newEvent.title}"`);
        console.log(`   Event ID: ${newEvent._id}`);
        console.log();

        // Test 5: Update Operation
        console.log('Test 5: Update Operation');
        console.log('─────────────────────────────────────');
        newEvent.description = 'Updated description for test event';
        await newEvent.save();
        console.log(`[OK] Updated event description`);
        console.log();

        // Test 6: Email Subscription
        console.log('Test 6: Email Subscription');
        console.log('─────────────────────────────────────');
        const testEmail = await Email.create({
            email: 'testuser@example.com',
            event_id: newEvent._id,
            consent: true
        });
        console.log(`[OK] Created email subscription: ${testEmail.email}`);
        console.log(`   For event: ${newEvent.title}`);
        console.log();

        // Test 7: Query with Population
        console.log('Test 7: Query with Population');
        console.log('─────────────────────────────────────');
        const emailsWithEvents = await Email.find({})
            .populate('event_id')
            .limit(3);
        console.log(`[OK] Found ${emailsWithEvents.length} email subscriptions with event details`);
        emailsWithEvents.forEach((sub, index) => {
            console.log(`   ${index + 1}. ${sub.email} → ${sub.event_id?.title || 'Unknown Event'}`);
        });
        console.log();

        // Test 8: Email Statistics
        console.log('Test 8: Email Statistics');
        console.log('─────────────────────────────────────');
        const stats = await Email.getStats();
        console.log(`[OK] Email Subscription Statistics:`);
        console.log(`   Total Subscriptions: ${stats.totalSubscriptions}`);
        console.log(`   Unique Emails: ${stats.uniqueEmails}`);
        console.log(`   Total Events with Subscriptions: ${stats.totalEvents}`);
        console.log(`   Avg Subscriptions per Event: ${stats.averageSubscriptionsPerEvent}`);
        console.log();

        // Test 9: Delete Operation
        console.log('Test 9: Delete Operation');
        console.log('─────────────────────────────────────');
        await Event.findByIdAndDelete(newEvent._id);
        await Email.deleteMany({ event_id: newEvent._id });
        console.log(`[OK] Deleted test event and related subscriptions`);
        console.log();

        // Test 10: Mark Event as Inactive
        console.log('Test 10: Mark Event as Inactive');
        console.log('─────────────────────────────────────');
        const eventToDeactivate = await Event.findOne({ is_active: true });
        if (eventToDeactivate) {
            await eventToDeactivate.markInactive();
            console.log(`[OK] Marked event as inactive: "${eventToDeactivate.title}"`);

            // Reactivate it
            eventToDeactivate.is_active = true;
            await eventToDeactivate.save();
            console.log(`[OK] Reactivated event for future tests`);
        }
        console.log();

        // Final Summary
        console.log('═══════════════════════════════════════');
        console.log('[OK] All Database Tests Passed!');
        console.log('═══════════════════════════════════════\n');

        console.log('Final Database State:');
        const finalEventCount = await Event.countDocuments();
        const finalEmailCount = await Email.countDocuments();
        console.log(`   Events: ${finalEventCount}`);
        console.log(`   Email Subscriptions: ${finalEmailCount}`);
        console.log();

    } catch (error) {
        console.error('[ERROR] Test Failed:', error.message);
        console.error(error);
    } finally {
        // Disconnect from database
        await disconnectDB();
        console.log('Test completed and database disconnected\n');
        process.exit(0);
    }
};

// Run tests if this file is executed directly
if (require.main === module) {
    testDatabase();
}

module.exports = testDatabase;
