import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useReports } from '@/context/ReportsContext';
import NotificationDropdown from './NotificationDropdown';

const TopBar: React.FC = () => {
  const { getUnreadNotificationsCount } = useReports();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = getUnreadNotificationsCount();

  return (
    <header className="bg-card-bg border-b border-soft-border px-4 py-4 relative z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left side - App title */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Civic Radar</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Stay informed about your city</p>
        </div>
        
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