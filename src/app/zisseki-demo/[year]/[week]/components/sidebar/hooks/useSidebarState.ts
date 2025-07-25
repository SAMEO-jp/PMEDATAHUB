import { create } from 'zustand'
import { Event } from '../../../types'

interface SidebarState {
  // プロジェクト関連
  selectedProjectCode: string
  purposeProjectCode: string
  
  // サブタブ関連
  selectedOtherSubTab: string
  selectedIndirectDetailTab: string
  
  // セッター
  setSelectedProjectCode: (code: string) => void
  setPurposeProjectCode: (code: string) => void
  setSelectedOtherSubTab: (tab: string) => void
  setSelectedIndirectDetailTab: (tab: string) => void
  
  // イベント更新ロジック
  updateEventWithActivityCode: (event: Event, tab: string, subTab?: string, indirectSubTab?: string) => Event
}

export const useSidebarState = create<SidebarState>((set, get) => ({
  // 初期状態
  selectedProjectCode: '',
  purposeProjectCode: '',
  selectedOtherSubTab: '〇先対応',
  selectedIndirectDetailTab: '日報入力',
  
  // セッター
  setSelectedProjectCode: (code: string) => set({ selectedProjectCode: code }),
  setPurposeProjectCode: (code: string) => set({ purposeProjectCode: code }),
  setSelectedOtherSubTab: (tab: string) => set({ selectedOtherSubTab: tab }),
  setSelectedIndirectDetailTab: (tab: string) => set({ selectedIndirectDetailTab: tab }),
  
  // イベント更新ロジック
  updateEventWithActivityCode: (event: Event, tab: string, subTab?: string, indirectSubTab?: string) => {
    const { selectedIndirectDetailTab } = get()
    
    // 業務分類コード生成ロジック（簡易版）
    const generateActivityCode = () => {
      const baseCode = tab === 'project' ? 'P' : 'I'
      const subCode = subTab ? subTab.slice(0, 2) : ''
      const detailCode = tab === 'indirect' ? indirectSubTab?.slice(0, 2) : ''
      const finalCode = tab === 'indirect' ? selectedIndirectDetailTab?.slice(0, 2) : ''
      
      return `${baseCode}${subCode}${detailCode}${finalCode}`.toUpperCase()
    }
    
    const newCode = generateActivityCode()
    
    const updatedEvent = {
      ...event,
      activityCode: newCode,
      businessCode: newCode
    }
    
    if (tab === 'indirect' && indirectSubTab) {
      updatedEvent.indirectType = indirectSubTab
    }
    
    return updatedEvent
  }
})) 