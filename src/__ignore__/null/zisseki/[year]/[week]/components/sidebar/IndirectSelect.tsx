import React, { useState } from "react"
import { Event, IndirectSubTabType, INDIRECT_SUBTABS, IndirectSelectProps } from "../../types/sidebar"

export function IndirectSelect({
  selectedEvent,
  updateEvent,
  indirectSubTab,
  setIndirectSubTab
}: IndirectSelectProps) {
  const [selectedIndirectDetailTab, setSelectedIndirectDetailTab] = useState<string>("日報入力")
  const [purposeProjectCode, setPurposeProjectCode] = useState<string>("")

  // 活動コードのプレフィックスを更新する関数
  const updateActivityCodePrefix = (tab: IndirectSubTabType, subTab?: string) => {
    if (!selectedEvent || !updateEvent) return

    let prefix = ""
    switch (tab) {
      case "純間接":
        switch (subTab) {
          case "日報入力":
            prefix = "ID"
            break
          case "会議":
            prefix = "IM"
            break
          case "人事評価":
            prefix = "IE"
            break
          case "作業":
            prefix = "IW"
            break
          case "その他":
            prefix = "IO"
            break
        }
        break
      case "目的間接":
        switch (subTab) {
          case "作業":
            prefix = "PW"
            break
          case "会議":
            prefix = "PM"
            break
          case "その他":
            prefix = "PO"
            break
        }
        break
      case "控除時間":
        switch (subTab) {
          case "休憩／外出":
            prefix = "DB"
            break
          case "組合時間":
            prefix = "DU"
            break
          case "その他":
            prefix = "DO"
            break
        }
        break
    }

    if (prefix) {
      updateEvent({
        ...selectedEvent,
        activityCode: prefix
      })
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 間接業務のサブタブ */}
      <div className="flex border-b">
        {Object.keys(INDIRECT_SUBTABS).map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2 text-sm font-medium ${
              indirectSubTab === tab ? "bg-blue-50 text-blue-600" : "text-gray-600"
            }`}
            onClick={() => {
              setIndirectSubTab(tab)
              setSelectedIndirectDetailTab(INDIRECT_SUBTABS[tab as IndirectSubTabType][0])
              updateActivityCodePrefix(tab as IndirectSubTabType, INDIRECT_SUBTABS[tab as IndirectSubTabType][0])
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 詳細タブ */}
      <div className="flex border-b">
        {INDIRECT_SUBTABS[indirectSubTab as IndirectSubTabType].map((subTab) => (
          <button
            key={subTab}
            className={`flex-1 py-2 text-sm font-medium ${
              selectedIndirectDetailTab === subTab ? "bg-blue-50 text-blue-600" : "text-gray-600"
            }`}
            onClick={() => {
              setSelectedIndirectDetailTab(subTab)
              updateActivityCodePrefix(indirectSubTab as IndirectSubTabType, subTab)
            }}
          >
            {subTab}
          </button>
        ))}
      </div>

      {/* 目的プロジェクト選択（目的間接の場合のみ表示） */}
      {indirectSubTab === "目的間接" && (
        <div className="px-4 py-2 border-b">
          <label className="block text-xs font-medium text-gray-500 mb-1">目的プロジェクト</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={purposeProjectCode}
            onChange={(e) => {
              setPurposeProjectCode(e.target.value)
              if (selectedEvent && updateEvent) {
                updateEvent({
                  ...selectedEvent,
                  purposeProject: e.target.value
                })
              }
            }}
            placeholder="目的プロジェクトコードを入力..."
          />
        </div>
      )}
    </div>
  )
} 