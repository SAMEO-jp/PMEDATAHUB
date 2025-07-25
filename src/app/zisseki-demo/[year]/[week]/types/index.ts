// プロジェクト関連の型定義
export interface Project {
  projectCode?: string;
  projectName?: string;
  isProject?: string;
  projectNumber?: string;
  name?: string;
  [key: string]: any; // 追加のプロパティを許可
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
  activityCode?: string;
  purposeProject?: string;
  departmentCode?: string;
  // サブタブ関連のプロパティ
  planningSubType?: string;
  estimateSubType?: string;
  designSubType?: string;
  travelType?: string;
  stakeholderType?: string;
  documentType?: string;
  documentMaterial?: string;
  subTabType?: string;
  activityColumn?: string;
  businessCode?: string;
  indirectType?: string;
  indirectDetailType?: string;
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

// TimeGrid用のEvent型を拡張
export type TimeGridEvent = Event & {
  top: number;
  height: number;
  color: string;
  unsaved?: boolean;
}

export type TimeGridProps = {
  year: number;
  week: number;
  events: TimeGridEvent[];
  workTimes: WorkTimeData[];
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
  selectedEvent: Event | null;
  _hasChanges: boolean;
  handleDeleteEvent: () => void;
  updateEvent: (updatedEvent: Event) => void;
  _employees: Employee[];
  projects: Project[];
  setSelectedEvent: (event: Event | null) => void;
  _currentUser: User;
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
  selectedEvent: Event | null;
  updateEvent: (event: Event) => void;
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