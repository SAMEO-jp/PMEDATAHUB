import { TimeGridEvent } from '../../../types';

// ========================================
// 1. 統合サイドバー状態型定義
// ========================================
export interface UnifiedSidebarState {
  // ========================================
  // 1. 階層状態（レベル1-4）
  // ========================================
  
  // レベル1: メインタブ
  activeTab: 'project' | 'indirect';
  
  // レベル2: サブタブ
  projectSubTab: '計画' | '設計' | '会議' | '購入品' | 'その他';
  indirectSubTab: '純間接' | '目的間接' | '控除時間';
  
  // レベル3: 詳細タブ
  detailTab: {
    project: {
      計画: '計画図' | '検討書' | '見積り';
      設計: '計画図' | '詳細図' | '組立図' | '改正図';
      会議: '内部定例' | '外部定例' | 'プロ進行' | 'その他';
      その他: '出張' | '〇対応' | 'プロ管理' | '資料' | 'その他';
      購入品: string;
    };
    indirect: {
      純間接: '日報入力' | '報告書作成' | 'その他';
      目的間接: '〇先対応' | '品質管理' | '安全管理';
      控除時間: '休憩' | '私用' | 'その他';
    };
  };
  
  // レベル4: 業務タイプ
  businessType: {
    planningSubType: string;
    designSubType: string;
    meetingType: string;
    otherType: string;
    purchaseType: string;
    indirectType: string;
    indirectDetailType: string;
  };

  // ========================================
  // 2. プロジェクト情報
  // ========================================
  selectedProjectCode: string;
  purposeProjectCode: string;
  
  // プロジェクト一覧
  projects: Array<{
    projectCode?: string;
    projectName?: string;
    name?: string;
    isProject?: string;
    projectNumber?: string;
    [key: string]: string | boolean | number | undefined;
  }>;

  // ========================================
  // 3. ユーザー情報
  // ========================================
  currentUser: {
    id: string;
    name: string;
    department?: string;
    projects?: Array<{
      projectCode?: string;
      projectName?: string;
      name?: string;
    }>;
  } | null;

  // ========================================
  // 4. 設備情報
  // ========================================
  equipmentNumber: string;
  equipmentName: string;
  equipmentOptions: Array<{ id: string; name: string }>;
  isLoadingEquipment: boolean;

  // ========================================
  // 5. 購入品情報
  // ========================================
  selectedPurchaseItem: string;
  purchaseItems: Array<{ keyID: string; itemName: string; itemDescription?: string }>;
  isLoadingPurchaseItems: boolean;

  // ========================================
  // 6. イベント基本情報
  // ========================================
  eventInfo: {
    title: string;
    description: string;
    startDateTime: string;
    endDateTime: string;
    project: string;
    activityCode: string;
  };

  // ========================================
  // 7. システム状態
  // ========================================
  selectedEvent: TimeGridEvent | null;
  hasChanges: boolean;
  loading: boolean;
  error: string | null;
  
  // API状態（将来の拡張用）
  isSaving: boolean;
  saveMessage: { type: string; text: string; } | null;
  apiError: string | null;

  // ========================================
  // 8. 表示制御フラグ（プロパティベース）
  // ========================================
  showProjectCode: boolean;
  showSubTabs: boolean;
  showDetailTabs: boolean;
  showEquipment: boolean;
  showPurchaseItems: boolean;
  showEventForm: boolean;
  showIndirectContent: boolean;
  showEventInfo: boolean;
  showEmptyState: boolean;
}

// ========================================
// 9. 操作関数の型定義
// ========================================
export interface UnifiedSidebarActions {
  // 階層状態変更
  setActiveTab: (tab: 'project' | 'indirect') => void;
  setProjectSubTab: (subTab: UnifiedSidebarState['projectSubTab']) => void;
  setIndirectSubTab: (subTab: UnifiedSidebarState['indirectSubTab']) => void;
  setDetailTab: (mainTab: string, subTab: string, detailTab: string) => void;
  setBusinessType: (type: string, value: string) => void;
  
  // プロジェクト情報変更
  setSelectedProjectCode: (code: string) => void;
  setPurposeProjectCode: (code: string) => void;
  setProjects: (projects: UnifiedSidebarState['projects']) => void;
  
  // ユーザー情報変更
  setCurrentUser: (user: UnifiedSidebarState['currentUser']) => void;
  
  // 設備情報変更
  setEquipmentNumber: (number: string) => void;
  setEquipmentName: (name: string) => void;
  setEquipmentOptions: (options: Array<{ id: string; name: string }>) => void;
  setIsLoadingEquipment: (loading: boolean) => void;
  
  // 購入品情報変更
  setSelectedPurchaseItem: (item: string) => void;
  setPurchaseItems: (items: Array<{ keyID: string; itemName: string; itemDescription?: string }>) => void;
  setIsLoadingPurchaseItems: (loading: boolean) => void;
  
  // イベント情報変更
  updateEventInfo: (updates: Partial<UnifiedSidebarState['eventInfo']>) => void;
  
  // イベント操作
  setSelectedEvent: (event: TimeGridEvent | null) => void;
  updateEvent: (event: TimeGridEvent) => void;
  deleteEvent: () => void;
  
  // システム状態
  setHasChanges: (hasChanges: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // API状態
  setIsSaving: (saving: boolean) => void;
  setSaveMessage: (message: { type: string; text: string; } | null) => void;
  setApiError: (error: string | null) => void;
}

// ========================================
// 10. 統合型定義
// ========================================
export interface UnifiedSidebarContext {
  state: UnifiedSidebarState;
  actions: UnifiedSidebarActions;
}
