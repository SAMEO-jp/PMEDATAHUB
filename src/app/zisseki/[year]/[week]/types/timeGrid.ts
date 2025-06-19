import { DisplayEvent } from './event';
import { User } from './user';
import { DragSourceMonitor } from 'react-dnd';

export type WorkTimeData = {
  date: string;
  startTime?: string;
  endTime?: string;
}

interface DragData {
  id: string;
  event: DisplayEvent;
}

export interface TimeGridProps {
  weekDays: Date[];
  timeSlots: number[];
  minuteSlots: number[];
  isToday: (date: Date) => boolean;
  events: DisplayEvent[];
  selectedEvent: DisplayEvent | null;
  setSelectedEvent: (event: DisplayEvent | null) => void;
  onEventClick: (event: DisplayEvent) => void;
  onTimeSlotClick: (day: Date, hour: number, minute?: number) => void;
  onResizeStart: (event: DisplayEvent, direction: "top" | "bottom", mouseY: number) => void;
  workTimes?: WorkTimeData[];
  onWorkTimeChange?: (date: string, startTime: string, endTime: string) => void;
  onCopyEvent?: (event: DisplayEvent) => void;
  onDeleteEvent?: (event: DisplayEvent) => void;
  year: number;
  week: number;
  currentUser: User;
  hasChanges: boolean;
  setHasChanges: (hasChanges: boolean) => void;
  onDragStart: (item: DragData) => void;
  onDragEnd: (item: DragData, monitor: DragSourceMonitor) => void;
} 