import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Clock, 
  Navigation,
  Trash2,
  Eye,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

interface LocationHistoryEntry {
  id: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timestamp: Date;
  duration?: number; // minutes spent at this location
  isActive?: boolean;
}

interface LocationHistoryProps {
  truckId: string;
  onSelectLocation?: (location: LocationHistoryEntry) => void;
  onClearHistory?: () => void;
}

const LocationHistory: React.FC<LocationHistoryProps> = ({
  truckId,
  onSelectLocation,
  onClearHistory
}) => {
  const [history, setHistory] = useState<LocationHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration - in real app, this would come from API
  useEffect(() => {
    const mockHistory: LocationHistoryEntry[] = [
      {
        id: '1',
        address: 'KIIT University, Campus 1, Bhubaneswar',
        coordinates: { latitude: 20.3538431, longitude: 85.8169059 },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        duration: 120,
        isActive: true
      },
      {
        id: '2',
        address: 'Esplanade One Mall, Rasulgarh, Bhubaneswar',
        coordinates: { latitude: 20.3019, longitude: 85.8449 },
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        duration: 180
      },
      {
        id: '3',
        address: 'Patia Square, Bhubaneswar',
        coordinates: { latitude: 20.3587, longitude: 85.8230 },
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        duration: 240
      },
      {
        id: '4',
        address: 'Kalinga Stadium, Bhubaneswar',
        coordinates: { latitude: 20.2847, longitude: 85.8233 },
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        duration: 150
      }
    ];
    
    setHistory(mockHistory);
  }, [truckId]);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / (24 * 60));
      return `${days}d ago`;
    }
  };

  const handleSelectLocation = (location: LocationHistoryEntry) => {
    if (onSelectLocation) {
      onSelectLocation(location);
    }
  };

  const handleClearHistory = () => {
    if (onClearHistory) {
      onClearHistory();
    }
    setHistory([]);
  };

  const removeHistoryEntry = (id: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Location History
            </CardTitle>
            <CardDescription>
              Recent locations where your food truck has been
            </CardDescription>
          </div>
          
          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearHistory}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No location history yet</p>
            <p className="text-sm text-gray-400">
              Start sharing your location to build a history
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((entry) => (
              <div
                key={entry.id}
                className={`border rounded-lg p-4 transition-colors hover:bg-gray-50 ${
                  entry.isActive ? 'border-foodtruck-teal bg-foodtruck-teal/5' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-2">
                      <MapPin className={`h-4 w-4 mr-2 ${
                        entry.isActive ? 'text-foodtruck-teal' : 'text-gray-400'
                      }`} />
                      <span className="font-medium text-sm truncate">
                        {entry.address}
                      </span>
                      {entry.isActive && (
                        <Badge variant="default" className="ml-2 text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(entry.timestamp, 'MMM d, h:mm a')}
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {getTimeAgo(entry.timestamp)}
                      </div>
                      
                      {entry.duration && (
                        <div className="flex items-center">
                          <Navigation className="h-3 w-3 mr-1" />
                          {formatDuration(entry.duration)}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-400 mt-1">
                      {entry.coordinates.latitude.toFixed(4)}, {entry.coordinates.longitude.toFixed(4)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectLocation(entry)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {!entry.isActive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHistoryEntry(entry.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationHistory;
