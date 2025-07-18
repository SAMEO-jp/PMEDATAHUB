"use client"

// ==========================================
// ファイル名: page.tsx
// 機能: 週次仕訳ページ - 週単位での作業時間管理・イベント管理
// 技術: React Hooks, DnD Kit, Zustand, Next.js
// 作成日: 2024-01-15
// 更新履歴: 2024-01-20: Zustandストアからユーザー・従業員情報を取得するように修正
// ==========================================

// ==========================================
// インポート層
// ==========================================
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
  minuteSlots,
  createNewEvent,
  useResizeEvent,
  EventItem,
  customDropAnimation
} from "./imports"
//import { DragStartEvent, DragEndEvent } from "@dnd-kit/core" // TODO: 未使用インポート - 削除予定
import { useUIStore } from "./store/uiStore"
import { useAuth } from "../../../../store/authStore" // Zustandから認証情報を取得
import { useWorkTimes } from './hooks/useWorkTimes';
import { formatEventForClient } from "./utils/formatEventForClientUtils"
import { 
  useDataHandlers, 
  useDndHandlers, 
  useUIHandlers, 
  useKeyboardHandlers 
} from './hooks/eventHandlers'
import React from "react"

// ==========================================
// 型定義層（Props, 内部型, API型）
// ==========================================
// TODO: 型の不整合問題 - WeekEventとClientEventの型を統一する必要があります
// 現在の問題:
// 1. WeekEventには[key: string]: unknownがあるが、ClientEventにはない
// 2. saveWeekDataToStorageはClientEvent[]を期待するが、WeekEvent[]を渡している
// 3. getWeekDataFromStorageはClientEvent[]を返すが、WeekEvent[]として使用している

interface WeekEvent {
  id: string;
  keyID: string;
  startDateTime: string;
  endDateTime: string;
  top: number;
  color: string;
  project?: string;
  unsaved?: boolean;
  isDefault?: boolean;
  employeeNumber: string;
  dragHandleOffset?: number;
  [key: string]: unknown; // TODO: この型定義がClientEventとの不整合を引き起こしている
}

interface Project {
  id: string;
  name: string;
  [key: string]: unknown;
}

