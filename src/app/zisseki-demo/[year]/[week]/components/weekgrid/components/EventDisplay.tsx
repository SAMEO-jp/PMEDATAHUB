"use client"

import { TimeGridEvent } from "../../../types"

interface EventDisplayProps {
  event: TimeGridEvent
  selectedEvent: TimeGridEvent | null
  onClick: (event: TimeGridEvent) => void
}

export const EventDisplay = ({ event, selectedEvent, onClick }: EventDisplayProps) => {
  // 選択状態を判定
  const isSelected = selectedEvent?.id === event.id;
  
  // 業務分析コードが設定されていない場合のデフォルト値を設定
  const getDefaultActivityCode = () => {
    if (event.activityCode) return event.activityCode;
    
    // イベントのタイトルやプロパティから推測
    if (event.title.includes('計画')) return 'P001';
    if (event.title.includes('設計')) return 'D001';
    if (event.title.includes('会議')) return 'M001';
    if (event.title.includes('購入')) return 'P001';
    if (event.title.includes('その他')) return 'O001';
    if (event.title.includes('間接')) return 'I001';
    
    return '未設定';
  };
  
  const activityCode = getDefaultActivityCode();
  const subTabType = event.subTabType || 'なし';
  
  return (
    <div
      className={`absolute overflow-hidden text-xs border shadow-md rounded-md cursor-pointer group ${
        isSelected 
          ? "border-2 border-blue-500 ring-2 ring-blue-200" // 選択時：青い枠とリング
          : event.unsaved 
            ? "border-yellow-400" // 未保存時：黄色い枠
            : "border-gray-300"   // 通常時：グレーの枠
      }`}
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
        
        {/* 業務コード表示 - 常に表示 */}
        <div className="text-xs font-mono bg-black/30 px-1 rounded mt-1 truncate border border-white/20">
          📊 {activityCode}
        </div>
        
        {/* サブタブ情報 - 常に表示 */}
        <div className="text-xs opacity-75 truncate mt-1">
          🏷️ {subTabType}
        </div>
      </div>
    </div>
  )
} 