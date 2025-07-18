// ========================================
// 最もシンプルなESLintエラー修正版
// ========================================

"use client"

import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { 
  DRAG_TIME_SLOT_HEIGHT,
  DRAG_EVENT_TYPE,
  DROP_OVERLAY_OPACITY,
  DROP_OVERLAY_COLOR 
} from "../../utils/dragDropConstants"
import { DroppableTimeSlotProps } from "../../types/droppable"
import { DisplayEvent } from '../../types/event';
import { useUIStore } from '../../store/uiStore';

// ========================================
// シンプルなインポート（エラーなし）
// ========================================
import { getDraggedItemHeight } from './DragItemTracker';

// ========================================
// ドラッグされるアイテムの型定義
// ========================================
interface DragItem {
  id: string;
  event: DisplayEvent;
}

// ========================================
// メインコンポーネント
// ========================================
export const DroppableTimeSlot = ({ 
  day,
  hour,
  minute,
  isToday,
  dayIndex,
  onClick
}: DroppableTimeSlotProps) => {
  
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useUIStore((state) => state.isDragging);
  
  // ========================================
  // ドロップ機能の設定
  // ========================================
  const [{ isOver, draggedItem }, drop] = useDrop<
    DragItem, 
    { day: Date; hour: number; minute?: number; event: DisplayEvent }, 
    { isOver: boolean; draggedItem: DragItem | null }
  >(() => ({
    accept: DRAG_EVENT_TYPE,
    drop: (item) => {
      // 10分刻みに調整するための時間計算
      const adjustedMinute = Math.round(minute / 10) * 10;
      const adjustedHour = hour + Math.floor(adjustedMinute / 60);
      const finalMinute = adjustedMinute % 60;
      
      return {
        day,
        hour: adjustedHour,
        minute: finalMinute,
        event: item.event,
      };
    },
    collect: (monitor) => {
      const isOver = !!monitor.isOver();
      const draggedItem = monitor.getItem();
      return {
        isOver,
        draggedItem,
      };
    },
  }));

  // ========================================
  // スタイル計算
  // ========================================
  const slotHeight = DRAG_TIME_SLOT_HEIGHT / 2; // 30分あたり32px

  // ========================================
  // 🛠️ 修正版：高さ計算（event.heightを優先）
  // ========================================
  const getDragHeight = () => {
    console.log('🔍 getDragHeight 開始:', {
      draggedItemExists: !!draggedItem,
      slotHeight,
    });

    if (!draggedItem) {
      console.log('🚨 draggedItemがnull/undefined:', { returning: slotHeight });
      return slotHeight;
    }
    
    // DragItemTrackerから取得（現在は0）
    const trackedHeight = getDraggedItemHeight();
    
    // ✅ 修正: event.heightを優先使用
    const eventHeight = draggedItem.event?.height || 0;
    
    console.log('🔍 詳細デバッグ:', {
      'draggedItem.id': draggedItem.id,
      'eventHeight': eventHeight,
      'trackedHeight': trackedHeight,
      'slotHeight': slotHeight,
      '優先順位': 'eventHeight > trackedHeight > slotHeight'
    });
    
    // 優先順位: eventHeight → trackedHeight → slotHeight
    if (eventHeight > 0) {
      console.log('✅ eventHeightを使用:', { value: eventHeight });
      return eventHeight;
    } else if (trackedHeight > 0) {
      console.log('✅ trackedHeightを使用:', { value: trackedHeight });
      return trackedHeight;
    } else {
      console.log('🚨 フォールバック: slotHeightを使用:', { value: slotHeight });
      return slotHeight;
    }
  };

  // ========================================
  // 背景色の計算
  // ========================================
  const getBgColor = () => {
    if (isOver) return "bg-green-100"           // ドロップ可能時は緑
    if (isToday) return "bg-blue-50/30"         // 今日は薄い青
    if (dayIndex === 0) return "bg-red-50/30"   // 日曜日は薄い赤
    if (dayIndex === 6) return "bg-blue-50/30"  // 土曜日は薄い青
    return ""                                   // その他は透明
  }

  // ========================================
  // クリックハンドラー
  // ========================================
  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();    // デフォルトのクリック動作を防ぐ
      e.stopPropagation();   // イベントの伝播を停止
      return;
    }
    onClick(day, hour, minute);
  };

  // DOM参照とドロップ機能を紐付け
  drop(ref);

  // ========================================
  // レンダリング
  // ========================================
  return (
    <div
      ref={ref}
      className={`
        border-r
        ${getBgColor()}
        relative
        ${isDragging ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{
        height: `${slotHeight}px`,
        borderBottom:
          minute === 0
            ? "1px dashed #d1d5db"  // 1時間区切りは点線
            : "1px solid #9ca3af",  // 30分区切りは実線
        opacity: isDragging ? 0.7 : 1,
      }}
      onClick={handleClick}
    >
      {isOver && draggedItem && (
        <div
          className={`
            absolute
            ${DROP_OVERLAY_COLOR}
            pointer-events-none
            z-10
          `}
          style={{
            left: 0,
            right: 0,
            top: `0px`,
            height: `${getDragHeight()}px`,
            opacity: DROP_OVERLAY_OPACITY,
          }}
        />
      )}
    </div>
  )
}

// ========================================
// 📝 現在の状況
// ========================================

/*
✅ ESLintエラー解決済み：
- any型を削除
- require()を削除  
- 未使用変数を削除

🎯 現在の動作：
- 従来の方法（getDraggedItemHeight）を使用
- 安定した動作を優先
- Context APIは後で段階的に追加可能

🔧 次のステップ：
1. まずこのコードでエラーなく動作することを確認
2. DragProviderの設定を確認
3. Context APIを段階的に追加
*/