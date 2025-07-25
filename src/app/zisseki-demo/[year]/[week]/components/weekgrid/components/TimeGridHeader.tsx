import React from "react"
import { formatDayWithWeekday } from "../../../utils/dateUtils"
import { isToday } from "../utils"

// 曜日の日本語表記
const WEEKDAY_JP = ['日', '月', '火', '水', '木', '金', '土'];

type TimeGridHeaderProps = {
  weekDays: Date[];
}

export const TimeGridHeader = ({ weekDays }: TimeGridHeaderProps) => {
  return (
    <>
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
    </>
  );
}; 