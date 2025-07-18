"use client"

import React, { useState, useEffect } from "react"
import { ProjectSelect } from "./ProjectSelect"
import { 
  SUBTABS, 
  TabType, 
  SubTabType,
  EquipmentData, 
  PurchaseData, 
  WeekSidebarProps 
} from "../../types/sidebar"


export default function WeekSidebar({
  selectedEvent,
  setSelectedEvent,
  hasChanges,
  setHasChanges,
  selectedTab = "その他" as TabType,
  setSelectedTab,
  selectedProjectSubTab = SUBTABS["その他"][0] as SubTabType,
  setSelectedProjectSubTab,
  projects,
  updateEvent,
  onDeleteEvent,
  onSaveEvent,
}: WeekSidebarProps) {
  // 状態管理に関連する変数
  const [selectedProjectCode, setSelectedProjectCode] = useState<string>("")
  const [equipmentOptions, setEquipmentOptions] = useState<{ id: string, name: string }[]>([])
  const [equipmentNumber, setEquipmentNumber] = useState<string>("")
  const [purchaseItems, setPurchaseItems] = useState<PurchaseData[]>([])
  const [isLoadingEquipment, setIsLoadingEquipment] = useState<boolean>(false)
  const [isLoadingPurchaseItems, setIsLoadingPurchaseItems] = useState<boolean>(false)

  // コンポーネントがマウントされたときに、選択されたイベントからプロジェクトと製番を設定
  useEffect(() => {
    if (selectedEvent) {
      // プロジェクトが選択されている場合
      if (selectedEvent.projectNumber) {
        setSelectedProjectCode(selectedEvent.projectNumber)
      }

      // 設備番号が選択されている場合
      if (selectedEvent.equipmenNumber) {
        setEquipmentNumber(selectedEvent.equipmenNumber)
      }
    }
  }, [selectedEvent])

  // プロジェクトが変更されたときに設備番号を取得
  useEffect(() => {
    if (selectedProjectCode) {
      fetchEquipmentNumbers()
    } else {
      setEquipmentOptions([])
    }
  }, [selectedProjectCode])

  // 設備番号が変更されたときに購入品を取得
  useEffect(() => {
    if (equipmentNumber) {
      fetchPurchaseItems()
    } else {
      setPurchaseItems([])
    }
  }, [equipmentNumber])

  // 設備番号を取得する関数
  const fetchEquipmentNumbers = async () => {
    setIsLoadingEquipment(true)
    try {
      // ローカルストレージから設備番号を取得
      const equipmentData = JSON.parse(localStorage.getItem('equipment_data') || '[]') as EquipmentData[]
      const filteredEquipment = equipmentData.filter(e => e.projectCode === selectedProjectCode)
      
      setEquipmentOptions(filteredEquipment.map(e => ({
        id: e.equipmentNumber,
        name: e.equipmentName
      })))
    } catch (error) {
      console.error('設備番号の取得に失敗しました:', error)
    } finally {
      setIsLoadingEquipment(false)
    }
  }

  // 購入品を取得する関数
  const fetchPurchaseItems = async () => {
    setIsLoadingPurchaseItems(true)
    try {
      // ローカルストレージから購入品を取得
      const purchaseData = JSON.parse(localStorage.getItem('purchase_data') || '[]') as PurchaseData[]
      const filteredItems = purchaseData.filter(item => item.equipmentNumber === equipmentNumber)
      
      setPurchaseItems(filteredItems)
    } catch (error) {
      console.error('購入品の取得に失敗しました:', error)
    } finally {
      setIsLoadingPurchaseItems(false)
    }
  }

  // 購入品の選択ハンドラ
  const handlePurchaseItemSelect = (purchaseId: string) => {
    if (selectedEvent && updateEvent) {
      updateEvent({
        ...selectedEvent,
        purchase_id: purchaseId
      })
      setHasChanges(true)
    }
  }

  // 活動コードのプレフィックスを更新する関数
  const updateActivityCodePrefix = (tab: TabType, subTab?: string) => {
    if (!selectedEvent || !updateEvent) return

    let prefix = ""
    switch (tab) {
      case "その他":
        switch (subTab) {
          case "出張":
            prefix = "D"
            break
          case "〇対応":
            prefix = "C"
            break
          case "プロ管理":
            prefix = "P"
            break
          case "資料":
            prefix = "M"
            break
          case "その他":
            prefix = "O"
            break
        }
        break
      case "計画":
        switch (subTab) {
          case "計画図":
            prefix = "PP"
            break
          case "検討書":
            prefix = "PS"
            break
          case "見積り":
            prefix = "PE"
            break
        }
        break
      case "設計":
        switch (subTab) {
          case "計画図":
            prefix = "DP"
            break
          case "詳細図":
            prefix = "DD"
            break
          case "組立図":
            prefix = "DA"
            break
          case "改正図":
            prefix = "DR"
            break
        }
        break
      case "会議":
        switch (subTab) {
          case "内部定例":
            prefix = "MI"
            break
          case "外部定例":
            prefix = "ME"
            break
          case "プロ進行":
            prefix = "MP"
            break
          case "その他":
            prefix = "MO"
            break
        }
        break
    }

    if (prefix) {
      updateEvent({
        ...selectedEvent,
        activityCode: prefix
      })
      setHasChanges(true)
    }
  }

  // イベントの削除ハンドラ
  const handleDeleteEvent = () => {
    if (selectedEvent && onDeleteEvent) {
      onDeleteEvent(selectedEvent)
      setSelectedEvent(null)
      setHasChanges(true)
    }
  }

  // イベントの保存ハンドラ
  const handleSaveEvent = () => {
    if (selectedEvent) {
      onSaveEvent(new Date(selectedEvent.start))
      setHasChanges(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* タブ切り替え */}
      <div className="flex border-b">
        {Object.keys(SUBTABS).map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2 text-sm font-medium ${
              selectedTab === tab ? "bg-blue-50 text-blue-600" : "text-gray-600"
            }`}
            onClick={() => {
              const newTab = tab as TabType;
              setSelectedTab(newTab);
              const firstSubTab = SUBTABS[newTab][0] as SubTabType;
              setSelectedProjectSubTab(firstSubTab);
              updateActivityCodePrefix(newTab, firstSubTab);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* サブタブ */}
      <div className="flex border-b">
        {selectedTab && SUBTABS[selectedTab] && SUBTABS[selectedTab].map((subTab) => (
          <button
            key={subTab}
            className={`flex-1 py-2 text-sm font-medium ${
              selectedProjectSubTab === subTab ? "bg-blue-50 text-blue-600" : "text-gray-600"
            }`}
            onClick={() => {
              setSelectedProjectSubTab(subTab as SubTabType);
              updateActivityCodePrefix(selectedTab, subTab);
            }}
          >
            {subTab}
          </button>
        ))}
      </div>

      {/* プロジェクト選択 */}
      <ProjectSelect
        projects={projects}
        selectedProjectCode={selectedProjectCode}
        onChange={setSelectedProjectCode}
        label="プロジェクト"
        selectedEvent={selectedEvent}
        updateEvent={updateEvent || (() => {})}
        isProjectTab={selectedTab === "プロジェクト" as TabType}
      />

      {/* 設備番号選択 */}
      <div className="px-4 py-2 border-b">
        <label className="block text-xs font-medium text-gray-500 mb-1">設備番号</label>
        <select
          className="w-full p-2 border rounded"
          value={equipmentNumber}
          onChange={(e) => {
            setEquipmentNumber(e.target.value)
            if (selectedEvent && updateEvent) {
              updateEvent({
                ...selectedEvent,
                equipmentNumber: e.target.value
              })
              setHasChanges(true)
            }
          }}
          disabled={isLoadingEquipment}
        >
          <option value="">選択してください</option>
          {equipmentOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      {/* 購入品選択 */}
      <div className="px-4 py-2 border-b">
        <label className="block text-xs font-medium text-gray-500 mb-1">購入品</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedEvent?.purchase_id || ""}
          onChange={(e) => {
            handlePurchaseItemSelect(e.target.value)
          }}
          disabled={isLoadingPurchaseItems}
        >
          <option value="">選択してください</option>
          {purchaseItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* アクションボタン */}
      <div className="flex justify-end gap-2 p-4 border-t mt-auto">
        {selectedEvent && onDeleteEvent && (
          <button
            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
            onClick={handleDeleteEvent}
          >
            削除
          </button>
        )}
        <button
          className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
          onClick={handleSaveEvent}
          disabled={!hasChanges}
        >
          保存
        </button>
      </div>
    </div>
  )
}
