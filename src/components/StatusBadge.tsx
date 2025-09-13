import React from 'react';
import { Clock, Settings, CheckCircle } from 'lucide-react';
import { Report } from '@/data/dummyReports';

interface StatusBadgeProps {
  status: Report['status'];
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getStatusConfig = (status: Report['status']) => {
    switch (status) {
      case 'Reported':
        return {
          icon: Clock,
          className: 'status-reported',
          text: 'Reported'
        };
      case 'In Progress':
        return {
          icon: Settings,
          className: 'status-in-progress',
          text: 'In Progress'
        };
      case 'Resolved':
        return {
          icon: CheckCircle,
          className: 'status-resolved',
          text: 'Resolved'
        };
      default:
        return {
          icon: Clock,
          className: 'status-reported',
          text: status
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;
  
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-1 text-xs' 
    : 'px-3 py-1.5 text-sm';

  return (
    <span className={`
      inline-flex items-center gap-1 rounded-full font-medium
      ${config.className} ${sizeClasses}
    `}>
      <Icon size={size === 'sm' ? 12 : 14} />
      {config.text}
    </span>
  );
};

export default StatusBadge;