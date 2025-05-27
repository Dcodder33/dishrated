import { apiService } from './api';
import { Review } from '../types';

export class ReviewService {
  async getTruckReviews(truckId: string, page?: number, limit?: number): Promise<{ reviews: Review[]; pagination: any }> {
    const params = { page, limit };
    const response = await apiService.get<{ reviews: Review[]; pagination: any }>(`/reviews/truck/${truckId}`, params);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch reviews');
  }

  async getUserReviews(page?: number, limit?: number): Promise<{ reviews: Review[]; pagination: any }> {
    const params = { page, limit };
    const response = await apiService.get<{ reviews: Review[]; pagination: any }>('/reviews/user', params);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch user reviews');
  }

  async createReview(reviewData: {
    truck: string;
    rating: number;
    comment: string;
    images?: string[];
  }): Promise<Review> {
    const response = await apiService.post<{ review: Review }>('/reviews', reviewData);
    
    if (response.success && response.data) {
      return response.data.review;
    }
    
    throw new Error(response.message || 'Failed to create review');
  }

  async updateReview(id: string, reviewData: Partial<Review>): Promise<Review> {
    const response = await apiService.put<{ review: Review }>(`/reviews/${id}`, reviewData);
    
    if (response.success && response.data) {
      return response.data.review;
    }
    
    throw new Error(response.message || 'Failed to update review');
  }

  async deleteReview(id: string): Promise<void> {
    const response = await apiService.delete(`/reviews/${id}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete review');
    }
  }

  async markReviewHelpful(id: string): Promise<Review> {
    const response = await apiService.put<{ review: Review }>(`/reviews/${id}/helpful`);
    
    if (response.success && response.data) {
      return response.data.review;
    }
    
    throw new Error(response.message || 'Failed to mark review as helpful');
  }
}

export const reviewService = new ReviewService();
