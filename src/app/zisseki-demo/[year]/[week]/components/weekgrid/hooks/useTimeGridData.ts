import { useMemo } from "react"
import { getWeekDates, getWeekDaysArray } from "../utils"

export const useTimeGridData = (year: number, week: number) => {
  const { startDate, endDate } = useMemo(() => getWeekDates(year, week), [year, week]);
  const weekDays = useMemo(() => getWeekDaysArray(startDate, endDate), [startDate, endDate]);
  const timeSlots = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minuteSlots = useMemo(() => [0, 30], []);

  return {
    weekDays,
    timeSlots,
    minuteSlots,
    startDate,
    endDate
  };
}; 