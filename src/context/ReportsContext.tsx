import React, { createContext, useContext, useState, useEffect } from 'react';
import { Report, Notification, dummyReports, dummyNotifications } from '@/data/dummyReports';

interface ReportsContextType {
  reports: Report[];
  notifications: Notification[];
  addReport: (report: Omit<Report, 'id' | 'reportedAt'>) => void;
  updateReportStatus: (id: string, status: Report['status']) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  getUnreadNotificationsCount: () => number;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>(dummyReports);
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);

  // Load data from localStorage on mount
  useEffect(() => {
    const dataVersion = localStorage.getItem('civic-radar-data-version');
    const currentVersion = '2.0'; // Updated version to force refresh
    
    // If version doesn't match, clear old data and use fresh dummy data
    if (dataVersion !== currentVersion) {
      localStorage.removeItem('civic-radar-reports');
      localStorage.removeItem('civic-radar-notifications');
      localStorage.setItem('civic-radar-data-version', currentVersion);
      setReports(dummyReports);
      setNotifications(dummyNotifications);
      return;
    }
    
    const savedReports = localStorage.getItem('civic-radar-reports');
    const savedNotifications = localStorage.getItem('civic-radar-notifications');
    
    if (savedReports) {
      const parsedReports = JSON.parse(savedReports);
      // Ensure we have at least the dummy reports
      if (parsedReports.length < dummyReports.length) {
        setReports(dummyReports);
      } else {
        setReports(parsedReports);
      }
    } else {
      setReports(dummyReports);
    }
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else {
      setNotifications(dummyNotifications);
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('civic-radar-reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('civic-radar-notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addReport = (reportData: Omit<Report, 'id' | 'reportedAt'>) => {
    const newReport: Report = {
      ...reportData,
      id: `r${Date.now()}`,
      reportedAt: new Date().toISOString(),
    };

    setReports(prev => [newReport, ...prev]);

    // Add a notification for the new report
    const newNotification: Notification = {
      id: `n${Date.now()}`,
      text: `Your report '${newReport.title}' has been received and assigned tracking number #CR${String(Date.now()).slice(-3)}.`,
      time: new Date().toISOString(),
      reportId: newReport.id,
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const updateReportStatus = (id: string, status: Report['status']) => {
    setReports(prev =>
      prev.map(report =>
        report.id === id ? { ...report, status } : report
      )
    );

    // Add a status update notification
    const report = reports.find(r => r.id === id);
    if (report) {
      const statusMessages = {
        'Reported': 'Your report has been received and is under review.',
        'In Progress': 'Work has begun on your report and is currently in progress.',
        'Resolved': 'Great news! Your report has been successfully resolved. Thank you for helping improve our city.'
      };

      const newNotification: Notification = {
        id: `n${Date.now()}`,
        text: `${statusMessages[status]} Report: '${report.title}'`,
        time: new Date().toISOString(),
        reportId: id,
        read: false,
      };

      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getUnreadNotificationsCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  return (
    <ReportsContext.Provider
      value={{
        reports,
        notifications,
        addReport,
        updateReportStatus,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        getUnreadNotificationsCount,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};