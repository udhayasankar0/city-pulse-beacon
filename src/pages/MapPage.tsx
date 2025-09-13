import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { useReports } from '@/context/ReportsContext';
import { Report } from '@/data/dummyReports';
import StatusBadge from '@/components/StatusBadge';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPageProps {
  onReportClick?: (reportId: string) => void;
}

const MapPage: React.FC<MapPageProps> = ({ onReportClick }) => {
  const { reports } = useReports();
  const defaultCenter: [number, number] = [11.0168, 76.9558]; // Coimbatore coordinates

  const createCustomIcon = (status: Report['status']) => {
    const colors = {
      'Reported': '#F59E0B', // accent-600
      'In Progress': '#0FBF9B', // brand-500
      'Resolved': '#16A34A', // success-500
    };
    
    const isPulse = status === 'Reported';
    
    return divIcon({
      html: `<div class="relative">
        <div style="
          background-color: ${colors[status]}; 
          width: 24px; 
          height: 24px; 
          border-radius: 50%; 
          border: 3px solid white; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          ${isPulse ? 'animation: pin-pulse 2s infinite;' : ''}
        "></div>
      </div>`,
      className: 'custom-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
  };

  return (
    <div className="relative h-full w-full">
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.1);
          padding: 0;
          border: 1px solid hsl(var(--soft-border));
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
          width: 280px !important;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        .leaflet-popup-close-button {
          display: none;
        }
      `}</style>
      
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.geo.lat, report.geo.lng]}
            icon={createCustomIcon(report.status)}
          >
            <Popup closeButton={false} className="custom-popup">
              <div className="p-4">
                {/* Image */}
                <img 
                  src={report.image} 
                  alt={report.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                
                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">
                      {report.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {report.description.slice(0, 80)}...
                    </p>
                  </div>
                  
                  {/* Meta */}
                  <div className="flex items-center gap-2">
                    <StatusBadge status={report.status} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      {report.type}
                    </span>
                  </div>
                  
                  {/* Action */}
                  <button
                    onClick={() => onReportClick?.(report.id)}
                    className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-card-bg rounded-xl shadow-soft p-3 z-20 border border-soft-border">
        <h4 className="text-sm font-semibold text-foreground mb-2">Status Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-accent-600"></div>
            <span className="text-muted-foreground">Reported</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-muted-foreground">In Progress</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-success-500"></div>
            <span className="text-muted-foreground">Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;