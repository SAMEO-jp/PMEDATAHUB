"use client"

import React from "react"
import { formatDayWithWeekday } from "../utils"
import { isToday } from "../utils"

// 曜日の日本語表記配列（0:日曜日 ～ 6:土曜日）
const WEEKDAY_JP = ['日', '月', '火', '水', '木', '金', '土'];

// Props型定義 - TimeGridHeaderコンポーネントで受け取るプロパティ
type TimeGridHeaderProps = {
  weekDays: Date[];  // 表示する週の日付配列
}


/**
 * タイムグリッドヘッダーコンポーネント
 * 週の各日付と曜日を表示するヘッダー部分
 * 左上の空白セルと各日の日付・曜日情報を横並びで表示する
 */
export const TimeGridHeader = ({ weekDays }: TimeGridHeaderProps) => {
  return (
    <>
      {/* 時間ラベルのヘッダー（左上の空白セル） */}
      {/* タイムグリッドの左上角に配置される空白エリア - 時間ラベル列のヘッダー部分 */}
      <div className="sticky top-0 left-0 z-20 p-1 border-r border-b bg-gray-50 w-8"></div>
      
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
          className={`sticky top-0 z-10 p-0.5 text-center border-r border-b ${bgColorClass}`}
          style={{ height: "42px", minWidth: "60px" }}  // ヘッダーの高さを42px、最小幅を60pxに固定
        >
          {/* 日付表示エリア */}
          <div className="font-medium text-xs flex flex-col justify-center">
            {/* 曜日表示（日、月、火...） */}
            <span className="font-bold text-xs">{WEEKDAY_JP[dayOfWeek]}</span>
            {/* 日付表示（フォーマット済み） */}
            <span className="text-xs">{formatDayWithWeekday(day)}</span>
          </div>
        </div>
        );
      })}
    </>
  );
};