"use client"

interface EquipmentSelectorProps {
  selectedTab: string
  selectedProjectSubTab: string
  selectedProjectCode: string
  equipmentNumber: string
  equipmentName: string
  equipmentOptions: { id: string, name: string }[]
  isLoadingEquipment: boolean
  equipmentNumbers: string[]
  selectedEvent: any
  updateEvent: (event: any) => void
  setEquipmentNumber: (number: string) => void
  setEquipmentName: (name: string) => void
}

export const EquipmentSelector = ({
  selectedTab,
  selectedProjectSubTab,
  selectedProjectCode,
  equipmentNumber,
  equipmentName,
  equipmentOptions,
  isLoadingEquipment,
  equipmentNumbers,
  selectedEvent,
  updateEvent,
  setEquipmentNumber,
  setEquipmentName
}: EquipmentSelectorProps) => {
  // 設備番号選択時に設備名もセット
  const handleEquipmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value
    setEquipmentNumber(selectedId)
    const found = equipmentOptions.find(opt => opt.id === selectedId)
    setEquipmentName(found ? found.name : "")
    // 必要に応じてイベントにも反映
    if (selectedEvent) {
      if (selectedProjectSubTab === "購入品") {
        updateEvent({ ...selectedEvent, equipmentNumber: selectedId, itemName: found ? found.name : "" })
      } else {
        updateEvent({ ...selectedEvent, equipment_id: selectedId, equipment_Name: found ? found.name : "" })
      }
    }
  }

  // プロジェクトタブまたは購入品タブの場合のみ表示
  if (selectedTab !== "project" && selectedTab !== "indirect") {
    return null
  }

  return (
    <div className="px-4 py-2 border-b">
      <label className="block text-xs font-medium text-gray-500 mb-1">設備番号</label>
      <div className="flex space-x-2">
        <select
          className="flex-1 py-1 border rounded text-sm"
          value={equipmentNumber}
          onChange={handleEquipmentChange}
          disabled={isLoadingEquipment || !selectedProjectCode}
        >
          <option value="">設備番号を選択</option>
          {equipmentOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.id} - {option.name}
            </option>
          ))}
        </select>
      </div>
      
      {equipmentName && (
        <div className="mt-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">設備名</label>
          <div className="p-2 bg-gray-100 rounded border text-sm text-gray-700">
            {equipmentName}
          </div>
        </div>
      )}
    </div>
  )
} 