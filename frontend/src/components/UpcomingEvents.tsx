
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
// Define a local interface that matches what we need for display
interface UpcomingEvent {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  location: {
    address: string;
  };
  participantCount?: number;
  eventType?: string;
  featured?: boolean;
  participatingTrucks?: any[];
}

const UpcomingEvents = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = React.useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch upcoming events from API
  React.useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);

        // Fetch real events from API
        const response = await eventService.getAllEvents({
          status: 'published',
          limit: 4
        });

        // Transform the events to match our display interface
        const transformedEvents: UpcomingEvent[] = response.events.map((event: any) => ({
          _id: event._id,
          title: event.title,
          description: event.description,
          image: event.image || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          date: event.date,
          location: {
            address: event.location?.address || 'Location TBD'
          },
          participantCount: event.participatingTrucks?.length || 0,
          eventType: event.eventType,
          featured: event.featured || false,
          participatingTrucks: event.participatingTrucks || []
        }));

        setEvents(transformedEvents);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
        // Set empty array on error
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-yellow-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-foodtruck-gold/5 rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-foodtruck-teal/5 rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foodtruck-slate mb-4">Upcoming Festivals & Events</h2>
            <p className="text-foodtruck-slate/80 max-w-2xl">
              Join these exciting food truck gatherings and taste a world of flavors.
            </p>
          </div>

          <div className="hidden md:flex space-x-2">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-full border border-foodtruck-slate/20 hover:bg-white hover:border-foodtruck-teal transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-foodtruck-slate" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-full border border-foodtruck-slate/20 hover:bg-white hover:border-foodtruck-teal transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-foodtruck-slate" />
            </button>
          </div>
        </div>

        {/* Scrollable container for event cards */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-6 pb-6 no-scrollbar"
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-[320px]">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))
          ) : events.length === 0 ? (
            // No events message
            <div className="flex-shrink-0 w-full">
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Available</h3>
                <p className="text-gray-500 mb-4">
                  There are currently no upcoming events. Check back soon for exciting food truck gatherings!
                </p>
                <Link to="/events" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-foodtruck-teal text-white font-medium hover:bg-foodtruck-slate transition-colors">
                  Browse All Events
                </Link>
              </div>
            </div>
          ) : (
            events.map((event) => (
            <div key={event._id} className="flex-shrink-0 w-[320px]">
              <Link to={`/events/${event._id}`} className="block">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 shadow-md">
                      <div className="text-center">
                        <div className="text-red-500 text-xs font-semibold uppercase">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="text-gray-900 text-lg font-bold">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-gray-600 text-xs">
                          {new Date(event.date).getFullYear()}
                        </div>
                      </div>
                    </div>

                    {/* Featured Badge */}
                    {event.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{event.title}</h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-red-500" />
                        <span className="truncate">{event.location.address}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-red-500" />
                        <span>{event.participantCount} food trucks participating</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        event.eventType === 'city_event' ? 'bg-blue-100 text-blue-800' :
                        event.eventType === 'truck_event' ? 'bg-green-100 text-green-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {event.eventType === 'city_event' ? 'City Event' :
                         event.eventType === 'truck_event' ? 'Truck Event' : 'Special Offer'}
                      </span>
                      <span className="text-red-500 text-sm font-medium">View Details →</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/events" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-foodtruck-teal text-white font-medium shadow-lg hover:bg-foodtruck-slate transition-colors">
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
