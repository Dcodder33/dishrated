import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Filter, List, Grid3X3, Navigation, Clock, Star, Phone, Globe, Instagram, Twitter, Route, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import TruckMap from '@/components/TruckMap';
import TruckImageCarousel from '@/components/TruckImageCarousel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { foodTruckService } from '@/services/foodTruckService';
import { calculateDistance } from '@/utils/distance';

interface TruckImage {
  id: string;
  url: string;
  caption?: string;
  isAdvertisement?: boolean;
  order: number;
}

interface FoodTruck {
  _id: string;
  name: string;
  description: string;
  image: string;
  images?: TruckImage[];
  cuisine: string;
  rating: number;
  reviewCount: number;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'open' | 'closed' | 'opening-soon';
  waitTime: string;
  featured: boolean;
  priceRange: 'budget' | 'mid' | 'premium';
  tags: string[];
  distance?: string;
  distanceValue?: number;
  aboutInfo?: {
    specialties: string;
    story: string;
    ingredients: string;
    phone: string;
    website: string;
    instagram: string;
    twitter: string;
  };
}

interface LocationState {
  lat: number;
  lng: number;
  address: string;
}

interface Filters {
  location: string;
  useCurrentLocation: boolean;
  distance: number;
  cuisine: string[];
  priceRange: string[];
  openNow: boolean;
  search: string;
}

