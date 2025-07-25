"use client"

interface ProjectSubTabsProps {
  selectedProjectSubTab: string
  setSelectedProjectSubTab: (subTab: string) => void
  selectedEvent: any
  updateEvent: (event: any) => void
  updateActivityCodePrefix: (tab: string, subTab?: string) => void
}

export const ProjectSubTabs = ({
  selectedProjectSubTab,
  setSelectedProjectSubTab,
  selectedEvent,
  updateEvent,
  updateActivityCodePrefix
}: ProjectSubTabsProps) => {
  const handleProjectSubTabChange = (subTab: string) => {
    setSelectedProjectSubTab(subTab)
    updateActivityCodePrefix("project", subTab)
  }

  return (
    <div className="flex text-sm border-b px-4 py-2 bg-gray-50">
      {["計画", "設計", "会議", "購入品", "その他"].map((subTab) => (
        <button
          key={subTab}
          className={`py-1 px-1 whitespace-nowrap mr-2 ${
            selectedProjectSubTab === subTab
              ? "bg-blue-100 text-blue-800 font-medium rounded"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleProjectSubTabChange(subTab)}
        >
          {subTab}
        </button>
      ))}
    </div>
  )
} 