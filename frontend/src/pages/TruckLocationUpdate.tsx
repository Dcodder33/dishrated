import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import LocationPicker from '../components/LocationPicker';
import { MapPin, Navigation, Clock, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { apiService } from '../services/api';
import { LocationCoordinates } from '../utils/locationService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface FoodTruck {
  _id: string;
  name: string;
  description: string;
  cuisine: string;
  image: string;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'open' | 'closed' | 'busy';
  waitTime: string;
  rating: number;
  reviewCount: number;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
}

const TruckLocationUpdate: React.FC = () => {
  const { truckId } = useParams<{ truckId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [truck, setTruck] = useState<FoodTruck | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [location, setLocation] = useState<{
    address: string;
    coordinates: LocationCoordinates;
  } | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'owner') {
      navigate('/login');
      return;
    }

    if (!truckId) {
      navigate('/dashboard');
      return;
    }

    fetchTruckData();
  }, [user, truckId, navigate]);

  const fetchTruckData = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<{ truck: FoodTruck }>(`/owner/trucks/${truckId}`);
      
      if (response.success && response.data) {
        const truckData = response.data.truck;
        setTruck(truckData);
        
        // Set current location
        if (truckData.location) {
          setLocation({
            address: truckData.location.address,
            coordinates: truckData.location.coordinates
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load truck data",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (newLocation: { address: string; coordinates: LocationCoordinates }) => {
    setLocation(newLocation);
  };

  const handleUpdateLocation = async () => {
    if (!location || !truck) {
      toast({
        title: "Error",
        description: "Please select a location first",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdating(true);
      const response = await apiService.put(`/owner/trucks/${truck._id}/location`, {
        address: location.address,
        coordinates: location.coordinates
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Truck location updated successfully",
        });
        
        // Update local truck data
        setTruck(prev => prev ? {
          ...prev,
          location: {
            address: location.address,
            coordinates: location.coordinates
          }
        } : null);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update truck location",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foodtruck-teal mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading truck data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!truck) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Truck Not Found</h1>
            <p className="text-gray-600 mb-4">The requested food truck could not be found.</p>
            <Button onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
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
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Location</h1>
          <p className="text-gray-600">Update the live location for {truck.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Truck Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Truck Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={truck.image}
                    alt={truck.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{truck.name}</h3>
                    <p className="text-gray-600">{truck.cuisine}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={truck.status === 'open' ? 'default' : 'secondary'}
                        className={truck.status === 'open' ? 'bg-green-500' : ''}
                      >
                        {truck.status}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {truck.waitTime}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Current Location</h4>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{truck.location.address}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Coordinates: {truck.location.coordinates.latitude.toFixed(6)}, {truck.location.coordinates.longitude.toFixed(6)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Update Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="h-5 w-5 mr-2" />
                Update Location
              </CardTitle>
              <CardDescription>
                Use your current location or search for a new address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Location
                  </label>
                  <LocationPicker
                    value={location ? {
                      address: location.address,
                      coordinates: location.coordinates
                    } : undefined}
                    onChange={handleLocationChange}
                    placeholder="Search for address or use current location"
                    required
                  />
                </div>

                {location && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Selected Location</h4>
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{location.address}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Coordinates: {location.coordinates.latitude.toFixed(6)}, {location.coordinates.longitude.toFixed(6)}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={handleUpdateLocation}
                    disabled={!location || updating}
                    className="flex-1"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Location
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleGoBack}
                    disabled={updating}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TruckLocationUpdate;
