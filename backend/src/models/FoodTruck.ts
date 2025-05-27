import mongoose, { Schema } from 'mongoose';
import { IFoodTruck, IMenuItem } from '../types';

const menuItemSchema = new Schema<IMenuItem>({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true,
    maxlength: [100, 'Menu item name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Menu item description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  allergens: [{
    type: String,
    trim: true
  }],
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const foodTruckSchema = new Schema<IFoodTruck>({
  name: {
    type: String,
    required: [true, 'Food truck name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  image: {
    type: String,
    default: ''
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine type is required'],
    trim: true
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    }
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'opening-soon'],
    default: 'closed'
  },
  waitTime: {
    type: String,
    default: '0 min'
  },
  featured: {
    type: Boolean,
    default: false
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  menu: [menuItemSchema],
  operatingHours: {
    monday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '17:00' },
      isOpen: { type: Boolean, default: true }
    },
    tuesday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '17:00' },
      isOpen: { type: Boolean, default: true }
    },
    wednesday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '17:00' },
      isOpen: { type: Boolean, default: true }
    },
    thursday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '17:00' },
      isOpen: { type: Boolean, default: true }
    },
    friday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '17:00' },
      isOpen: { type: Boolean, default: true }
    },
    saturday: {
      open: { type: String, default: '10:00' },
      close: { type: String, default: '16:00' },
      isOpen: { type: Boolean, default: true }
    },
    sunday: {
      open: { type: String, default: '10:00' },
      close: { type: String, default: '16:00' },
      isOpen: { type: Boolean, default: false }
    }
  },
  priceRange: {
    type: String,
    enum: ['budget', 'mid', 'premium'],
    default: 'mid'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isLocationSharingEnabled: {
    type: Boolean,
    default: false
  },
  lastLocationUpdate: {
    type: Date,
    default: Date.now
  },
  schedule: [{
    day: {
      type: String,
      required: true
    },
    hours: {
      type: String,
      default: 'Closed'
    },
    location: {
      type: String,
      default: ''
    }
  }],
  aboutInfo: {
    specialties: {
      type: String,
      default: ''
    },
    story: {
      type: String,
      default: ''
    },
    ingredients: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      default: ''
    },
    instagram: {
      type: String,
      default: ''
    },
    twitter: {
      type: String,
      default: ''
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
foodTruckSchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });
foodTruckSchema.index({ cuisine: 1 });
foodTruckSchema.index({ rating: -1 });
foodTruckSchema.index({ featured: -1 });
foodTruckSchema.index({ status: 1 });
foodTruckSchema.index({ owner: 1 });

// Text index for search functionality
foodTruckSchema.index({
  name: 'text',
  description: 'text',
  cuisine: 'text',
  tags: 'text'
});

export default mongoose.model<IFoodTruck>('FoodTruck', foodTruckSchema);
