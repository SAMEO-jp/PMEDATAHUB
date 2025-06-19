import { formatDateTimeForStorage, parseDateTime } from '../../utils/dateUtils';
import { DisplayEvent } from '../../types/event';
import { DragSourceMonitor } from 'react-dnd';

interface DragData {
  id: string;
  event: DisplayEvent;
}

interface DropData {
  day: Date;
  hour: number;
  minute?: number;
  event: DisplayEvent;
}

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
  const handleDragStart = (item: DragData) => {
    const draggedEvent = item.event;
    setActiveEvent(draggedEvent);
  };

  const handleDragEnd = (item: DragData, monitor: DragSourceMonitor) => {
    setActiveEvent(null);

    if (!monitor.didDrop()) return;

    const dropResult = monitor.getDropResult() as DropData;
    if (!dropResult) return;

    const draggedEvent = item.event;
    const { day, hour, minute = 0 } = dropResult;

    const originalStart = parseDateTime(draggedEvent.startDateTime);
    const originalEnd = parseDateTime(draggedEvent.endDateTime);
    const duration = originalEnd.getTime() - originalStart.getTime();

    const newStart = new Date(day);
    newStart.setHours(hour, minute, 0, 0);
    const newEnd = new Date(newStart.getTime() + duration);

    if (isNaN(newStart.getTime()) || isNaN(newEnd.getTime())) {
      console.error('Invalid date:', { newStart, newEnd });
      return;
    }

    const newTop = (newStart.getHours() * 60 + newStart.getMinutes()) / 60 * 64;
    const newHeight = duration / (1000 * 60 * 60) * 64;

    const updatedEvent: DisplayEvent = {
      ...draggedEvent,
      startDateTime: formatDateTimeForStorage(newStart),
      endDateTime: formatDateTimeForStorage(newEnd),
      top: newTop,
      height: newHeight,
      unsaved: true,
    };

    const updatedEvents = events.map((event) =>
      event.key_id === draggedEvent.key_id ? updatedEvent : event
    );

    setEvents(updatedEvents);
    setSelectedEvent(updatedEvent);
    setHasChanges(true);

    localStorage.setItem(
      `week_data_${year}_${week}_${currentUser.user_id}`,
      JSON.stringify(updatedEvents)
    );
  };

  return { handleDragStart, handleDragEnd };
}; 