import React from "react"

type TimeLabelsProps = {
  timeSlots: number[];
}

export const TimeLabels = ({ timeSlots }: TimeLabelsProps) => {
  return (
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
  );
}; 