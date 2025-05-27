import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, Loader2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import {
  getCurrentLocationWithAddress,
  searchAddresses,
  getCoordinatesFromAddress,
  LocationCoordinates,
  LocationResult,
  isGeolocationSupported
} from '../utils/locationService';

interface LocationPickerProps {
  value?: {
    address: string;
    coordinates?: LocationCoordinates;
  };
  onChange: (location: { address: string; coordinates: LocationCoordinates }) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  placeholder = "Enter address or use current location",
  required = false,
  className = ""
}) => {
  const { toast } = useToast();
  const [address, setAddress] = useState(value?.address || '');
  const [suggestions, setSuggestions] = useState<Array<{ address: string; coordinates: LocationCoordinates }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value?.address) {
      setAddress(value.address);
    }
  }, [value]);

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Hide suggestions immediately when typing to prevent interference
    setShowSuggestions(false);

    // Set new timeout for address search with longer delay
    if (newAddress.length >= 3) {
      searchTimeoutRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const results = await searchAddresses(newAddress);
          setSuggestions(results);
          // Only show suggestions if the input still has the same value
          if (inputRef.current && inputRef.current.value === newAddress) {
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error('Error searching addresses:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 800); // Increased delay to 800ms
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: { address: string; coordinates: LocationCoordinates }) => {
    setAddress(suggestion.address);
    setShowSuggestions(false);
    setSuggestions([]);
    onChange({
      address: suggestion.address,
      coordinates: suggestion.coordinates
    });
  };

  const handleManualAddressSubmit = async () => {
    if (!address.trim()) return;

    setIsLoading(true);
    try {
      const coordinates = await getCoordinatesFromAddress(address);
      onChange({
        address: address.trim(),
        coordinates
      });
      setShowSuggestions(false);
      toast({
        title: "Location Set",
        description: "Address location has been set successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Unable to find location for this address",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentLocation = async () => {
    if (!isGeolocationSupported()) {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      return;
    }

    setIsGettingLocation(true);
    try {
      const locationResult = await getCurrentLocationWithAddress();
      setAddress(locationResult.address);
      setShowSuggestions(false);
      onChange({
        address: locationResult.address,
        coordinates: locationResult.coordinates
      });
      toast({
        title: "Location Detected",
        description: "Your current location has been set",
      });
    } catch (error: any) {
      toast({
        title: "Location Error",
        description: error.message || "Unable to get your current location",
        variant: "destructive"
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleClearLocation = () => {
    setAddress('');
    setShowSuggestions(false);
    setSuggestions([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        handleSuggestionSelect(suggestions[0]);
      } else if (address.trim().length >= 3) {
        handleManualAddressSubmit();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if (e.key === 'ArrowDown' && showSuggestions && suggestions.length > 0) {
      e.preventDefault();
      // Focus first suggestion (could be enhanced with full keyboard navigation)
      setShowSuggestions(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              ref={inputRef}
              type="text"
              value={address}
              onChange={(e) => handleAddressChange(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => {
                // Only show suggestions if we have them and user isn't actively typing
                if (suggestions.length > 0 && address.length >= 3) {
                  setTimeout(() => setShowSuggestions(true), 100);
                }
              }}
              onBlur={() => {
                // Delay hiding suggestions to allow clicking on them
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              placeholder={placeholder}
              required={required}
              className="pl-10 pr-10 h-12 text-base"
              disabled={isLoading || isGettingLocation}
              autoComplete="off"
            />
            {address && (
              <button
                type="button"
                onClick={handleClearLocation}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            )}
          </div>

          {/* Address Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSuggestionSelect(suggestion);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent input blur
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 focus:bg-blue-50 focus:outline-none transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-900 break-words">{suggestion.address}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Minimum character hint */}
          {address.length > 0 && address.length < 3 && !isLoading && (
            <div className="absolute z-[9999] w-full mt-1 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-sm text-blue-700">
                  Type at least 3 characters to search for addresses
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Current Location Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleCurrentLocation}
          disabled={isGettingLocation || isLoading}
          className="flex-shrink-0 h-12 px-4"
          title="Use current location"
        >
          {isGettingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
        </Button>

        {/* Search Button */}
        {address && address.length >= 3 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(!showSuggestions);
              } else {
                handleManualAddressSubmit();
              }
            }}
            disabled={isLoading || isGettingLocation}
            className="flex-shrink-0 h-12 px-4"
            title={suggestions.length > 0 ? "Show/hide suggestions" : "Search this address"}
          >
            {suggestions.length > 0 ? (
              <Search className="h-4 w-4" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Click outside to close suggestions */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setShowSuggestions(false)}
          onTouchStart={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};

export default LocationPicker;
