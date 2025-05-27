// src/components/FoodTruckCard.tsx
import React from 'react';
import { Heart, Star, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface FoodTruckCardProps {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  distance?: string;
  status?: 'open' | 'closed' | 'opening-soon';
  featured?: boolean;
  waitTime?: string;
  className?: string;
  owner?: {
    name: string;
    email?: string;
  };
  showOwner?: boolean;
}

const FoodTruckCard = ({
  id,
  name,
  image,
  cuisine,
  rating,
  reviewCount,
  distance,
  status = 'open',
  featured = false,
  waitTime,
  className,
  owner,
  showOwner = false,
}: FoodTruckCardProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1",
        featured ? "bg-white shadow-lg" : "bg-white/80 backdrop-blur-sm shadow-md",
        className
      )}
    >
      {featured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center rounded-full bg-foodtruck-gold/90 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-foodtruck-slate">
            Featured
          </span>
        </div>
      )}

      <div className="relative h-48 overflow-hidden group">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
        <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors duration-300 group">
          <Heart className="h-5 w-5 text-foodtruck-teal group-hover:text-foodtruck-gold transition-colors duration-300" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-white border border-transparent group-hover:border-foodtruck-gold/50 transition-all duration-300">
                {cuisine}
              </span>
            </div>
            <div className="flex items-center text-white bg-foodtruck-gold/80 px-2 py-0.5 rounded-full">
              <Star className="h-4 w-4 text-white mr-1" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              <span className="text-xs ml-1 text-white/90">({reviewCount})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t-2 border-transparent group-hover:border-foodtruck-gold/30 transition-colors duration-300">
        <Link to={`/trucks/${id}`}>
          <h3 className="font-serif text-lg font-medium text-foodtruck-slate mb-2 hover:text-foodtruck-teal transition-colors gold-underline">
            {name}
          </h3>
        </Link>

        {showOwner && owner && (
          <p className="text-sm text-foodtruck-slate/70 mb-2">
            by {owner.name}
          </p>
        )}

        <div className="flex items-center justify-between text-sm mb-3">
          {status === 'open' && (
            <span className="flex items-center text-green-600">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-1.5"></span>
              Open Now
            </span>
          )}
          {status === 'closed' && (
            <span className="flex items-center text-red-500">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>
              Closed
            </span>
          )}
          {status === 'opening-soon' && (
            <span className="flex items-center text-amber-500">
              <span className="w-2 h-2 bg-amber-500 rounded-full mr-1.5"></span>
              Opening Soon
            </span>
          )}

          {waitTime && (
            <span className="flex items-center text-foodtruck-slate text-xs">
              <Clock className="h-3.5 w-3.5 text-foodtruck-slate/70 mr-1" />
              {waitTime} wait
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          {distance && (
            <span className="flex items-center text-foodtruck-slate/80">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {distance} away
            </span>
          )}

          <Link to={`/trucks/${id}`} className="text-foodtruck-teal font-medium hover:text-foodtruck-gold transition-colors duration-300 text-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FoodTruckCard;
