import React from 'react';
import { Home, Map, List, User, Plus } from 'lucide-react';

export type TabType = 'home' | 'map' | 'recent' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onReportClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onReportClick }) => {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'map' as const, label: 'Map', icon: Map },
    { id: 'recent' as const, label: 'Recent', icon: List },
    { id: 'profile' as const, label: 'Profile', icon: User }
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-soft-border z-40 md:hidden"
      aria-label="Primary navigation"
      role="tablist"
    >
      <div className="flex items-center h-16">
        {tabs.slice(0, 2).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex-1 flex flex-col items-center justify-center py-2 transition-colors ${
              activeTab === id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`panel-${id}`}
          >
            <Icon size={20} className="mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
        
        {/* Center FAB for Report */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={onReportClick}
            className="btn-fab relative"
            aria-label="Report new incident"
          >
            <Plus size={24} />
          </button>
        </div>
        
        {tabs.slice(2).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex-1 flex flex-col items-center justify-center py-2 transition-colors ${
              activeTab === id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`panel-${id}`}
          >
            <Icon size={20} className="mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;