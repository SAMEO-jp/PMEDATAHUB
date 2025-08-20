"use client"

import React from 'react';
import { useZissekiStore } from './store/zissekiStore';
import { useWorkTimeReducer } from './hooks/reducer/useWorkTimeReducer';
import { EventProvider } from './context/EventContext';
import { useEventContext } from './context/EventContext';
import { MainContent } from './components/MainContent';
import { ErrorBoundary } from './components/ErrorBoundary';

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
    initializeFromStorage,
    projects, 
    employees, 
    currentUser
  } = useZissekiStore();

  // 統合された状態管理
  const eventState = useEventContext();
  const workTimeState = useWorkTimeReducer();

  // 初期化（初回のみ）
  React.useEffect(() => {
    if (!isInitialized) {
      initializeFromStorage();
    }
  }, [isInitialized, initializeFromStorage]);

  // ========================================
  // エラーハンドリング
  // ========================================
  
  // 統合されたエラー状態
  const hasError = Boolean(storeError || workTimeState.error || eventState.error);
  const errorMessage = storeError || workTimeState.error || eventState.error;

  // エラーをクリアする関数
  const clearAllErrors = () => {
    // エラー状態をリセット（実装が必要な場合は適切なメソッドを呼び出す）
    console.log('Clearing errors...');
  };

  // ========================================
  // ローディング状態
  // ========================================
  
  const isLoading = storeLoading || workTimeState.loading || eventState.loading || !isInitialized;

  // ========================================
  // メインコンテンツ
  // ========================================
  
  return (
    <ErrorBoundary
      hasError={hasError}
      errorMessage={errorMessage}
      isLoading={isLoading}
      onClearErrors={clearAllErrors}
    >
      <MainContent
        year={year}
        week={week}
        events={eventState.events}
        workTimes={workTimeState.workTimes}
        selectedEvent={eventState.selectedEvent}
        onEventClick={eventState.handleEventClick}
        onWorkTimeChange={workTimeState.updateWorkTime}
        activeTab={eventState.ui.hierarchy.activeTab}
        activeSubTab={eventState.ui.hierarchy.activeSubTabs.project}
        createEvent={eventState.createEvent}
        setSelectedEvent={eventState.setSelectedEvent}
      />
    </ErrorBoundary>
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