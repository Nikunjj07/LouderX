const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    subscribeEmail,
    getSubscriptionStats,
    getSubscriptionsByEvent,
    checkSubscription,
    getSubscriptionsByUser
} = require('../controllers/email.controller');
const { validateRequest } = require('../middleware/validator');

// Validation rules for email subscription
const subscribeValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('eventId')
        .trim()
        .notEmpty()
        .withMessage('Event ID is required')
        .isMongoId()
        .withMessage('Invalid event ID format'),
    body('consent')
        .isBoolean()
        .withMessage('Consent must be a boolean')
        .custom((value) => value === true)
        .withMessage('User consent is required')
];

// Email subscription routes
router.post('/', subscribeValidation, validateRequest, subscribeEmail);
router.get('/stats', getSubscriptionStats);
router.get('/check', checkSubscription);
router.get('/event/:eventId', getSubscriptionsByEvent);
router.get('/user/:email', getSubscriptionsByUser);

module.exports = router;
