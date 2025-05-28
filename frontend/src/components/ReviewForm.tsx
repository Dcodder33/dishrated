import React, { useState } from 'react';
import { Star, Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ReviewFormProps {
  truckId: string;
  dishId?: string;
  dishName?: string;
  truckName: string;
  onSubmit: (reviewData: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  truckId,
  dishId,
  dishName,
  truckName,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (title.trim().length < 2) {
      alert('Please enter a title (at least 2 characters)');
      return;
    }

    if (comment.trim().length < 10) {
      alert('Please enter a comment (at least 10 characters)');
      return;
    }

    const reviewData = {
      truckId,
      dishId,
      rating,
      title: title.trim(),
      comment: comment.trim(),
      images
    };

    await onSubmit(reviewData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, you'd upload these to a cloud service
      // For now, we'll just create placeholder URLs
      const newImages = Array.from(files).map((file, index) => 
        `https://placeholder-image-url.com/${Date.now()}-${index}`
      );
      setImages(prev => [...prev, ...newImages].slice(0, 5)); // Max 5 images
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const StarRating = () => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none"
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setRating(star)}
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              star <= (hoveredRating || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">
        {rating > 0 && (
          <>
            {rating} star{rating !== 1 ? 's' : ''}
            {rating === 1 && ' - Poor'}
            {rating === 2 && ' - Fair'}
            {rating === 3 && ' - Good'}
            {rating === 4 && ' - Very Good'}
            {rating === 5 && ' - Excellent'}
          </>
        )}
      </span>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Write a Review
        </CardTitle>
        <p className="text-gray-600">
          {dishId ? (
            <>
              Reviewing <span className="font-semibold">{dishName}</span> from{' '}
              <span className="font-semibold">{truckName}</span>
            </>
          ) : (
            <>
              Reviewing <span className="font-semibold">{truckName}</span>
            </>
          )}
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <Label className="text-base font-medium">Rating *</Label>
            <div className="mt-2">
              <StarRating />
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-base font-medium">
              Review Title *
            </Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience..."
              maxLength={100}
              className="mt-1"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {title.length}/100 characters
            </p>
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment" className="text-base font-medium">
              Your Review *
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience..."
              rows={4}
              maxLength={1000}
              className="mt-1"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {comment.length}/1000 characters (minimum 10)
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-base font-medium">
              Photos (Optional)
            </Label>
            <div className="mt-2">
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload photos (max 5)
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={images.length >= 5}
                />
              </label>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0 || title.length < 2 || comment.length < 10}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
