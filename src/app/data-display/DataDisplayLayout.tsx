'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Settings } from 'lucide-react';
import { ViewModeContext } from './ViewModeContext';
import { HeaderContent } from '../../components/layout/HeaderContent';

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
    downloadCSV?: () => void;
  };
}

export default function DataDisplayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  
  // URLパラメータから年月を取得
  const pathMatch = pathname.match(/\/data-display\/(\d+)\/(\d+)/)
  const year = pathMatch ? parseInt(pathMatch[1]) : new Date().getFullYear()
  const month = pathMatch ? parseInt(pathMatch[2]) : new Date().getMonth() + 1
  const monthName = getMonthName(month)
  
  // 現在の年月を取得
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const currentWeek = getWeekNumber(currentDate)
  
  // ビューモードの状態
  const [viewMode, setViewMode] = useState("table")
  
  // 選択されたプロジェクト名
  const [selectedProjectName, setSelectedProjectName] = useState<string | null>(null)
  
  // CSVダウンロード関数
  const [downloadCSV, setDownloadCSV] = useState<(() => void) | undefined>(undefined)
  
  // カスタムイベントの購読
  useEffect(() => {
    const handleUpdateHeaderData = (event: UpdateHeaderDataEvent) => {
      const { downloadCSV } = event.detail
      if (downloadCSV) setDownloadCSV(() => downloadCSV)
    }
    
    document.addEventListener('updateHeaderData', handleUpdateHeaderData as EventListener)
    
    return () => {
      document.removeEventListener('updateHeaderData', handleUpdateHeaderData as EventListener)
    }
  }, [setDownloadCSV])

  // 前月・次月・今月のナビゲーション関数
  const navigateToMonth = (targetYear: number, targetMonth: number) => {
    router.push(`/data-display/${targetYear}/${targetMonth}`)
  }

  const handlePrevMonth = () => {
    const prevMonth = month === 1 ? 12 : month - 1
    const prevYear = month === 1 ? year - 1 : year
    navigateToMonth(prevYear, prevMonth)
  }

  const handleNextMonth = () => {
    const nextMonth = month === 12 ? 1 : month + 1
    const nextYear = month === 12 ? year + 1 : year
    navigateToMonth(nextYear, nextMonth)
  }

  const handleCurrentMonth = () => {
    navigateToMonth(currentYear, currentMonth)
  }

  // 保存関数（CSVダウンロード用）
  const handleSave = async () => {
    if (downloadCSV) {
      downloadCSV();
    }
  };

  // カスタムアクションハンドラー
  const handleCustomAction = (actionId: string) => {
    switch (actionId) {
      case 'prev-month':
        handlePrevMonth()
        break
      case 'next-month':
        handleNextMonth()
        break
      case 'current-month':
        handleCurrentMonth()
        break
      default:
        break
    }
  }

  // Context の値をメモ化して不要な再レンダリングを防ぐ
  const contextValue = useMemo(() => ({ 
    viewMode, 
    setViewMode, 
    selectedProjectName, 
    setSelectedProjectName 
  }), [viewMode, selectedProjectName]);

  return (
    <ViewModeContext.Provider value={contextValue}>
      <div className="flex flex-col h-screen">
        {/* 統一されたヘッダーシステムを使用 */}
        <HeaderContent 
          onSave={handleSave} 
          onCustomAction={handleCustomAction}
        />
        
        {/* ビューモード切替タブとフィルターボタン（ヘッダーの下に配置） */}
        <div className="border-b bg-white px-6 py-2">
          <div className="flex justify-between items-center">
            {/* 左側: 実績データ表示 */}
            <div className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              実績データ ({year}年{month}月)
              {viewMode === "chart" && (
                <>
                  <span className="text-gray-400">＞</span>
                  <span className="text-base font-normal">
                    {selectedProjectName ? `プロジェクト分析: ${selectedProjectName}` : "グラフ分析"}
                  </span>
                </>
              )}
            </div>
            
            {/* 右側: ビューモード切替タブとフィルターボタン */}
            <div className="flex items-center gap-3">
              {/* ビューモード切替タブ */}
              <div className="border rounded-md overflow-hidden">
                <button
                  className={`py-1.5 px-3 text-sm ${viewMode === "table" ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"}`}
                  onClick={() => setViewMode("table")}
                >
                  表形式
                </button>
                <button
                  className={`py-1.5 px-3 text-sm ${viewMode === "calendar" ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"}`}
                  onClick={() => setViewMode("calendar")}
                >
                  出退勤表
                </button>
                <button
                  className={`py-1.5 px-3 text-sm ${viewMode === "chart" ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"}`}
                  onClick={() => setViewMode("chart")}
                >
                  グラフ
                </button>
              </div>
              
            </div>
          </div>
        </div>
        
        {/* メインコンテンツ（スクロール可能） */}
        <main className={`flex-1 overflow-auto ${viewMode === "chart" ? "bg-white" : "bg-gray-50"}`}>
          {viewMode === "chart" ? (
            children
          ) : (
            <div className="p-4">
              {children}
            </div>
          )}
        </main>
      </div>
    </ViewModeContext.Provider>
  );
} 