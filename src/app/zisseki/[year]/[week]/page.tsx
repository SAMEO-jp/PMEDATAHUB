/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import WeekSidebar from "./components/sidebar/WeekSidebar"
import TimeGrid from "./components/TimeGrid"
import { 
  getWeekNumber, 
  getWeekDates, 
  getWeekDaysArray,
  formatDateTimeForStorage, 
  parseDateTime, 
  minuteSlots 
} from "./utils/dateUtils"
import { createNewEvent } from "./utils/eventUtils"
import { useUIStore } from "./store/uiStore"
import { useResizeEvent } from "./hooks/useResizeEvent"
import { getZissekiData, setZissekiDataChanged, hasZissekiDataChanged, clearZissekiData } from './lib/zisseki_get_data'
import { getEmployees, getProjects, getCurrentUser } from './lib/user_data'
import { useEventHandlers } from './hooks/EventHandlers/useEventHandlers'
import { User } from './types/user'
import { DisplayEvent } from './types/event'
import { TabType, SubTabType } from './types/sidebar'

export default function WeekShiwakePage() {
  // ==========================================
  // パラメータとルーティング
  // ==========================================
  const params = useParams()
  const year = Number.parseInt(params.year as string) || new Date().getFullYear()
  const week = Number.parseInt(params.week as string) || getWeekNumber(new Date())
 
  // ==========================================
  // 日付と時間の計算
  // ==========================================
  const { startDate, endDate } = getWeekDates(year, week)
  const weekDays = getWeekDaysArray(startDate, endDate)
  const timeSlots = Array.from({ length: 24 }, (_, i) => i)
  const today = new Date()
  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // ==========================================
  // 状態管理
  // ==========================================
  // UI Store
  const {
    selectedTab,
    selectedProjectSubTab,
    indirectSubTab,
    saveMessage,
    apiError,
    setSelectedTab,
    setSelectedProjectSubTab,
    setIndirectSubTab,
    setSaveMessage,
    setApiError
  } = useUIStore()

  // ローカルステート
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [employees, setEmployees] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [activeEvent, setActiveEvent] = useState<any>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [isCtrlPressed, setIsCtrlPressed] = useState(false)

  const [currentUser, setCurrentUser] = useState<User>({
    user_id: "999999",
    name: "仮",
  })
  const previousYearWeek = useRef<{ year: number; week: number }>({ year, week })

  const { handleResizeStart } = useResizeEvent({
    onResize: (updatedEvent) => {
      setEvents(prevEvents => {
        const updatedEvents = prevEvents.map((event) =>
          event.key_id === updatedEvent.key_id ? updatedEvent : event
        );
        return updatedEvents;
      });
      setSelectedEvent(updatedEvent);
      setHasChanges(true);
    }
  });

  // ==========================================
  // データ読み込み関数
  // ==========================================
  const fetchCurrentUser = async () => {
    try {
      const userData = await getCurrentUser();
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      console.error('ユーザー情報の取得中にエラーが発生しました:', error);
      throw error;
    }
  }

  const loadWeekData = async (forceRefresh = false) => {
    setLoading(true)
    setApiError(null)
    try {
      // ユーザー情報の取得
      const userData = await fetchCurrentUser()      
      // 週データの取得
      const formattedEvents = await getZissekiData(year, week, userData.user_id)
      setEvents(formattedEvents)
      setSelectedEvent(null)
    } catch (error: unknown) {
      setApiError(error instanceof Error ? error.message : String(error))
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // イベントハンドラ
  // ==========================================
  const {
    handleEventClick,
    handleTimeSlotClick,
    handleDragStart,
    handleDragEnd,
    handleSaveWeekData,
    handleDeleteEvent,
    handleRefresh,
    isSaving
  } = useEventHandlers(
    events,
    setEvents,
    setSelectedEvent,
    setActiveEvent,
    setHasChanges,
    setSaveMessage,
    year,
    week,
    currentUser,
    selectedTab as TabType,
    selectedProjectSubTab as SubTabType,
    projects
  );

  // ==========================================
  // ライフサイクル
  // ==========================================
  useEffect(() => {
    loadWeekData()
  }, [year, week])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasChanges])

  useEffect(() => {
    const handleRouteChange = () => {
      if (hasChanges) {
        if (window.confirm('保存されていない変更があります。このページを離れますか？')) {
          clearZissekiData(year, week, currentUser.user_id)
        } else {
          window.history.pushState(null, '', `/week-shiwake/${year}/${week}`)
        }
      }
    }

    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [hasChanges, year, week, currentUser.user_id])

  // ==========================================
  // レンダリング
  // ==========================================
  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-auto">
        <DndProvider backend={HTML5Backend}>
          <TimeGrid
            weekDays={weekDays}
            timeSlots={timeSlots}
            minuteSlots={minuteSlots}
            events={events}
            selectedEvent={selectedEvent}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
            onResizeStart={handleResizeStart}
            isToday={isToday}
            setSelectedEvent={setSelectedEvent}
            year={year}
            week={week}
            currentUser={currentUser}
            hasChanges={hasChanges}
            setHasChanges={setHasChanges}
            onCopyEvent={undefined}
            onDeleteEvent={(event) => handleDeleteEvent(event.key_id)}
            workTimes={[]}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        </DndProvider>
      </div>
      <WeekSidebar
        year={year}
        week={week}
        selectedTab={selectedTab as TabType}
        selectedProjectSubTab={selectedProjectSubTab as SubTabType}
        indirectSubTab={indirectSubTab}
        setSelectedTab={setSelectedTab}
        setSelectedProjectSubTab={setSelectedProjectSubTab}
        onIndirectSubTabChange={setIndirectSubTab}
        onSave={handleSaveWeekData}
        onRefresh={handleRefresh}
        isSaving={isSaving}
        saveMessage={saveMessage}
        apiError={apiError}
        events={events}
        onEventClick={handleEventClick}
        onAddEvent={(day: Date) => handleTimeSlotClick(day, 9, 0)}
        onDeleteEvent={handleDeleteEvent}
        onSaveEvent={handleSaveWeekData}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        setHasChanges={setHasChanges}
        currentUser={currentUser}
        projects={projects}
        updateEvent={null}
        hasChanges={hasChanges}
      />
    </div>
  )
}
