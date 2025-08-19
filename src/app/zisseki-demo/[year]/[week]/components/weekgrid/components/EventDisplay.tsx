"use client"

import React from "react"
import { TimeGridEvent } from "../../../types"
import { useState, useCallback, useRef } from "react"
import { useEventContext } from "../../../context/EventContext"
import { calculateEventDateTime } from "../../../utils/eventPositionCalculator"

interface EventDisplayProps {
  event: TimeGridEvent
  selectedEvent: TimeGridEvent | null
  onClick: (event: TimeGridEvent) => void
  onEventUpdate?: (eventId: string, updates: Partial<TimeGridEvent>) => void
  // 日付変更のために週の日付情報を受け取る
  weekDays?: Date[]
  dayIndex?: number // 現在のイベントがどの日付カラムにあるか
}

// 時間計算用のユーティリティ関数
// TimeGridのutils.tsに合わせて、1時間 = 64px
const HOUR_HEIGHT = 64; // 1時間あたりのピクセル高さ（TimeGridのutilsと一致）
const MINUTE_HEIGHT = HOUR_HEIGHT / 60; // 1分あたりのピクセル高さ（約1.067px）
const SNAP_TO_MINUTES = 10; // スナップする分単位

const snapToGrid = (value: number): number => {
  const snapValue = SNAP_TO_MINUTES * MINUTE_HEIGHT;
  const snapped = Math.round(value / snapValue) * snapValue;
  return snapped;
};

const pixelsToMinutes = (pixels: number): number => {
  return Math.round(pixels / MINUTE_HEIGHT);
};

const minutesToPixels = (minutes: number): number => {
  return minutes * MINUTE_HEIGHT;
};

// 日付計算のユーティリティ関数
const calculateNewDate = (originalDateTime: string, targetDayIndex: number, weekDays: Date[]): string => {
  if (!weekDays || targetDayIndex < 0 || targetDayIndex >= weekDays.length) {
    return originalDateTime;
  }

  const originalDate = new Date(originalDateTime);
  const targetDate = weekDays[targetDayIndex];
  
  // 元の時間を保持しながら日付のみ変更
  const newDate = new Date(targetDate);
  newDate.setHours(originalDate.getHours());
  newDate.setMinutes(originalDate.getMinutes());
  newDate.setSeconds(originalDate.getSeconds());
  
  return newDate.toISOString();
};

// マウス位置から日付インデックスを計算
const calculateDayIndexFromMouseX = (mouseX: number, weekDays: Date[]): number => {
  if (!weekDays) return 0;
  
  // TimeGridの構造を想定：最初のカラムは時間ラベル、その後7日分のカラム
  // 各日付カラムの幅を計算（概算）
  const gridContainer = document.querySelector('[style*="grid-template-columns"]');
  if (!gridContainer) {
    console.warn('Grid container not found');
    return 0;
  }
  
  const containerRect = gridContainer.getBoundingClientRect();
  const timeLabelsWidth = 80; // 時間ラベル部分の概算幅
  const dayColumnWidth = (containerRect.width - timeLabelsWidth) / 7;
  
  const relativeX = mouseX - containerRect.left - timeLabelsWidth;
  const dayIndex = Math.floor(relativeX / dayColumnWidth);
  
  const clampedIndex = Math.max(0, Math.min(dayIndex, weekDays.length - 1));
  
  // デバッグ情報
  if (Math.abs(relativeX) > 10) { // 意味のある移動があった場合のみログ
    console.log('Day index calculation:', {
      mouseX,
      containerLeft: containerRect.left,
      timeLabelsWidth,
      dayColumnWidth,
      relativeX,
      dayIndex,
      clampedIndex,
      weekDaysLength: weekDays.length
    });
  }
  
  return clampedIndex;
};

