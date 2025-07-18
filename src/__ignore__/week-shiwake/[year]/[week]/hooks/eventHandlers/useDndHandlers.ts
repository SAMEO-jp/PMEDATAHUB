// ==========================================
// ファイル名: useDndHandlers.ts
// 機能: DnD操作イベントハンドラー（ドラッグ、ドロップ）
// 技術: React Hooks, TypeScript, DnD Kit
// ==========================================

import { DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import { formatDateTimeForStorage, parseDateTime } from '../../utils/dateUtils'
import { saveWeekDataToStorage, setWeekDataChanged } from '../../lib/client-storage'

interface UseDndHandlersProps {
  year: number
  week: number
  events: any[]
  isCtrlPressed: boolean
  setEvents: (events: any[]) => void
  setActiveEvent: (event: any) => void
  setSelectedEvent: (event: any) => void
  selectedEvent: any
  generateNewEventId: (draggedEvent: any, newStart: Date) => string
  formatEventForUpdate: (event: any, newStart: Date, duration: number) => any
}

export const useDndHandlers = ({
  year,
  week,
  events,
  isCtrlPressed,
  setEvents,
  setActiveEvent,
  setSelectedEvent,
  selectedEvent,
  generateNewEventId,
  formatEventForUpdate
}: UseDndHandlersProps) => {
  // ==========================================
  // ドラッグ開始
  // ==========================================
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const data = active.data.current
    if (!data) return
    
    const draggedEvent = data.event
    const dragHandleOffset = data.dragHandleOffset || 16

    setActiveEvent({
      ...draggedEvent,
      dragHandleOffset,
    })
  }

  // ==========================================
  // ドラッグ終了
  // ==========================================
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveEvent(null)

    if (!over) return

    const data = active.data.current
    if (!data) return
    
    const draggedEvent = data.event
    const overData = over.data.current
    if (!overData) return
    
    const { day, hour, minute = 0 } = overData

    const originalStart = parseDateTime(draggedEvent.startDateTime)
    const originalEnd = parseDateTime(draggedEvent.endDateTime)
    const duration = (originalEnd.getTime() - originalStart.getTime()) / 60000

    const newStart = new Date(day)
    newStart.setHours(hour)
    newStart.setMinutes(minute)
    newStart.setSeconds(0)
    newStart.setMilliseconds(0)

    if (isCtrlPressed) {
      const newId = generateNewEventId(draggedEvent, newStart)
      const copiedEvent = {
        ...draggedEvent,
        id: newId,
        keyID: newId,
        startDateTime: formatDateTimeForStorage(newStart),
        endDateTime: formatDateTimeForStorage(new Date(newStart.getTime() + duration * 60000)),
        top: newStart.getHours() * 64 + (newStart.getMinutes() / 60) * 64,
        unsaved: true,
      }

      const updatedEvents = [...events, copiedEvent]
      setEvents(updatedEvents)

      saveWeekDataToStorage(year, week, updatedEvents)
      setWeekDataChanged(year, week, true)
    } else {
      const updatedEvents = events.map((e) => {
        if (e.id === draggedEvent.id) {
          return formatEventForUpdate(e, newStart, duration)
        }
        return e
      })

      setEvents(updatedEvents)
      saveWeekDataToStorage(year, week, updatedEvents)
      setWeekDataChanged(year, week, true)

      if (selectedEvent && selectedEvent.id === draggedEvent.id) {
        setSelectedEvent(formatEventForUpdate(selectedEvent, newStart, duration))
      }
    }
  }

  return {
    handleDragStart,
    handleDragEnd
  }
} 