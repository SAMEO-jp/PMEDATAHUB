import { EventState, EventAction } from './types';

export const initialState: EventState = {
  events: [],
  selectedEvent: null,
  modals: {},
  dragState: {
    isDragging: false,
    draggedEvent: null
  },
  resizeState: {
    isResizing: false,
    resizedEvent: null
  },
  activeTab: 'dashboard',
  activeSubTabs: {
    project: 'overview',
    indirect: '純間接'
  },
  loading: true,
  error: null,
  
  // 新規追加
  selectedProjectCode: '',
  purposeProjectCode: '',
  tabDetails: {
    planning: { planningSubType: '', estimateSubType: '' },
    design: { designSubType: '' },
    meeting: { meetingType: '' },
    other: { travelType: '', stakeholderType: '', documentType: '' },
    indirect: { otherSubTab: '〇先対応', indirectDetailTab: '日報入力' }
  }
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
          event.id === action.payload.eventId ? action.payload.event : event
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
        modals: {
          ...state.modals,
          [action.payload.modalType]: action.payload.isOpen
        }
      };
    
    case 'SET_DRAG_STATE':
      return {
        ...state,
        dragState: {
          isDragging: action.payload.isDragging,
          draggedEvent: action.payload.draggedEvent
        }
      };
    
    case 'SET_RESIZE_STATE':
      return {
        ...state,
        resizeState: {
          isResizing: action.payload.isResizing,
          resizedEvent: action.payload.resizedEvent
        }
      };
    
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    
    case 'SET_ACTIVE_SUBTAB':
      return {
        ...state,
        activeSubTabs: {
          ...state.activeSubTabs,
          [action.payload.tab]: action.payload.subTab
        }
      };
    
    // 共通状態
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    // 新規追加（プロジェクト選択）
    case 'SET_SELECTED_PROJECT_CODE':
      return { ...state, selectedProjectCode: action.payload };
    
    case 'SET_PURPOSE_PROJECT_CODE':
      return { ...state, purposeProjectCode: action.payload };
    
    // 新規追加（タブ詳細状態）
    case 'SET_TAB_DETAIL':
      return {
        ...state,
        tabDetails: {
          ...state.tabDetails,
          [action.payload.tab as keyof typeof state.tabDetails]: {
            ...state.tabDetails[action.payload.tab as keyof typeof state.tabDetails],
            [action.payload.detail]: action.payload.value
          }
        }
      };
    
    // 新規追加（間接業務詳細）
    case 'SET_INDIRECT_DETAIL':
      return {
        ...state,
        tabDetails: {
          ...state.tabDetails,
          indirect: {
            ...state.tabDetails.indirect,
            [action.payload.detail]: action.payload.value
          }
        }
      };
    
    // 新規追加（イベント選択時の状態反映）
    case 'SYNC_EVENT_TO_SIDEBAR':
      return {
        ...state,
        // イベントの属性でサイドバーの状態を初期化
        selectedProjectCode: action.payload.project || '',
        purposeProjectCode: action.payload.purposeProject || '',
        activeTab: action.payload.selectedTab || 'dashboard',
        activeSubTabs: {
          project: action.payload.selectedProjectSubTab || 'overview',
          indirect: action.payload.selectedIndirectSubTab || '純間接'
        },
        tabDetails: {
          planning: {
            planningSubType: action.payload.planningSubType || '',
            estimateSubType: action.payload.estimateSubType || ''
          },
          design: {
            designSubType: action.payload.designSubType || ''
          },
          meeting: {
            meetingType: action.payload.meetingType || ''
          },
          other: {
            travelType: action.payload.travelType || '',
            stakeholderType: action.payload.stakeholderType || '',
            documentType: action.payload.documentType || ''
          },
          indirect: {
            otherSubTab: action.payload.selectedOtherSubTab || '〇先対応',
            indirectDetailTab: action.payload.selectedIndirectDetailTab || '日報入力'
          }
        }
      };
    
    default:
      return state;
  }
} 