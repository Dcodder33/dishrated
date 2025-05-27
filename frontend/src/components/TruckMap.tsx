import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TruckMap.css';
import { MapPin, Truck } from 'lucide-react';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TruckMapProps {
  trucks?: Array<{
    _id: string;
    name: string;
    location: {
      coordinates: {
        latitude: number;
        longitude: number;
      };
      address: string;
    };
    cuisine: string;
    status: string;
    rating: number;
  }>;
  center?: [number, number];
  zoom?: number;
  height?: string;
  highlightedTruckId?: string | null;
  onMarkerHover?: (truckId: string | null) => void;
}

const TruckMap: React.FC<TruckMapProps> = ({
  trucks = [],
  center = [20.3538431, 85.8169059], // KIIT Campus coordinates
  zoom = 13,
  height = "400px",
  highlightedTruckId = null,
  onMarkerHover
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [hoveredTruckId, setHoveredTruckId] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Add a small delay to ensure the DOM element is fully rendered
    const timer = setTimeout(() => {
      try {
        // Initialize map
        const map = L.map(mapRef.current!).setView(center, zoom);
        mapInstanceRef.current = map;

        // Add OpenStreetMap tiles
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        });

        tileLayer.addTo(map);

        // Function to create truck icon
        const createTruckIcon = (isHighlighted: boolean = false, isHovered: boolean = false, truckName: string = '') => {
          let bgColor = 'bg-foodtruck-teal';
          if (isHighlighted) {
            bgColor = 'bg-foodtruck-gold';
          } else if (isHovered) {
            bgColor = 'bg-yellow-400'; // Yellow highlight for hover
          }
          const shadowClass = (isHighlighted || isHovered) ? 'shadow-2xl' : 'shadow-lg';

          return L.divIcon({
            html: `<div class="${bgColor} text-white rounded-full p-2 ${shadowClass} transition-colors duration-300 border-2 border-white cursor-pointer"
                        title="${truckName}">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                       <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                     </svg>
                   </div>`,
            className: `custom-truck-marker ${isHighlighted ? 'highlighted' : ''} ${isHovered ? 'hovered' : ''}`,
            iconSize: [40, 40], // Fixed size for all markers
            iconAnchor: [20, 20], // Fixed anchor point
            popupAnchor: [0, -20],
          });
        };

        // Clear existing markers
        markersRef.current.clear();

        // Add truck markers
        trucks.forEach((truck) => {
          const { latitude, longitude } = truck.location.coordinates;
          const isHighlighted = highlightedTruckId === truck._id;
          const isHovered = hoveredTruckId === truck._id;

          const marker = L.marker([latitude, longitude], {
            icon: createTruckIcon(isHighlighted, isHovered, truck.name),
            zIndexOffset: isHighlighted ? 1000 : (isHovered ? 500 : 0) // Bring highlighted/hovered marker to front
          }).addTo(map);

          // Add hover event handlers
          marker.on('mouseover', () => {
            setHoveredTruckId(truck._id);
            if (onMarkerHover) {
              onMarkerHover(truck._id);
            }
          });

          marker.on('mouseout', () => {
            setHoveredTruckId(null);
            if (onMarkerHover) {
              onMarkerHover(null);
            }
          });

          // Create popup content
          const popupContent = `
            <div class="p-3 min-w-[200px]">
              <h3 class="font-bold text-lg text-foodtruck-slate mb-1">${truck.name}</h3>
              <p class="text-sm text-foodtruck-slate/70 mb-2">${truck.cuisine}</p>
              <div class="flex items-center mb-2">
                <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  truck.status === 'open'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }">
                  <span class="w-1.5 h-1.5 rounded-full mr-1 ${
                    truck.status === 'open' ? 'bg-green-800' : 'bg-red-800'
                  }"></span>
                  ${truck.status === 'open' ? 'Open Now' : 'Closed'}
                </span>
              </div>
              <div class="flex items-center mb-3">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span class="text-sm text-foodtruck-slate">${truck.rating}</span>
                </div>
              </div>
              <p class="text-xs text-foodtruck-slate/60 mb-3">${truck.location.address}</p>
              <button
                onclick="window.location.href='/trucks/${truck._id}'"
                class="w-full bg-foodtruck-teal text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-foodtruck-teal/90 transition-colors"
              >
                View Details
              </button>
            </div>
          `;

          marker.bindPopup(popupContent, {
            maxWidth: 250,
            className: 'custom-popup'
          });

          // Add hover tooltip with truck name
          const tooltipContent = `
            <div class="bg-foodtruck-slate text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
                ${truck.name}
              </div>
              <div class="text-xs text-white/80 mt-1">${truck.cuisine} • ${truck.status}</div>
            </div>
          `;

          marker.bindTooltip(tooltipContent, {
            permanent: false,
            direction: 'top',
            offset: [0, -10],
            className: 'custom-tooltip',
            opacity: 0.95
          });

          // Store marker reference
          markersRef.current.set(truck._id, marker);
        });

        // Add center marker if no trucks
        if (trucks.length === 0) {
          const centerIcon = L.divIcon({
            html: `<div class="bg-blue-500 text-white rounded-full p-2 shadow-lg">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                       <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                     </svg>
                   </div>`,
            className: 'custom-center-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          });

          L.marker(center, { icon: centerIcon })
            .addTo(map)
            .bindPopup('<div class="p-2"><strong>KIIT Campus</strong><br/>Bhubaneswar, Odisha</div>');
        }

        // Force map to resize after initialization
        setTimeout(() => {
          map.invalidateSize();
        }, 100);

      } catch (error) {
        console.error('TruckMap: Error initializing map:', error);
      }
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [trucks, center, zoom, hoveredTruckId]);

  // Effect to handle highlighting changes without recreating the map
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Function to create truck icon
    const createTruckIcon = (isHighlighted: boolean = false, isHovered: boolean = false, truckName: string = '') => {
      let bgColor = 'bg-foodtruck-teal';
      if (isHighlighted) {
        bgColor = 'bg-foodtruck-gold';
      } else if (isHovered) {
        bgColor = 'bg-yellow-400'; // Yellow highlight for hover
      }
      const shadowClass = (isHighlighted || isHovered) ? 'shadow-2xl' : 'shadow-lg';

      return L.divIcon({
        html: `<div class="${bgColor} text-white rounded-full p-2 ${shadowClass} transition-colors duration-300 border-2 border-white cursor-pointer"
                    title="${truckName}">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                 </svg>
               </div>`,
        className: `custom-truck-marker ${isHighlighted ? 'highlighted' : ''} ${isHovered ? 'hovered' : ''}`,
        iconSize: [40, 40], // Fixed size for all markers
        iconAnchor: [20, 20], // Fixed anchor point
        popupAnchor: [0, -20],
      });
    };

    // Update all markers based on highlighting and hovering
    markersRef.current.forEach((marker, truckId) => {
      const isHighlighted = highlightedTruckId === truckId;
      const isHovered = hoveredTruckId === truckId;
      // Find the truck data to get the name
      const truck = trucks.find(t => t._id === truckId);
      const truckName = truck ? truck.name : '';
      marker.setIcon(createTruckIcon(isHighlighted, isHovered, truckName));
      marker.setZIndexOffset(isHighlighted ? 1000 : (isHovered ? 500 : 0));
    });
  }, [highlightedTruckId, hoveredTruckId, trucks]);

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg relative z-0">
      <style>{`
        .custom-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .custom-tooltip .leaflet-tooltip-content {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          padding: 0 !important;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0 !important;
          padding: 0 !important;
        }
        .custom-popup .leaflet-popup-tip {
          background: white !important;
        }
        .custom-truck-marker {
          transition: none !important;
        }
        .custom-truck-marker.highlighted {
          /* No animations - just color change */
        }
      `}</style>
      <div
        ref={mapRef}
        style={{ height, zIndex: 1 }}
        className="w-full relative z-0"
      />
      {trucks.length === 0 && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center text-sm text-foodtruck-slate">
            <MapPin className="w-4 h-4 mr-2 text-foodtruck-teal" />
            <span>No food trucks in this area</span>
          </div>
        </div>
      )}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
        <div className="flex items-center text-xs text-foodtruck-slate">
          <Truck className="w-3 h-3 mr-1 text-foodtruck-teal" />
          <span>{trucks.length} truck{trucks.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};

export default TruckMap;
