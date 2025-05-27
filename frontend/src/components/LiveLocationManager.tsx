import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Navigation, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Clock,
  Truck
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LiveLocationManagerProps {
  truckId: string;
  currentLocation: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  onLocationUpdate: (location: any) => Promise<void>;
  isLocationSharing?: boolean;
  onToggleSharing?: (enabled: boolean) => void;
}

const LiveLocationManager: React.FC<LiveLocationManagerProps> = ({
  truckId,
  currentLocation,
  onLocationUpdate,
  isLocationSharing = false,
  onToggleSharing
}) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);
  const [isMapVisible, setIsMapVisible] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Initialize map when made visible
  useEffect(() => {
    if (isMapVisible && mapRef.current && !mapInstanceRef.current) {
      initializeMap();
    }
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isMapVisible]);

  const initializeMap = () => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([
      selectedLocation.coordinates.latitude,
      selectedLocation.coordinates.longitude
    ], 15);

    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Custom truck icon
    const truckIcon = L.divIcon({
      html: `<div class="bg-foodtruck-teal text-white rounded-full p-2 shadow-lg">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
               </svg>
             </div>`,
      className: 'custom-truck-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    // Add draggable marker
    const marker = L.marker([
      selectedLocation.coordinates.latitude,
      selectedLocation.coordinates.longitude
    ], { 
      icon: truckIcon,
      draggable: true 
    }).addTo(map);

    markerRef.current = marker;

    // Handle marker drag
    marker.on('dragend', async (e) => {
      const position = e.target.getLatLng();
      const newLocation = {
        coordinates: {
          latitude: position.lat,
          longitude: position.lng
        },
        address: 'Updating address...'
      };
      
      setSelectedLocation(newLocation);
      
      // Reverse geocoding to get address
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
        );
        const data = await response.json();
        
        const updatedLocation = {
          ...newLocation,
          address: data.display_name || 'Unknown location'
        };
        
        setSelectedLocation(updatedLocation);
      } catch (error) {
        console.error('Error getting address:', error);
      }
    });

    // Handle map click
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      
      // Move marker to clicked location
      marker.setLatLng([lat, lng]);
      
      const newLocation = {
        coordinates: {
          latitude: lat,
          longitude: lng
        },
        address: 'Updating address...'
      };
      
      setSelectedLocation(newLocation);
      
      // Reverse geocoding
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        
        const updatedLocation = {
          ...newLocation,
          address: data.display_name || 'Unknown location'
        };
        
        setSelectedLocation(updatedLocation);
      } catch (error) {
        console.error('Error getting address:', error);
      }
    });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    setIsGettingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          const newLocation = {
            coordinates: { latitude, longitude },
            address: data.display_name || 'Current location'
          };
          
          setSelectedLocation(newLocation);
          
          // Update map if visible
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 15);
            markerRef.current.setLatLng([latitude, longitude]);
          }
          
        } catch (error) {
          console.error('Error getting address:', error);
          const newLocation = {
            coordinates: { latitude, longitude },
            address: 'Current location'
          };
          setSelectedLocation(newLocation);
        }
        
        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred while getting location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const updateLocation = async () => {
    try {
      await onLocationUpdate(selectedLocation);
      setLastUpdated(new Date());
      setLocationError('');
    } catch (error) {
      setLocationError('Failed to update location. Please try again.');
    }
  };

  const toggleMapVisibility = () => {
    setIsMapVisible(!isMapVisible);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Navigation className="h-5 w-5 mr-2" />
              Live Location Manager
            </CardTitle>
            <CardDescription>
              Share your food truck's real-time location with customers
            </CardDescription>
          </div>
          
          {onToggleSharing && (
            <div className="flex items-center space-x-2">
              <Badge variant={isLocationSharing ? "default" : "secondary"}>
                {isLocationSharing ? (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Live
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Hidden
                  </>
                )}
              </Badge>
              <Button
                variant={isLocationSharing ? "destructive" : "default"}
                size="sm"
                onClick={() => onToggleSharing(!isLocationSharing)}
              >
                {isLocationSharing ? 'Stop Sharing' : 'Start Sharing'}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {locationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{locationError}</AlertDescription>
          </Alert>
        )}

        {/* Current Location Display */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <MapPin className="h-4 w-4 mr-2 text-foodtruck-teal" />
                <span className="font-medium">Current Location</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{selectedLocation.address}</p>
              <p className="text-xs text-gray-500">
                {selectedLocation.coordinates.latitude.toFixed(6)}, {selectedLocation.coordinates.longitude.toFixed(6)}
              </p>
              {lastUpdated && (
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            variant="outline"
            size="sm"
          >
            {isGettingLocation ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <Navigation className="h-4 w-4 mr-2" />
                Use Current Location
              </>
            )}
          </Button>

          <Button
            onClick={toggleMapVisibility}
            variant="outline"
            size="sm"
          >
            <MapPin className="h-4 w-4 mr-2" />
            {isMapVisible ? 'Hide Map' : 'Show Map'}
          </Button>

          <Button
            onClick={updateLocation}
            size="sm"
            className="bg-foodtruck-teal hover:bg-foodtruck-teal/90"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Update Location
          </Button>
        </div>

        {/* Interactive Map */}
        {isMapVisible && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              Click on the map or drag the truck marker to set a new location
            </div>
            <div
              ref={mapRef}
              className="w-full h-64 rounded-lg border"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveLocationManager;
