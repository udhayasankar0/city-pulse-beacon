
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">City Pulse</h1>
          <p className="text-sm text-gray-600">Stay informed about your city</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-t">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} className="mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'map' && (
          <div className="h-[calc(100vh-140px)]">
            <MapView
              incidents={incidents}
              onIncidentClick={handleIncidentClick}
            />
          </div>
        )}
        
        {activeTab === 'list' && (
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
        )}
        
        {activeTab === 'report' && (
          <ReportForm
            onSubmit={handleReportSubmit}
            existingIncidents={incidents}
          />
        )}
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
