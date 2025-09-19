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
 * - UI状態の管理（選択、モーダル、ドラッグ等）
 * - localStorageとの同期
 * - エラーハンドリング
 * - セレクター機能
 */
export const useEventReducer = () => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

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
    
    // UI状態セレクター
    getUIState: () => state.ui,
    
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

  return {
    // 状態
    ...state,
    // アクション
    dispatch,
    setSelectedEvent,
    createEvent,
    updateEvent,
    // ハンドラー
    ...handlers,
    // セレクター
    ...selectors
  };
}; 