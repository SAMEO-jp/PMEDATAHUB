import { formatDateTimeForStorage, parseDateTime } from '../../utils/dateUtils';

type Event = {
  id: string;
  keyID: string;
  user_id: string;
  startDateTime: string;
  endDateTime: string;
  top: number;
  height: number;
  unsaved?: boolean;
  dragHandleOffset?: number;
};

type DragEvent = {
  active: {
    data: {
      current: {
        event: Event;
        dragHandleOffset?: number;
      };
    };
  };
  over: {
    data: {
      current: {
        day: Date;
        hour: number;
        minute?: number;
      };
    };
  } | null;
};

export const useDragHandlers = (
  events: Event[],
  setEvents: (events: Event[]) => void,
  setActiveEvent: (event: Event | null) => void,
  setSelectedEvent: (event: Event | null) => void,
  setHasChanges: (hasChanges: boolean) => void,
  year: number,
  week: number,
  currentUser: { user_id: string }
) => {
  const handleDragStart = (event: DragEvent) => {
    const { active } = event;
    const draggedEvent = active.data.current.event;
    const dragHandleOffset = active.data.current.dragHandleOffset || 16;

    setActiveEvent({
      ...draggedEvent,
      dragHandleOffset,
    });
  };

  const handleDragEnd = (event: DragEvent) => {
    const { active, over } = event;
    setActiveEvent(null);

    if (!over) return;

    const draggedEvent = active.data.current.event;
    const { day, hour, minute = 0 } = over.data.current;

    const originalStart = parseDateTime(draggedEvent.startDateTime);
    const originalEnd = parseDateTime(draggedEvent.endDateTime);
    const duration = (originalEnd.getTime() - originalStart.getTime()) / 60000;

    const newStart = new Date(day);
    newStart.setHours(hour, minute, 0, 0);
    const newEnd = new Date(newStart.getTime() + duration * 60000);

    if (isNaN(newStart.getTime()) || isNaN(newEnd.getTime())) {
      console.error('Invalid date:', { newStart, newEnd });
      return;
    }

    const updatedEvent: Event = {
      ...draggedEvent,
      startDateTime: formatDateTimeForStorage(newStart),
      endDateTime: formatDateTimeForStorage(newEnd),
      top: newStart.getHours() * 64 + (newStart.getMinutes() / 60) * 64,
      unsaved: true,
    };

    const updatedEvents = events.map((event) =>
      event.id === draggedEvent.id ? updatedEvent : event
    );

    setEvents(updatedEvents);
    setSelectedEvent(updatedEvent);
    setHasChanges(true);

    localStorage.setItem(
      `week_data_${year}_${week}_${currentUser.user_id}`,
      JSON.stringify(updatedEvents)
    );
  };

  return {
    handleDragStart,
    handleDragEnd,
  };
}; 