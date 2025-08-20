/**
 * メインコンテンツコンポーネント
 * タイムグリッドとサイドバーを含むメイン表示エリア
 */

import React, { Suspense } from 'react';
import { TimeGrid } from './weekgrid/TimeGrid';
import { ZissekiSidebar } from './sidebar/ZissekiSidebar';
import { LoadingSpinner } from './LoadingSpinner';
import { TimeGridEvent } from '../types';
import { createEventCreationHandler } from './EventCreationHandler';

/**
 * メインコンテンツのProps型定義
 */
interface MainContentProps {
  year: number;
  week: number;
  events: TimeGridEvent[];
  workTimes: any[];
  selectedEvent: TimeGridEvent | null;
  onEventClick: (event: TimeGridEvent) => void;
  onWorkTimeChange: (date: string, startTime: string, endTime: string) => void;
  activeTab: string;
  activeSubTab: string;
  createEvent: (event: TimeGridEvent) => TimeGridEvent;
  setSelectedEvent: (event: TimeGridEvent) => void;
}

/**
 * メインコンテンツコンポーネント
 */
export const MainContent: React.FC<MainContentProps> = ({
  year,
  week,
  events,
  workTimes,
  selectedEvent,
  onEventClick,
  onWorkTimeChange,
  activeTab,
  activeSubTab,
  createEvent,
  setSelectedEvent
}) => {
  // イベント作成ハンドラーを生成
  const handleTimeSlotClick = createEventCreationHandler({
    activeTab,
    activeSubTab,
    createEvent,
    setSelectedEvent
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* メインコンテンツ */}
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<LoadingSpinner />}>
          <TimeGrid 
            year={year}
            week={week}
            events={events}
            workTimes={workTimes}
            selectedEvent={selectedEvent}
            onEventClick={onEventClick}
            onTimeSlotClick={handleTimeSlotClick}
            onWorkTimeChange={onWorkTimeChange}
          />
        </Suspense>
      </div>
      
      {/* サイドバー */}
      <Suspense fallback={<LoadingSpinner />}>
        <ZissekiSidebar />
      </Suspense>
    </div>
  );
};
