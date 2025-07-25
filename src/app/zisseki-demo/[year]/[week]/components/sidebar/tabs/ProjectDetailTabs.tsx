"use client"

import { SUBTABS } from "../../../constants"
import { Event } from "../../../types"

interface ProjectDetailTabsProps {
  selectedTab: string
  selectedProjectSubTab: string
  selectedOtherSubTab: string
  setSelectedOtherSubTab: (tab: string) => void
  selectedEvent: Event | null
  updateEvent: (event: Event) => void
}

export const ProjectDetailTabs = ({
  selectedTab,
  selectedProjectSubTab,
  selectedOtherSubTab,
  setSelectedOtherSubTab,
  selectedEvent,
  updateEvent
}: ProjectDetailTabsProps) => {
  // 第2レベルのサブタブ（選択されたタブに応じて表示）
  if (selectedTab === "project" && selectedProjectSubTab === "その他") {
    return (
      <div className="flex text-sm border-b px-4 py-2 bg-gray-50">
        {SUBTABS.その他.map((subTab: string) => (
          <button
            key={subTab}
            className={`py-1 px-1 whitespace-nowrap mr-2 ${
              selectedOtherSubTab === subTab
                ? "bg-blue-100 text-blue-800 font-medium rounded"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setSelectedOtherSubTab(subTab)}
          >
            {subTab}
          </button>
        ))}
      </div>
    )
  }

  // 計画、設計、会議タブのサブタブ
  if (selectedTab === "project" && 
    (selectedProjectSubTab === "計画" || selectedProjectSubTab === "設計" || selectedProjectSubTab === "会議") && 
    SUBTABS[selectedProjectSubTab as keyof typeof SUBTABS]?.length > 0) {
    return (
      <div className="flex text-sm border-b px-4 py-2 bg-gray-50">
        {SUBTABS[selectedProjectSubTab as keyof typeof SUBTABS].map((subTab: string) => (
          <button
            key={subTab}
            className={`py-1 px-1 whitespace-nowrap mr-2 ${
              selectedEvent?.subTabType === subTab
                ? "bg-blue-100 text-blue-800 font-medium rounded"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              // サブタブに基づいて3桁目の文字を設定
              let thirdChar = "0"; // デフォルト
              
              if (selectedProjectSubTab === "計画") {
                if (subTab === "計画図") thirdChar = "P";
                else if (subTab === "検討書") thirdChar = "C";
                else if (subTab === "見積り") thirdChar = "T";
              }
              else if (selectedProjectSubTab === "設計") {
                if (subTab === "計画図") thirdChar = "P";
                else if (subTab === "詳細図") thirdChar = "S";
                else if (subTab === "組立図") thirdChar = "K";
                else if (subTab === "改正図") thirdChar = "R";
              }
              else if (selectedProjectSubTab === "会議") {
                if (subTab === "内部定例") thirdChar = "N";
                else if (subTab === "外部定例") thirdChar = "G";
                else if (subTab === "プロ進行") thirdChar = "J";
                else if (subTab === "その他") thirdChar = "O";
              }
              
              // 業務分類コードの最初の文字
              let codePrefix = "P";
              if (selectedProjectSubTab === "計画") codePrefix = "P";
              else if (selectedProjectSubTab === "設計") codePrefix = "D";
              else if (selectedProjectSubTab === "会議") codePrefix = "M";
              
              // 4桁コードを構成（下二桁は00固定）
              const newCode = `${codePrefix}${thirdChar}00`;
              
              // リセットが必要なフィールドを特定
              const resetFields = {
                planningSubType: "",
                estimateSubType: "",
                designSubType: "",
                designTypeCode: "",
                meetingType: "",
                meetingCode: ""
              };
              if (selectedEvent) {
                updateEvent({ 
                  ...selectedEvent, 
                  ...resetFields,
                  subTabType: subTab,
                  activityCode: newCode,
                  businessCode: newCode
                });
              }
            }}
          >
            {subTab}
          </button>
        ))}
      </div>
    )
  }

  return null
} 