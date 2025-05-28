import { Router } from 'express';
import {
  getTruckReviews,
  getDishReviews,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  respondToReview
} from '../controllers/reviewController';
import {
  validate,
  createReviewSchema,
  updateReviewSchema,
  respondToReviewSchema,
  authenticate
} from '../middleware';

const router = Router();

// @route   GET /api/reviews/truck/:truckId
router.get('/truck/:truckId', getTruckReviews);

// @route   GET /api/reviews/dish/:dishId
router.get('/dish/:dishId', getDishReviews);

// @route   GET /api/reviews/user
router.get('/user', authenticate, getUserReviews);

// @route   POST /api/reviews
router.post(
  '/',
  authenticate,
  validate(createReviewSchema),
  createReview
);

// @route   PUT /api/reviews/:reviewId
router.put(
  '/:reviewId',
  authenticate,
  validate(updateReviewSchema),
  updateReview
);

// @route   DELETE /api/reviews/:reviewId
router.delete('/:reviewId', authenticate, deleteReview);

// @route   PUT /api/reviews/:reviewId/helpful
router.put('/:reviewId/helpful', authenticate, markHelpful);

// @route   POST /api/reviews/:reviewId/respond
router.post(
  '/:reviewId/respond',
  authenticate,
  validate(respondToReviewSchema),
  respondToReview
);

export default router;
