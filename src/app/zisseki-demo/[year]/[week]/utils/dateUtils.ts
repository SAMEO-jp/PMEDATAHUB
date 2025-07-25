// 日付フォーマット関数
export function formatDayWithWeekday(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
}

// 週の日付を取得する関数
export function getWeekDates(year: number, week: number) {
  const startDate = new Date(year, 0, 1);
  const weekStart = new Date(startDate.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
  const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
  return { startDate: weekStart, endDate: weekEnd };
}

// 週の日付配列を取得する関数
export function getWeekDaysArray(startDate: Date, endDate: Date) {
  const days = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return days;
} 