"use client"

interface TabSelectorProps {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  selectedEvent: any
  updateActivityCodePrefix: (tab: string, subTab?: string) => void
}

export const TabSelector = ({
  selectedTab,
  setSelectedTab,
  selectedEvent,
  updateActivityCodePrefix
}: TabSelectorProps) => {
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab)
    updateActivityCodePrefix(tab)
  }

  return (
    <div className="flex space-x-1">
      <button
        className={`px-3 py-1 text-xs rounded ${
          selectedTab === "project"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        onClick={() => handleTabChange("project")}
      >
        プロジェクト
      </button>
      <button
        className={`px-3 py-1 text-xs rounded ${
          selectedTab === "indirect"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        onClick={() => handleTabChange("indirect")}
      >
        間接業務
      </button>
    </div>
  )
} 