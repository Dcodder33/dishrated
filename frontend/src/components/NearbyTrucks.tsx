import React, { useState, useEffect } from 'react';
import FoodTruckCard from './FoodTruckCard';
import TruckMap from './TruckMap';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { MapPin, List, X, Loader2, Navigation, AlertCircle, RefreshCw } from 'lucide-react';
import { foodTruckService } from '../services';
import { FoodTruck } from '../types';
import { useToast } from '../hooks/use-toast';
import {
  shouldAskForLocation,
  getCachedLocation,
  getLocationWithCache,
  updateLocationPermission
} from '@/utils/locationPreferences';

const NearbyTrucks = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null);
  const [trucks, setTrucks] = useState<FoodTruck[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'requesting' | 'granted' | 'denied' | 'unavailable'>('requesting');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    // Check if we have cached location first
    const cachedLocation = getCachedLocation();
    if (cachedLocation) {
      setUserLocation({ lat: cachedLocation.lat, lng: cachedLocation.lng });
      setLocationStatus('granted');
      fetchNearbyTrucks(cachedLocation.lat, cachedLocation.lng);
      return;
    }

    // Check if we should ask for location
    if (shouldAskForLocation()) {
      setShowLocationPrompt(true);
    } else {
      // User has denied permission recently, skip location request
      setLocationStatus('denied');
      setLoading(false);
    }
  };

  const requestUserLocation = async () => {
    setLocationStatus('requesting');
    setLocationError(null);

    try {
      const locationData = await getLocationWithCache();
      setUserLocation({ lat: locationData.lat, lng: locationData.lng });
      setLocationStatus('granted');
      fetchNearbyTrucks(locationData.lat, locationData.lng);

      toast({
        title: "Location Found",
        description: "Showing food trucks near your current location.",
      });
    } catch (error: any) {
      console.error('Error getting location:', error);
      setLocationStatus('denied');
      updateLocationPermission(false);

      let errorMessage = 'Unable to get your location';
      if (error.message.includes('not supported')) {
        errorMessage = 'Geolocation is not supported by this browser. Please enable location services.';
        setLocationStatus('unavailable');
      } else if (error.message.includes('denied')) {
        errorMessage = 'Location access denied. Please enable location permissions to find nearby food trucks.';
      } else if (error.message.includes('unavailable')) {
        errorMessage = 'Location information unavailable. Please check your device settings.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Location request timed out. Please try again.';
      }

      setLocationError(errorMessage);
      setLoading(false);

      toast({
        title: "Location Access Required",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };



  const fetchNearbyTrucks = async (lat: number, lng: number) => {
    try {
      setLoading(true);

      // Try with 10km radius first
      let nearbyTrucks = await foodTruckService.getNearbyTrucks(lat, lng, 10);

      // If no trucks found, try with larger radius
      if (nearbyTrucks.length === 0) {
        nearbyTrucks = await foodTruckService.getNearbyTrucks(lat, lng, 25);
      }

      setTrucks(nearbyTrucks);
    } catch (error) {
      console.error('Error fetching nearby trucks:', error);
      toast({
        title: "Error",
        description: "Failed to load nearby food trucks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

            {/* Location Status Indicator */}
            <div className="mt-3 flex items-center space-x-2">
              {locationStatus === 'requesting' && (
                <div className="flex items-center text-sm text-foodtruck-slate/70">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Requesting your location...
                </div>
              )}

              {locationStatus === 'granted' && (
                <div className="flex items-center text-sm text-green-600">
                  <Navigation className="h-4 w-4 mr-2" />
                  Using your current location
                </div>
              )}

              {(locationStatus === 'denied' || locationStatus === 'unavailable') && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-sm text-amber-600">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {locationError}
                  </div>
                  <button
                    onClick={requestUserLocation}
                    className="flex items-center text-sm text-foodtruck-teal hover:text-foodtruck-slate transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Try Again
                  </button>
                </div>
              )}


            </div>
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
            {/* Map Section */}
            <div
              className={cn(
                "lg:w-1/2 h-[350px] lg:h-[400px]",
                viewMode === 'map' ? "block lg:block" : "hidden lg:block"
              )}
            >
              {userLocation ? (
                <TruckMap
                  trucks={trucks}
                  center={[userLocation.lat, userLocation.lng]}
                  height="400px"
                  highlightedTruckId={selectedTruck}
                />
              ) : (
                <div className="h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Location Required</p>
                    <p className="text-sm text-gray-500">Please enable location access to view nearby food trucks</p>
                  </div>
                </div>
              )}
            </div>

            {/* List Section */}
            <div
              className={cn(
                "lg:w-1/2 lg:border-l border-gray-200",
                viewMode === 'list' ? "block lg:block" : "hidden lg:block"
              )}
            >
              <div className="h-[350px] lg:h-[400px] overflow-y-auto bg-yellow-100">

                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-foodtruck-slate">
                    {loading ? 'Loading...' : `${trucks.length} Food Trucks Nearby`}
                  </h3>
                  {!loading && locationStatus === 'granted' && (
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                      <Navigation className="h-3 w-3 mr-1" />
                      Based on your current location
                    </p>
                  )}

                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-foodtruck-teal" />
                  </div>
                ) : trucks.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No food trucks found nearby.</p>
                    {locationStatus === 'granted' ? (
                      <p className="text-sm mt-1">Try expanding your search radius or check back later.</p>
                    ) : (
                      <div className="text-sm mt-1 space-y-2">
                        <p>Try expanding your search radius or check back later.</p>
                        <button
                          onClick={requestUserLocation}
                          className="text-foodtruck-teal hover:text-foodtruck-slate transition-colors"
                        >
                          Or allow location access for personalized results
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {trucks.map((truck) => (
                      <div
                        key={truck._id}
                        className={cn(
                          "p-4 border-b border-gray-200 transition-colors cursor-pointer",
                          selectedTruck === truck._id ? "bg-foodtruck-lightgray" : "hover:bg-foodtruck-lightgray/50"
                        )}
                        onMouseEnter={() => setSelectedTruck(truck._id)}
                        onMouseLeave={() => setSelectedTruck(null)}
                        onClick={() => navigate(`/trucks/${truck._id}`)}
                      >
                        <div className="flex space-x-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={truck.image}
                              alt={truck.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3';
                              }}
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
                              <span className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                truck.status === 'open'
                                  ? "bg-green-100 text-green-800"
                                  : truck.status === 'opening-soon'
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              )}>
                                <span className={cn(
                                  "w-1.5 h-1.5 rounded-full mr-1",
                                  truck.status === 'open'
                                    ? "bg-green-800"
                                    : truck.status === 'opening-soon'
                                    ? "bg-yellow-800"
                                    : "bg-red-800"
                                )}></span>
                                {truck.status === 'open' ? 'Open Now' :
                                 truck.status === 'opening-soon' ? 'Opening Soon' : 'Closed'}
                              </span>
                              {truck.status === 'open' && (
                                <span className="text-xs text-foodtruck-slate/70 ml-2">{truck.waitTime} wait</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/find-trucks')}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-foodtruck-teal text-white font-medium shadow-lg hover:bg-foodtruck-slate transition-colors"
          >
            View All Nearby Trucks
          </button>
        </div>

        {/* Location Permission Prompt Modal */}
        {showLocationPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-foodtruck-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Navigation className="w-8 h-8 text-foodtruck-teal" />
                </div>
                <h3 className="text-lg font-bold text-foodtruck-slate mb-3">
                  Find Food Trucks Near You
                </h3>
                <p className="text-sm text-foodtruck-slate/70 mb-6 leading-relaxed">
                  We'd like to access your location to show you the closest food trucks and provide personalized recommendations.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowLocationPrompt(false);
                      requestUserLocation();
                    }}
                    className="w-full bg-foodtruck-teal text-white px-4 py-3 rounded-lg font-medium hover:bg-foodtruck-slate transition-colors flex items-center justify-center"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Allow Location
                  </button>
                  <button
                    onClick={() => {
                      setShowLocationPrompt(false);
                      setLocationStatus('denied');
                      setLoading(false);
                      updateLocationPermission(false);
                    }}
                    className="w-full bg-gray-100 text-foodtruck-slate px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Skip for now
                  </button>
                </div>
                <p className="text-xs text-foodtruck-slate/60 mt-4">
                  You can change this preference anytime in your browser settings.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NearbyTrucks;
