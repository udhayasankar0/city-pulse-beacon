import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { MapPin, Calendar, User, ExternalLink, ArrowLeft, Share2 } from 'lucide-react';
import { useReports } from '@/context/ReportsContext';
import { Report } from '@/data/dummyReports';
import StatusBadge from '@/components/StatusBadge';

interface ReportDetailProps {
  reportId: string;
  onClose: () => void;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ reportId, onClose }) => {
  const { reports, updateReportStatus } = useReports();
  const report = reports.find(r => r.id === reportId);

  if (!report) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Report not found</p>
        <button onClick={onClose} className="btn-primary mt-4">
          Go Back
        </button>
      </div>
    );
  }

  const handleStatusChange = (newStatus: Report['status']) => {
    updateReportStatus(reportId, newStatus);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: report.title,
          text: `Check out this civic report: ${report.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // In a real app, show a toast here
      alert('Link copied to clipboard!');
    }
  };

  const getStatusTimeline = (status: Report['status']) => {
    const baseDate = new Date(report.reportedAt);
    
    const timeline = [
      {
        status: 'Reported',
        date: baseDate,
        active: true,
        description: 'Report received and logged'
      }
    ];

    if (status === 'In Progress' || status === 'Resolved') {
      timeline.push({
        status: 'In Progress',
        date: new Date(baseDate.getTime() + 24 * 60 * 60 * 1000), // +1 day
        active: true,
        description: 'Work assigned and in progress'
      });
    }

    if (status === 'Resolved') {
      timeline.push({
        status: 'Resolved',
        date: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000), // +3 days
        active: true,
        description: 'Issue successfully resolved'
      });
    }

    return timeline;
  };

  const timeline = getStatusTimeline(report.status);

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card-bg border-b border-soft-border p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors focus-ring"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-foreground">Report Details</h1>
            <p className="text-sm text-muted-foreground">#{report.id}</p>
          </div>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-muted rounded-full transition-colors focus-ring"
            aria-label="Share report"
          >
            <Share2 size={20} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Main Image */}
        <div className="relative">
          <img
            src={report.image}
            alt={report.title}
            className="w-full h-64 object-cover rounded-2xl"
          />
          <div className="absolute top-4 right-4">
            <StatusBadge status={report.status} size="md" />
          </div>
        </div>

        {/* Report Info */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">{report.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{report.description}</p>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              <span className="text-muted-foreground">
                {report.location[0]}, {report.location[1]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              <span className="text-muted-foreground">
                {formatDistanceToNow(new Date(report.reportedAt), { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-primary" />
              <span className="text-muted-foreground">
                Via {report.source === 'app' ? 'Mobile App' : 'Social Media'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-primary rounded-full"></span>
              <span className="text-muted-foreground">{report.type}</span>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-card-bg rounded-2xl p-4 border border-soft-border">
          <h3 className="font-semibold text-foreground mb-4">Progress Timeline</h3>
          
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <div key={item.status} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.active ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {item.status === 'Reported' && '1'}
                    {item.status === 'In Progress' && '2'}
                    {item.status === 'Resolved' && '✓'}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className={`w-0.5 h-8 mt-2 ${
                      item.active ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${
                      item.active ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {item.status}
                    </span>
                    {item.active && (
                      <span className="text-xs text-muted-foreground">
                        {format(item.date, 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Actions (Demo only) */}
        <div className="bg-muted/30 rounded-2xl p-4">
          <h3 className="font-semibold text-foreground mb-3">Update Status (Demo)</h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusChange('Reported')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                report.status === 'Reported'
                  ? 'bg-accent-600 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-accent-600/10'
              }`}
            >
              Reported
            </button>
            <button
              onClick={() => handleStatusChange('In Progress')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                report.status === 'In Progress'
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => handleStatusChange('Resolved')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                report.status === 'Resolved'
                  ? 'bg-success-500 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-success-500/10'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>

        {/* Location Map Preview (Placeholder) */}
        <div className="bg-card-bg rounded-2xl p-4 border border-soft-border">
          <h3 className="font-semibold text-foreground mb-3">Location</h3>
          <div className="bg-muted rounded-xl h-32 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin size={24} className="mx-auto mb-2" />
              <p className="text-sm">Map preview would appear here</p>
              <p className="text-xs">Lat: {report.geo.lat}, Lng: {report.geo.lng}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;