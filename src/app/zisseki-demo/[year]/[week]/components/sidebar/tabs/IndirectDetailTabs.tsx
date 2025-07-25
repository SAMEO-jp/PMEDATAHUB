"use client"

import { SUBTABS } from "../../../constants"
import { Event } from "../../../types"

interface IndirectDetailTabsProps {
  selectedTab: string
  indirectSubTab: string
  selectedIndirectDetailTab: string
  setSelectedIndirectDetailTab: (tab: string) => void
  selectedEvent: Event | null
  updateEvent: (event: Event) => void
}

export const IndirectDetailTabs = ({
  selectedTab,
  indirectSubTab,
  selectedIndirectDetailTab,
  setSelectedIndirectDetailTab,
  selectedEvent,
  updateEvent
}: IndirectDetailTabsProps) => {
  // 間接業務の純間接サブタブ
  if (selectedTab === "indirect" && indirectSubTab === "純間接") {
    return (
      <div className="flex text-sm border-b px-4 py-2 bg-gray-50">
        {SUBTABS.純間接.map((subTab: string) => (
          <button
            key={subTab}
            className={`py-1 px-1 whitespace-nowrap mr-2 ${
              selectedIndirectDetailTab === subTab
                ? "bg-blue-100 text-blue-800 font-medium rounded"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setSelectedIndirectDetailTab(subTab);
              // サブタブに基づいて下二桁を設定
              let codeSuffix = "00";
              if (subTab === "会議") codeSuffix = "M0";
              else if (subTab === "日報入力") codeSuffix = "D0";
              else if (subTab === "人事評価") codeSuffix = "H0";
              else if (subTab === "作業") codeSuffix = "A0";
              else if (subTab === "その他") codeSuffix = "O0";
              
              // 純間接のプレフィックス + 業務コードサフィックス
              const newCode = `ZJ${codeSuffix}`;
              
              // リセットすべきフィールド
              const resetFields = {
                meetingType: "",
                workType: ""
              };
              
              if (selectedEvent) {
                updateEvent({ 
                  ...selectedEvent, 
                  ...resetFields,
                  indirectDetailType: subTab,
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

  // 間接業務の目的間接サブタブ
  if (selectedTab === "indirect" && indirectSubTab === "目的間接") {
    return (
      <div className="flex text-sm border-b px-4 py-2 bg-gray-50">
        {SUBTABS.目的間接.map((subTab: string) => (
          <button
            key={subTab}
            className={`py-1 px-1 whitespace-nowrap mr-2 ${
              selectedIndirectDetailTab === subTab
                ? "bg-blue-100 text-blue-800 font-medium rounded"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setSelectedIndirectDetailTab(subTab);
              // サブタブに基づいて下二桁を設定
              let codeSuffix = "00";
              if (subTab === "会議") codeSuffix = "M0";
              else if (subTab === "作業") codeSuffix = "A0";
              else if (subTab === "その他") codeSuffix = "O0";
              
              // 目的間接のプレフィックス + 業務コードサフィックス
              const newCode = `ZM${codeSuffix}`;
              
              // リセットすべきフィールド
              const resetFields = {
                meetingType: "",
                workType: ""
              };
              
              if (selectedEvent) {
                updateEvent({ 
                  ...selectedEvent, 
                  ...resetFields,
                  indirectDetailType: subTab,
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

  // 間接業務の控除時間サブタブ
  if (selectedTab === "indirect" && indirectSubTab === "控除時間") {
    return (
      <div className="flex text-sm border-b px-4 py-2 bg-gray-50">
        {SUBTABS.控除時間.map((subTab: string) => (
          <button
            key={subTab}
            className={`py-1 px-1 whitespace-nowrap mr-2 ${
              selectedIndirectDetailTab === subTab
                ? "bg-blue-100 text-blue-800 font-medium rounded"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setSelectedIndirectDetailTab(subTab);
              // サブタブに基づいて下二桁を設定
              let codeSuffix = "00";
              if (subTab === "休憩／外出") codeSuffix = "ZZ";
              else if (subTab === "組合時間") codeSuffix = "ZK";
              else if (subTab === "その他") codeSuffix = "O0";
              
              // 控除時間のプレフィックス + 業務コードサフィックス
              const newCode = `ZK${codeSuffix}`;
              
              if (selectedEvent) {
                updateEvent({ 
                  ...selectedEvent, 
                  indirectDetailType: subTab,
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