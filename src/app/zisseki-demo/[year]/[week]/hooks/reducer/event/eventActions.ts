import { EventAction, TimeGridEvent, SidebarState, HierarchyState } from './types';

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

  // 階層状態関連
  setActiveTab: (tab: 'project' | 'indirect'): EventAction => ({
    type: 'SET_ACTIVE_TAB',
    payload: tab
  }),

  setActiveSubTab: (tab: 'project' | 'indirect', subTab: string): EventAction => ({
    type: 'SET_ACTIVE_SUBTAB',
    payload: { tab, subTab }
  }),

  setDetailTab: (mainTab: string, subTab: string, detailTab: string): EventAction => ({
    type: 'SET_DETAIL_TAB',
    payload: { mainTab, subTab, detailTab }
  }),

  setBusinessType: (businessType: string, subType: string, value: string): EventAction => ({
    type: 'SET_BUSINESS_TYPE',
    payload: { businessType, subType, value }
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
  
  // サイドバー状態関連
  setSelectedProjectCode: (code: string): EventAction => ({
    type: 'SET_SELECTED_PROJECT_CODE',
    payload: code
  }),

  setPurposeProjectCode: (code: string): EventAction => ({
    type: 'SET_PURPOSE_PROJECT_CODE',
    payload: code
  }),

  setTabDetail: (tab: string, detail: string, value: string): EventAction => ({
    type: 'SET_TAB_DETAIL',
    payload: { tab, detail, value }
  }),

  setIndirectDetail: (detail: string, value: string): EventAction => ({
    type: 'SET_INDIRECT_DETAIL',
    payload: { detail, value }
  }),

  updateSidebarState: (sidebarState: Partial<SidebarState>): EventAction => ({
    type: 'UPDATE_SIDEBAR_STATE',
    payload: sidebarState
  }),

  // 統合操作
  syncEventToSidebar: (event: TimeGridEvent): EventAction => ({
    type: 'SYNC_EVENT_TO_SIDEBAR',
    payload: event
  }),

  syncSidebarToEvent: (eventId: string, sidebarState: Partial<SidebarState>): EventAction => ({
    type: 'SYNC_SIDEBAR_TO_EVENT',
    payload: { eventId, sidebarState }
  }),

  syncHierarchyToEvent: (eventId: string, hierarchyState: Partial<HierarchyState>): EventAction => ({
    type: 'SYNC_HIERARCHY_TO_EVENT',
    payload: { eventId, hierarchyState }
  })
}; 