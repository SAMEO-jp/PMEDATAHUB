// プロジェクト関連の型定義
export interface Project {
  projectCode?: string;
  projectName?: string;
  isProject?: string;
  projectNumber?: string;
  name?: string;
  [key: string]: string | boolean | number | undefined; // 追加のプロパティを許可
}

// 設備関連の型定義
export interface Equipment {
  equipment_id: string;
  equipment_Name: string;
}

// 購入品関連の型定義
export interface PurchaseItem {
  keyID: string;
  itemName: string;
  itemDescription?: string;
  equipmentNumber?: string;
}

// 業務コード関連の型定義をインポート
import type {
  BusinessCode
} from './businessCode';

// イベント関連の型定義
export interface Event {
  id: string;
  title: string;
  description: string;
  project: string;
  setsubi?: string; // 選択された装備（製番）
  kounyu?: string; // 選択された購入品（管理番号）
  user_id?: string; // ユーザーID（個人実績データのため追加）
  equipmentNumber?: string; // 装置番号（製番）
  equipmentName?: string; // 装置名
  equipment_id?: string; // 装置ID
  equipment_Name?: string; // 装置名（別名）
  itemName?: string; // 購入品名
  startDateTime: string;
  endDateTime: string;
  activityCode?: BusinessCode; // 業務分類コード（型安全性を向上）
  purposeProject?: string;
  departmentCode?: string;



  // UI関連のプロパティ
  top?: number;
  height?: number;
  status?: string;
}

// TimeGrid関連の型定義
export type WorkTimeData = {
  date: string;
  startTime?: string;
  endTime?: string;
}

// UI用: TimeGridEvent型を復活
export type TimeGridEvent = Event & {
  top: number;
  height: number;
  color: string;
  unsaved?: boolean;
  category?: string;
  employeeNumber?: string;
  activityCode?: string; // 業務コードを追加
  selectedTab?: string;
  selectedProjectSubTab?: string;
  selectedIndirectSubTab?: string;
  selectedIndirectDetailTab?: string;
  selectedOtherSubTab?: string;
  dayIndex?: number; // 週内での日付インデックス（0-6）
  source?: string; // イベントのソース（outlook, manual等）
  hierarchy?: { // 階層情報
    activeTab: string;
    activeSubTabs: {
      [key: string]: string;
    };
  };
}

export type TimeGridProps = {
  year: number;
  week: number;
  events: TimeGridEvent[];
  workTimes: WorkTimeData[];
  selectedEvent: TimeGridEvent | null;
  onEventClick: (event: TimeGridEvent) => void;
  onTimeSlotClick: (day: Date, hour: number, minute: number) => void; // ダブルクリックでイベント作成
  onWorkTimeChange: (date: string, startTime: string, endTime: string) => void;
}

// 従業員関連の型定義
export interface Employee {
  id: string;
  name: string;
  department?: string;
}

// ユーザー関連の型定義
export interface User {
  id: string;
  name: string;
  department?: string;
  projects?: Project[];
}

// サイドバーのプロパティ型定義
export type ZissekiSidebarProps = {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  selectedProjectSubTab: string;
  _setSelectedProjectSubTab: (subTab: string) => void;
  selectedEvent: TimeGridEvent | null;
  _hasChanges: boolean;
  handleDeleteEvent: () => void;
  updateEvent: (updatedEvent: Partial<TimeGridEvent>) => void;
  _employees: Employee[];
  projects: Project[];
  setSelectedEvent: (event: TimeGridEvent | null) => void;
  _currentUser: User | null;
  // 間接業務サブタブ用のプロパティを追加
  indirectSubTab?: string;
  setIndirectSubTab?: (subTab: string) => void;
};

// プロジェクト選択コンポーネントのプロパティ型定義
export type ProjectSelectProps = {
  projects: Project[];
  selectedProjectCode: string;
  onChange: (projectCode: string) => void;
  label: string;
  selectedEvent: TimeGridEvent | null;
  updateEvent: (event: Partial<TimeGridEvent>) => void;
  isProjectTab: boolean;
};

// 間接業務選択コンポーネントのプロパティ型定義
export type IndirectSelectProps = {
  projects: Project[];
  selectedProjectCode: string;
  onChange: (projectCode: string) => void;
  label: string;
};

// 設備オプションの型定義
export interface EquipmentOption {
  id: string;
  name: string;
}

// 検索結果アイテムの型定義
export interface SearchResultItem {
  id: string;
  name: string;
  description?: string;
}

// 最近使用アイテムの型定義
export interface RecentItem {
  id: string;
  name: string;
  description: string;
} 

// 統合サイドバー型定義のエクスポート
// export * from './unifiedSidebar'; 