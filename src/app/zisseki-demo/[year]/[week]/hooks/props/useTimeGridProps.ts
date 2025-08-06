import { useEventContext } from '@src/app/zisseki-demo/[year]/[week]/context/EventContext';
import { useWorkTimeReducer } from '../reducer/useWorkTimeReducer';
import { TimeGridEvent } from '../../types';

export const useTimeGridProps = (year: number, week: number) => {
  // 統合されたイベント・UI状態管理フック（シングルトン）
  const {
    events,
    selectedEvent,
    setSelectedEvent,
    dragState,
    resizeState,
    setDragState,
    setResizeState,
    error: eventError,
    clearError: clearEventError,
    createEvent,
    handleEventClick,
    handleDeleteEvent,
    updateEventHandler
  } = useEventContext();

  // 勤務時間管理フック
  const {
    workTimes,
    updateWorkTime,
    error: workTimeError,
    clearError: clearWorkTimeError
  } = useWorkTimeReducer();

  // タイムスロットクリックハンドラー（新しいイベント作成）
  const handleTimeSlotClick = (day: Date, hour: number, minute: number) => {
    console.log('タイムスロットクリック:', { day, hour, minute });
    
    try {
      const newEvent: TimeGridEvent = {
        id: `event-${Date.now()}`,
        keyID: `event-${Date.now()}`,
        title: "新しいイベント",
        description: "",
        startDateTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute).toISOString(),
        endDateTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour + 1, minute).toISOString(),
        project: "",
        color: "#3788d8",
        top: hour * 64 + (minute / 60) * 64,  // 縦位置計算（1時間=64px）
        height: 64,  // 1時間分の高さ
        unsaved: false  // 保存済みフラグ
      };
      
      console.log('作成するイベント:', newEvent);
      
      // 新しいイベントを作成・保存
      const createdEvent = createEvent(newEvent);
      
      console.log('作成されたイベント:', createdEvent);
      
      // 作成されたイベントを選択状態にする
      setSelectedEvent(createdEvent);
      clearEventError(); // エラーをクリア
    } catch (error) {
      console.error('イベント作成エラー:', error);
      // エラー処理は別途実装
    }
  };

  // 勤務時間変更ハンドラー
  const handleWorkTimeChange = (date: string, startTime: string, endTime: string) => {
    console.log('勤務時間変更:', { date, startTime, endTime });
    updateWorkTime(date, startTime, endTime);
  };

  return {
    // TimeGridPropsの型に合わせて修正
    year,
    week,
    events,
    workTimes,
    onEventClick: handleEventClick,
    onTimeSlotClick: handleTimeSlotClick,
    onWorkTimeChange: handleWorkTimeChange,
    
    // 追加のプロパティ（デバッグ用）
    selectedEvent,
    dragState,
    resizeState,
    setDragState,
    setResizeState,
    eventError,
    workTimeError,
    clearEventError,
    clearWorkTimeError,
    handleDeleteEvent,
    updateEventHandler
  };
}; 