import { useCallback } from 'react';
import { createNewEvent } from '../../imports';
import { useDragHandlers } from './useDragHandlers';
import { useKeyboardHandlers } from './useKeyboardHandlers';
import { useSaveHandlers } from './useSaveHandlers';

export const useEventHandlers = (
  events: any[],
  setEvents: (events: any[]) => void,
  setSelectedEvent: (event: any) => void,
  setActiveEvent: (event: any) => void,
  setHasChanges: (hasChanges: boolean) => void,
  setSaveMessage: (message: { type: string; text: string }) => void,
  year: number,
  week: number,
  currentUser: { user_id: string },
  selectedTab: string,
  selectedProjectSubTab: string,
  projects: any[]
) => {
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

  const handleEventClick = useCallback((event: any) => {
    setSelectedEvent(event);
  }, [setSelectedEvent]);

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
    setEvents(updatedEvents);
    setSelectedEvent(newEvent);
    setHasChanges(true);

    localStorage.setItem(
      `week_data_${year}_${week}_${currentUser.user_id}`,
      JSON.stringify(updatedEvents)
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
  };
}; 