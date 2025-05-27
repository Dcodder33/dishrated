const Event = require('../models/Event');
const FoodTruck = require('../models/FoodTruck');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get all events with filtering and pagination
exports.getAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      eventType,
      startDate,
      endDate,
      location,
      organizer,
      status = 'published',
      featured
    } = req.query;

    // Build filter object
    const filter = { status };
    
    if (eventType) filter.eventType = eventType;
    if (organizer) filter.organizer = organizer;
    if (featured !== undefined) filter.featured = featured === 'true';
    
    // Date filtering
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Location-based filtering (if coordinates provided)
    if (location) {
      const [lat, lng, radius = 10] = location.split(',').map(Number);
      if (lat && lng) {
        filter['location.coordinates'] = {
          $near: {
            $geometry: { type: 'Point', coordinates: [lng, lat] },
            $maxDistance: radius * 1000 // Convert km to meters
          }
        };
      }
    }

    const events = await Event.find(filter)
      .populate('organizer', 'name email userType')
      .populate('participatingTrucks.truck', 'name image location')
      .sort({ date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      data: events,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email userType')
      .populate('participatingTrucks.truck', 'name image location contact');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// Create new event (Admin or Owner only)
exports.createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

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
    if (req.user.userType !== 'admin' && req.user.userType !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Only admins and food truck owners can create events'
      });
    }

    // If owner, they can only create truck_event or offer types
    if (req.user.userType === 'owner' && eventType === 'city_event') {
      return res.status(403).json({
        success: false,
        message: 'Food truck owners cannot create city events'
      });
    }

    const event = new Event({
      title,
      description,
      image,
      date: new Date(date),
      endDate: endDate ? new Date(endDate) : undefined,
      location,
      eventType,
      organizer: req.user._id,
      organizerType: req.user.userType,
      maxParticipants,
      registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
      tags,
      requirements,
      contactInfo,
      pricing
    });

    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'name email userType');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: populatedEvent
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// Update event (Only organizer or admin)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check permissions
    if (req.user.userType !== 'admin' && 
        event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own events'
      });
    }

    const allowedUpdates = [
      'title', 'description', 'image', 'date', 'endDate', 'location',
      'maxParticipants', 'registrationDeadline', 'tags', 'requirements',
      'contactInfo', 'pricing', 'status', 'featured'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Only admins can set featured status
    if (req.body.featured !== undefined && req.user.userType !== 'admin') {
      delete updates.featured;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('organizer', 'name email userType');

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// Delete event (Only organizer or admin)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check permissions
    if (req.user.userType !== 'admin' && 
        event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own events'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

// Participate in event (Food truck owners only)
exports.participateInEvent = async (req, res) => {
  try {
    if (req.user.userType !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Only food truck owners can participate in events'
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get user's food truck
    const foodTruck = await FoodTruck.findOne({ owner: req.user._id });
    if (!foodTruck) {
      return res.status(400).json({
        success: false,
        message: 'You must have a registered food truck to participate'
      });
    }

    // Check if truck can participate
    const canParticipate = event.canTruckParticipate(foodTruck._id);
    if (!canParticipate.canParticipate) {
      return res.status(400).json({
        success: false,
        message: canParticipate.reason
      });
    }

    // Add truck to event
    await event.addParticipatingTruck(foodTruck._id, 'confirmed');

    const updatedEvent = await Event.findById(event._id)
      .populate('participatingTrucks.truck', 'name image location');

    res.json({
      success: true,
      message: 'Successfully registered for event',
      data: updatedEvent
    });
  } catch (error) {
    console.error('Error participating in event:', error);
    res.status(500).json({
      success: false,
      message: 'Error participating in event',
      error: error.message
    });
  }
};

// Withdraw from event (Food truck owners only)
exports.withdrawFromEvent = async (req, res) => {
  try {
    if (req.user.userType !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Only food truck owners can withdraw from events'
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get user's food truck
    const foodTruck = await FoodTruck.findOne({ owner: req.user._id });
    if (!foodTruck) {
      return res.status(400).json({
        success: false,
        message: 'Food truck not found'
      });
    }

    // Remove truck from event
    await event.removeParticipatingTruck(foodTruck._id);

    res.json({
      success: true,
      message: 'Successfully withdrawn from event'
    });
  } catch (error) {
    console.error('Error withdrawing from event:', error);
    res.status(500).json({
      success: false,
      message: 'Error withdrawing from event',
      error: error.message
    });
  }
};

// Get events by organizer
exports.getEventsByOrganizer = async (req, res) => {
  try {
    const { organizerId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const filter = { organizer: organizerId };
    if (status) filter.status = status;

    const events = await Event.find(filter)
      .populate('organizer', 'name email userType')
      .populate('participatingTrucks.truck', 'name image location')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      data: events,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching organizer events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching organizer events',
      error: error.message
    });
  }
};
