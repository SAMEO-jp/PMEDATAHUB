"use client"

import { useState, useEffect } from "react"
import { DisplayEvent, ResizableEvent } from "../types/event"
import { RESIZE_TIME_SLOT_HEIGHT, RESIZE_SNAP_MINUTES } from "../utils/resizeConstants"
import { formatDateTimeForStorage } from "../utils/dateUtils"
import { CalculatedHeight } from "../types/height"

interface UseResizeEventProps {
  onResize: (event: DisplayEvent) => void;
  year?: number;
  week?: number;
  currentUser?: { user_id: string };
  events?: DisplayEvent[];
}

export const useResizeEvent = ({ onResize, year, week, currentUser, events }: UseResizeEventProps) => {
  const [isResizing, setIsResizing] = useState(false)
  const [resizingEvent, setResizingEvent] = useState<DisplayEvent | null>(null)
  const [resizeDirection, setResizeDirection] = useState<"top" | "bottom" | null>(null)
  const [initialStartTime, setInitialStartTime] = useState<Date | null>(null)
  const [initialEndTime, setInitialEndTime] = useState<Date | null>(null)
  const [initialMouseY, setInitialMouseY] = useState<number | null>(null)
  const [currentEvent, setCurrentEvent] = useState<DisplayEvent | null>(null)

  const handleResizeStart = (event: DisplayEvent, direction: "top" | "bottom", mouseY: number) => {
    console.log('🔧 リサイズ開始:', {
      eventId: event.key_id,
      direction: direction,
      originalHeight: event.originalHeight,  // 新規作成時の元の高さ
      eventHeight: event.height,  // イベントの基本高さ
      mouseY: mouseY,
      timestamp: new Date().toISOString()
    })

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
      } as ResizableEvent
      
      // calculatedHeightをheightに書き直してから保存
      const eventForStorage = {
        ...finalEvent,
        height: finalEvent.calculatedHeight,  // calculatedHeightをheightに設定
        // calculatedHeightは保存時に除外
      };
      
      // ローカルストレージ保存用のデータからcalculatedHeightを除外
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { calculatedHeight, ...eventForStorageWithoutCalculated } = eventForStorage;
      
      console.log('🔧 リサイズ終了:', {
        eventId: finalEvent.key_id,
        finalHeight: finalEvent.height,  // 最終的なイベントの高さ
        originalHeight: finalEvent.originalHeight,  // 新規作成時の元の高さ
        heightForStorage: eventForStorage.height,  // 保存用の高さ
        finalStartDateTime: finalEvent.startDateTime,
        finalEndDateTime: finalEvent.endDateTime,
        finalTop: finalEvent.top,
        resizeDirection: resizeDirection,
        timestamp: new Date().toISOString()
      })
      
      onResize(finalEvent)
      
      // ローカルストレージへの保存
      if (year && week && currentUser && events) {
        const updatedEvents = events.map((event) =>
          event.key_id === finalEvent.key_id ? eventForStorageWithoutCalculated : event
        );
        
        console.log('💾 リサイズ完了 - ローカルストレージ保存:', {
          eventId: finalEvent.key_id,
          storageKey: `week_data_${year}_${week}_${currentUser.user_id}`,
          totalEvents: updatedEvents.length,
          finalStartDateTime: finalEvent.startDateTime,
          finalEndDateTime: finalEvent.endDateTime,
          finalTop: finalEvent.top,
          finalHeight: finalEvent.height,
          heightForStorage: eventForStorage.height,
          originalHeight: finalEvent.originalHeight,
          unsaved: finalEvent.unsaved,
          timestamp: new Date().toISOString()
        })
        
        localStorage.setItem(
          `week_data_${year}_${week}_${currentUser.user_id}`,
          JSON.stringify(updatedEvents)
        );
        
        // ローカルストレージ保存後の確認
        const savedData = localStorage.getItem(`week_data_${year}_${week}_${currentUser.user_id}`);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          const savedEvent = parsedData.find((e: DisplayEvent) => e.key_id === finalEvent.key_id);
          
          console.log('💾 リサイズ完了 - ローカルストレージ保存後確認:', {
            eventId: finalEvent.key_id,
            savedEventHeight: savedEvent?.height,
            savedEventTop: savedEvent?.top,
            savedEventStartDateTime: savedEvent?.startDateTime,
            savedEventEndDateTime: savedEvent?.endDateTime,
            savedEventOriginalHeight: savedEvent?.originalHeight,
            heightMatch: savedEvent?.height === eventForStorage.height,
            topMatch: savedEvent?.top === finalEvent.top,
            startDateTimeMatch: savedEvent?.startDateTime === finalEvent.startDateTime,
            endDateTimeMatch: savedEvent?.endDateTime === finalEvent.endDateTime,
            timestamp: new Date().toISOString()
          })
        }
      }
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
    const deltaMinutes = Math.round((deltaY / RESIZE_TIME_SLOT_HEIGHT) * 60)
    // 10分刻みにスナップ
    const snappedDeltaMinutes = Math.round(deltaMinutes / RESIZE_SNAP_MINUTES) * RESIZE_SNAP_MINUTES

    const newEvent = { ...resizingEvent } as ResizableEvent
    const newStartTime = new Date(initialStartTime)
    const newEndTime = new Date(initialEndTime)

    if (resizeDirection === "top") {
      newStartTime.setMinutes(newStartTime.getMinutes() + snappedDeltaMinutes)
      if (newStartTime < newEndTime) {
        newEvent.startDateTime = formatDateTimeForStorage(newStartTime)
        newEvent.top = (newStartTime.getHours() * 60 + newStartTime.getMinutes()) * (RESIZE_TIME_SLOT_HEIGHT / 60)
        
        // リサイズ時に計算される新しい高さ
        const calculatedHeight: CalculatedHeight = ((newEndTime.getTime() - newStartTime.getTime()) / (1000 * 60 * 60)) * RESIZE_TIME_SLOT_HEIGHT
        newEvent.calculatedHeight = calculatedHeight
        newEvent.height = calculatedHeight  // イベントの基本高さも更新
        
        setCurrentEvent(newEvent)
      }
    } else if (resizeDirection === "bottom") {
      newEndTime.setMinutes(newEndTime.getMinutes() + snappedDeltaMinutes)
      if (newEndTime > newStartTime) {
        newEvent.endDateTime = formatDateTimeForStorage(newEndTime)
        
        // リサイズ時に計算される新しい高さ
        const calculatedHeight: CalculatedHeight = ((newEndTime.getTime() - newStartTime.getTime()) / (1000 * 60 * 60)) * RESIZE_TIME_SLOT_HEIGHT
        newEvent.calculatedHeight = calculatedHeight
        newEvent.height = calculatedHeight  // イベントの基本高さも更新
        
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
