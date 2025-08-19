import { TabSelector } from '../ui/TabSelector';

interface SidebarHeaderProps {
  title: string;
  eventId: string;
  activeTab: 'project' | 'indirect';
  onTabChange: (eventId: string, tab: 'project' | 'indirect') => void;
}

export const SidebarHeader = ({ title, eventId, activeTab, onTabChange }: SidebarHeaderProps) => {
  return (
    <div className="p-3 border-b">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">{title}</h2>
        <TabSelector 
          eventId={eventId}
          activeTab={activeTab} 
          onTabChange={onTabChange} 
        />
      </div>
    </div>
  );
};
