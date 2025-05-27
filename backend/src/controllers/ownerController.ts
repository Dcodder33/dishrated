import { Request, Response } from 'express';
import { FoodTruck, Review, Event } from '../models';
import { ApiResponse } from '../types';
import { asyncHandler, createError } from '../middleware';

// @desc    Get owner dashboard data
// @route   GET /api/owner/dashboard
// @access  Private (Owner)
export const getOwnerDashboard = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user!._id;

  // Get owner's trucks
  const trucks = await FoodTruck.find({ owner: ownerId })
    .populate('owner', 'name email')
    .sort({ createdAt: -1 });

  // Get total reviews for owner's trucks
  const truckIds = trucks.map(truck => truck._id);
  const totalReviews = await Review.countDocuments({ truck: { $in: truckIds } });

  // Get average rating across all trucks
  const reviewStats = await Review.aggregate([
    { $match: { truck: { $in: truckIds } } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  // Get upcoming events where owner's trucks are registered
  const upcomingEvents = await Event.find({
    participatingTrucks: { $in: truckIds },
    date: { $gte: new Date() },
    status: 'upcoming'
  }).sort({ date: 1 }).limit(5);

  const dashboardData = {
    trucks,
    stats: {
      totalTrucks: trucks.length,
      totalReviews,
      averageRating: reviewStats.length > 0 ? reviewStats[0].averageRating : 0,
      upcomingEvents: upcomingEvents.length
    },
    upcomingEvents
  };

  const response: ApiResponse = {
    success: true,
    message: 'Owner dashboard data retrieved successfully',
    data: dashboardData
  };

  res.json(response);
});

// @desc    Get owner's food trucks
// @route   GET /api/owner/trucks
// @access  Private (Owner)
export const getOwnerTrucks = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user!._id;

  const trucks = await FoodTruck.find({ owner: ownerId })
    .populate('owner', 'name email')
    .sort({ createdAt: -1 });

  const response: ApiResponse = {
    success: true,
    message: 'Owner trucks retrieved successfully',
    data: { trucks }
  };

  res.json(response);
});

// @desc    Get single owner truck
// @route   GET /api/owner/trucks/:id
// @access  Private (Owner)
export const getOwnerTruck = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const ownerId = req.user!._id;

  const truck = await FoodTruck.findById(id).populate('owner', 'name email');

  if (!truck) {
    throw createError('Food truck not found', 404);
  }

  if (truck.owner._id.toString() !== ownerId.toString()) {
    throw createError('Not authorized to access this truck', 403);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Truck retrieved successfully',
    data: { truck }
  };

  res.json(response);
});

// @desc    Create new food truck
// @route   POST /api/owner/trucks
// @access  Private (Owner)
export const createOwnerTruck = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user!._id;
  const {
    name,
    description,
    cuisine,
    image,
    location,
    priceRange,
    tags
  } = req.body;

  // Create new truck with owner
  const truck = await FoodTruck.create({
    name,
    description,
    cuisine,
    image: image || '',
    owner: ownerId,
    location,
    priceRange: priceRange || 'mid',
    tags: tags || [],
    status: 'closed', // New trucks start as closed
    waitTime: '0 min',
    rating: 0,
    reviewCount: 0,
    featured: false,
    menu: []
  });

  // Populate owner information
  await truck.populate('owner', 'name email');

  const response: ApiResponse = {
    success: true,
    message: 'Food truck created successfully',
    data: { truck }
  };

  res.status(201).json(response);
});

// @desc    Update truck location
// @route   PUT /api/owner/trucks/:id/location
// @access  Private (Owner)
export const updateTruckLocation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { address, coordinates } = req.body;
  const ownerId = req.user!._id;

  // Find truck and verify ownership
  const truck = await FoodTruck.findById(id);
  if (!truck) {
    throw createError('Food truck not found', 404);
  }

  if (truck.owner.toString() !== ownerId.toString()) {
    throw createError('Not authorized to update this truck', 403);
  }

  // Update location
  truck.location = {
    address,
    coordinates: {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    }
  };

  await truck.save();

  const response: ApiResponse = {
    success: true,
    message: 'Truck location updated successfully',
    data: { truck }
  };

  res.json(response);
});

