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
      const headerHeight = 42;
      const workTimeSectionHeight = 64;
      const timeSlotHeight = 32; // 各30分スロットの高さ（h-8 = 32px）
      const scrollToPosition = headerHeight + workTimeSectionHeight + (8 * timeSlotHeight);
      
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
          
          // より正確な位置を計算
          const headerHeight = 42;
          const workTimeSectionHeight = 64;
          const accurateScrollPosition = headerHeight + workTimeSectionHeight + (8 * actualTimeSlotHeight);
          
          // 位置が大きく異なる場合のみ調整
          if (Math.abs(scrollContainerRef.current.scrollTop - accurateScrollPosition) > 10) {
            scrollContainerRef.current.scrollTop = accurateScrollPosition;
          }
        }
      }, 50);
    }
  }, [year, week]);

  return (
    <div className="h-full bg-gray-50 rounded-lg shadow overflow-hidden">
      {/* 全体を一つのスクロールコンテナにまとめる */}
      <div 
        ref={scrollContainerRef}
        className="overflow-auto h-full"
        style={{ 
          scrollPaddingTop: "9rem",
          scrollBehavior: "auto" // ちらつきを防ぐため即座にスクロール
        }}
      >
        <div className="grid" style={{ gridTemplateColumns: '40px repeat(7, 1fr)' }}>
          {/* ヘッダー部分 */}
          <TimeGridHeader weekDays={weekDays} />

          {/* 勤務時間セクション */}
          <WorkTimeSection 
            weekDays={weekDays}
            workTimes={workTimes}
            onWorkTimeChange={onWorkTimeChange}
          />

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
          />
        </div>
      </div>
    </div>
  );
}; 