"use client"

interface IndirectSelectProps {
  indirectSubTab: string
  setIndirectSubTab: (subTab: string) => void
  selectedEvent: any
  updateEvent: (event: any) => void
}

export const IndirectSelect = ({
  indirectSubTab,
  setIndirectSubTab,
  selectedEvent,
  updateEvent
}: IndirectSelectProps) => {
  const handleIndirectSubTabChange = (subTab: string) => {
    setIndirectSubTab(subTab)
    
    if (selectedEvent) {
      updateEvent({
        ...selectedEvent,
        indirectType: subTab
      })
    }
  }

  return (
    <div className="flex text-sm border-b px-4 py-2 bg-gray-50">
      {["純間接", "目的間接", "控除時間"].map((subTab) => (
        <button
          key={subTab}
          className={`py-1 px-1 whitespace-nowrap mr-2 ${
            indirectSubTab === subTab
              ? "bg-blue-100 text-blue-800 font-medium rounded"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleIndirectSubTabChange(subTab)}
        >
          {subTab}
        </button>
      ))}
    </div>
  )
} 