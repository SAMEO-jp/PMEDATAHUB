'use client';

import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import DataDisplayHeader, { Column } from './DataDisplayHeader';
import { ViewModeContext } from './ViewModeContext';

// 週番号を取得する関数
const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// 月名を取得する関数
const getMonthName = (month: number): string => {
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];
  return monthNames[month - 1];
};

// カスタムイベントの型定義
interface UpdateHeaderDataEvent extends CustomEvent {
  detail: {
    columns?: Column[];
    setColumns?: (columns: Column[]) => void;
    downloadCSV?: () => void;
  };
}

export default function DataDisplayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // URLパラメータから年月を取得
  const year = 2024
  const month = 12
  const monthName = getMonthName(month)
  
  // 現在の年月を取得
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const currentWeek = getWeekNumber(currentDate)
  
  // ビューモードの状態
  const [viewMode, setViewMode] = useState("table")
  
  // データテーブルの情報
  const [columns, setColumns] = useState<Column[]>([])
  const [downloadCSV, setDownloadCSV] = useState<(() => void) | undefined>(undefined)
  
  // カスタムイベントの購読
  useEffect(() => {
    const handleUpdateHeaderData = (event: UpdateHeaderDataEvent) => {
      const { columns, setColumns, downloadCSV } = event.detail
      if (columns && setColumns) setColumns(columns)
      if (downloadCSV) setDownloadCSV(() => downloadCSV)
    }
    
    document.addEventListener('updateHeaderData', handleUpdateHeaderData as EventListener)
    
    return () => {
      document.removeEventListener('updateHeaderData', handleUpdateHeaderData as EventListener)
    }
  }, [setColumns, setDownloadCSV])

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      <div className="flex flex-col h-screen">
        <header className="border-b p-0 bg-white">
          <div className="w-full flex items-center justify-between">
            {/* data-displayヘッダーコンポーネント */}
            <DataDisplayHeader 
              year={year} 
              month={month} 
              monthName={monthName} 
              viewMode={viewMode}
              setViewMode={setViewMode}
              columns={columns}
              setColumns={setColumns}
              onDownloadCSV={downloadCSV}
            />

            <div className="flex items-center gap-2 pr-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>
        
        {/* メインコンテンツ（スクロール可能） */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>
    </ViewModeContext.Provider>
  );
} 