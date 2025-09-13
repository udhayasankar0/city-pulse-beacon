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
        return <Home onReportClick={() => setShowReportForm(true)} onReportDetailClick={handleReportClick} />;
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
        <TopBar />
        
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

        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onReportClick={() => setShowReportForm(true)}
        />

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden md:block fixed top-20 left-4 bg-card-bg rounded-2xl shadow-soft border border-soft-border p-2">
          <nav className="flex flex-col gap-1">
            {[
              { id: 'home' as const, label: 'Home' },
              { id: 'map' as const, label: 'Map' },
              { id: 'recent' as const, label: 'Recent' },
              { id: 'profile' as const, label: 'Profile' }
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {showReportForm && (
          <ReportForm
            onClose={() => setShowReportForm(false)}
            onSuccess={handleReportSuccess}
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
