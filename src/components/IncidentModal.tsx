
import React from 'react';
import { X } from 'lucide-react';
import { Incident } from '@/types/incident';

interface IncidentModalProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
}

const IncidentModal: React.FC<IncidentModalProps> = ({ incident, isOpen, onClose }) => {
  if (!isOpen || !incident) return null;

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img 
            src={incident.image} 
            alt={incident.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              incident.type === 'traffic' ? 'bg-red-100 text-red-800' :
              incident.type === 'weather' ? 'bg-blue-100 text-blue-800' :
              incident.type === 'infrastructure' ? 'bg-orange-100 text-orange-800' :
              incident.type === 'safety' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {incident.type.charAt(0).toUpperCase() + incident.type.slice(1)}
            </span>
            <span className="text-sm text-gray-500">
              {formatTimestamp(incident.timestamp)}
            </span>
          </div>
          
          <h2 className="text-xl font-bold mb-3">{incident.title}</h2>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Location</h3>
            <p className="text-gray-800">{incident.location.name}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Description</h3>
            <p className="text-gray-800 leading-relaxed">{incident.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentModal;
