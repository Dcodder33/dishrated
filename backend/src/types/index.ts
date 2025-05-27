import { Document } from 'mongoose';

// User Types
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'owner' | 'admin';
  userType: 'user' | 'owner' | 'admin'; // Alias for role for consistency
  avatar?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Food Truck Types
export interface IFoodTruck extends Document {
  _id: string;
  name: string;
  description: string;
  image: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'open' | 'closed' | 'opening-soon';
  waitTime: string;
  featured: boolean;
  owner: any; // User ID
  menu: any[];
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  priceRange: 'budget' | 'mid' | 'premium';
  tags: string[];
  isLocationSharingEnabled: boolean;
  lastLocationUpdate: Date;
  schedule?: {
    day: string;
    hours: string;
    location: string;
  }[];
  aboutInfo?: {
    specialties: string;
    story: string;
    ingredients: string;
    phone: string;
    website: string;
    instagram: string;
    twitter: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Menu Item Types
export interface IMenuItem {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  allergens: string[];
  isVegetarian: boolean;
  isVegan: boolean;
}

// Event Types
export interface IEvent extends Document {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: Date;
  endDate?: Date;
  location: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  eventType: 'city_event' | 'truck_event' | 'offer';
  organizer: any; // User ID
  organizerType: 'admin' | 'owner';
  participatingTrucks: Array<{
    truck: any; // Food Truck ID
    status: 'pending' | 'confirmed' | 'declined';
    confirmedAt: Date;
  }>;
  maxParticipants?: number;
  registrationDeadline?: Date;
  tags: string[];
  isActive: boolean;
  featured: boolean;
  requirements?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  pricing?: {
    participationFee: number;
    currency: string;
  };
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  // Virtual properties
  participantCount: number;
  availableSpots?: number;
  isRegistrationOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Methods
  canTruckParticipate(truckId: string): { canParticipate: boolean; reason?: string; currentStatus?: string };
  addParticipatingTruck(truckId: string, status?: string): Promise<IEvent>;
  removeParticipatingTruck(truckId: string): Promise<IEvent>;
}

// Review Types
export interface IReview extends Document {
  _id: string;
  user: any; // User ID
  truck: any; // Food Truck ID
  rating: number;
  comment: string;
  images?: string[];
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export interface IOrder extends Document {
  _id: string;
  user: any; // User ID
  truck: any; // Food Truck ID
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  estimatedTime: number; // in minutes
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  menuItem: any; // Menu Item ID
  quantity: number;
  price: number;
  customizations?: string[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Query Types
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  filter?: Record<string, any>;
}

// Authentication Types
export interface AuthRequest extends Request {
  user?: IUser;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}