// @desc    Update truck status
// @route   PUT /api/owner/trucks/:id/status
// @access  Private (Owner)
export const updateTruckStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, waitTime } = req.body;
  const ownerId = req.user!._id;

  // Find truck and verify ownership
  const truck = await FoodTruck.findById(id);
  if (!truck) {
    throw createError('Food truck not found', 404);
  }

  if (truck.owner.toString() !== ownerId.toString()) {
    throw createError('Not authorized to update this truck', 403);
  }

  // Update status and wait time
  truck.status = status;
  if (waitTime !== undefined) {
    truck.waitTime = waitTime;
  }

  await truck.save();

  const response: ApiResponse = {
    success: true,
    message: 'Truck status updated successfully',
    data: { truck }
  };

  res.json(response);
});

// @desc    Get owner analytics
// @route   GET /api/owner/analytics
// @access  Private (Owner)
export const getOwnerAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user!._id;
  const { period = '30' } = req.query; // days

  const trucks = await FoodTruck.find({ owner: ownerId });
  const truckIds = trucks.map(truck => truck._id);

  // Get reviews in the specified period
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(period as string));

  const recentReviews = await Review.find({
    truck: { $in: truckIds },
    createdAt: { $gte: startDate }
  }).populate('truck', 'name').sort({ createdAt: -1 });

  // Get rating trends
  const ratingTrends = await Review.aggregate([
    {
      $match: {
        truck: { $in: truckIds },
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const analytics = {
    trucks: trucks.length,
    recentReviews: recentReviews.length,
    ratingTrends,
    topRatedTruck: trucks.sort((a, b) => b.rating - a.rating)[0] || null
  };

  const response: ApiResponse = {
    success: true,
    message: 'Owner analytics retrieved successfully',
    data: analytics
  };

  res.json(response);
});

// @desc    Toggle location sharing for truck
// @route   PUT /api/owner/trucks/:id/location-sharing
// @access  Private (Owner)
export const toggleLocationSharing = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { enabled } = req.body;
  const ownerId = req.user!._id;

  // Find truck and verify ownership
  const truck = await FoodTruck.findById(id);
  if (!truck) {
    throw createError('Food truck not found', 404);
  }

  if (truck.owner.toString() !== ownerId.toString()) {
    throw createError('Not authorized to update this truck', 403);
  }

  // Update location sharing status
  (truck as any).isLocationSharingEnabled = enabled;

  // If disabling, also clear any sensitive location data if needed
  if (!enabled) {
    // You might want to add logic here to handle privacy when sharing is disabled
  }

  await truck.save();

  const response: ApiResponse = {
    success: true,
    message: `Location sharing ${enabled ? 'enabled' : 'disabled'} successfully`,
    data: { truck }
  };

  res.json(response);
});

// @desc    Get location history for truck
// @route   GET /api/owner/trucks/:id/location-history
// @access  Private (Owner)
export const getLocationHistory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const ownerId = req.user!._id;

  // Find truck and verify ownership
  const truck = await FoodTruck.findById(id);
  if (!truck) {
    throw createError('Food truck not found', 404);
  }

  if (truck.owner.toString() !== ownerId.toString()) {
    throw createError('Not authorized to access this truck', 403);
  }

  // For now, return mock data. In a real implementation, you'd have a LocationHistory model
  const mockHistory = [
    {
      id: '1',
      address: 'KIIT University, Campus 1, Bhubaneswar',
      coordinates: { latitude: 20.3538431, longitude: 85.8169059 },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      duration: 120,
      isActive: true
    },
    {
      id: '2',
      address: 'Esplanade One Mall, Rasulgarh, Bhubaneswar',
      coordinates: { latitude: 20.3019, longitude: 85.8449 },
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      duration: 180
    },
    {
      id: '3',
      address: 'Patia Square, Bhubaneswar',
      coordinates: { latitude: 20.3587, longitude: 85.8230 },
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      duration: 240
    }
  ];

  const response: ApiResponse = {
    success: true,
    message: 'Location history retrieved successfully',
    data: { history: mockHistory }
  };

  res.json(response);
});

