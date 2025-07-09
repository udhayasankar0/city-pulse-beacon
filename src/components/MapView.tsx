
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Incident } from '@/types/incident';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  incidents: Incident[];
  onIncidentClick: (incident: Incident) => void;
  newIncidentLocation?: { lat: number; lng: number } | null;
  onMapClick?: (lat: number, lng: number) => void;
  isReporting?: boolean;
}

// Separate component for handling map clicks
const MapClickHandler: React.FC<{ onMapClick?: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

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

  return (
    <div className="relative w-full h-full">
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        .custom-popup .leaflet-popup-content-wrapper {
          background: transparent;
          border-radius: 0;
          box-shadow: none;
          padding: 0;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
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
        
        {isReporting && onMapClick && <MapClickHandler onMapClick={onMapClick} />}
        
        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.location.lat, incident.location.lng]}
            icon={createCustomIcon(incident.type)}
          >
            <Popup closeButton={false} className="custom-popup">
              <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-xs">
                <button
                  onClick={() => {/* Close popup */}}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                >
                  ×
                </button>
                <h3 className="font-medium text-[#004080] mb-2 pr-6">{incident.title}</h3>
                <p className="text-gray-700 mb-4 text-sm">{incident.shortSummary}</p>
                <button
                  onClick={() => onIncidentClick(incident)}
                  className="w-full bg-[#004080] text-white py-2 rounded-md hover:bg-[#003060] transition-colors text-sm font-medium"
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
