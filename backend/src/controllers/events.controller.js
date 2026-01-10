const Event = require('../models/Event');

// @desc    Get all active events
// @route   GET /api/events
// @access  Public
const getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.getActiveEvents();

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all upcoming events (future events only)
// @route   GET /api/events/upcoming
// @access  Public
const getUpcomingEvents = async (req, res, next) => {
    try {
        const events = await Event.getUpcomingEvents();

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        if (!event.is_active) {
            return res.status(404).json({
                success: false,
                message: 'Event is no longer active'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        // Handle invalid MongoDB ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID format'
            });
        }
        next(error);
    }
};

// @desc    Get events by source
// @route   GET /api/events/source/:source
// @access  Public
const getEventsBySource = async (req, res, next) => {
    try {
        const events = await Event.find({
            source: req.params.source,
            is_active: true
        }).sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            source: req.params.source,
            data: events
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get events by date range
// @route   GET /api/events/range?start=YYYY-MM-DD&end=YYYY-MM-DD
// @access  Public
const getEventsByDateRange = async (req, res, next) => {
    try {
        const { start, end } = req.query;

        if (!start || !end) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both start and end dates'
            });
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use YYYY-MM-DD'
            });
        }

        const events = await Event.find({
            is_active: true,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            dateRange: { start, end },
            data: events
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Search events by title or location
// @route   GET /api/events/search?q=searchterm
// @access  Public
const searchEvents = async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a search query'
            });
        }

        const events = await Event.find({
            is_active: true,
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { location: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ]
        }).sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            query: q,
            data: events
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get event statistics
// @route   GET /api/events/stats
// @access  Public
const getEventStats = async (req, res, next) => {
    try {
        const totalEvents = await Event.countDocuments();
        const activeEvents = await Event.countDocuments({ is_active: true });
        const upcomingEvents = await Event.countDocuments({
            is_active: true,
            date: { $gte: new Date() }
        });
        const sources = await Event.distinct('source');

        res.status(200).json({
            success: true,
            stats: {
                total: totalEvents,
                active: activeEvents,
                upcoming: upcomingEvents,
                sources: sources.length,
                sourcesList: sources
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllEvents,
    getUpcomingEvents,
    getEventById,
    getEventsBySource,
    getEventsByDateRange,
    searchEvents,
    getEventStats
};
