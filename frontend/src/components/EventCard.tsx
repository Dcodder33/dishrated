
import React from 'react';
import { Calendar, MapPin, Users, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

interface EventCardProps {
  id: string;
  title: string;
  image: string;
  date: Date;
  location: string;
  truckCount: number;
  className?: string;
}

const EventCard = ({
  id,
  title,
  image,
  date,
  location,
  truckCount,
  className,
}: EventCardProps) => {
  const handleViewDetails = () => {
    toast({
      title: "Event Details",
      description: `Viewing details for "${title}" (Coming soon)`,
    });
  };

  const handleNotifyMe = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Notification Set",
      description: `You'll be notified about updates for "${title}"`,
    });
  };

  return (
    <div 
      onClick={handleViewDetails}
      className={cn(
        "relative group overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 cursor-pointer",
        "hover:shadow-xl hover:-translate-y-1 hover:-rotate-1",
        className
      )}
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-foodtruck-slate rounded-lg px-3 py-1 shadow-lg transform transition-transform duration-300 group-hover:scale-105">
          <div className="flex items-center text-sm font-medium">
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-foodtruck-teal" />
            {format(date, 'MMM d, yyyy')}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-serif text-lg font-medium text-foodtruck-slate mb-2 group-hover:text-foodtruck-teal transition-colors">
          {title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 text-foodtruck-slate/70 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-foodtruck-slate/80">{location}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-foodtruck-slate/70 mr-2 flex-shrink-0" />
            <span className="text-sm text-foodtruck-slate/80">{truckCount} food trucks participating</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <button 
            onClick={handleViewDetails}
            className="text-sm font-medium text-foodtruck-teal hover:text-foodtruck-slate transition-colors"
          >
            View Details
          </button>
          
          <button 
            onClick={handleNotifyMe}
            className="inline-flex items-center rounded-full border border-foodtruck-teal px-3 py-1 text-xs font-medium text-foodtruck-teal hover:bg-foodtruck-teal hover:text-white transition-colors"
          >
            <Bell className="mr-1 h-3 w-3" />
            Notify Me
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
