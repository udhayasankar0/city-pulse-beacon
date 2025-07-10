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
  const [type, setType] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  
  const categories = ['Traffic', 'Weather', 'Infrastructure', 'Safety'];
  const filteredCategories = categories.filter(category => 
    category.toLowerCase().startsWith(type.toLowerCase())
  );
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
    if (!image || !title.trim() || !type.trim()) {
      alert('Please take a photo, add a title, and select a category');
      return;
    }

    const newIncident: Omit<Incident, 'id' | 'timestamp'> = {
      title: title.trim(),
      description: description.trim() || title.trim(),
      shortSummary: description.trim() ? description.trim().slice(0, 100) + '...' : title.trim(),
      location,
      image,
      type: type.trim() as Incident['type'],
    };

    onSubmit(newIncident);
    setImage('');
    setDescription('');
    setTitle('');
    setType('');
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              placeholder="Select or type category..."
              className="w-full p-3 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-colors"
              required
            />
            {showDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setType(category);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-popover-foreground hover:bg-accent hover:text-accent-foreground first:rounded-t-lg last:rounded-b-lg transition-colors"
                    >
                      {category}
                    </button>
                  ))
                ) : type.trim() ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-popover-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                  >
                    Create custom tag: "{type}"
                  </button>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setType(category);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-popover-foreground hover:bg-accent hover:text-accent-foreground first:rounded-t-lg last:rounded-b-lg transition-colors"
                    >
                      {category}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
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
          disabled={!image || !title.trim() || !type.trim()}
          className="w-full py-3 px-6 rounded-lg font-medium transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed enabled:bg-primary enabled:text-primary-foreground enabled:hover:bg-primary/90 enabled:cursor-pointer"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
