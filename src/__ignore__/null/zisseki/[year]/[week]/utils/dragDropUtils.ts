import { DRAG_TIME_SLOT_HEIGHT } from './dragDropConstants'

// ドラッグ＆ドロップ専用の時間変換関数
export const dragDropTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// ドラッグ＆ドロップ専用の時間を位置（px）に変換する関数
export const dragDropTimeToPosition = (timeStr: string): number => {
  const minutes = dragDropTimeToMinutes(timeStr);
  const hours = minutes / 60;
  return hours * DRAG_TIME_SLOT_HEIGHT;
};

// ドラッグ＆ドロップ専用の位置（px）を時間に変換する関数
export const dragDropPositionToTime = (position: number): string => {
  const hours = position / DRAG_TIME_SLOT_HEIGHT;
  const totalMinutes = Math.round(hours * 60);
  const hoursPart = Math.floor(totalMinutes / 60);
  const minutesPart = totalMinutes % 60;
  return `${String(hoursPart).padStart(2, '0')}:${String(minutesPart).padStart(2, '0')}`;
};

// ドラッグ＆ドロップ専用の時間計算関数
export const dragDropCalculateDuration = (startTime: string, endTime: string): number => {
  const startMinutes = dragDropTimeToMinutes(startTime);
  const endMinutes = dragDropTimeToMinutes(endTime);
  return endMinutes - startMinutes;
};

// ドラッグ＆ドロップ専用の高さ計算関数
export const dragDropCalculateHeight = (startDateTime: string, endDateTime: string): number => {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return durationHours * DRAG_TIME_SLOT_HEIGHT;
};

// ドラッグ＆ドロップ専用の日付文字列フォーマット関数
export const dragDropFormatDateString = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}; 