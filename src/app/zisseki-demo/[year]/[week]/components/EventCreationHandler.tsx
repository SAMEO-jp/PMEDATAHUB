/**
 * イベント作成ハンドラーコンポーネント
 * タイムスロットクリック時のイベント作成ロジックを管理
 */

import { TimeGridEvent } from '../types';

/**
 * タブに基づいて業務分析コードを生成
 */
const generateActivityCode = (activeTab: string, activeSubTab: string): string => {
  if (activeTab === "project") {
    switch (activeSubTab) {
      case "企画・検討":
        return "P001";
      case "設計":
        return "D001";
      case "会議":
        return "M001";
      case "購入品":
        return "P001";
      case "その他":
        return "O001";
      default:
        return "P001";
    }
  } else if (activeTab === "indirect") {
    return "I001";
  }
  return "P001";
};

/**
 * 新しいイベントオブジェクトを作成
 */
const createNewEvent = (
  day: Date,
  hour: number,
  minute: number,
  activityCode: string,
  activeTab: string,
  activeSubTab: string,
  userId?: string
): TimeGridEvent => {
  return {
    id: `event-${Date.now()}`,
    title: "新しいイベント",
    description: "",
    startDateTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute).toISOString(),
    endDateTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour + 1, minute).toISOString(),
    project: "",
    user_id: userId || 'guest', // ユーザーIDまたはデフォルト
    color: "#BFDBFE", // より淡い青（blue-200）
    top: hour * 64 + (minute / 60) * 64,
    height: 64,
    activityCode: activityCode,
    status: "開始", // デフォルトの進捗状況
    unsaved: false,

  };
};

/**
 * イベント作成ハンドラーのProps型定義
 */
interface EventCreationHandlerProps {
  activeTab: string;
  activeSubTab: string;
  createEvent: (event: TimeGridEvent) => TimeGridEvent;
  setSelectedEvent: (event: TimeGridEvent) => void;
}

/**
 * タイムスロットクリック時のイベント作成ハンドラー
 */
export const createEventCreationHandler = ({
  activeTab,
  activeSubTab,
  createEvent,
  setSelectedEvent
}: EventCreationHandlerProps) => {
  return (day: Date, hour: number, minute: number) => {
    // 業務分析コードを生成
    const activityCode = generateActivityCode(activeTab, activeSubTab);
    
    // 新しいイベントを作成
    const newEvent = createNewEvent(day, hour, minute, activityCode, activeTab, activeSubTab);
    
    // イベントを作成して選択状態に設定
    const createdEvent = createEvent(newEvent);
    setSelectedEvent(createdEvent);
  };
};
