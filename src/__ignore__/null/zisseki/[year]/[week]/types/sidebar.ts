// サブタブの定義
export const SUBTABS = {
  "その他": ["出張", "〇対応", "プロ管理", "資料", "その他"],
  "計画": ["計画図", "検討書", "見積り"],
  "設計": ["計画図", "詳細図", "組立図", "改正図"],
  "会議": ["内部定例", "外部定例", "プロ進行", "その他"]
} as const

export type TabType = keyof typeof SUBTABS
export type SubTabType = typeof SUBTABS[TabType][number]

// プロジェクトの型定義
export interface Project {
  id: string
  code: string
  name: string
}

// 設備データの型定義
export interface EquipmentData {
  projectCode: string
  equipmentNumber: string
  equipmentName: string
}

// 購入品データの型定義
export interface PurchaseData {
  equipmentNumber: string
  id: string
  name: string
  description: string
}

// イベントの型定義はevent.tsからインポート
import { Event } from './event';
import { User } from './user';

// ユーザー情報の型定義は共通の型を使用

// コンポーネントのプロパティ型定義
export interface WeekSidebarProps {
  events: Event[]
  onEventClick: (event: Event) => void
  onAddEvent: (day: Date) => void
  onDeleteEvent?: (event: Event) => void
  onSaveEvent: (day: Date) => void
  selectedEvent: Event | null
  setSelectedEvent: (event: Event | null) => void
  hasChanges: boolean
  setHasChanges: (hasChanges: boolean) => void
  year: number
  week: number
  currentUser: User
  selectedTab: TabType
  setSelectedTab: (tab: TabType) => void
  selectedProjectSubTab: SubTabType
  setSelectedProjectSubTab: (subTab: SubTabType) => void
  projects: Project[]
  updateEvent: ((event: Event) => void) | null
  indirectSubTab: string
  onIndirectSubTabChange: (subTab: string) => void
  onSave: () => void
  onRefresh: () => void
  isSaving: boolean
  saveMessage: { type: string; text: string; } | null
  apiError: string | null
}

// ProjectSelectのプロパティ型定義
export interface ProjectSelectProps {
  projects: Project[]
  selectedProjectCode: string
  onChange: (code: string) => void
  label: string
  selectedEvent: Event | null
  updateEvent: (event: Event) => void
  isProjectTab: boolean
}

// IndirectSelectの型定義
export type IndirectSubTabType = "純間接" | "目的間接" | "控除時間"

export const INDIRECT_SUBTABS: Record<IndirectSubTabType, string[]> = {
  "純間接": ["日報入力", "会議", "人事評価", "作業", "その他"],
  "目的間接": ["作業", "会議", "その他"],
  "控除時間": ["休憩／外出", "組合時間", "その他"]
}

export interface IndirectSelectProps {
  selectedEvent: Event | null
  updateEvent: (event: Event) => void
  indirectSubTab: string
  setIndirectSubTab: (subTab: string) => void
} 