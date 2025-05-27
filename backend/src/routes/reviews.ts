import { Router } from 'express';
import {
  getTruckReviews,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful
} from '../controllers';
import {
  validate,
  createReviewSchema,
  updateReviewSchema,
  authenticate
} from '../middleware';

const router = Router();

// @route   GET /api/reviews/truck/:truckId
router.get('/truck/:truckId', getTruckReviews);

// @route   GET /api/reviews/user
router.get('/user', authenticate, getUserReviews);

// @route   POST /api/reviews
router.post(
  '/',
  authenticate,
  validate(createReviewSchema),
  createReview
);

// @route   PUT /api/reviews/:id
router.put(
  '/:id',
  authenticate,
  validate(updateReviewSchema),
  updateReview
);

// @route   DELETE /api/reviews/:id
router.delete('/:id', authenticate, deleteReview);

// @route   PUT /api/reviews/:id/helpful
router.put('/:id/helpful', authenticate, markHelpful);

export default router;
