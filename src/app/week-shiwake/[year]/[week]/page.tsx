"use client"

import {
  // React
  useState,
  useEffect,
  useRef,

  // DnD
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  restrictToWindowEdges,

  // データベース
  saveWeekAchievements,
  deleteAchievement,
  setWeekDataChanged,
  hasWeekDataChanged,
  saveWeekDataToStorage,
  clearWeekData,

  // コンポーネント
  WeekSidebar,
  TimeGrid,
  EventDragOverlay,

  // ユーティリティ
  getWeekDates,
  getWeekDaysArray,
  formatDateTimeForStorage,
  parseDateTime,
  FIFTEEN_MIN_HEIGHT,
  minuteSlots,
  createNewEvent,
  useResizeEvent,
  customDropAnimation
} from "./imports"
import { useUIStore } from "./store/uiStore"
import { useWorkTimes } from './hooks/useWorkTimes';
import { saveWeekData } from './lib/weekDataManager'
import { useWeekData } from './hooks/useWeekData'; // Import the new hook

export default function WeekShiwakePage() {
  // ==========================================
  // Hooks
  // ==========================================
  const {
    loading,
    apiError,
    events,
    setEvents,
    employees,
    projects,
    currentUser,
    loadWeekData,
    year,
    week
  } = useWeekData(); // Use the new custom hook

  const {
    selectedTab,
    selectedProjectSubTab,
    indirectSubTab,
    saveMessage,
    setSelectedTab,
    setSelectedProjectSubTab,
    setIndirectSubTab,
    setSaveMessage,
  } = useUIStore()

  // ==========================================
  // Local State (that remains)
  // ==========================================
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [activeEvent, setActiveEvent] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isCtrlPressed, setIsCtrlPressed] = useState(false)
  const previousYearWeek = useRef<{ year: number; week: number }>({ year, week })

  // ==========================================
  // Date and Time Calculations
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
  // Custom Hooks
  // ==========================================
  const { handleResizeStart } = useResizeEvent(events, setEvents, selectedEvent, setSelectedEvent, year, week)
  const {
    workTimes,
    initializeWorkTimes,
    loadWorkTimesFromDb,
    handleWorkTimeChange,
    saveWorkTimes
  } = useWorkTimes(year, week, weekDays, currentUser)

  // ==========================================
  // DnD Settings
  // ==========================================
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor),
  )

  // ==========================================
  // Event Handlers
  // ==========================================
  const handleSaveWeekData = async () => {
    await saveWeekData({
      year,
      week,
      events,
      workTimes,
      saveWorkTimes,
      loadWeekData, // from the hook
      loadWorkTimesFromDb,
      setSaveMessage,
      setIsSaving
    })
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
  }

  const handleTimeSlotClick = (day: Date, hour: number, minute = 0) => {
    if (!currentUser || !currentUser.employeeNumber) {
      console.error("ユーザー情報が正しく設定されていません")
      alert("ユーザー情報が正しく設定されていません。ログインし直してください。")
      return
    }

    const newEvent = createNewEvent({
      day,
      hour,
      minute,
      employeeNumber: currentUser.employeeNumber,
      selectedTab,
      selectedProjectSubTab,
      projects,
    })

    const updatedEvents = [...events, newEvent]
    setEvents(updatedEvents)
    setSelectedEvent(newEvent)

    saveWeekDataToStorage(year, week, updatedEvents)
    setWeekDataChanged(year, week, true)
  }

  const handleDragStart = (event: any) => {
    const { active } = event
    const draggedEvent = active.data.current.event
    const dragHandleOffset = active.data.current.dragHandleOffset || 16

    setActiveEvent({
      ...draggedEvent,
      dragHandleOffset,
    })
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    setActiveEvent(null)

    if (!over) return

    const draggedEvent = active.data.current.event
    const { day, hour, minute = 0 } = over.data.current
    const dragHandleOffset = active.data.current.dragHandleOffset || FIFTEEN_MIN_HEIGHT

    const originalStart = parseDateTime(draggedEvent.startDateTime)
    const originalEnd = parseDateTime(draggedEvent.endDateTime)
    const duration = (originalEnd.getTime() - originalStart.getTime()) / 60000

    const newStart = new Date(day)
    newStart.setHours(hour)
    newStart.setMinutes(minute)
    newStart.setSeconds(0)
    newStart.setMilliseconds(0)

    const newEnd = new Date(newStart)
    newEnd.setMinutes(newStart.getMinutes() + duration)

    const startDateTimeStr = formatDateTimeForStorage(newStart)
    const endDateTimeStr = formatDateTimeForStorage(newEnd)

    if (isCtrlPressed) {
      const year = newStart.getFullYear()
      const month = (newStart.getMonth() + 1).toString().padStart(2, "0")
      const day_str = newStart.getDate().toString().padStart(2, "0")
      const hours = newStart.getHours().toString().padStart(2, "0")
      const minutes = newStart.getMinutes().toString().padStart(2, "0")
      const newId = `${draggedEvent.employeeNumber}_${year}${month}${day_str}${hours}${minutes}`

      const copiedEvent = {
        ...draggedEvent,
        id: newId,
        keyID: newId,
        startDateTime: startDateTimeStr,
        endDateTime: endDateTimeStr,
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
          return {
            ...e,
            startDateTime: startDateTimeStr,
            endDateTime: endDateTimeStr,
            top: newStart.getHours() * 64 + (newStart.getMinutes() / 60) * 64,
            unsaved: true,
          }
        }
        return e
      })

      setEvents(updatedEvents)
      saveWeekDataToStorage(year, week, updatedEvents)
      setWeekDataChanged(year, week, true)

      if (selectedEvent && selectedEvent.id === draggedEvent.id) {
        setSelectedEvent({
          ...selectedEvent,
          startDateTime: startDateTimeStr,
          endDateTime: endDateTimeStr,
          top: newStart.getHours() * 64 + (newStart.getMinutes() / 60) * 64,
          unsaved: true,
        })
      }
    }
  }

  // イベント更新
  const updateEvent = (updatedEvent: any) => {
    let updatedColor = updatedEvent.color
    if (updatedEvent.project && updatedEvent.project !== selectedEvent?.project) {
      const lastDigit = updatedEvent.project.slice(-1)
      const projectColors: Record<string, string> = {
        "0": "#3788d8",
        "1": "#43a047",
        "2": "#8e24aa",
        "3": "#e67c73",
        "4": "#f6bf26",
        "5": "#0097a7",
        "6": "#ff9800",
        "7": "#795548",
        "8": "#607d8b",
        "9": "#d81b60",
      }

      updatedColor = lastDigit ? (projectColors[lastDigit] || "#3788d8") : "#3788d8"
    }

    const updatedEvents = events.map((e) => {
      if (e.id === updatedEvent.id) {
        return { ...updatedEvent, color: updatedColor, unsaved: true }
      }
      return e
    })
    setEvents(updatedEvents)
    setSelectedEvent({ ...updatedEvent, color: updatedColor })
    saveWeekDataToStorage(year, week, updatedEvents)
    setWeekDataChanged(year, week, true)
  }

  // イベント削除
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return
    try {
      if (confirm("このイベントを削除してもよろしいですか？")) {
        if (hasWeekDataChanged(year, week)) {
          try {
            await saveWeekAchievements(year, week, events)
          } catch (error) {
            if (!confirm("変更の保存に失敗しました。それでも削除を続けますか？")) {
              return
            }
          }
        }

        if (!selectedEvent.id.startsWith("new-")) {
          await deleteAchievement(selectedEvent.id)
        }
        const updatedEvents = events.filter((e) => e.id !== selectedEvent.id)
        setEvents(updatedEvents)
        setSelectedEvent(null)
        saveWeekDataToStorage(year, week, updatedEvents)
        setWeekDataChanged(year, week, true)
        alert("イベントが削除されました")
      }
    } catch (error: unknown) {
      alert(`削除エラー: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // ==========================================
  // Effects
  // ==========================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setIsCtrlPressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setIsCtrlPressed(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  useEffect(() => {
    if (!loading && events.length === 0 && !selectedEvent) {
      const today = new Date()
      const defaultHour = 9
      
      const defaultEvent = createNewEvent({
        day: weekDays[0],
        hour: defaultHour,
        minute: 0,
        employeeNumber: currentUser.employeeNumber,
        selectedTab,
        selectedProjectSubTab,
        projects,
      })
      
      setSelectedEvent({
        ...defaultEvent,
        isDefault: true
      })
    }
  }, [loading, events, selectedEvent, weekDays, currentUser, selectedTab, selectedProjectSubTab, projects])

  useEffect(() => {
    const handleWeekChange = async () => {
      const prevYear = previousYearWeek.current.year
      const prevWeek = previousYearWeek.current.week
      if (prevYear !== year || prevWeek !== week) {
        if (hasWeekDataChanged(prevYear, prevWeek)) {
          try {
            const prevWeekEvents = events
            const shouldSave = confirm(`${prevYear}年第${prevWeek}週のデータに未保存の変更があります。保存しますか？`)

            if (shouldSave) {
              setIsSaving(true)
              await saveWeekAchievements(prevYear, prevWeek, prevWeekEvents)
              setSaveMessage({ type: "success", text: `${prevYear}年第${prevWeek}週のデータを保存しました` })
              setTimeout(() => setSaveMessage(null), 5000)
            } else {
              clearWeekData(prevYear, prevWeek)
            }
          } catch (error: unknown) {
            console.error("前の週のデータ保存中にエラーが発生しました:", error)
            setSaveMessage({
              type: "error",
              text: `保存エラー: ${error instanceof Error ? error.message : String(error)}`,
            })
            setTimeout(() => setSaveMessage(null), 5000)
          } finally {
            setIsSaving(false)
          }
        }
      }
      previousYearWeek.current = { year, week }
      // Data is already loaded by the hook's own useEffect
      initializeWorkTimes()
    }

    handleWeekChange()
  }, [year, week, events, initializeWorkTimes, setSaveMessage])

  useEffect(() => {
    const checkChanges = () => {
      const changed = hasWeekDataChanged(year, week)
      setHasChanges(changed)
    }

    checkChanges()
    const interval = setInterval(checkChanges, 1000)
    return () => clearInterval(interval)
  }, [year, week])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasWeekDataChanged(year, week)) {
        try {
          saveWeekDataToStorage(year, week, events)
          setWeekDataChanged(year, week, true)
        } catch (error) {
          console.error("離脱時の自動保存処理中にエラーが発生しました:", error)
        }

        e.preventDefault()
        e.returnValue = "変更が保存されていません。このページを離れますか？"
        return e.returnValue
      }
    }

    const handleRouteChange = () => {
      if (hasWeekDataChanged(year, week)) {
        try {
          console.log("ページ移動時に自動保存します")
          saveWeekDataToStorage(year, week, events)
          handleSaveWeekData()
        } catch (error) {
          console.error("ページ移動時の自動保存処理中にエラーが発生しました:", error)
        }
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("popstate", handleRouteChange)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [year, week, events])

  useEffect(() => {
    const handleRefresh = () => {
      loadWeekData(true)
    }

    const handleSave = () => {
      handleSaveWeekData()
    }

    window.addEventListener("week-refresh", handleRefresh)
    window.addEventListener("week-save", handleSave)

    return () => {
      window.removeEventListener("week-refresh", handleRefresh)
      window.removeEventListener("week-save", handleSave)
    }
  }, [events, year, week, loadWeekData]) // Added loadWeekData to dependency array

  useEffect(() => {
    if (saveMessage) {
      window.dispatchEvent(
        new CustomEvent("week-save-message", {
          detail: saveMessage,
        }),
      )
    }
  }, [saveMessage])

  useEffect(() => {
    if (!loading && currentUser && currentUser.employeeNumber) {
      initializeWorkTimes()
    }
  }, [loading, currentUser, initializeWorkTimes])

  useEffect(() => {
    if (!loading) {
      const gridContainer = document.querySelector(".overflow-auto")
      if (gridContainer) {
        gridContainer.scrollTop = 9 * 64
      }
    }
  }, [loading])

  // ==========================================
  // レンダリング
  // ==========================================
  return (
    <div className="p-4">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="flex flex-col">
          {apiError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">APIエラーが発生しました</p>
              <p className="text-sm">{apiError}</p>
              <p className="text-sm mt-2">
                ローカルキャッシュからデータを表示しています。最新のデータではない可能性があります。
              </p>
            </div>
          )}

          <div className="flex">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToWindowEdges]}
            >
              <TimeGrid
                weekDays={weekDays}
                timeSlots={timeSlots}
                minuteSlots={minuteSlots}
                isToday={isToday}
                events={events}
                handleTimeSlotClick={handleTimeSlotClick}
                handleEventClick={handleEventClick}
                handleResizeStart={handleResizeStart}
                workTimes={workTimes}
                onWorkTimeChange={handleWorkTimeChange}
              />

              <DragOverlay
                modifiers={[restrictToWindowEdges]}
                dropAnimation={customDropAnimation}
                zIndex={1000}
                adjustScale={false}
              >
                {activeEvent ? <EventDragOverlay event={activeEvent} /> : null}
              </DragOverlay>
            </DndContext>

            <WeekSidebar
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              selectedProjectSubTab={selectedProjectSubTab}
              setSelectedProjectSubTab={setSelectedProjectSubTab}
              selectedEvent={selectedEvent}
              hasChanges={hasChanges}
              handleDeleteEvent={handleDeleteEvent}
              updateEvent={updateEvent}
              employees={employees}
              projects={projects}
              setSelectedEvent={setSelectedEvent}
              currentUser={currentUser}
              indirectSubTab={indirectSubTab}
              setIndirectSubTab={setIndirectSubTab}
            />
          </div>
        </div>
      )}
    </div>
  )
}
