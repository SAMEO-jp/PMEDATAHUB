import { useState } from 'react';

export const useDemoUI = () => {
  const [selectedTab, setSelectedTab] = useState<string>("project");
  const [selectedProjectSubTab, setSelectedProjectSubTab] = useState<string>("計画");
  const [indirectSubTab, setIndirectSubTab] = useState<string>("純間接");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  return {
    selectedTab,
    setSelectedTab,
    selectedProjectSubTab,
    setSelectedProjectSubTab,
    indirectSubTab,
    setIndirectSubTab,
    selectedEvent,
    setSelectedEvent,
    hasChanges,
    setHasChanges
  };
}; 