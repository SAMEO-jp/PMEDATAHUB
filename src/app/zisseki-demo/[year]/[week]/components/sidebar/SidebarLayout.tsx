import { Event } from '../../types'
import { SidebarHeader } from './components/SidebarHeader'
import { EmptyState } from './components/EmptyState'

interface SidebarLayoutProps {
  selectedEvent: Event | null
  selectedTab: string
  setSelectedTab: (tab: string) => void
  updateActivityCodePrefix: (tab: string, subTab?: string) => void
  children: React.ReactNode
}

export const SidebarLayout = ({
  selectedEvent,
  selectedTab,
  setSelectedTab,
  updateActivityCodePrefix,
  children,
}: SidebarLayoutProps) => {
  return (
    <div className="w-80 ml-4">
      <div className="bg-white rounded-lg shadow flex-1 overflow-y-auto">
        <SidebarHeader
          selectedEvent={selectedEvent}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          updateActivityCodePrefix={updateActivityCodePrefix}
        />

        {!selectedEvent ? (
          <EmptyState selectedTab={selectedTab} />
        ) : (
          children
        )}
      </div>
    </div>
  )
} 