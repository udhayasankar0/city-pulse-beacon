
import React from 'react';
import { Incident } from '@/types/incident';

interface IncidentsListProps {
  incidents: Incident[];
  onIncidentClick: (incident: Incident) => void;
}

const IncidentsList: React.FC<IncidentsListProps> = ({ incidents, onIncidentClick }) => {
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'traffic': return 'bg-red-100 text-red-800';
      case 'weather': return 'bg-blue-100 text-blue-800';
      case 'infrastructure': return 'bg-orange-100 text-orange-800';
      case 'safety': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {incidents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No incidents reported yet</p>
        </div>
      ) : (
        incidents.map((incident) => (
          <div
            key={incident.id}
            onClick={() => onIncidentClick(incident)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex space-x-3">
              <img
                src={incident.image}
                alt={incident.title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(incident.type)}`}>
                    {incident.type.charAt(0).toUpperCase() + incident.type.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(incident.timestamp)}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                  {incident.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {incident.shortSummary}
                </p>
                
                <p className="text-xs text-gray-500">
                  📍 {incident.location.name}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default IncidentsList;
