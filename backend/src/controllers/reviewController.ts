import { Request, Response } from 'express';
import Review from '../models/Review';
import { FoodTruck } from '../models';
import MenuItem from '../models/MenuItem';
import mongoose from 'mongoose';
import { AuthRequest } from '../types';

// Create a new review
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { truckId, dishId, rating, title, comment, images } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Validate truck exists
    const truck = await FoodTruck.findById(truckId);
    if (!truck) {
      return res.status(404).json({ message: 'Food truck not found' });
    }

    // If dishId provided, validate dish exists and belongs to truck
    if (dishId) {
      const dish = await MenuItem.findOne({ _id: dishId, truck: truckId });
      if (!dish) {
        return res.status(404).json({ message: 'Menu item not found or does not belong to this truck' });
      }
    }

    // Check if user already reviewed this truck/dish combination
    const existingReview = await Review.findOne({
      user: userId,
      truck: truckId,
      dish: dishId || { $exists: false }
    });

    if (existingReview) {
      return res.status(400).json({
        message: dishId ? 'You have already reviewed this dish' : 'You have already reviewed this truck'
      });
    }

    // Create review
    const review = new Review({
      user: userId,
      truck: truckId,
      dish: dishId,
      rating,
      title,
      comment,
      images: images || []
    });

    await review.save();

    // Populate user and truck info
    await review.populate([
      { path: 'user', select: 'name' },
      { path: 'truck', select: 'name' },
      { path: 'dish', select: 'name' }
    ]);

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Failed to create review' });
  }
};

// Get reviews for a truck
export const getTruckReviews = async (req: Request, res: Response) => {
  try {
    const { truckId } = req.params;
    const {
      page = 1,
      limit = 10,
      rating,
      reviewType = 'all',
      sortBy = 'newest'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query: any = {
      truck: truckId,
      isHidden: false
    };

    if (rating) {
      query.rating = parseInt(rating as string);
    }

    if (reviewType === 'truck') {
      query.reviewType = 'truck';
    } else if (reviewType === 'dish') {
      query.reviewType = 'dish';
    }

    // Build sort
    let sort: any = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'highest':
        sort = { rating: -1, createdAt: -1 };
        break;
      case 'lowest':
        sort = { rating: 1, createdAt: -1 };
        break;
      case 'helpful':
        sort = { helpfulVotes: -1, createdAt: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate('user', 'name')
        .populate('dish', 'name')
        .populate('response.respondedBy', 'name')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Review.countDocuments(query)
    ]);

    // Get rating statistics
    const ratingStats = await getRatingStats(truckId, reviewType === 'all' ? undefined : reviewType as string);

    res.json({
      reviews,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalReviews: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      },
      ratingStats
    });
  } catch (error) {
    console.error('Get truck reviews error:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

// Get reviews for a specific dish
export const getDishReviews = async (req: Request, res: Response) => {
  try {
    const { dishId } = req.params;
    const { page = 1, limit = 10, sortBy = 'newest' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build sort
    let sort: any = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'highest':
        sort = { rating: -1, createdAt: -1 };
        break;
      case 'lowest':
        sort = { rating: 1, createdAt: -1 };
        break;
      case 'helpful':
        sort = { helpfulVotes: -1, createdAt: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const [reviews, total] = await Promise.all([
      Review.find({
        dish: dishId,
        isHidden: false
      })
        .populate('user', 'name')
        .populate('truck', 'name')
        .populate('response.respondedBy', 'name')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Review.countDocuments({
        dish: dishId,
        isHidden: false
      })
    ]);

    // Get dish info and rating stats
    const dish = await MenuItem.findById(dishId).populate('truck', 'name');
    if (!dish) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const ratingStats = await getRatingStats(dish.truck._id.toString(), 'dish');

    res.json({
      reviews,
      dish,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalReviews: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      },
      ratingStats
    });
  } catch (error) {
    console.error('Get dish reviews error:', error);
    res.status(500).json({ message: 'Failed to fetch dish reviews' });
  }
};

// Update a review
export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment, images } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: 'You can only edit your own reviews' });
    }

    // Update review
    review.rating = rating;
    review.title = title;
    review.comment = comment;
    if (images) review.images = images;

    await review.save();

    await review.populate([
      { path: 'user', select: 'name' },
      { path: 'truck', select: 'name' },
      { path: 'dish', select: 'name' }
    ]);

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Failed to update review' });
  }
};

// Delete a review
export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review or is admin
    const user = req.user;
    if (review.user.toString() !== userId && user?.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
};

// Mark review as helpful
export const markHelpful = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulVotes: 1 } },
      { new: true }
    ).populate('user', 'name');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({
      message: 'Review marked as helpful',
      review
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ message: 'Failed to mark review as helpful' });
  }
};

// Respond to a review (for truck owners)
export const respondToReview = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { message } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const review = await Review.findById(reviewId).populate('truck');
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the owner of the truck being reviewed
    const truck = await FoodTruck.findById(review.truck);
    if (!truck || truck.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You can only respond to reviews of your own truck' });
    }

    // Add response
    review.response = {
      message,
      respondedAt: new Date(),
      respondedBy: new mongoose.Types.ObjectId(userId)
    };

    await review.save();

    await review.populate([
      { path: 'user', select: 'name' },
      { path: 'truck', select: 'name' },
      { path: 'response.respondedBy', select: 'name' }
    ]);

    res.json({
      message: 'Response added successfully',
      review
    });
  } catch (error) {
    console.error('Respond to review error:', error);
    res.status(500).json({ message: 'Failed to respond to review' });
  }
};

// Get user's reviews
export const getUserReviews = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      Review.find({ user: userId })
        .populate('truck', 'name')
        .populate('dish', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Review.countDocuments({ user: userId })
    ]);

    res.json({
      reviews,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalReviews: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Failed to fetch user reviews' });
  }
};

// Helper function to get rating statistics
const getRatingStats = async (truckId: string, reviewType?: string) => {
  const match: any = {
    truck: new mongoose.Types.ObjectId(truckId),
    isHidden: false
  };

  if (reviewType) {
    match.reviewType = reviewType;
  }

  const result = await Review.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (result.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  const data = result[0];
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  data.ratingDistribution.forEach((rating: number) => {
    distribution[rating as keyof typeof distribution]++;
  });

  return {
    averageRating: Math.round(data.averageRating * 10) / 10, // Round to 1 decimal
    totalReviews: data.totalReviews,
    ratingDistribution: distribution
  };
};
