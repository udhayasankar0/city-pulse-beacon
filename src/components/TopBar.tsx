import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useReports } from '@/context/ReportsContext';
import NotificationDropdown from './NotificationDropdown';

interface TopBarProps {
  onLogoClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onLogoClick }) => {
  const { getUnreadNotificationsCount } = useReports();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = getUnreadNotificationsCount();

  return (
    <header className="bg-card-bg border-b border-soft-border px-4 py-4 relative z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left side - Logo and App title */}
        <button 
          onClick={onLogoClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-1"
        >
          {/* Civic Radar Logo */}
          <div className="relative w-10 h-10 md:w-12 md:h-12">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Outer circle with gradient */}
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="50%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
              
              {/* Main circle */}
              <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" opacity="0.9" />
              
              {/* Inner radar circles */}
              <circle cx="50" cy="50" r="35" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
              <circle cx="50" cy="50" r="25" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="white" strokeWidth="2" opacity="0.4" />
              
              {/* Center location pin */}
              <g transform="translate(50, 40)">
                <path d="M0 0 L-6 12 L0 8 L6 12 Z" fill="#f97316" />
                <circle cx="0" cy="0" r="4" fill="#f97316" />
                <circle cx="0" cy="0" r="2" fill="white" />
              </g>
              
              {/* Radar sweep line */}
              <line x1="50" y1="50" x2="50" y2="15" stroke="#f97316" strokeWidth="2" opacity="0.8" />
            </svg>
          </div>
          
          <div className="text-left">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Civic Radar</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Stay informed about your city</p>
          </div>
        </button>
        
        {/* Right side - Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-muted transition-colors focus-ring"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            aria-haspopup="true"
            aria-expanded={showNotifications}
          >
            <Bell size={20} className="text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <NotificationDropdown 
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;