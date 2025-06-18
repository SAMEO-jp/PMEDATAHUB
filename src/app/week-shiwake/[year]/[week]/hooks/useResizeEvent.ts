"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { formatDateTimeForStorage, parseDateTime, TIME_SLOT_HEIGHT } from "../utils/dateUtils"
import { setZissekiDataChanged } from "../lib/zisseki_get_data"

export function useResizeEvent(
  events: any[],
  setEvents: (events: any[]) => void,
  selectedEvent: any,
  setSelectedEvent: (event: any) => void,
  year: number,
  week: number
) {
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStartY, setResizeStartY] = useState(0)
  const [resizeStartHeight, setResizeStartHeight] = useState(0)
  const [resizeDirection, setResizeDirection] = useState<"top" | "bottom" | null>(null)

  const handleResizeStart = (event: any, direction: "top" | "bottom") => {
    if (!selectedEvent) return

    setIsResizing(true)
    setResizeStartY(event.clientY)
    setResizeDirection(direction)

    const eventElement = document.getElementById(`event-${selectedEvent.id}`)
    if (eventElement) {
      setResizeStartHeight(eventElement.offsetHeight)
    }
  }

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!selectedEvent || !resizeDirection) return

      const deltaY = e.clientY - resizeStartY
      const deltaMinutes = Math.round((deltaY / TIME_SLOT_HEIGHT) * 30)

      const startDateTime = parseDateTime(selectedEvent.startDateTime)
      const endDateTime = parseDateTime(selectedEvent.endDateTime)

      let newStartDateTime = new Date(startDateTime)
      let newEndDateTime = new Date(endDateTime)

      if (resizeDirection === "top") {
        newStartDateTime.setMinutes(startDateTime.getMinutes() + deltaMinutes)
      } else {
        newEndDateTime.setMinutes(endDateTime.getMinutes() + deltaMinutes)
      }

      // 最小時間を30分に制限
      const minDuration = 30
      const duration = (newEndDateTime.getTime() - newStartDateTime.getTime()) / (1000 * 60)
      if (duration < minDuration) {
        if (resizeDirection === "top") {
          newStartDateTime = new Date(newEndDateTime.getTime() - minDuration * 60 * 1000)
        } else {
          newEndDateTime = new Date(newStartDateTime.getTime() + minDuration * 60 * 1000)
        }
      }

      const updatedEvent = {
        ...selectedEvent,
        startDateTime: formatDateTimeForStorage(newStartDateTime),
        endDateTime: formatDateTimeForStorage(newEndDateTime),
        top: (newStartDateTime.getHours() * 60 + newStartDateTime.getMinutes()) * (TIME_SLOT_HEIGHT / 30),
        height: ((newEndDateTime.getTime() - newStartDateTime.getTime()) / (1000 * 60)) * (TIME_SLOT_HEIGHT / 30),
        unsaved: true,
      }

      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id ? updatedEvent : event
      )

      setEvents(updatedEvents)
      setSelectedEvent(updatedEvent)
      setZissekiDataChanged(year, week, selectedEvent.user_id, true)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeDirection(null)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing, resizeStartY, resizeDirection, selectedEvent, events, setEvents, setSelectedEvent, year, week])

  return { handleResizeStart }
}
