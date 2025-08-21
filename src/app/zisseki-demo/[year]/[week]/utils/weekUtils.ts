/**
 * 週計算のユーティリティ関数
 */

/**
 * 指定された日付のISO週番号を取得
 * @param date 日付
 * @returns ISO週番号（1-53）
 */
export function getISOWeek(date: Date): number {
  const d = new Date(date.getTime());
  d.setHours(0, 0, 0, 0);
  
  // 木曜日に設定（ISO週の基準）
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  
  // 年の最初の木曜日を取得
  const yearStart = new Date(d.getFullYear(), 0, 1);
  yearStart.setDate(yearStart.getDate() + 3 - (yearStart.getDay() + 6) % 7);
  
  // 週番号を計算
  let week = Math.ceil((d.getTime() - yearStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
  
  // 0以下の場合は1に修正
  if (week <= 0) {
    week = 1;
  }
  
  return week;
}

/**
 * 指定された年の週数を取得
 * @param year 年
 * @returns その年の週数（52または53）
 */
export function getWeeksInYear(year: number): number {
  const lastDay = new Date(year, 11, 31);
  const lastWeek = getISOWeek(lastDay);
  
  // 年末が年始の週に含まれる場合
  if (lastWeek === 1) {
    return getISOWeek(new Date(year, 11, 31 - 7));
  }
  
  return lastWeek;
}

/**
 * 指定された週の開始日（月曜日）を取得
 * @param year 年
 * @param week 週番号
 * @returns 週の開始日
 */
export function getWeekStartDate(year: number, week: number): Date {
  // 年の最初の木曜日を取得
  const yearStart = new Date(year, 0, 1);
  yearStart.setDate(yearStart.getDate() + 3 - (yearStart.getDay() + 6) % 7);
  
  // 指定された週の木曜日を計算
  const targetThursday = new Date(yearStart.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
  
  // 月曜日を取得（木曜日から3日前）
  const monday = new Date(targetThursday.getTime() - 3 * 24 * 60 * 60 * 1000);
  
  return monday;
}

/**
 * 指定された週の日付配列を取得
 * @param year 年
 * @param week 週番号
 * @returns 週の日付配列（月曜日から日曜日）
 */
export function getWeekDays(year: number, week: number): Date[] {
  const startDate = getWeekStartDate(year, week);
  const days: Date[] = [];
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    days.push(day);
  }
  
  return days;
}

/**
 * 前週の年と週番号を取得
 * @param year 現在の年
 * @param week 現在の週
 * @returns { year: number, week: number }
 */
export function getPreviousWeek(year: number, week: number): { year: number; week: number } {
  if (week > 1) {
    return { year, week: week - 1 };
  } else {
    const prevYear = year - 1;
    const prevWeeks = getWeeksInYear(prevYear);
    return { year: prevYear, week: prevWeeks };
  }
}

/**
 * 次週の年と週番号を取得
 * @param year 現在の年
 * @param week 現在の週
 * @returns { year: number, week: number }
 */
export function getNextWeek(year: number, week: number): { year: number; week: number } {
  const currentWeeks = getWeeksInYear(year);
  
  if (week < currentWeeks) {
    return { year, week: week + 1 };
  } else {
    return { year: year + 1, week: 1 };
  }
}

/**
 * 現在の週の年と週番号を取得
 * @returns { year: number, week: number }
 */
export function getCurrentWeek(): { year: number; week: number } {
  const now = new Date();
  const year = now.getFullYear();
  let week = getISOWeek(now);
  
  // 0以下の場合は1に修正
  if (week <= 0) {
    week = 1;
  }
  
  return { year, week };
}

/**
 * 週番号が有効かチェック
 * @param year 年
 * @param week 週番号
 * @returns 有効な週番号かどうか
 */
export function isValidWeek(year: number, week: number): boolean {
  if (week < 1 || week > 53) return false;
  
  const maxWeeks = getWeeksInYear(year);
  return week <= maxWeeks;
}