export default function WeekShiwakePage() {
  // ==========================================
  // パラメータとルーティング層（searchParams, params, useParams, useRouter, useSearchParams）
  // ==========================================
  const params = useParams()
  const year = Number.parseInt(params.year as string) || new Date().getFullYear()
  const week = Number.parseInt(params.week as string) || getWeekNumber(new Date())

  // ==========================================
  // 日付と時間の計算層（ビジネスロジック層）
  // ==========================================
  // 週の開始日と終了日を計算
  const { startDate, endDate } = getWeekDates(year, week)
  // 週の各日を配列として取得
  const weekDays = getWeekDaysArray(startDate, endDate)
  // 24時間の時間スロットを生成
  const timeSlots = Array.from({ length: 24 }, (_, i) => i)
  const today = new Date()
  // 今日の日付かどうかを判定する関数
  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // ==========================================
  // 状態管理層（useState, useReducer, Zustand）
  // ==========================================
  // UI Store - Zustandを使用したグローバル状態管理
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

  // 認証情報 - Zustandストアから取得
  const { user: currentUser, isAuthenticated } = useAuth()

  // デバッグ用：認証状態をログ出力
  useEffect(() => {
    console.log("認証状態:", { isAuthenticated, currentUser })
  }, [isAuthenticated, currentUser])

  // ローカルステート - コンポーネント固有の状態
  const [loading, setLoading] = useState(true) // データ読み込み状態
  const [events, setEvents] = useState<WeekEvent[]>([]) // イベント一覧
  const [selectedEvent, setSelectedEvent] = useState<WeekEvent | null>(null) // 選択中のイベント
  const [employees, setEmployees] = useState<any[]>([]) // 従業員一覧 - Zustandから取得予定
  const [projects, setProjects] = useState<Project[]>([]) // プロジェクト一覧
  const [activeEvent, setActiveEvent] = useState<WeekEvent | null>(null) // ドラッグ中のイベント
  const [isSaving, setIsSaving] = useState(false) // 保存中状態
  const [hasChanges, setHasChanges] = useState(false) // 変更フラグ
  const [isCtrlPressed, setIsCtrlPressed] = useState(false) // Ctrlキー押下状態
  const previousYearWeek = useRef<{ year: number; week: number }>({ year, week }) // 前回の週情報

  // ==========================================
  // カスタムフック層（データ取得層）
  // ==========================================
  // イベントリサイズ機能のフック
  const { handleResizeStart } = useResizeEvent(events, setEvents, selectedEvent, setSelectedEvent, year, week)
  // 勤務時間管理のフック
  const {
    workTimes,
    initializeWorkTimes,
    loadWorkTimesFromDb,
    handleWorkTimeChange,
    saveWorkTimes
  } = useWorkTimes(year, week, weekDays, currentUser)

  // ==========================================
  // DnD設定層（ビジネスロジック層）
  // ==========================================
  // ドラッグ&ドロップのセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px以上移動したらドラッグ開始
      },
    }),
    useSensor(KeyboardSensor), // キーボード操作対応
  )

  // ==========================================
  // データ取得層（Server Components: async/await, Client Components: useEffect, use hooks）
  // ==========================================
  // 週データの読み込み処理
  const loadWeekData = async () => {
    setLoading(true)
    setApiError(null)
    try {
      // 従業員データの取得 - Zustandストアに保存
      const empData = await getEmployees()
      setEmployees(empData)

      // localStorageからプロジェクトデータを取得
      const cachedProjects = localStorage.getItem('currentUser_projects')
      if (cachedProjects) {
        const parsedProjects = JSON.parse(cachedProjects)
        setProjects(parsedProjects)
      }

      // APIから週の実績データを取得
      const apiUrl = `/api/achievements/week/${year}/${week}`

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

        // イベントデータをフォーマットして表示用に変換
        const formattedEvents = data.data.map((event: EventItem) => {
          const startTime = new Date(event.startDateTime)
          const startHour = startTime.getHours()
          const startMinutes = startTime.getMinutes()

          // 時間と分からtop位置を計算（1時間 = 64px）
          const top = startHour * 64 + (startMinutes / 60) * 64

          return {
            ...formatEventForClient(event),
            top,
          }
        })

        setEvents(formattedEvents)

        // ローカルストレージにキャッシュ保存
        saveWeekDataToStorage(year, week, formattedEvents)
        setWeekDataChanged(year, week, false)
      } catch (apiError) {
        setApiError(String(apiError))

        // APIエラー時はローカルキャッシュから復元
        const cachedData = getWeekDataFromStorage(year, week)
        if (cachedData) {
          // TODO: 型の不整合 - ClientEvent[]をWeekEvent[]として使用している
          setEvents(cachedData as any) // 一時的な型キャスト
        } else {
          setEvents([])
        }
      }

      setSelectedEvent(null)
    } catch (error: unknown) {
      alert(`データ取得エラー: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // ビジネスロジック層（データ加工・計算・検証）
  // ==========================================
  // プロジェクト名から色を生成する関数
  const createProjectColor = (project: string): string => {
    const lastDigit = project.slice(-1)
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
    return lastDigit ? (projectColors[lastDigit] || "#3788d8") : "#3788d8"
  }

  // 新しいイベントIDを生成する関数
  const generateNewEventId = (draggedEvent: WeekEvent, newStart: Date): string => {
    const year = newStart.getFullYear()
    const month = (newStart.getMonth() + 1).toString().padStart(2, "0")
    const day_str = newStart.getDate().toString().padStart(2, "0")
    const hours = newStart.getHours().toString().padStart(2, "0")
    const minutes = newStart.getMinutes().toString().padStart(2, "0")
    return `${draggedEvent.employeeNumber}_${year}${month}${day_str}${hours}${minutes}`
  }

  // ==========================================
  // 検証・バリデーション層（入力値チェック、データ整合性）
  // ==========================================
  // ユーザー情報の検証
  const validateUserInfo = (): boolean => {
    if (!currentUser || !currentUser.user_id) {
      console.error("ユーザー情報が正しく設定されていません")
      alert("ユーザー情報が正しく設定されていません。ログインし直してください。")
      return false
    }
    return true
  }

  // イベント削除の確認
  const validateEventForDeletion = (event: WeekEvent): boolean => {
    if (!event) return false
    return confirm("このイベントを削除してもよろしいですか？")
  }

  // ==========================================
  // 変換・フォーマット層（データ変換、表示用フォーマット）
  // ==========================================
  // イベント更新用のフォーマット処理
  const formatEventForUpdate = (event: WeekEvent, newStart: Date, duration: number): WeekEvent => {
    const newEnd = new Date(newStart)
    newEnd.setMinutes(newStart.getMinutes() + duration)

    const startDateTimeStr = formatDateTimeForStorage(newStart)
    const endDateTimeStr = formatDateTimeForStorage(newEnd)

    return {
      ...event,
      startDateTime: startDateTimeStr,
      endDateTime: endDateTimeStr,
      top: newStart.getHours() * 64 + (newStart.getMinutes() / 60) * 64,
      unsaved: true,
    }
  }

  // ==========================================
  // エラーハンドリング層（エラー処理、フォールバック）
  // ==========================================
  // APIエラーの統一処理
  const handleApiError = (error: unknown, context: string): void => {
    const errorMessage = error instanceof Error ? error.message : String(error)
    alert(`${context}: ${errorMessage}`)
  }

  // 保存エラー時の確認処理
  const handleSaveError = async (): Promise<boolean> => {
    return confirm("変更の保存に失敗しました。それでも削除を続けますか？")
  }

  // ==========================================
  // イベントハンドラー層（カスタムフック）
  // ==========================================
  // データ操作ハンドラー
  const { handleSaveWeekData, handleDeleteEvent } = useDataHandlers({
    year,
    week,
    events,
    workTimes,
    saveWorkTimes,
    loadWeekData,
    loadWorkTimesFromDb,
    setSaveMessage,
    setIsSaving,
    setEvents,
    setSelectedEvent,
    selectedEvent,
    validateEventForDeletion,
    handleSaveError,
    handleApiError
  })

  // DnD操作ハンドラー
  const { handleDragStart, handleDragEnd } = useDndHandlers({
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
  })

  // UI操作ハンドラー
  const { handleEventClick, handleTimeSlotClick, updateEvent } = useUIHandlers({
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
  })

  // キーボード操作ハンドラー
  useKeyboardHandlers({
    setIsCtrlPressed
  })

  // ==========================================
  // エフェクト層（useEffect）
  // ==========================================
  // Ctrlキーの監視 - ドラッグ時の複製機能用
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

  // デフォルトイベントの設定 - 初回表示時に空のイベントを作成
  useEffect(() => {
    if (!loading && events.length === 0 && !selectedEvent && currentUser) {
      const defaultHour = 9
      
      const defaultEvent = createNewEvent({
        day: weekDays[0],
        hour: defaultHour,
        minute: 0,
        employeeNumber: currentUser.user_id, // user_idを使用
        selectedTab,
        selectedProjectSubTab,
        projects,
      })
      
      const eventWithKeyId: WeekEvent = {
        ...defaultEvent,
        keyID: defaultEvent.id,
        isDefault: true
      }
      
      setSelectedEvent(eventWithKeyId)
    }
  }, [loading, events, selectedEvent, weekDays, currentUser, selectedTab, selectedProjectSubTab, projects])

  // 週変更時の処理 - 未保存データの確認と保存
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
      await loadWeekData()
      initializeWorkTimes()
    }

    handleWeekChange()
  }, [year, week])

  // 認証状態が確定したらデータを読み込む
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadWeekData()
    }
  }, [isAuthenticated, currentUser])

  // 変更フラグの監視 - 1秒間隔で変更状態をチェック
  useEffect(() => {
    const checkChanges = () => {
      const changed = hasWeekDataChanged(year, week)
      setHasChanges(changed)
    }

    checkChanges()
    const interval = setInterval(checkChanges, 1000)
    return () => clearInterval(interval)
  }, [year, week])

  // ページ離脱時の処理 - 未保存データの自動保存
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasWeekDataChanged(year, week)) {
        try {
          // TODO: 型の不整合 - WeekEvent[]をClientEvent[]として渡している
          saveWeekDataToStorage(year, week, events as any) // 一時的な型キャスト
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
          // TODO: 型の不整合 - WeekEvent[]をClientEvent[]として渡している
          saveWeekDataToStorage(year, week, events as any) // 一時的な型キャスト
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

  // カスタムイベントリスナー - 外部からの操作に対応
  useEffect(() => {
    const handleRefresh = () => {
      loadWeekData()
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
  }, [events, year, week])

  // 保存メッセージの通知 - グローバルイベントとして発信
  useEffect(() => {
    if (saveMessage) {
      window.dispatchEvent(
        new CustomEvent("week-save-message", {
          detail: saveMessage,
        }),
      )
    }
  }, [saveMessage])

  // 勤務時間データの初期化 - ユーザー情報取得後に実行
  useEffect(() => {
    if (!loading && currentUser && currentUser.user_id) {
      initializeWorkTimes()
    }
  }, [loading, currentUser?.user_id])

  // 9時の位置へのスクロール - 初期表示時のUX向上
  useEffect(() => {
    if (!loading) {
      const gridContainer = document.querySelector(".overflow-auto")
      if (gridContainer) {
        gridContainer.scrollTop = 9 * 64 // 9時 = 9 * 64px
      }
    }
  }, [loading])

  // ==========================================
  // レンダリング層（JSX return）
  // ==========================================
  return (
    <div className="p-4">
      {loading ? (
        // ローディング表示
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="flex flex-col">
          {/* APIエラー表示 */}
          {apiError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">APIエラーが発生しました</p>
              <p className="text-sm">{apiError}</p>
              <p className="text-sm mt-2">
                ローカルキャッシュからデータを表示しています。最新のデータではない可能性があります。
              </p>
            </div>
          )}

          {/* 保存中表示 */}
          {isSaving && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                <p className="font-bold">データを保存中...</p>
              </div>
            </div>
          )}

          {/* メインコンテンツ */}
          <div className="flex">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToWindowEdges]}
            >
              {/* 時間グリッド */}
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

              {/* ドラッグオーバーレイ */}
              <DragOverlay
                modifiers={[restrictToWindowEdges]}
                dropAnimation={customDropAnimation}
                zIndex={1000}
                adjustScale={false}
              >
                {activeEvent ? <EventDragOverlay event={activeEvent} /> : null}
              </DragOverlay>
            </DndContext>

            {/* サイドバー */}
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
