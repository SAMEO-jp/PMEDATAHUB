import { TimeGridEvent, EventState } from './types';
import { EventAction } from './types';
import { eventActions } from './eventActions';

export interface EventHandlers {
  handleEventClick: (event: TimeGridEvent) => void;
  handleDeleteEvent: () => void;
  handleUpdateEvent: (updatedEvent: TimeGridEvent) => void;
  // サイドバーとイベントの同期操作
  syncSidebarToSelectedEvent: () => void;
  // 階層状態の操作
  syncHierarchyToSelectedEvent: () => void;
  // アクティブサブタブの設定
  setActiveSubTab: (tab: 'project' | 'indirect', subTab: string) => void;
  // アクティブタブの設定
  setActiveTab: (tab: 'project' | 'indirect') => void;
  // 業務分類コードプレフィックスの更新
  updateActivityCodePrefix: (tab: 'project' | 'indirect', subTab: string) => void;
}

export const createEventHandlers = (
  dispatch: React.Dispatch<EventAction>,
  state: EventState
): EventHandlers => {
  return {
    handleEventClick: (event: TimeGridEvent) => {
      try {
        dispatch(eventActions.setSelectedEvent(event));
      } catch (error) {
        console.error('階層状態の同期エラー:', error);
        dispatch(eventActions.setError('階層状態の同期に失敗しました'));
      }
    },
    
    handleDeleteEvent: () => {
      if (state.selectedEvent) {
        dispatch(eventActions.deleteEvent(state.selectedEvent.id));
      }
    },
    
    handleUpdateEvent: (updatedEvent: TimeGridEvent) => {
      dispatch(eventActions.updateEvent(updatedEvent.id, updatedEvent));
    },
    
    syncSidebarToSelectedEvent: () => {
      if (state.selectedEvent) {
        dispatch(eventActions.syncSidebarToEvent(state.selectedEvent.id, state.sidebar));
      }
    },
    
    syncHierarchyToSelectedEvent: () => {
      if (state.selectedEvent) {
        dispatch(eventActions.syncHierarchyToEvent(state.selectedEvent.id, state.ui.hierarchy));
      }
    },
    
    setActiveSubTab: (tab: 'project' | 'indirect', subTab: string) => {
      dispatch(eventActions.setActiveSubTab(tab, subTab));
    },
    
    setActiveTab: (tab: 'project' | 'indirect') => {
      dispatch(eventActions.setActiveTab(tab));
    },
    
    updateActivityCodePrefix: (tab: 'project' | 'indirect', subTab: string) => {
      // 業務分類コードプレフィックスの更新ロジック
      // 現在はsetActiveSubTabと同じ動作をする
      dispatch(eventActions.setActiveSubTab(tab, subTab));
    }
  };
}; 