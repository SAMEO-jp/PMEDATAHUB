"use client"

import { TabSelector } from "../selectors/TabSelector"
import { useEventContext } from "@src/app/zisseki-demo/[year]/[week]/context/EventContext";

export const SidebarHeader = () => {
  // Contextから選択中のイベントを取得
  const { selectedEvent } = useEventContext();

  return (
    <div className="p-3 flex justify-between items-center border-b">
      <h2 className="text-lg font-bold">業務詳細</h2>
      {/* イベントが選択されている場合のみタブセレクターを表示 */}
      {selectedEvent && (
        <TabSelector />
      )}
    </div>
  )
} 