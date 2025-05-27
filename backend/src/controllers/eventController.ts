import { Request, Response } from 'express';
import { Event, FoodTruck } from '../models';
import { asyncHandler, createError } from '../middleware';
import { getPaginationOptions, createPaginationResult } from '../utils';
import { ApiResponse } from '../types';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationOptions(req);
  const {
    search,
    status = 'published',
    eventType,
    startDate,
    endDate,
    location,
    organizer,
    featured
  } = req.query;

  // Build query
  let query: any = {
    status,
    approvalStatus: 'approved' // Only show approved events to public
  };

  if (search) {
    query.$text = { $search: search as string };
  }

  if (eventType) {
    query.eventType = eventType;
  }

  if (organizer) {
    query.organizer = organizer;
  }

  if (featured !== undefined) {
    query.featured = featured === 'true';
  }

  // Date filtering
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate as string);
    if (endDate) query.date.$lte = new Date(endDate as string);
  }

  // Location-based filtering (if coordinates provided)
  if (location) {
    const [lat, lng, radius = 10] = (location as string).split(',').map(Number);
    if (lat && lng) {
      query['location.coordinates'] = {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }
  }

  // Execute query
  const events = await Event.find(query)
    .populate('organizer', 'name email userType')
    .populate('participatingTrucks.truck', 'name image location')
    .sort({ date: 1 })
    .skip(skip)
    .limit(limit);

  const total = await Event.countDocuments(query);
  const pagination = createPaginationResult(page, limit, total);

  const response: ApiResponse = {
    success: true,
    message: 'Events retrieved successfully',
    data: {
      events,
      pagination
    }
  };

  res.json(response);
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id)
    .populate('organizer', 'name email phone')
    .populate('participatingTrucks', 'name image cuisine rating location');

  if (!event) {
    throw createError('Event not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Event retrieved successfully',
    data: {
      event
    }
  };

  res.json(response);
});

// @desc    Create event
// @route   POST /api/events
// @access  Private (Admin/Owner)
export const createEvent = asyncHandler(async (req: Request, res: Response) => {
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
    requirements,
    contactInfo,
    pricing
  } = req.body;

  // Validate user permissions
  if (req.user!.userType !== 'admin' && req.user!.userType !== 'owner') {
    throw createError('Only admins and food truck owners can create events', 403);
  }

  // Note: Food truck owners can now create city events, but they require admin approval

  const eventData = {
    title,
    description,
    image,
    date: new Date(date),
    endDate: endDate ? new Date(endDate) : undefined,
    location,
    eventType,
    organizer: req.user!._id,
    organizerType: req.user!.userType,
    maxParticipants,
    registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
    tags,
    requirements,
    contactInfo,
    pricing
  };

  const event = await Event.create(eventData);
  await event.populate('organizer', 'name email userType');

  const response: ApiResponse = {
    success: true,
    message: 'Event created successfully',
    data: {
      event
    }
  };

  res.status(201).json(response);
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin/Owner)
export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    throw createError('Event not found', 404);
  }

  // Check permissions - only admin or event organizer can update
  if (req.user!.userType !== 'admin' &&
      event.organizer.toString() !== req.user!._id.toString()) {
    throw createError('You can only edit your own events', 403);
  }

  const allowedUpdates = [
    'title', 'description', 'image', 'date', 'endDate', 'location',
    'maxParticipants', 'registrationDeadline', 'tags', 'requirements',
    'contactInfo', 'pricing', 'status', 'featured'
  ];

  const updates: any = {};
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  // Only admins can set featured status
  if (req.body.featured !== undefined && req.user!.userType !== 'admin') {
    delete updates.featured;
  }

  event = await Event.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true
    }
  ).populate('organizer', 'name email userType')
   .populate('participatingTrucks.truck', 'name image location');

  const response: ApiResponse = {
    success: true,
    message: 'Event updated successfully',
    data: {
      event
    }
  };

  res.json(response);
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin/Owner)
export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    throw createError('Event not found', 404);
  }

  // Check permissions - only admin or event organizer can delete
  if (req.user!.userType !== 'admin' &&
      event.organizer.toString() !== req.user!._id.toString()) {
    throw createError('You can only delete your own events', 403);
  }

  await Event.findByIdAndDelete(req.params.id);

  const response: ApiResponse = {
    success: true,
    message: 'Event deleted successfully'
  };

  res.json(response);
});

