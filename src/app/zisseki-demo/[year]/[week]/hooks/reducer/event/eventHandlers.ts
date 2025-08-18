import { TimeGridEvent, EventState, HierarchyState } from './types';
import { EventAction } from './types';
import { eventActions } from './eventActions';

export interface EventHandlers {
  handleEventClick: (event: TimeGridEvent) => void;
  handleDeleteEvent: () => void;
  handleUpdateEvent: (updatedEvent: TimeGridEvent) => void;
  handleUpdateEventTabState: (eventId: string, tabState: {
    selectedTab?: string;
    selectedProjectSubTab?: string;
    selectedIndirectSubTab?: string;
    selectedIndirectDetailTab?: string;
    selectedOtherSubTab?: string;
  }) => void;
  updateActivityCodePrefix: (tab: string, subTab?: string) => void;
  // サイドバーとイベントの同期操作
  syncSidebarToSelectedEvent: () => void;
  // 階層状態の操作
  handleHierarchyChange: (level: 1 | 2 | 3 | 4, value: string, subValue?: string, detailValue?: string) => void;
  syncHierarchyToSelectedEvent: () => void;
}

export const createEventHandlers = (
  dispatch: React.Dispatch<EventAction>,
  state: EventState
): EventHandlers => {
  return {
    handleEventClick: (event: TimeGridEvent) => {
      console.log('イベントクリック:', event);
      
      try {
        // 1. イベントを選択状態に設定
        dispatch(eventActions.setSelectedEvent(event));
        
        // 2. イベントの属性でサイドバーとUIの状態を同期
        dispatch(eventActions.syncEventToSidebar(event));
        
        // 3. エラーをクリア
        dispatch(eventActions.clearError());
        
        console.log('イベント選択が完了しました:', event.title);
      } catch (error) {
        console.error('イベント選択エラー:', error);
        dispatch(eventActions.setError('イベントの選択に失敗しました'));
      }
    },

    handleDeleteEvent: () => {
      if (!state.selectedEvent) {
        dispatch(eventActions.setError('削除するイベントが選択されていません'));
        return;
      }

      try {
        dispatch(eventActions.deleteEvent(state.selectedEvent.id));
        dispatch(eventActions.setSelectedEvent(null)); // 選択状態をクリア
        dispatch(eventActions.clearError());
        console.log('イベントを削除しました:', state.selectedEvent.title);
      } catch (error) {
        console.error('イベント削除エラー:', error);
        dispatch(eventActions.setError('イベントの削除に失敗しました'));
      }
    },

    handleUpdateEvent: (updatedEvent: TimeGridEvent) => {
      // updatedEventにIDがない場合はselectedEventのIDを使用
      const eventToUpdate = updatedEvent.id ? updatedEvent : {
        ...updatedEvent,
        id: state.selectedEvent?.id || updatedEvent.id
      };

      if (!eventToUpdate.id) {
        console.error('更新するイベントのIDが見つかりません:', eventToUpdate);
        dispatch(eventActions.setError('更新するイベントのIDが見つかりません'));
        return;
      }

      try {
        dispatch(eventActions.updateEvent(eventToUpdate.id, eventToUpdate));
        dispatch(eventActions.setSelectedEvent(eventToUpdate)); // 選択状態を更新されたイベントに変更
        dispatch(eventActions.clearError());
        console.log('イベントを更新しました:', eventToUpdate.title);
      } catch (error) {
        console.error('イベント更新エラー:', error);
        dispatch(eventActions.setError('イベントの更新に失敗しました'));
      }
    },

    handleUpdateEventTabState: (eventId: string, tabState: {
      selectedTab?: string;
      selectedProjectSubTab?: string;
      selectedIndirectSubTab?: string;
      selectedIndirectDetailTab?: string;
      selectedOtherSubTab?: string;
    }) => {
      const targetEvent = state.events.find((event: TimeGridEvent) => event.id === eventId);
      if (!targetEvent) {
        console.error('タブ状態を更新するイベントが見つかりません:', eventId);
        return;
      }
      const updatedEvent = {
        ...targetEvent,
        ...tabState
      };

      dispatch(eventActions.updateEvent(eventId, updatedEvent));
      console.log('イベントのタブ状態を更新しました:', eventId, tabState);
    },

    updateActivityCodePrefix: (tab: string, subTab?: string) => {
      if (!state.selectedEvent) return;
      
      // 業務分類コードの更新ロジック
      let newActivityCode = state.selectedEvent.activityCode || '';
      
      // タブに基づいて業務分類コードを更新
      switch (tab) {
        case 'project':
          if (subTab === '計画') {
            newActivityCode = 'P001';
          } else if (subTab === '設計') {
            newActivityCode = 'D001';
          } else if (subTab === '会議') {
            newActivityCode = 'M001';
          } else if (subTab === '購入品') {
            newActivityCode = 'P001';
          } else if (subTab === 'その他') {
            newActivityCode = 'O001';
          }
          break;
        case 'indirect':
          newActivityCode = 'I001';
          break;
        default:
          // デフォルトの場合は既存のコードを維持
          break;
      }
      
      // イベントを更新
      const updatedEvent = {
        ...state.selectedEvent,
        activityCode: newActivityCode
      };
      
      dispatch(eventActions.updateEvent(state.selectedEvent.id, updatedEvent));
    },

    // サイドバーの現在の状態を選択中のイベントに反映
    syncSidebarToSelectedEvent: () => {
      if (!state.selectedEvent) {
        console.warn('選択中のイベントがないため、サイドバーの状態を同期できません');
        return;
      }

      try {
        // サイドバーの現在の状態を取得して、イベントに反映
        dispatch(eventActions.syncSidebarToEvent(state.selectedEvent.id, state.sidebar));
        console.log('サイドバーの状態をイベントに同期しました:', state.selectedEvent.id);
      } catch (error) {
        console.error('サイドバー状態の同期エラー:', error);
        dispatch(eventActions.setError('サイドバー状態の同期に失敗しました'));
      }
    },

    // 階層状態の変更を処理
    handleHierarchyChange: (level: 1 | 2 | 3 | 4, value: string, subValue?: string, detailValue?: string) => {
      try {
        switch (level) {
          case 1: // メインタブ
            dispatch(eventActions.setActiveTab(value as 'project' | 'indirect'));
            break;
          case 2: // サブタブ
            if (subValue) {
              dispatch(eventActions.setActiveSubTab(value as 'project' | 'indirect', subValue));
            }
            break;
          case 3: // 詳細タブ
            if (subValue && detailValue) {
              dispatch(eventActions.setDetailTab(value, subValue, detailValue));
            }
            break;
          case 4: // 業務タイプ
            if (subValue && detailValue) {
              dispatch(eventActions.setBusinessType(value, subValue, detailValue));
            }
            break;
        }
        
        // 選択中のイベントがある場合は、階層状態をイベントに同期
        if (state.selectedEvent) {
          dispatch(eventActions.syncHierarchyToEvent(state.selectedEvent.id, state.ui.hierarchy));
        }
        
        console.log('階層状態を更新しました:', { level, value, subValue, detailValue });
      } catch (error) {
        console.error('階層状態更新エラー:', error);
        dispatch(eventActions.setError('階層状態の更新に失敗しました'));
      }
    },

    // 階層状態を選択中のイベントに同期
    syncHierarchyToSelectedEvent: () => {
      if (!state.selectedEvent) {
        console.warn('選択中のイベントがないため、階層状態を同期できません');
        return;
      }

      try {
        dispatch(eventActions.syncHierarchyToEvent(state.selectedEvent.id, state.ui.hierarchy));
        console.log('階層状態をイベントに同期しました:', state.selectedEvent.id);
      } catch (error) {
        console.error('階層状態の同期エラー:', error);
        dispatch(eventActions.setError('階層状態の同期に失敗しました'));
      }
    }
  };
}; 