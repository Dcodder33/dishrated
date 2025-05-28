import { apiService } from './api';
import { Review } from '../types';

export interface CreateReviewData {
  truckId: string;
  dishId?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export interface ReviewFilters {
  page?: number;
  limit?: number;
  rating?: string;
  reviewType?: string;
  sortBy?: string;
}

export class ReviewService {
  async getTruckReviews(truckId: string, filters: ReviewFilters = {}): Promise<{
    reviews: Review[];
    pagination: any;
    ratingStats: any
  }> {
    const response = await apiService.get<{
      reviews: Review[];
      pagination: any;
      ratingStats: any
    }>(`/reviews/truck/${truckId}`, filters);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch reviews');
  }

  async getDishReviews(dishId: string, filters: ReviewFilters = {}): Promise<{
    reviews: Review[];
    pagination: any;
    ratingStats: any;
    dish: any;
  }> {
    const response = await apiService.get<{
      reviews: Review[];
      pagination: any;
      ratingStats: any;
      dish: any;
    }>(`/reviews/dish/${dishId}`, filters);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch dish reviews');
  }

  async getUserReviews(page?: number, limit?: number): Promise<{ reviews: Review[]; pagination: any }> {
    const params = { page, limit };
    const response = await apiService.get<{ reviews: Review[]; pagination: any }>('/reviews/user', params);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to fetch user reviews');
  }

  async createReview(reviewData: CreateReviewData): Promise<Review> {
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

  async markHelpful(reviewId: string): Promise<{ review: Review; message: string }> {
    const response = await apiService.put<{ review: Review; message: string }>(`/reviews/${reviewId}/helpful`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to mark review as helpful');
  }

  async respondToReview(reviewId: string, message: string): Promise<{ review: Review; message: string }> {
    const response = await apiService.post<{ review: Review; message: string }>(`/reviews/${reviewId}/respond`, { message });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to respond to review');
  }

  async reportReview(reviewId: string, reason: string): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>(`/reviews/${reviewId}/report`, { reason });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to report review');
  }
}

export const reviewService = new ReviewService();
