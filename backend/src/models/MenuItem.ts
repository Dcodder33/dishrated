import mongoose, { Document, Schema } from 'mongoose';
import Review from './Review';

export interface IMenuItem extends Document {
  truck: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  ingredients: string[];
  allergens: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sodium?: number;
  };
  preparationTime: number; // in minutes
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spiceLevel: 'none' | 'mild' | 'medium' | 'hot' | 'extra-hot';
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>({
  truck: {
    type: Schema.Types.ObjectId,
    ref: 'Truck',
    required: [true, 'Truck is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(v: number) {
        return v >= 0 && Number.isFinite(v);
      },
      message: 'Price must be a valid positive number'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: [
      'appetizers',
      'mains',
      'sides',
      'desserts',
      'beverages',
      'snacks',
      'salads',
      'soups',
      'sandwiches',
      'burgers',
      'tacos',
      'pizza',
      'pasta',
      'seafood',
      'vegetarian',
      'vegan',
      'other'
    ],
    index: true
  },
  image: {
    type: String,
    trim: true
  },
  isAvailable: {
    type: Boolean,
    default: true,
    index: true
  },
  ingredients: [{
    type: String,
    trim: true,
    maxlength: [50, 'Ingredient name cannot exceed 50 characters']
  }],
  allergens: [{
    type: String,
    trim: true,
    enum: [
      'dairy',
      'eggs',
      'fish',
      'shellfish',
      'tree-nuts',
      'peanuts',
      'wheat',
      'soy',
      'sesame',
      'sulfites'
    ]
  }],
  nutritionalInfo: {
    calories: {
      type: Number,
      min: [0, 'Calories cannot be negative']
    },
    protein: {
      type: Number,
      min: [0, 'Protein cannot be negative']
    },
    carbs: {
      type: Number,
      min: [0, 'Carbs cannot be negative']
    },
    fat: {
      type: Number,
      min: [0, 'Fat cannot be negative']
    },
    fiber: {
      type: Number,
      min: [0, 'Fiber cannot be negative']
    },
    sodium: {
      type: Number,
      min: [0, 'Sodium cannot be negative']
    }
  },
  preparationTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: [1, 'Preparation time must be at least 1 minute'],
    max: [120, 'Preparation time cannot exceed 120 minutes']
  },
  isVegetarian: {
    type: Boolean,
    default: false,
    index: true
  },
  isVegan: {
    type: Boolean,
    default: false,
    index: true
  },
  isGlutenFree: {
    type: Boolean,
    default: false,
    index: true
  },
  spiceLevel: {
    type: String,
    enum: ['none', 'mild', 'medium', 'hot', 'extra-hot'],
    default: 'none',
    index: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Average rating cannot be negative'],
    max: [5, 'Average rating cannot exceed 5']
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: [0, 'Total reviews cannot be negative']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
menuItemSchema.index({ truck: 1, category: 1, isAvailable: 1 });
menuItemSchema.index({ averageRating: -1, totalReviews: -1 });
menuItemSchema.index({ price: 1 });
menuItemSchema.index({ isVegetarian: 1, isVegan: 1, isGlutenFree: 1 });

// Virtual for formatted price
menuItemSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Virtual for dietary tags
menuItemSchema.virtual('dietaryTags').get(function() {
  const tags = [];
  if (this.isVegan) tags.push('Vegan');
  else if (this.isVegetarian) tags.push('Vegetarian');
  if (this.isGlutenFree) tags.push('Gluten-Free');
  return tags;
});

// Virtual for spice level display
menuItemSchema.virtual('spiceLevelDisplay').get(function() {
  const levels = {
    'none': 'No Spice',
    'mild': '🌶️ Mild',
    'medium': '🌶️🌶️ Medium',
    'hot': '🌶️🌶️🌶️ Hot',
    'extra-hot': '🌶️🌶️🌶️🌶️ Extra Hot'
  };
  return levels[this.spiceLevel] || 'No Spice';
});

// Method to update rating statistics
menuItemSchema.methods.updateRatingStats = async function() {
  const stats = await Review.getAverageRating(this.truck.toString(), 'dish');

  this.averageRating = stats.averageRating;
  this.totalReviews = stats.totalReviews;

  return this.save();
};

// Static method to get popular items for a truck
menuItemSchema.statics.getPopularItems = async function(truckId: string, limit: number = 5) {
  return this.find({
    truck: truckId,
    isAvailable: true
  })
  .sort({ averageRating: -1, totalReviews: -1 })
  .limit(limit)
  .populate('truck', 'name');
};

export default mongoose.model<IMenuItem>('MenuItem', menuItemSchema);
