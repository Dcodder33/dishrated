import { Router } from 'express';
import {
  getAdminDashboard,
  getOwnerApplications,
  getOwnerApplication,
  approveOwnerApplication,
  rejectOwnerApplication,
  submitOwnerApplication,
  getAllUsers,
  toggleUserBan,
  getUserDetails,
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getAdminEvents,
  getAdminEvent,
  createAdminEvent,
  updateAdminEvent,
  deleteAdminEvent,
  approveEvent,
  rejectEvent
} from '../controllers/adminController';
import {
  validate,
  authenticate,
  authorize
} from '../middleware';
import Joi from 'joi';

const router = Router();

// Validation schemas
const submitApplicationSchema = Joi.object({
  businessName: Joi.string().min(2).max(100).required(),
  ownerName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).required(),
  cuisineType: Joi.string().valid('american', 'mexican', 'italian', 'asian', 'indian', 'mediterranean', 'fusion', 'other').required(),
  description: Joi.string().max(1000).optional().allow('')
});

const approveApplicationSchema = Joi.object({
  notes: Joi.string().max(1000).optional().allow('')
});

const rejectApplicationSchema = Joi.object({
  rejectionReason: Joi.string().min(10).max(500).required(),
  notes: Joi.string().max(1000).optional().allow('')
});

const banUserSchema = Joi.object({
  reason: Joi.string().min(10).max(500).required()
});

const createBlogSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  content: Joi.string().min(50).required(),
  excerpt: Joi.string().min(20).max(500).required(),
  featuredImage: Joi.string().uri().optional().allow(''),
  category: Joi.string().valid(
    'food-trends', 'truck-spotlights', 'city-guides', 'recipes',
    'events', 'business-tips', 'sustainability', 'reviews', 'news', 'other'
  ).required(),
  tags: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('draft', 'published', 'archived').optional(),
  featured: Joi.boolean().optional()
});

const updateBlogSchema = Joi.object({
  title: Joi.string().min(5).max(200).optional(),
  content: Joi.string().min(50).optional(),
  excerpt: Joi.string().min(20).max(500).optional(),
  featuredImage: Joi.string().uri().optional().allow(''),
  category: Joi.string().valid(
    'food-trends', 'truck-spotlights', 'city-guides', 'recipes',
    'events', 'business-tips', 'sustainability', 'reviews', 'news', 'other'
  ).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('draft', 'published', 'archived').optional(),
  featured: Joi.boolean().optional()
});

const createEventSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(20).max(2000).required(),
  image: Joi.string().uri().required(),
  date: Joi.date().greater('now').required(),
  endDate: Joi.date().greater(Joi.ref('date')).optional(),
  location: Joi.object({
    address: Joi.string().required(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).optional(),
      longitude: Joi.number().min(-180).max(180).optional()
    }).optional()
  }).required(),
  eventType: Joi.string().valid('city_event', 'truck_event', 'offer').optional(),
  maxParticipants: Joi.number().min(1).optional(),
  registrationDeadline: Joi.date().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  featured: Joi.boolean().optional(),
  requirements: Joi.string().max(1000).optional().allow(''),
  contactInfo: Joi.object({
    email: Joi.string().email().optional(),
    phone: Joi.string().optional()
  }).optional(),
  pricing: Joi.object({
    participationFee: Joi.number().min(0).optional(),
    currency: Joi.string().optional()
  }).optional()
});

const updateEventSchema = Joi.object({
  title: Joi.string().min(5).max(200).optional(),
  description: Joi.string().min(20).max(2000).optional(),
  image: Joi.string().uri().optional(),
  date: Joi.date().optional(),
  endDate: Joi.date().optional(),
  location: Joi.object({
    address: Joi.string().optional(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).optional(),
      longitude: Joi.number().min(-180).max(180).optional()
    }).optional()
  }).optional(),
  eventType: Joi.string().valid('city_event', 'truck_event', 'offer').optional(),
  maxParticipants: Joi.number().min(1).optional(),
  registrationDeadline: Joi.date().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  featured: Joi.boolean().optional(),
  requirements: Joi.string().max(1000).optional().allow(''),
  contactInfo: Joi.object({
    email: Joi.string().email().optional(),
    phone: Joi.string().optional()
  }).optional(),
  pricing: Joi.object({
    participationFee: Joi.number().min(0).optional(),
    currency: Joi.string().optional()
  }).optional(),
  status: Joi.string().valid('draft', 'published', 'cancelled', 'completed').optional()
});

