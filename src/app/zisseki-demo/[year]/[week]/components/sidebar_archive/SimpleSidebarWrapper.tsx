"use client"

import React from "react"
import { useEventContext } from "../../context/EventContext"
import { SimpleSidebar } from "./SimpleSidebar"

/**
 * シンプルなサイドバーのラッパーコンポーネント
 * 
 * 機能:
 * - EventContextから選択されたイベントを取得
 * - イベント更新をEventContextに反映
 * - シンプルなサイドバーを表示
 */
export const SimpleSidebarWrapper = () => {
  const { selectedEvent, updateEvent } = useEventContext()

  // イベント更新ハンドラー
  const handleEventUpdate = (updatedEvent: any) => {
    console.log("SimpleSidebar: イベント更新", updatedEvent)
    updateEvent(updatedEvent.id, updatedEvent)
  }

  return (
    <SimpleSidebar
      selectedEvent={selectedEvent}
      onEventUpdate={handleEventUpdate}
    />
  )
}
