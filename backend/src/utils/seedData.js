const Event = require('../models/Event');
const Email = require('../models/Email');
const crypto = require('crypto');

// Generate hash for duplicate detection
const generateEventHash = (title, date, location) => {
    const data = `${title}${date}${location}`.toLowerCase().replace(/\s+/g, '');
    return crypto.createHash('md5').update(data).digest('hex');
};

// Sample event data
const sampleEvents = [
    {
        title: 'Sydney Festival 2026',
        date: new Date('2026-01-15T19:00:00'),
        location: 'Sydney Opera House',
        description: 'Join us for the opening night of Sydney Festival 2026 featuring world-class performances, art installations, and cultural celebrations across the city.',
        image_url: 'https://example.com/sydney-festival.jpg',
        ticket_url: 'https://sydneyfestival.org.au/tickets',
        source: 'sydneyfestival.org.au',
        is_active: true
    },
    {
        title: 'Vivid Sydney 2026',
        date: new Date('2026-05-22T18:00:00'),
        location: 'Circular Quay',
        description: 'Experience the magic of Vivid Sydney with stunning light installations, interactive experiences, and live music performances throughout the city.',
        image_url: 'https://example.com/vivid-sydney.jpg',
        ticket_url: 'https://vividsydney.com/tickets',
        source: 'vividsydney.com',
        is_active: true
    },
    {
        title: 'New Year\'s Eve Fireworks',
        date: new Date('2026-12-31T21:00:00'),
        location: 'Sydney Harbour',
        description: 'Celebrate New Year\'s Eve with spectacular fireworks over Sydney Harbour. Multiple viewing locations available across the city.',
        image_url: 'https://example.com/nye-fireworks.jpg',
        ticket_url: 'https://nye.sydney.com',
        source: 'nye.sydney.com',
        is_active: true
    },
    {
        title: 'Sydney Comedy Festival',
        date: new Date('2026-04-10T20:00:00'),
        location: 'The Comedy Store, Sydney',
        description: 'Laugh out loud with the best local and international comedians at the Sydney Comedy Festival. Over 300 shows across 4 weeks.',
        image_url: 'https://example.com/comedy-festival.jpg',
        ticket_url: 'https://sydneycomedyfestival.com.au',
        source: 'sydneycomedyfestival.com.au',
        is_active: true
    },
    {
        title: 'Sculpture by the Sea',
        date: new Date('2026-10-20T10:00:00'),
        location: 'Bondi to Tamarama',
        description: 'World\'s largest free-to-public sculpture exhibition featuring works from artists around the globe along the stunning coastal walk.',
        image_url: 'https://example.com/sculpture-by-sea.jpg',
        ticket_url: 'https://sculpturebythesea.com',
        source: 'sculpturebythesea.com',
        is_active: true
    },
    {
        title: 'Sydney Writers\' Festival',
        date: new Date('2026-05-18T09:00:00'),
        location: 'Walsh Bay Arts Precinct',
        description: 'Meet renowned authors, attend writing workshops, and participate in literary discussions at Australia\'s premier writers\' festival.',
        image_url: 'https://example.com/writers-festival.jpg',
        ticket_url: 'https://swf.org.au',
        source: 'swf.org.au',
        is_active: true
    }
];

// Add event hashes to sample data
sampleEvents.forEach(event => {
    event.event_hash = generateEventHash(event.title, event.date, event.location);
});

// Sample email subscriptions (will be created after events)
const sampleEmails = [
    { email: 'john.doe@example.com', consent: true },
    { email: 'jane.smith@example.com', consent: true },
    { email: 'test.user@example.com', consent: true }
];

// Seed the database
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Clear existing data (optional - comment out if you want to keep existing data)
        console.log('🗑️  Clearing existing events...');
        await Event.deleteMany({});
        console.log('🗑️  Clearing existing email subscriptions...');
        await Email.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Insert sample events
        console.log('📝 Inserting sample events...');
        const insertedEvents = await Event.insertMany(sampleEvents);
        console.log(`✅ Inserted ${insertedEvents.length} events\n`);

        // Insert sample email subscriptions
        console.log('📧 Inserting sample email subscriptions...');
        let emailCount = 0;

        for (const emailData of sampleEmails) {
            // Subscribe each email to 2 random events
            const randomEvents = insertedEvents
                .sort(() => 0.5 - Math.random())
                .slice(0, 2);

            for (const event of randomEvents) {
                try {
                    await Email.create({
                        email: emailData.email,
                        event_id: event._id,
                        consent: emailData.consent
                    });
                    emailCount++;
                } catch (error) {
                    // Skip if duplicate
                    if (error.code !== 11000) {
                        console.error(`Error creating email subscription: ${error.message}`);
                    }
                }
            }
        }
        console.log(`✅ Inserted ${emailCount} email subscriptions\n`);

        // Display summary
        console.log('📊 Database Seeding Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`Total Events: ${insertedEvents.length}`);
        console.log(`Total Email Subscriptions: ${emailCount}`);
        console.log(`Unique Emails: ${sampleEmails.length}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Display some sample events
        console.log('📅 Sample Events:');
        insertedEvents.slice(0, 3).forEach((event, index) => {
            console.log(`\n${index + 1}. ${event.title}`);
            console.log(`   Date: ${event.date.toLocaleDateString()}`);
            console.log(`   Location: ${event.location}`);
            console.log(`   Source: ${event.source}`);
        });

        console.log('\n✅ Database seeding completed successfully!');
        return { events: insertedEvents, emailCount };
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        throw error;
    }
};

module.exports = {
    seedDatabase,
    sampleEvents,
    sampleEmails
};
