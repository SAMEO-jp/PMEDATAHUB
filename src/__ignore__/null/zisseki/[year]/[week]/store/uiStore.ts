import { create } from 'zustand'
import { DisplayEvent } from '../types/event'

interface UIState {
  // タブ関連の状態
  selectedTab: string
  selectedProjectSubTab: string
  indirectSubTab: string

  // メッセージ関連の状態
  saveMessage: { type: string; text: string } | null
  apiError: string | null

  // アクション
  setSelectedTab: (tab: string) => void
  setSelectedProjectSubTab: (subTab: string) => void
  setIndirectSubTab: (subTab: string) => void
  setSaveMessage: (message: { type: string; text: string } | null) => void
  setApiError: (error: string | null) => void
  clearMessages: () => void

  // ドラッグ状態
  isDragging: boolean
  setIsDragging: (isDragging: boolean) => void

  // ドラッグ中のイベントデータ
  draggedEvent: DisplayEvent | null
  setDraggedEvent: (event: DisplayEvent | null) => void
}

export const useUIStore = create<UIState>((set) => ({
  // 初期状態
  selectedTab: "project",
  selectedProjectSubTab: "計画",
  indirectSubTab: "純間接",
  saveMessage: null,
  apiError: null,
  isDragging: false,
  draggedEvent: null,

  // アクション
  setSelectedTab: (tab) => set({ selectedTab: tab }),
  setSelectedProjectSubTab: (subTab) => set({ selectedProjectSubTab: subTab }),
  setIndirectSubTab: (subTab) => set({ indirectSubTab: subTab }),
  setSaveMessage: (message) => set({ saveMessage: message }),
  setApiError: (error) => set({ apiError: error }),
  clearMessages: () => set({ saveMessage: null, apiError: null }),
  setIsDragging: (isDragging) => set({ isDragging }),
  setDraggedEvent: (event) => set({ draggedEvent: event }),
})) 