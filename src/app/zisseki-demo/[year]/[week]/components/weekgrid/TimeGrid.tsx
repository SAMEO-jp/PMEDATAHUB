"use client"

import React from "react"
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
  onEventClick,
  onTimeSlotClick,
  onWorkTimeChange,
}: TimeGridProps) => {
  // データ管理フック
  const { weekDays, timeSlots, minuteSlots } = useTimeGridData(year, week);
  
  // 勤務時間ハンドラーフック
  const { createTimeChangeHandler } = useWorkTimeHandlers(workTimes);
  const handleTimeChange = createTimeChangeHandler(onWorkTimeChange);

  return (
    <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
      {/* 全体を一つのスクロールコンテナにまとめる */}
      <div 
        className="overflow-auto"
        style={{ height: "calc(100vh - 8rem)", scrollPaddingTop: "9rem" }}
      >
        <div className="grid" style={{ gridTemplateColumns: 'auto repeat(7, 1fr)' }}>
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
            onTimeSlotClick={onTimeSlotClick}
            onEventClick={onEventClick}
          />
        </div>
      </div>
    </div>
  );
}; 