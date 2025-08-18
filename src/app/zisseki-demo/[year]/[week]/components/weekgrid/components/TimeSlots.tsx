import React from "react"
import { WorkTimeData, TimeGridEvent } from "../../../types"
import { EventDisplay } from "./EventDisplay"
import { formatDateString, timeToPosition } from "../utils"

// Props型定義 - TimeSlotsコンポーネントで受け取るプロパティ
type TimeSlotsProps = {
  weekDays: Date[];  // 表示する週の日付配列
  timeSlots: number[];  // 時間スロット配列（時間単位）
  minuteSlots: number[];  // 分スロット配列（分単位、通常は[0, 30]で30分刻み）
  workTimes: WorkTimeData[];  // 勤務時間データの配列
  events: TimeGridEvent[];  // イベントデータの配列
  selectedEvent: TimeGridEvent | null;  // 選択されたイベント
  onTimeSlotClick: (day: Date, hour: number, minute: number) => void;  // タイムスロットクリック時のコールバック
  onEventClick: (event: TimeGridEvent) => void;  // イベントクリック時のコールバック
}

/**
 * タイムスロット表示コンポーネント
 * 週の各日に対してタイムスロットと勤務時間範囲、イベントを表示する
 */
export const TimeSlots = ({ 
  weekDays, 
  timeSlots, 
  minuteSlots, 
  workTimes, 
  events,
  selectedEvent,
  onTimeSlotClick,
  onEventClick
}: TimeSlotsProps) => {
  
  /**
   * 特定の日の勤務時間データを取得する関数
   * @param day - 対象の日付
   * @returns その日の勤務時間データ、または undefined
   */
  const getWorkTimeForDay = (day: Date): WorkTimeData | undefined => {
    const dateString = formatDateString(day);
    return workTimes.find(wt => wt.date === dateString);
  };

  return (
    <>
      {/* 週の各日に対してタイムスロットを生成 */}
      {weekDays.map((day, dayIndex) => {
        // その日の勤務時間データを取得
        const workTime = getWorkTimeForDay(day);
        
        // 勤務開始時間と終了時間をピクセル位置に変換
        const startTimePosition = workTime?.startTime ? timeToPosition(workTime.startTime) : 0;
        const endTimePosition = workTime?.endTime ? timeToPosition(workTime.endTime) : 0;
        
        // 勤務時間が設定されているかチェック
        const hasWorkTime = workTime?.startTime && workTime?.endTime;
        
        return (
        <div key={dayIndex} className="col-span-1 relative">
          {/* 出勤時間から退勤時間までの範囲を示す背景 */}
          {hasWorkTime && (
            <div 
              className="absolute left-0 right-0 z-0 bg-gray-200/80 border-y border-dashed border-gray-400"
              style={{ 
                top: `${startTimePosition}px`,  // 勤務開始位置
                height: `${endTimePosition - startTimePosition}px`  // 勤務時間の高さ
              }}
            />
          )}

          {/* 時間スロットの生成（1時間ごと） */}
          {timeSlots.map((hour) => (
            <React.Fragment key={hour}>
              {/* 分刻みのスロット（通常は30分刻み：0分と30分） */}
              {minuteSlots.map((minute) => (
                <div
                  key={`${hour}-${minute}`}
                  className="h-8 border-b border-r border-gray-100 hover:bg-blue-50 cursor-pointer"
                  onClick={() => onTimeSlotClick(day, hour, minute)}
                />
              ))}
            </React.Fragment>
          ))}

          {/* その日のイベントを表示 */}
          {events
            // その日のイベントのみをフィルタリング
            .filter((event: TimeGridEvent) => {
              const eventDate = new Date(event.startDateTime)
              return (
                eventDate.getDate() === day.getDate() &&
                eventDate.getMonth() === day.getMonth() &&
                eventDate.getFullYear() === day.getFullYear()
              )
            })
            // フィルタリングされたイベントをレンダリング
            .map((event: TimeGridEvent) => {
              console.log('TimeSlots - イベントをレンダリング:', event);
              return (
                <EventDisplay
                  key={event.id}
                  event={event}
                  selectedEvent={selectedEvent}
                  onClick={onEventClick}
                />
              );
            })}
        </div>
        );
      })}
    </>
  );
};