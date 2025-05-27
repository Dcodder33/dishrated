import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Edit, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TruckImage {
  id: string;
  url: string;
  caption?: string;
  isAdvertisement?: boolean;
  order: number;
}

interface TruckImageCarouselProps {
  images: TruckImage[];
  truckName: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
  height?: string;
  editable?: boolean;
  onEdit?: (images: TruckImage[]) => void;
  onImageClick?: (image: TruckImage, index: number) => void;
}

const TruckImageCarousel: React.FC<TruckImageCarouselProps> = ({
  images = [],
  truckName,
  autoPlay = true,
  autoPlayInterval = 4000,
  showControls = true,
  showIndicators = true,
  className = '',
  height = '300px',
  editable = false,
  onEdit,
  onImageClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);

  // Default images if none provided
  const defaultImages: TruckImage[] = [
    {
      id: 'default-1',
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center',
      caption: `${truckName} - Exterior View`,
      order: 1
    },
    {
      id: 'default-2',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center',
      caption: `${truckName} - Kitchen`,
      order: 2
    },
    {
      id: 'default-3',
      url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop&crop=center',
      caption: `${truckName} - Food Display`,
      order: 3
    }
  ];

  const displayImages = images.length > 0 ? images.sort((a, b) => a.order - b.order) : defaultImages;

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || isHovered || displayImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered, displayImages.length, autoPlayInterval]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? displayImages.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === displayImages.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleImageClick = () => {
    if (onImageClick && displayImages[currentIndex]) {
      onImageClick(displayImages[currentIndex], currentIndex);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(displayImages);
    }
  };

  if (displayImages.length === 0) {
    return (
      <div 
        className={cn("relative bg-gray-200 flex items-center justify-center", className)}
        style={{ height }}
      >
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
          </div>
          <p className="text-sm">No images available</p>
          {editable && (
            <Button size="sm" className="mt-2" onClick={handleEditClick}>
              <Plus className="h-4 w-4 mr-1" />
              Add Images
            </Button>
          )}
        </div>
      </div>
    );
  }

  const currentImage = displayImages[currentIndex];

  return (
    <div 
      className={cn("relative overflow-hidden rounded-lg group", className)}
      style={{ height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <div 
        className="relative w-full h-full cursor-pointer"
        onClick={handleImageClick}
      >
        <img
          src={currentImage.url}
          alt={currentImage.caption || `${truckName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center';
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Advertisement Badge */}
        {currentImage.isAdvertisement && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-foodtruck-gold text-black font-medium">
              Featured
            </Badge>
          </div>
        )}
        
        {/* Image Caption */}
        {currentImage.caption && (
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white text-sm font-medium drop-shadow-lg">
              {currentImage.caption}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      {showControls && displayImages.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Play/Pause Control */}
      {autoPlay && displayImages.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            togglePlayPause();
          }}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      )}

      {/* Edit Button */}
      {editable && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-12 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleEditClick}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}

      {/* Indicators */}
      {showIndicators && displayImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
          {displayImages.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                index === currentIndex 
                  ? "bg-white scale-125" 
                  : "bg-white/50 hover:bg-white/75"
              )}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="absolute top-3 left-3 bg-black/20 text-white text-xs px-2 py-1 rounded">
        {currentIndex + 1} / {displayImages.length}
      </div>
    </div>
  );
};

export default TruckImageCarousel;
