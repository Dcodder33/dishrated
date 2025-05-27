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
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'owner' | 'admin';
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

// Food Truck Types
export interface FoodTruck {
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
  owner: User | string;
  menu: MenuItem[];
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  priceRange: 'budget' | 'mid' | 'premium';
  tags: string[];
  distance?: string;
  createdAt: string;
  updatedAt: string;
}

// Menu Item Types
export interface MenuItem {
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
export interface Event {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  truckCount: number;
  participatingTrucks: FoodTruck[];
  organizer: User | string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  maxTrucks: number;
  registrationDeadline: string;
  isRegistrationOpen?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  _id: string;
  user: User;
  truck: FoodTruck | string;
  rating: number;
  comment: string;
  images?: string[];
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'owner';
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Search and Filter Types
export interface TruckFilters {
  search?: string;
  cuisine?: string;
  status?: string;
  featured?: boolean;
  priceRange?: string;
  lat?: number;
  lng?: number;
  maxDistance?: number;
  page?: number;
  limit?: number;
}

export interface EventFilters {
  search?: string;
  status?: string;
  upcoming?: boolean;
  page?: number;
  limit?: number;
}
