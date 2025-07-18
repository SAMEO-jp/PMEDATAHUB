// ==========================================
// ファイル名: useDataHandlers.ts
// 機能: データ操作イベントハンドラー（保存、削除、更新）
// 技術: React Hooks, TypeScript
// ==========================================

import { saveWeekData } from '../../lib/weekDataManager'
import { saveWeekAchievements, deleteAchievement } from '../../lib/client-db'
import { hasWeekDataChanged, saveWeekDataToStorage, setWeekDataChanged } from '../../lib/client-storage'

interface UseDataHandlersProps {
  year: number
  week: number
  events: any[]
  workTimes: any
  saveWorkTimes: () => Promise<void>
  loadWeekData: () => Promise<void>
  loadWorkTimesFromDb: () => Promise<void>
  setSaveMessage: (message: any) => void
  setIsSaving: (saving: boolean) => void
  setEvents: (events: any[]) => void
  setSelectedEvent: (event: any) => void
  selectedEvent: any
  validateEventForDeletion: (event: any) => boolean
  handleSaveError: () => Promise<boolean>
  handleApiError: (error: unknown, context: string) => void
}

export const useDataHandlers = ({
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
}: UseDataHandlersProps) => {
  // ==========================================
  // 週データの保存
  // ==========================================
  const handleSaveWeekData = async () => {
    await saveWeekData({
      year,
      week,
      events,
      workTimes,
      saveWorkTimes,
      loadWeekData,
      loadWorkTimesFromDb,
      setSaveMessage,
      setIsSaving
    })
  }

  // ==========================================
  // イベント削除
  // ==========================================
  const handleDeleteEvent = async () => {
    if (!selectedEvent || !validateEventForDeletion(selectedEvent)) return
    
    try {
      if (hasWeekDataChanged(year, week)) {
        try {
          await saveWeekAchievements(year, week, events)
        } catch {
          const shouldContinue = await handleSaveError()
          if (!shouldContinue) return
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
    } catch (error: unknown) {
      handleApiError(error, "削除エラー")
    }
  }

  return {
    handleSaveWeekData,
    handleDeleteEvent
  }
} 