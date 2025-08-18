import { TabSelector } from './TabSelector';

interface SidebarHeaderProps {
  title: string;
  activeTab: 'project' | 'indirect';
  onTabChange: (tab: 'project' | 'indirect') => void;
}

export const SidebarHeader = ({ title, activeTab, onTabChange }: SidebarHeaderProps) => {
  return (
    <div className="p-3 border-b">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">{title}</h2>
        <TabSelector activeTab={activeTab} onTabChange={onTabChange} />
      </div>
    </div>
  );
};