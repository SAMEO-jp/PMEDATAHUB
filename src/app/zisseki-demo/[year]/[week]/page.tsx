"use client"

import React, { Suspense } from 'react';
import { useZissekiStore } from './store/zissekiStore';
import { useWorkTimeReducer } from './hooks/reducer/useWorkTimeReducer';
import { useSidebarProps } from './hooks/props/useSidebarProps';
import { useTimeGridProps } from './hooks/props/useTimeGridProps';
import { ZissekiSidebar } from './components/sidebar/ZissekiSidebar';
import { TimeGrid } from './components/weekgrid/TimeGrid';
import { ErrorDisplay } from './components/ErrorDisplay';
import { LoadingSpinner } from './components/loadingspinner';
import { EventProvider } from './context/EventContext';

// ========================================
// メインページコンポーネント
// ========================================
function ZissekiPageContent({ 
  params 
}: { 
  params: { year: string; week: string } 
}) {
  const year = parseInt(params.year);
  const week = parseInt(params.week);

  // ========================================
  // 状態管理フック
  // ========================================
  
  // Zustandストア（マスターデータ）
  const { 
    loading: storeLoading, 
    error: storeError, 
    isInitialized,
    initializeFromStorage
  } = useZissekiStore();

  // 勤務時間管理
  const { 
    loading: workTimeLoading, 
    error: workTimeError, 
    clearError: clearWorkTimeError 
  } = useWorkTimeReducer();

  // 初期化（初回のみ）
  React.useEffect(() => {
    if (!isInitialized) {
      console.log('Zustandストアを初期化中...');
      initializeFromStorage();
    }
  }, [isInitialized, initializeFromStorage]);

  // Propsを生成（フックの呼び出し順序を保つため）
  const sidebarProps = useSidebarProps(year, week);
  const timeGridProps = useTimeGridProps(year, week);

  // ========================================
  // エラーハンドリング
  // ========================================
  
  // 統合されたエラー状態
  const hasError = storeError || workTimeError;
  const errorMessage = storeError || workTimeError;

  // エラーをクリアする関数
  const clearAllErrors = () => {
    clearWorkTimeError();
  };

  // ========================================
  // ローディング状態
  // ========================================
  
  const isLoading = storeLoading || workTimeLoading || !isInitialized;

  // デバッグ用: ローディング状態の詳細を確認
  console.log('ローディング状態:', {
    storeLoading,
    workTimeLoading,
    isInitialized,
    isLoading
  });

  // ========================================
  // エラー表示
  // ========================================
  
  if (hasError) {
    console.log('エラーが発生:', errorMessage);
    return (
      <ErrorDisplay 
        error={errorMessage} 
        onClear={clearAllErrors}
      />
    );
  }

  // ========================================
  // ローディング表示
  // ========================================
  
  if (isLoading) {
    console.log('ローディング中...');
    return <LoadingSpinner />;
  }

  console.log('メインコンテンツを表示');

  // ========================================
  // メインコンテンツ
  // ========================================
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* メインコンテンツ */}
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<LoadingSpinner />}>
          <TimeGrid {...timeGridProps} />
        </Suspense>
      </div>
      {/* サイドバー */}
      <Suspense fallback={<LoadingSpinner />}>
        <ZissekiSidebar {...sidebarProps} />
      </Suspense>
    </div>
  );
}

// ========================================
// エクスポート用のラッパーコンポーネント
// ========================================
export default function ZissekiPage({ params }: { params: { year: string; week: string } }) {
  return (
    <EventProvider>
      <ZissekiPageContent params={params} />
    </EventProvider>
  );
}