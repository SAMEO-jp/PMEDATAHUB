import { EventState, EventAction, TimeGridEvent } from './types';

export const initialState: EventState = {
  events: [],
  selectedEvent: null,
  
  // UI状態（シンプル化）
  ui: {
    modals: {},
    dragState: {
      isDragging: false,
      draggedEvent: null
    },
    resizeState: {
      isResizing: false,
      resizedEvent: null
    }
  },
  
  // システム状態
  loading: false,
  error: null
};

export function eventReducer(state: EventState, action: EventAction): EventState {
  switch (action.type) {
    // イベントデータ関連
    case 'SET_EVENTS':
      return { 
        ...state, 
        events: action.payload, 
        loading: false,
        error: null 
      };
    
    case 'ADD_EVENT':
      return { 
        ...state, 
        events: [...state.events, action.payload],
        error: null 
      };
    
    case 'UPDATE_EVENT': {
      const updatedEvents = state.events.map(event =>
        event.id === action.payload.eventId ? { ...event, ...action.payload.event } : event
      );
      const updatedSelectedEvent = state.selectedEvent && state.selectedEvent.id === action.payload.eventId
        ? { ...state.selectedEvent, ...action.payload.event }
        : state.selectedEvent;
      
      return {
        ...state,
        events: updatedEvents,
        selectedEvent: updatedSelectedEvent,
        error: null
      };
    }
    
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload),
        error: null
      };
    
    case 'COPY_EVENT': {
      const { originalEvent, newPosition } = action.payload;
      
      // 新しいイベントを作成（IDと日時を変更）
      // より確実に一意なIDを生成
      let newEventId: string;
      let attempts = 0;
      const maxAttempts = 10;
      
      do {
        const timestamp = Date.now();
        const randomPart = Math.random().toString(36).substring(2, 15);
        const uuidPart = Math.random().toString(36).substring(2, 15);
        newEventId = `event_${timestamp}_${randomPart}_${uuidPart}`;
        attempts++;
      } while (
        state.events.some(event => event.id === newEventId) && 
        attempts < maxAttempts
      );
      
      // 最大試行回数に達した場合は、より長いランダム文字列を使用
      if (attempts >= maxAttempts) {
        const timestamp = Date.now();
        const randomPart1 = Math.random().toString(36).substring(2, 15);
        const randomPart2 = Math.random().toString(36).substring(2, 15);
        const randomPart3 = Math.random().toString(36).substring(2, 15);
        newEventId = `event_${timestamp}_${randomPart1}_${randomPart2}_${randomPart3}_copy`;
      }
      
      // 元のイベントの日時を解析
      const originalStartTime = new Date(originalEvent.startDateTime);
      const originalEndTime = new Date(originalEvent.endDateTime);
      
      // 元のイベントの継続時間を取得
      const durationMs = originalEndTime.getTime() - originalStartTime.getTime();
      
      // 新しい開始時刻を計算（top位置から）
      // 1ピクセル = 2分として計算（30分間隔のグリッドを想定）
      const minutesFromTop = newPosition.top / 2;
      const newStartHour = Math.floor(minutesFromTop / 60);
      const newStartMinute = Math.floor(minutesFromTop % 60);
      
      // 新しい日付を設定（targetDateが提供されている場合はそれを使用）
      let newDate: Date;
      if (newPosition.targetDate) {
        newDate = new Date(newPosition.targetDate);
      } else {
        // フォールバック：dayIndexから計算
        const today = new Date();
        const currentDay = today.getDay();
        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
        const mondayDate = new Date(today);
        mondayDate.setDate(today.getDate() + mondayOffset);
        newDate = new Date(mondayDate);
        newDate.setDate(mondayDate.getDate() + newPosition.dayIndex);
      }
      
      // 新しい開始時刻を設定
      const newStartTime = new Date(newDate);
      newStartTime.setHours(newStartHour, newStartMinute, 0, 0);
      
      // 新しい終了時刻を計算（元の継続時間を保持）
      const newEndTime = new Date(newStartTime);
      newEndTime.setTime(newStartTime.getTime() + durationMs);
      
      const copiedEvent: TimeGridEvent = {
        ...originalEvent,
        id: newEventId,
        startDateTime: newStartTime.toISOString(),
        endDateTime: newEndTime.toISOString(),
        top: newPosition.top,
        height: newPosition.height,
        dayIndex: newPosition.dayIndex,
        unsaved: true // 新しく作成されたイベントは未保存としてマーク
      };
      
      return {
        ...state,
        events: [...state.events, copiedEvent],
        error: null
      };
    }
    
    // UI状態関連
    case 'SET_SELECTED_EVENT':
      return { ...state, selectedEvent: action.payload };
    
    case 'SET_MODAL_OPEN':
      return {
        ...state,
        ui: {
          ...state.ui,
          modals: {
            ...state.ui.modals,
            [action.payload.modalType]: action.payload.isOpen
          }
        }
      };
    
    case 'SET_DRAG_STATE':
      return {
        ...state,
        ui: {
          ...state.ui,
          dragState: {
            isDragging: action.payload.isDragging,
            draggedEvent: action.payload.draggedEvent
          }
        }
      };
    
    case 'SET_RESIZE_STATE':
      return {
        ...state,
        ui: {
          ...state.ui,
          resizeState: {
            isResizing: action.payload.isResizing,
            resizedEvent: action.payload.resizedEvent
          }
        }
      };
    
    // システム状態
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
} 