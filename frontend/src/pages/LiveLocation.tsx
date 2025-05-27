import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { ownerService } from '../services/ownerService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LiveLocationManager from '../components/LiveLocationManager';
import LocationHistory from '../components/LocationHistory';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation,
  Truck,
  Clock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface TruckData {
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
  status: string;
  isLocationSharingEnabled?: boolean;
  lastLocationUpdate?: string;
}

const LiveLocation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [truckData, setTruckData] = useState<TruckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  const [isUpdatingSharing, setIsUpdatingSharing] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'owner') {
      navigate('/login');
      return;
    }

    if (id) {
      fetchTruckData();
    }
  }, [user, navigate, id]);

  const fetchTruckData = async () => {
    try {
      setLoading(true);
      const truck = await ownerService.getTruck(id!);
      setTruckData(truck);
      setIsLocationSharing(truck.isLocationSharingEnabled || false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load truck data",
        variant: "destructive",
      });
      navigate('/owner/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationUpdate = async (location: any) => {
    try {
      const updatedTruck = await ownerService.updateTruckLocation(id!, location);
      setTruckData(updatedTruck);
      
      toast({
        title: "Success",
        description: "Location updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update location",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleToggleSharing = async (enabled: boolean) => {
    try {
      setIsUpdatingSharing(true);
      const updatedTruck = await ownerService.toggleLocationSharing(id!, enabled);
      setTruckData(updatedTruck);
      setIsLocationSharing(enabled);
      
      toast({
        title: "Success",
        description: `Location sharing ${enabled ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to toggle location sharing",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingSharing(false);
    }
  };

  const handleQuickLocationShare = async () => {
    try {
      const updatedTruck = await ownerService.shareCurrentLocation(id!);
      setTruckData(updatedTruck);
      
      toast({
        title: "Success",
        description: "Current location shared successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to share current location",
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
            <p className="mt-4 text-gray-600">Loading truck data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!truckData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Truck Not Found</h1>
            <p className="text-gray-600 mb-4">The requested food truck could not be found.</p>
            <Button onClick={() => navigate('/owner/dashboard')}>
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
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/owner/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Live Location - {truckData.name}
              </h1>
              <p className="text-gray-600">Manage your food truck's real-time location sharing</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant={isLocationSharing ? "default" : "secondary"} className="text-sm">
                {isLocationSharing ? (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Sharing Live
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Not Sharing
                  </>
                )}
              </Badge>
              
              <Button
                onClick={handleQuickLocationShare}
                size="sm"
                className="bg-foodtruck-teal hover:bg-foodtruck-teal/90"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Share Current Location
              </Button>
            </div>
          </div>
        </div>

        {/* Status Alert */}
        {!isLocationSharing && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Location sharing is currently disabled. Enable it to let customers see your real-time location.
            </AlertDescription>
          </Alert>
        )}

        {/* Truck Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              {truckData.name}
            </CardTitle>
            <CardDescription>
              {truckData.cuisine} • {truckData.status}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-2">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Current Location</span>
                </div>
                <p className="text-sm text-gray-600">{truckData.location.address}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {truckData.location.coordinates.latitude.toFixed(6)}, {truckData.location.coordinates.longitude.toFixed(6)}
                </p>
              </div>
              
              {truckData.lastLocationUpdate && (
                <div>
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">Last Updated</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(truckData.lastLocationUpdate).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Live Location Manager */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <LiveLocationManager
              truckId={truckData._id}
              currentLocation={truckData.location}
              onLocationUpdate={handleLocationUpdate}
              isLocationSharing={isLocationSharing}
              onToggleSharing={handleToggleSharing}
            />
          </div>
          
          <div>
            <LocationHistory
              truckId={truckData._id}
              onSelectLocation={(location) => {
                handleLocationUpdate({
                  address: location.address,
                  coordinates: location.coordinates
                });
              }}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LiveLocation;
