import { useZissekiStore } from "../store/zissekiStore"
import { useEventHandlers } from "./useEventHandlers"

/**
 * TimeGridコンポーネント用のpropsを生成するフック
 * データとイベントハンドラーを組み合わせてpropsを作成
 * 
 * @param year - 対象年
 * @param week - 対象週
 * @returns TimeGridに渡すpropsオブジェクト
 */
export const useTimeGridProps = (year: number, week: number) => {
  // Zustandストアからデータを取得
  const { events, workTimes } = useZissekiStore();
  
  // イベント操作フック - イベントの作成・編集・削除
  const { 
    handleEventClick,     // イベントクリック
    handleTimeSlotClick,  // タイムスロットクリック
    handleWorkTimeChange, // 勤務時間変更
  } = useEventHandlers();

  return {
    // データ
    events,
    workTimes,
    
    // イベントハンドラー
    onEventClick: handleEventClick,
    onTimeSlotClick: handleTimeSlotClick,
    onWorkTimeChange: handleWorkTimeChange,
    
    // コンテキスト情報
    year,
    week,
  };
}; 