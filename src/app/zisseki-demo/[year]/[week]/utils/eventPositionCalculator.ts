/**
 * イベント日時計算ユーティリティ
 * startDateTime/endDateTimeとtop/heightの相互変換
 */

// TimeGridのutils.tsと同じ計算ロジック
const HOUR_HEIGHT = 64; // 1時間 = 64px

/**
 * startDateTime/endDateTimeからtop/heightを計算
 */
export const calculateEventPosition = (startDateTime: string, endDateTime: string): { top: number; height: number } => {
  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);
  
  const startHours = startDate.getHours() + startDate.getMinutes() / 60;
  const endHours = endDate.getHours() + endDate.getMinutes() / 60;
  
  const startPosition = startHours * HOUR_HEIGHT;
  const endPosition = endHours * HOUR_HEIGHT;
  
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