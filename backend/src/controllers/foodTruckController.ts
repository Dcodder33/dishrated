import { Request, Response } from 'express';
import { FoodTruck, Review } from '../models';
import { asyncHandler, createError } from '../middleware';
import { getPaginationOptions, createPaginationResult, calculateDistance } from '../utils';
import { ApiResponse } from '../types';

// @desc    Get all food trucks
// @route   GET /api/trucks
// @access  Public
export const getFoodTrucks = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationOptions(req);
  const { search, cuisine, status, featured, priceRange, lat, lng, maxDistance } = req.query;

  // Build query
  let query: any = {};

  if (search) {
    query.$text = { $search: search as string };
  }

  if (cuisine) {
    query.cuisine = { $regex: cuisine as string, $options: 'i' };
  }

  if (status) {
    query.status = status;
  }

  if (featured !== undefined) {
    query.featured = featured === 'true';
  }

  if (priceRange) {
    query.priceRange = priceRange;
  }

  // Location-based filtering
  if (lat && lng && maxDistance) {
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const distance = parseFloat(maxDistance as string);

    query['location.coordinates.latitude'] = {
      $gte: latitude - (distance / 111), // Rough conversion: 1 degree ≈ 111 km
      $lte: latitude + (distance / 111)
    };
    query['location.coordinates.longitude'] = {
      $gte: longitude - (distance / (111 * Math.cos(latitude * Math.PI / 180))),
      $lte: longitude + (distance / (111 * Math.cos(latitude * Math.PI / 180)))
    };
  }

  // Execute query
  const trucks = await FoodTruck.find(query)
    .populate('owner', 'name email')
    .sort({ featured: -1, rating: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await FoodTruck.countDocuments(query);

  // Add distance if coordinates provided
  let trucksWithDistance: any = trucks;
  if (lat && lng) {
    const userLat = parseFloat(lat as string);
    const userLng = parseFloat(lng as string);

    trucksWithDistance = trucks.map(truck => {
      const distance = calculateDistance(
        userLat,
        userLng,
        truck.location.coordinates.latitude,
        truck.location.coordinates.longitude
      );
      return {
        ...truck.toObject(),
        distance: `${distance} km`
      };
    });
  }

  const pagination = createPaginationResult(page, limit, total);

  const response: ApiResponse = {
    success: true,
    message: 'Food trucks retrieved successfully',
    data: {
      trucks: trucksWithDistance,
      pagination
    }
  };

  res.json(response);
});

// @desc    Get single food truck
// @route   GET /api/trucks/:id
// @access  Public
export const getFoodTruck = asyncHandler(async (req: Request, res: Response) => {
  const truck = await FoodTruck.findById(req.params.id)
    .populate('owner', 'name email phone');

  if (!truck) {
    throw createError('Food truck not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Food truck retrieved successfully',
    data: {
      truck
    }
  };

  res.json(response);
});

// @desc    Create food truck
// @route   POST /api/trucks
// @access  Private (Owner/Admin)
export const createFoodTruck = asyncHandler(async (req: Request, res: Response) => {
  const truckData = {
    ...req.body,
    owner: req.user!._id
  };

  const truck = await FoodTruck.create(truckData);
  await truck.populate('owner', 'name email');

  const response: ApiResponse = {
    success: true,
    message: 'Food truck created successfully',
    data: {
      truck
    }
  };

  res.status(201).json(response);
});

// @desc    Update food truck
// @route   PUT /api/trucks/:id
// @access  Private (Owner/Admin)
export const updateFoodTruck = asyncHandler(async (req: Request, res: Response) => {
  let truck = await FoodTruck.findById(req.params.id);

  if (!truck) {
    throw createError('Food truck not found', 404);
  }

  // Check ownership
  if (truck.owner.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    throw createError('Not authorized to update this food truck', 403);
  }

  truck = await FoodTruck.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).populate('owner', 'name email');

  const response: ApiResponse = {
    success: true,
    message: 'Food truck updated successfully',
    data: {
      truck
    }
  };

  res.json(response);
});

// @desc    Delete food truck
// @route   DELETE /api/trucks/:id
// @access  Private (Owner/Admin)
export const deleteFoodTruck = asyncHandler(async (req: Request, res: Response) => {
  const truck = await FoodTruck.findById(req.params.id);

  if (!truck) {
    throw createError('Food truck not found', 404);
  }

  // Check ownership
  if (truck.owner.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    throw createError('Not authorized to delete this food truck', 403);
  }

  await FoodTruck.findByIdAndDelete(req.params.id);

  const response: ApiResponse = {
    success: true,
    message: 'Food truck deleted successfully'
  };

  res.json(response);
});

// @desc    Get nearby food trucks
// @route   GET /api/trucks/nearby
// @access  Public
export const getNearbyTrucks = asyncHandler(async (req: Request, res: Response) => {
  const { lat, lng, maxDistance = 10 } = req.query;

  if (!lat || !lng) {
    throw createError('Latitude and longitude are required', 400);
  }

  const latitude = parseFloat(lat as string);
  const longitude = parseFloat(lng as string);
  const distance = parseFloat(maxDistance as string);

  const trucks = await FoodTruck.find({
    'location.coordinates.latitude': {
      $gte: latitude - (distance / 111),
      $lte: latitude + (distance / 111)
    },
    'location.coordinates.longitude': {
      $gte: longitude - (distance / (111 * Math.cos(latitude * Math.PI / 180))),
      $lte: longitude + (distance / (111 * Math.cos(latitude * Math.PI / 180)))
    }
  }).populate('owner', 'name email');

  // Calculate exact distances and sort
  const trucksWithDistance = trucks.map(truck => {
    const dist = calculateDistance(
      latitude,
      longitude,
      truck.location.coordinates.latitude,
      truck.location.coordinates.longitude
    );
    return {
      ...truck.toObject(),
      distance: `${dist} km`,
      distanceValue: dist
    };
  }).filter(truck => truck.distanceValue <= distance)
    .sort((a, b) => a.distanceValue - b.distanceValue);

  const response: ApiResponse = {
    success: true,
    message: 'Nearby food trucks retrieved successfully',
    data: {
      trucks: trucksWithDistance
    }
  };

  res.json(response);
});

// @desc    Get trending food trucks
// @route   GET /api/trucks/trending
// @access  Public
export const getTrendingTrucks = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 10 } = req.query;

  const trucks = await FoodTruck.find()
    .populate('owner', 'name email phone avatar')
    .sort({ rating: -1, reviewCount: -1, featured: -1 })
    .limit(parseInt(limit as string));

  const response: ApiResponse = {
    success: true,
    message: 'Trending food trucks retrieved successfully',
    data: {
      trucks
    }
  };

  res.json(response);
});
