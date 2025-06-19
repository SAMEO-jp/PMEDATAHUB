"use client"

import { useState, useEffect } from "react"
import { DisplayEvent } from "../types/event"
import { TIME_SLOT_HEIGHT } from "../utils/constants"

interface UseResizeEventProps {
  onResize: (event: DisplayEvent) => void;
}

export const useResizeEvent = ({ onResize }: UseResizeEventProps) => {
  const [isResizing, setIsResizing] = useState(false)
  const [resizingEvent, setResizingEvent] = useState<DisplayEvent | null>(null)
  const [resizeDirection, setResizeDirection] = useState<"top" | "bottom" | null>(null)
  const [initialStartTime, setInitialStartTime] = useState<Date | null>(null)
  const [initialEndTime, setInitialEndTime] = useState<Date | null>(null)
  const [initialMouseY, setInitialMouseY] = useState<number | null>(null)
  const [currentEvent, setCurrentEvent] = useState<DisplayEvent | null>(null)

  const handleResizeStart = (event: DisplayEvent, direction: "top" | "bottom", mouseY: number) => {
    setIsResizing(true)
    setResizingEvent(event)
    setCurrentEvent(event)
    setResizeDirection(direction)
    setInitialStartTime(new Date(event.startDateTime))
    setInitialEndTime(new Date(event.endDateTime))
    setInitialMouseY(mouseY)
  }

  const handleResizeEnd = () => {
    if (currentEvent) {
      // 最終的なイベントの状態を更新
      const finalEvent = {
        ...currentEvent,
        unsaved: true // 変更が保存されていないことを示すフラグ
      }
      onResize(finalEvent)
    }
    setIsResizing(false)
    setResizingEvent(null)
    setCurrentEvent(null)
    setResizeDirection(null)
    setInitialStartTime(null)
    setInitialEndTime(null)
    setInitialMouseY(null)
  }

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing || !resizingEvent || !initialStartTime || !initialEndTime || !initialMouseY) return

    const deltaY = e.clientY - initialMouseY
    const deltaMinutes = Math.round((deltaY / TIME_SLOT_HEIGHT) * 60)
    // 10分刻みにスナップ
    const snappedDeltaMinutes = Math.round(deltaMinutes / 10) * 10

    const newEvent = { ...resizingEvent }
    const newStartTime = new Date(initialStartTime)
    const newEndTime = new Date(initialEndTime)

    if (resizeDirection === "top") {
      newStartTime.setMinutes(newStartTime.getMinutes() + snappedDeltaMinutes)
      if (newStartTime < newEndTime) {
        newEvent.startDateTime = newStartTime.toISOString()
        newEvent.top = (newStartTime.getHours() * 60 + newStartTime.getMinutes()) * (TIME_SLOT_HEIGHT / 60)
        newEvent.height = ((newEndTime.getTime() - newStartTime.getTime()) / (1000 * 60 * 60)) * TIME_SLOT_HEIGHT
        setCurrentEvent(newEvent)
      }
    } else if (resizeDirection === "bottom") {
      newEndTime.setMinutes(newEndTime.getMinutes() + snappedDeltaMinutes)
      if (newEndTime > newStartTime) {
        newEvent.endDateTime = newEndTime.toISOString()
        newEvent.height = ((newEndTime.getTime() - newStartTime.getTime()) / (1000 * 60 * 60)) * TIME_SLOT_HEIGHT
        setCurrentEvent(newEvent)
      }
    }

    onResize(newEvent)
  }

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove)
      window.addEventListener('mouseup', handleResizeEnd)
    }

    return () => {
      window.removeEventListener('mousemove', handleResizeMove)
      window.removeEventListener('mouseup', handleResizeEnd)
    }
  }, [isResizing, resizingEvent, initialStartTime, initialEndTime, initialMouseY, resizeDirection, currentEvent])

  return { handleResizeStart }
}
