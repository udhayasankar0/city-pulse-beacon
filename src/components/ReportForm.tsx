import React, { useState, useRef } from 'react';
import { Camera, MapPin } from 'lucide-react';
import { Incident } from '@/types/incident';
// @ts-ignore
import EXIF from 'exif-js';

interface ReportFormProps {
  onSubmit: (incident: Omit<Incident, 'id' | 'timestamp'>) => void;
  existingIncidents: Incident[];
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit }) => {
  const [image, setImage] = useState<string>('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Incident['type']>('other');
  const [location, setLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractGPSFromImage = (file: File) => {
    EXIF.getData(file as any, function(this: any) {
      const lat = EXIF.getTag(this, "GPSLatitude");
      const lon = EXIF.getTag(this, "GPSLongitude");
      const latRef = EXIF.getTag(this, "GPSLatitudeRef");
      const lonRef = EXIF.getTag(this, "GPSLongitudeRef");
      
      if (lat && lon) {
        const latitude = (lat[0] + lat[1]/60 + lat[2]/3600) * (latRef === 'S' ? -1 : 1);
        const longitude = (lon[0] + lon[1]/60 + lon[2]/3600) * (lonRef === 'W' ? -1 : 1);
        
        const locationName = `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        setLocation({ lat: latitude, lng: longitude, name: locationName });
      }
    });
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
      
      // Extract GPS data from the captured image
      extractGPSFromImage(file);
    }
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !location || !title.trim()) {
      alert('Please take a photo with GPS location, add a title, and select a category');
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

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Report Incident</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Camera Capture */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo <span className="text-red-500">*</span>
          </label>
          {image ? (
            <div className="relative">
              <img src={image} alt="Captured photo" className="w-full h-48 object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => {
                  setImage('');
                  setLocation(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={triggerCamera}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
            >
              <Camera size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Tap to capture photo</p>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            className="hidden"
            required
          />
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

        {/* Auto-detected Location */}
        {location && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (Auto-detected from photo)
            </label>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-blue-600" />
                <span className="text-sm text-blue-800">{location.name}</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!image || !location || !title.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
