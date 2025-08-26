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
// import { eventStorage } from './event/eventStorage';
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
  useEffect(() => {
    if (state.selectedEvent && state.selectedEvent.id) {
      dispatch(eventActions.syncHierarchyToEvent(state.selectedEvent.id, state.ui.hierarchy));
    }
  }, [state.selectedEvent, state.ui.hierarchy, dispatch]);

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
    getDetailTab: (mainTab: string, subTab: string) => {
      const detailTabs = state.ui.hierarchy.detailTabs;
      if (mainTab === 'project' && 'project' in detailTabs) {
        return (detailTabs.project as any)[subTab];
      }
      if (mainTab === 'indirect' && 'indirect' in detailTabs) {
        return (detailTabs.indirect as any)[subTab];
      }
      return undefined;
    },
    getBusinessType: (businessType: string, subType: string) => {
      const businessTypes = state.ui.hierarchy.businessTypes;
      if (businessType in businessTypes) {
        return (businessTypes as any)[businessType][subType];
      }
      return undefined;
    },
    
    // システム状態
    getLoadingState: () => state.loading,
    getErrorState: () => state.error
  }), [state]);

  // 補助アクション
  const setSelectedEvent = useCallback((event: TimeGridEvent | null) => {
    dispatch(eventActions.setSelectedEvent(event));
  }, []);

  const createEvent = useCallback((event: TimeGridEvent) => {
    dispatch(eventActions.addEvent(event));
    return event;
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<TimeGridEvent>) => {
    dispatch(eventActions.updateEvent(id, updates));
  }, []);

  const setTabDetail = useCallback((tab: string, detail: string, value: string) => {
    dispatch(eventActions.setTabDetail(tab, detail, value));
  }, []);

  return {
    // 状態
    ...state,
    // アクション
    dispatch,
    setSelectedEvent,
    createEvent,
    updateEvent,
    setTabDetail,
    // ハンドラー
    ...handlers,
    // セレクター
    ...selectors
  };
}; 