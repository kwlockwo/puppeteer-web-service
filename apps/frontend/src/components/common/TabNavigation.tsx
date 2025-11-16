import { FileText, Search, Image, Info, LucideIcon } from 'lucide-react';
import type { TabType } from '../../types';

interface Tab {
  id: TabType;
  label: string;
  icon: LucideIcon;
}

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onTabChange: () => void;
}

export default function TabNavigation({ activeTab, setActiveTab, onTabChange }: TabNavigationProps) {
  const tabs: Tab[] = [
    { id: 'screenshot', label: 'Screenshot', icon: Image },
    { id: 'pdf', label: 'PDF', icon: FileText },
    { id: 'scrape', label: 'Scrape Data', icon: Search },
    { id: 'info', label: 'Page Info', icon: Info }
  ];

  return (
    <div className="border-b border-gray-200 bg-gray-50">
      <div className="flex overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                onTabChange();
              }}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
