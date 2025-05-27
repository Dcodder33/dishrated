import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Globe,
  Instagram,
  Twitter,
  Heart,
  Share2,
  Calendar,
  DollarSign,
  Truck,
  Edit,
  Loader2,
  Navigation,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { foodTruckService } from '../services';
import { FoodTruck } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const TruckDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('menu');
  const [truckData, setTruckData] = useState<FoodTruck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTruckData();
    }
  }, [id]);

  const fetchTruckData = async () => {
    try {
      setLoading(true);
      setError(null);
      const truck = await foodTruckService.getTruckById(id!);
      setTruckData(truck);
    } catch (error: any) {
      console.error('Error fetching truck data:', error);
      setError(error.message || 'Failed to load food truck data');
      toast({
        title: "Error",
        description: error.message || "Failed to load food truck data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if current user is the owner of this truck
  const isOwner = user && user.role === 'owner' && truckData && truckData.owner &&
    (typeof truckData.owner === 'string' ? truckData.owner === user.id : truckData.owner._id === user.id);

  // Handle pre-order functionality
  const handlePreOrder = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to place a pre-order",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (truckData?.status !== 'open') {
      toast({
        title: "Truck Closed",
        description: "This food truck is currently closed for orders",
        variant: "destructive",
      });
      return;
    }

    // For now, show a success message. In a real app, this would open an order modal
    toast({
      title: "Pre-Order Feature",
      description: "Pre-order functionality will be available soon! For now, please visit the truck directly.",
    });
  };

  // Handle directions functionality
  const handleGetDirections = () => {
    if (!truckData?.location?.coordinates) {
      toast({
        title: "Location Unavailable",
        description: "Location coordinates are not available for this truck",
        variant: "destructive",
      });
      return;
    }

    const { latitude, longitude } = truckData.location.coordinates;

    // Try to get user's current location first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          // Open directions in OpenStreetMap (as per user preference)
          const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLat}%2C${userLng}%3B${latitude}%2C${longitude}`;
          window.open(url, '_blank');
        },
        (error) => {
          // If geolocation fails, just open the truck location
          const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`;
          window.open(url, '_blank');

          toast({
            title: "Location Access Denied",
            description: "Opened truck location. Enable location access for turn-by-turn directions.",
          });
        }
      );
    } else {
      // Fallback: just open the truck location
      const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`;
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-yellow-50">
        <Navbar />
        <main className="flex-grow pt-20 pb-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-foodtruck-teal mx-auto mb-4" />
            <p className="text-foodtruck-slate">Loading food truck details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !truckData) {
    return (
      <div className="min-h-screen flex flex-col bg-yellow-50">
        <Navbar />
        <main className="flex-grow pt-20 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foodtruck-slate mb-4">Food Truck Not Found</h1>
            <p className="text-foodtruck-slate/70 mb-6">{error || 'The requested food truck could not be found.'}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-foodtruck-teal text-white rounded-lg hover:bg-foodtruck-slate transition-colors"
            >
              Back to Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-yellow-50"> {/* Add bg-yellow-50 for light yellow background */}
      <Navbar />

      <main className="flex-grow pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Edit Button */}
          {isOwner && (
            <div className="mb-6 flex justify-end">
              <Link
                to={`/trucks/${id}/edit`}
                className="inline-flex items-center px-4 py-2 bg-foodtruck-teal text-white rounded-lg hover:bg-foodtruck-slate transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Truck
              </Link>
            </div>
          )}

          {/* Image Gallery */}
          <div className="mb-8">
            <div className="relative rounded-xl overflow-hidden h-[400px] shadow-lg">
              <img
                src={truckData.image || 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3'}
                alt={truckData.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3';
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {truckData.cuisine}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-medium">{truckData.rating?.toFixed(1) || '0.0'}</span>
                    <span className="text-white/70 ml-1">({truckData.reviewCount || 0} reviews)</span>
                  </div>
                </div>

                <h1 className="font-serif text-3xl md:text-4xl font-bold">{truckData.name}</h1>
              </div>

              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                  <Heart className="h-5 w-5 text-foodtruck-slate hover:text-red-500" />
                </button>
                <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                  <Share2 className="h-5 w-5 text-foodtruck-slate" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {['menu', 'schedule', 'reviews', 'about'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "py-4 px-1 font-medium text-sm border-b-2 transition-colors whitespace-nowrap",
                        activeTab === tab
                          ? "border-foodtruck-teal text-foodtruck-teal"
                          : "border-transparent text-foodtruck-slate/70 hover:text-foodtruck-slate hover:border-foodtruck-slate/30"
                      )}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="py-6">
                {activeTab === 'menu' && (
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foodtruck-slate mb-6">Menu</h2>

                    {truckData.menu && truckData.menu.length > 0 ? (
                      <div className="space-y-6">
                        {/* Group menu items by category */}
                        {Object.entries(
                          truckData.menu.reduce((acc: any, item: any) => {
                            const category = item.category || 'Other';
                            if (!acc[category]) acc[category] = [];
                            acc[category].push(item);
                            return acc;
                          }, {})
                        ).map(([category, items]: [string, any]) => (
                          <div key={category}>
                            <h3 className="font-medium text-xl text-foodtruck-slate mb-4 pb-2 border-b border-gray-200">
                              {category}
                            </h3>
                            <div className="space-y-4">
                              {items.map((item: any, index: number) => (
                                <div key={item._id || index} className="flex justify-between items-start">
                                  <div className="pr-4 flex-1">
                                    <div className="flex items-center space-x-2">
                                      <h4 className="font-medium text-foodtruck-slate">{item.name}</h4>
                                      {item.isVegetarian && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Veg</span>
                                      )}
                                      {item.isVegan && (
                                        <span className="text-xs bg-green-200 text-green-900 px-2 py-0.5 rounded-full">Vegan</span>
                                      )}
                                      {!item.isAvailable && (
                                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Unavailable</span>
                                      )}
                                    </div>
                                    <p className="text-sm text-foodtruck-slate/70 mt-1">{item.description}</p>
                                    {item.allergens && item.allergens.length > 0 && (
                                      <p className="text-xs text-orange-600 mt-1">
                                        Contains: {item.allergens.join(', ')}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex-shrink-0 font-medium text-foodtruck-slate">
                                    ₹{item.price}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-foodtruck-slate/70">No menu items available yet.</p>
                        {isOwner && (
                          <Link
                            to={`/trucks/${id}/edit`}
                            className="inline-flex items-center mt-4 px-4 py-2 bg-foodtruck-teal text-white rounded-lg hover:bg-foodtruck-slate transition-colors"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Add Menu Items
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'schedule' && (
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foodtruck-slate mb-6">Weekly Schedule</h2>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                      {truckData.schedule.map((day, index) => (
                        <div
                          key={day.day}
                          className={cn(
                            "flex flex-col sm:flex-row sm:items-center p-4",
                            index < truckData.schedule.length - 1 && "border-b border-gray-200"
                          )}
                        >
                          <div className="sm:w-1/3 mb-2 sm:mb-0">
                            <div className="font-medium text-foodtruck-slate">{day.day}</div>
                          </div>
                          <div className="sm:w-1/3 mb-2 sm:mb-0">
                            <div className={cn(
                              "flex items-center",
                              day.hours === 'Closed' ? "text-red-500" : "text-green-600"
                            )}>
                              <Clock className="h-4 w-4 mr-2" />
                              {day.hours}
                            </div>
                          </div>
                          <div className="sm:w-1/3">
                            {day.location && (
                              <div className="flex items-center text-foodtruck-slate/80">
                                <MapPin className="h-4 w-4 mr-2" />
                                {day.location}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foodtruck-slate mb-6">Reviews</h2>
                    <p className="text-foodtruck-slate/80">
                      This would contain user reviews and ratings in a real implementation.
                    </p>
                  </div>
                )}

                {activeTab === 'about' && (
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foodtruck-slate mb-6">About</h2>
                    <p className="text-foodtruck-slate/80 mb-6">
                      {truckData.description || 'No description available.'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="font-medium text-foodtruck-slate mb-3">Contact Information</h3>
                        <div className="space-y-2">
                          {truckData.owner && typeof truckData.owner === 'object' && truckData.owner.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-foodtruck-teal mr-3" />
                              <span className="text-foodtruck-slate/80">{truckData.owner.phone}</span>
                            </div>
                          )}
                          {truckData.owner && typeof truckData.owner === 'object' && truckData.owner.email && (
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 text-foodtruck-teal mr-3" />
                              <span className="text-foodtruck-slate/80">{truckData.owner.email}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-foodtruck-teal mr-3" />
                            <span className="text-foodtruck-slate/80">{truckData.location?.address || 'Location not specified'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="font-medium text-foodtruck-slate mb-3">Quick Info</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-foodtruck-teal mr-3" />
                            <span className="text-foodtruck-slate/80">
                              Price Range: {truckData.priceRange === 'budget' ? '₹' : truckData.priceRange === 'mid' ? '₹₹' : '₹₹₹'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Truck className="h-4 w-4 text-foodtruck-teal mr-3" />
                            <span className="text-foodtruck-slate/80">Cuisine: {truckData.cuisine}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-foodtruck-teal mr-3" />
                            <span className="text-foodtruck-slate/80">
                              Wait time: {truckData.waitTime || 'Not specified'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-foodtruck-teal mr-3" />
                            <span className="text-foodtruck-slate/80">
                              Status: <span className={cn(
                                "capitalize",
                                truckData.status === 'open' ? 'text-green-600' : 'text-red-500'
                              )}>{truckData.status}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {truckData.tags && truckData.tags.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-medium text-foodtruck-slate mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {truckData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-foodtruck-lightgray text-foodtruck-slate text-sm rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="bg-yellow-100 rounded-xl shadow-md p-6 sticky top-24">
                <h3 className="font-medium text-lg text-foodtruck-slate mb-4">Current Location</h3>

                <div className="bg-foodtruck-lightgray rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-foodtruck-teal mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="font-medium text-foodtruck-slate">
                        {truckData.location?.address || 'Location not specified'}
                      </p>
                      <p className="text-sm text-foodtruck-slate/70">
                        Status: <span className={cn(
                          "capitalize font-medium",
                          truckData.status === 'open' ? 'text-green-600' : 'text-red-500'
                        )}>{truckData.status}</span>
                      </p>
                      {truckData.waitTime && (
                        <p className="text-sm text-foodtruck-slate/70">
                          Wait time: {truckData.waitTime}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden h-40 mb-6">
                  {/* Map placeholder - would integrate with real maps in production */}
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-foodtruck-slate/70">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Map View</p>
                      <p className="text-xs">
                        {truckData.location?.coordinates?.latitude && truckData.location?.coordinates?.longitude
                          ? `${truckData.location.coordinates.latitude.toFixed(4)}, ${truckData.location.coordinates.longitude.toFixed(4)}`
                          : 'Coordinates not available'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handlePreOrder}
                    disabled={truckData.status !== 'open'}
                    className={cn(
                      "w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center",
                      truckData.status === 'open'
                        ? "bg-foodtruck-teal text-white hover:bg-foodtruck-slate"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    )}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {truckData.status === 'open' ? 'Pre-Order for Pickup' : 'Currently Closed'}
                  </button>
                  <button
                    onClick={handleGetDirections}
                    className="w-full px-4 py-3 rounded-lg border border-foodtruck-teal text-foodtruck-teal font-medium hover:bg-foodtruck-teal hover:text-white transition-colors flex items-center justify-center"
                  >
                    <Navigation className="h-5 w-5 mr-2" />
                    Get Directions
                  </button>
                </div>

                {/* Owner Info */}
                {truckData.owner && typeof truckData.owner === 'object' && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-medium text-foodtruck-slate mb-3">Owner</h3>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-foodtruck-teal rounded-full flex items-center justify-center text-white font-medium">
                        {truckData.owner.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-foodtruck-slate">{truckData.owner.name}</p>
                        {truckData.owner.email && (
                          <p className="text-sm text-foodtruck-slate/70">{truckData.owner.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TruckDetails;