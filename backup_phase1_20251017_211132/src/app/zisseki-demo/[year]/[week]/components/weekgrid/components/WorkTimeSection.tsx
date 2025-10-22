import React from "react"
import { WorkTimeData } from "../../../types"
import { formatDateString, isToday } from "../utils"

// Props型定義 - WorkTimeSectionコンポーネントで受け取るプロパティ
type WorkTimeSectionProps = {
  weekDays: Date[];  // 表示する週の日付配列
  workTimes: WorkTimeData[];  // 勤務時間データの配列
  onWorkTimeChange: (date: string, startTime: string, endTime: string) => void;  // 勤務時間変更時のコールバック関数
}

/**
 * 勤務時間入力セクションコンポーネント
 * 週の各日に対して出勤・退勤時間を入力できる
 */
export const WorkTimeSection = ({ 
  weekDays, 
  workTimes, 
  onWorkTimeChange 
}: WorkTimeSectionProps) => {
  
  /**
   * 特定の日の勤務時間データを取得する関数
   * @param day - 対象の日付
   * @returns その日の勤務時間データ、または undefined
   */
  const getWorkTimeForDay = (day: Date): WorkTimeData | undefined => {
    const dateString = formatDateString(day);
    return workTimes.find(wt => wt.date === dateString);
  };

  /**
   * 勤務時間の変更を処理するハンドラ関数
   * @param day - 変更対象の日付
   * @param field - 変更するフィールド（'startTime' または 'endTime'）
   * @param value - 新しい時間の値
   */
  const handleTimeChange = (day: Date, field: 'startTime' | 'endTime', value: string) => {
    const dateString = formatDateString(day);
    const workTime = getWorkTimeForDay(day);
    
    // 変更するフィールドに応じて開始時間と終了時間を設定
    const startTime = field === 'startTime' ? value : workTime?.startTime || '';
    const endTime = field === 'endTime' ? value : workTime?.endTime || '';
    
    // 親コンポーネントに変更を通知
    onWorkTimeChange(dateString, startTime, endTime);
  };

  return (
    <>
      {/* 出退勤時間表示用の左ラベル */}
      <div className="h-16 border-b border-r border-gray-300 p-1 text-xs bg-gray-50 flex flex-col justify-center w-10">
      </div>

      {/* 各日の出退勤時間表示エリア */}
      {weekDays.map((day, index) => {
        // その日の勤務時間データを取得
        const workTime = getWorkTimeForDay(day);

        // 曜日を取得（0: 日曜日, 1: 月曜日, ..., 6: 土曜日）
        const dayOfWeek = day.getDay();

        // 日付に応じた背景色を設定
        // 今日: 青色、その他: 白色（日曜日・土曜日も平日と同じ色）
        const bgColorClass =
          isToday(day) ? "bg-blue-50" :
          "bg-white";

        return (
          <div
            key={index}
            className={`h-16 border-r border-b border-gray-300 ${bgColorClass}`}
          >
            {/* 出退勤時間入力エリアを削除 */}
          </div>
        );
      })}
    </>
  );
};