export const EventDisplay = ({ event, selectedEvent, onClick, onEventUpdate, weekDays, dayIndex }: EventDisplayProps) => {
  const { handleUpdateEvent } = useEventContext();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<'top' | 'bottom' | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [originalPosition, setOriginalPosition] = useState({ top: 0, height: 0 });
  const [tempPosition, setTempPosition] = useState({ top: event.top, height: event.height });
  const [tempDayIndex, setTempDayIndex] = useState(dayIndex || 0);
  const elementRef = useRef<HTMLDivElement>(null);

  // 選択状態を判定
  const isSelected = selectedEvent?.id === event.id;
  
  // 業務分析コードが設定されていない場合のデフォルト値を設定
  const getDefaultActivityCode = () => {
    if (event.activityCode) return event.activityCode;
    return '未設定';
  };
  
  const activityCode = getDefaultActivityCode();
  const subTabType = event.subTabType || 'なし';

  // イベントの位置が変更された時に一時位置も更新
  React.useEffect(() => {
    if (!isDragging && !isResizing) {
      setTempPosition({ top: event.top, height: event.height });
      setTempDayIndex(dayIndex || 0);
    }
  }, [event.top, event.height, dayIndex, isDragging, isResizing]);

  // イベント更新のヘルパー関数（日付変更対応）
  const updateEventPosition = useCallback((newTop: number, newHeight: number, targetDayIndex?: number) => {
    const snappedTop = snapToGrid(newTop);
    const snappedHeight = Math.max(snapToGrid(newHeight), minutesToPixels(10)); // 最小10分

    // 日付変更の処理
    let baseStartDateTime = event.startDateTime;
    let baseEndDateTime = event.endDateTime;
    
    if (targetDayIndex !== undefined && weekDays && targetDayIndex !== dayIndex) {
      // 日付が変更される場合
      baseStartDateTime = calculateNewDate(event.startDateTime, targetDayIndex, weekDays);
      baseEndDateTime = calculateNewDate(event.endDateTime, targetDayIndex, weekDays);
    }

    // top/heightからstartDateTime/endDateTimeを再計算
    const { startDateTime: updatedStartDateTime, endDateTime: updatedEndDateTime } = 
      calculateEventDateTime(baseStartDateTime, snappedTop, snappedHeight);

    // 完全なイベントオブジェクトを作成
    const updatedEvent: TimeGridEvent = {
      ...event,
      top: snappedTop,
      height: snappedHeight,
      startDateTime: updatedStartDateTime,
      endDateTime: updatedEndDateTime,
      unsaved: true
    };

    if (handleUpdateEvent && event.id) {
      handleUpdateEvent(updatedEvent);
    } else if (onEventUpdate) {
      onEventUpdate(event.id, updatedEvent);
    }
  }, [event, handleUpdateEvent, onEventUpdate, weekDays, dayIndex]);

  // ドラッグ開始ハンドラー
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const resizeThreshold = 8; // リサイズ領域の閾値

    // 現在の位置を一時位置として初期化
    setTempPosition({ top: event.top, height: event.height });
    setTempDayIndex(dayIndex || 0);

    // リサイズ判定
    if (offsetY <= resizeThreshold) {
      setIsResizing('top');
      setOriginalPosition({ top: event.top, height: event.height });
    } else if (offsetY >= rect.height - resizeThreshold) {
      setIsResizing('bottom');
      setOriginalPosition({ top: event.top, height: event.height });
    } else {
      // ドラッグ移動
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setOriginalPosition({ top: event.top, height: event.height });
    }

    e.preventDefault();
    e.stopPropagation();
  }, [event.top, event.height]);

  // マウス移動ハンドラー
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!elementRef.current) return;

    if (isDragging) {
      // ドラッグ移動 - 縦方向（時間）と横方向（日付）の両方を処理
      const parentRect = elementRef.current.parentElement?.getBoundingClientRect();
      if (!parentRect) return;

      // 縦方向の移動（時間変更）
      const newTop = e.clientY - parentRect.top - dragOffset.y;
      const clampedTop = Math.max(0, newTop);
      const snappedTop = snapToGrid(clampedTop);
      
      // 横方向の移動（日付変更）
      const newDayIndex = weekDays ? calculateDayIndexFromMouseX(e.clientX, weekDays) : (dayIndex || 0);
      
      setTempPosition(prev => ({ ...prev, top: snappedTop }));
      setTempDayIndex(newDayIndex);
      
      // デバッグ情報
      if (newDayIndex !== (dayIndex || 0)) {
        console.log('Date change detected:', {
          from: dayIndex,
          to: newDayIndex,
          weekDays: weekDays?.map(d => `${d.getMonth() + 1}/${d.getDate()}`)
        });
      }
    } else if (isResizing) {
      // リサイズ - 一時的なサイズを更新
      const parentRect = elementRef.current.parentElement?.getBoundingClientRect();
      if (!parentRect) return;

      if (isResizing === 'top') {
        // 上端リサイズ
        const newTop = e.clientY - parentRect.top;
        const deltaY = newTop - originalPosition.top;
        const newHeight = originalPosition.height - deltaY;
        
        if (newHeight >= minutesToPixels(10)) {
          const snappedTop = snapToGrid(newTop);
          const snappedHeight = Math.max(snapToGrid(newHeight), minutesToPixels(10));
          setTempPosition({ top: snappedTop, height: snappedHeight });
        }
      } else if (isResizing === 'bottom') {
        // 下端リサイズ
        const newHeight = e.clientY - parentRect.top - tempPosition.top;
        const clampedHeight = Math.max(minutesToPixels(10), newHeight);
        const snappedHeight = Math.max(snapToGrid(clampedHeight), minutesToPixels(10));
        
        setTempPosition(prev => ({ ...prev, height: snappedHeight }));
      }
    }
  }, [isDragging, isResizing, dragOffset, originalPosition, tempPosition.top]);

  // マウスアップハンドラー
  const handleMouseUp = useCallback(() => {
    if (isDragging || isResizing) {
      // ドラッグ・リサイズ終了時に実際の位置を更新
      if (isDragging) {
        // ドラッグの場合は日付変更も考慮
        updateEventPosition(tempPosition.top, tempPosition.height, tempDayIndex);
      } else {
        // リサイズの場合は時間のみ変更
        updateEventPosition(tempPosition.top, tempPosition.height);
      }
    }
    
    setIsDragging(false);
    setIsResizing(null);
    setDragOffset({ x: 0, y: 0 });
    setOriginalPosition({ top: 0, height: 0 });
    setTempDayIndex(dayIndex || 0);
  }, [isDragging, isResizing, tempPosition, tempDayIndex, updateEventPosition, dayIndex]);

  // グローバルイベントリスナーの設定
  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isResizing ? (isResizing === 'top' || isResizing === 'bottom' ? 'ns-resize' : 'move') : 'move';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  // クリックハンドラー（ドラッグと区別）
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!isDragging && !isResizing) {
      onClick(event);
    }
  }, [isDragging, isResizing, onClick, event]);

  // カーソルスタイルの動的設定
  const getCursorStyle = (e: React.MouseEvent) => {
    if (!elementRef.current) return 'pointer';
    
    const rect = elementRef.current.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const resizeThreshold = 8;

    if (offsetY <= resizeThreshold || offsetY >= rect.height - resizeThreshold) {
      return 'ns-resize';
    }
    return 'move';
  };

  return (
    <div
      ref={elementRef}
      className={`absolute overflow-hidden text-xs border shadow-md rounded-md cursor-pointer group select-none ${
        isSelected 
          ? "border-2 border-blue-500 ring-2 ring-blue-200" // 選択時：青い枠とリング
          : event.unsaved 
            ? "border-yellow-400" // 未保存時：黄色い枠
            : "border-gray-300"   // 通常時：グレーの枠
      } ${isDragging || isResizing ? 'shadow-xl z-50' : ''}`}
      style={{
        top: `${isDragging || isResizing ? tempPosition.top : event.top}px`,
        height: `${Math.max(isDragging || isResizing ? tempPosition.height : event.height, minutesToPixels(10))}px`, // 最小高さ10分を確保
        left: "4px",
        right: "4px",
        backgroundColor: event.color,
        color: "white",
        cursor: isDragging ? 'move' : isResizing ? 'ns-resize' : 'pointer',
        opacity: isDragging || isResizing ? 0.8 : 1,
        transform: isDragging || isResizing ? 'scale(1.02)' : 'scale(1)',
        transition: isDragging || isResizing ? 'none' : 'transform 0.1s ease',
        // 日付変更時の視覚効果
        boxShadow: isDragging && tempDayIndex !== (dayIndex || 0) 
          ? '0 8px 25px rgba(59, 130, 246, 0.6), 0 0 0 2px rgba(59, 130, 246, 0.3)' 
          : isDragging || isResizing ? '0 4px 12px rgba(0, 0, 0, 0.3)' : ''
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseMove={(e) => {
        if (!isDragging && !isResizing) {
          e.currentTarget.style.cursor = getCursorStyle(e);
        }
      }}
      title={`${event.title} - 業務コード: ${event.activityCode || '未設定'} - サブタブ: ${event.subTabType || 'なし'} - ドラッグで移動・端をドラッグで時間調整`}
    >
      {/* リサイズハンドル（上） */}
      <div className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 bg-white/20 transition-opacity" />
      
      {/* 業務コード表示 - 右上に配置、サイズに応じて調整 */}
      <div 
        className="absolute top-0.5 right-0.5 font-mono bg-black/50 text-white rounded border border-white/20 pointer-events-none"
        style={{
          fontSize: Math.max(isDragging || isResizing ? tempPosition.height : event.height, minutesToPixels(10)) >= 30 ? '9px' : '7px',
          padding: Math.max(isDragging || isResizing ? tempPosition.height : event.height, minutesToPixels(10)) >= 30 ? '2px 3px' : '1px 2px'
        }}
      >
        {activityCode}
      </div>
      
      {/* イベント内容の表示 */}
      <div className="p-1 h-full flex flex-col justify-start pointer-events-none overflow-hidden">
        {/* イベントタイトル - 上部揃え、小さいサイズでも表示を調整 */}
        <div 
          className="font-semibold truncate pr-12 leading-tight"
          style={{
            fontSize: Math.max(isDragging || isResizing ? tempPosition.height : event.height, minutesToPixels(10)) >= 30 ? '11px' : '9px',
            lineHeight: Math.max(isDragging || isResizing ? tempPosition.height : event.height, minutesToPixels(10)) >= 30 ? '1.1' : '1'
          }}
        >
          {event.title}
        </div>
        
        {/* イベント説明 - 高さが十分な時のみ表示 */}
        {event.description && Math.max(isDragging || isResizing ? tempPosition.height : event.height, minutesToPixels(10)) >= 30 && (
          <div className="text-xs opacity-90 truncate leading-tight">{event.description}</div>
        )}
        


        {/* ドラッグ状態の表示 */}
        {(isDragging || isResizing) && (
          <div className="absolute top-1 right-1 text-xs bg-black/70 text-white px-1 rounded">
            {isDragging ? (
              tempDayIndex !== (dayIndex || 0) && weekDays?.[tempDayIndex]
                ? `📅 ${weekDays[tempDayIndex].getMonth() + 1}/${weekDays[tempDayIndex].getDate()}へ移動` 
                : '📍 移動中'
            ) : (
              isResizing === 'top' ? '⬆️ 開始時間' : '⬇️ 終了時間'
            )}
          </div>
        )}
      </div>

      {/* リサイズハンドル（下） */}
      <div className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 bg-white/20 transition-opacity" />
    </div>
  )
}