// イベントアイテムの型定義
export interface EventItem {
  key_id: string
  user_id: string
  startDateTime: string
  endDateTime: string
  subject: string
  content?: string
  type?: string
  organizer?: string
  projectNumber?: string
  position?: string
  facility?: string
  status?: string
  businessCode?: string
  departmentCode?: string
  weekCode?: string
  activityMaincode?: string
  activitySubcode?: string
  activityCode?: string
  equipmenNumber?: string
  projectType?: string
  phase?: string
  projectSubType?: string
  height?: string
  top?: string
  color?: string
  createdAt?: string
  updatedAt?: string
  // クライアント表示用の追加フィールド
  unsaved?: boolean
}

// クライアント表示用のイベント型定義（EventItemと同じ）
export type ClientEvent = EventItem; 