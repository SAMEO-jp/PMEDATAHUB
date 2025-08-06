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
import { eventSelectors } from './event/eventSelectors';
import { createEventHandlers } from './event/eventHandlers';
import { TimeGridEvent } from './event/types';

/**
 * 統合されたイベント・UI状態管理フック（リファクタリング版）
 * 
 * 機能:
 * - イベントデータの管理（CRUD操作）
 * - UI状態の管理（選択、モーダル、ドラッグ、タブ等）
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
    activeTab: state.activeTab,
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
    setActiveTab: (tab: string) => {
      console.log('アクティブタブ設定:', tab);
      dispatch(eventActions.setActiveTab(tab));
    },
    setActiveSubTab: (tab: string, subTab: string) => {
      console.log('アクティブサブタブ設定:', tab, subTab);
      dispatch(eventActions.setActiveSubTab(tab, subTab));
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
    // 新規追加（プロジェクト選択）
    setSelectedProjectCode: (code: string) => {
      console.log('プロジェクトコード設定:', code);
      dispatch(eventActions.setSelectedProjectCode(code));
    },
    setPurposeProjectCode: (code: string) => {
      console.log('目的プロジェクトコード設定:', code);
      dispatch(eventActions.setPurposeProjectCode(code));
    },
    // 新規追加（タブ詳細状態）
    setTabDetail: (tab: string, detail: string, value: string) => {
      console.log('タブ詳細設定:', tab, detail, value);
      dispatch(eventActions.setTabDetail(tab, detail, value));
    },
    // 新規追加（間接業務詳細）
    setIndirectDetail: (detail: string, value: string) => {
      console.log('間接業務詳細設定:', detail, value);
      dispatch(eventActions.setIndirectDetail(detail, value));
    }
  }), []);

  // イベントハンドラーをメモ化
  const handlers = useMemo(() => 
    createEventHandlers(dispatch, state),
    [state.selectedEvent]
  );

  // セレクターをメモ化
  const selectors = useMemo(() => ({
    getEventById: (eventId: string) => eventSelectors.getEventById(state, eventId),
    getEventsByDate: (date: Date) => eventSelectors.getEventsByDate(state, date),
    getActiveEvents: () => eventSelectors.getActiveEvents(state),
    getPastEvents: () => eventSelectors.getPastEvents(state),
    getEventsByCategory: (category: string) => eventSelectors.getEventsByCategory(state, category),
    getSelectedEvent: () => eventSelectors.getSelectedEvent(state),
    isEventSelected: (eventId: string) => eventSelectors.isEventSelected(state, eventId),
    getModalState: (modalType: string) => eventSelectors.getModalState(state, modalType),
    getDragState: () => eventSelectors.getDragState(state),
    getResizeState: () => eventSelectors.getResizeState(state),
    getActiveTab: () => eventSelectors.getActiveTab(state),
    getActiveSubTab: (tab: string) => eventSelectors.getActiveSubTab(state, tab),
    getLoadingState: () => eventSelectors.getLoadingState(state),
    getErrorState: () => eventSelectors.getErrorState(state),
    getEventsCount: () => eventSelectors.getEventsCount(state),
    // 新規追加（プロジェクト選択状態）
    getSelectedProjectCode: () => eventSelectors.getSelectedProjectCode(state),
    getPurposeProjectCode: () => eventSelectors.getPurposeProjectCode(state),
    // 新規追加（タブ詳細状態）
    getTabDetails: () => eventSelectors.getTabDetails(state),
    getPlanningTabDetails: () => eventSelectors.getPlanningTabDetails(state),
    getDesignTabDetails: () => eventSelectors.getDesignTabDetails(state),
    getMeetingTabDetails: () => eventSelectors.getMeetingTabDetails(state),
    getOtherTabDetails: () => eventSelectors.getOtherTabDetails(state),
    getIndirectTabDetails: () => eventSelectors.getIndirectTabDetails(state)
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