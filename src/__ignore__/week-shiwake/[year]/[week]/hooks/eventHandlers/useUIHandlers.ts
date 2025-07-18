// ==========================================
// ファイル名: useUIHandlers.ts
// 機能: UI操作イベントハンドラー（クリック、選択）
// 技術: React Hooks, TypeScript
// ==========================================

import { createNewEvent } from '../../utils/eventUtils'
import { saveWeekDataToStorage, setWeekDataChanged } from '../../lib/client-storage'

interface UseUIHandlersProps {
  year: number
  week: number
  events: any[]
  currentUser: any
  selectedTab: string
  selectedProjectSubTab: string
  projects: any[]
  setEvents: (events: any[]) => void
  setSelectedEvent: (event: any) => void
  validateUserInfo: () => boolean
  selectedEvent: any
  createProjectColor: (project: string) => string
}

export const useUIHandlers = ({
  year,
  week,
  events,
  currentUser,
  selectedTab,
  selectedProjectSubTab,
  projects,
  setEvents,
  setSelectedEvent,
  validateUserInfo,
  selectedEvent,
  createProjectColor
}: UseUIHandlersProps) => {
  // ==========================================
  // イベントクリック
  // ==========================================
  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
  }

  // ==========================================
  // タイムスロットクリック
  // ==========================================
  const handleTimeSlotClick = (day: Date, hour: number, minute = 0) => {
    if (!validateUserInfo()) return

    const newEvent = createNewEvent({
      day,
      hour,
      minute,
      employeeNumber: currentUser.employeeNumber,
      selectedTab,
      selectedProjectSubTab,
      projects,
    })

    const eventWithKeyId = {
      ...newEvent,
      keyID: newEvent.id
    }

    const updatedEvents = [...events, eventWithKeyId]
    setEvents(updatedEvents)
    setSelectedEvent(eventWithKeyId)

    saveWeekDataToStorage(year, week, updatedEvents)
    setWeekDataChanged(year, week, true)
  }

  // ==========================================
  // イベント更新
  // ==========================================
  const updateEvent = (updatedEvent: any) => {
    let updatedColor = updatedEvent.color
    if (updatedEvent.project && updatedEvent.project !== selectedEvent?.project) {
      updatedColor = createProjectColor(updatedEvent.project)
    }

    const updatedEvents = events.map((e) => {
      if (e.id === updatedEvent.id) {
        return { ...updatedEvent, color: updatedColor, unsaved: true }
      }
      return e
    })
    setEvents(updatedEvents)
    setSelectedEvent({ ...updatedEvent, color: updatedColor })
    // TODO: 型の不整合 - WeekEvent[]をClientEvent[]として渡している
    saveWeekDataToStorage(year, week, updatedEvents as any) // 一時的な型キャスト
    setWeekDataChanged(year, week, true)
  }

  return {
    handleEventClick,
    handleTimeSlotClick,
    updateEvent
  }
} 