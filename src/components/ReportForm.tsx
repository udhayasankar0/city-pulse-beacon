import React, { useState, useRef } from 'react';
import { Camera, MapPin, X, Upload, CheckCircle } from 'lucide-react';
import { useReports } from '@/context/ReportsContext';
// @ts-ignore
import EXIF from 'exif-js';

interface ReportFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ onClose, onSuccess }) => {
  const { addReport } = useReports();
  const [image, setImage] = useState<string>('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Traffic', 'Infrastructure', 'Safety', 'Garbage', 'Water Leak', 'Streetlight', 'Pothole', 'Tree Fall'];
  const filteredCategories = categories.filter(category =>
    category.toLowerCase().startsWith(type.toLowerCase())
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractGPSFromImage = (file: File) => {
    EXIF.getData(file as any, function (this: any) {
      const lat = EXIF.getTag(this, "GPSLatitude");
      const lon = EXIF.getTag(this, "GPSLongitude");
      const latRef = EXIF.getTag(this, "GPSLatitudeRef");
      const lonRef = EXIF.getTag(this, "GPSLongitudeRef");

      if (lat && lon) {
        const latitude = (lat[0] + lat[1] / 60 + lat[2] / 3600) * (latRef === 'S' ? -1 : 1);
        const longitude = (lon[0] + lon[1] / 60 + lon[2] / 3600) * (lonRef === 'W' ? -1 : 1);

        setLocation({ lat: latitude, lng: longitude });
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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !title.trim() || !type.trim()) {
      alert('Please take a photo, add a title, and select a category');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the new report
      const newReport = {
        title: title.trim(),
        description: description.trim() || title.trim(),
        type: type.trim(),
        location: ["Coimbatore", "641001"] as [string, string], // Default location
        geo: location || { lat: 11.0168, lng: 76.9558 }, // Default coordinates for Coimbatore
        image,
        status: 'Reported' as const,
        source: 'app' as const,
      };

      // Add to reports context
      addReport(newReport);

      // Reset form
      setImage('');
      setDescription('');
      setTitle('');
      setType('');
      setLocation(null);

      // Call success callbacks
      onSuccess?.();
      onClose();
      
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card-bg rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-soft-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Report New Issue</h2>
            <p className="text-sm text-muted-foreground">Help improve your community</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            type="button"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form id="report-form" onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Photo Upload Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Photo Evidence <span className="text-destructive">*</span>
                </label>
                {image ? (
                  <div className="relative group">
                    <img 
                      src={image} 
                      alt="Captured photo" 
                      className="w-full h-64 object-cover rounded-xl border border-soft-border" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setImage('');
                          setLocation(null);
                        }}
                        className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-medium hover:bg-destructive/90 transition-colors flex items-center gap-2"
                      >
                        <X size={16} />
                        Remove Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={triggerCamera}
                      className="w-full h-48 border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-colors relative overflow-hidden group bg-muted/30"
                    >
                      <div className="flex flex-col items-center justify-center h-full p-6">
                        <div className="bg-primary/10 rounded-full p-4 mb-4 group-hover:bg-primary/20 transition-colors">
                          <Camera size={32} className="text-primary" />
                        </div>
                        <p className="text-foreground font-medium mb-1">Take Photo</p>
                        <p className="text-muted-foreground text-sm">Use camera to capture incident</p>
                      </div>
                    </button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card-bg px-2 text-muted-foreground">or</span>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-4 border border-border rounded-xl hover:border-primary/50 transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <Upload size={20} />
                      Upload from Gallery
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCameraCapture}
                  className="hidden"
                  required
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Issue Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief description of the issue"
                  className="w-full p-3 border border-input bg-background rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-colors"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    placeholder="Select or type category..."
                    className="w-full p-3 border border-input bg-background rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-colors"
                    required
                  />
                  {showDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => {
                              setType(category);
                              setShowDropdown(false);
                            }}
                            className="w-full text-left px-4 py-3 text-popover-foreground hover:bg-accent hover:text-accent-foreground first:rounded-t-xl last:rounded-b-xl transition-colors"
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
                          className="w-full text-left px-4 py-3 text-popover-foreground hover:bg-accent hover:text-accent-foreground rounded-xl transition-colors"
                        >
                          Create custom: "{type}"
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
                            className="w-full text-left px-4 py-3 text-popover-foreground hover:bg-accent hover:text-accent-foreground first:rounded-t-xl last:rounded-b-xl transition-colors"
                          >
                            {category}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Detailed Description
                <span className="text-muted-foreground font-normal"> (Optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide additional details about the issue, its impact, and any relevant context..."
                rows={4}
                className="w-full p-3 border border-input bg-background rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-colors resize-none"
              />
            </div>

            {/* Location Info */}
            {location && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">Location Detected</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Footer with Submit Button */}
        <div className="border-t border-soft-border p-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-border rounded-xl font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="report-form"
              disabled={!image || !title.trim() || !type.trim() || isSubmitting}
              className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;
