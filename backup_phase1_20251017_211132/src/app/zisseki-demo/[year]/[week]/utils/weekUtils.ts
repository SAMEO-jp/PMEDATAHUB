/**
 * 週計算のユーティリティ関数
 */

/**
 * 指定された日付の週番号を取得（日曜始まり）
 * @param date 日付
 * @returns 週番号（1-53）
 */
export function getISOWeek(date: Date): number {
  const d = new Date(date.getTime());
  d.setHours(0, 0, 0, 0);
  
  // 指定日付が属する週の日曜日を取得
  const sundayOfWeek = new Date(d.getTime());
  sundayOfWeek.setDate(d.getDate() - d.getDay());
  
  // 年始の日曜日（1月1日を含む週の日曜日）を取得
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const firstSundayOfYear = new Date(yearStart.getTime());
  firstSundayOfYear.setDate(yearStart.getDate() - yearStart.getDay());
  
  // 週番号を計算（1から開始）
  const week = Math.ceil((sundayOfWeek.getTime() - firstSundayOfYear.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
  
  return week;
}

/**
 * 指定された年の週数を取得（日曜始まり）
 * @param year 年
 * @returns その年の週数（52または53）
 */
export function getWeeksInYear(year: number): number {
  const lastDay = new Date(year, 11, 31);
  const lastWeek = getISOWeek(lastDay);
  
  return lastWeek;
}

/**
 * 指定された週の開始日（日曜日）を取得
 * @param year 年
 * @param week 週番号
 * @returns 週の開始日（日曜日）
 */
export function getWeekStartDate(year: number, week: number): Date {
  // 年始の日曜日（1月1日を含む週の日曜日）を取得
  const yearStart = new Date(year, 0, 1);
  const firstSundayOfYear = new Date(yearStart.getTime());
  firstSundayOfYear.setDate(yearStart.getDate() - yearStart.getDay());
  
  // 指定された週の日曜日を計算
  const targetSunday = new Date(firstSundayOfYear.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
  
  return targetSunday;
}

/**
 * 指定された週の日付配列を取得
 * @param year 年
 * @param week 週番号
 * @returns 週の日付配列（日曜日から土曜日）
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
 * 現在の週の年と週番号を取得（日曜始まり）
 * @returns { year: number, week: number }
 */
export function getCurrentWeek(): { year: number; week: number } {
  const now = new Date();
  const year = now.getFullYear();
  const week = getISOWeek(now);
  
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

