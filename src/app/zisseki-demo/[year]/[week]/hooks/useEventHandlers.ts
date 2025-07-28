import { useCallback } from 'react';
import { TimeGridEvent } from '../types';
import { useUI } from './useUI';

/**
 * イベント操作のロジックを管理するフック
 * イベントの作成、更新、削除などの操作を担当
 */
export const useEventHandlers = () => {
  const { setSelectedEvent, setHasChanges } = useUI();

  /**
   * イベントクリック時のハンドラー
   * クリックされたイベントを選択状態にする
   */
  const handleEventClick = useCallback((event: TimeGridEvent) => {
    setSelectedEvent(event);
  }, [setSelectedEvent]);

  /**
   * タイムスロットクリック時のハンドラー
   * 新しいデモイベントを作成し、ログに出力
   */
  const handleTimeSlotClick = useCallback((day: Date, hour: number, minute: number) => {
    // デモ用のイベント作成（実際のデータ処理は行わない）
    const newEvent: TimeGridEvent = {
      id: `demo-${Date.now()}`,
      keyID: `demo-${Date.now()}`,
      title: "デモイベント",
      description: "これはデモ用のイベントです",
      startDateTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute).toISOString(),
      endDateTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour + 1, minute).toISOString(),
      project: "DEMO001",
      color: "#3788d8",
      top: hour * 64 + (minute / 60) * 64,  // 縦位置計算（1時間=64px）
      height: 64,  // 1時間分の高さ
      unsaved: true  // 未保存フラグ
    };
    
    // デモ用のイベント追加（実際の状態更新は行わない）
    console.log("デモイベント作成:", newEvent);
    setHasChanges(true);
  }, [setHasChanges]);

  /**
   * 勤務時間変更時のハンドラー
   * 勤務時間の変更をログに出力（デモ用）
   */
  const handleWorkTimeChange = useCallback((date: string, startTime: string, endTime: string) => {
    // デモ用の勤務時間変更（実際のデータ処理は行わない）
    console.log("デモ勤務時間変更:", { date, startTime, endTime });
  }, []);

  /**
   * イベント削除時のハンドラー
   * 選択中のイベントをクリアし、変更フラグをリセット
   */
  const handleDeleteEvent = useCallback(() => {
    // デモ用のイベント削除（実際のデータ処理は行わない）
    console.log("デモイベント削除");
    setSelectedEvent(null);
    setHasChanges(false);
  }, [setSelectedEvent, setHasChanges]);

  /**
   * イベント更新時のハンドラー
   * 更新されたイベントを選択状態にし、変更フラグを設定
   */
  const updateEvent = useCallback((updatedEvent: TimeGridEvent) => {
    // デモ用のイベント更新（実際のデータ処理は行わない）
    console.log("デモイベント更新:", updatedEvent);
    setSelectedEvent(updatedEvent);
    setHasChanges(true);
  }, [setSelectedEvent, setHasChanges]);

  return {
    handleEventClick,
    handleTimeSlotClick,
    handleWorkTimeChange,
    handleDeleteEvent,
    updateEvent
  };
}; 