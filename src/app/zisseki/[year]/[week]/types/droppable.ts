export interface DroppableTimeSlotProps {
  day: Date;
  hour: number;
  minute: number;
  isToday: boolean;
  dayIndex: number;
  onClick: (day: Date, hour: number, minute: number) => void;
} 