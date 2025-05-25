import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Filter, List, Grid3X3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import TruckMap from '@/components/TruckMap';

const FindTrucks = () => {
  // Sample truck data
  const sampleTrucks = [
    {
      id: '1',
      name: 'Taco Haven',
      latitude: 40.7128,
      longitude: -74.0060
    },
    {
      id: '2',
      name: 'Seoul Food',
      latitude: 40.7135,
      longitude: -74.0075
    },
    {
      id: '3',
      name: 'Curry Cruiser',
      latitude: 40.7142,
      longitude: -74.0080
    },
    {
      id: '4',
      name: 'Pizza Wheels',
      latitude: 40.7148,
      longitude: -74.0085
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-yellow-50"> {/* Background changed to light yellow */}
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foodtruck-slate mb-2">Find Food Trucks</h1>
              <p className="text-foodtruck-slate/80">
                Discover and filter food trucks in your area
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <button className="inline-flex items-center px-4 py-2 rounded-lg border border-foodtruck-slate/20 text-foodtruck-slate hover:bg-foodtruck-lightgray">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              <div className="flex items-center bg-white rounded-lg shadow-sm p-1 border border-foodtruck-slate/20">
                <button className="p-1.5 rounded text-foodtruck-teal">
                  <List className="h-5 w-5" />
                </button>
                <button className="p-1.5 rounded text-foodtruck-slate/70 hover:text-foodtruck-slate">
                  <Grid3X3 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Now Green */}
            <div className="lg:w-1/4">
              <div className="bg-yellow-100 rounded-xl shadow-md p-6"> {/* Filter section changed to green */}
                <h2 className="font-medium text-lg text-foodtruck-slate mb-4">Filters</h2>
                
                {/* Location */}
                <div className="mb-6">
                  <h3 className="font-medium text-sm text-foodtruck-slate mb-2">Location</h3>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-foodtruck-slate/50" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your location"
                      className="block w-full pl-10 pr-3 py-2 border border-foodtruck-slate/20 rounded-lg text-foodtruck-slate placeholder:text-foodtruck-slate/50 focus:outline-none focus:ring-2 focus:ring-foodtruck-teal/50"
                    />
                  </div>
                </div>
                
                {/* Distance */}
                <div className="mb-6">
                  <h3 className="font-medium text-sm text-foodtruck-slate mb-2">Distance</h3>
                  <select className="block w-full px-3 py-2 border border-foodtruck-slate/20 rounded-lg text-foodtruck-slate focus:outline-none focus:ring-2 focus:ring-foodtruck-teal/50">
                    <option value="1">Within 1 Km</option>
                    <option value="3">Within 3 Km</option>
                    <option value="5" selected>Within 5 Km</option>
                    <option value="10">Within 10 Km</option>
                    <option value="25">Within 25 Km</option>
                  </select>
                </div>
                
                {/* Cuisine Type */}
                <div className="mb-6">
                  <h3 className="font-medium text-sm text-foodtruck-slate mb-2">Cuisine Type</h3>
                  <div className="space-y-2">
                    {['All', 'North Indian', 'South Indian', 'Non-veg', 'Veg', 'Dessert', 'Vegan', 'BBQ', 'Chinese'].map((cuisine) => (
                      <label key={cuisine} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-foodtruck-slate/30 text-foodtruck-teal focus:ring-foodtruck-teal/40"
                          defaultChecked={cuisine === 'All'}
                        />
                        <span className="ml-2 text-sm text-foodtruck-slate/80">{cuisine}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium text-sm text-foodtruck-slate mb-2">Price Range</h3>
                  <div className="flex space-x-2">
                    {['50₹', '100₹', '200₹'].map((price) => (
                      <button
                        key={price}
                        className={cn(
                          "flex-1 py-1.5 rounded border text-sm font-medium",
                          price === '₹' 
                            ? "bg-foodtruck-teal/10 border-foodtruck-teal text-foodtruck-teal"
                            : "border-foodtruck-slate/20 text-foodtruck-slate/70 hover:border-foodtruck-teal/50 hover:text-foodtruck-teal"
                        )}
                      >
                        {price}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Open Now */}
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-foodtruck-slate/30 text-foodtruck-teal focus:ring-foodtruck-teal/40"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-foodtruck-slate/80">Open Now</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Map & List View */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-[500px]">
                  <TruckMap />
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="font-medium text-lg text-foodtruck-slate mb-4">Search Results</h2>
                <p className="text-foodtruck-slate/80 mb-4">
                  To see the actual implementation with real food truck data and filtering functionality, this page would need backend integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FindTrucks;
