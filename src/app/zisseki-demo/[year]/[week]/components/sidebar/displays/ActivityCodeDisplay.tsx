"use client"

import { TimeGridEvent } from "../../../types";

interface ActivityCodeDisplayProps {
  selectedEvent: TimeGridEvent | null;
  selectedTab: string;
  equipmentNumber: string;
  equipmentName: string;
}

export const ActivityCodeDisplay = ({
  selectedEvent,
  selectedTab,
  equipmentNumber,
  equipmentName,
}: ActivityCodeDisplayProps) => {
  return (
    <div className="border-b bg-yellow-50">
      <div className="px-4 py-3">
        <label className="block text-xs font-medium text-gray-700 mb-2">🔍 業務分類コード（デバッグ表示）</label>
        <div className="bg-blue-100 p-3 rounded-md flex items-center border-2 border-blue-300">
          <span className="font-mono text-xl font-bold text-blue-800">
            {selectedEvent?.activityCode || "未設定"}
          </span>
          {selectedTab === "project" ? (
            // プロジェクトタブの場合は通常の設備番号と設備名を表示
            equipmentNumber && (
              <span className="text-sm font-bold text-gray-600 ml-2">
                {' - '}{equipmentNumber}{' - '}{equipmentName ? equipmentName : "XXXX"}
              </span>
            )
          ) : (
            // 間接業務タブの場合は両方XXXXと表示
            <span className="text-sm font-bold text-gray-600 ml-2">
              {' - XXXX - XXXX'}
            </span>
          )}
        </div>
        {selectedEvent?.businessCode && selectedEvent.businessCode !== selectedEvent.activityCode && (
          <div className="bg-gray-100 p-2 rounded-md mt-2 flex items-center border border-gray-300">
            <span className="font-mono text-sm font-bold text-gray-700">{selectedEvent.businessCode}</span>
            <span className="text-xs text-gray-500 ml-2">業務コード</span>
          </div>
        )}
        {/* デバッグ情報 */}
        <div className="mt-2 text-xs text-gray-500">
          <div>選択中イベント: {selectedEvent?.title || "なし"}</div>
          <div>タブ: {selectedTab} / サブタブ: {selectedEvent?.subTabType || "なし"}</div>
          <div>activityCode: {selectedEvent?.activityCode || "なし"}</div>
          <div>businessCode: {selectedEvent?.businessCode || "なし"}</div>
        </div>
      </div>
    </div>
  );
}; 