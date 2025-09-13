import React, { useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCheck, X, Bell } from 'lucide-react';
import { useReports } from '@/context/ReportsContext';
import { useNavigate } from 'react-router-dom';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useReports();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleNotificationClick = (notification: any) => {
    markNotificationAsRead(notification.id);
    // Navigate to report detail - for now just close dropdown
    onClose();
  };

  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.time).getTime() - new Date(a.time).getTime()
  );

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-card-bg border border-soft-border rounded-2xl shadow-lg overflow-hidden z-50 animate-in fade-in-0 zoom-in-95"
      role="menu"
      aria-label="Notifications"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-soft-border">
        <h3 className="font-semibold text-foreground">Notifications</h3>
        <div className="flex items-center gap-2">
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              aria-label="Mark all notifications as read"
            >
              <CheckCheck size={12} />
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-full transition-colors"
            aria-label="Close notifications"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="max-h-96 overflow-y-auto">
        {sortedNotifications.length === 0 ? (
          <div className="p-6 text-center">
            <Bell size={24} className="mx-auto text-muted-foreground mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          sortedNotifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`w-full text-left p-4 hover:bg-muted transition-colors border-b border-soft-border last:border-b-0 ${
                !notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
              }`}
              role="menuitem"
              aria-controls={`report-${notification.reportId}`}
            >
              <div className="flex items-start gap-3">
                {!notification.read && (
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${
                    !notification.read ? 'text-foreground font-medium' : 'text-muted-foreground'
                  }`}>
                    {notification.text}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.time), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {sortedNotifications.length > 0 && (
        <div className="p-3 border-t border-soft-border bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            {sortedNotifications.length} notification{sortedNotifications.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;