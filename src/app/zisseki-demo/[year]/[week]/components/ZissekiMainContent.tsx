'use client';

import React, { Suspense } from 'react';
import { TimeGrid } from './weekgrid/TimeGrid';
import { ZissekiSidebar } from './sidebar/ZissekiSidebar';
import { LoadingSpinner } from './loadingspinner/LoadingSpinner';
import { useEventContext } from '../context/EventContext';
import { useWorkTimeReducer } from '../hooks/reducer/useWorkTimeReducer';
import { useZissekiStore } from '../store/zissekiStore';
import { createNewEvent } from '../utils/eventUtils';

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
  const workTimeState = useWorkTimeReducer();

  // ========================================
  // イベントハンドラー
  // ========================================
  
  const handleTimeSlotClick = (day: Date, hour: number, minute: number) => {
    const newEvent = createNewEvent(day, hour, minute, eventState.ui.hierarchy);
    const createdEvent = eventState.createEvent(newEvent);
    eventState.setSelectedEvent(createdEvent);
  };

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
            onTimeSlotClick={handleTimeSlotClick}
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
