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

// イベント関連の型定義
export interface Event {
  id: string;
  keyID?: string;
  title: string;
  description: string;
  project: string;
  equipmentNumber?: string;
  equipmentName?: string;
  equipment_id?: string;
  equipment_Name?: string;
  itemName?: string;
  startDateTime: string;
  endDateTime: string;
  activityCode?: string; // 業務分類コード（BusinessCodeと統合）
  purposeProject?: string;
  departmentCode?: string;
  // サブタブ関連のプロパティ
  planningSubType?: string;
  estimateSubType?: string;
  designSubType?: string;
  meetingType?: string;
  travelType?: string;
  stakeholderType?: string;
  documentType?: string;
  documentMaterial?: string;
  subTabType?: string;
  activityColumn?: string;
  // businessCodeを削除 - activityCodeに統合
  indirectType?: string;
  indirectDetailType?: string;
  top?: number;
  height?: number;
  status?: string;
  // タブ状態を保存するプロパティ
  selectedTab?: string;           // "project" | "indirect"
  selectedProjectSubTab?: string; // "計画" | "設計" | "会議" | "購入" | "その他"
  selectedIndirectSubTab?: string; // "純間接" | "目的間接" | "控除時間"
  selectedIndirectDetailTab?: string; // 詳細タブ
  selectedOtherSubTab?: string;   // その他のサブタブ
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
}

export type TimeGridProps = {
  year: number;
  week: number;
  events: TimeGridEvent[];
  workTimes: WorkTimeData[];
  selectedEvent: TimeGridEvent | null;
  onEventClick: (event: TimeGridEvent) => void;
  onTimeSlotClick: (day: Date, hour: number, minute: number) => void;
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
  updateEvent: (updatedEvent: TimeGridEvent) => void;
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
  updateEvent: (event: TimeGridEvent) => void;
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
export * from './unifiedSidebar'; 