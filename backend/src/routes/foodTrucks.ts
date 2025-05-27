import { Router } from 'express';
import {
  getFoodTrucks,
  getFoodTruck,
  createFoodTruck,
  updateFoodTruck,
  deleteFoodTruck,
  getNearbyTrucks,
  getTrendingTrucks
} from '../controllers';
import {
  validate,
  createFoodTruckSchema,
  updateFoodTruckSchema,
  authenticate,
  authorize
} from '../middleware';

const router = Router();

// @route   GET /api/trucks
router.get('/', getFoodTrucks);

// @route   GET /api/trucks/nearby
router.get('/nearby', getNearbyTrucks);

// @route   GET /api/trucks/trending
router.get('/trending', getTrendingTrucks);

// @route   GET /api/trucks/:id
router.get('/:id', getFoodTruck);

// @route   POST /api/trucks
router.post(
  '/',
  authenticate,
  authorize('owner', 'admin'),
  validate(createFoodTruckSchema),
  createFoodTruck
);

// @route   PUT /api/trucks/:id
router.put(
  '/:id',
  authenticate,
  authorize('owner', 'admin'),
  validate(updateFoodTruckSchema),
  updateFoodTruck
);

// @route   DELETE /api/trucks/:id
router.delete(
  '/:id',
  authenticate,
  authorize('owner', 'admin'),
  deleteFoodTruck
);

export default router;
