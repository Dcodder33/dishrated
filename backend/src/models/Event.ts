import mongoose, { Schema } from 'mongoose';
import { IEvent } from '../types';

const eventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  image: {
    type: String,
    required: [true, 'Event image is required']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(value: Date) {
        return value > new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  endDate: {
    type: Date
  },
  location: {
    address: {
      type: String,
      required: [true, 'Event address is required']
    },
    coordinates: {
      latitude: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      longitude: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    }
  },
  eventType: {
    type: String,
    enum: ['city_event', 'truck_event', 'offer'],
    required: [true, 'Event type is required']
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Event organizer is required']
  },
  organizerType: {
    type: String,
    enum: ['admin', 'owner'],
    required: [true, 'Organizer type is required']
  },
  participatingTrucks: [{
    truck: {
      type: Schema.Types.ObjectId,
      ref: 'FoodTruck'
    },
    confirmedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'declined'],
      default: 'pending'
    }
  }],
  maxParticipants: {
    type: Number,
    default: null // null means unlimited
  },
  registrationDeadline: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  requirements: {
    type: String // Special requirements for participating trucks
  },
  contactInfo: {
    email: String,
    phone: String
  },
  pricing: {
    participationFee: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'published'
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: function() {
      // Auto-approve for admin-created city events and owner-created truck events/offers
      if (this.eventType === 'city_event' && this.organizerType === 'admin') {
        return 'approved';
      }
      if ((this.eventType === 'truck_event' || this.eventType === 'offer') && this.organizerType === 'owner') {
        return 'approved';
      }
      // Require approval for owner-created city events
      return 'pending';
    }
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
eventSchema.index({ date: 1, eventType: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ 'location.coordinates': '2dsphere' });
eventSchema.index({ status: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ approvalStatus: 1 });
eventSchema.index({ organizerType: 1, eventType: 1 });

// Text index for search functionality
eventSchema.index({
  title: 'text',
  description: 'text'
});

// Virtual for participant count
eventSchema.virtual('participantCount').get(function() {
  return this.participatingTrucks.filter((p: any) => p.status === 'confirmed').length;
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  if (!this.maxParticipants) return null;
  return this.maxParticipants - this.participantCount;
});

// Virtual for checking if registration is open
eventSchema.virtual('isRegistrationOpen').get(function() {
  const now = new Date();
  return (!this.registrationDeadline || now < this.registrationDeadline) &&
         this.status === 'published' &&
         (!this.maxParticipants || this.participantCount < this.maxParticipants);
});

// Method to check if truck can participate
eventSchema.methods.canTruckParticipate = function(truckId: string) {
  // Check if registration deadline has passed
  if (this.registrationDeadline && new Date() > this.registrationDeadline) {
    return { canParticipate: false, reason: 'Registration deadline has passed' };
  }

  // Check if event is full
  if (this.maxParticipants && this.participantCount >= this.maxParticipants) {
    return { canParticipate: false, reason: 'Event is full' };
  }

  // Check if truck is already participating
  const existingParticipation = this.participatingTrucks.find(
    (p: any) => p.truck.toString() === truckId.toString()
  );

  if (existingParticipation) {
    return {
      canParticipate: false,
      reason: `Already ${existingParticipation.status}`,
      currentStatus: existingParticipation.status
    };
  }

  return { canParticipate: true };
};

// Method to add participating truck
eventSchema.methods.addParticipatingTruck = function(truckId: string, status = 'pending') {
  const canParticipate = this.canTruckParticipate(truckId);
  if (!canParticipate.canParticipate && !canParticipate.currentStatus) {
    throw new Error(canParticipate.reason);
  }

  // If truck is already participating, update status
  const existingIndex = this.participatingTrucks.findIndex(
    (p: any) => p.truck.toString() === truckId.toString()
  );

  if (existingIndex !== -1) {
    this.participatingTrucks[existingIndex].status = status;
    this.participatingTrucks[existingIndex].confirmedAt = new Date();
  } else {
    this.participatingTrucks.push({
      truck: truckId,
      status: status,
      confirmedAt: new Date()
    });
  }

  return this.save();
};

// Method to remove participating truck
eventSchema.methods.removeParticipatingTruck = function(truckId: string) {
  this.participatingTrucks = this.participatingTrucks.filter(
    (p: any) => p.truck.toString() !== truckId.toString()
  );
  return this.save();
};

export default mongoose.model<IEvent>('Event', eventSchema);
