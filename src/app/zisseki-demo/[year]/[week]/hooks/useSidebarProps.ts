import { useZissekiStore } from "../store/zissekiStore"
import { useUI } from "./useUI"
import { useEventHandlers } from "./useEventHandlers"

/**
 * ZissekiSidebarコンポーネント用のpropsを生成するフック
 * データとUI状態を組み合わせてサイドバーに必要なpropsを作成
 * 
 * @param year - 対象年
 * @param week - 対象週
 * @returns ZissekiSidebarに渡すpropsオブジェクト
 */
export const useSidebarProps = (year: number, week: number) => {
  // Zustandストアからデータを取得
  const {
    employees,   // 従業員一覧
    projects,    // プロジェクト一覧
    currentUser, // 現在のユーザー
  } = useZissekiStore();

  // UIフック - UI状態の管理
  const {
    selectedEvent,    // 選択されたイベント
    hasChanges,       // 変更フラグ
    setSelectedEvent, // イベント選択セッター
    setHasChanges,    // 変更フラグセッター
  } = useUI();

  // イベント操作フック - イベントの作成・編集・削除
  const {
    handleEventClick,     // イベントクリック
    handleTimeSlotClick,  // タイムスロットクリック
    handleDeleteEvent,    // イベント削除
    updateEvent,          // イベント更新
  } = useEventHandlers();

  return {
    // データ
    employees,
    projects,
    currentUser,
    
    // UI状態
    selectedEvent,
    hasChanges,
    
    // イベント操作
    onEventClick: handleEventClick,
    onTimeSlotClick: handleTimeSlotClick,
    onEventDelete: handleDeleteEvent,
    onEventUpdate: updateEvent,
    
    // UI操作
    onEventSelect: setSelectedEvent,
    onChangesSet: setHasChanges,
    
    // コンテキスト情報
    year,
    week,
  };
}; 