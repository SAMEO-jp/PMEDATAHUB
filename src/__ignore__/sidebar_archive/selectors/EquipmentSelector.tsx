"use client"

import { useEventContext } from "@src/app/zisseki-demo/[year]/[week]/context/EventContext"

// 設備選択コンポーネントのProps（データのみ）
interface EquipmentSelectorProps {
  equipmentNumber: string                    // ← 定数：現在選択中の設備番号
  equipmentName: string                      // ← 定数：現在選択中の設備名
  equipmentOptions: { id: string, name: string }[]  // ← 定数：設備オプション一覧
  isLoadingEquipment: boolean                // ← 定数：ローディング状態
  setEquipmentNumber: (number: string) => void  // ← 関数1：設備番号を設定
  setEquipmentName: (name: string) => void     // ← 関数2：設備名を設定
}

export const EquipmentSelector = ({
  equipmentNumber,
  equipmentName,
  equipmentOptions,
  isLoadingEquipment,
  setEquipmentNumber,
  setEquipmentName
}: EquipmentSelectorProps) => {
  // Contextから取得するProps（状態 + 関数）
  const { 
    selectedEvent,        // ← 定数：選択中のイベント
    getActiveTab,        // ← 関数：現在のタブを取得
    getUIState,          // ← 関数：UI状態を取得  
    handleUpdateEvent: updateEvent    // ← 関数：イベントを更新
  } = useEventContext();
  
  const activeTab = getActiveTab();
  const activeSubTabs = getUIState().hierarchy.activeSubTabs;

  // 設備番号選択時の処理
  const handleEquipmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value
    setEquipmentNumber(selectedId)  // ← 関数1：設備番号を更新
    const found = equipmentOptions.find(opt => opt.id === selectedId)
    setEquipmentName(found ? found.name : "")  // ← 関数2：設備名を更新
    
    // 必要に応じてイベントにも反映
    if (selectedEvent) {
      if (activeSubTabs.project === "購入品") {
        updateEvent({ 
          ...selectedEvent, 
          equipmentNumber: selectedId, 
          itemName: found ? found.name : "" 
        })
      } else {
        updateEvent({ 
          ...selectedEvent, 
          equipment_id: selectedId, 
          equipment_Name: found ? found.name : "" 
        })
      }
    }
  }

  // プロジェクトタブまたは購入品タブの場合のみ表示
  if (activeTab !== "project" && activeTab !== "indirect") {
    return null
  }

  return (
    <div className="px-4 py-2 border-b">
      <label className="block text-xs font-medium text-gray-500 mb-1">設備番号</label>
      <div className="flex space-x-2">
        <select
          className="flex-1 py-1 border rounded text-sm"
          value={equipmentNumber}  // ← 定数で現在の値を表示
          onChange={handleEquipmentChange}  // ← 変更時の処理
          disabled={isLoadingEquipment}  // ← 定数でローディング状態を制御
        >
          <option value="">設備番号を選択</option>
          {equipmentOptions.map((option) => (  // ← 定数でオプション一覧を表示
            <option key={option.id} value={option.id}>
              {option.id} - {option.name}
            </option>
          ))}
        </select>
      </div>
      
      {equipmentName && (  // ← 定数で条件分岐
        <div className="mt-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">設備名</label>
          <div className="p-2 bg-gray-100 rounded border text-sm text-gray-700">
            {equipmentName}  {/* ← 定数で設備名を表示 */}
          </div>
        </div>
      )}
    </div>
  )
} 