import { TabSelector } from '../ui/TabSelector';
import { Tab } from '../ui/types';

interface SidebarHeaderProps {
  title: string;
  eventId: string;
  activeTab: Tab;
  onTabChange: (eventId: string, tab: Tab) => void;
}

export const SidebarHeader = ({ title, eventId, activeTab, onTabChange }: SidebarHeaderProps) => {
  return (
    <div className="px-3 pt-3 pb-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold">{title}</h2>
        <TabSelector 
          eventId={eventId}
          activeTab={activeTab} 
          onTabChange={onTabChange} 
        />
      </div>
    </div>
  );
};
