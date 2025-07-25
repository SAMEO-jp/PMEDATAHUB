"use client"

import { Event } from "../../../types";

interface ActivityCodeDisplayProps {
  selectedEvent: Event | null;
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
    <div className="border-b">
      <div className="px-4 py-2">
        <label className="block text-xs font-medium text-gray-500 mb-1">業務分類コード</label>
        <div className="bg-blue-50 p-2 rounded-md flex items-center">
          <span className="font-mono text-lg font-bold">
            {selectedEvent?.activityCode || ""}
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
          <div className="bg-gray-50 p-2 rounded-md mt-2 flex items-center">
            <span className="font-mono text-sm font-bold text-gray-600">{selectedEvent.businessCode}</span>
            <span className="text-xs text-gray-500 ml-2">業務コード</span>
          </div>
        )}
      </div>
    </div>
  );
}; 