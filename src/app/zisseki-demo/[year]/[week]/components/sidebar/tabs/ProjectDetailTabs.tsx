"use client"

import { SUBTABS } from "../../../constants"
import { TimeGridEvent } from "../../../types"
import { useEventContext } from "@src/app/zisseki-demo/[year]/[week]/context/EventContext"

interface ProjectDetailTabsProps {
  selectedTab: string
  selectedProjectSubTab: string
  selectedOtherSubTab: string
  setSelectedOtherSubTab: (tab: string) => void
  selectedEvent: TimeGridEvent | null
  updateEvent: (event: TimeGridEvent) => void
}

export const ProjectDetailTabs = ({
  selectedTab,
  selectedProjectSubTab,
  selectedOtherSubTab,
  setSelectedOtherSubTab,
  selectedEvent,
  updateEvent
}: ProjectDetailTabsProps) => {
  // Event ContextからupdateEventを取得
  const { updateEvent: contextUpdateEvent } = useEventContext();
  // デバッグ用: 表示条件を確認
  console.log('ProjectDetailTabs - 表示条件:', {
    selectedTab,
    selectedProjectSubTab,
    hasSubtabs: SUBTABS[selectedProjectSubTab]?.length > 0,
    subtabs: SUBTABS[selectedProjectSubTab]
  });

  // イベントが選択されている場合は、そのイベントのタブ状態を表示
  const currentOtherSubTab = selectedEvent?.selectedOtherSubTab || selectedOtherSubTab

  // 計画、設計、会議、その他、購入品タブのサブタブ
  if (selectedTab === "project" && 
    (selectedProjectSubTab === "計画" || selectedProjectSubTab === "設計" || selectedProjectSubTab === "会議" || selectedProjectSubTab === "その他" || selectedProjectSubTab === "購入品") && 
    SUBTABS[selectedProjectSubTab]?.length > 0) {
    return (
      <div className="flex text-sm border-b px-4 py-2 bg-gray-50">
        {SUBTABS[selectedProjectSubTab].map((subTab: string) => (
          <button
            key={subTab}
            className={`py-1 px-1 whitespace-nowrap mr-2 ${
              selectedProjectSubTab === "その他" 
                ? (currentOtherSubTab === subTab ? "bg-blue-100 text-blue-800 font-medium rounded" : "text-gray-500 hover:text-gray-700")
                : (selectedEvent?.subTabType === subTab ? "bg-blue-100 text-blue-800 font-medium rounded" : "text-gray-500 hover:text-gray-700")
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
              else if (selectedProjectSubTab === "その他") {
                if (subTab === "出張") thirdChar = "T";
                else if (subTab === "〇対応") thirdChar = "C";
                else if (subTab === "プロ管理") thirdChar = "M";
                else if (subTab === "資料") thirdChar = "D";
                else if (subTab === "その他") thirdChar = "O";
              }
              else if (selectedProjectSubTab === "購入品") {
                // 購入品の場合は、サブタブのインデックスに基づいて3桁目を設定
                const purchaseIndex = SUBTABS.購入品.indexOf(subTab);
                if (purchaseIndex >= 0) {
                  thirdChar = purchaseIndex.toString().padStart(2, '0');
                }
              }
              
              // 業務分類コードの最初の文字
              let codePrefix = "P";
              if (selectedProjectSubTab === "計画") codePrefix = "P";
              else if (selectedProjectSubTab === "設計") codePrefix = "D";
              else if (selectedProjectSubTab === "会議") codePrefix = "M";
              else if (selectedProjectSubTab === "その他") codePrefix = "O";
              else if (selectedProjectSubTab === "購入品") codePrefix = "P";
              
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
                const updatedEvent = { 
                  ...selectedEvent, 
                  ...resetFields,
                  subTabType: subTab,
                  activityCode: newCode,
                  businessCode: newCode
                };
                
                // Event ContextのupdateEventを使用（eventIdが必要）
                if (contextUpdateEvent && selectedEvent?.id) {
                  contextUpdateEvent(selectedEvent.id, updatedEvent);
                } else if (updateEvent) {
                  // フォールバック: propsから渡されたupdateEventを使用
                  updateEvent(updatedEvent);
                }
              }
              
              // その他タブの場合は、selectedOtherSubTabも更新
              if (selectedProjectSubTab === "その他") {
                setSelectedOtherSubTab(subTab);
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