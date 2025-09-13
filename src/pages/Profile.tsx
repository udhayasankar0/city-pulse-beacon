import React from 'react';
import { User, MapPin, Clock, CheckCircle, Settings, Download } from 'lucide-react';
import { useReports } from '@/context/ReportsContext';
import ReportCard from '@/components/ReportCard';

interface ProfileProps {
  onReportClick?: (reportId: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ onReportClick }) => {
  const { reports } = useReports();

  // Mock user data - in real app this would come from auth context
  const userData = {
    name: 'John Citizen',
    email: 'john.citizen@email.com',
    joinedDate: '2024-01-15',
    avatar: '/placeholder.svg'
  };

  // Calculate user stats
  const userReports = reports; // In real app, filter by user ID
  const reportedCount = userReports.filter(r => r.status === 'Reported').length;
  const inProgressCount = userReports.filter(r => r.status === 'In Progress').length;
  const resolvedCount = userReports.filter(r => r.status === 'Resolved').length;

  // Get recent user reports
  const recentUserReports = userReports.slice(0, 5);

  const handleExportData = () => {
    const dataStr = JSON.stringify({ reports: userReports }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'civic-radar-reports.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="p-4 pb-20 md:pb-4 space-y-6">
      {/* Profile Header */}
      <div className="bg-card-bg rounded-2xl p-6 border border-soft-border">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{userData.name}</h1>
            <p className="text-muted-foreground text-sm">{userData.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Member since {new Date(userData.joinedDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleExportData}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-muted text-muted-foreground rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-sm"
          >
            <Download size={16} />
            Export Data
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-muted text-muted-foreground rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-sm">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">My Statistics</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card-bg rounded-xl p-4 text-center border border-soft-border">
            <div className="flex items-center justify-center mb-2">
              <Clock size={16} className="text-accent-600" />
            </div>
            <div className="text-xl font-bold text-accent-600">{reportedCount}</div>
            <div className="text-xs text-muted-foreground">Reported</div>
          </div>
          
          <div className="bg-card-bg rounded-xl p-4 text-center border border-soft-border">
            <div className="flex items-center justify-center mb-2">
              <Settings size={16} className="text-primary" />
            </div>
            <div className="text-xl font-bold text-primary">{inProgressCount}</div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </div>
          
          <div className="bg-card-bg rounded-xl p-4 text-center border border-soft-border">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle size={16} className="text-success-500" />
            </div>
            <div className="text-xl font-bold text-success-500">{resolvedCount}</div>
            <div className="text-xs text-muted-foreground">Resolved</div>
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="bg-gradient-to-br from-primary to-brand-600 rounded-2xl p-6 text-white">
        <h3 className="font-bold mb-2">Your Community Impact</h3>
        <p className="text-primary-foreground/90 text-sm mb-3">
          You've helped improve your city with {userReports.length} reports. Thank you for being an active citizen!
        </p>
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={16} />
          <span>Contributing to Coimbatore</span>
        </div>
      </div>

      {/* Recent Reports */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">My Recent Reports</h2>
          <span className="text-sm text-muted-foreground">
            {recentUserReports.length} of {userReports.length}
          </span>
        </div>
        
        <div className="space-y-3">
          {recentUserReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={() => onReportClick?.(report.id)}
              variant="compact"
            />
          ))}
        </div>
        
        {recentUserReports.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <User size={32} className="mx-auto mb-2 opacity-50" />
            <p>No reports yet. Start by reporting your first incident!</p>
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="bg-card-bg rounded-2xl p-4 border border-soft-border">
        <h3 className="font-semibold text-foreground mb-3">Preferences</h3>
        
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-foreground">Push Notifications</span>
            <input 
              type="checkbox" 
              defaultChecked 
              className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-ring"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-sm text-foreground">Anonymous Reports</span>
            <input 
              type="checkbox" 
              className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-ring"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-sm text-foreground">Email Updates</span>
            <input 
              type="checkbox" 
              defaultChecked 
              className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-ring"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Profile;