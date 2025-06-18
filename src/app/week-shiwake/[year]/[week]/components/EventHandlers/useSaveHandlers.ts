import { useState } from 'react';
import { saveWeekAchievements, deleteAchievement } from '../../lib/zisseki_post_data';
import { setZissekiDataChanged } from '../../lib/zisseki_get_data';

export const useSaveHandlers = (
  events: any[],
  setEvents: (events: any[]) => void,
  setSelectedEvent: (event: any) => void,
  setHasChanges: (hasChanges: boolean) => void,
  setSaveMessage: (message: { type: string; text: string }) => void,
  year: number,
  week: number,
  currentUser: { user_id: string }
) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveWeekData = async () => {
    if (!currentUser || !currentUser.user_id) {
      console.error('デバッグ: 保存時のユーザーIDが不正:', currentUser);
      setSaveMessage({ type: "error", text: "ユーザー情報が正しく設定されていません" });
      return;
    }

    try {
      setIsSaving(true);
      console.log('デバッグ: 保存API呼び出し時のユーザーID:', currentUser.user_id);
      const result = await saveWeekAchievements(year, week, events);

      setSaveMessage({ type: "success", text: "保存が完了しました" });
      setZissekiDataChanged(year, week, currentUser.user_id, false);
      setHasChanges(false);
    } catch (error) {
      console.error("保存中にエラーが発生しました:", error);
      setSaveMessage({ type: "error", text: error instanceof Error ? error.message : "保存に失敗しました" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteAchievement(eventId);
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
      setSelectedEvent(null);
      setHasChanges(true);
      setSaveMessage({ type: "success", text: "イベントを削除しました" });
    } catch (error) {
      console.error("削除中にエラーが発生しました:", error);
      setSaveMessage({ type: "error", text: error instanceof Error ? error.message : "削除に失敗しました" });
    }
  };

  return {
    isSaving,
    handleSaveWeekData,
    handleDeleteEvent,
  };
}; 