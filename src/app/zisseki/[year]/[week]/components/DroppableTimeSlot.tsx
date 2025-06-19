"use client"

import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { TIME_SLOT_HEIGHT } from "../utils/dateUtils"
import { DroppableTimeSlotProps } from "../types/droppable"
import { DisplayEvent } from '../types/event';

interface DragItem {
  id: string;
  event: DisplayEvent;
}

export const DroppableTimeSlot = ({ day, hour, minute, isToday, dayIndex, onClick }: DroppableTimeSlotProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver, draggedItem }, drop] = useDrop<DragItem, { day: Date; hour: number; minute?: number; event: DisplayEvent }, { isOver: boolean; draggedItem: DragItem | null }>(() => ({
    accept: 'EVENT',
    drop: (item) => {
      console.log('Drop Item:', item); // デバッグログ
      console.log('Drop Location:', { day, hour, minute }); // デバッグログ
      return {
        day,
        hour,
        minute,
        event: item.event,
      };
    },
    collect: (monitor) => {
      const isOver = !!monitor.isOver();
      const draggedItem = monitor.getItem();
      console.log('Collect Monitor:', { isOver, draggedItem }); // デバッグログ
      return {
        isOver,
        draggedItem,
      };
    },
  }));

  // 30分刻みの高さを計算（1時間 = 64px）
  const slotHeight = TIME_SLOT_HEIGHT / 2 // 30分あたり32px

  // ドラッグ中のイベントの高さを計算（10分単位）
  const getDragHeight = () => {
    console.log('Dragged Item:', draggedItem); // デバッグログ
    if (!draggedItem) return slotHeight;
    console.log('Event Height:', draggedItem.event.height); // デバッグログ
    return draggedItem.event.height;
  };

  // 背景色の設定
  const getBgColor = () => {
    console.log('Is Over:', isOver); // デバッグログ
    if (isOver) return "bg-green-100"
    if (isToday) return "bg-blue-50/30"
    if (dayIndex === 0) return "bg-red-50/30"
    if (dayIndex === 6) return "bg-blue-50/30"
    return ""
  }

  // refを設定
  drop(ref);

  return (
    <div
      ref={ref}
      className={`border-r ${getBgColor()} relative`}
      style={{
        height: `${slotHeight}px`,
        borderBottom:
          minute === 0
            ? "1px dashed #d1d5db" // 1時間区切りは点線（薄めのグレー#d1d5db）
            : "1px solid #9ca3af", // 30分区切りは実線（濃いめのグレー#9ca3af）
      }}
      onClick={() => onClick(day, hour, minute)}
    >
      {isOver && draggedItem && (
        <div
          className="absolute bg-green-200 opacity-50 pointer-events-none z-10"
          style={{
            left: 0,
            right: 0,
            top: `0px`,
            height: `${getDragHeight()}px`,
          }}
        />
      )}
    </div>
  )
}
