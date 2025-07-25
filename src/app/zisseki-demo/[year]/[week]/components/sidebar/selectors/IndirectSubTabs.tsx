"use client"

import { IndirectSelect } from "./IndirectSelect"

interface IndirectSubTabsProps {
  indirectSubTab: string
  setIndirectSubTab: (subTab: string) => void
  selectedIndirectDetailTab: string
  setSelectedIndirectDetailTab: (tab: string) => void
  selectedEvent: any
  updateEvent: (event: any) => void
}

export const IndirectSubTabs = ({
  indirectSubTab,
  setIndirectSubTab,
  selectedIndirectDetailTab,
  setSelectedIndirectDetailTab,
  selectedEvent,
  updateEvent
}: IndirectSubTabsProps) => {
  return (
    <IndirectSelect
      indirectSubTab={indirectSubTab}
      setIndirectSubTab={setIndirectSubTab}
      selectedEvent={selectedEvent}
      updateEvent={updateEvent}
    />
  )
} 