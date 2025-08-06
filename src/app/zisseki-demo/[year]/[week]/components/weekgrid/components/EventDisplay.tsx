"use client"

import { TimeGridEvent } from "../../../types"

interface EventDisplayProps {
  event: TimeGridEvent
  onClick: (event: TimeGridEvent) => void
}

export const EventDisplay = ({ event, onClick }: EventDisplayProps) => {
  return (
    <div
      className={`absolute overflow-hidden text-xs border ${
        event.unsaved ? "border-yellow-400" : "border-gray-300"
      } shadow-md rounded-md cursor-pointer group`}
      style={{
        top: `${event.top}px`,
        height: `${Math.max(event.height, 48)}px`, // 最小高さ48pxを確保
        left: "4px",
        right: "4px",
        backgroundColor: event.color,
        color: "white"
      }}
      onClick={() => onClick(event)}
      title={`${event.title} - 業務コード: ${event.activityCode || '未設定'} - サブタブ: ${event.subTabType || 'なし'}`}
    >
      {/* イベント内容の表示 */}
      <div className="p-1 h-full flex flex-col">
        {/* イベントタイトル */}
        <div className="font-semibold truncate">{event.title}</div>
        
        {/* イベント説明 */}
        {event.description && (
          <div className="text-xs opacity-90 truncate">{event.description}</div>
        )}
        
        {/* 業務コード表示（デバッグ用） */}
        {event.activityCode && (
          <div className="text-xs font-mono bg-black/30 px-1 rounded mt-1 truncate border border-white/20">
            📊 {event.activityCode}
          </div>
        )}
        
        {/* サブタブ情報（デバッグ用） */}
        {event.subTabType && (
          <div className="text-xs opacity-75 truncate mt-1">
            🏷️ {event.subTabType}
          </div>
        )}
      </div>
    </div>
  )
} 