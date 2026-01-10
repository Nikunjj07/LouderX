const Email = require('../models/Email');
const Event = require('../models/Event');

// @desc    Subscribe email to event notifications
// @route   POST /api/subscribe
// @access  Public
const subscribeEmail = async (req, res, next) => {
    try {
        const { email, eventId, consent } = req.body;

        // Validation
        if (!email || !eventId) {
            return res.status(400).json({
                success: false,
                message: 'Email and event ID are required'
            });
        }

        if (!consent) {
            return res.status(400).json({
                success: false,
                message: 'User consent is required to subscribe'
            });
        }

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        if (!event.is_active) {
            return res.status(400).json({
                success: false,
                message: 'Cannot subscribe to inactive event'
            });
        }

        // Get IP address and user agent for tracking
        const ip_address = req.ip || req.connection.remoteAddress;
        const user_agent = req.get('user-agent');

        // Create subscription
        const subscription = await Email.create({
            email: email.toLowerCase().trim(),
            event_id: eventId,
            consent,
            ip_address,
            user_agent
        });

        res.status(201).json({
            success: true,
            message: 'Email subscription successful',
            data: {
                email: subscription.email,
                event: event.title,
                timestamp: subscription.timestamp
            }
        });

    } catch (error) {
        // Handle duplicate subscription
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You are already subscribed to this event'
            });
        }
        next(error);
    }
};

// @desc    Get subscription statistics
// @route   GET /api/subscribe/stats
// @access  Public
const getSubscriptionStats = async (req, res, next) => {
    try {
        const stats = await Email.getStats();

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get subscriptions for a specific event
// @route   GET /api/subscribe/event/:eventId
// @access  Public (could be restricted to admin in production)
const getSubscriptionsByEvent = async (req, res, next) => {
    try {
        const { eventId } = req.params;

        const subscriptions = await Email.getEmailsByEvent(eventId);

        res.status(200).json({
            success: true,
            count: subscriptions.length,
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Check if email is subscribed to an event
// @route   GET /api/subscribe/check?email=user@example.com&eventId=123
// @access  Public
const checkSubscription = async (req, res, next) => {
    try {
        const { email, eventId } = req.query;

        if (!email || !eventId) {
            return res.status(400).json({
                success: false,
                message: 'Email and event ID are required'
            });
        }

        const subscription = await Email.findOne({
            email: email.toLowerCase().trim(),
            event_id: eventId
        });

        res.status(200).json({
            success: true,
            isSubscribed: !!subscription,
            subscription: subscription ? {
                timestamp: subscription.timestamp,
                isRecent: subscription.isRecent()
            } : null
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all subscriptions for a user email
// @route   GET /api/subscribe/user/:email
// @access  Public
const getSubscriptionsByUser = async (req, res, next) => {
    try {
        const { email } = req.params;

        const subscriptions = await Email.getEmailsByUser(email);

        res.status(200).json({
            success: true,
            count: subscriptions.length,
            email: email.toLowerCase(),
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    subscribeEmail,
    getSubscriptionStats,
    getSubscriptionsByEvent,
    checkSubscription,
    getSubscriptionsByUser
};
