import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { Calendar, ChevronDown, Filter, ArrowLeft, ArrowRight, Search, Plus, MapPin, Clock, Users, Edit, Trash2, Star } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { eventService } from '@/services/eventService';

// Enhanced Event interface
interface Event {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: Date;
  endDate?: Date;
  location: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  eventType: 'city_event' | 'truck_event' | 'offer';
  organizer: {
    _id: string;
    name: string;
    email: string;
    userType: 'admin' | 'owner';
  };
  organizerType: 'admin' | 'owner';
  participatingTrucks: Array<{
    truck: {
      _id: string;
      name: string;
      image: string;
      location: string;
    };
    status: 'pending' | 'confirmed' | 'declined';
    confirmedAt: Date;
  }>;
  maxParticipants?: number;
  registrationDeadline?: Date;
  tags: string[];
  isActive: boolean;
  featured: boolean;
  requirements?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  pricing?: {
    participationFee: number;
    currency: string;
  };
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  participantCount: number;
  availableSpots?: number;
  isRegistrationOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mock events data with new structure
const mockEvents: Event[] = [
  {
    _id: '1',
    title: 'Food Festival 2025',
    description: 'Join us for the biggest food festival in Bhubaneswar featuring local and international cuisines.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    date: new Date('2025-01-15'),
    location: {
      address: 'IDCO Exhibition Ground, Bhubaneswar',
      coordinates: { latitude: 20.2961, longitude: 85.8245 }
    },
    eventType: 'city_event',
    organizer: {
      _id: 'admin1',
      name: 'City Admin',
      email: 'admin@bhubaneswar.gov.in',
      userType: 'admin'
    },
    organizerType: 'admin',
    participatingTrucks: [
      {
        truck: {
          _id: 'truck1',
          name: 'Spice Route',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
          location: 'Bhubaneswar'
        },
        status: 'confirmed',
        confirmedAt: new Date()
      }
    ],
    maxParticipants: 20,
    registrationDeadline: new Date('2025-01-10'),
    tags: ['festival', 'food', 'family'],
    isActive: true,
    featured: true,
    requirements: 'Valid food license required',
    contactInfo: {
      email: 'events@bhubaneswar.gov.in',
      phone: '+91-9876543210'
    },
    pricing: {
      participationFee: 5000,
      currency: 'INR'
    },
    status: 'published',
    participantCount: 12,
    availableSpots: 8,
    isRegistrationOpen: true,
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-15')
  },
  {
    _id: '2',
    title: 'Weekend Special Offers',
    description: 'Special weekend discounts and combo offers from our food truck.',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300',
    date: new Date('2025-01-18'),
    endDate: new Date('2025-01-19'),
    location: {
      address: 'Kalinga Stadium Area, Bhubaneswar'
    },
    eventType: 'offer',
    organizer: {
      _id: 'owner1',
      name: 'Rajesh Kumar',
      email: 'rajesh@spiceroute.com',
      userType: 'owner'
    },
    organizerType: 'owner',
    participatingTrucks: [],
    tags: ['offer', 'discount', 'weekend'],
    isActive: true,
    featured: false,
    status: 'published',
    participantCount: 0,
    isRegistrationOpen: false,
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10')
  }
];

const Events: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('published');

  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Fetch real events from API
        const response = await eventService.getAllEvents({
          status: 'published',
          page: 1,
          limit: 50
        });
        setEvents(response.events);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Error",
          description: "Failed to load events. Please try again.",
          variant: "destructive"
        });
        setEvents(mockEvents); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search and filters
  useEffect(() => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Event type filter
    if (selectedEventType !== 'all') {
      filtered = filtered.filter(event => event.eventType === selectedEventType);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(event => event.status === selectedStatus);
    }

    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [events, searchTerm, selectedEventType, selectedStatus]);

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handleParticipate = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to participate in events",
        variant: "destructive"
      });
      return;
    }

    if (user.userType !== 'owner') {
      toast({
        title: "Access Denied",
        description: "Only food truck owners can participate in events",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      // API call would go here
      toast({
        title: "Success!",
        description: "Successfully registered for the event",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register for event",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (eventId: string) => {
    try {
      setLoading(true);
      // API call would go here
      toast({
        title: "Success!",
        description: "Successfully withdrawn from the event",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to withdraw from event",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };



  const canUserEditEvent = (event: Event) => {
    if (!user) return false;
    return user.userType === 'admin' || event.organizer._id === user._id;
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'city_event': return 'City Event';
      case 'truck_event': return 'Truck Event';
      case 'offer': return 'Special Offer';
      default: return type;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'city_event': return 'bg-blue-100 text-blue-800';
      case 'truck_event': return 'bg-green-100 text-green-800';
      case 'offer': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center text-white">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Discover Amazing Events</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Food Truck
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Events & Festivals
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join the ultimate culinary adventure! Discover food truck gatherings,
              festivals, and exclusive events happening in your city.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{filteredEvents.length}+</div>
                <div className="text-white/80 text-sm">Active Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">50+</div>
                <div className="text-white/80 text-sm">Food Trucks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">12</div>
                <div className="text-white/80 text-sm">Cities</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Advanced Filters Section */}
      <div className="relative -mt-10 z-10">
        <div className="container mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6">
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events, locations, or organizers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 text-lg border-0 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-200 placeholder-gray-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-3 mb-4">
              {/* Event Type Filter */}
              <div className="relative">
                <select
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(e.target.value)}
                  className="appearance-none bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full text-sm font-medium border-none focus:ring-2 focus:ring-red-300 focus:outline-none cursor-pointer hover:from-red-600 hover:to-red-700 transition-all duration-200"
                >
                  <option value="all">🎪 All Events</option>
                  <option value="city_event">🏙️ City Events</option>
                  <option value="truck_event">🚚 Truck Events</option>
                  <option value="offer">🎁 Special Offers</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full text-sm font-medium border-none focus:ring-2 focus:ring-orange-300 focus:outline-none cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                >
                  <option value="all">📅 All Status</option>
                  <option value="published">✅ Published</option>
                  <option value="draft">📝 Draft</option>
                  <option value="completed">🏁 Completed</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
              </div>

              {/* Date Filter */}
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-full text-sm font-medium border-none transition-all duration-200">
                <Calendar className="w-4 h-4 mr-2" />
                This Week
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>

              {/* Location Filter */}
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-full text-sm font-medium border-none transition-all duration-200">
                <MapPin className="w-4 h-4 mr-2" />
                Near Me
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>

              {/* Clear Filters */}
              {(searchTerm || selectedEventType !== 'all' || selectedStatus !== 'published') && (
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedEventType('all');
                    setSelectedStatus('published');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-full text-sm font-medium border-none transition-all duration-200"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>

            {/* Active Filters Display */}
            {(searchTerm || selectedEventType !== 'all' || selectedStatus !== 'published') && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Active filters:</span>
                {searchTerm && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    Search: "{searchTerm}"
                  </span>
                )}
                {selectedEventType !== 'all' && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                    Type: {getEventTypeLabel(selectedEventType)}
                  </span>
                )}
                {selectedStatus !== 'published' && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                    Status: {selectedStatus}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Events Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing food truck events happening near you. From city festivals to exclusive truck gatherings.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            // Enhanced Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded-lg mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="flex gap-3">
                      <div className="h-12 bg-gray-300 rounded-xl flex-1"></div>
                      <div className="h-12 bg-gray-300 rounded-xl w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            currentEvents.map((event) => (
            <div key={event._id} className="group">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className="relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                  {/* Date Badge */}
                  <div className="absolute top-6 left-6">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
                      <div className="text-center">
                        <div className="text-red-500 text-xs font-bold uppercase tracking-wide">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="text-gray-900 text-2xl font-bold leading-none">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-gray-600 text-xs font-medium">
                          {new Date(event.date).getFullYear()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event Type Badge */}
                  <div className="absolute top-6 right-6">
                    <span className={`px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm ${getEventTypeColor(event.eventType)} shadow-lg`}>
                      {getEventTypeLabel(event.eventType)}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {event.featured && (
                    <div className="absolute bottom-6 left-6">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center shadow-lg">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link to={`/events/${event._id}`}>
                      <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transform scale-95 group-hover:scale-100 transition-transform duration-200">
                        View Event
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors duration-200">
                    {event.title}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <MapPin className="w-4 h-4 text-red-500" />
                      </div>
                      <span className="truncate font-medium">{event.location.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="font-medium">{event.participantCount} food trucks participating</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <Clock className="w-4 h-4 text-green-500" />
                      </div>
                      <span className="font-medium">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link to={`/events/${event._id}`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold py-3 rounded-xl transition-all duration-200"
                      >
                        View Details
                      </Button>
                    </Link>

                    {/* Participate Button for Owners */}
                    {user?.userType === 'owner' && event.eventType === 'city_event' && event.isRegistrationOpen && (
                      <Button
                        onClick={() => handleParticipate(event._id)}
                        disabled={loading}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                      >
                        Join Event
                      </Button>
                    )}

                    {/* Edit Button for Event Organizers */}
                    {canUserEditEvent(event) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-4 py-3 border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )))}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-3 mt-16">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={`w-12 h-12 rounded-xl font-semibold transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                        : 'border-2 border-gray-200 hover:border-red-300 hover:bg-red-50'
                    }`}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Enhanced No Events Found */}
        {filteredEvents.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-red-500" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">No events found</h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                We couldn't find any events matching your criteria. Try adjusting your search terms or filters to discover more events.
              </p>

              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedEventType('all');
                    setSelectedStatus('published');
                  }}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Clear All Filters
                </Button>

                <p className="text-sm text-gray-500">
                  Food truck owners can create events from their
                  <Link to="/owner-dashboard" className="text-red-500 hover:text-red-600 font-medium ml-1">
                    dashboard
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action Section */}
        {!loading && filteredEvents.length > 0 && (
          <div className="mt-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-12 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">Don't see your event?</h3>
            <p className="text-xl mb-8 opacity-90">
              Food truck owners can create and promote their own events
            </p>
            <Link to="/owner-dashboard">
              <Button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200">
                Create Your Event
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        )}

      </div>



      <Footer />
    </div>
  );
};

export default Events;
