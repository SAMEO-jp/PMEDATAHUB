import { TimeGridEvent as BaseTimeGridEvent } from '../../../types';

// 既存のTimeGridEventを拡張（サイドバー関連の状態は削除）
export interface TimeGridEvent extends BaseTimeGridEvent {
  // サイドバー関連の状態は削除 - activityCodeから動的に生成
}

// UI状態の型定義（シンプル化）
export interface UIState {
  // モーダル状態
  modals: Record<string, boolean>;
  
  // ドラッグ・リサイズ状態
  dragState: {
    isDragging: boolean;
    draggedEvent: TimeGridEvent | null;
  };
  resizeState: {
    isResizing: boolean;
    resizedEvent: TimeGridEvent | null;
  };
}

// シンプル化されたイベント状態
export interface EventState {
  // イベントデータ
  events: TimeGridEvent[];
  selectedEvent: TimeGridEvent | null;
  
  // UI状態（シンプル化）
  ui: UIState;
  
  // システム状態
  loading: boolean;
  error: string | null;
}

export type EventAction = 
  // イベントデータ関連
  | { type: 'SET_EVENTS'; payload: TimeGridEvent[] }
  | { type: 'ADD_EVENT'; payload: TimeGridEvent }
  | { type: 'UPDATE_EVENT'; payload: { eventId: string; event: Partial<TimeGridEvent> } }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_SELECTED_EVENT'; payload: TimeGridEvent | null }
  
  // UI状態関連
  | { type: 'SET_MODAL_OPEN'; payload: { modalType: string; isOpen: boolean } }
  | { type: 'SET_DRAG_STATE'; payload: { isDragging: boolean; draggedEvent: TimeGridEvent | null } }
  | { type: 'SET_RESIZE_STATE'; payload: { isResizing: boolean; resizedEvent: TimeGridEvent | null } }
  
  // システム状態
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR'; payload: void }; 