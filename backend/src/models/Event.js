const mongoose = require('mongoose');

// Event Schema Definition
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    index: true
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true,
    maxlength: [300, 'Location cannot exceed 300 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  image_url: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        // Basic URL validation
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid image URL format'
    }
  },
  ticket_url: {
    type: String,
    required: [true, 'Ticket URL is required'],
    trim: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid ticket URL format'
    }
  },
  source: {
    type: String,
    required: [true, 'Event source is required'],
    trim: true,
    index: true
  },
  is_active: {
    type: Boolean,
    default: true,
    index: true
  },
  last_updated: {
    type: Date,
    default: Date.now
  },
  // Additional fields for duplicate detection
  event_hash: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
  collection: 'events' // Explicitly use 'events' collection name
});

// Compound index for efficient queries
eventSchema.index({ date: 1, is_active: 1 });
eventSchema.index({ source: 1, is_active: 1 });

// Virtual for checking if event has passed
eventSchema.virtual('isPast').get(function () {
  return this.date < new Date();
});

// Method to mark event as inactive
eventSchema.methods.markInactive = function () {
  this.is_active = false;
  this.last_updated = new Date();
  return this.save();
};

// Static method to get all active events
eventSchema.statics.getActiveEvents = function () {
  return this.find({ is_active: true })
    .sort({ date: 1 })
    .exec();
};

// Static method to get upcoming events
eventSchema.statics.getUpcomingEvents = function () {
  return this.find({
    is_active: true,
    date: { $gte: new Date() }
  })
    .sort({ date: 1 })
    .exec();
};

// Pre-save middleware to update last_updated timestamp
eventSchema.pre('save', function (next) {
  this.last_updated = new Date();
  next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
