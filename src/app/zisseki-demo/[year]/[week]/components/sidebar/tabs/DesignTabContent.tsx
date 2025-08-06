"use client"

import { useEventContext } from "@src/app/zisseki-demo/[year]/[week]/context/EventContext"
import { TimeGridEvent } from "../../../types"

type DesignTabContentProps = {
  selectedEvent: TimeGridEvent | null
  updateEvent: (updatedEvent: TimeGridEvent) => void
}

export const DesignTabContent = ({ selectedEvent, updateEvent }: DesignTabContentProps) => {
  // Event Contextから状態を取得
  const { tabDetails, setTabDetail, updateEvent: contextUpdateEvent } = useEventContext();
  const { designSubType } = tabDetails.design;

  // サイドバーの操作でイベントの属性を更新
  const handleDesignSubTypeChange = (subType: { name: string; code: string }) => {
    // Event Contextの状態を更新
    setTabDetail('design', 'designSubType', subType.name);
    
    // 選択中のイベントの属性も同時に更新
    if (selectedEvent) {
      // 3桁目の文字を設定 (サブタブに基づく)
      let thirdChar = "0";
      if (selectedEvent?.subTabType === "計画図") thirdChar = "P";
      else if (selectedEvent?.subTabType === "詳細図") thirdChar = "S";
      else if (selectedEvent?.subTabType === "組立図") thirdChar = "K";
      else if (selectedEvent?.subTabType === "改正図") thirdChar = "R";
      
      // 4桁コードを構成（D:設計 + サブタブの文字 + 選択した業務タイプの下二桁）
      const newCode = `D${thirdChar}${subType.code}`;
      
      const updatedEvent = {
        ...selectedEvent,
        designSubType: subType.name,
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
  };

  // selectedEventがnullの場合は何も表示しない
  if (!selectedEvent) {
    return null;
  }

  return (
    <>
      {/* 業務タイプ選択（チップ形式） */}
      <div className="border-b">
        <div className="px-4 py-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">設計業務タイプ</label>
          <div className="flex flex-wrap gap-2">
            {[
              { name: "検討書作成及びサイン", code: "01" },
              { name: "作図及び作図準備", code: "02" },
              { name: "作図前図面検討会", code: "03" },
              { name: "作図指示", code: "04" },
              { name: "作図（外注あり）", code: "05" },
              { name: "作図後図面検討会", code: "06" },
              { name: "検図", code: "07" },
              { name: "承認作業", code: "08" },
              { name: "出図確認", code: "09" },
              { name: "修正対応", code: "10" },
              { name: "その他", code: "11" },
            ].map((subType) => (
              <button
                key={subType.name}
                className={`px-3 py-1.5 rounded-full text-xs ${
                  designSubType === subType.name
                    ? "bg-blue-100 text-blue-800 font-bold border-2 border-blue-300"
                    : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                }`}
                onClick={() => handleDesignSubTypeChange(subType)}
              >
                {subType.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
} 