
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Incident } from '@/types/incident';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  incidents: Incident[];
  onIncidentClick: (incident: Incident) => void;
  newIncidentLocation?: { lat: number; lng: number } | null;
  onMapClick?: (lat: number, lng: number) => void;
  isReporting?: boolean;
}

const MapView: React.FC<MapViewProps> = ({ 
  incidents, 
  onIncidentClick, 
  newIncidentLocation, 
  onMapClick,
  isReporting = false 
}) => {
  const defaultCenter: [number, number] = [11.0168, 76.9558]; // Coimbatore coordinates

  const createCustomIcon = (type: string) => {
    const colors = {
      traffic: '#ef4444',
      weather: '#3b82f6',
      infrastructure: '#f97316',
      safety: '#eab308',
      other: '#6b7280'
    };
    
    return divIcon({
      html: `<div style="background-color: ${colors[type as keyof typeof colors] || colors.other}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
      className: 'custom-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  const newLocationIcon = divIcon({
    html: '<div style="background-color: #10b981; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); animation: pulse 2s infinite;"></div>',
    className: 'custom-marker new-location',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  const MapClickHandler = () => {
    React.useEffect(() => {
      if (!isReporting || !onMapClick) return;

      const map = document.querySelector('.leaflet-container') as any;
      if (!map) return;

      const handleClick = (e: any) => {
        const { lat, lng } = e.latlng;
        onMapClick(lat, lng);
      };

      map._leaflet.on('click', handleClick);
      return () => map._leaflet.off('click', handleClick);
    }, []);

    return null;
  };

  return (
    <div className="relative w-full h-full">
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>
      
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {isReporting && <MapClickHandler />}
        
        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.location.lat, incident.location.lng]}
            icon={createCustomIcon(incident.type)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm mb-1">{incident.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{incident.shortSummary}</p>
                <button
                  onClick={() => onIncidentClick(incident)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {newIncidentLocation && (
          <Marker
            position={[newIncidentLocation.lat, newIncidentLocation.lng]}
            icon={newLocationIcon}
          >
            <Popup>
              <div className="p-2">
                <p className="text-sm font-medium">New Report Location</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      {isReporting && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-20">
          <p className="text-sm font-medium text-gray-700">
            Tap on the map to select incident location
          </p>
        </div>
      )}
    </div>
  );
};

export default MapView;
