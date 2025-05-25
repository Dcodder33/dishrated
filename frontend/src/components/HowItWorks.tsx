
import React from 'react';
import { Search, MapPin, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Search,
    title: 'Search',
    description: 'Find food trucks by cuisine, location, or rating.',
    color: 'bg-blue-100 group-hover:bg-foodtruck-gold/20',
    textColor: 'text-blue-600 group-hover:text-foodtruck-gold',
    iconBorder: 'border-2 border-transparent group-hover:border-foodtruck-gold',
  },
  {
    icon: MapPin,
    title: 'Track',
    description: 'Follow real-time updates on their location and menu.',
    color: 'bg-amber-100 group-hover:bg-foodtruck-gold/20',
    textColor: 'text-amber-600 group-hover:text-foodtruck-gold',
    iconBorder: 'border-2 border-transparent group-hover:border-foodtruck-gold',
  },
  {
    icon: Truck,
    title: 'Enjoy',
    description: 'Visit the truck, order ahead, or join an event.',
    color: 'bg-green-100 group-hover:bg-foodtruck-gold/20',
    textColor: 'text-green-600 group-hover:text-foodtruck-gold',
    iconBorder: 'border-2 border-transparent group-hover:border-foodtruck-gold',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foodtruck-slate mb-4">
            How <span className="gold-gradient">It Works</span>
          </h2>
          <p className="max-w-2xl mx-auto text-foodtruck-slate/80">
            DishRated makes it easy to discover and enjoy local food trucks with just a few simple steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="relative group"
            >
              {/* Connecting line between features */}
              {index < features.length - 1 && (
                <div className="hidden md:block absolute top-16 right-0 w-full h-0.5 bg-gray-200 group-hover:bg-foodtruck-gold/30 transition-colors duration-500">
                  <div className="absolute right-0 w-4 h-4 -mt-1.5 mr-1 transform rotate-45 border-t-2 border-r-2 border-gray-200 group-hover:border-foodtruck-gold/30 transition-colors duration-500"></div>
                </div>
              )}
              
              <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center border-b-2 border-transparent hover:border-foodtruck-gold group">
                {/* Icon */}
                <div 
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                    feature.color,
                    feature.iconBorder
                  )}
                >
                  <feature.icon className={cn("h-8 w-8 transition-colors duration-300", feature.textColor)} />
                </div>
                
                {/* Title */}
                <h3 className="font-serif text-xl font-semibold text-foodtruck-slate mb-3 group-hover:text-foodtruck-gold transition-colors duration-300">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-foodtruck-slate/70 group-hover:text-foodtruck-slate transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-foodtruck-teal text-white font-medium shadow-lg hover:bg-foodtruck-slate transition-colors relative overflow-hidden group">
            <span className="relative z-10">Get Started</span>
            <span className="absolute bottom-0 left-0 w-full h-0 bg-foodtruck-gold/80 transition-all duration-300 group-hover:h-full"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
