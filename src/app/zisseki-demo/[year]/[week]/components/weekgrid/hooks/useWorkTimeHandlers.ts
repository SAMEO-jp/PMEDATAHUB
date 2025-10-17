import { useCallback } from "react"
import { WorkTimeData } from "../../../types"
import { formatDateString } from "../utils"

export const useWorkTimeHandlers = (workTimes: WorkTimeData[]) => {
  // 特定の日の勤務時間データを取得
  const getWorkTimeForDay = useCallback((day: Date): WorkTimeData | undefined => {
    const dateString = formatDateString(day);
    return workTimes.find(wt => wt.date === dateString);
  }, [workTimes]);

  // 勤務時間の変更ハンドラ
  const createTimeChangeHandler = useCallback((
    onWorkTimeChange: (date: string, startTime: string, endTime: string) => void
  ) => {
    return (day: Date, field: 'startTime' | 'endTime', value: string) => {
      const dateString = formatDateString(day);
      const workTime = getWorkTimeForDay(day);
      const startTime = field === 'startTime' ? value : workTime?.startTime || '';
      const endTime = field === 'endTime' ? value : workTime?.endTime || '';
      onWorkTimeChange(dateString, startTime, endTime);
    };
  }, [getWorkTimeForDay]);

  return {
    getWorkTimeForDay,
    createTimeChangeHandler
  };
}; 