const FindTrucks = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // State management
  const [trucks, setTrucks] = useState<FoodTruck[]>([]);
  const [filteredTrucks, setFilteredTrucks] = useState<FoodTruck[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null);

  // Location state
  const [userLocation, setUserLocation] = useState<LocationState | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<Filters>({
    location: '',
    useCurrentLocation: true,
    distance: 10,
    cuisine: [],
    priceRange: [],
    openNow: false,
    search: ''
  });

  // Get current location on component mount
  useEffect(() => {
    if (filters.useCurrentLocation) {
      getCurrentLocation();
    }
  }, []);

  // Fetch trucks when location or filters change
  useEffect(() => {
    if (userLocation) {
      fetchTrucks();
    }
  }, [userLocation, filters]);

  // Filter trucks based on current filters
  useEffect(() => {
    applyFilters();
  }, [trucks, filters]);

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Reverse geocoding to get address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            const location: LocationState = {
              lat: latitude,
              lng: longitude,
              address: data.display_name || 'Current location'
            };

            setUserLocation(location);
            setFilters(prev => ({ ...prev, location: location.address }));

            toast({
              title: "Location Found",
              description: "Using your current location to find nearby food trucks.",
            });
          } catch (error) {
            console.error('Reverse geocoding failed:', error);
            setUserLocation({
              lat: latitude,
              lng: longitude,
              address: 'Current location'
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Location Error",
            description: "Could not get your location. Using default location.",
            variant: "destructive",
          });
          // Use default location (KIIT Campus)
          setUserLocation({
            lat: 20.3538431,
            lng: 85.8169059,
            address: 'KIIT Campus, Bhubaneswar'
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } catch (error: any) {
      console.error('Location error:', error);
      toast({
        title: "Location Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLocationLoading(false);
    }
  };

  const searchLocation = async (address: string) => {
    if (!address.trim()) return;

    setLocationLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const location: LocationState = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          address: data[0].display_name
        };

        setUserLocation(location);
        setFilters(prev => ({ ...prev, location: location.address, useCurrentLocation: false }));

        toast({
          title: "Location Found",
          description: `Using ${data[0].display_name}`,
        });
      } else {
        throw new Error('Address not found');
      }
    } catch (error: any) {
      toast({
        title: "Search Error",
        description: error.message || "Could not find the specified location",
        variant: "destructive",
      });
    } finally {
      setLocationLoading(false);
    }
  };

  const fetchTrucks = async () => {
    if (!userLocation) return;

    setLoading(true);
    try {
      const response = await foodTruckService.getNearbyTrucks(
        userLocation.lat,
        userLocation.lng,
        filters.distance
      );

      // Add distance calculations and sample images
      const trucksWithDistance = response.map(truck => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          truck.location.coordinates.latitude,
          truck.location.coordinates.longitude
        );

        // Add sample images for demonstration
        const sampleImages: TruckImage[] = [
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
          },
          {
            id: `${truck._id}-img-4`,
            url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&crop=center',
            caption: `${truck.name} - Signature Dishes`,
            isAdvertisement: true,
            order: 4
          }
        ];

        return {
          ...truck,
          distance: `${distance} km`,
          distanceValue: distance,
          images: sampleImages
        };
      }).sort((a, b) => (a.distanceValue || 0) - (b.distanceValue || 0));

      setTrucks(trucksWithDistance);
    } catch (error: any) {
      console.error('Error fetching trucks:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch food trucks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...trucks];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(truck =>
        truck.name.toLowerCase().includes(searchTerm) ||
        truck.description.toLowerCase().includes(searchTerm) ||
        truck.cuisine.toLowerCase().includes(searchTerm) ||
        truck.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Cuisine filter
    if (filters.cuisine.length > 0 && !filters.cuisine.includes('All')) {
      filtered = filtered.filter(truck =>
        filters.cuisine.some(cuisine =>
          truck.cuisine.toLowerCase().includes(cuisine.toLowerCase()) ||
          truck.tags.some(tag => tag.toLowerCase().includes(cuisine.toLowerCase()))
        )
      );
    }

    // Price range filter
    if (filters.priceRange.length > 0) {
      filtered = filtered.filter(truck =>
        filters.priceRange.includes(truck.priceRange)
      );
    }

    // Open now filter
    if (filters.openNow) {
      filtered = filtered.filter(truck => truck.status === 'open');
    }

    setFilteredTrucks(filtered);
  };

  const openDirections = (truck: FoodTruck) => {
    if (!userLocation) {
      toast({
        title: "Location Required",
        description: "Please enable location access to get directions",
        variant: "destructive",
      });
      return;
    }

    const { latitude, longitude } = truck.location.coordinates;
    const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation.lat}%2C${userLocation.lng}%3B${latitude}%2C${longitude}`;
    window.open(url, '_blank');
  };

  const viewTruckDetails = (truckId: string) => {
    navigate(`/trucks/${truckId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-yellow-50"> {/* Background changed to light yellow */}
      <Navbar />

      <main className="flex-grow pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foodtruck-slate mb-2">Find Food Trucks</h1>
              <p className="text-foodtruck-slate/80">
                {userLocation ? `Found ${filteredTrucks.length} trucks near ${userLocation.address.split(',')[0]}` : 'Discover and filter food trucks in your area'}
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <div className="flex items-center bg-white rounded-lg shadow-sm p-1 border border-foodtruck-slate/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={cn("p-1.5 rounded", viewMode === 'list' ? "text-foodtruck-teal" : "text-foodtruck-slate/70")}
                >
                  <List className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={cn("p-1.5 rounded", viewMode === 'grid' ? "text-foodtruck-teal" : "text-foodtruck-slate/70")}
                >
                  <Grid3X3 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Enhanced Filters Sidebar */}
            {showFilters && (
              <div className="lg:w-1/4">
                <Card className="bg-yellow-100">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Filter className="h-5 w-5 mr-2" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Search */}
                    <div className="space-y-2">
                      <Label htmlFor="search">Search</Label>
                      <Input
                        id="search"
                        placeholder="Search trucks, cuisine, tags..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      />
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="current-location"
                            checked={filters.useCurrentLocation}
                            onCheckedChange={(checked) => {
                              setFilters(prev => ({ ...prev, useCurrentLocation: checked as boolean }));
                              if (checked) {
                                getCurrentLocation();
                              }
                            }}
                          />
                          <Label htmlFor="current-location" className="text-sm">Use current location</Label>
                        </div>

                        {!filters.useCurrentLocation && (
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter address or city"
                              value={filters.location}
                              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  searchLocation(filters.location);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => searchLocation(filters.location)}
                              disabled={locationLoading}
                            >
                              <Navigation className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

                        {userLocation && (
                          <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                            📍 {userLocation.address.split(',').slice(0, 2).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Distance */}
                    <div className="space-y-2">
                      <Label htmlFor="distance">Distance</Label>
                      <Select
                        value={filters.distance.toString()}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, distance: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Within 1 Km</SelectItem>
                          <SelectItem value="3">Within 3 Km</SelectItem>
                          <SelectItem value="5">Within 5 Km</SelectItem>
                          <SelectItem value="10">Within 10 Km</SelectItem>
                          <SelectItem value="25">Within 25 Km</SelectItem>
                          <SelectItem value="50">Within 50 Km</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Cuisine Type */}
                    <div className="space-y-2">
                      <Label>Cuisine Type</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {['All', 'North Indian', 'South Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 'American', 'Dessert', 'Vegan', 'BBQ'].map((cuisine) => (
                          <div key={cuisine} className="flex items-center space-x-2">
                            <Checkbox
                              id={`cuisine-${cuisine}`}
                              checked={filters.cuisine.includes(cuisine)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters(prev => ({
                                    ...prev,
                                    cuisine: cuisine === 'All' ? ['All'] : [...prev.cuisine.filter(c => c !== 'All'), cuisine]
                                  }));
                                } else {
                                  setFilters(prev => ({
                                    ...prev,
                                    cuisine: prev.cuisine.filter(c => c !== cuisine)
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={`cuisine-${cuisine}`} className="text-sm">{cuisine}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-2">
                      <Label>Price Range</Label>
                      <div className="space-y-2">
                        {[
                          { value: 'budget', label: 'Budget (₹)', desc: 'Under ₹200' },
                          { value: 'mid', label: 'Mid-range (₹₹)', desc: '₹200-500' },
                          { value: 'premium', label: 'Premium (₹₹₹)', desc: 'Above ₹500' }
                        ].map((price) => (
                          <div key={price.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`price-${price.value}`}
                              checked={filters.priceRange.includes(price.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters(prev => ({
                                    ...prev,
                                    priceRange: [...prev.priceRange, price.value]
                                  }));
                                } else {
                                  setFilters(prev => ({
                                    ...prev,
                                    priceRange: prev.priceRange.filter(p => p !== price.value)
                                  }));
                                }
                              }}
                            />
                            <div>
                              <Label htmlFor={`price-${price.value}`} className="text-sm">{price.label}</Label>
                              <p className="text-xs text-gray-500">{price.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Open Now */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="open-now"
                        checked={filters.openNow}
                        onCheckedChange={(checked) => setFilters(prev => ({ ...prev, openNow: checked as boolean }))}
                      />
                      <Label htmlFor="open-now" className="text-sm">Open Now</Label>
                    </div>

                    {/* Clear Filters */}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setFilters({
                        location: '',
                        useCurrentLocation: true,
                        distance: 10,
                        cuisine: [],
                        priceRange: [],
                        openNow: false,
                        search: ''
                      })}
                    >
                      Clear All Filters
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Map & Results View */}
            <div className={cn("flex-1", showFilters ? "lg:w-3/4" : "w-full")}>
              {/* Map */}
              <Card className="mb-6">
                <CardContent className="p-0">
                  <div className="h-[400px] relative">
                    <TruckMap
                      trucks={filteredTrucks}
                      center={userLocation ? [userLocation.lat, userLocation.lng] : undefined}
                      height="400px"
                      highlightedTruckId={selectedTruck}
                    />
                    {loading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foodtruck-teal mx-auto"></div>
                          <p className="mt-2 text-sm text-gray-600">Loading trucks...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Search Results</CardTitle>
                      <CardDescription>
                        {loading ? 'Loading...' : `Found ${filteredTrucks.length} food trucks`}
                      </CardDescription>
                    </div>
                    {userLocation && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => getCurrentLocation()}
                        disabled={locationLoading}
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Refresh Location
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-32 bg-gray-200 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : filteredTrucks.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No food trucks found</h3>
                      <p className="text-gray-500 mb-4">
                        Try adjusting your filters or search in a different area.
                      </p>
                      <Button onClick={() => setFilters(prev => ({ ...prev, distance: prev.distance * 2 }))}>
                        Expand Search Area
                      </Button>
                    </div>
                  ) : (
                    <div className={cn(
                      viewMode === 'list' ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    )}>
                      {filteredTrucks.map((truck) => (
                        <TruckCard
                          key={truck._id}
                          truck={truck}
                          userLocation={userLocation}
                          onDirections={() => openDirections(truck)}
                          onViewDetails={() => viewTruckDetails(truck._id)}
                          onHover={() => setSelectedTruck(truck._id)}
                          onLeave={() => setSelectedTruck(null)}
                          isHighlighted={selectedTruck === truck._id}
                          viewMode={viewMode}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Truck Card Component
interface TruckCardProps {
  truck: FoodTruck;
  userLocation: LocationState | null;
  onDirections: () => void;
  onViewDetails: () => void;
  onHover: () => void;
  onLeave: () => void;
  isHighlighted: boolean;
  viewMode: 'list' | 'grid';
}

const TruckCard: React.FC<TruckCardProps> = ({
  truck,
  userLocation,
  onDirections,
  onViewDetails,
  onHover,
  onLeave,
  isHighlighted,
  viewMode
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'opening-soon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriceRangeDisplay = (priceRange: string) => {
    switch (priceRange) {
      case 'budget': return '₹';
      case 'mid': return '₹₹';
      case 'premium': return '₹₹₹';
      default: return '₹';
    }
  };

  // Grid view - compact card layout
  if (viewMode === 'grid') {
    return (
      <Card
        className={cn(
          "transition-all duration-200 cursor-pointer hover:shadow-lg overflow-hidden",
          isHighlighted && "ring-2 ring-foodtruck-teal shadow-lg"
        )}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={onViewDetails}
      >
        {/* Truck Image Carousel */}
        <div className="h-48 relative">
          <TruckImageCarousel
            images={truck.images || []}
            truckName={truck.name}
            height="100%"
            autoPlay={true}
            autoPlayInterval={5000}
            showControls={true}
            showIndicators={true}
            onImageClick={() => {}} // Handled by card click
          />

          {/* Status Badge Overlay */}
          <div className="absolute top-2 right-2 z-10">
            <Badge className={cn(getStatusColor(truck.status), "text-xs shadow-md")}>
              {truck.status === 'opening-soon' ? 'Opening Soon' : truck.status}
            </Badge>
          </div>

          {/* Distance Badge Overlay */}
          {truck.distance && (
            <div className="absolute bottom-2 left-2 z-10">
              <Badge className="bg-black/70 text-white text-xs shadow-md">
                <MapPin className="h-3 w-3 mr-1" />
                {truck.distance}
              </Badge>
            </div>
          )}
        </div>

        {/* Compact Details */}
        <CardContent className="p-4">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{truck.name}</h3>
              <div className="flex items-center">
                <Star className="h-3 w-3 text-yellow-400 mr-1" />
                <span className="text-xs font-medium">{truck.rating}</span>
              </div>
            </div>

            <p className="text-gray-600 text-xs mb-2 line-clamp-2">{truck.description}</p>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>{truck.cuisine}</span>
              <span>{getPriceRangeDisplay(truck.priceRange)}</span>
            </div>

            <div className="flex flex-wrap gap-1 mb-2">
              {truck.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                  {tag}
                </Badge>
              ))}
              {truck.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  +{truck.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-2" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              onClick={onViewDetails}
              className="w-full bg-foodtruck-teal hover:bg-foodtruck-teal/90 text-white"
            >
              See Details
            </Button>

            <div className="flex justify-between items-center">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onDirections();
                }}
                className="text-xs px-2 py-1 flex-1 mr-1"
              >
                <Route className="h-3 w-3 mr-1" />
                Directions
              </Button>

              <div className="flex space-x-1">
                {truck.aboutInfo?.phone && (
                  <Button size="sm" variant="ghost" asChild className="p-1">
                    <a href={`tel:${truck.aboutInfo.phone}`} onClick={(e) => e.stopPropagation()}>
                      <Phone className="h-3 w-3" />
                    </a>
                  </Button>
                )}
                {truck.aboutInfo?.website && (
                  <Button size="sm" variant="ghost" asChild className="p-1">
                    <a href={truck.aboutInfo.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <Globe className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // List view - detailed card layout
  return (
    <Card
      className={cn(
        "transition-all duration-200 cursor-pointer hover:shadow-lg overflow-hidden",
        isHighlighted && "ring-2 ring-foodtruck-teal shadow-lg"
      )}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onViewDetails}
    >
      <div className="flex flex-col md:flex-row">
        {/* Truck Image Carousel */}
        <div className="md:w-1/3 h-48 md:h-auto relative">
          <TruckImageCarousel
            images={truck.images || []}
            truckName={truck.name}
            height="100%"
            autoPlay={true}
            autoPlayInterval={6000}
            showControls={true}
            showIndicators={true}
            onImageClick={() => {}} // Handled by card click
          />

          {/* Status Badge Overlay */}
          <div className="absolute top-3 right-3 z-10">
            <Badge className={cn(getStatusColor(truck.status), "shadow-md")}>
              {truck.status === 'opening-soon' ? 'Opening Soon' : truck.status}
            </Badge>
          </div>

          {/* Distance Badge Overlay */}
          {truck.distance && (
            <div className="absolute bottom-3 left-3 z-10">
              <Badge className="bg-black/70 text-white shadow-md">
                <MapPin className="h-3 w-3 mr-1" />
                {truck.distance}
              </Badge>
            </div>
          )}
        </div>

        {/* Truck Details */}
        <CardContent className="md:w-2/3 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{truck.name}</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{truck.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({truck.reviewCount})</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{truck.description}</p>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <span>{truck.cuisine}</span>
                <span>{getPriceRangeDisplay(truck.priceRange)}</span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {truck.waitTime}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {truck.tags.slice(0, 4).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {truck.tags.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{truck.tags.length - 4} more
                  </Badge>
                )}
              </div>

              <p className="text-xs text-gray-500 mb-4 line-clamp-1">
                📍 {truck.location.address}
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
            {/* Primary Action */}
            <Button
              onClick={onViewDetails}
              className="w-full bg-foodtruck-teal hover:bg-foodtruck-teal/90 text-white"
            >
              See Details
            </Button>

            {/* Secondary Actions */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {truck.aboutInfo?.phone && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`tel:${truck.aboutInfo.phone}`} onClick={(e) => e.stopPropagation()}>
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </a>
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDirections();
                  }}
                >
                  <Route className="h-4 w-4 mr-1" />
                  Directions
                </Button>
              </div>

              <div className="flex space-x-1">
                {truck.aboutInfo?.website && (
                  <Button size="sm" variant="ghost" asChild>
                    <a href={truck.aboutInfo.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <Globe className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {truck.aboutInfo?.instagram && (
                  <Button size="sm" variant="ghost" asChild>
                    <a href={truck.aboutInfo.instagram} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <Instagram className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {truck.aboutInfo?.twitter && (
                  <Button size="sm" variant="ghost" asChild>
                    <a href={truck.aboutInfo.twitter} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default FindTrucks;
