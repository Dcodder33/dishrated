import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      res.status(400).json({
        success: false,
        message: 'Validation error',
        error: errorMessage
      });
      return;
    }

    next();
  };
};

// User validation schemas
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'owner').optional(),
  phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional(),
  preferences: Joi.object({
    cuisines: Joi.array().items(Joi.string()).optional(),
    maxDistance: Joi.number().min(1).max(100).optional(),
    priceRange: Joi.string().valid('budget', 'mid', 'premium').optional()
  }).optional()
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required()
});

// Food truck validation schemas
export const createFoodTruckSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(1000).required(),
  image: Joi.string().uri().required(),
  cuisine: Joi.string().required(),
  location: Joi.object({
    address: Joi.string().required(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required()
    }).required()
  }).required(),
  priceRange: Joi.string().valid('budget', 'mid', 'premium').optional(),
  tags: Joi.array().items(Joi.string()).optional()
});

export const updateFoodTruckSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().max(1000).optional(),
  image: Joi.string().uri().optional(),
  cuisine: Joi.string().optional(),
  location: Joi.object({
    address: Joi.string().optional(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).optional(),
      longitude: Joi.number().min(-180).max(180).optional()
    }).optional()
  }).optional(),
  status: Joi.string().valid('open', 'closed', 'opening-soon').optional(),
  waitTime: Joi.string().optional(),
  featured: Joi.boolean().optional(),
  priceRange: Joi.string().valid('budget', 'mid', 'premium').optional(),
  tags: Joi.array().items(Joi.string()).optional()
});

// Event validation schemas
export const createEventSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(2000).required(),
  image: Joi.string().uri().required(),
  date: Joi.date().iso().greater('now').required(),
  endDate: Joi.date().iso().optional(),
  location: Joi.object({
    address: Joi.string().required(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required()
    }).required()
  }).required(),
  eventType: Joi.string().valid('city_event', 'truck_event', 'offer').required(),
  maxParticipants: Joi.number().min(1).max(1000).optional().allow(null),
  registrationDeadline: Joi.date().iso().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  requirements: Joi.string().max(1000).optional().allow(''),
  contactInfo: Joi.object({
    email: Joi.string().email().optional().allow(''),
    phone: Joi.string().optional().allow('')
  }).optional(),
  pricing: Joi.object({
    participationFee: Joi.number().min(0).optional(),
    currency: Joi.string().optional()
  }).optional()
});

export const updateEventSchema = Joi.object({
  title: Joi.string().min(2).max(200).optional(),
  description: Joi.string().max(2000).optional(),
  image: Joi.string().uri().optional().allow(''),
  date: Joi.date().greater('now').optional(),
  endDate: Joi.date().optional(),
  location: Joi.object({
    address: Joi.string().optional(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).optional(),
      longitude: Joi.number().min(-180).max(180).optional()
    }).optional()
  }).optional(),
  eventType: Joi.string().valid('city_event', 'truck_event', 'offer').optional(),
  maxParticipants: Joi.number().min(1).max(1000).optional(),
  registrationDeadline: Joi.date().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  requirements: Joi.string().max(1000).optional(),
  contactInfo: Joi.object({
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    website: Joi.string().uri().optional()
  }).optional(),
  pricing: Joi.object({
    participationFee: Joi.number().min(0).optional(),
    currency: Joi.string().optional()
  }).optional(),
  status: Joi.string().valid('draft', 'published', 'cancelled', 'completed').optional(),
  featured: Joi.boolean().optional()
});

// Review validation schemas
export const createReviewSchema = Joi.object({
  truckId: Joi.string().required(),
  dishId: Joi.string().optional(), // For dish-specific reviews
  rating: Joi.number().integer().min(1).max(5).required(),
  title: Joi.string().min(2).max(100).required(),
  comment: Joi.string().min(10).max(1000).required(),
  images: Joi.array().items(Joi.string().uri()).max(5).optional()
});

export const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional(),
  title: Joi.string().min(2).max(100).optional(),
  comment: Joi.string().min(10).max(1000).optional(),
  images: Joi.array().items(Joi.string().uri()).max(5).optional()
});

export const respondToReviewSchema = Joi.object({
  message: Joi.string().min(10).max(500).required()
});

// Menu item validation schemas
export const menuItemSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().required(),
  image: Joi.string().uri().optional(),
  isAvailable: Joi.boolean().optional(),
  allergens: Joi.array().items(Joi.string()).optional(),
  isVegetarian: Joi.boolean().optional(),
  isVegan: Joi.boolean().optional()
});

export const addMenuItemSchema = Joi.object({
  menuItem: menuItemSchema.required()
});

export const updateMenuItemSchema = Joi.object({
  menuItem: menuItemSchema.optional()
});

// Owner validation schemas
export const updateLocationSchema = Joi.object({
  address: Joi.string().required(),
  coordinates: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required()
  }).required()
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid('open', 'closed', 'opening-soon').required(),
  waitTime: Joi.string().optional()
});

// Owner truck creation schema
export const createOwnerTruckSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  cuisine: Joi.string().min(2).max(50).required(),
  image: Joi.string().uri().optional().allow(''),
  location: Joi.object({
    address: Joi.string().required(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required()
    }).required()
  }).required(),
  priceRange: Joi.string().valid('budget', 'mid', 'premium').optional(),
  tags: Joi.array().items(Joi.string()).optional()
});


