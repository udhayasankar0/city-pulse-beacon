import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, ExternalLink } from 'lucide-react';
import { Report } from '@/data/dummyReports';
import StatusBadge from './StatusBadge';

interface ReportCardProps {
  report: Report;
  onClick?: (report: Report) => void;
  variant?: 'default' | 'compact';
}

const ReportCard: React.FC<ReportCardProps> = ({ 
  report, 
  onClick, 
  variant = 'default' 
}) => {
  const handleClick = () => {
    onClick?.(report);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className="w-full text-left bg-card-bg rounded-xl p-3 card-hover border border-soft-border focus-ring"
      >
        <div className="flex items-start gap-3">
          <img
            src={report.image}
            alt={`Image of ${report.title}`}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground text-sm leading-tight mb-1">
              {truncateText(report.title, 40)}
            </h3>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={report.status} size="sm" />
              <span className="text-xs text-muted-foreground">
                {report.type}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin size={10} />
              <span>{report.location[0]}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(report.reportedAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="w-full text-left bg-card-bg rounded-2xl p-3 sm:p-4 card-hover border border-soft-border group focus-ring"
    >
      <div className="flex gap-3 sm:gap-4">
        {/* Image */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={report.image}
            alt={`Image of ${report.title}`}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground leading-tight pr-2 group-hover:text-primary transition-colors text-sm sm:text-base">
              {truncateText(report.title, 50)}
            </h3>
            <ExternalLink size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
          
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
            {truncateText(report.description, 80)}
          </p>
          
          {/* Meta row - Stack on mobile */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 text-xs">
            <div className="flex items-center gap-2">
              <StatusBadge status={report.status} />
              <span className="px-2 py-1 bg-muted rounded-md text-muted-foreground font-medium">
                {report.type}
              </span>
            </div>
            
            <div className="flex items-center justify-between sm:flex-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin size={12} />
                <span>{report.location[0]}</span>
              </div>
              
              <span className="text-muted-foreground">
                {formatDistanceToNow(new Date(report.reportedAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ReportCard;