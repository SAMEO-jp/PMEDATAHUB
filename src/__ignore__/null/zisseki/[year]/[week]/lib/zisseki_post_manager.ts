import { saveWeekAchievements } from './zisseki_post_data'
import { setZissekiDataChanged, hasZissekiDataChanged } from './zisseki_get_data'
import { DisplayEvent } from '../types/event'

interface WorkTime {
  startTime?: string
  endTime?: string
}

interface ZissekiPostManagerProps {
  year: number
  week: number
  user_id: string
  events: DisplayEvent[]
  workTimes: WorkTime[]
  saveWorkTimes: () => Promise<boolean>
  loadWeekData: (forceRefresh: boolean) => Promise<void>
  loadWorkTimesFromDb: () => Promise<void>
  setSaveMessage: (message: { type: string; text: string } | null) => void
  setIsSaving: (isSaving: boolean) => void
}

export const saveWeekData = async ({
  year,
  week,
  user_id,
  events,
  workTimes,
  saveWorkTimes,
  loadWeekData,
  loadWorkTimesFromDb,
  setSaveMessage,
  setIsSaving
}: ZissekiPostManagerProps): Promise<void> => {
  const hasWorkTimeChanges = workTimes.some(wt => wt.startTime || wt.endTime)
  
  if (!hasZissekiDataChanged(year, week, user_id) && !hasWorkTimeChanges) {
    alert("保存する変更はありません。")
    return
  }

  try {
    setIsSaving(true)

    if (!events || events.length === 0) {
      alert("保存するイベントデータが空です。操作をキャンセルします。")
      return
    }

    await saveWeekAchievements(year, week, events)
    
    if (workTimes && workTimes.length > 0) {
      const saved = await saveWorkTimes()
      if (!saved) {
        throw new Error("勤務時間データの保存に失敗しました")
      }
    }
    
    setSaveMessage({ type: "success", text: "週データが正常に保存されました" })
    setTimeout(() => setSaveMessage(null), 5000)

    await loadWeekData(true)
    await loadWorkTimesFromDb()
    
    setZissekiDataChanged(year, week, user_id, false)
  } catch (error: unknown) {
    setSaveMessage({ 
      type: "error", 
      text: `保存エラー: ${error instanceof Error ? error.message : String(error)}` 
    })
    setTimeout(() => setSaveMessage(null), 5000)
  } finally {
    setIsSaving(false)
  }
} 