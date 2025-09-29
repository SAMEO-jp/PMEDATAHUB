'use client';

import React, { Suspense, useEffect, useRef, useCallback } from 'react';
import { TimeGrid } from '../weekgrid/TimeGrid';
import { ZissekiSidebar } from '../sidebar/ZissekiSidebar';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useEventContext } from '../../context/EventContext';
import { useDatabase } from '../../context/DatabaseContext';
import { useWorkTimeReducer } from '../../hooks/reducer/useWorkTimeReducer';
import { useZissekiStore } from '../../store/zissekiStore';
import { createNewEvent } from '../../utils/eventUtils';
import { eventActions } from '../../hooks/reducer/event/eventActions';

interface ZissekiMainContentProps {
  year: number;
  week: number;
  onSave?: () => void;
  saveFunctionRef?: React.MutableRefObject<(() => Promise<void>) | null>;
}

export function ZissekiMainContent({ year, week, onSave, saveFunctionRef }: ZissekiMainContentProps) {
  // ========================================
  // 状態管理フック
  // ========================================
  
  // Zustandストア（マスターデータ）
  const { 
    projects, 
    employees, 
    currentUser
  } = useZissekiStore();

  // 統合された状態管理
  const eventState = useEventContext();
  const database = useDatabase();
  const workTimeState = useWorkTimeReducer();

  // 保存機能の実装
  const handleSave = useCallback(async () => {
    try {
      // 現在のイベントデータを取得
      const currentEvents = eventState.events || [];
      const currentWorkTimes: any[] = []; // 空配列として扱う

      // データベースに保存
      const result = await database.saveWeekData(currentEvents, currentWorkTimes);

      // 保存成功後、データベースを再読み込み
      database.refetch();

      // 親コンポーネントに保存完了を通知
      if (onSave) {
        onSave();
      }

    } catch (error: unknown) {
      console.error('保存エラー:', error);
      // エラーは親コンポーネントで処理
    }
  }, [eventState.events, database, onSave]);

  // 保存機能を親に渡す
  useEffect(() => {
    if (saveFunctionRef) {
      // 保存関数をrefに設定
      saveFunctionRef.current = handleSave;
    }
  }, [saveFunctionRef, handleSave]);

  // 初回データ同期フラグ
  const hasInitialized = useRef(false);
  const lastDatabaseEventsCount = useRef(0);

  // ========================================
  // 初期データ読み込み（初回のみ）
  // ========================================
  
  useEffect(() => {
    // DatabaseContextを初期化（初回のみ）
    if (!database.isInitialized) {
      database.initialize();
    }
  }, [database]);

  useEffect(() => {
    // データベースの読み込みが完了したら、初回のみ同期
    if (!hasInitialized.current && database.isInitialized && !database.isLoading) {
      if (database.events && database.events.length > 0) {
        // データベースにデータがある場合
        eventState.dispatch(eventActions.setEvents(database.events));
      } else {
        // データベースにデータがない場合でも、EventContextを初期化');
        eventState.dispatch(eventActions.setEvents([]));
      }
      hasInitialized.current = true;
      lastDatabaseEventsCount.current = database.events?.length || 0;
    }
  }, [database.events, database.isLoading, database.isInitialized, eventState]);

  // データベースの更新を監視してEventContextに同期
  useEffect(() => {
    if (hasInitialized.current && database.isInitialized && !database.isLoading) {
      const currentDatabaseEventsCount = database.events?.length || 0;
      
      // データベースのイベント数が変わった場合のみ同期
      if (currentDatabaseEventsCount !== lastDatabaseEventsCount.current) {
        console.log('データベース更新を検出: EventContextに同期中...', {
          previousCount: lastDatabaseEventsCount.current,
          currentCount: currentDatabaseEventsCount,
          databaseEvents: database.events
        });
        
        eventState.dispatch(eventActions.setEvents(database.events || []));
        lastDatabaseEventsCount.current = currentDatabaseEventsCount;
      }
    }
  }, [database.events, database.isLoading, database.isInitialized, eventState]);

  // フォールバック処理: 5秒後にEventContextが初期化されていない場合は強制初期化
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!hasInitialized.current) {
        console.log('フォールバック処理: EventContextを強制初期化');
        eventState.dispatch(eventActions.setEvents([]));
        hasInitialized.current = true;
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [eventState]);

  // ========================================
  // イベントハンドラー
  // ========================================
  
  const handleTimeSlotClick = (day: Date, hour: number, minute: number) => {
    // ダブルクリックでイベント作成
    console.log('handleTimeSlotClick呼び出し:', { day, hour, minute });
    console.log('EventContext状態:', {
      events: eventState.events?.length || 0,
      selectedEvent: eventState.selectedEvent
    });

    // EventContextが初期化されていない場合は強制初期化
    if (!eventState.events) {
      console.log('EventContextが未初期化のため、強制初期化を実行');
      eventState.dispatch(eventActions.setEvents([]));
    }

    try {
      // hierarchyが存在しない場合はundefinedを渡す（デフォルト値が使用される）
      const newEvent = createNewEvent(day, hour, minute, undefined);
      console.log('作成されたイベント:', newEvent);
      
      const createdEvent = eventState.createEvent(newEvent);
      console.log('EventContextに追加されたイベント:', createdEvent);
      
      eventState.setSelectedEvent(createdEvent);
      console.log('イベントが選択されました:', createdEvent);
    } catch (error) {
      console.error('イベント作成エラー:', error);
    }
  };

 
  // ========================================
  // メインコンテンツ
  // ========================================
  
  return (
    <div className="zisseki-demo zisseki-grid-layout h-screen bg-gray-50">
      {/* タイムグリッドエリア */}
      <div className="time-grid-area overflow-hidden">
        <Suspense fallback={<LoadingSpinner />}>
          {(() => {
            return (
              <TimeGrid 
                year={year}
                week={week}
                events={eventState.events || []}
                workTimes={workTimeState.workTimes}
                selectedEvent={eventState.selectedEvent}
                onEventClick={eventState.handleEventClick}
                onTimeSlotClick={handleTimeSlotClick}
                onWorkTimeChange={workTimeState.updateWorkTime}
              />
            );
          })()}
        </Suspense>
      </div>
      
      {/* サイドバーエリア */}
      <div className="sidebar-area overflow-hidden">
        <Suspense fallback={<LoadingSpinner />}>
          <ZissekiSidebar />
        </Suspense>
      </div>
      
      {/* フッタースペーサー（画面下部固定） */}
      <div className="footer-spacer"></div>
    </div>
  );
}
