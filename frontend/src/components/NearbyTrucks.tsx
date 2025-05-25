import React, { useState } from 'react';
import FoodTruckCard from './FoodTruckCard';
import TruckMap from './TruckMap';
import { cn } from '@/lib/utils';
import { MapPin, List, X } from 'lucide-react';

// Mock data for nearby food trucks with Indian and Chinese names
const nearbyTrucks = [
  {
    id: 'Rollicious-The Roll Company',
    name: 'Rollicious The Roll Company',
    image: 'eggtruck.jpg',
    cuisine: 'North Indian',
    rating: 4.8,
    reviewCount: 132,
    distance: '0.3 mi',
    status: 'open' as const,
    waitTime: '5 min',
  },
  {
    id: 'wok-wonder',
    name: 'Wok Wonder',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    cuisine: 'Chinese',
    rating: 4.5,
    reviewCount: 89,
    distance: '0.5 mi',
    status: 'open' as const,
    waitTime: '10 min',
  },
  {
    id: 'spice-route',
    name: 'Spice Route',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80',
    cuisine: 'South Indian',
    rating: 4.7,
    reviewCount: 76,
    distance: '0.7 mi',
    status: 'open' as const,
    waitTime: '15 min',
  },
  {
    id: 'dragon-express',
    name: 'Dragon Express',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    cuisine: 'Chinese',
    rating: 4.3,
    reviewCount: 45,
    distance: '1.2 mi',
    status: 'open' as const,
    waitTime: '20 min',
  },
];

const NearbyTrucks = () => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null);
  
  const toggleViewMode = () => {
    setViewMode(viewMode === 'map' ? 'list' : 'map');
  };
  
  return (
    <section className="py-16 bg-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foodtruck-slate mb-2">Nearby Food Trucks</h2>
            <p className="text-foodtruck-slate/80 max-w-2xl">
              Discover delicious food trucks around your current location.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="flex items-center bg-white rounded-full shadow-sm p-1">
              <button
                onClick={() => setViewMode('map')}
                className={cn(
                  "flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  viewMode === 'map'
                    ? "bg-foodtruck-teal text-white"
                    : "text-foodtruck-slate hover:text-foodtruck-teal"
                )}
              >
                <MapPin className="h-4 w-4 mr-1.5" />
                Map
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  viewMode === 'list'
                    ? "bg-foodtruck-teal text-white"
                    : "text-foodtruck-slate hover:text-foodtruck-teal"
                )}
              >
                <List className="h-4 w-4 mr-1.5" />
                List
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Map Section - Always visible on large screens, conditionally visible on small screens */}
            <div 
              className={cn(
                "lg:w-3/5 h-[400px] lg:h-auto transition-opacity duration-300",
                (viewMode === 'map' || window.innerWidth >= 1024) ? "block" : "hidden"
              )}
            >
              <TruckMap />
            </div>
            
            {/* List Section - Always visible on large screens, conditionally visible on small screens */}
            <div 
              className={cn(
                "lg:w-2/5 border-l border-gray-200 transition-opacity duration-300",
                (viewMode === 'list' || window.innerWidth >= 1024) ? "block" : "hidden"
              )}
            >
              <div className="h-[400px] lg:h-[600px] overflow-y-auto bg-yellow-100">

                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-foodtruck-slate">
                    {nearbyTrucks.length} Food Trucks Nearby
                  </h3>
                </div>
                
                <div>
                  {nearbyTrucks.map((truck) => (
                    <div 
                      key={truck.id}
                      className={cn(
                        "p-4 border-b border--200 transition-colors",
                        selectedTruck === truck.id ? "bg-foodtruck-lightgray" : "hover:bg-foodtruck-lightgray/100"
                      )}
                      onMouseEnter={() => setSelectedTruck(truck.id)}
                      onMouseLeave={() => setSelectedTruck(null)}
                    >
                      <div className="flex space-x-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={truck.image} 
                            alt={truck.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foodtruck-slate truncate">{truck.name}</h4>
                          <p className="text-sm text-foodtruck-slate/70">{truck.cuisine}</p>
                          <div className="flex items-center mt-1">
                            <span className="flex items-center text-sm text-foodtruck-slate/80">
                              <svg className="w-4 h-4 text-foodtruck-gold mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                              {truck.rating} ({truck.reviewCount})
                            </span>
                            <span className="mx-2 text-foodtruck-slate/50">•</span>
                            <span className="text-sm text-foodtruck-slate/80">{truck.distance}</span>
                          </div>
                          <div className="flex items-center mt-2">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              <span className="w-1.5 h-1.5 bg-green-800 rounded-full mr-1"></span>
                              Open Now
                            </span>
                            <span className="text-xs text-foodtruck-slate/70 ml-2">{truck.waitTime} wait</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-foodtruck-teal text-white font-medium shadow-lg hover:bg-foodtruck-slate transition-colors">
            View All Nearby Trucks
          </button>
        </div>
      </div>
    </section>
  );
};

export default NearbyTrucks;
