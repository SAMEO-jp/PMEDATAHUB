"use client"

import { useEventContext } from "@src/app/zisseki-demo/[year]/[week]/context/EventContext"
import { TimeGridEvent } from "../../../types"

type MeetingTabContentProps = {
  selectedEvent: TimeGridEvent | null
  updateEvent: (updatedEvent: TimeGridEvent) => void
}

export const MeetingTabContent = ({ selectedEvent, updateEvent }: MeetingTabContentProps) => {
  // Event Contextから状態を取得
  const { tabDetails, setTabDetail, updateEvent: contextUpdateEvent } = useEventContext();
  const { meetingType } = tabDetails.meeting;

  // サイドバーの操作でイベントの属性を更新
  const handleMeetingTypeChange = (type: { name: string; code: string }) => {
    // Event Contextの状態を更新
    setTabDetail('meeting', 'meetingType', type.name);
    
    // 選択中のイベントの属性も同時に更新
    if (selectedEvent) {
      // 3桁目の文字を設定 (サブタブに基づく)
      let thirdChar = "0";
      if (selectedEvent?.subTabType === "内部定例") thirdChar = "N";
      else if (selectedEvent?.subTabType === "外部定例") thirdChar = "G";
      else if (selectedEvent?.subTabType === "プロ進行") thirdChar = "J";
      else if (selectedEvent?.subTabType === "その他") thirdChar = "O";
      
      // 4桁コードを構成（M:会議 + サブタブの文字 + 選択した会議タイプの下二桁）
      const newCode = `M${thirdChar}${type.code}`;
      
      const updatedEvent = {
        ...selectedEvent,
        meetingType: type.name,
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
      {/* 会議タイプ選択 */}
      <div className="border-b">
        <div className="px-4 py-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">会議タイプ</label>
          <div className="flex flex-wrap gap-2">
            {[
              { name: "定例会議", code: "01" },
              { name: "進捗会議", code: "02" },
              { name: "技術検討会", code: "03" },
              { name: "設計レビュー", code: "04" },
              { name: "品質会議", code: "05" },
              { name: "安全会議", code: "06" },
              { name: "その他", code: "07" },
            ].map((type) => (
              <button
                key={type.name}
                className={`px-3 py-1.5 rounded-full text-xs ${
                  meetingType === type.name
                    ? "bg-blue-100 text-blue-800 font-bold border-2 border-blue-300"
                    : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                }`}
                onClick={() => handleMeetingTypeChange(type)}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
} 