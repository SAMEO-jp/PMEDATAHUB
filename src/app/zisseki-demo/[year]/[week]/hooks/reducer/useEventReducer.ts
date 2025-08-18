// ========================================
// リファクタリング完了版
// ========================================
/*
## 分割完了
- 型定義: event/types.ts
- ストレージ: event/eventStorage.ts  
- アクション: event/eventActions.ts
- リデューサー: event/eventReducer.ts
- セレクター: event/eventSelectors.ts
- ハンドラー: event/eventHandlers.ts
- メインフック: useEventReducerNew.ts

## 移行手順
1. 既存のuseEventReducerをuseEventReducerNewに置き換え
2. 動作確認
3. 旧ファイル削除
*/

import { useReducer, useEffect, useCallback, useMemo } from 'react';
import { eventReducer, initialState } from './event/eventReducer';
import { eventActions } from './event/eventActions';
import { eventStorage } from './event/eventStorage';
import { createEventHandlers } from './event/eventHandlers';
import { TimeGridEvent } from './event/types';

/**
 * 統合されたイベント・UI状態管理フック（リファクタリング版）
 * 
 * 機能:
 * - イベントデータの管理（CRUD操作）
 * - UI状態の管理（選択、モーダル、ドラッグ、タブ等）
 * - 4段階階層状態の管理
 * - localStorageとの同期
 * - エラーハンドリング
 * - セレクター機能
 */