const approveEventSchema = Joi.object({
  notes: Joi.string().max(500).optional().allow('')
});

const rejectEventSchema = Joi.object({
  rejectionReason: Joi.string().min(10).max(500).required()
});

// Public routes
// @route   POST /api/admin/applications
router.post('/applications', validate(submitApplicationSchema), submitOwnerApplication);

// Protected admin routes
// @route   GET /api/admin/dashboard
router.get('/dashboard', authenticate, authorize('admin'), getAdminDashboard);

// @route   GET /api/admin/applications
router.get('/applications', authenticate, authorize('admin'), getOwnerApplications);

// @route   GET /api/admin/applications/:id
router.get('/applications/:id', authenticate, authorize('admin'), getOwnerApplication);

// @route   PUT /api/admin/applications/:id/approve
router.put(
  '/applications/:id/approve',
  authenticate,
  authorize('admin'),
  validate(approveApplicationSchema),
  approveOwnerApplication
);

// @route   PUT /api/admin/applications/:id/reject
router.put(
  '/applications/:id/reject',
  authenticate,
  authorize('admin'),
  validate(rejectApplicationSchema),
  rejectOwnerApplication
);

// User management routes
// @route   GET /api/admin/users
router.get('/users', authenticate, authorize('admin'), getAllUsers);

// @route   GET /api/admin/users/:id
router.get('/users/:id', authenticate, authorize('admin'), getUserDetails);

// @route   PUT /api/admin/users/:id/ban
router.put(
  '/users/:id/ban',
  authenticate,
  authorize('admin'),
  validate(banUserSchema),
  toggleUserBan
);

// Blog management routes
// @route   GET /api/admin/blogs
router.get('/blogs', authenticate, authorize('admin'), getAllBlogs);

// @route   GET /api/admin/blogs/:id
router.get('/blogs/:id', authenticate, authorize('admin'), getBlog);

// @route   POST /api/admin/blogs
router.post(
  '/blogs',
  authenticate,
  authorize('admin'),
  validate(createBlogSchema),
  createBlog
);

// @route   PUT /api/admin/blogs/:id
router.put(
  '/blogs/:id',
  authenticate,
  authorize('admin'),
  validate(updateBlogSchema),
  updateBlog
);

// @route   DELETE /api/admin/blogs/:id
router.delete('/blogs/:id', authenticate, authorize('admin'), deleteBlog);

// Event management routes
// @route   GET /api/admin/events
router.get('/events', authenticate, authorize('admin'), getAdminEvents);

// @route   GET /api/admin/events/:id
router.get('/events/:id', authenticate, authorize('admin'), getAdminEvent);

// @route   POST /api/admin/events
router.post(
  '/events',
  authenticate,
  authorize('admin'),
  validate(createEventSchema),
  createAdminEvent
);

// @route   PUT /api/admin/events/:id
router.put(
  '/events/:id',
  authenticate,
  authorize('admin'),
  validate(updateEventSchema),
  updateAdminEvent
);

// @route   DELETE /api/admin/events/:id
router.delete('/events/:id', authenticate, authorize('admin'), deleteAdminEvent);

// @route   PUT /api/admin/events/:id/approve
router.put(
  '/events/:id/approve',
  authenticate,
  authorize('admin'),
  validate(approveEventSchema),
  approveEvent
);

// @route   PUT /api/admin/events/:id/reject
router.put(
  '/events/:id/reject',
  authenticate,
  authorize('admin'),
  validate(rejectEventSchema),
  rejectEvent
);

export default router;
