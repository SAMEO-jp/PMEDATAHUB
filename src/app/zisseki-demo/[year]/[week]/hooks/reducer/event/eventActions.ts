import { EventAction, TimeGridEvent } from './types';

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

  updateEvent: (eventId: string, event: Partial<TimeGridEvent>): EventAction => ({
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

  // システム状態
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
  })
}; 