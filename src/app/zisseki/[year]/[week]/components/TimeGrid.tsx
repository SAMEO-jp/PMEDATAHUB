"use client"

import React from 'react';
import { DroppableTimeSlot } from "./DroppableTimeSlot"
import DraggableEvent from "./DraggableEvent"
import { formatDayWithWeekday } from "../utils/dateUtils"
import { TimeGridProps, WorkTimeData } from "../types/timeGrid"

// 曜日の日本語表記
const WEEKDAY_JP = ['日', '月', '火', '水', '木', '金', '土'];

const TimeGrid = ({
  weekDays,
  timeSlots,
  minuteSlots,
  isToday,
  events,
  onEventClick,
  onTimeSlotClick,
  onResizeStart,
  workTimes = [], // デフォルト空配列
  onWorkTimeChange = () => {}, // デフォルト空関数
  onCopyEvent,
  onDeleteEvent,
  onDragStart,
  onDragEnd,
}: TimeGridProps) => {
  // 日付文字列のフォーマット関数
  const formatDateString = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 特定の日の勤務時間データを取得
  const getWorkTimeForDay = (day: Date): WorkTimeData | undefined => {
    const dateString = formatDateString(day);
    return workTimes.find(wt => wt.date === dateString);
  };

  // 勤務時間の変更ハンドラ
  const handleTimeChange = (day: Date, field: 'startTime' | 'endTime', value: string) => {
    const dateString = formatDateString(day);
    const workTime = getWorkTimeForDay(day);
    const startTime = field === 'startTime' ? value : workTime?.startTime || '';
    const endTime = field === 'endTime' ? value : workTime?.endTime || '';
    onWorkTimeChange(dateString, startTime, endTime);
  };

  // 時間文字列（HH:MM）を分数に変換する関数
  const timeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // 時間を位置（px）に変換する関数
  const timeToPosition = (timeStr: string): number => {
    const minutes = timeToMinutes(timeStr);
    const hours = minutes / 60;
    // 1時間 = 64px
    return hours * 64;
  };

  return (
    <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
      {/* 全体を一つのスクロールコンテナにまとめる */}
      <div 
        className="overflow-auto"
        style={{ height: "calc(100vh - 8rem)", scrollPaddingTop: "9rem" }}
      >
        <div className="grid" style={{ gridTemplateColumns: 'auto repeat(7, 1fr)' }}>
          {/* 時間ラベルのヘッダー（左上の空白セル） */}
          <div className="sticky top-0 left-0 z-20 p-1 border-r border-b bg-gray-50 w-10"></div>
          
          {/* 日付ヘッダー - stickyで上部に固定 */}
          {weekDays.map((day, index) => {
            const dayOfWeek = day.getDay();
            const bgColorClass = 
              isToday(day) ? "bg-blue-100" : 
              dayOfWeek === 0 ? "bg-red-100" : 
              dayOfWeek === 6 ? "bg-blue-100" : 
              "bg-gray-50";
              
            return (
              <div
                key={index}
                className={`sticky top-0 z-10 p-1 text-center border-r border-b ${bgColorClass}`}
                style={{ height: "42px" }}
              >
                <div className="font-medium text-xs flex flex-col justify-center">
                  <span className="font-bold">{WEEKDAY_JP[dayOfWeek]}</span>
                  <span>{formatDayWithWeekday(day)}</span>
                </div>
              </div>
            );
          })}

          {/* 右側のWeekSidebar用のヘッダー */}
          {/* <div className="sticky top-0 right-0 z-20 p-1 border-l border-b bg-gray-50 w-64"></div> */}

          {/* 出退勤時間表示用の左ラベル - stickyで左側と上部に固定 */}
          <div className="sticky left-0 top-[42px] z-20 h-16 border-b border-r p-1 text-xs bg-gray-50 flex flex-col justify-center w-10">
            <div className="text-center">勤務</div>
            <div className="text-center">時間</div>
          </div>

          {/* 各日の出退勤時間表示エリア */}
          {weekDays.map((day, index) => {
            const workTime = getWorkTimeForDay(day);
            const dayOfWeek = day.getDay();
            const bgColorClass = 
              isToday(day) ? "bg-blue-50" : 
              dayOfWeek === 0 ? "bg-red-50" : 
              dayOfWeek === 6 ? "bg-blue-50" : 
              "bg-white";
              
            return (
              <div
                key={index}
                className={`sticky top-[42px] z-10 h-16 border-r border-b ${bgColorClass}`}
              >
                <div className="h-full flex flex-col justify-center p-1 gap-1">
                  <div className="flex items-center justify-center">
                    <span className="text-xs mr-1 font-semibold">出勤:</span>
                    <input 
                      type="time" 
                      className="text-xs p-0.5 w-16 border bg-white/90 rounded shadow-sm" 
                      value={workTime?.startTime || ""}
                      onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-xs mr-1 font-semibold">退勤:</span>
                    <input 
                      type="time" 
                      className="text-xs p-0.5 w-16 border bg-white/90 rounded shadow-sm" 
                      value={workTime?.endTime || ""}
                      onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            );
          })}


          {/* 時間ラベル - stickyで左側に固定 */}
          <div className="col-span-1 sticky left-0 z-10">
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-16 border-b border-r p-1 text-xs text-right pr-2 bg-gray-50 flex flex-col justify-center w-10"
              >
                <div>{hour}時</div>
                <div className="relative h-full">
                  {/* 30分の目盛りのみ表示 */}
                  <div className="absolute w-full border-t border-gray-100" style={{ top: `50%` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* 各日の時間スロット */}
          {weekDays.map((day, dayIndex) => {
            const workTime = getWorkTimeForDay(day);
            const startTimePosition = workTime?.startTime ? timeToPosition(workTime.startTime) : 0;
            const endTimePosition = workTime?.endTime ? timeToPosition(workTime.endTime) : 0;
            const hasWorkTime = workTime?.startTime && workTime?.endTime;
            
            return (
              <div key={dayIndex} className="col-span-1 relative">
                {/* 出勤時間から退勤時間までの範囲を示す背景 */}
                {hasWorkTime && (
                  <div 
                    className="absolute left-0 right-0 z-0 bg-gray-200/80 border-y border-dashed border-gray-400"
                    style={{ 
                      top: `${startTimePosition}px`, 
                      height: `${endTimePosition - startTimePosition}px` 
                    }}
                  />
                )}

                {timeSlots.map((hour) => (
                  <React.Fragment key={hour}>
                    {/* 30分刻みのスロット */}
                    {minuteSlots.map((minute) => (
                      <DroppableTimeSlot
                        key={`${hour}-${minute}`}
                        day={day}
                        hour={hour}
                        minute={minute}
                        isToday={isToday(day)}
                        dayIndex={dayIndex}
                        onClick={onTimeSlotClick}
                      />
                    ))}
                  </React.Fragment>
                ))}

                {/* イベントを表示 */}
                {events
                  .filter((event) => {
                    const eventDate = new Date(event.startDateTime)
                    return (
                      eventDate.getDate() === day.getDate() &&
                      eventDate.getMonth() === day.getMonth() &&
                      eventDate.getFullYear() === day.getFullYear()
                    )
                  })
                  .map((event) => {
                    // topとheightを計算
                    const start = new Date(event.startDateTime)
                    const end = new Date(event.endDateTime)
                    const top = ((start.getHours() * 60 + start.getMinutes()) / 60) * 64
                    const height = ((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 64
                    return (
                      <DraggableEvent
                        key={event.key_id}
                        event={{ ...event, top, height }}
                        onClick={onEventClick}
                        onResizeStart={onResizeStart}
                        onCopy={onCopyEvent}
                        onDelete={onDeleteEvent}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                      />
                    )
                  })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default TimeGrid;
