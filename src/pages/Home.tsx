import React from 'react';
import { Plus, TrendingUp, MapPin } from 'lucide-react';
import { useReports } from '@/context/ReportsContext';
import ReportCard from '@/components/ReportCard';

interface HomeProps {
  onReportClick: () => void;
  onReportDetailClick?: (reportId: string) => void;
  onViewAllReports?: () => void;
}

const Home: React.FC<HomeProps> = ({ onReportClick, onReportDetailClick, onViewAllReports }) => {
  const { reports } = useReports();
  
  // Get recent reports (last 8 for better mobile view)
  const recentReports = reports.slice(0, 8);
  
  // Get user's reports (mock - in real app would filter by user ID)
  const myReports = reports.slice(0, 3);

  // Calculate stats
  const reportedCount = reports.filter(r => r.status === 'Reported').length;
  const inProgressCount = reports.filter(r => r.status === 'In Progress').length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;

  return (
    <div className="p-4 pb-20 md:pb-4 space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-brand-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Help Improve Your City</h1>
        <p className="text-primary-foreground/90 mb-4">
          Report issues and track progress in your community
        </p>
        <button
          onClick={onReportClick}
          className="bg-white text-primary px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Report New Incident
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card-bg rounded-xl p-4 text-center border border-soft-border">
          <div className="text-2xl font-bold text-accent-600">{reportedCount}</div>
          <div className="text-xs text-muted-foreground">Reported</div>
        </div>
        <div className="bg-card-bg rounded-xl p-4 text-center border border-soft-border">
          <div className="text-2xl font-bold text-primary">{inProgressCount}</div>
          <div className="text-xs text-muted-foreground">In Progress</div>
        </div>
        <div className="bg-card-bg rounded-xl p-4 text-center border border-soft-border">
          <div className="text-2xl font-bold text-success-500">{resolvedCount}</div>
          <div className="text-xs text-muted-foreground">Resolved</div>
        </div>
      </div>

      {/* Recent Incidents */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Recent Reports</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{reports.length} total</span>
            <button 
              onClick={onViewAllReports}
              className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
            >
              View All
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {recentReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={() => onReportDetailClick?.(report.id)}
              variant="compact"
            />
          ))}
        </div>
        
        {recentReports.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin size={32} className="mx-auto mb-2 opacity-50" />
            <p>No reports yet. Be the first to report an issue!</p>
          </div>
        )}
      </section>

      {/* My Reports */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">My Reports</h2>
        
        <div className="space-y-3">
          {myReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={() => onReportDetailClick?.(report.id)}
              variant="compact"
            />
          ))}
        </div>
        
        {myReports.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">You haven't submitted any reports yet.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;