"use client"

import { TabSelector } from "../selectors/TabSelector"

interface SidebarHeaderProps {
  selectedEvent: any
  selectedTab: string
  setSelectedTab: (tab: string) => void
  updateActivityCodePrefix: (tab: string, subTab?: string) => void
}

export const SidebarHeader = ({
  selectedEvent,
  selectedTab,
  setSelectedTab,
  updateActivityCodePrefix
}: SidebarHeaderProps) => {
  return (
    <div className="p-3 flex justify-between items-center border-b">
      <h2 className="text-lg font-bold">業務詳細</h2>
      {selectedEvent && (
        <TabSelector
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          selectedEvent={selectedEvent}
          updateActivityCodePrefix={updateActivityCodePrefix}
        />
      )}
    </div>
  )
} 