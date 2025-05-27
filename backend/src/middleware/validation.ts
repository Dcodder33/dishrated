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
  date: Joi.date().greater('now').required(),
  location: Joi.object({
    address: Joi.string().required(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required()
    }).required()
  }).required(),
  maxTrucks: Joi.number().min(1).max(100).required(),
  registrationDeadline: Joi.date().required()
});

export const updateEventSchema = Joi.object({
  title: Joi.string().min(2).max(200).optional(),
  description: Joi.string().max(2000).optional(),
  image: Joi.string().uri().optional(),
  date: Joi.date().greater('now').optional(),
  location: Joi.object({
    address: Joi.string().optional(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).optional(),
      longitude: Joi.number().min(-180).max(180).optional()
    }).optional()
  }).optional(),
  maxTrucks: Joi.number().min(1).max(100).optional(),
  registrationDeadline: Joi.date().optional(),
  status: Joi.string().valid('upcoming', 'ongoing', 'completed', 'cancelled').optional()
});

// Review validation schemas
export const createReviewSchema = Joi.object({
  truck: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().max(1000).required(),
  images: Joi.array().items(Joi.string().uri()).optional()
});

export const updateReviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).optional(),
  comment: Joi.string().max(1000).optional(),
  images: Joi.array().items(Joi.string().uri()).optional()
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


