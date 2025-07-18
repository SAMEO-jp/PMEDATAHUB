import { RESIZE_TIME_SLOT_HEIGHT, RESIZE_SNAP_MINUTES } from './resizeConstants'

// リサイズ専用の時間変換関数
export const resizeTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// リサイズ専用の時間を位置（px）に変換する関数
export const resizeTimeToPosition = (timeStr: string): number => {
  const minutes = resizeTimeToMinutes(timeStr);
  const hours = minutes / 60;
  return hours * RESIZE_TIME_SLOT_HEIGHT;
};

// リサイズ専用の位置（px）を時間に変換する関数
export const resizePositionToTime = (position: number): string => {
  const hours = position / RESIZE_TIME_SLOT_HEIGHT;
  const totalMinutes = Math.round(hours * 60);
  const snappedMinutes = Math.round(totalMinutes / RESIZE_SNAP_MINUTES) * RESIZE_SNAP_MINUTES;
  const hoursPart = Math.floor(snappedMinutes / 60);
  const minutesPart = snappedMinutes % 60;
  return `${String(hoursPart).padStart(2, '0')}:${String(minutesPart).padStart(2, '0')}`;
};

// リサイズ専用の時間計算関数
export const resizeCalculateDuration = (startTime: string, endTime: string): number => {
  const startMinutes = resizeTimeToMinutes(startTime);
  const endMinutes = resizeTimeToMinutes(endTime);
  return endMinutes - startMinutes;
};

// リサイズ専用の高さ計算関数
export const resizeCalculateHeight = (startDateTime: string, endDateTime: string): number => {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return durationHours * RESIZE_TIME_SLOT_HEIGHT;
}; 