import React, { useState, useEffect, useRef } from 'react';
import { Camera, MapPin } from 'lucide-react';
import { Incident } from '@/types/incident';
import MapView from './MapView';

interface ReportFormProps {
  onSubmit: (incident: Omit<Incident, 'id' | 'timestamp'>) => void;
  existingIncidents: Incident[];
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, existingIncidents }) => {
  const [image, setImage] = useState<string>('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Incident['type']>('other');
  const [location, setLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    const locationName = `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    setLocation({ lat, lng, name: locationName });
    setShowMap(false);
  };

  // When the map tab is shown, invalidate size so Leaflet redraws
  useEffect(() => {
    if (showMap && mapRef.current) {
      setTimeout(() => mapRef.current?.invalidateSize(), 200);
    }
  }, [showMap]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !location || !title.trim()) {
      alert('Please fill in all required fields (image, title, and location)');
      return;
    }

    const newIncident: Omit<Incident, 'id' | 'timestamp'> = {
      title: title.trim(),
      description: description.trim() || title.trim(),
      shortSummary: description.trim() ? description.trim().slice(0, 100) + '...' : title.trim(),
      location,
      image,
      type,
    };

    onSubmit(newIncident);
    setImage('');
    setDescription('');
    setTitle('');
    setType('other');
    setLocation(null);
    alert('Incident reported successfully!');
  };

  if (showMap) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 bg-white border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Select Location</h2>
            <button onClick={() => setShowMap(false)} className="text-gray-500 hover:text-gray-700">
              Cancel
            </button>
          </div>
        </div>
        <div className="flex-1 h-[60vh]">
          <MapView
            incidents={existingIncidents}
            onIncidentClick={() => {}}
            newIncidentLocation={location}
            onMapClick={handleMapClick}
            isReporting
            whenCreated={(map) => (mapRef.current = map)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Report Incident</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo <span className="text-red-500">*</span>
          </label>
          {image ? (
            <div className="relative">
              <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => setImage('')}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Camera size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Tap to upload photo</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief description of the incident"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as Incident['type'])}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="traffic">Traffic</option>
            <option value="weather">Weather</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="safety">Safety</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional details about the incident..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          {location ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-green-600" />
                  <span className="text-sm text-green-800">{location.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className="text-blue-600 text-sm hover:text-blue-700"
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowMap(true)}
              className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400 transition-colors"
            >
              <MapPin size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">Tap to select location on map</p>
            </button>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
