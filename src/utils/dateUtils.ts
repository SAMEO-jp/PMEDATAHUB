/**
 * 日付関連のユーティリティ関数
 */

/**
 * 指定した日付の年と週番号を取得
 * @param date 日付（省略時は現在の日付）
 * @returns 年と週番号のオブジェクト
 */
export function getYearAndWeek(date: Date = new Date()): { year: number; week: number } {
  // 年の最初の日（1月1日）を取得
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  
  // 年の最初の週の開始日を取得（月曜日を週の開始とする）
  const startOfWeek = new Date(startOfYear);
  const dayOfWeek = startOfYear.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 日曜日は6日前、それ以外は当日からの日数
  startOfWeek.setDate(startOfYear.getDate() - daysToMonday);
  
  // 指定した日付と年の最初の週の開始日との差を計算
  const diffTime = date.getTime() - startOfWeek.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // 週番号を計算（1週間 = 7日）
  const weekNumber = Math.floor(diffDays / 7) + 1;
  
  return {
    year: date.getFullYear(),
    week: Math.max(1, weekNumber) // 最小値を1とする
  };
}

/**
 * 現在の年と週番号を文字列で取得
 * @returns 年と週番号の文字列（例: "2025年 第3週"）
 */
export function getCurrentYearWeekString(): string {
  const { year, week } = getYearAndWeek();
  return `${year}年 第${week}週`;
}

/**
 * 年と週番号から文字列を生成
 * @param year 年
 * @param week 週番号
 * @returns 年と週番号の文字列
 */
export function formatYearWeek(year: number, week: number): string {
  return `${year}年 第${week}週`;
}

/**
 * ISO週番号を取得（ISO 8601標準に準拠）
 * @param date 日付（省略時は現在の日付）
 * @returns ISO週番号オブジェクト
 */
export function getISOYearAndWeek(date: Date = new Date()): { year: number; week: number } {
  const target = new Date(date.valueOf());
  const dayNumber = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNumber + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  const weekNumber = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  
  return {
    year: target.getFullYear(),
    week: weekNumber
  };
}