import React from "react"
import { WorkTimeData } from "../../../types"
import { formatDateString, isToday } from "../utils"

type WorkTimeSectionProps = {
  weekDays: Date[];
  workTimes: WorkTimeData[];
  onWorkTimeChange: (date: string, startTime: string, endTime: string) => void;
}

export const WorkTimeSection = ({ 
  weekDays, 
  workTimes, 
  onWorkTimeChange 
}: WorkTimeSectionProps) => {
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

  return (
    <>
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
    </>
  );
}; 