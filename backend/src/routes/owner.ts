import { Router } from 'express';
import {
  getOwnerDashboard,
  getOwnerTrucks,
  getOwnerTruck,
  createOwnerTruck,
  updateTruckLocation,
  updateTruckStatus,
  getOwnerAnalytics,
  toggleLocationSharing,
  getLocationHistory,
  clearLocationHistory,
  updateTruckBasicInfo,
  updateTruckSchedule,
  updateTruckAbout
} from '../controllers';
import {
  validate,
  createOwnerTruckSchema,
  updateLocationSchema,
  updateStatusSchema,
  authenticate,
  authorize
} from '../middleware';

const router = Router();

// @route   GET /api/owner/dashboard
router.get('/dashboard', authenticate, authorize('owner'), getOwnerDashboard);

// @route   GET /api/owner/trucks
router.get('/trucks', authenticate, authorize('owner'), getOwnerTrucks);

// @route   GET /api/owner/trucks/:id
router.get('/trucks/:id', authenticate, authorize('owner'), getOwnerTruck);

// @route   POST /api/owner/trucks
router.post(
  '/trucks',
  authenticate,
  authorize('owner'),
  validate(createOwnerTruckSchema),
  createOwnerTruck
);

// @route   PUT /api/owner/trucks/:id/location
router.put(
  '/trucks/:id/location',
  authenticate,
  authorize('owner'),
  validate(updateLocationSchema),
  updateTruckLocation
);

// @route   PUT /api/owner/trucks/:id/status
router.put(
  '/trucks/:id/status',
  authenticate,
  authorize('owner'),
  validate(updateStatusSchema),
  updateTruckStatus
);

// @route   GET /api/owner/analytics
router.get('/analytics', authenticate, authorize('owner'), getOwnerAnalytics);

// @route   PUT /api/owner/trucks/:id/location-sharing
router.put(
  '/trucks/:id/location-sharing',
  authenticate,
  authorize('owner'),
  toggleLocationSharing
);

// @route   GET /api/owner/trucks/:id/location-history
router.get(
  '/trucks/:id/location-history',
  authenticate,
  authorize('owner'),
  getLocationHistory
);

// @route   DELETE /api/owner/trucks/:id/location-history
router.delete(
  '/trucks/:id/location-history',
  authenticate,
  authorize('owner'),
  clearLocationHistory
);

// @route   PUT /api/owner/trucks/:id/basic-info
router.put(
  '/trucks/:id/basic-info',
  authenticate,
  authorize('owner'),
  updateTruckBasicInfo
);

// @route   PUT /api/owner/trucks/:id/schedule
router.put(
  '/trucks/:id/schedule',
  authenticate,
  authorize('owner'),
  updateTruckSchedule
);

// @route   PUT /api/owner/trucks/:id/about
router.put(
  '/trucks/:id/about',
  authenticate,
  authorize('owner'),
  updateTruckAbout
);

export default router;
