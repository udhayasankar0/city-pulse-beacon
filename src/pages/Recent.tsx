import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { useReports } from '@/context/ReportsContext';
import ReportCard from '@/components/ReportCard';

interface RecentProps {
  onReportClick?: (reportId: string) => void;
}

const Recent: React.FC<RecentProps> = ({ onReportClick }) => {
  const { reports } = useReports();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filters = [
    'All',
    'Pothole',
    'Streetlight', 
    'Garbage',
    'Tree Fall',
    'Water Leak',
    'Traffic',
    'Infrastructure',
    'Safety',
    'Resolved',
    'In Progress',
    'Reported'
  ];

  const filteredReports = useMemo(() => {
    let filtered = [...reports];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        report.type.toLowerCase().includes(query) ||
        report.location[0].toLowerCase().includes(query)
      );
    }

    // Apply category/status filter
    if (activeFilter !== 'All') {
      if (['Resolved', 'In Progress', 'Reported'].includes(activeFilter)) {
        filtered = filtered.filter(report => report.status === activeFilter);
      } else {
        filtered = filtered.filter(report => 
          report.type.toLowerCase().includes(activeFilter.toLowerCase())
        );
      }
    }

    // Sort by most recent first
    return filtered.sort((a, b) => 
      new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
    );
  }, [reports, searchQuery, activeFilter]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 space-y-4 border-b border-soft-border bg-card-bg">
        {/* Search */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports..."
            className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-colors"
          />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter size={16} className="text-muted-foreground flex-shrink-0" />
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
          </p>
          {(searchQuery || activeFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('All');
              }}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4">
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={() => onReportClick?.(report.id)}
            />
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            {searchQuery || activeFilter !== 'All' ? (
              <div>
                <Search size={32} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                <p className="text-muted-foreground mb-2">No reports match your search</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <div>
                <Filter size={32} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                <p className="text-muted-foreground">No reports found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recent;