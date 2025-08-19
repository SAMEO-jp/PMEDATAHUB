"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { formatDayWithWeekday } from "../utils"
import { isToday } from "../utils"
import { getPreviousWeek, getNextWeek, getCurrentWeek } from "../../../utils/weekUtils"

// 曜日の日本語表記配列（0:日曜日 ～ 6:土曜日）
const WEEKDAY_JP = ['日', '月', '火', '水', '木', '金', '土'];

// Props型定義 - TimeGridHeaderコンポーネントで受け取るプロパティ
type TimeGridHeaderProps = {
  weekDays: Date[];  // 表示する週の日付配列
  year: number;      // 現在の年
  week: number;      // 現在の週
}

/**
 * 週移動のナビゲーションコンポーネント
 */
const WeekNavigation = ({ year, week }: { year: number; week: number }) => {
  const router = useRouter();

  const navigateToWeek = (targetYear: number, targetWeek: number) => {
    router.push(`/zisseki-demo/${targetYear}/${targetWeek}`);
  };

  const goToPreviousWeek = () => {
    const { year: prevYear, week: prevWeek } = getPreviousWeek(year, week);
    navigateToWeek(prevYear, prevWeek);
  };

  const goToNextWeek = () => {
    const { year: nextYear, week: nextWeek } = getNextWeek(year, week);
    navigateToWeek(nextYear, nextWeek);
  };

  const goToCurrentWeek = () => {
    const { year: currentYear, week: currentWeek } = getCurrentWeek();
    navigateToWeek(currentYear, currentWeek);
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 border-b">
      <div className="flex items-center space-x-2">
        <button
          onClick={goToPreviousWeek}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ← 前週
        </button>
        <button
          onClick={goToNextWeek}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          次週 →
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">
          {year}年第{week}週
        </span>
        <button
          onClick={goToCurrentWeek}
          className="px-3 py-1 text-sm bg-blue-500 text-white border border-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          今週
        </button>
      </div>
    </div>
  );
};

/**
 * タイムグリッドヘッダーコンポーネント
 * 週の各日付と曜日を表示するヘッダー部分
 * 左上の空白セルと各日の日付・曜日情報を横並びで表示する
 */
export const TimeGridHeader = ({ weekDays, year, week }: TimeGridHeaderProps) => {
  return (
    <>
      {/* 週移動ナビゲーション */}
      <div className="col-span-8">
        <WeekNavigation year={year} week={week} />
      </div>
      
      {/* 時間ラベルのヘッダー（左上の空白セル） */}
      {/* タイムグリッドの左上角に配置される空白エリア - 時間ラベル列のヘッダー部分 */}
      <div className="sticky top-0 left-0 z-20 p-1 border-r border-b bg-gray-50 w-10"></div>
      
      {/* 日付ヘッダー - stickyで上部に固定 */}
      {weekDays.map((day, index) => {
        // 曜日を取得（0: 日曜日, 1: 月曜日, ..., 6: 土曜日）
        const dayOfWeek = day.getDay();
        
        // 日付に応じた背景色を設定
        // 今日: 青色、日曜日: 赤色、土曜日: 青色、平日: グレー
        const bgColorClass = 
          isToday(day) ? "bg-blue-100" : 
          dayOfWeek === 0 ? "bg-red-100" : 
          dayOfWeek === 6 ? "bg-blue-100" : 
          "bg-gray-50";
          
        return (
        <div
          key={index}
          className={`sticky top-0 z-10 p-1 text-center border-r border-b ${bgColorClass}`}
          style={{ height: "42px" }}  // ヘッダーの高さを42pxに固定
        >
          {/* 日付表示エリア */}
          <div className="font-medium text-xs flex flex-col justify-center">
            {/* 曜日表示（日、月、火...） */}
            <span className="font-bold">{WEEKDAY_JP[dayOfWeek]}</span>
            {/* 日付表示（フォーマット済み） */}
            <span>{formatDayWithWeekday(day)}</span>
          </div>
        </div>
        );
      })}
    </>
  );
};