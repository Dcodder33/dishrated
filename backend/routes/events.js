const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const eventController = require('../controllers/eventController');

// Validation middleware for event creation
const validateEvent = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('image')
    .isURL()
    .withMessage('Image must be a valid URL'),
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (value && new Date(value) <= new Date(req.body.date)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('location.address')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),
  body('location.coordinates.latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('location.coordinates.longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('eventType')
    .isIn(['city_event', 'truck_event', 'offer'])
    .withMessage('Event type must be city_event, truck_event, or offer'),
  body('maxParticipants')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max participants must be a positive integer'),
  body('registrationDeadline')
    .optional()
    .isISO8601()
    .withMessage('Registration deadline must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (value && new Date(value) >= new Date(req.body.date)) {
        throw new Error('Registration deadline must be before event date');
      }
      return true;
    }),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be between 1 and 30 characters'),
  body('requirements')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Requirements must be less than 500 characters'),
  body('contactInfo.email')
    .optional()
    .isEmail()
    .withMessage('Contact email must be valid'),
  body('contactInfo.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Contact phone must be valid'),
  body('pricing.participationFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Participation fee must be a non-negative number'),
  body('pricing.currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-character code')
];

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.get('/organizer/:organizerId', eventController.getEventsByOrganizer);

// Protected routes (require authentication)
router.use(auth);

// Create event (Admin or Owner only)
router.post('/', validateEvent, eventController.createEvent);

// Update event (Only organizer or admin)
router.put('/:id', eventController.updateEvent);

// Delete event (Only organizer or admin)
router.delete('/:id', eventController.deleteEvent);

// Participate in event (Food truck owners only)
router.post('/:id/participate', eventController.participateInEvent);

// Withdraw from event (Food truck owners only)
router.delete('/:id/participate', eventController.withdrawFromEvent);

module.exports = router;
