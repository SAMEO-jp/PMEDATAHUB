// 週の日付を計算
export const getWeekDates = (year: number, week: number) => {
  const startDate = new Date(year, 0, 1);
  const weekStart = new Date(startDate.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
  const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
  return { startDate: weekStart, endDate: weekEnd };
};

export const getWeekDaysArray = (startDate: Date, endDate: Date) => {
  const days = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return days;
};

// 日付文字列のフォーマット関数
export const formatDateString = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 時間文字列（HH:MM）を分数に変換する関数
export const timeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// 時間を位置（px）に変換する関数
export const timeToPosition = (timeStr: string): number => {
  const minutes = timeToMinutes(timeStr);
  const hours = minutes / 60;
  // 1時間 = 64px
  return hours * 64;
};

// 今日かどうかを判定する関数
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// 日付フォーマット関数（月/日形式）
export const formatDayWithWeekday = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
}; 