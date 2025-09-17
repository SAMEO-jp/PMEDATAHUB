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
    <div className="p-3 border-b">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold">{title}</h2>
        <TabSelector 
          eventId={eventId}
          activeTab={activeTab} 
          onTabChange={onTabChange} 
        />
      </div>
    </div>
  );
};
