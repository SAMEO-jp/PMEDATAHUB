/**
 * イベント位置計算ユーティリティ
 * startDateTime/endDateTimeからtop/heightを自動計算
 */

// TimeGridのutils.tsと同じ計算ロジック
const HOUR_HEIGHT = 64; // 1時間 = 64px

/**
 * 時間文字列（HH:MM）を分数に変換
 */
export const timeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * 時間文字列を位置（px）に変換
 */
export const timeToPosition = (timeStr: string): number => {
  const minutes = timeToMinutes(timeStr);
  const hours = minutes / 60;
  return hours * HOUR_HEIGHT;
};

/**
 * DateTimeからHH:MM形式の時間文字列を取得
 */
export const dateTimeToTimeString = (dateTime: string): string => {
  const date = new Date(dateTime);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * startDateTime/endDateTimeからtop/heightを計算
 */
export const calculateEventPosition = (startDateTime: string, endDateTime: string): { top: number; height: number } => {
  const startTimeStr = dateTimeToTimeString(startDateTime);
  const endTimeStr = dateTimeToTimeString(endDateTime);
  
  const startPosition = timeToPosition(startTimeStr);
  const endPosition = timeToPosition(endTimeStr);
  
  return {
    top: startPosition,
    height: Math.max(endPosition - startPosition, HOUR_HEIGHT / 6) // 最小10分
  };
};

/**
 * top/heightからstartDateTime/endDateTimeを計算（逆変換）
 */
export const calculateEventDateTime = (
  originalStartDateTime: string,
  top: number,
  height: number
): { startDateTime: string; endDateTime: string } => {
  const originalDate = new Date(originalStartDateTime);
  
  // topから開始時間を計算
  const startMinutes = Math.round((top / HOUR_HEIGHT) * 60);
  const startHours = Math.floor(startMinutes / 60);
  const startMins = startMinutes % 60;
  
  // heightから終了時間を計算
  const endMinutes = startMinutes + Math.round((height / HOUR_HEIGHT) * 60);
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  
  // 新しい日付オブジェクトを作成
  const startDate = new Date(originalDate);
  startDate.setHours(startHours, startMins, 0, 0);
  
  const endDate = new Date(originalDate);
  endDate.setHours(endHours, endMins, 0, 0);
  
  // 終了時間が翌日になった場合の処理
  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }
  
  return {
    startDateTime: startDate.toISOString(),
    endDateTime: endDate.toISOString()
  };
};