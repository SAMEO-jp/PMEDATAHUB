import { EventState, TimeGridEvent } from './types';

export const eventSelectors = {
  getEventById: (state: EventState, eventId: string): TimeGridEvent | undefined => {
    return state.events.find(event => event.id === eventId);
  },

  getEventsByDate: (state: EventState, date: Date): TimeGridEvent[] => {
    const targetDate = date.toDateString();
    return state.events.filter(event => {
      const eventDate = new Date(event.startDateTime).toDateString();
      return eventDate === targetDate;
    });
  },

  getActiveEvents: (state: EventState): TimeGridEvent[] => {
    return state.events.filter(event => {
      // 現在時刻より後のイベントをアクティブとする
      const now = new Date();
      const eventStart = new Date(event.startDateTime);
      return eventStart >= now;
    });
  },

  getPastEvents: (state: EventState): TimeGridEvent[] => {
    return state.events.filter(event => {
      // 現在時刻より前のイベントを過去とする
      const now = new Date();
      const eventStart = new Date(event.startDateTime);
      return eventStart < now;
    });
  },

  getEventsByCategory: (state: EventState, category: string): TimeGridEvent[] => {
    return state.events.filter(event => event.category === category);
  },

  getSelectedEvent: (state: EventState): TimeGridEvent | null => {
    return state.selectedEvent;
  },

  isEventSelected: (state: EventState, eventId: string): boolean => {
    return state.selectedEvent?.id === eventId;
  },

  getModalState: (state: EventState, modalType: string): boolean => {
    return state.ui.modals[modalType] || false;
  },

  getDragState: (state: EventState) => {
    return state.ui.dragState;
  },

  getResizeState: (state: EventState) => {
    return state.ui.resizeState;
  },

  getActiveTab: (state: EventState): string => {
    // TODO: hierarchy property is not available, returning default
    return 'project';
  },

  getActiveSubTab: (state: EventState, tab: string): string => {
    // TODO: hierarchy property is not available, returning default
    return tab === 'project' ? '計画' : '目的間接';
  },

  getLoadingState: (state: EventState): boolean => {
    return state.loading;
  },

  getErrorState: (state: EventState): string | null => {
    return state.error;
  },

  getEventsCount: (state: EventState): number => {
    return state.events.length;
  },
  
  // 新規追加（プロジェクト選択状態）
  getSelectedProjectCode: (state: EventState): string => {
    // TODO: sidebar property is not available
    return '';
  },
  
  getPurposeProjectCode: (state: EventState): string => {
    // TODO: sidebar property is not available
    return '';
  },
  
  // 新規追加（タブ詳細状態）
  getTabDetails: (state: EventState) => {
    // TODO: sidebar property is not available
    return {};
  },
  
  getPlanningTabDetails: (state: EventState) => {
    // TODO: sidebar property is not available
    return '';
  },
  
  getDesignTabDetails: (state: EventState) => {
    // TODO: sidebar property is not available
    return '';
  },
  
  getMeetingTabDetails: (state: EventState) => {
    // TODO: sidebar property is not available
    return '';
  },
  
  getOtherTabDetails: (state: EventState) => {
    // TODO: sidebar property is not available
    return '';
  },
  
  getIndirectTabDetails: (state: EventState) => {
    // TODO: sidebar property is not available
    return '';
  }
}; 