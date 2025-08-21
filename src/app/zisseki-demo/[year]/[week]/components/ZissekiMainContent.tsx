'use client';

import React, { Suspense, useEffect, useRef } from 'react';
import { TimeGrid } from './weekgrid/TimeGrid';
import { ZissekiSidebar } from './sidebar/ZissekiSidebar';
import { LoadingSpinner } from './loadingspinner/LoadingSpinner';
import { TimeGridHeader } from './TimeGridHeader';
import { useEventContext } from '../context/EventContext';
import { useDatabase } from '../context/DatabaseContext';
import { useWorkTimeReducer } from '../hooks/reducer/useWorkTimeReducer';
import { useZissekiStore } from '../store/zissekiStore';
import { createNewEvent } from '../utils/eventUtils';
import { eventActions } from '../hooks/reducer/event/eventActions';

interface ZissekiMainContentProps {
  year: number;
  week: number;
}

export function ZissekiMainContent({ year, week }: ZissekiMainContentProps) {
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

  // 初回データ同期フラグ
  const hasInitialized = useRef(false);

  // ========================================
  // 初期データ読み込み（初回のみ）
  // ========================================
  
  useEffect(() => {
    // DatabaseContextを初期化（初回のみ）
    if (!database.isInitialized) {
      console.log('DatabaseContext初期化を開始');
      database.initialize();
    }
  }, [database]);

  useEffect(() => {
    // データベースの読み込みが完了したら、初回のみ同期
    if (!hasInitialized.current && database.isInitialized && !database.isLoading) {
      console.log('初期化チェック:', {
        hasInitialized: hasInitialized.current,
        databaseInitialized: database.isInitialized,
        databaseLoading: database.isLoading,
        databaseEvents: database.events?.length || 0,
        eventStateEvents: eventState.events?.length || 0
      });

      if (database.events && database.events.length > 0) {
        // データベースにデータがある場合
        console.log('初回データ同期: DatabaseContextからEventContextに同期中...', database.events);
        eventState.dispatch(eventActions.setEvents(database.events));
      } else {
        // データベースにデータがない場合でも、EventContextを初期化
        console.log('初回データ同期: データベースにデータがないため、EventContextを初期化');
        eventState.dispatch(eventActions.setEvents([]));
      }
      hasInitialized.current = true;
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
    console.log('handleTimeSlotClick呼び出し:', { day, hour, minute });
    console.log('EventContext状態:', {
      events: eventState.events?.length || 0,
      hierarchy: eventState.ui?.hierarchy,
      selectedEvent: eventState.selectedEvent
    });

    // EventContextが初期化されていない場合は強制初期化
    if (!eventState.events) {
      console.log('EventContextが未初期化のため、強制初期化を実行');
      eventState.dispatch(eventActions.setEvents([]));
    }

    try {
      const newEvent = createNewEvent(day, hour, minute, eventState.ui.hierarchy);
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
  // デバッグ情報
  // ========================================
  
  console.log('ZissekiMainContent状態:', {
    databaseEvents: database.events?.length || 0,
    eventStateEvents: eventState.events?.length || 0,
    databaseLoading: database.isLoading,
    databaseInitialized: database.isInitialized,
    eventStateLoading: eventState.loading,
    hasInitialized: hasInitialized.current,
    eventStateUI: eventState.ui,
    eventStateHierarchy: eventState.ui?.hierarchy
  });
  
  // ========================================
  // メインコンテンツ
  // ========================================
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* メインコンテンツ */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <TimeGridHeader year={year} week={week} />
        
        {/* タイムグリッド */}
        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<LoadingSpinner />}>
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
          </Suspense>
        </div>
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
