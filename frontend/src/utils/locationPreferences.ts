// Location preferences and caching service

interface LocationData {
  lat: number;
  lng: number;
  timestamp: number;
  address?: string;
}

interface LocationPreferences {
  hasAskedPermission: boolean;
  permissionGranted: boolean;
  cachedLocation: LocationData | null;
  lastAsked: number;
}

const STORAGE_KEY = 'dishrated_location_preferences';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const ASK_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

// Get stored preferences
export const getLocationPreferences = (): LocationPreferences => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading location preferences:', error);
  }
  
  return {
    hasAskedPermission: false,
    permissionGranted: false,
    cachedLocation: null,
    lastAsked: 0
  };
};

// Save preferences
export const saveLocationPreferences = (preferences: LocationPreferences): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving location preferences:', error);
  }
};

// Check if we should ask for location permission
export const shouldAskForLocation = (): boolean => {
  const prefs = getLocationPreferences();
  
  // If user has never been asked, ask them
  if (!prefs.hasAskedPermission) {
    return true;
  }
  
  // If user granted permission and we have recent cached location, don't ask
  if (prefs.permissionGranted && prefs.cachedLocation) {
    const isLocationFresh = Date.now() - prefs.cachedLocation.timestamp < CACHE_DURATION;
    if (isLocationFresh) {
      return false;
    }
  }
  
  // If user denied permission, only ask again after cooldown period
  if (!prefs.permissionGranted) {
    const cooldownExpired = Date.now() - prefs.lastAsked > ASK_COOLDOWN;
    return cooldownExpired;
  }
  
  // If permission granted but location is stale, ask again
  return true;
};

// Get cached location if available and fresh
export const getCachedLocation = (): LocationData | null => {
  const prefs = getLocationPreferences();
  
  if (!prefs.cachedLocation) {
    return null;
  }
  
  const isLocationFresh = Date.now() - prefs.cachedLocation.timestamp < CACHE_DURATION;
  return isLocationFresh ? prefs.cachedLocation : null;
};

// Cache user location
export const cacheLocation = (location: LocationData): void => {
  const prefs = getLocationPreferences();
  prefs.cachedLocation = {
    ...location,
    timestamp: Date.now()
  };
  saveLocationPreferences(prefs);
};

// Update permission status
export const updateLocationPermission = (granted: boolean): void => {
  const prefs = getLocationPreferences();
  prefs.hasAskedPermission = true;
  prefs.permissionGranted = granted;
  prefs.lastAsked = Date.now();
  
  // Clear cached location if permission denied
  if (!granted) {
    prefs.cachedLocation = null;
  }
  
  saveLocationPreferences(prefs);
};

// Clear all location data (for privacy/logout)
export const clearLocationData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing location data:', error);
  }
};

// Get location with caching
export const getLocationWithCache = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    // First check if we have cached location
    const cached = getCachedLocation();
    if (cached) {
      resolve(cached);
      return;
    }
    
    // If no cached location, get fresh location
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now()
        };
        
        // Cache the location
        cacheLocation(locationData);
        updateLocationPermission(true);
        
        resolve(locationData);
      },
      (error) => {
        updateLocationPermission(false);
        reject(new Error(`Location error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};
