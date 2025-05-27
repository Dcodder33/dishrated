import { apiService } from './api';
import { Event, EventFilters } from '../types';

export class EventService {
  async getAllEvents(filters?: EventFilters): Promise<{ events: Event[]; pagination: any }> {
    const response = await apiService.get<any>('/events', filters);

    if (response.success && response.data) {
      return {
        events: response.data.events || [],
        pagination: response.data.pagination
      };
    }

    throw new Error(response.message || 'Failed to fetch events');
  }

  async getEventById(id: string): Promise<Event> {
    const response = await apiService.get<{ event: Event }>(`/events/${id}`);

    if (response.success && response.data) {
      return response.data.event;
    }

    throw new Error(response.message || 'Failed to fetch event');
  }

  async getUpcomingEvents(limit?: number): Promise<Event[]> {
    const params = limit ? { limit } : undefined;
    const response = await apiService.get<{ events: Event[] }>('/events/upcoming', params);

    if (response.success && response.data) {
      return response.data.events;
    }

    throw new Error(response.message || 'Failed to fetch upcoming events');
  }

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const response = await apiService.post<{ event: Event }>('/events', eventData);

    if (response.success && response.data) {
      return response.data.event;
    }

    throw new Error(response.message || 'Failed to create event');
  }

  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    const response = await apiService.put<{ event: Event }>(`/events/${id}`, eventData);

    if (response.success && response.data) {
      return response.data.event;
    }

    throw new Error(response.message || 'Failed to update event');
  }

  async deleteEvent(id: string): Promise<void> {
    const response = await apiService.delete(`/events/${id}`);

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete event');
    }
  }

  async registerTruckForEvent(eventId: string, truckId?: string): Promise<Event> {
    const response = await apiService.post<{ event: Event }>(`/events/${eventId}/register`, truckId ? { truckId } : {});

    if (response.success && response.data) {
      return response.data.event;
    }

    throw new Error(response.message || 'Failed to register truck for event');
  }

  async unregisterTruckFromEvent(eventId: string, truckId?: string): Promise<Event> {
    const response = await apiService.delete<{ event: Event }>(`/events/${eventId}/unregister`);

    if (response.success && response.data) {
      return response.data.event;
    }

    throw new Error(response.message || 'Failed to unregister truck from event');
  }

  async getEventsByOrganizer(organizerId: string, filters?: EventFilters): Promise<{ events: Event[]; pagination: any }> {
    const params = { ...filters };
    const response = await apiService.get<{ events: Event[]; pagination: any }>(`/events/organizer/${organizerId}`, params);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch organizer events');
  }

  async searchEvents(query: string, filters?: EventFilters): Promise<{ events: Event[]; pagination: any }> {
    const searchFilters = { ...filters, search: query };
    return this.getAllEvents(searchFilters);
  }

  async getEventsByLocation(latitude: number, longitude: number, radius: number = 10, filters?: EventFilters): Promise<{ events: Event[]; pagination: any }> {
    const locationFilters = {
      ...filters,
      location: `${latitude},${longitude},${radius}`
    };
    return this.getAllEvents(locationFilters);
  }

  async getFeaturedEvents(limit: number = 5): Promise<Event[]> {
    const response = await this.getAllEvents({ featured: true, limit, status: 'published' });
    return response.events;
  }

  async getEventsByType(eventType: 'city_event' | 'truck_event' | 'offer', filters?: EventFilters): Promise<{ events: Event[]; pagination: any }> {
    const typeFilters = { ...filters, eventType };
    return this.getAllEvents(typeFilters);
  }
}

export const eventService = new EventService();
