import { Router } from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getUpcomingEvents,
  getEventsByOrganizer
} from '../controllers';
import {
  validate,
  createEventSchema,
  updateEventSchema,
  authenticate,
  authorize
} from '../middleware';

const router = Router();

// Public routes
// @route   GET /api/events
router.get('/', getEvents);

// @route   GET /api/events/upcoming
router.get('/upcoming', getUpcomingEvents);

// @route   GET /api/events/organizer/:organizerId
router.get('/organizer/:organizerId', getEventsByOrganizer);

// @route   GET /api/events/:id
router.get('/:id', getEvent);

// Protected routes (require authentication)
// @route   POST /api/events
router.post(
  '/',
  authenticate,
  authorize('admin', 'owner'),
  validate(createEventSchema),
  createEvent
);

// @route   PUT /api/events/:id
router.put(
  '/:id',
  authenticate,
  authorize('admin', 'owner'),
  validate(updateEventSchema),
  updateEvent
);

// @route   DELETE /api/events/:id
router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'owner'),
  deleteEvent
);

// @route   POST /api/events/:id/register
router.post(
  '/:id/register',
  authenticate,
  authorize('owner'),
  registerForEvent
);

// @route   DELETE /api/events/:id/unregister
router.delete(
  '/:id/unregister',
  authenticate,
  authorize('owner'),
  unregisterFromEvent
);

export default router;
