const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  eventType: {
    type: String,
    enum: ['city_event', 'truck_event', 'offer'],
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizerType: {
    type: String,
    enum: ['admin', 'owner'],
    required: true
  },
  participatingTrucks: [{
    truck: {
      type: mongoose.Schema.Types.ObjectId,
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
  }
}, {
  timestamps: true
});

// Index for efficient queries
eventSchema.index({ date: 1, eventType: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for participant count
eventSchema.virtual('participantCount').get(function() {
  return this.participatingTrucks.filter(p => p.status === 'confirmed').length;
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  if (!this.maxParticipants) return null;
  return this.maxParticipants - this.participantCount;
});

// Method to check if truck can participate
eventSchema.methods.canTruckParticipate = function(truckId) {
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
    p => p.truck.toString() === truckId.toString()
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
eventSchema.methods.addParticipatingTruck = function(truckId, status = 'pending') {
  const canParticipate = this.canTruckParticipate(truckId);
  if (!canParticipate.canParticipate && !canParticipate.currentStatus) {
    throw new Error(canParticipate.reason);
  }
  
  // If truck is already participating, update status
  const existingIndex = this.participatingTrucks.findIndex(
    p => p.truck.toString() === truckId.toString()
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
eventSchema.methods.removeParticipatingTruck = function(truckId) {
  this.participatingTrucks = this.participatingTrucks.filter(
    p => p.truck.toString() !== truckId.toString()
  );
  return this.save();
};

module.exports = mongoose.model('Event', eventSchema);
