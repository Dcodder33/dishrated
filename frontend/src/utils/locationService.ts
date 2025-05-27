interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

interface LocationResult {
  address: string;
  coordinates: LocationCoordinates;
}

interface GeolocationError {
  code: number;
  message: string;
}

// Get user's current location using browser geolocation API
export const getCurrentLocation = (): Promise<LocationCoordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes cache
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      options
    );
  });
};

// Convert coordinates to address using reverse geocoding
export const getAddressFromCoordinates = async (coordinates: LocationCoordinates): Promise<string> => {
  try {
    // Using OpenStreetMap Nominatim API for reverse geocoding (free alternative to Google)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.latitude}&lon=${coordinates.longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'DishRated-App'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }

    const data = await response.json();
    
    if (data.display_name) {
      return data.display_name;
    } else {
      return `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`;
    }
  } catch (error) {
    console.error('Error getting address from coordinates:', error);
    return `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`;
  }
};

// Convert address to coordinates using geocoding
export const getCoordinatesFromAddress = async (address: string): Promise<LocationCoordinates> => {
  try {
    // Using OpenStreetMap Nominatim API for geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'DishRated-App'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch coordinates');
    }

    const data = await response.json();
    
    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    } else {
      throw new Error('Address not found');
    }
  } catch (error) {
    console.error('Error getting coordinates from address:', error);
    throw new Error('Unable to find location for the provided address');
  }
};

// Get current location with address
export const getCurrentLocationWithAddress = async (): Promise<LocationResult> => {
  try {
    const coordinates = await getCurrentLocation();
    const address = await getAddressFromCoordinates(coordinates);
    
    return {
      address,
      coordinates
    };
  } catch (error) {
    throw error;
  }
};

// Search for addresses with suggestions
export const searchAddresses = async (query: string): Promise<Array<{ address: string; coordinates: LocationCoordinates }>> => {
  try {
    if (query.length < 3) {
      return [];
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'DishRated-App'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search addresses');
    }

    const data = await response.json();
    
    return data.map((item: any) => ({
      address: item.display_name,
      coordinates: {
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon)
      }
    }));
  } catch (error) {
    console.error('Error searching addresses:', error);
    return [];
  }
};

// Calculate distance between two coordinates (in kilometers)
export const calculateDistance = (coord1: LocationCoordinates, coord2: LocationCoordinates): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

// Format distance for display
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else {
    return `${distance.toFixed(1)}km`;
  }
};

// Check if geolocation is supported
export const isGeolocationSupported = (): boolean => {
  return 'geolocation' in navigator;
};

// Request location permission
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    if (!isGeolocationSupported()) {
      return false;
    }

    // Try to get location to trigger permission request
    await getCurrentLocation();
    return true;
  } catch (error) {
    return false;
  }
};

export type { LocationCoordinates, LocationResult, GeolocationError };
