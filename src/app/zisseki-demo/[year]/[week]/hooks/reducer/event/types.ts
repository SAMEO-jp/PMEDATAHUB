import { TimeGridEvent as BaseTimeGridEvent } from '../../../types';

// 既存のTimeGridEventを拡張
export interface TimeGridEvent extends BaseTimeGridEvent {
  selectedTab?: string;
  selectedProjectSubTab?: string;
  selectedIndirectSubTab?: string;
  selectedIndirectDetailTab?: string;
  selectedOtherSubTab?: string;
}

export interface EventState {
  // イベントデータ
  events: TimeGridEvent[];
  // UI状態
  selectedEvent: TimeGridEvent | null;
  modals: Record<string, boolean>;
  dragState: {
    isDragging: boolean;
    draggedEvent: TimeGridEvent | null;
  };
  resizeState: {
    isResizing: boolean;
    resizedEvent: TimeGridEvent | null;
  };
  activeTab: string;
  activeSubTabs: Record<string, string>;
  // 共通状態
  loading: boolean;
  error: string | null;
  
  // 新規追加（Zustand Storeから統合）
  // 選択中のイベントのプロジェクト関連属性
  selectedProjectCode: string;
  purposeProjectCode: string;
  
  // 新規追加（useStateから統合）
  // 選択中のイベントのタブ詳細属性（サイドバーで編集可能）
  tabDetails: {
    planning: {
      planningSubType: string;
      estimateSubType: string;
    };
    design: {
      designSubType: string;
    };
    meeting: {
      meetingType: string;
    };
    other: {
      travelType: string;
      stakeholderType: string;
      documentType: string;
    };
    indirect: {
      otherSubTab: string;
      indirectDetailTab: string;
    };
  };
}

export type EventAction = 
  // イベントデータ関連
  | { type: 'SET_EVENTS'; payload: TimeGridEvent[] }
  | { type: 'ADD_EVENT'; payload: TimeGridEvent }
  | { type: 'UPDATE_EVENT'; payload: { eventId: string; event: TimeGridEvent } }
  | { type: 'DELETE_EVENT'; payload: string }
  // UI状態関連
  | { type: 'SET_SELECTED_EVENT'; payload: TimeGridEvent | null }
  | { type: 'SET_MODAL_OPEN'; payload: { modalType: string; isOpen: boolean } }
  | { type: 'SET_DRAG_STATE'; payload: { isDragging: boolean; draggedEvent: TimeGridEvent | null } }
  | { type: 'SET_RESIZE_STATE'; payload: { isResizing: boolean; resizedEvent: TimeGridEvent | null } }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'SET_ACTIVE_SUBTAB'; payload: { tab: string; subTab: string } }
  // 共通状態
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR'; payload: void }
  // 新規追加（プロジェクト選択）
  | { type: 'SET_SELECTED_PROJECT_CODE'; payload: string }
  | { type: 'SET_PURPOSE_PROJECT_CODE'; payload: string }
  // 新規追加（タブ詳細状態）
  | { type: 'SET_TAB_DETAIL'; payload: { tab: string; detail: string; value: string } }
  // 新規追加（間接業務詳細）
  | { type: 'SET_INDIRECT_DETAIL'; payload: { detail: string; value: string } }
  // 新規追加（イベント選択時の状態反映）
  | { type: 'SYNC_EVENT_TO_SIDEBAR'; payload: TimeGridEvent }; 