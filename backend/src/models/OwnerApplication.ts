import { Schema, model, Document } from 'mongoose';

export interface IOwnerApplication extends Document {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  cuisineType: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: Schema.Types.ObjectId;
  rejectionReason?: string;
  notes?: string;
}

const ownerApplicationSchema = new Schema<IOwnerApplication>({
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [100, 'Business name cannot be more than 100 characters']
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true,
    maxlength: [50, 'Owner name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  cuisineType: {
    type: String,
    required: [true, 'Cuisine type is required'],
    enum: ['american', 'mexican', 'italian', 'asian', 'indian', 'mediterranean', 'fusion', 'other']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String,
    maxlength: [500, 'Rejection reason cannot be more than 500 characters']
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
ownerApplicationSchema.index({ email: 1 });
ownerApplicationSchema.index({ status: 1 });
ownerApplicationSchema.index({ submittedAt: -1 });

// Virtual for application age
ownerApplicationSchema.virtual('applicationAge').get(function() {
  const now = new Date();
  const submitted = this.submittedAt;
  const diffTime = Math.abs(now.getTime() - submitted.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

export default model<IOwnerApplication>('OwnerApplication', ownerApplicationSchema);