// @desc    Register food truck for event
// @route   POST /api/events/:id/register
// @access  Private (Owner)
export const registerForEvent = asyncHandler(async (req: Request, res: Response) => {
  if (req.user!.userType !== 'owner') {
    throw createError('Only food truck owners can participate in events', 403);
  }

  const event = await Event.findById(req.params.id);
  if (!event) {
    throw createError('Event not found', 404);
  }

  // Get user's food truck
  const truck = await FoodTruck.findOne({ owner: req.user!._id });
  if (!truck) {
    throw createError('You must have a registered food truck to participate', 400);
  }

  // Check if truck can participate
  const canParticipate = event.canTruckParticipate(truck._id);
  if (!canParticipate.canParticipate) {
    throw createError(canParticipate.reason || 'Cannot participate in this event', 400);
  }

  // Add truck to event
  await event.addParticipatingTruck(truck._id, 'confirmed');

  const updatedEvent = await Event.findById(event._id)
    .populate('participatingTrucks.truck', 'name image location');

  const response: ApiResponse = {
    success: true,
    message: 'Successfully registered for event',
    data: {
      event: updatedEvent
    }
  };

  res.json(response);
});

// @desc    Unregister food truck from event
// @route   DELETE /api/events/:id/unregister
// @access  Private (Owner)
export const unregisterFromEvent = asyncHandler(async (req: Request, res: Response) => {
  if (req.user!.userType !== 'owner') {
    throw createError('Only food truck owners can withdraw from events', 403);
  }

  const event = await Event.findById(req.params.id);
  if (!event) {
    throw createError('Event not found', 404);
  }

  // Get user's food truck
  const truck = await FoodTruck.findOne({ owner: req.user!._id });
  if (!truck) {
    throw createError('Food truck not found', 400);
  }

  // Remove truck from event
  await event.removeParticipatingTruck(truck._id);

  const response: ApiResponse = {
    success: true,
    message: 'Successfully withdrawn from event'
  };

  res.json(response);
});

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Public
export const getUpcomingEvents = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 10 } = req.query;

  const events = await Event.find({
    date: { $gte: new Date() },
    status: 'published',
    approvalStatus: 'approved'
  })
    .populate('organizer', 'name email userType')
    .populate('participatingTrucks.truck', 'name image location')
    .sort({ date: 1 })
    .limit(parseInt(limit as string));

  const response: ApiResponse = {
    success: true,
    message: 'Upcoming events retrieved successfully',
    data: {
      events
    }
  };

  res.json(response);
});

// @desc    Get events by organizer
// @route   GET /api/events/organizer/:organizerId
// @access  Public
export const getEventsByOrganizer = asyncHandler(async (req: Request, res: Response) => {
  const { organizerId } = req.params;
  const { page, limit, skip } = getPaginationOptions(req);
  const { status } = req.query;

  const filter: any = { organizer: organizerId };
  if (status) filter.status = status;

  // If the requester is not the organizer or an admin, only show approved events
  if (req.user && (req.user._id.toString() === organizerId || req.user.userType === 'admin')) {
    // Show all events (including pending) to the organizer or admin
  } else {
    // Only show approved events to others
    filter.approvalStatus = 'approved';
  }

  const events = await Event.find(filter)
    .populate('organizer', 'name email userType')
    .populate('participatingTrucks.truck', 'name image location')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Event.countDocuments(filter);
  const pagination = createPaginationResult(page, limit, total);

  const response: ApiResponse = {
    success: true,
    message: 'Organizer events retrieved successfully',
    data: {
      events,
      pagination
    }
  };

  res.json(response);
});
