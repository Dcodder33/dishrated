import React, { useState } from 'react';
import { Search, MapPin, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  
  const filters = [
    { id: 'all', label: 'All Cuisines' },
    { id: 'mexican', label: 'Mexican' },
    { id: 'asian', label: 'Asian' },
    { id: 'bbq', label: 'BBQ' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'dessert', label: 'Dessert' },
    { id: 'coffee', label: 'Coffee' }
  ];

  const handleSearchFocus = () => {
    setIsExpanded(true);
  };

  const handleSearchBlur = () => {
    if (!searchValue) {
      setIsExpanded(false);
    }
  };

  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(filterId === selectedFilter ? null : filterId);
  };

  const clearSearch = () => {
    setSearchValue('');
    setIsExpanded(false);
  };

  return (
    <div className="relative min-h-[80vh] flex items-center bg-[#FFF9C4] overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9C4] via-foodtruck-lightgray to-[#FFF9C4] z-0"></div>
      
      {/* Decorative circles */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-foodtruck-red/5 rounded-full animate-float"></div>
      <div className="absolute top-20 -left-20 w-64 h-64 bg-foodtruck-red/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-foodtruck-red/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      
      {/* Content container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Hero Text */}
          <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
            <div className="inline-block px-3 py-1 rounded-full bg-foodtruck-teal/10 text-foodtruck-teal text-sm font-medium mb-4 animate-fade-in">
              Discover Local Flavors
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foodtruck-slate mb-4 leading-tight animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Track. Taste. <br />
              <span className="text-foodtruck-teal">Thrive.</span>
            </h1>
            <p className="text-lg text-foodtruck-slate/80 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Find the best food trucks near you, track their locations in real-time, and discover your next favorite meal on wheels.
            </p>
          </div>
          
          {/* Hero Illustration */}
          <div className="lg:w-1/2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="relative">
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-transparent hover:border-red-500/50 hover:shadow-red-500 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                  alt="Food truck illustration"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-foodtruck-slate/30 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;