export const useEventReducer = () => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  // デバッグ用: 状態の変更を追跡
  console.log('useEventReducer - current state:', {
    eventsCount: state.events.length,
    selectedEvent: state.selectedEvent?.title || 'null',
    activeTab: state.ui.hierarchy.activeTab,
    selectedProjectCode: state.sidebar.selectedProjectCode,
    error: state.error
  });

  // 初回ロード
  useEffect(() => {
    const loadEvents = () => {
      dispatch(eventActions.setLoading(true));
      try {
        const events = eventStorage.load();
        dispatch(eventActions.setEvents(events));
        console.log('イベントデータを読み込みました:', events.length);
      } catch (error) {
        console.error('イベントデータの読み込みに失敗しました:', error);
        dispatch(eventActions.setError('イベントデータの読み込みに失敗しました'));
      }
    };
    loadEvents();
  }, []);

  // state.eventsが変更されたときにlocalStorageに保存
  useEffect(() => {
    if (!state.loading) {
      eventStorage.save(state.events);
    }
  }, [state.events, state.loading]);

  // アクション関数をメモ化
  const actions = useMemo(() => ({
    createEvent: (newEvent: TimeGridEvent) => {
      console.log('createEvent呼び出し:', newEvent);
      dispatch(eventActions.addEvent(newEvent));
      return newEvent;
    },
    updateEvent: (eventId: string, updatedEvent: TimeGridEvent) => {
      console.log('updateEvent呼び出し:', eventId, updatedEvent);
      dispatch(eventActions.updateEvent(eventId, updatedEvent));
    },
    deleteEvent: (eventId: string) => {
      console.log('deleteEvent呼び出し:', eventId);
      dispatch(eventActions.deleteEvent(eventId));
    },
    setSelectedEvent: (event: TimeGridEvent | null) => {
      console.log('選択イベント設定:', event?.title || 'null');
      dispatch(eventActions.setSelectedEvent(event));
    },
    setModalOpen: (modalType: string, isOpen: boolean) => {
      console.log('モーダル状態設定:', modalType, isOpen);
      dispatch(eventActions.setModalOpen(modalType, isOpen));
    },
    setDragState: (isDragging: boolean, draggedEvent: TimeGridEvent | null) => {
      console.log('ドラッグ状態設定:', isDragging, draggedEvent?.title);
      dispatch(eventActions.setDragState(isDragging, draggedEvent));
    },
    setResizeState: (isResizing: boolean, resizedEvent: TimeGridEvent | null) => {
      console.log('リサイズ状態設定:', isResizing, resizedEvent?.title);
      dispatch(eventActions.setResizeState(isResizing, resizedEvent));
    },
    
    // 階層状態管理
    setActiveTab: (tab: 'project' | 'indirect') => {
      console.log('アクティブタブ設定:', tab);
      dispatch(eventActions.setActiveTab(tab));
    },
    setActiveSubTab: (tab: 'project' | 'indirect', subTab: string) => {
      console.log('アクティブサブタブ設定:', tab, subTab);
      dispatch(eventActions.setActiveSubTab(tab, subTab));
    },
    setDetailTab: (mainTab: string, subTab: string, detailTab: string) => {
      console.log('詳細タブ設定:', mainTab, subTab, detailTab);
      dispatch(eventActions.setDetailTab(mainTab, subTab, detailTab));
    },
    setBusinessType: (businessType: string, subType: string, value: string) => {
      console.log('業務タイプ設定:', businessType, subType, value);
      dispatch(eventActions.setBusinessType(businessType, subType, value));
    },
    
    setError: (error: string | null) => {
      console.log('エラー設定:', error);
      dispatch(eventActions.setError(error));
    },
    clearError: () => {
      console.log('エラークリア');
      dispatch(eventActions.clearError());
    },
    setLoading: (loading: boolean) => {
      dispatch(eventActions.setLoading(loading));
    },
    
    // サイドバー状態管理
    setSelectedProjectCode: (code: string) => {
      console.log('プロジェクトコード設定:', code);
      dispatch(eventActions.setSelectedProjectCode(code));
    },
    setPurposeProjectCode: (code: string) => {
      console.log('目的プロジェクトコード設定:', code);
      dispatch(eventActions.setPurposeProjectCode(code));
    },
    setTabDetail: (tab: string, detail: string, value: string) => {
      console.log('タブ詳細設定:', tab, detail, value);
      dispatch(eventActions.setTabDetail(tab, detail, value));
    },
    setIndirectDetail: (detail: string, value: string) => {
      console.log('間接業務詳細設定:', detail, value);
      dispatch(eventActions.setIndirectDetail(detail, value));
    },
    updateSidebarState: (sidebarState: any) => {
      console.log('サイドバー状態更新:', sidebarState);
      dispatch(eventActions.updateSidebarState(sidebarState));
    },
    
    // 統合操作
    syncEventToSidebar: (event: TimeGridEvent) => {
      console.log('イベントをサイドバーに同期:', event.title);
      dispatch(eventActions.syncEventToSidebar(event));
    },
    syncSidebarToEvent: (eventId: string) => {
      console.log('サイドバーをイベントに同期:', eventId);
      dispatch(eventActions.syncSidebarToEvent(eventId, state.sidebar));
    },
    syncHierarchyToEvent: (eventId: string) => {
      console.log('階層状態をイベントに同期:', eventId);
      dispatch(eventActions.syncHierarchyToEvent(eventId, state.ui.hierarchy));
    }
  }), []);

  // イベントハンドラーをメモ化
  const handlers = useMemo(() => 
    createEventHandlers(dispatch, state),
    [state.selectedEvent]
  );

  // セレクターをメモ化
  const selectors = useMemo(() => ({
    // 基本セレクター
    getEventById: (eventId: string) => state.events.find(event => event.id === eventId),
    getSelectedEvent: () => state.selectedEvent,
    
    // サイドバー状態セレクター
    getSidebarState: () => state.sidebar,
    getSelectedProjectCode: () => state.sidebar.selectedProjectCode,
    getPurposeProjectCode: () => state.sidebar.purposeProjectCode,
    getTabDetails: () => state.sidebar.tabDetails,
    
    // UI状態セレクター（階層構造を含む）
    getUIState: () => state.ui,
    getHierarchyState: () => state.ui.hierarchy,
    getActiveTab: () => state.ui.hierarchy.activeTab,
    getActiveSubTab: (tab: 'project' | 'indirect') => state.ui.hierarchy.activeSubTabs[tab],
    getDetailTab: (mainTab: string, subTab: string) => 
      state.ui.hierarchy.detailTabs[mainTab as keyof typeof state.ui.hierarchy.detailTabs]?.[subTab as any],
    getBusinessType: (businessType: string, subType: string) => 
      state.ui.hierarchy.businessTypes[businessType as keyof typeof state.ui.hierarchy.businessTypes]?.[subType as any],
    
    // システム状態
    getLoadingState: () => state.loading,
    getErrorState: () => state.error
  }), [state]);

  // イベントのタブ状態を更新（サイドバー用）
  const updateEventTabState = useCallback((eventId: string, tabState: {
    selectedTab?: string;
    selectedProjectSubTab?: string;
    selectedIndirectSubTab?: string;
    selectedIndirectDetailTab?: string;
    selectedOtherSubTab?: string;
  }) => {
    handlers.handleUpdateEventTabState(eventId, tabState);
  }, [handlers]);

  return {
    // 状態
    ...state,
    // アクション
    ...actions,
    // ハンドラー
    ...handlers,
    // セレクター
    ...selectors,
    // 特別な操作
    updateEventTabState
  };
}; 