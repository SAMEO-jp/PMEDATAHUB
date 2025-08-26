import { EventState, EventAction } from './types';

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
    
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.eventId ? { ...event, ...action.payload.event } : event
        ),
        error: null
      };
    
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload),
        error: null
      };
    
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