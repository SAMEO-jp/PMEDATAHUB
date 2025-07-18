import { useCallback, useState } from 'react';
import { createNewEvent } from '../../utils/eventUtils';
import { useDragHandlers } from './useDragHandlers';
import { useKeyboardHandlers } from './useKeyboardHandlers';
import { useSaveHandlers } from './useSaveHandlers';
import { DisplayEvent, Project } from '../../types/event';

// ローカルストレージから読み込んだデータにoriginalHeightが存在しない場合の対応
const ensureOriginalHeight = (events: DisplayEvent[]): DisplayEvent[] => {
  return events.map(event => {
    if (event.originalHeight === undefined) {
      return {
        ...event,
        originalHeight: event.height  // 既存データの場合はheightと同じ値
      };
    }
    return event;
  });
};

export const useEventHandlers = (
  events: DisplayEvent[],
  setEvents: (events: DisplayEvent[]) => void,
  setSelectedEvent: (event: DisplayEvent | null) => void,
  setActiveEvent: (event: DisplayEvent | null) => void,
  setHasChanges: (hasChanges: boolean) => void,
  setSaveMessage: (message: { type: string; text: string }) => void,
  year: number,
  week: number,
  currentUser: { user_id: string },
  selectedTab: string,
  selectedProjectSubTab: string,
  projects: Project[]
) => {
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

  const { handleDragStart, handleDragEnd } = useDragHandlers(
    events,
    setEvents,
    setActiveEvent,
    setSelectedEvent,
    setHasChanges,
    year,
    week,
    currentUser
  );

  const { isSaving, handleSaveWeekData, handleDeleteEvent } = useSaveHandlers(
    events,
    setEvents,
    setSelectedEvent,
    setHasChanges,
    setSaveMessage,
    year,
    week,
    currentUser
  );

  const handleEventClick = useCallback((event: DisplayEvent) => {
    if (isCtrlPressed) {
      // Ctrlキーが押されている場合は複数選択
      setSelectedEvent(event);
    } else {
      // 通常のクリック
      setSelectedEvent(event);
    }
  }, [setSelectedEvent, isCtrlPressed]);

  const handleTimeSlotClick = useCallback((day: Date, hour: number, minute = 0) => {
    if (!currentUser || !currentUser.user_id) {
      console.error("ユーザー情報が正しく設定されていません");
      alert("ユーザー情報が正しく設定されていません。ログインし直してください。");
      return;
    }

    const newEvent = createNewEvent({
      day,
      hour,
      minute,
      user_id: currentUser.user_id,
      selectedTab,
      selectedProjectSubTab,
      projects,
    });

    const updatedEvents = [...events, newEvent];
    const eventsWithOriginalHeight = ensureOriginalHeight(updatedEvents);
    setEvents(eventsWithOriginalHeight);
    setSelectedEvent(newEvent);
    setHasChanges(true);

    console.log('💾 新規イベント作成 - ローカルストレージ保存:', {
      eventId: newEvent.key_id,
      storageKey: `week_data_${year}_${week}_${currentUser.user_id}`,
      totalEvents: eventsWithOriginalHeight.length,
      originalHeight: newEvent.originalHeight,  // 新規作成時の元の高さ
      eventHeight: newEvent.height,  // イベントの基本高さ
      timestamp: new Date().toISOString()
    })

    localStorage.setItem(
      `week_data_${year}_${week}_${currentUser.user_id}`,
      JSON.stringify(eventsWithOriginalHeight)
    );
  }, [currentUser, events, projects, selectedTab, selectedProjectSubTab, setEvents, setSelectedEvent, setHasChanges, year, week]);

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  useKeyboardHandlers(
    (isPressed) => setIsCtrlPressed(isPressed),
    handleSaveWeekData,
    handleRefresh
  );

  return {
    handleEventClick,
    handleTimeSlotClick,
    handleDragStart,
    handleDragEnd,
    handleSaveWeekData,
    handleDeleteEvent,
    handleRefresh,
    isSaving,
    isCtrlPressed,
  };
}; 