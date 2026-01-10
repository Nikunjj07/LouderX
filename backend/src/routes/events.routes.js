const express = require('express');
const router = express.Router();
const {
    getAllEvents,
    getUpcomingEvents,
    getEventById,
    getEventsBySource,
    getEventsByDateRange,
    searchEvents,
    getEventStats
} = require('../controllers/events.controller');

// Event routes
router.get('/', getAllEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/stats', getEventStats);
router.get('/search', searchEvents);
router.get('/range', getEventsByDateRange);
router.get('/source/:source', getEventsBySource);
router.get('/:id', getEventById);

module.exports = router;
