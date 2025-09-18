import { useMemo } from "react"
import { getWeekDates, getWeekDaysArray } from "../utils"

export const useTimeGridData = (year: number, week: number) => {
  const { startDate, endDate } = useMemo(() => getWeekDates(year, week), [year, week]);
  const weekDays = useMemo(() => getWeekDaysArray(startDate, endDate), [startDate, endDate]);
  
  // 8時開始の時間スロットを生成（8時前も含む）
  const timeSlots = useMemo(() => {
    const slots = [];
    // 8時前の時間（0時から7時まで）
    for (let i = 0; i < 8; i++) {
      slots.push(i);
    }
    // 8時以降の時間（8時から23時まで）
    for (let i = 8; i < 24; i++) {
      slots.push(i);
    }
    return slots;
  }, []);
  
  const minuteSlots = useMemo(() => [0, 30], []);

  return {
    weekDays,
    timeSlots,
    minuteSlots,
    startDate,
    endDate
  };
}; 