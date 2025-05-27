import { apiService } from './api';
import { FoodTruck, TruckFilters, MenuItem } from '../types';

export class FoodTruckService {
  async getAllTrucks(filters?: TruckFilters): Promise<{ trucks: FoodTruck[]; pagination: any }> {
    const response = await apiService.get<{ trucks: FoodTruck[]; pagination: any }>('/trucks', filters);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch trucks');
  }

  async getTruckById(id: string): Promise<FoodTruck> {
    const response = await apiService.get<{ truck: FoodTruck }>(`/trucks/${id}`);

    if (response.success && response.data) {
      return response.data.truck;
    }

    throw new Error(response.message || 'Failed to fetch truck');
  }

  async getNearbyTrucks(lat: number, lng: number, maxDistance?: number): Promise<FoodTruck[]> {
    const params = { lat, lng, maxDistance: maxDistance || 10 };
    const response = await apiService.get<{ trucks: FoodTruck[] }>('/trucks/nearby', params);

    if (response.success && response.data) {
      return response.data.trucks;
    }

    throw new Error(response.message || 'Failed to fetch nearby trucks');
  }

  async getTrendingTrucks(limit?: number): Promise<FoodTruck[]> {
    const params = limit ? { limit } : undefined;
    const response = await apiService.get<{ trucks: FoodTruck[] }>('/trucks/trending', params);

    if (response.success && response.data) {
      return response.data.trucks;
    }

    throw new Error(response.message || 'Failed to fetch trending trucks');
  }

  async createTruck(truckData: Partial<FoodTruck>): Promise<FoodTruck> {
    const response = await apiService.post<{ truck: FoodTruck }>('/trucks', truckData);

    if (response.success && response.data) {
      return response.data.truck;
    }

    throw new Error(response.message || 'Failed to create truck');
  }

  async updateTruck(id: string, truckData: Partial<FoodTruck>): Promise<FoodTruck> {
    const response = await apiService.put<{ truck: FoodTruck }>(`/trucks/${id}`, truckData);

    if (response.success && response.data) {
      return response.data.truck;
    }

    throw new Error(response.message || 'Failed to update truck');
  }

  async deleteTruck(id: string): Promise<void> {
    const response = await apiService.delete(`/trucks/${id}`);

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete truck');
    }
  }

  // Menu methods
  async getTruckMenu(truckId: string): Promise<{ menu: MenuItem[]; truckName: string }> {
    const response = await apiService.get<{ menu: MenuItem[]; truckName: string }>(`/trucks/${truckId}/menu`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch menu');
  }

  async addMenuItem(truckId: string, menuItem: MenuItem): Promise<MenuItem[]> {
    const response = await apiService.post<{ menu: MenuItem[] }>(`/trucks/${truckId}/menu`, { menuItem });

    if (response.success && response.data) {
      return response.data.menu;
    }

    throw new Error(response.message || 'Failed to add menu item');
  }

  async updateMenuItem(truckId: string, itemId: string, menuItem: Partial<MenuItem>): Promise<MenuItem[]> {
    const response = await apiService.put<{ menu: MenuItem[] }>(`/trucks/${truckId}/menu/${itemId}`, { menuItem });

    if (response.success && response.data) {
      return response.data.menu;
    }

    throw new Error(response.message || 'Failed to update menu item');
  }

  async deleteMenuItem(truckId: string, itemId: string): Promise<MenuItem[]> {
    const response = await apiService.delete<{ menu: MenuItem[] }>(`/trucks/${truckId}/menu/${itemId}`);

    if (response.success && response.data) {
      return response.data.menu;
    }

    throw new Error(response.message || 'Failed to delete menu item');
  }

  async toggleMenuItemAvailability(truckId: string, itemId: string): Promise<MenuItem> {
    const response = await apiService.patch<{ menuItem: MenuItem }>(`/trucks/${truckId}/menu/${itemId}/toggle`);

    if (response.success && response.data) {
      return response.data.menuItem;
    }

    throw new Error(response.message || 'Failed to toggle menu item');
  }
}

export const foodTruckService = new FoodTruckService();
