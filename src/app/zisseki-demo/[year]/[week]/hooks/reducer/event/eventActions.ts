import { EventAction, TimeGridEvent } from './types';

export const eventActions = {
  // イベントデータ関連
  setEvents: (events: TimeGridEvent[]): EventAction => ({
    type: 'SET_EVENTS',
    payload: events
  }),

  addEvent: (event: TimeGridEvent): EventAction => ({
    type: 'ADD_EVENT',
    payload: event
  }),

  updateEvent: (eventId: string, event: TimeGridEvent): EventAction => ({
    type: 'UPDATE_EVENT',
    payload: { eventId, event }
  }),

  deleteEvent: (eventId: string): EventAction => ({
    type: 'DELETE_EVENT',
    payload: eventId
  }),

  // UI状態関連
  setSelectedEvent: (event: TimeGridEvent | null): EventAction => ({
    type: 'SET_SELECTED_EVENT',
    payload: event
  }),

  setModalOpen: (modalType: string, isOpen: boolean): EventAction => ({
    type: 'SET_MODAL_OPEN',
    payload: { modalType, isOpen }
  }),

  setDragState: (isDragging: boolean, draggedEvent: TimeGridEvent | null): EventAction => ({
    type: 'SET_DRAG_STATE',
    payload: { isDragging, draggedEvent }
  }),

  setResizeState: (isResizing: boolean, resizedEvent: TimeGridEvent | null): EventAction => ({
    type: 'SET_RESIZE_STATE',
    payload: { isResizing, resizedEvent }
  }),

  setActiveTab: (tab: string): EventAction => ({
    type: 'SET_ACTIVE_TAB',
    payload: tab
  }),

  setActiveSubTab: (tab: string, subTab: string): EventAction => ({
    type: 'SET_ACTIVE_SUBTAB',
    payload: { tab, subTab }
  }),

  // 共通状態
  setLoading: (loading: boolean): EventAction => ({
    type: 'SET_LOADING',
    payload: loading
  }),

  setError: (error: string | null): EventAction => ({
    type: 'SET_ERROR',
    payload: error
  }),

  clearError: (): EventAction => ({
    type: 'CLEAR_ERROR',
    payload: undefined
  }),
  
  // 新規追加（プロジェクト選択）
  // 選択中のイベントのプロジェクト属性を更新
  setSelectedProjectCode: (code: string): EventAction => ({
    type: 'SET_SELECTED_PROJECT_CODE',
    payload: code
  }),
  setPurposeProjectCode: (code: string): EventAction => ({
    type: 'SET_PURPOSE_PROJECT_CODE',
    payload: code
  }),
  
  // 新規追加（タブ詳細状態）
  // 選択中のイベントのタブ詳細属性を更新（サイドバー操作で呼び出し）
  setTabDetail: (tab: string, detail: string, value: string): EventAction => ({
    type: 'SET_TAB_DETAIL',
    payload: { tab, detail, value }
  }),
  
  // 新規追加（間接業務詳細）
  // 選択中のイベントの間接業務詳細属性を更新
  setIndirectDetail: (detail: string, value: string): EventAction => ({
    type: 'SET_INDIRECT_DETAIL',
    payload: { detail, value }
  }),
  
  // 新規追加（イベント選択時の状態反映）
  // イベント選択時にサイドバーの状態をイベントの属性で初期化
  syncEventToSidebar: (event: TimeGridEvent): EventAction => ({
    type: 'SYNC_EVENT_TO_SIDEBAR',
    payload: event
  })
}; 