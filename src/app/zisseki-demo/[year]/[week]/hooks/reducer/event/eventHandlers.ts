import { TimeGridEvent, EventState } from './types';
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
}

export const createEventHandlers = (
  dispatch: React.Dispatch<EventAction>,
  state: EventState
): EventHandlers => {
  return {
    handleEventClick: (event: TimeGridEvent) => {
      console.log('イベントクリック:', event);
      
      // 1. イベントを選択状態に設定
      dispatch(eventActions.setSelectedEvent(event));
      
      // 2. イベントの属性でサイドバーの状態を初期化
      dispatch(eventActions.syncEventToSidebar(event));
      
      // 3. タブ状態を反映
      if (event.selectedTab) {
        dispatch(eventActions.setActiveTab(event.selectedTab));
      }
      if (event.selectedProjectSubTab) {
        dispatch(eventActions.setActiveSubTab('project', event.selectedProjectSubTab));
      }
      if (event.selectedIndirectSubTab) {
        dispatch(eventActions.setActiveSubTab('indirect', event.selectedIndirectSubTab));
      }
      
      dispatch(eventActions.clearError()); // エラーをクリア
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
      if (!state.selectedEvent) {
        dispatch(eventActions.setError('更新するイベントが選択されていません'));
        return;
      }

      try {
        dispatch(eventActions.updateEvent(state.selectedEvent.id, updatedEvent));
        dispatch(eventActions.setSelectedEvent(updatedEvent)); // 選択状態を更新されたイベントに変更
        dispatch(eventActions.clearError());
        console.log('イベントを更新しました:', updatedEvent.title);
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
      let newBusinessCode = state.selectedEvent.businessCode || '';
      
      // タブに基づいて業務分類コードを更新
      switch (tab) {
        case 'project':
          if (subTab === '計画') {
            newActivityCode = 'P001';
            newBusinessCode = 'P001';
          } else if (subTab === '設計') {
            newActivityCode = 'D001';
            newBusinessCode = 'D001';
          } else if (subTab === '会議') {
            newActivityCode = 'M001';
            newBusinessCode = 'M001';
          } else if (subTab === '購入品') {
            newActivityCode = 'P001';
            newBusinessCode = 'P001';
          } else if (subTab === 'その他') {
            newActivityCode = 'O001';
            newBusinessCode = 'O001';
          }
          break;
        case 'indirect':
          newActivityCode = 'I001';
          newBusinessCode = 'I001';
          break;
        default:
          // デフォルトの場合は既存のコードを維持
          break;
      }
      
      // イベントを更新
      const updatedEvent = {
        ...state.selectedEvent,
        activityCode: newActivityCode,
        businessCode: newBusinessCode
      };
      
      dispatch(eventActions.updateEvent(state.selectedEvent.id, updatedEvent));
    }
  };
}; 