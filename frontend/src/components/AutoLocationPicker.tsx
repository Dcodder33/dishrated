import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { MapPin, Navigation, Search, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { getCurrentLocation, reverseGeocode, geocodeAddress } from '../utils/distance';

interface LocationData {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface AutoLocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: LocationData;
  className?: string;
}

const AutoLocationPicker: React.FC<AutoLocationPickerProps> = ({
  onLocationSelect,
  initialLocation,
  className = ''
}) => {
  const { toast } = useToast();
  const [location, setLocation] = useState<LocationData>(
    initialLocation || {
      address: '',
      coordinates: { latitude: 0, longitude: 0 }
    }
  );
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [mapVisible, setMapVisible] = useState(false);
  const [locationError, setLocationError] = useState<string>('');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Auto-detect location on component mount
  useEffect(() => {
    if (!initialLocation) {
      detectCurrentLocation();
    }
  }, []);

  // Initialize map when made visible
  useEffect(() => {
    if (mapVisible && location.coordinates.latitude && location.coordinates.longitude) {
      initializeMap();
    }
  }, [mapVisible, location]);

  const detectCurrentLocation = async () => {
    setIsDetecting(true);
    setLocationError('');

    try {
      const coords = await getCurrentLocation();
      const address = await reverseGeocode(coords.lat, coords.lng);
      
      const newLocation: LocationData = {
        address,
        coordinates: {
          latitude: coords.lat,
          longitude: coords.lng
        }
      };

      setLocation(newLocation);
      onLocationSelect(newLocation);

      toast({
        title: "Location Detected",
        description: "Your current location has been automatically detected.",
      });
    } catch (error: any) {
      setLocationError(error.message);
      toast({
        title: "Location Error",
        description: "Could not detect your location. Please search for an address manually.",
        variant: "destructive",
      });
    } finally {
      setIsDetecting(false);
    }
  };

  const searchForAddress = async () => {
    if (!searchAddress.trim()) return;

    setIsSearching(true);
    setLocationError('');

    try {
      const result = await geocodeAddress(searchAddress);
      
      const newLocation: LocationData = {
        address: result.displayName,
        coordinates: {
          latitude: result.lat,
          longitude: result.lng
        }
      };

      setLocation(newLocation);
      onLocationSelect(newLocation);
      setSearchAddress('');

      toast({
        title: "Location Found",
        description: "Address has been located successfully.",
      });

      // Update map if visible
      if (mapInstanceRef.current && markerRef.current) {
        mapInstanceRef.current.setView([result.lat, result.lng], 15);
        markerRef.current.setLatLng([result.lat, result.lng]);
      }
    } catch (error: any) {
      setLocationError(error.message);
      toast({
        title: "Search Error",
        description: "Could not find the specified address. Please try a different search.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const initializeMap = async () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      // Dynamically import Leaflet
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');

      // Fix for default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current).setView(
        [location.coordinates.latitude, location.coordinates.longitude],
        15
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const marker = L.marker([location.coordinates.latitude, location.coordinates.longitude], {
        draggable: true
      }).addTo(map);

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Handle marker drag
      marker.on('dragend', async (e: any) => {
        const position = e.target.getLatLng();
        try {
          const address = await reverseGeocode(position.lat, position.lng);
          const newLocation: LocationData = {
            address,
            coordinates: {
              latitude: position.lat,
              longitude: position.lng
            }
          };
          setLocation(newLocation);
          onLocationSelect(newLocation);
        } catch (error) {
          console.error('Error getting address:', error);
        }
      });

      // Handle map click
      map.on('click', async (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        
        try {
          const address = await reverseGeocode(lat, lng);
          const newLocation: LocationData = {
            address,
            coordinates: {
              latitude: lat,
              longitude: lng
            }
          };
          setLocation(newLocation);
          onLocationSelect(newLocation);
        } catch (error) {
          console.error('Error getting address:', error);
        }
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Location Setup
        </CardTitle>
        <CardDescription>
          We'll automatically detect your location, or you can search for an address
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Location Display */}
        {location.address && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <MapPin className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Selected Location:</p>
                <p className="text-sm text-green-700">{location.address}</p>
                <p className="text-xs text-green-600 mt-1">
                  {location.coordinates.latitude.toFixed(6)}, {location.coordinates.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {locationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-700">{locationError}</p>
            </div>
          </div>
        )}

        {/* Auto-detect Button */}
        <Button
          onClick={detectCurrentLocation}
          disabled={isDetecting}
          className="w-full"
          variant="outline"
        >
          {isDetecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Detecting Location...
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4 mr-2" />
              Auto-Detect Current Location
            </>
          )}
        </Button>

        {/* Manual Search */}
        <div className="space-y-2">
          <Label htmlFor="search-address">Or search for an address:</Label>
          <div className="flex gap-2">
            <Input
              id="search-address"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Enter address to search..."
              onKeyPress={(e) => e.key === 'Enter' && searchForAddress()}
            />
            <Button
              onClick={searchForAddress}
              disabled={isSearching || !searchAddress.trim()}
              variant="outline"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Map Toggle */}
        {location.coordinates.latitude !== 0 && (
          <Button
            onClick={() => setMapVisible(!mapVisible)}
            variant="outline"
            className="w-full"
          >
            {mapVisible ? 'Hide Map' : 'Show Map for Fine-tuning'}
          </Button>
        )}

        {/* Map Container */}
        {mapVisible && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Click on the map or drag the marker to adjust the location
            </p>
            <div
              ref={mapRef}
              className="h-64 w-full rounded-lg border"
              style={{ minHeight: '256px' }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutoLocationPicker;
