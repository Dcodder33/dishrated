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

  // Validate coordinates
  if (!coordinates || typeof coordinates.latitude !== 'number' || typeof coordinates.longitude !== 'number') {
    throw createError('Valid coordinates are required', 400);
  }

  if (!address || typeof address !== 'string' || address.trim().length === 0) {
    throw createError('Valid address is required', 400);
  }

  // Update location
  truck.location = {
    address: address.trim(),
    coordinates: {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    }
  };

  // Update last location update timestamp
  truck.lastLocationUpdate = new Date();

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
      address: 'Downtown Food Court Area',
      coordinates: { latitude: 40.7128, longitude: -74.0060 },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      duration: 120,
      isActive: true
    },
    {
      id: '2',
      address: 'Central Business District',
      coordinates: { latitude: 40.7589, longitude: -73.9851 },
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      duration: 180
    },
    {
      id: '3',
      address: 'University Campus Area',
      coordinates: { latitude: 40.7505, longitude: -73.9934 },
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

// @desc    Get owner's events (truck events and offers)
// @route   GET /api/owner/events
// @access  Private (Owner)
export const getOwnerEvents = asyncHandler(async (req: Request, res: Response) => {
  const { status, eventType, page = 1, limit = 10, search } = req.query;
  const ownerId = req.user!._id;

  const query: any = { organizer: ownerId };

  if (status && status !== 'all') {
    query.status = status;
  }

  if (eventType && eventType !== 'all') {
    query.eventType = eventType;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const events = await Event.find(query)
    .populate('organizer', 'name email')
    .populate('participatingTrucks.truck', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Event.countDocuments(query);

  const response: ApiResponse = {
    success: true,
    message: 'Events retrieved successfully',
    data: {
      events,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      }
    }
  };

  res.json(response);
});

// @desc    Create owner event (truck events, offers, or city event requests)
// @route   POST /api/owner/events
// @access  Private (Owner)
export const createOwnerEvent = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    image,
    date,
    endDate,
    location,
    eventType,
    maxParticipants,
    registrationDeadline,
    tags,
    featured,
    requirements,
    contactInfo,
    pricing
  } = req.body;

  const ownerId = req.user!._id;

  // Validate event type permissions
  if (eventType === 'city_event') {
    // City events by owners require admin approval
    const event = await Event.create({
      title,
      description,
      image,
      date,
      endDate,
      location,
      eventType: 'city_event',
      organizer: ownerId,
      organizerType: 'owner',
      maxParticipants,
      registrationDeadline,
      tags: tags || [],
      featured: false, // Only admins can set featured
      requirements,
      contactInfo,
      pricing,
      status: 'draft',
      approvalStatus: 'pending' // Requires admin approval
    });

    const response: ApiResponse = {
      success: true,
      message: 'City event request submitted for admin approval',
      data: { event }
    };

    return res.status(201).json(response);
  }

  // Truck events and offers are auto-approved
  if (eventType === 'truck_event' || eventType === 'offer') {
    const event = await Event.create({
      title,
      description,
      image,
      date,
      endDate,
      location,
      eventType,
      organizer: ownerId,
      organizerType: 'owner',
      maxParticipants,
      registrationDeadline,
      tags: tags || [],
      featured: featured || false,
      requirements,
      contactInfo,
      pricing,
      status: 'published',
      approvalStatus: 'approved' // Auto-approved
    });

    const response: ApiResponse = {
      success: true,
      message: 'Event created successfully',
      data: { event }
    };

    return res.status(201).json(response);
  }

  throw createError('Invalid event type', 400);
});

// @desc    Get city events for participation
// @route   GET /api/owner/city-events
// @access  Private (Owner)
export const getCityEventsForParticipation = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search } = req.query;

  const query: any = {
    eventType: 'city_event',
    organizerType: 'admin',
    status: 'published',
    approvalStatus: 'approved'
  };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const events = await Event.find(query)
    .populate('organizer', 'name email')
    .sort({ date: 1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Event.countDocuments(query);

  const response: ApiResponse = {
    success: true,
    message: 'City events retrieved successfully',
    data: {
      events,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      }
    }
  };

  res.json(response);
});

// @desc    Participate in city event
// @route   POST /api/owner/city-events/:id/participate
// @access  Private (Owner)
export const participateInCityEvent = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user!._id;

  // Get owner's food truck
  const truck = await FoodTruck.findOne({ owner: ownerId });
  if (!truck) {
    throw createError('Food truck not found. Please create your food truck profile first.', 404);
  }

  const event = await Event.findOne({
    _id: req.params.id,
    eventType: 'city_event',
    organizerType: 'admin',
    status: 'published',
    approvalStatus: 'approved'
  });

  if (!event) {
    throw createError('City event not found', 404);
  }

  // Check if truck can participate
  const canParticipate = event.canTruckParticipate(truck._id);
  if (!canParticipate.canParticipate) {
    throw createError(canParticipate.reason!, 400);
  }

  // Add truck to event
  await event.addParticipatingTruck(truck._id, 'confirmed');

  const response: ApiResponse = {
    success: true,
    message: 'Successfully joined the city event',
    data: { event }
  };

  res.json(response);
});