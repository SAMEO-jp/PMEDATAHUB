'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getISOWeek, getWeekStartDate } from '@/app/zisseki-demo/[year]/[week]/utils/weekUtils';

interface CalendarWidgetProps {
  className?: string;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ className = '' }) => {
  const router = useRouter();
  const params = useParams();
  
  // URLパラメータから現在の年と週を取得
  const currentYear = params?.year ? parseInt(params.year as string) : new Date().getFullYear();
  const currentWeek = params?.week ? parseInt(params.week as string) : getISOWeek(new Date());
  
  // 表示月の状態（ユーザーが自由に変更可能）
  const [displayMonth, setDisplayMonth] = useState(() => {
    // 初期値：URLの週が含まれる月
    const weekStartDate = getWeekStartDate(currentYear, currentWeek);
    return new Date(weekStartDate.getFullYear(), weekStartDate.getMonth(), 1);
  });

  // 月を変更する関数
  const changeMonth = (increment: number) => {
    setDisplayMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  };


  // カレンダーの日付を生成
  const generateCalendarDays = () => {
    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();
    
    // 月の最初の日と最後の日
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 最初の日の曜日（0=日曜日）
    const firstDayWeekday = firstDay.getDay();
    
    // 前月の最後の日
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // 前月の日付（薄いグレー）
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        month: month - 1 < 0 ? 11 : month - 1,
        year: month - 1 < 0 ? year - 1 : year,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // 今月の日付
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === new Date().toDateString();
      
      days.push({
        date: day,
        month: month,
        year: year,
        isCurrentMonth: true,
        isToday
      });
    }
    
    // 翌月の日付（薄いグレー）
    const remainingDays = 42 - days.length; // 6週 × 7日 = 42
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: day,
        month: month + 1 > 11 ? 0 : month + 1,
        year: month + 1 > 11 ? year + 1 : year,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return days;
  };

  // 日付クリックハンドラー（実績ページに遷移）
  const handleDateClick = (day: number, isCurrentMonth: boolean) => {
    if (isCurrentMonth) {
      const clickedDate = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day);
      const weekOfClickedDate = getISOWeek(clickedDate);
      const yearOfClickedDate = clickedDate.getFullYear();
      
      // 実績ページに遷移
      router.push(`/zisseki-demo/${yearOfClickedDate}/${weekOfClickedDate}`);
    }
  };

  // 選択された週の範囲を取得（URLパラメータベース）
  const getSelectedWeekRange = () => {
    const selectedWeekStartDate = getWeekStartDate(currentYear, currentWeek);
    const weekDates: Array<{ date: number; month: number; year: number }> = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(selectedWeekStartDate);
      date.setDate(selectedWeekStartDate.getDate() + i);
      weekDates.push({
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
      });
    }
    
    return weekDates;
  };

  const calendarDays = generateCalendarDays();
  const selectedWeekRange = getSelectedWeekRange();
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  return (
    <div className={`calendar-widget ${className}`}>
      {/* 月年表示とナビゲーション */}
      <div className="calendar-header-with-nav">
        <button 
          className="calendar-nav-btn calendar-nav-btn-left"
          onClick={() => changeMonth(-1)}
          title="前月"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="calendar-title">
          {displayMonth.getFullYear()}年 {monthNames[displayMonth.getMonth()]}
        </div>
        
        <button 
          className="calendar-nav-btn calendar-nav-btn-right"
          onClick={() => changeMonth(1)}
          title="翌月"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="calendar-weekdays">
        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div className="calendar-grid">
        {calendarDays.map((day, index) => {
          // 週の範囲に含まれているかチェック（年月日すべて一致）
          const isInSelectedWeek = selectedWeekRange.some(
            weekDay => weekDay.date === day.date && 
                       weekDay.month === day.month && 
                       weekDay.year === day.year &&
                       day.isCurrentMonth
          );
          
          return (
            <button
              key={index}
              className={`calendar-day ${
                day.isCurrentMonth ? 'current-month' : 'other-month'
              } ${
                isInSelectedWeek ? 'selected-week' : ''
              } ${
                day.isToday ? 'today' : ''
              }`}
              onClick={() => handleDateClick(day.date, day.isCurrentMonth)}
              disabled={!day.isCurrentMonth}
              title={day.isCurrentMonth ? `クリックして ${displayMonth.getFullYear()}年${displayMonth.getMonth() + 1}月${day.date}日 の実績ページを開く` : ''}
            >
              {day.date}
            </button>
          );
        })}
      </div>
    </div>
  );
};
