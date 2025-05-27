import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import TruckImageCarousel from '../components/TruckImageCarousel';
import CreateEventModal from '../components/CreateEventModal';
import {
  Truck,
  MapPin,
  Star,
  Users,
  Calendar,
  Plus,
  Edit,
  BarChart3,
  Clock,
  Navigation,
  Trash2,
  Eye,
  UserPlus
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { apiService } from '../services/api';
import { eventService } from '../services/eventService';
import { Event as EventType } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface TruckImage {
  id: string;
  url: string;
  caption?: string;
  isAdvertisement?: boolean;
  order: number;
}

interface DashboardData {
  trucks: any[];
  stats: {
    totalTrucks: number;
    totalReviews: number;
    averageRating: number;
    upcomingEvents: number;
  };
  upcomingEvents: any[];
}



const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Event management state
  const [events, setEvents] = useState<EventType[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [availableEvents, setAvailableEvents] = useState<EventType[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'owner') {
      navigate('/login');
      return;
    }

    fetchDashboardData();
    fetchOwnerEvents();
    fetchAvailableEvents();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<DashboardData>('/owner/dashboard');

      if (response.success && response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTruckStatus = async (truckId: string, status: string, waitTime?: string) => {
    try {
      const response = await apiService.put(`/owner/trucks/${truckId}/status`, {
        status,
        waitTime
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Truck status updated successfully",
        });
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update truck status",
        variant: "destructive",
      });
    }
  };



  const updateTruckLocation = async (truckId: string, address: string, coordinates: any) => {
    try {
      const response = await apiService.put(`/owner/trucks/${truckId}/location`, {
        address,
        coordinates
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Truck location updated successfully",
        });
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update truck location",
        variant: "destructive",
      });
    }
  };

  // Event management functions
  const fetchOwnerEvents = async () => {
    try {
      setEventsLoading(true);
      const response = await eventService.getEventsByOrganizer(user?._id || '');
      setEvents(response.events || []);
    } catch (error) {
      console.error('Error fetching owner events:', error);
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchAvailableEvents = async () => {
    try {
      const response = await eventService.getAllEvents({
        status: 'published'
      });
      // For now, show all published events that the owner can potentially join
      setAvailableEvents(response.events || []);
    } catch (error) {
      console.error('Error fetching available events:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await eventService.deleteEvent(eventId);
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      fetchOwnerEvents();
      fetchDashboardData(); // Refresh stats
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    try {
      await eventService.registerTruckForEvent(eventId);
      toast({
        title: "Success",
        description: "Successfully registered for event",
      });
      fetchAvailableEvents();
      fetchDashboardData(); // Refresh stats
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register for event",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foodtruck-teal mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Owner Dashboard</h1>
            <p className="text-gray-600">No data available</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Owner Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}! Manage your food trucks and track performance.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trucks</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.totalTrucks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.totalReviews}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.stats.averageRating.toFixed(1)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.upcomingEvents}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="trucks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="trucks">My Trucks</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="trucks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Food Trucks</h2>
              <Button onClick={() => navigate('/trucks/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Truck
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.trucks.map((truck) => {
                // Generate sample images for each truck
                const sampleImages: TruckImage[] = truck.images || [
                  {
                    id: `${truck._id}-img-1`,
                    url: truck.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center',
                    caption: `${truck.name} - Main View`,
                    isAdvertisement: truck.featured,
                    order: 1
                  },
                  {
                    id: `${truck._id}-img-2`,
                    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center',
                    caption: `${truck.name} - Kitchen Interior`,
                    isAdvertisement: false,
                    order: 2
                  },
                  {
                    id: `${truck._id}-img-3`,
                    url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop&crop=center',
                    caption: `${truck.name} - Fresh Food Display`,
                    isAdvertisement: false,
                    order: 3
                  }
                ];

                return (
                  <Card key={truck._id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    {/* Image Carousel */}
                    <div className="h-48 relative">
                      <TruckImageCarousel
                        images={sampleImages}
                        truckName={truck.name}
                        height="100%"
                        autoPlay={true}
                        autoPlayInterval={4000}
                        showControls={true}
                        showIndicators={true}
                        editable={false}
                        onImageClick={() => navigate(`/trucks/${truck._id}`)}
                      />

                      {/* Status Badge Overlay */}
                      <div className="absolute top-3 right-3 z-10">
                        <Badge
                          variant={truck.status === 'open' ? 'default' : 'secondary'}
                          className={truck.status === 'open' ? 'bg-green-500' : ''}
                        >
                          {truck.status}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{truck.name}</CardTitle>
                          <CardDescription>{truck.cuisine}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {truck.location.address}
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 mr-2" />
                          {truck.rating.toFixed(1)} ({truck.reviewCount} reviews)
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          Wait time: {truck.waitTime}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              console.log('Edit button clicked for truck:', truck._id);
                              navigate(`/trucks/${truck._id}/edit`);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/trucks/${truck._id}/location`)}
                            className="bg-foodtruck-teal text-white hover:bg-foodtruck-teal/90"
                          >
                            <Navigation className="h-4 w-4 mr-1" />
                            Live Location
                          </Button>

                          <Button
                            size="sm"
                            variant={truck.status === 'open' ? 'destructive' : 'default'}
                            onClick={() => updateTruckStatus(
                              truck._id,
                              truck.status === 'open' ? 'closed' : 'open'
                            )}
                          >
                            {truck.status === 'open' ? 'Close' : 'Open'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            {/* Event Management Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Event Management</h2>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>

            {/* My Events Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  My Events
                </CardTitle>
                <CardDescription>
                  Events you've created and are organizing
                </CardDescription>
              </CardHeader>
              <CardContent>
                {eventsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading events...</p>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No events created yet</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Create your first event to start managing food truck gatherings
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{event.title}</h3>
                              <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                                {event.status}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{event.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(event.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {event.location.address}
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {event.participatingTrucks?.length || 0} participants
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/events/${event._id}`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/events/${event._id}/edit`)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteEvent(event._id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Available Events to Join */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Available Events to Join
                </CardTitle>
                <CardDescription>
                  City events and festivals where you can participate with your food truck
                </CardDescription>
              </CardHeader>
              <CardContent>
                {availableEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No available events to join</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableEvents.slice(0, 5).map((event) => (
                      <div key={event._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                            <p className="text-gray-600 mb-2">{event.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(event.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {event.location.address}
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {event.participatingTrucks?.length || 0} participants
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/events/${event._id}`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleJoinEvent(event._id)}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Join Event
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {availableEvents.length > 5 && (
                      <div className="text-center pt-4">
                        <Button variant="outline" onClick={() => navigate('/events')}>
                          View All Available Events
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Create Event Modal */}
            <CreateEventModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              onEventCreated={(newEvent) => {
                setEvents(prev => [newEvent, ...prev]);
                setShowCreateModal(false);
                fetchDashboardData(); // Refresh stats
              }}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-semibold">Analytics</h2>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">Analytics dashboard coming soon...</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Track your truck performance, revenue, and customer insights
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default OwnerDashboard;
