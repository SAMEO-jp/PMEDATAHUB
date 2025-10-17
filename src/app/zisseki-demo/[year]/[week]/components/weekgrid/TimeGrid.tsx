"use client"

import React, { useEffect, useLayoutEffect, useRef } from "react"
import { TimeGridProps } from "../../types"
import { useTimeGridData } from "./hooks/useTimeGridData"
import { useWorkTimeHandlers } from "./hooks/useWorkTimeHandlers"
import { TimeGridHeader } from "./components/TimeGridHeader"
import { WorkTimeSection } from "./components/WorkTimeSection"
import { TimeLabels } from "./components/TimeLabels"
import { TimeSlots } from "./components/TimeSlots"

export const TimeGrid = ({
  year,
  week,
  events,
  workTimes,
  selectedEvent,
  onEventClick,
  onTimeSlotClick,
  onWorkTimeChange,
}: TimeGridProps) => {

  // タスクドロップハンドラー
  const handleTaskDrop = (day: Date, hour: number, minute: number, taskData: any) => {
    console.log('タスクがドロップされました:', { day, hour, minute, taskData });
    
    // タスクデータからイベントを作成
    const newEvent = {
      id: `task-${taskData.id}-${Date.now()}`,
      title: taskData.title,
      description: taskData.description || '',
      startTime: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      endTime: taskData.estimatedTime 
        ? `${(hour + Math.floor((minute + taskData.estimatedTime) / 60)).toString().padStart(2, '0')}:${((minute + taskData.estimatedTime) % 60).toString().padStart(2, '0')}`
        : `${(hour + 1).toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      date: day.toISOString().split('T')[0],
      category: taskData.category,
      priority: taskData.priority,
    };
    
    // イベント作成をトリガー（実際の実装では適切なイベントハンドラーを呼び出す）
    if (onTimeSlotClick) {
      onTimeSlotClick(day, hour, minute);
    }
    
    // TODO: 実際のイベント作成処理を実装
    console.log('新しいイベント:', newEvent);
  };
  // データ管理フック
  const { weekDays, timeSlots, minuteSlots } = useTimeGridData(year, week);
  
  // 勤務時間ハンドラーフック
  const { createTimeChangeHandler } = useWorkTimeHandlers(workTimes);
  const handleTimeChange = createTimeChangeHandler(onWorkTimeChange);

  // スクロールコンテナの参照
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 8時の位置にスクロールする（ちらつきを防ぐためuseLayoutEffectを使用）
  useLayoutEffect(() => {
    if (scrollContainerRef.current) {
      // 即座にスクロール位置を設定（ちらつきを防ぐ）
      const timeSlotHeight = 32; // 各30分スロットの高さ（h-8 = 32px）
      const scrollToPosition = 8 * 2 * timeSlotHeight; // 8時 = 8時間 × 2スロット（30分刻み）× 32px
      
      // 即座にスクロール位置を設定
      scrollContainerRef.current.scrollTop = scrollToPosition;
    }
  }, [year, week]);

  // より正確な位置に調整するため、少し遅延して再計算
  useEffect(() => {
    if (scrollContainerRef.current) {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          // 実際のDOM要素の高さを測定
          const timeSlotElements = scrollContainerRef.current.querySelectorAll('[class*="h-8"]');
          const actualTimeSlotHeight = timeSlotElements.length > 0 ? timeSlotElements[0].getBoundingClientRect().height : 32;
          
          // より正確な位置を計算（8時の位置）
          const accurateScrollPosition = 8 * 2 * actualTimeSlotHeight; // 8時 = 8時間 × 2スロット（30分刻み）× 実際の高さ
          
          // 位置が大きく異なる場合のみ調整
          if (Math.abs(scrollContainerRef.current.scrollTop - accurateScrollPosition) > 10) {
            scrollContainerRef.current.scrollTop = accurateScrollPosition;
          }
        }
      }, 50);
    }
  }, [year, week]);

  return (
    <div className="h-full bg-gray-50 shadow overflow-hidden flex flex-col">
      {/* 上部固定エリア: ヘッダー + 勤務時間セクション */}
      <div className="flex-shrink-0">
        <div className="grid" style={{ gridTemplateColumns: '40px repeat(7, 1fr)' }}>
          {/* ヘッダー部分 */}
          <TimeGridHeader weekDays={weekDays} />

          {/* 勤務時間セクション */}
          <WorkTimeSection 
            weekDays={weekDays}
            workTimes={workTimes}
            onWorkTimeChange={onWorkTimeChange}
          />
        </div>
      </div>

      {/* 下部スクロールエリア: 時間ラベル + タイムスロット */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto hide-scrollbar"
        style={{
          scrollBehavior: "auto" // ちらつきを防ぐため即座にスクロール
        }}
      >
        <div className="grid" style={{ gridTemplateColumns: '40px repeat(7, 1fr)' }}>
          {/* 時間ラベル */}
          <TimeLabels timeSlots={timeSlots} />

          {/* 時間スロットとイベント表示 */}
          <TimeSlots 
            weekDays={weekDays}
            timeSlots={timeSlots}
            minuteSlots={minuteSlots}
            workTimes={workTimes}
            events={events}
            selectedEvent={selectedEvent}
            onTimeSlotClick={onTimeSlotClick}
            onEventClick={onEventClick}
            onTaskDrop={handleTaskDrop}
          />
        </div>
      </div>
    </div>
  );
}; 