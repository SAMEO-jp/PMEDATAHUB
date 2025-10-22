import { TimeGridEvent, EventState } from './types';
import { EventAction } from './types';
import { eventActions } from './eventActions';

export interface EventHandlers {
  handleEventClick: (event: TimeGridEvent) => void;
  handleDeleteEvent: () => void;
  handleUpdateEvent: (updatedEvent: Partial<TimeGridEvent>) => void;
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
    
    handleUpdateEvent: (updatedEvent: Partial<TimeGridEvent>) => {
      if (state.selectedEvent) {
        const mergedEvent = { ...state.selectedEvent, ...updatedEvent };
        dispatch(eventActions.updateEvent(mergedEvent.id, updatedEvent));
      }
    },
    
    syncSidebarToSelectedEvent: () => {
      // TODO: syncSidebarToEvent method is not available
      // if (state.selectedEvent) {
      //   dispatch(eventActions.syncSidebarToEvent(state.selectedEvent.id, state.sidebar));
      // }
    },
    
    syncHierarchyToSelectedEvent: () => {
      // TODO: syncHierarchyToEvent method is not available
      // if (state.selectedEvent) {
      //   dispatch(eventActions.syncHierarchyToEvent(state.selectedEvent.id, state.ui.hierarchy));
      // }
    },
    
    setActiveSubTab: (tab: 'project' | 'indirect', subTab: string) => {
      // TODO: setActiveSubTab method is not available
      // dispatch(eventActions.setActiveSubTab(tab, subTab));
    },
    
    setActiveTab: (tab: 'project' | 'indirect') => {
      // TODO: setActiveTab method is not available
      // dispatch(eventActions.setActiveTab(tab));
    },
    
    updateActivityCodePrefix: (tab: 'project' | 'indirect', subTab: string) => {
      // 業務分類コードプレフィックスの更新ロジック
      // 現在はsetActiveSubTabと同じ動作をする
      // TODO: setActiveSubTab method is not available
      // dispatch(eventActions.setActiveSubTab(tab, subTab));
    }
  };
}; 