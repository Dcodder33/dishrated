import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  truck: mongoose.Types.ObjectId;
  dish?: mongoose.Types.ObjectId; // Optional - for dish-specific reviews
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  reviewType: 'truck' | 'dish';
  isVerified: boolean; // If user actually ordered from this truck
  helpfulVotes: number;
  reportCount: number;
  isHidden: boolean; // For moderation
  response?: {
    message: string;
    respondedAt: Date;
    respondedBy: mongoose.Types.ObjectId; // Truck owner who responded
  };
  images?: string[]; // Optional review images
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewModel extends Model<IReview> {
  getAverageRating(truckId: string, reviewType?: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
  }>;
}

const reviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true
  },
  truck: {
    type: Schema.Types.ObjectId,
    ref: 'Truck',
    required: [true, 'Food truck is required'],
    index: true
  },
  dish: {
    type: Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: false,
    index: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    validate: {
      validator: function(v: number) {
        return Number.isInteger(v) && v >= 1 && v <= 5;
      },
      message: 'Rating must be an integer between 1 and 5'
    }
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  reviewType: {
    type: String,
    enum: ['truck', 'dish'],
    required: true,
    index: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0,
    min: [0, 'Helpful votes cannot be negative']
  },
  reportCount: {
    type: Number,
    default: 0,
    min: [0, 'Report count cannot be negative']
  },
  isHidden: {
    type: Boolean,
    default: false,
    index: true
  },
  response: {
    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Response cannot exceed 500 characters']
    },
    respondedAt: {
      type: Date
    },
    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  images: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for efficient queries
reviewSchema.index({ truck: 1, reviewType: 1, isHidden: 1 });
reviewSchema.index({ user: 1, truck: 1, dish: 1 }, { unique: true }); // Prevent duplicate reviews
reviewSchema.index({ rating: 1, createdAt: -1 });
reviewSchema.index({ isVerified: 1, rating: -1 });

// Virtual for formatted rating
reviewSchema.virtual('formattedRating').get(function() {
  return this.rating.toFixed(1);
});

// Virtual for review age
reviewSchema.virtual('reviewAge').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - this.createdAt.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
});

// Method to check if user can edit this review
reviewSchema.methods.canEdit = function(userId: string) {
  return this.user.toString() === userId.toString();
};

// Method to check if review is recent (within 7 days)
reviewSchema.methods.isRecent = function() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return this.createdAt > sevenDaysAgo;
};

// Static method to get average rating for a truck
reviewSchema.statics.getAverageRating = async function(truckId: string, reviewType?: string) {
  const match: any = {
    truck: new mongoose.Types.ObjectId(truckId),
    isHidden: false
  };

  if (reviewType) {
    match.reviewType = reviewType;
  }

  const result = await this.aggregate([
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

// Pre-save middleware to set reviewType based on dish presence
reviewSchema.pre('save', function(next) {
  if (this.dish) {
    this.reviewType = 'dish';
  } else {
    this.reviewType = 'truck';
  }
  next();
});

export default mongoose.model<IReview, IReviewModel>('Review', reviewSchema);