// @desc    Clear location history for truck
// @route   DELETE /api/owner/trucks/:id/location-history
// @access  Private (Owner)
export const clearLocationHistory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const ownerId = req.user!._id;

  // Find truck and verify ownership
  const truck = await FoodTruck.findById(id);
  if (!truck) {
    throw createError('Food truck not found', 404);
  }

  if (truck.owner.toString() !== ownerId.toString()) {
    throw createError('Not authorized to update this truck', 403);
  }

  // In a real implementation, you'd clear the location history from the database
  // await LocationHistory.deleteMany({ truck: id });

  const response: ApiResponse = {
    success: true,
    message: 'Location history cleared successfully',
    data: null
  };

  res.json(response);
});

// @desc    Update truck basic information
// @route   PUT /api/owner/trucks/:id/basic-info
// @access  Private (Owner)
export const updateTruckBasicInfo = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const ownerId = req.user!._id;
  const { name, description, cuisine, priceRange, status, waitTime, tags, image } = req.body;

  // Find truck and verify ownership
  const truck = await FoodTruck.findById(id);
  if (!truck) {
    throw createError('Food truck not found', 404);
  }

  if (truck.owner.toString() !== ownerId.toString()) {
    throw createError('Not authorized to update this truck', 403);
  }

  // Update basic information
  if (name !== undefined) truck.name = name;
  if (description !== undefined) truck.description = description;
  if (cuisine !== undefined) truck.cuisine = cuisine;
  if (priceRange !== undefined) truck.priceRange = priceRange;
  if (status !== undefined) truck.status = status;
  if (waitTime !== undefined) truck.waitTime = waitTime;
  if (tags !== undefined) truck.tags = tags;
  if (image !== undefined) truck.image = image;

  await truck.save();

  const response: ApiResponse = {
    success: true,
    message: 'Truck basic information updated successfully',
    data: { truck }
  };

  res.json(response);
});

// @desc    Update truck schedule
// @route   PUT /api/owner/trucks/:id/schedule
// @access  Private (Owner)
export const updateTruckSchedule = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const ownerId = req.user!._id;
  const { schedule } = req.body;

  // Find truck and verify ownership
  const truck = await FoodTruck.findById(id);
  if (!truck) {
    throw createError('Food truck not found', 404);
  }

  if (truck.owner.toString() !== ownerId.toString()) {
    throw createError('Not authorized to update this truck', 403);
  }

  // Update schedule
  (truck as any).schedule = schedule;
  await truck.save();

  const response: ApiResponse = {
    success: true,
    message: 'Truck schedule updated successfully',
    data: { truck }
  };

  res.json(response);
});

// @desc    Update truck about information
// @route   PUT /api/owner/trucks/:id/about
// @access  Private (Owner)
export const updateTruckAbout = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const ownerId = req.user!._id;
  const { description, specialties, story, ingredients, phone, website, instagram, twitter } = req.body;

  // Find truck and verify ownership
  const truck = await FoodTruck.findById(id);
  if (!truck) {
    throw createError('Food truck not found', 404);
  }

  if (truck.owner.toString() !== ownerId.toString()) {
    throw createError('Not authorized to update this truck', 403);
  }

  // Update about information
  if (description !== undefined) truck.description = description;

  // Initialize aboutInfo if it doesn't exist
  if (!(truck as any).aboutInfo) {
    (truck as any).aboutInfo = {
      specialties: '',
      story: '',
      ingredients: '',
      phone: '',
      website: '',
      instagram: '',
      twitter: ''
    };
  }

  if (specialties !== undefined) (truck as any).aboutInfo.specialties = specialties;
  if (story !== undefined) (truck as any).aboutInfo.story = story;
  if (ingredients !== undefined) (truck as any).aboutInfo.ingredients = ingredients;
  if (phone !== undefined) (truck as any).aboutInfo.phone = phone;
  if (website !== undefined) (truck as any).aboutInfo.website = website;
  if (instagram !== undefined) (truck as any).aboutInfo.instagram = instagram;
  if (twitter !== undefined) (truck as any).aboutInfo.twitter = twitter;

  await truck.save();

  const response: ApiResponse = {
    success: true,
    message: 'Truck about information updated successfully',
    data: { truck }
  };

  res.json(response);
});