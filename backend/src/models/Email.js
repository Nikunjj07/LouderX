const mongoose = require('mongoose');

// Email Schema Definition
const emailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email address is required'],
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                // Email validation regex
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Invalid email address format'
        },
        index: true
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, 'Event ID is required'],
        index: true
    },
    consent: {
        type: Boolean,
        required: [true, 'User consent is required'],
        validate: {
            validator: function (v) {
                return v === true;
            },
            message: 'User must provide consent'
        }
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    // Additional tracking fields
    ip_address: {
        type: String,
        trim: true
    },
    user_agent: {
        type: String,
        trim: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Compound index to prevent duplicate email-event combinations
emailSchema.index({ email: 1, event_id: 1 }, { unique: true });

// Virtual to populate event details
emailSchema.virtual('event', {
    ref: 'Event',
    localField: 'event_id',
    foreignField: '_id',
    justOne: true
});

// Static method to get all emails for a specific event
emailSchema.statics.getEmailsByEvent = function (eventId) {
    return this.find({ event_id: eventId })
        .sort({ timestamp: -1 })
        .exec();
};

// Static method to get all emails for a specific user
emailSchema.statics.getEmailsByUser = function (email) {
    return this.find({ email: email.toLowerCase() })
        .populate('event_id')
        .sort({ timestamp: -1 })
        .exec();
};

// Static method to count unique emails
emailSchema.statics.countUniqueEmails = function () {
    return this.distinct('email').then(emails => emails.length);
};

// Static method to get subscription statistics
emailSchema.statics.getStats = async function () {
    const totalSubscriptions = await this.countDocuments();
    const uniqueEmails = await this.countUniqueEmails();
    const totalEvents = await this.distinct('event_id').then(ids => ids.length);

    return {
        totalSubscriptions,
        uniqueEmails,
        totalEvents,
        averageSubscriptionsPerEvent: totalEvents > 0 ? (totalSubscriptions / totalEvents).toFixed(2) : 0
    };
};

// Instance method to check if subscription is recent (within 7 days)
emailSchema.methods.isRecent = function () {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this.timestamp >= sevenDaysAgo;
};

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
