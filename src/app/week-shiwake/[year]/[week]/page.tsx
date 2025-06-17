/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from "react"
import {
  // React
  useState,
  useEffect,
  useRef,

  // Next.js
  useParams,
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
  getEmployees,
  saveWeekAchievements,
  deleteAchievement,
  setWeekDataChanged,
  hasWeekDataChanged,
  saveWeekDataToStorage,
  clearWeekData,
  getWeekDataFromStorage,


  // コンポーネント
  WeekSidebar,
  TimeGrid,
  EventDragOverlay,

  // ユーティリティ
  getWeekNumber,
  getWeekDates,
  getWeekDaysArray,
  formatDateTimeForStorage,
  parseDateTime,
  FIFTEEN_MIN_HEIGHT,
  minuteSlots,
  createNewEvent,
  //useResizeEvent,
  EventItem,
  customDropAnimation
} from "./imports"
import { useUIStore } from "./store/uiStore"
import { formatEventForClient } from "./utils/formatEventForClientUtils"
import { useResizeEvent } from "./hooks/useResizeEvent"

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
  const [isSaving, setIsSaving] = useState(false)

  const [currentUser, setCurrentUser] = useState<{ user_id: string; name: string }>({
    user_id: "999999",
    name: "仮",
  })
  const [isCtrlPressed, setIsCtrlPressed] = useState(false)
  const previousYearWeek = useRef<{ year: number; week: number }>({ year, week })

  const { handleResizeStart } = useResizeEvent(
    events,
    setEvents,
    selectedEvent,
    setSelectedEvent,
    year,
    week
  )

  // ==========================================
  // データ読み込み関数
  // ==========================================
  const fetchCurrentUser = async () => {
    const storedUser = localStorage.getItem('currentUser')
    if (!storedUser) {
      throw new Error('ユーザー情報が見つかりません')
    }

    const parsedUser = JSON.parse(storedUser)
    const userData = {
      user_id: parsedUser.user_id,
      name: parsedUser.name_japanese
    }
    
    setCurrentUser(userData)
    return userData
  }

  const loadWeekData = async (forceRefresh = false) => {
    setLoading(true)
    setApiError(null)
    try {
      // ユーザー情報の取得
      const userData = await fetchCurrentUser()
      
      // 社員データの取得
      const empData = await getEmployees()
      setEmployees(empData)
      
      // プロジェクトデータの取得
      const cachedProjects = localStorage.getItem('currentUser_projects')
      if (cachedProjects) {
        const parsedProjects = JSON.parse(cachedProjects)
        setProjects(parsedProjects)
      }
      
      // 週データの取得
      const cachedData = getWeekDataFromStorage(year, week, userData.user_id)
      const hasChanged = hasWeekDataChanged(year, week, userData.user_id)

      if (forceRefresh || !cachedData || hasChanged) {
        const apiUrl = `/api/zisseki/week/${userData.user_id}/${year}/${week}`
        try {
          const response = await fetch(apiUrl)

          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`API応答エラー: ${response.status}, ${errorText}`)
          }

          const data = await response.json()

          if (!data.success) {
            throw new Error(data.message || "データの取得に失敗しました")
          }

          const formattedEvents = data.data.map((event: EventItem) => {
            return formatEventForClient(event)
          })

          setEvents(formattedEvents)
          saveWeekDataToStorage(year, week, userData.user_id, formattedEvents)
          setWeekDataChanged(year, week, userData.user_id, false)
        } catch (apiError) {
          setApiError(String(apiError))
          if (cachedData) {
            setEvents(cachedData)
          } else {
            setEvents([])
          }
        }
      } else {
        setEvents(cachedData)
      }

      setSelectedEvent(null)
    } catch (error: unknown) {
      setApiError(error instanceof Error ? error.message : String(error))
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // DnD設定
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
  // イベントハンドラ
  // ==========================================
  // 週データの保存
  const handleSaveWeekData = async () => {
    if (!currentUser || !currentUser.user_id) {
      console.error('デバッグ: 保存時のユーザーIDが不正:', currentUser)
      setSaveMessage({ type: "error", text: "ユーザー情報が正しく設定されていません" })
      return
    }

    try {
      setIsSaving(true)
      console.log('デバッグ: 保存API呼び出し時のユーザーID:', currentUser.user_id)
      const response = await fetch(`/api/zisseki/week/${currentUser.user_id}/${year}/${week}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || "データの保存に失敗しました")
      }

      setSaveMessage({ type: "success", text: "保存が完了しました" })
      setWeekDataChanged(year, week, currentUser.user_id, false)
      setHasChanges(false)
    } catch (error) {
      console.error("保存中にエラーが発生しました:", error)
      setSaveMessage({ type: "error", text: error instanceof Error ? error.message : "保存に失敗しました" })
    } finally {
      setIsSaving(false)
    }
  }

  // イベントクリック
  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
  }

  // タイムスロットクリック
  const handleTimeSlotClick = (day: Date, hour: number, minute = 0) => {
    if (!currentUser || !currentUser.user_id) {
      console.error("ユーザー情報が正しく設定されていません")
      alert("ユーザー情報が正しく設定されていません。ログインし直してください。")
      return
    }

    const newEvent = createNewEvent({
      day,
      hour,
      minute,
      user_id: currentUser.user_id,
      selectedTab,
      selectedProjectSubTab,
      projects,
    })

    const updatedEvents = [...events, newEvent]
    setEvents(updatedEvents)
    setSelectedEvent(newEvent)

    saveWeekDataToStorage(year, week, currentUser.user_id, updatedEvents)
    setWeekDataChanged(year, week, currentUser.user_id, true)
  }

  // ドラッグ開始
  const handleDragStart = (event: any) => {
    const { active } = event
    const draggedEvent = active.data.current.event
    const dragHandleOffset = active.data.current.dragHandleOffset || 16

    setActiveEvent({
      ...draggedEvent,
      dragHandleOffset,
    })
  }

  // ドラッグ終了
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
      const newId = `${draggedEvent.user_id}_${year}${month}${day_str}${hours}${minutes}`

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

      saveWeekDataToStorage(year, week, currentUser.user_id, updatedEvents)
      setWeekDataChanged(year, week, currentUser.user_id, true)
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
      saveWeekDataToStorage(year, week, currentUser.user_id, updatedEvents)
      setWeekDataChanged(year, week, currentUser.user_id, true)

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
    saveWeekDataToStorage(year, week, currentUser.user_id, updatedEvents)
    setWeekDataChanged(year, week, currentUser.user_id, true)
  }

  // イベント削除
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return
    try {
      if (confirm("このイベントを削除してもよろしいですか？")) {
        if (hasWeekDataChanged(year, week, currentUser.user_id)) {
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
        saveWeekDataToStorage(year, week, currentUser.user_id, updatedEvents)
        setWeekDataChanged(year, week, currentUser.user_id, true)
        alert("イベントが削除されました")
      }
    } catch (error: unknown) {
      alert(`削除エラー: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // ==========================================
  // エフェクト
  // ==========================================
  // Ctrlキーの監視
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

  // デフォルトイベントの設定
  useEffect(() => {
    if (!loading && events.length === 0 && !selectedEvent) {
      const today = new Date()
      const defaultHour = 9
      
      const defaultEvent = createNewEvent({
        day: weekDays[0],
        hour: defaultHour,
        minute: 0,
        user_id: currentUser.user_id,
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

  // 週変更時の処理
  useEffect(() => {
    const handleWeekChange = async () => {
      const prevYear = previousYearWeek.current.year
      const prevWeek = previousYearWeek.current.week
      if (prevYear !== year || prevWeek !== week) {
        if (hasWeekDataChanged(prevYear, prevWeek, currentUser.user_id)) {
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
      await loadWeekData(true)
    }

    handleWeekChange()
  }, [year, week])

  // 変更フラグの監視
  useEffect(() => {
    const checkChanges = () => {
      const changed = hasWeekDataChanged(year, week, currentUser.user_id)
      setHasChanges(changed)
    }

    checkChanges()
    const interval = setInterval(checkChanges, 1000)
    return () => clearInterval(interval)
  }, [year, week])

  // ページ離脱時の処理
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasWeekDataChanged(year, week, currentUser.user_id)) {
        try {
          saveWeekDataToStorage(year, week, currentUser.user_id, events)
          setWeekDataChanged(year, week, currentUser.user_id, true)
        } catch (error) {
          console.error("離脱時の自動保存処理中にエラーが発生しました:", error)
        }

        e.preventDefault()
        e.returnValue = "変更が保存されていません。このページを離れますか？"
        return e.returnValue
      }
    }

    const handleRouteChange = () => {
      if (hasWeekDataChanged(year, week, currentUser.user_id)) {
        try {
          console.log("ページ移動時に自動保存します")
          saveWeekDataToStorage(year, week, currentUser.user_id, events)
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

  // 週の移動
  const moveToWeek = async (newYear: number, newWeek: number) => {
    if (hasWeekDataChanged(year, week, currentUser.user_id)) {
      const shouldSave = confirm(`${year}年第${week}週のデータに未保存の変更があります。保存しますか？`)
      if (shouldSave) {
        try {
          setIsSaving(true)
          await saveWeekAchievements(year, week, events)
          setSaveMessage({ type: "success", text: `${year}年第${week}週のデータを保存しました` })
          setTimeout(() => setSaveMessage(null), 5000)
        } catch (error) {
          console.error("保存中にエラーが発生しました:", error)
          setSaveMessage({
            type: "error",
            text: `保存エラー: ${error instanceof Error ? error.message : String(error)}`,
          })
          setTimeout(() => setSaveMessage(null), 5000)
          return
        } finally {
          setIsSaving(false)
        }
      }
    }
    window.location.href = `/week-shiwake/${newYear}/${newWeek}`
  }

  // 保存処理
  const saveWeekData = async () => {
    if (!hasWeekDataChanged(year, week, currentUser.user_id)) {
      setSaveMessage({ type: "info", text: "保存する変更がありません" })
      setTimeout(() => setSaveMessage(null), 3000)
      return
    }

    try {
      setIsSaving(true)
      await saveWeekAchievements(year, week, events)
      setSaveMessage({ type: "success", text: "保存が完了しました" })
      setTimeout(() => setSaveMessage(null), 3000)
      setWeekDataChanged(year, week, currentUser.user_id, false)
    } catch (error) {
      console.error("保存中にエラーが発生しました:", error)
      setSaveMessage({
        type: "error",
        text: `保存エラー: ${error instanceof Error ? error.message : String(error)}`,
      })
      setTimeout(() => setSaveMessage(null), 5000)
    } finally {
      setIsSaving(false)
    }
  }

  // カスタムイベントリスナー
  useEffect(() => {
    const handleRefresh = () => {
      loadWeekData(true)
    }

    const handleSave = () => {
      saveWeekData()
    }

    const handleWeekChange = (event: CustomEvent) => {
      const { newYear, newWeek } = event.detail
      moveToWeek(newYear, newWeek)
    }

    window.addEventListener("week-refresh", handleRefresh)
    window.addEventListener("week-save", handleSave)
    window.addEventListener("week-change", handleWeekChange as EventListener)

    return () => {
      window.removeEventListener("week-refresh", handleRefresh)
      window.removeEventListener("week-save", handleSave)
      window.removeEventListener("week-change", handleWeekChange as EventListener)
    }
  }, [events, year, week])

  // 保存メッセージの通知
  useEffect(() => {
    if (saveMessage) {
      window.dispatchEvent(
        new CustomEvent("week-save-message", {
          detail: saveMessage,
        }),
      )
    }
  }, [saveMessage])

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
