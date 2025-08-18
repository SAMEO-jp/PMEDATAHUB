"use client"

import React, { Suspense } from 'react';
import { useZissekiStore } from './store/zissekiStore';
import { useWorkTimeReducer } from './hooks/reducer/useWorkTimeReducer';
import { ZissekiSidebar } from './components/sidebar/ZissekiSidebar';
import { TimeGrid } from './components/weekgrid/TimeGrid';
import { ErrorDisplay } from './components/ErrorDisplay';
import { LoadingSpinner } from './components/loadingspinner';
import { EventProvider } from './context/EventContext';
import { useEventContext } from './context/EventContext';

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
      console.log('Zustandストアを初期化中...');
      initializeFromStorage();
    }
  }, [isInitialized, initializeFromStorage]);

  // ========================================
  // エラーハンドリング
  // ========================================
  
  // 統合されたエラー状態
  const hasError = storeError || workTimeState.error || eventState.error;
  const errorMessage = storeError || workTimeState.error || eventState.error;

  // エラーをクリアする関数
  const clearAllErrors = () => {
    workTimeState.clearError();
    eventState.clearError();
  };

  // ========================================
  // ローディング状態
  // ========================================
  
  const isLoading = storeLoading || workTimeState.loading || eventState.loading || !isInitialized;

  // ========================================
  // エラー表示
  // ========================================
  
  if (hasError) {
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
    return <LoadingSpinner />;
  }

  // ========================================
  // メインコンテンツ
  // ========================================
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* メインコンテンツ */}
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<LoadingSpinner />}>
          <TimeGrid 
            year={year}
            week={week}
            events={eventState.events}
            workTimes={workTimeState.workTimes}
            selectedEvent={eventState.selectedEvent}
            onEventClick={eventState.handleEventClick}
            onTimeSlotClick={(day, hour, minute) => {
              // 新しいイベント作成ロジック
              const currentTab = eventState.ui.hierarchy.activeTab;
              const currentSubTab = eventState.ui.hierarchy.activeSubTabs.project;
              
              // タブに基づいて業務分析コードを設定
              let activityCode = "";
              if (currentTab === "project") {
                switch (currentSubTab) {
                  case "計画":
                    activityCode = "P001";
                    break;
                  case "設計":
                    activityCode = "D001";
                    break;
                  case "会議":
                    activityCode = "M001";
                    break;
                  case "購入品":
                    activityCode = "P001";
                    break;
                  case "その他":
                    activityCode = "O001";
                    break;
                  default:
                    activityCode = "P001";
                }
              } else if (currentTab === "indirect") {
                activityCode = "I001";
              }
              
              const newEvent = {
                id: `event-${Date.now()}`,
                title: "新しいイベント",
                description: "",
                startDateTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute).toISOString(),
                endDateTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour + 1, minute).toISOString(),
                project: "",
                color: "#3788d8",
                top: hour * 64 + (minute / 60) * 64,
                height: 64,
                activityCode: activityCode, // 業務分析コードを設定
                unsaved: false
              };
              const createdEvent = eventState.createEvent(newEvent);
              eventState.setSelectedEvent(createdEvent);
            }}
            onWorkTimeChange={workTimeState.updateWorkTime}
          />
        </Suspense>
      </div>
      {/* サイドバー */}
      <Suspense fallback={<LoadingSpinner />}>
        <ZissekiSidebar 
          projects={projects}
        />
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