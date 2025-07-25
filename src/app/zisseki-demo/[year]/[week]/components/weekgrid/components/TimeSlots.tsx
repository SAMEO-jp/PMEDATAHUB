import React from "react"
import { WorkTimeData, TimeGridEvent } from "../../../types"
import { formatDateString, timeToPosition } from "../utils"

type TimeSlotsProps = {
  weekDays: Date[];
  timeSlots: number[];
  minuteSlots: number[];
  workTimes: WorkTimeData[];
  events: TimeGridEvent[];
  onTimeSlotClick: (day: Date, hour: number, minute: number) => void;
  onEventClick: (event: TimeGridEvent) => void;
}

export const TimeSlots = ({ 
  weekDays, 
  timeSlots, 
  minuteSlots, 
  workTimes, 
  events,
  onTimeSlotClick,
  onEventClick
}: TimeSlotsProps) => {
  // 特定の日の勤務時間データを取得
  const getWorkTimeForDay = (day: Date): WorkTimeData | undefined => {
    const dateString = formatDateString(day);
    return workTimes.find(wt => wt.date === dateString);
  };

  return (
    <>
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
                <div
                  key={`${hour}-${minute}`}
                  className="h-8 border-b border-r border-gray-100 hover:bg-blue-50 cursor-pointer"
                  onClick={() => onTimeSlotClick(day, hour, minute)}
                />
              ))}
            </React.Fragment>
          ))}

          {/* イベントを表示 */}
          {events
            .filter((event: TimeGridEvent) => {
              const eventDate = new Date(event.startDateTime)
              return (
                eventDate.getDate() === day.getDate() &&
                eventDate.getMonth() === day.getMonth() &&
                eventDate.getFullYear() === day.getFullYear()
              )
            })
            .map((event: TimeGridEvent) => (
              <div
                key={event.id}
                className={`absolute overflow-hidden text-xs border border-gray-300 ${
                  event.unsaved ? "border-yellow-400" : "border-gray-300"
                } shadow-md rounded-md cursor-pointer`}
                style={{
                  top: `${event.top}px`,
                  height: `${event.height}px`,
                  left: "4px",
                  right: "4px",
                  backgroundColor: event.color,
                  color: "white"
                }}
                onClick={() => onEventClick(event)}
              >
                <div className="p-1 h-full flex flex-col">
                  <div className="font-semibold truncate">{event.title}</div>
                  <div className="text-xs opacity-90 truncate">{event.description}</div>
                </div>
              </div>
            ))}
        </div>
        );
      })}
    </>
  );
}; 