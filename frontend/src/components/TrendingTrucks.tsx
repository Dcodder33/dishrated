import React, { useState } from 'react';
import FoodTruckCard from './FoodTruckCard';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

// Mock data for trending food trucks with Indian and Chinese names and matching images
const trendingTrucks = [
  {
    id: 'masala-magic',
    name: 'Masala Magic',
    image: 'data:image/jpeg;base64,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',
    cuisine: 'North Indian',
    rating: 4.9,
    reviewCount: 213,
    featured: true,
  },
  {
    id: 'dim-sum-dynasty',
    name: 'Dim Sum Dynasty',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    cuisine: 'Chinese',
    rating: 4.7,
    reviewCount: 156,
    featured: true,
  },
  {
    id: 'mithai-junction',
    name: 'Mithai Junction',
    image: 'https://t4.ftcdn.net/jpg/13/10/08/75/240_F_1310087551_9TGQGAeaULYrmQRhY9dGhbCblJKoFggl.jpg',
    cuisine: 'Dessert',
    rating: 4.8,
    reviewCount: 178,
    featured: false,
  },
  {
    id: 'dosa-darbar',
    name: 'Dosa Darbar',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcLLFCOjSc9TLICJ9myaFU0LPwM3diEelCHg&s',
    cuisine: 'South Indian',
    rating: 4.6,
    reviewCount: 124,
    featured: false,
  },
  {
    id: 'Chinese-bites',
    name: 'Chinese Bites',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    cuisine: 'Chinese',
    rating: 4.5,
    reviewCount: 97,
    featured: false,
  },
  {
    id: 'lassi-lovers',
    name: 'Lassi Lovers',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB6COAerPLBwymgAXdSAqNnF4u-H4vbZrT4w&s',
    cuisine: 'Beverages',
    rating: 4.4,
    reviewCount: 85,
    featured: false,
  },
];

// Filter categories
const filterCategories = [
  { id: 'all', label: 'All' },
  { id: 'topRated', label: 'Top Rated' },
  { id: 'new', label: 'New Arrivals' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'dessert', label: 'Dessert' },
];

const TrendingTrucks = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();
  
  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    
    toast({
      title: "Filter Applied",
      description: `Showing ${filterId === 'all' ? 'all food trucks' : filterId + ' food trucks'}`,
    });
  };
  
  const handleExploreAll = () => {
    navigate('/find-trucks');
  };
  
  return (
    <section className="py-16 bg-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foodtruck-slate mb-4">Trending Food Trucks</h2>
          <p className="max-w-2xl mx-auto text-foodtruck-slate/80">
            Discover the most popular and highly-rated food trucks in your area.
          </p>
          
          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {filterCategories.map((category) => (
              <button
                key={category.id}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  activeFilter === category.id
                    ? "bg-foodtruck-teal text-white shadow-md scale-105"
                    : "bg-gray-100 text-foodtruck-slate hover:bg-gray-200"
                )}
                onClick={() => handleFilterClick(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Grid of food truck cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {trendingTrucks.map((truck, index) => (
            <div 
              key={truck.id} 
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s`, animationFillMode: 'forwards' }}
            >
              <FoodTruckCard
                id={truck.id}
                name={truck.name}
                image={truck.image}
                cuisine={truck.cuisine}
                rating={truck.rating}
                reviewCount={truck.reviewCount}
                featured={truck.featured}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button 
            onClick={handleExploreAll}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-foodtruck-teal text-foodtruck-teal font-medium hover:bg-foodtruck-teal hover:text-white transition-colors group relative overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-full bg-foodtruck-gold group-hover:translate-x-0"></span>
            <span className="relative">Explore All Trending Trucks</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingTrucks;
