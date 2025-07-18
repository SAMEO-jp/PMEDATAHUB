import { formatDateTimeForStorage } from '../../utils/dateUtils';
import { DisplayEvent } from '../../types/event';
import { DragSourceMonitor } from 'react-dnd';
import { useUIStore } from '../../store/uiStore';
import { DRAG_TIME_SLOT_HEIGHT } from '../../utils/dragDropConstants';
import { DragData, DropData } from '../../types/droppable';

export const useDragHandlers = (
  events: DisplayEvent[],
  setEvents: (events: DisplayEvent[]) => void,
  setActiveEvent: (event: DisplayEvent | null) => void,
  setSelectedEvent: (event: DisplayEvent | null) => void,
  setHasChanges: (hasChanges: boolean) => void,
  year: number,
  week: number,
  currentUser: { user_id: string }
) => {
  const setIsDragging = useUIStore((state) => state.setIsDragging);
  const setDraggedEvent = useUIStore((state) => state.setDraggedEvent);
  const getDraggedEvent = () => useUIStore.getState().draggedEvent;

  // ドラッグ開始前の状態保存
  const savePreDragState = (event: DisplayEvent) => {
    // ドラッグ前の状態を保存
    setDraggedEvent({ ...event }); // 元のイベントのコピーを保存
    setIsDragging(true);
  }

  const handleDragStart = (item: DragData) => {
    setActiveEvent(item.event);
  };

  const handleDragEnd = (item: DragData, monitor: DragSourceMonitor) => {
    setActiveEvent(null);
    
    // ドラッグ終了後に少し遅延を入れてから状態をリセット
    // これにより、ドロップ直後の誤ったクリックイベントを防ぐ
    setTimeout(() => {
      setIsDragging(false);
    }, 100);

    if (!monitor.didDrop()) return;

    const dropResult = monitor.getDropResult() as DropData;
    if (!dropResult) return;

    // uiStoreから保存された元のdraggedEventを取得
    const originalDraggedEvent = getDraggedEvent();
    if (!originalDraggedEvent) {
      console.error('No draggedEvent in store');
      return;
    }
    const { day, hour, minute = 0 } = dropResult;
    
    // 保存された元のイベントの時間間隔を保持
    const originalStartTime = new Date(originalDraggedEvent.startDateTime);
    const originalEndTime = new Date(originalDraggedEvent.endDateTime);
    const originalDuration = originalEndTime.getTime() - originalStartTime.getTime();
    
    const newStart = new Date(day);
    newStart.setHours(hour, minute, 0, 0);
    const newEnd = new Date(newStart.getTime() + originalDuration);

    if (isNaN(newStart.getTime()) || isNaN(newEnd.getTime())) {
      console.error('Invalid date:', { newStart, newEnd, originalDuration });
      return;
    }

    const newTop = (newStart.getHours() * 60 + newStart.getMinutes()) / 60 * DRAG_TIME_SLOT_HEIGHT;

    // 新しいイベントを作成（元のデータを変更しない）
    const updatedEvent: DisplayEvent = {
      ...originalDraggedEvent,
      startDateTime: formatDateTimeForStorage(newStart),
      endDateTime: formatDateTimeForStorage(newEnd),
      top: newTop,
      // 元の時間間隔に基づいて高さを再計算
      height: (originalDuration / (1000 * 60 * 60)) * DRAG_TIME_SLOT_HEIGHT,
      unsaved: true,
    };

    // イベント配列を更新
    const updatedEvents = events.map((event) =>
      event.key_id === updatedEvent.key_id ? updatedEvent : event
    );

    setEvents(updatedEvents);
    setSelectedEvent(updatedEvent);
    setHasChanges(true);

    localStorage.setItem(
      `week_data_${year}_${week}_${currentUser.user_id}`,
      JSON.stringify(updatedEvents)
    );
    
    setDraggedEvent(null);
  };

  return { handleDragStart, handleDragEnd, savePreDragState };
}; 