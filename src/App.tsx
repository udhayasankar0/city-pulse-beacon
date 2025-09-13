import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReportsProvider } from '@/context/ReportsContext';
import TopBar from '@/components/TopBar';
import BottomNav, { TabType } from '@/components/BottomNav';
import ReportForm from '@/components/ReportForm';
import ReportDetail from '@/pages/ReportDetail';
import Home from '@/pages/Home';
import MapPage from '@/pages/MapPage';
import Recent from '@/pages/Recent';
import Profile from '@/pages/Profile';
import { useToast } from '@/hooks/use-toast';
import { Home as HomeIcon, Map, FileText, User, Plus } from 'lucide-react';

const queryClient = new QueryClient();

const CivicRadarApp = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleReportSuccess = () => {
    toast({
      title: "Report Submitted Successfully!",
      description: "Your report has been received and will be reviewed shortly.",
    });
    setActiveTab('home');
  };

  const handleReportClick = (reportId: string) => {
    setSelectedReportId(reportId);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <Home
          onReportClick={() => setShowReportForm(true)}
          onReportDetailClick={handleReportClick}
          onViewAllReports={() => setActiveTab('recent')}
        />;
      case 'map':
        return <MapPage onReportClick={handleReportClick} />;
      case 'recent':
        return <Recent onReportClick={handleReportClick} />;
      case 'profile':
        return <Profile onReportClick={handleReportClick} />;
      default:
        return <Home onReportClick={() => setShowReportForm(true)} onReportDetailClick={handleReportClick} />;
    }
  };

  return (
    <ReportsProvider>
      <div className="flex flex-col h-screen bg-background font-inter">
        <TopBar onLogoClick={() => setActiveTab('home')} />

        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar - Hidden on mobile */}
          <aside className="hidden md:flex w-64 bg-card-bg border-r border-soft-border flex-col">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-soft-border">
              <h2 className="text-lg font-semibold text-foreground mb-2">Navigation</h2>
              <p className="text-sm text-muted-foreground">Explore your city reports</p>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {[
                  { id: 'home' as const, label: 'Dashboard', icon: HomeIcon, description: 'Overview & stats' },
                  { id: 'map' as const, label: 'Map View', icon: Map, description: 'Geographic reports' },
                  { id: 'recent' as const, label: 'All Reports', icon: FileText, description: 'Browse & filter' },
                  { id: 'profile' as const, label: 'Profile', icon: User, description: 'Your account' }
                ].map(({ id, label, icon: Icon, description }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${activeTab === id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className={activeTab === id ? 'text-primary-foreground' : 'text-muted-foreground'} />
                      <div className="flex-1">
                        <div className={`font-medium ${activeTab === id ? 'text-primary-foreground' : 'text-foreground'}`}>
                          {label}
                        </div>
                        <div className={`text-xs ${activeTab === id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                          {description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </nav>

            {/* Quick Actions */}
            <div className="p-4 border-t border-soft-border">
              <button
                onClick={() => setShowReportForm(true)}
                className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Report Issue
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-hidden">
            {selectedReportId ? (
              <ReportDetail
                reportId={selectedReportId}
                onClose={() => setSelectedReportId(null)}
              />
            ) : (
              <div
                className="h-full"
                id={`panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`tab-${activeTab}`}
              >
                {renderActiveTab()}
              </div>
            )}
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onReportClick={() => setShowReportForm(true)}
        />

        {showReportForm && (
          <ReportForm
            onClose={() => setShowReportForm(false)}
            onSuccess={() => {
              handleReportSuccess();
              setActiveTab('recent'); // Navigate to Recent tab to see the new report
            }}
          />
        )}

        <Toaster />
        <Sonner />
      </div>
    </ReportsProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CivicRadarApp />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
