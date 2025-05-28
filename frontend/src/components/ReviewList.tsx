import React, { useState, useEffect } from 'react';
import { Star, Filter, SortAsc } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import { useAuth } from '../contexts/AuthContext';
import { reviewService } from '../services/reviewService';

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  truck: {
    _id: string;
    name: string;
  };
  dish?: {
    _id: string;
    name: string;
  };
  rating: number;
  title: string;
  comment: string;
  reviewType: 'truck' | 'dish';
  isVerified: boolean;
  helpfulVotes: number;
  images?: string[];
  response?: {
    message: string;
    respondedAt: string;
    respondedBy: {
      _id: string;
      name: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

interface RatingStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

interface ReviewListProps {
  truckId: string;
  truckName: string;
  dishId?: string;
  dishName?: string;
  isOwner?: boolean;
  showWriteReview?: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  truckId,
  truckName,
  dishId,
  dishName,
  isOwner = false,
  showWriteReview = true
}) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [reviewType, setReviewType] = useState('all');

  useEffect(() => {
    fetchReviews();
  }, [truckId, dishId, currentPage, sortBy, filterRating, reviewType]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: currentPage,
        limit: 10,
        sortBy,
        ...(filterRating !== 'all' && { rating: filterRating }),
        ...(reviewType !== 'all' && { reviewType })
      };

      let response;
      if (dishId) {
        response = await reviewService.getDishReviews(dishId, params);
      } else {
        response = await reviewService.getTruckReviews(truckId, params);
      }

      setReviews(response.reviews);
      setRatingStats(response.ratingStats);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async (reviewData: any) => {
    try {
      await reviewService.createReview(reviewData);
      setShowReviewForm(false);
      fetchReviews(); // Refresh reviews
    } catch (error) {
      console.error('Failed to create review:', error);
      throw error;
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await reviewService.markHelpful(reviewId);
      fetchReviews(); // Refresh to show updated helpful count
    } catch (error) {
      console.error('Failed to mark review as helpful:', error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await reviewService.deleteReview(reviewId);
      fetchReviews(); // Refresh reviews
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const RatingOverview = () => {
    if (!ratingStats) return null;

    const { averageRating, totalReviews, ratingDistribution } = ratingStats;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">
            {dishId ? `${dishName} Reviews` : `${truckName} Reviews`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center space-x-2 mb-1">
                    <span className="text-sm w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const FilterControls = () => (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="highest">Highest Rated</SelectItem>
          <SelectItem value="lowest">Lowest Rated</SelectItem>
          <SelectItem value="helpful">Most Helpful</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filterRating} onValueChange={setFilterRating}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ratings</SelectItem>
          <SelectItem value="5">5 Stars</SelectItem>
          <SelectItem value="4">4 Stars</SelectItem>
          <SelectItem value="3">3 Stars</SelectItem>
          <SelectItem value="2">2 Stars</SelectItem>
          <SelectItem value="1">1 Star</SelectItem>
        </SelectContent>
      </Select>

      {!dishId && (
        <Select value={reviewType} onValueChange={setReviewType}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Review Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="truck">Truck Reviews</SelectItem>
            <SelectItem value="dish">Dish Reviews</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );

  if (showReviewForm) {
    return (
      <ReviewForm
        truckId={truckId}
        dishId={dishId}
        dishName={dishName}
        truckName={truckName}
        onSubmit={handleCreateReview}
        onCancel={() => setShowReviewForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <RatingOverview />

      {/* Write Review Button */}
      {showWriteReview && user && !isOwner && (
        <div className="flex justify-center">
          <Button onClick={() => setShowReviewForm(true)}>
            Write a Review
          </Button>
        </div>
      )}

      <FilterControls />

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">
              No reviews yet. Be the first to review!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              currentUserId={user?.id}
              currentUserRole={user?.role}
              isOwner={isOwner}
              onMarkHelpful={handleMarkHelpful}
              onDelete={handleDeleteReview}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <span className="flex items-center px-4 py-2 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
