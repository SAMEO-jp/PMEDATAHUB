"use client"

import { useEventContext } from "@src/app/zisseki-demo/[year]/[week]/context/EventContext"
import { TimeGridEvent } from "../../../types"

type PlanningTabContentProps = {
  selectedEvent: TimeGridEvent | null
  updateEvent: (updatedEvent: TimeGridEvent) => void
}

export const PlanningTabContent = ({ selectedEvent, updateEvent }: PlanningTabContentProps) => {
  // Event Contextから状態を取得
  const { getTabDetails, setTabDetail, handleUpdateEvent: contextUpdateEvent } = useEventContext();
  const tabDetails = getTabDetails();
  const { planningSubType, estimateSubType } = tabDetails.planning;

  // サイドバーの操作でイベントの属性を更新
  const handlePlanningSubTypeChange = (subType: { name: string; code: string }) => {
    // 現在選択されている場合は選択解除
    if (planningSubType === subType.name) {
      // Event Contextの状態をクリア
      setTabDetail('planning', 'planningSubType', '');
      
      // 選択中のイベントの属性もクリア
      if (selectedEvent) {
        // 現在のactivityCodeから上位2桁を取得し、下2桁を00に設定
        const currentCode = selectedEvent.activityCode || 'PP00';
        const upperTwoDigits = currentCode.substring(0, 2);
        const newCode = `${upperTwoDigits}00`;
        
        const updatedEvent = {
          ...selectedEvent,
          planningSubType: '',
          activityCode: newCode,
        };
        
        // Event ContextのhandleUpdateEventを使用
        contextUpdateEvent(updatedEvent);
      }
      return;
    }

    // Event Contextの状態を更新
    setTabDetail('planning', 'planningSubType', subType.name);
    
    // 選択中のイベントの属性も同時に更新
    if (selectedEvent) {
      // 現在のactivityCodeから上位2桁を取得し、下2桁のみ変更
      const currentCode = selectedEvent.activityCode || 'PP00';
      const upperTwoDigits = currentCode.substring(0, 2);
      const newCode = `${upperTwoDigits}${subType.code}`;
      
      const updatedEvent = {
        ...selectedEvent,
        planningSubType: subType.name,
        activityCode: newCode,
      };
      
      // Event ContextのhandleUpdateEventを使用
      contextUpdateEvent(updatedEvent);
    }
  };

  const handleEstimateSubTypeChange = (subType: { name: string; code: string }) => {
    // 現在選択されている場合は選択解除
    if (estimateSubType === subType.name) {
      // Event Contextの状態をクリア
      setTabDetail('planning', 'estimateSubType', '');
      
      // 選択中のイベントの属性もクリア
      if (selectedEvent) {
        // 現在のactivityCodeから上位2桁を取得し、下2桁を00に設定
        const currentCode = selectedEvent.activityCode || 'PT00';
        const upperTwoDigits = currentCode.substring(0, 2);
        const newCode = `${upperTwoDigits}00`;
        
        const updatedEvent = {
          ...selectedEvent,
          estimateSubType: '',
          activityCode: newCode,
        };
        
        // Event ContextのhandleUpdateEventを使用
        contextUpdateEvent(updatedEvent);
      }
      return;
    }

    // Event Contextの状態を更新
    setTabDetail('planning', 'estimateSubType', subType.name);
    
    // 選択中のイベントの属性も同時に更新
    if (selectedEvent) {
      // 現在のactivityCodeから上位2桁を取得し、下2桁のみ変更
      const currentCode = selectedEvent.activityCode || 'PT00';
      const upperTwoDigits = currentCode.substring(0, 2);
      const newCode = `${upperTwoDigits}${subType.code}`;
      
      const updatedEvent = {
        ...selectedEvent,
        estimateSubType: subType.name,
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
      {/* 計画図が選択された場合のサブタイプ */}
      {selectedEvent?.subTabType === "計画図" && (
        <div className="border-b">
          <div className="px-4 py-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">計画図業務</label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "作図及び作図準備", code: "02" },
                { name: "作図指示", code: "04" },
                { name: "検図", code: "07" },
                { name: "承認作業", code: "08" },
                { name: "出図前図面検討会", code: "03" },
                { name: "出図後図面検討会", code: "06" },
                { name: "その他", code: "09" },
              ].map((subType) => (
                <button
                  key={subType.name}
                  className={`px-3 py-1.5 rounded-full text-xs ${
                    planningSubType === subType.name
                      ? "bg-blue-100 text-blue-800 font-bold border-2 border-blue-300"
                      : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                  }`}
                  onClick={() => handlePlanningSubTypeChange(subType)}
                >
                  {subType.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 検討書が選択された場合の会議オプション */}
      {selectedEvent?.subTabType === "検討書" && (
        <div className="border-b">
          <div className="px-4 py-2">
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-xs font-bold text-gray-700">検討書作成およびサイン (PC01)</p>
              <p className="text-xs text-gray-500 mt-1">検討書の作成と必要なサイン作業を行います。</p>
            </div>
          </div>
        </div>
      )}

      {/* 見積りが選択された場合のサブタイプ */}
      {selectedEvent?.subTabType === "見積り" && (
        <div className="border-b">
          <div className="px-4 py-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">見積り業務</label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "設計費見積書", code: "01" },
                { name: "見積仕様書", code: "02" },
                { name: "テクスぺ", code: "03" },
                { name: "製作品BQ", code: "04" },
                { name: "工事BQ", code: "05" },
                { name: "購入品見積", code: "06" },
                { name: "区分見積", code: "07" },
                { name: "予備品見積", code: "08" },
                { name: "その他", code: "09" },
              ].map((subType) => (
                <button
                  key={subType.name}
                  className={`px-3 py-1.5 rounded-full text-xs ${
                    estimateSubType === subType.name
                      ? "bg-blue-100 text-blue-800 font-bold border-2 border-blue-300"
                      : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                  }`}
                  onClick={() => handleEstimateSubTypeChange(subType)}
                >
                  {subType.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
} 