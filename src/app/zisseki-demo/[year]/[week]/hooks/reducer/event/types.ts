import { TimeGridEvent as BaseTimeGridEvent } from '../../../types';

// 既存のTimeGridEventを拡張
export interface TimeGridEvent extends BaseTimeGridEvent {
  selectedTab?: string;
  selectedProjectSubTab?: string;
  selectedIndirectSubTab?: string;
  selectedIndirectDetailTab?: string;
  selectedOtherSubTab?: string;
}

// 4段階階層の型定義
export interface HierarchyState {
  // レベル1: メインタブ
  activeTab: 'project' | 'indirect';
  
  // レベル2: サブタブ
  activeSubTabs: {
    project: '計画' | '設計' | '会議' | '購入品' | 'その他';
    indirect: '純間接' | '目的間接' | '控除時間';
  };
  
  // レベル3: 詳細タブ
  detailTabs: {
    project: {
      計画: '計画図' | '検討書' | '見積り';
      設計: '計画図' | '詳細図' | '組立図' | '改正図';
      会議: '内部会議' | '外部会議' | '打ち合わせ';
      購入品: '設備' | '材料' | 'その他';
      その他: '出張' | '研修' | 'その他';
    };
    indirect: {
      純間接: '日報入力' | '報告書作成' | 'その他';
      目的間接: '〇先対応' | '品質管理' | '安全管理';
      控除時間: '休憩' | '私用' | 'その他';
    };
  };
  
  // レベル4: 業務タイプ
  businessTypes: {
    planning: { planningSubType: string };
    design: { designSubType: string };
    meeting: { meetingType: string };
    purchase: { purchaseType: string };
    other: { otherType: string };
    indirect: { indirectType: string };
  };
}

// サイドバー状態の型定義
export interface SidebarState {
  selectedProjectCode: string;
  purposeProjectCode: string;
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

// UI状態の型定義（階層構造を含む）
export interface UIState {
  // 4段階階層
  hierarchy: HierarchyState;
  
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

// 統合されたイベント状態
export interface EventState {
  // イベントデータ
  events: TimeGridEvent[];
  selectedEvent: TimeGridEvent | null;
  
  // UI状態（統合）
  ui: UIState;
  
  // サイドバー状態（イベントと連携）
  sidebar: SidebarState;
  
  // システム状態
  loading: boolean;
  error: string | null;
}

export type EventAction = 
  // イベントデータ関連
  | { type: 'SET_EVENTS'; payload: TimeGridEvent[] }
  | { type: 'ADD_EVENT'; payload: TimeGridEvent }
  | { type: 'UPDATE_EVENT'; payload: { eventId: string; event: TimeGridEvent } }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'SET_SELECTED_EVENT'; payload: TimeGridEvent | null }
  
  // 階層状態関連
  | { type: 'SET_ACTIVE_TAB'; payload: 'project' | 'indirect' }
  | { type: 'SET_ACTIVE_SUBTAB'; payload: { tab: 'project' | 'indirect'; subTab: string } }
  | { type: 'SET_DETAIL_TAB'; payload: { mainTab: string; subTab: string; detailTab: string } }
  | { type: 'SET_BUSINESS_TYPE'; payload: { businessType: string; subType: string; value: string } }
  
  // UI状態関連
  | { type: 'SET_MODAL_OPEN'; payload: { modalType: string; isOpen: boolean } }
  | { type: 'SET_DRAG_STATE'; payload: { isDragging: boolean; draggedEvent: TimeGridEvent | null } }
  | { type: 'SET_RESIZE_STATE'; payload: { isResizing: boolean; resizedEvent: TimeGridEvent | null } }
  
  // サイドバー状態関連
  | { type: 'SET_SELECTED_PROJECT_CODE'; payload: string }
  | { type: 'SET_PURPOSE_PROJECT_CODE'; payload: string }
  | { type: 'SET_TAB_DETAIL'; payload: { tab: string; detail: string; value: string } }
  | { type: 'SET_INDIRECT_DETAIL'; payload: { detail: string; value: string } }
  | { type: 'UPDATE_SIDEBAR_STATE'; payload: Partial<SidebarState> }
  
  // 統合操作
  | { type: 'SYNC_EVENT_TO_SIDEBAR'; payload: TimeGridEvent }
  | { type: 'SYNC_SIDEBAR_TO_EVENT'; payload: { eventId: string; sidebarState: Partial<SidebarState> } }
  | { type: 'SYNC_HIERARCHY_TO_EVENT'; payload: { eventId: string; hierarchyState: Partial<HierarchyState> } }
  
  // システム状態
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR'; payload: void }; 