import { useParams } from "next/navigation";

/**
 * 週番号を計算するユーティリティ関数
 * 指定された日付が年始から何週目かを計算
 * @param date - 計算対象の日付
 * @returns 週番号（1から始まる）
 */
function getWeek(date: Date): number {
  // 年始の日付を取得
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  // 年始からの経過日数を計算
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  // 週番号を計算（年始の曜日を考慮）
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * URLパラメータから年と週を取得するフック
 * パラメータが無効な場合は現在の日付から計算
 */
export const useUrlParams = () => {
  const params = useParams();
  
  // URLパラメータから年と週を取得
  const year = Number.parseInt(params.year as string) || new Date().getFullYear();
  const week = Number.parseInt(params.week as string) || getWeek(new Date());

  return { year, week };
}; 