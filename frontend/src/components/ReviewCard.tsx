import React, { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, MoreVertical, Edit, Trash2, Flag } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

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

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
  currentUserRole?: string;
  isOwner?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  onMarkHelpful?: (reviewId: string) => void;
  onRespond?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  currentUserId,
  currentUserRole,
  isOwner,
  onEdit,
  onDelete,
  onMarkHelpful,
  onRespond,
  onReport
}) => {
  const [showFullComment, setShowFullComment] = useState(false);
  const [isHelpfulLoading, setIsHelpfulLoading] = useState(false);

  const isOwnReview = currentUserId === review.user._id;
  const canEdit = isOwnReview;
  const canDelete = isOwnReview || currentUserRole === 'admin';
  const canRespond = isOwner && !review.response;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleMarkHelpful = async () => {
    if (!onMarkHelpful || isHelpfulLoading) return;
    
    setIsHelpfulLoading(true);
    try {
      await onMarkHelpful(review._id);
    } finally {
      setIsHelpfulLoading(false);
    }
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  const truncatedComment = review.comment.length > 200 
    ? review.comment.substring(0, 200) + '...'
    : review.comment;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback>
                {review.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">
                  {review.user.name}
                </h4>
                {review.isVerified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2 mt-1">
                <StarRating rating={review.rating} />
                <span className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              
              {review.dish && (
                <p className="text-sm text-gray-600 mt-1">
                  Reviewed: <span className="font-medium">{review.dish.name}</span>
                </p>
              )}
            </div>
          </div>

          {/* Actions Menu */}
          {(canEdit || canDelete || canRespond || onReport) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEdit && onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(review)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Review
                  </DropdownMenuItem>
                )}
                {canDelete && onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(review._id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Review
                  </DropdownMenuItem>
                )}
                {canRespond && onRespond && (
                  <DropdownMenuItem onClick={() => onRespond(review._id)}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Respond
                  </DropdownMenuItem>
                )}
                {!isOwnReview && onReport && (
                  <DropdownMenuItem onClick={() => onReport(review._id)}>
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Review Content */}
        <div className="mb-4">
          <h5 className="font-semibold text-gray-900 mb-2">
            {review.title}
          </h5>
          
          <p className="text-gray-700 leading-relaxed">
            {showFullComment ? review.comment : truncatedComment}
            {review.comment.length > 200 && (
              <button
                onClick={() => setShowFullComment(!showFullComment)}
                className="text-blue-600 hover:text-blue-800 ml-1 font-medium"
              >
                {showFullComment ? 'Show less' : 'Read more'}
              </button>
            )}
          </p>
        </div>

        {/* Images */}
        {review.images && review.images.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => {
                    // In a real app, you'd open a lightbox/modal here
                    window.open(image, '_blank');
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Owner Response */}
        {review.response && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline">Owner Response</Badge>
              <span className="text-sm text-gray-500">
                {formatDate(review.response.respondedAt)}
              </span>
            </div>
            <p className="text-gray-700">
              {review.response.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-4 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkHelpful}
            disabled={isHelpfulLoading || isOwnReview}
            className="flex items-center space-x-1"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Helpful ({review.helpfulVotes})</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
