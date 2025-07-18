import { DisplayEvent } from './event';
import { DragSourceMonitor } from 'react-dnd';
import { DraggableHeight } from './height';

export interface DropData {
  day: Date;
  hour: number;
  minute?: number;
  event: DisplayEvent;
}

// ドラッグデータの共通型定義
export interface DragData {
  id: string;
  event: DisplayEvent;
  draggableHeight: DraggableHeight;  // ドラッグ操作時に使用する高さ
  draggableTop: number;  // ドラッグ操作時のtop位置
}

// ドラッグハンドラーの型定義
export interface DragHandlers {
  onDragStart: (item: DragData) => void;
  onDragEnd: (item: DragData, monitor: DragSourceMonitor) => void;
}

export interface DroppableTimeSlotProps {
  day: Date;
  hour: number;
  minute: number;
  isToday: boolean;
  dayIndex: number;
  onClick: (day: Date, hour: number, minute: number) => void;
}

// OnclickMakeEventコンポーネントの型定義
export interface OnclickMakeEventProps {
  day: Date;
  hour: number;
  minute?: number;
  onClick: (day: Date, hour: number, minute?: number) => void;
  children?: React.ReactNode;
} 