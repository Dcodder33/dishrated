import { apiService } from './api';

export interface OwnerDashboardData {
  trucks: any[];
  stats: {
    totalTrucks: number;
    totalReviews: number;
    averageRating: number;
    upcomingEvents: number;
  };
  upcomingEvents: any[];
}

export interface OwnerAnalytics {
  trucks: number;
  recentReviews: number;
  ratingTrends: Array<{
    _id: string;
    averageRating: number;
    reviewCount: number;
  }>;
  topRatedTruck: any;
}

export interface LocationUpdate {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface StatusUpdate {
  status: 'open' | 'closed' | 'opening-soon';
  waitTime?: string;
}

export interface CreateTruckData {
  name: string;
  description: string;
  cuisine: string;
  image?: string;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  priceRange?: 'budget' | 'mid' | 'premium';
  tags?: string[];
}

export class OwnerService {
  async getDashboard(): Promise<OwnerDashboardData> {
    const response = await apiService.get<OwnerDashboardData>('/owner/dashboard');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch dashboard data');
  }

  async getOwnerTrucks(): Promise<any[]> {
    const response = await apiService.get<{ trucks: any[] }>('/owner/trucks');

    if (response.success && response.data) {
      return response.data.trucks;
    }

    throw new Error(response.message || 'Failed to fetch owner trucks');
  }

  async createTruck(truckData: CreateTruckData): Promise<any> {
    const response = await apiService.post<{ truck: any }>('/owner/trucks', truckData);

    if (response.success && response.data) {
      return response.data.truck;
    }

    throw new Error(response.message || 'Failed to create food truck');
  }

  async getTruck(truckId: string): Promise<any> {
    const response = await apiService.get<{ truck: any }>(`/owner/trucks/${truckId}`);

    if (response.success && response.data) {
      return response.data.truck;
    }

    throw new Error(response.message || 'Failed to fetch truck data');
  }

  async updateTruck(truckId: string, updateData: Partial<CreateTruckData>): Promise<any> {
    const response = await apiService.put<{ truck: any }>(`/owner/trucks/${truckId}`, updateData);

    if (response.success && response.data) {
      return response.data.truck;
    }

    throw new Error(response.message || 'Failed to update truck');
  }

  async addMenuItem(truckId: string, menuItem: any): Promise<any> {
    const response = await apiService.post<{ truck: any }>(`/owner/trucks/${truckId}/menu`, menuItem);

    if (response.success && response.data) {
      return response.data.truck;
    }

    throw new Error(response.message || 'Failed to add menu item');
  }

  async updateMenuItem(truckId: string, menuItemId: string, updateData: any): Promise<any> {
    const response = await apiService.put<{ truck: any }>(`/owner/trucks/${truckId}/menu/${menuItemId}`, updateData);

    if (response.success && response.data) {
      return response.data.truck;
    }

    throw new Error(response.message || 'Failed to update menu item');
  }

  async deleteMenuItem(truckId: string, menuItemId: string): Promise<any> {
    const response = await apiService.delete<{ truck: any }>(`/owner/trucks/${truckId}/menu/${menuItemId}`);

    if (response.success && response.data) {
      return response.data.truck;
    }

    throw new Error(response.message || 'Failed to delete menu item');
  }

  async updateTruckLocation(truckId: string, locationData: LocationUpdate): Promise<any> {
    const response = await apiService.put<{ truck: any }>(`/owner/trucks/${truckId}/location`, locationData);

    if (response.success && response.data) {
      return response.data.truck;
    }

    throw new Error(response.message || 'Failed to update truck location');
  }

  async updateTruckStatus(truckId: string, statusData: StatusUpdate): Promise<any> {
    const response = await apiService.put<{ truck: any }>(`/owner/trucks/${truckId}/status`, statusData);

    if (response.success && response.data) {
      return response.data.truck;
    }

    throw new Error(response.message || 'Failed to update truck status');
  }

  async getAnalytics(period: number = 30): Promise<OwnerAnalytics> {
    const response = await apiService.get<OwnerAnalytics>('/owner/analytics', { period });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch analytics data');
  }

  async quickStatusToggle(truckId: string, currentStatus: string): Promise<any> {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    return this.updateTruckStatus(truckId, { status: newStatus });
  }

  async updateWaitTime(truckId: string, waitTime: string): Promise<any> {
    // Get current truck status first
    const trucks = await this.getOwnerTrucks();
    const truck = trucks.find(t => t._id === truckId);

    if (!truck) {
      throw new Error('Truck not found');
    }

    return this.updateTruckStatus(truckId, {
      status: truck.status,
      waitTime
    });
  }

  // Live location sharing methods
  async toggleLocationSharing(truckId: string, enabled: boolean): Promise<any> {
    const response = await apiService.put<{ truck: any }>(`/owner/trucks/${truckId}/location-sharing`, { enabled });

    if (response.success && response.data) {
      return response.data.truck;
    }

    throw new Error(response.message || 'Failed to toggle location sharing');
  }

  async getLocationHistory(truckId: string): Promise<any[]> {
    const response = await apiService.get<{ history: any[] }>(`/owner/trucks/${truckId}/location-history`);

    if (response.success && response.data) {
      return response.data.history;
    }

    throw new Error(response.message || 'Failed to fetch location history');
  }

  async clearLocationHistory(truckId: string): Promise<void> {
    const response = await apiService.delete(`/owner/trucks/${truckId}/location-history`);

    if (!response.success) {
      throw new Error(response.message || 'Failed to clear location history');
    }
  }

  async shareCurrentLocation(truckId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Reverse geocoding to get address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            const locationData = {
              coordinates: { latitude, longitude },
              address: data.display_name || 'Current location'
            };

            const result = await this.updateTruckLocation(truckId, locationData);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          let errorMessage = 'Failed to get current location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location permissions.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }
}

export const ownerService = new OwnerService();
