import React from 'react';
import { notFound } from 'next/navigation';

interface WeeklySchedulePageProps {
  params: {
    year: string;
    week: string;
  };
}

// 週番号から日付を計算する関数
function getWeekDates(year: number, week: number): Date[] {
  const firstDayOfYear = new Date(year, 0, 1);
  const firstMonday = new Date(firstDayOfYear);
  
  // 1月1日が月曜日でない場合、最初の月曜日を見つける
  const dayOfWeek = firstDayOfYear.getDay();
  const daysToMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  firstMonday.setDate(firstDayOfYear.getDate() + daysToMonday);
  
  // 指定された週の月曜日を計算
  const weekStart = new Date(firstMonday);
  weekStart.setDate(firstMonday.getDate() + (week - 1) * 7);
  
  // その週の7日間を生成
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    weekDates.push(date);
  }
  
  return weekDates;
}

// サンプルデータ
const sampleEvents = [
  { id: 1, title: '朝礼', time: '09:00', dayIndex: 0 },
  { id: 2, title: '企画会議', time: '10:30', dayIndex: 0 },
  { id: 3, title: 'プロジェクト打ち合わせ', time: '14:00', dayIndex: 1 },
  { id: 4, title: '顧客訪問', time: '15:30', dayIndex: 1 },
  { id: 5, title: 'システム設計会議', time: '11:00', dayIndex: 2 },
  { id: 6, title: 'チームミーティング', time: '16:00', dayIndex: 3 },
  { id: 7, title: 'プレゼンテーション', time: '13:00', dayIndex: 4 },
  { id: 8, title: '振り返り会議', time: '17:00', dayIndex: 4 },
];

export default function WeeklySchedulePage({ params }: WeeklySchedulePageProps) {
  const year = parseInt(params.year);
  const week = parseInt(params.week);
  
  // パラメータの妥当性チェック
  if (isNaN(year) || isNaN(week) || year < 2020 || year > 2030 || week < 1 || week > 53) {
    notFound();
  }
  
  const weekDates = getWeekDates(year, week);
  const dayNames = ['月', '火', '水', '木', '金', '土', '日'];
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {year}年 第{week}週 週間予定表
          </h1>
          <p className="text-gray-600">
            {weekDates[0].toLocaleDateString('ja-JP')} ～ {weekDates[6].toLocaleDateString('ja-JP')}
          </p>
        </div>
        
        {/* 週間カレンダーグリッド */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 曜日ヘッダー */}
          <div className="grid grid-cols-7 bg-gray-100 border-b">
            {dayNames.map((day, index) => (
              <div key={day} className="p-4 text-center font-semibold text-gray-700">
                <div className="text-sm">{day}曜日</div>
                <div className="text-lg font-bold mt-1">
                  {weekDates[index].getDate()}
                </div>
              </div>
            ))}
          </div>
          
          {/* 時間軸とスケジュールグリッド */}
          <div className="grid grid-cols-7 min-h-96">
            {dayNames.map((day, dayIndex) => (
              <div key={day} className="border-r border-gray-200 last:border-r-0">
                {/* 各日のイベント */}
                <div className="p-2 space-y-2 min-h-96">
                  {sampleEvents
                    .filter(event => event.dayIndex === dayIndex)
                    .map(event => (
                      <div
                        key={event.id}
                        className="bg-blue-100 border-l-4 border-blue-500 p-3 rounded-r-md hover:bg-blue-200 transition-colors cursor-pointer"
                      >
                        <div className="text-sm font-medium text-blue-800">
                          {event.time}
                        </div>
                        <div className="text-sm text-blue-700 mt-1">
                          {event.title}
                        </div>
                      </div>
                    ))}
                  
                  {/* 今日が土日の場合の背景色変更 */}
                  {(dayIndex === 5 || dayIndex === 6) && (
                    <div className="absolute inset-0 bg-gray-50 opacity-30 pointer-events-none"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 週間サマリー */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">今週の予定</h3>
            <div className="text-2xl font-bold text-blue-600">{sampleEvents.length}件</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">最も忙しい日</h3>
            <div className="text-2xl font-bold text-orange-600">
              {dayNames[1]}曜日
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">空き時間</h3>
            <div className="text-2xl font-bold text-green-600">
              {7 - sampleEvents.filter(e => e.dayIndex < 5).length}時間
            </div>
          </div>
        </div>
        
        {/* ナビゲーション */}
        <div className="mt-8 flex justify-between items-center">
          <a
            href={`/nippou/${year}/${week - 1}`}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-gray-700 font-medium transition-colors"
          >
            ← 前の週
          </a>
          
          <a
            href="/nippou"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md text-white font-medium transition-colors"
          >
            週選択に戻る
          </a>
          
          <a
            href={`/nippou/${year}/${week + 1}`}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-gray-700 font-medium transition-colors"
          >
            次の週 →
          </a>
        </div>
      </div>
    </div>
  );
}