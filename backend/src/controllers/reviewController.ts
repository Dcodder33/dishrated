import { Request, Response } from 'express';
import { Review, FoodTruck } from '../models';
import { asyncHandler, createError } from '../middleware';
import { getPaginationOptions, createPaginationResult } from '../utils';
import { ApiResponse } from '../types';

// @desc    Get reviews for a food truck
// @route   GET /api/reviews/truck/:truckId
// @access  Public
export const getTruckReviews = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationOptions(req);
  const { truckId } = req.params;

  // Check if truck exists
  const truck = await FoodTruck.findById(truckId);
  if (!truck) {
    throw createError('Food truck not found', 404);
  }

  const reviews = await Review.find({ truck: truckId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments({ truck: truckId });
  const pagination = createPaginationResult(page, limit, total);

  const response: ApiResponse = {
    success: true,
    message: 'Reviews retrieved successfully',
    data: {
      reviews,
      pagination
    }
  };

  res.json(response);
});

// @desc    Get user's reviews
// @route   GET /api/reviews/user
// @access  Private
export const getUserReviews = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationOptions(req);

  const reviews = await Review.find({ user: req.user!._id })
    .populate('truck', 'name image cuisine')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments({ user: req.user!._id });
  const pagination = createPaginationResult(page, limit, total);

  const response: ApiResponse = {
    success: true,
    message: 'User reviews retrieved successfully',
    data: {
      reviews,
      pagination
    }
  };

  res.json(response);
});

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const { truck, rating, comment, images } = req.body;

  // Check if truck exists
  const foodTruck = await FoodTruck.findById(truck);
  if (!foodTruck) {
    throw createError('Food truck not found', 404);
  }

  // Check if user already reviewed this truck
  const existingReview = await Review.findOne({
    user: req.user!._id,
    truck
  });

  if (existingReview) {
    throw createError('You have already reviewed this food truck', 400);
  }

  // Create review
  const review = await Review.create({
    user: req.user!._id,
    truck,
    rating,
    comment,
    images: images || []
  });

  await review.populate('user', 'name avatar');

  // Update truck rating
  await updateTruckRating(truck);

  const response: ApiResponse = {
    success: true,
    message: 'Review created successfully',
    data: {
      review
    }
  };

  res.status(201).json(response);
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    throw createError('Review not found', 404);
  }

  // Check ownership
  if (review.user.toString() !== req.user!._id.toString()) {
    throw createError('Not authorized to update this review', 403);
  }

  review = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).populate('user', 'name avatar');

  // Update truck rating
  await updateTruckRating(review!.truck.toString());

  const response: ApiResponse = {
    success: true,
    message: 'Review updated successfully',
    data: {
      review
    }
  };

  res.json(response);
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw createError('Review not found', 404);
  }

  // Check ownership or admin
  if (review.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    throw createError('Not authorized to delete this review', 403);
  }

  const truckId = review.truck.toString();
  await Review.findByIdAndDelete(req.params.id);

  // Update truck rating
  await updateTruckRating(truckId);

  const response: ApiResponse = {
    success: true,
    message: 'Review deleted successfully'
  };

  res.json(response);
});

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
export const markHelpful = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { $inc: { helpful: 1 } },
    { new: true }
  ).populate('user', 'name avatar');

  if (!review) {
    throw createError('Review not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Review marked as helpful',
    data: {
      review
    }
  };

  res.json(response);
});

// Helper function to update truck rating
const updateTruckRating = async (truckId: string) => {
  const reviews = await Review.find({ truck: truckId });
  
  if (reviews.length === 0) {
    await FoodTruck.findByIdAndUpdate(truckId, {
      rating: 0,
      reviewCount: 0
    });
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;

  await FoodTruck.findByIdAndUpdate(truckId, {
    rating: averageRating,
    reviewCount: reviews.length
  });
};
