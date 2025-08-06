"use client"

import { useEventContext } from "@src/app/zisseki-demo/[year]/[week]/context/EventContext"
import { TimeGridEvent } from "../../../types"

type OtherTabContentProps = {
  selectedEvent: TimeGridEvent | null
  updateEvent: (updatedEvent: TimeGridEvent) => void
}

export const OtherTabContent = ({ selectedEvent, updateEvent }: OtherTabContentProps) => {
  // Event Contextから状態を取得
  const { tabDetails, setTabDetail, updateEvent: contextUpdateEvent } = useEventContext();
  const { travelType, stakeholderType, documentType } = tabDetails.other;

  // サイドバーの操作でイベントの属性を更新
  const handleTravelTypeChange = (type: { name: string; code: string }) => {
    // Event Contextの状態を更新
    setTabDetail('other', 'travelType', type.name);
    
    // 選択中のイベントの属性も同時に更新
    if (selectedEvent) {
      // 4桁コードを構成（O:その他 + T:出張 + 選択したタイプの下二桁）
      const newCode = `OT${type.code}`;
      
      const updatedEvent = {
        ...selectedEvent,
        travelType: type.name,
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

  const handleStakeholderTypeChange = (type: { name: string; code: string }) => {
    // Event Contextの状態を更新
    setTabDetail('other', 'stakeholderType', type.name);
    
    // 選択中のイベントの属性も同時に更新
    if (selectedEvent) {
      // 4桁コードを構成（O:その他 + C:対応 + 選択したタイプの下二桁）
      const newCode = `OC${type.code}`;
      
      const updatedEvent = {
        ...selectedEvent,
        stakeholderType: type.name,
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

  const handleDocumentTypeChange = (type: { name: string; code: string }) => {
    // Event Contextの状態を更新
    setTabDetail('other', 'documentType', type.name);
    
    // 選択中のイベントの属性も同時に更新
    if (selectedEvent) {
      // 4桁コードを構成（O:その他 + D:資料 + 選択したタイプの下二桁）
      const newCode = `OD${type.code}`;
      
      const updatedEvent = {
        ...selectedEvent,
        documentType: type.name,
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
      {/* 出張が選択された場合のタイプ */}
      {selectedEvent?.subTabType === "出張" && (
        <div className="border-b">
          <div className="px-4 py-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">出張タイプ</label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "国内出張", code: "01" },
                { name: "海外出張", code: "02" },
                { name: "研修", code: "03" },
                { name: "その他", code: "04" },
              ].map((type) => (
                <button
                  key={type.name}
                  className={`px-3 py-1.5 rounded-full text-xs ${
                    travelType === type.name
                      ? "bg-blue-100 text-blue-800 font-bold border-2 border-blue-300"
                      : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                  }`}
                  onClick={() => handleTravelTypeChange(type)}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 〇対応が選択された場合のタイプ */}
      {selectedEvent?.subTabType === "〇対応" && (
        <div className="border-b">
          <div className="px-4 py-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">対応タイプ</label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "顧客対応", code: "01" },
                { name: "技術対応", code: "02" },
                { name: "品質対応", code: "03" },
                { name: "その他", code: "04" },
              ].map((type) => (
                <button
                  key={type.name}
                  className={`px-3 py-1.5 rounded-full text-xs ${
                    stakeholderType === type.name
                      ? "bg-blue-100 text-blue-800 font-bold border-2 border-blue-300"
                      : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                  }`}
                  onClick={() => handleStakeholderTypeChange(type)}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* プロ管理が選択された場合のタイプ */}
      {selectedEvent?.subTabType === "プロ管理" && (
        <div className="border-b">
          <div className="px-4 py-2">
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-xs font-bold text-gray-700">プロジェクト管理 (OM01)</p>
              <p className="text-xs text-gray-500 mt-1">プロジェクトの管理業務を行います。</p>
            </div>
          </div>
        </div>
      )}

      {/* 資料が選択された場合のタイプ */}
      {selectedEvent?.subTabType === "資料" && (
        <div className="border-b">
          <div className="px-4 py-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">資料タイプ</label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "技術資料", code: "01" },
                { name: "報告書", code: "02" },
                { name: "提案書", code: "03" },
                { name: "その他", code: "04" },
              ].map((type) => (
                <button
                  key={type.name}
                  className={`px-3 py-1.5 rounded-full text-xs ${
                    documentType === type.name
                      ? "bg-blue-100 text-blue-800 font-bold border-2 border-blue-300"
                      : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                  }`}
                  onClick={() => handleDocumentTypeChange(type)}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* その他が選択された場合 */}
      {selectedEvent?.subTabType === "その他" && (
        <div className="border-b">
          <div className="px-4 py-2">
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-xs font-bold text-gray-700">その他業務 (OO01)</p>
              <p className="text-xs text-gray-500 mt-1">その他の業務を行います。</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 