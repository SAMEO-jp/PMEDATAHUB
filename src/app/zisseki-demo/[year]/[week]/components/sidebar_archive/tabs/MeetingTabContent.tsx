"use client"

import { useEventContext } from "@src/app/zisseki-demo/[year]/[week]/context/EventContext"
import { TimeGridEvent } from "../../../types"

type MeetingTabContentProps = {
  selectedEvent: TimeGridEvent | null
  updateEvent: (updatedEvent: TimeGridEvent) => void
}

export const MeetingTabContent = ({ selectedEvent, updateEvent }: MeetingTabContentProps) => {
  // Event Contextから状態を取得
  const { getTabDetails, setTabDetail, handleUpdateEvent: contextUpdateEvent } = useEventContext();
  const tabDetails = getTabDetails();
  const { meetingType } = tabDetails.meeting;

  // サイドバーの操作でイベントの属性を更新
  const handleMeetingTypeChange = (type: { name: string; code: string }) => {
    // 現在選択されている場合は選択解除
    if (meetingType === type.name) {
      // Event Contextの状態をクリア
      setTabDetail('meeting', 'meetingType', '');
      
      // 選択中のイベントの属性もクリア
      if (selectedEvent) {
        // 現在のactivityCodeから上位2桁を取得し、下2桁を00に設定
        const currentCode = selectedEvent.activityCode || 'MN00';
        const upperTwoDigits = currentCode.substring(0, 2);
        const newCode = `${upperTwoDigits}00`;
        
        const updatedEvent = {
          ...selectedEvent,
          meetingType: '',
          activityCode: newCode,
        };
        
        // Event ContextのhandleUpdateEventを使用
        contextUpdateEvent(updatedEvent);
      }
      return;
    }

    // Event Contextの状態を更新
    setTabDetail('meeting', 'meetingType', type.name);
    
    // 選択中のイベントの属性も同時に更新
    if (selectedEvent) {
      // 現在のactivityCodeから上位2桁を取得し、下2桁のみ変更
      const currentCode = selectedEvent.activityCode || 'MN00';
      const upperTwoDigits = currentCode.substring(0, 2);
      const newCode = `${upperTwoDigits}${type.code}`;
      
      const updatedEvent = {
        ...selectedEvent,
        meetingType: type.name,
        activityCode: newCode,
      };
      
      // Event ContextのhandleUpdateEventを使用
      contextUpdateEvent(updatedEvent);
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