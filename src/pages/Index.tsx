
import React, { useState } from 'react';
import { MapPin, List, Plus } from 'lucide-react';
import MapView from '@/components/MapView';
import IncidentsList from '@/components/IncidentsList';
import ReportForm from '@/components/ReportForm';
import IncidentModal from '@/components/IncidentModal';
import { Incident } from '@/types/incident';
import { sampleIncidents } from '@/data/sampleIncidents';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'report'>('map');
  const [incidents, setIncidents] = useState<Incident[]>(sampleIncidents);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleIncidentClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsModalOpen(true);
  };

  const handleReportSubmit = (newIncident: Omit<Incident, 'id' | 'timestamp'>) => {
    const incident: Incident = {
      ...newIncident,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    setIncidents(prev => [incident, ...prev]);
    setActiveTab('map');
  };

  const tabs = [
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'list', label: 'Recent', icon: List },
    { id: 'report', label: 'Report', icon: Plus }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header - Simplified */}
      <div className="bg-white shadow-sm border-b px-4 py-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">City Pulse</h1>
        <p className="text-sm text-gray-600">Stay informed about your city</p>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'map' && (
          <div className="flex-1">
            <MapView
              incidents={incidents}
              onIncidentClick={handleIncidentClick}
            />
          </div>
        )}
        
        {activeTab === 'list' && (
          <div className="h-full overflow-y-auto">
            <div className="p-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Incidents</h2>
                <p className="text-sm text-gray-600">{incidents.length} incidents reported</p>
              </div>
              
              <IncidentsList
                incidents={incidents}
                onIncidentClick={handleIncidentClick}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'report' && (
          <div className="h-full overflow-y-auto">
            <ReportForm
              onSubmit={handleReportSubmit}
              existingIncidents={incidents}
            />
          </div>
        )}
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-[60px] flex items-center z-50">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-2 transition-colors ${
              activeTab === id
                ? 'text-[#87CEFA]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon 
              size={24} 
              className={`mb-1 ${
                activeTab === id ? 'text-[#87CEFA]' : 'text-gray-500'
              }`} 
            />
            <span className={`text-xs font-medium ${
              activeTab === id ? 'text-[#87CEFA]' : 'text-gray-500'
            }`}>
              {label}
            </span>
            {activeTab === id && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#87CEFA] rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Modal */}
      <IncidentModal
        incident={selectedIncident}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedIncident(null);
        }}
      />
    </div>
  );
};

export default Index;
