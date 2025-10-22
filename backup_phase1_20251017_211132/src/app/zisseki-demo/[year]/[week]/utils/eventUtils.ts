interface UIHierarchy {
  activeTab: string;
  activeSubTabs: {
    project: string;
  };
}

import { TimeGridEvent } from '../types';

interface NewEvent extends Omit<TimeGridEvent, 'id'> {
  id: string;
}

export function createNewEvent(
  day: Date, 
  hour: number, 
  minute: number, 
  hierarchy?: UIHierarchy,
  userId?: string // ユーザーIDパラメータを追加
): NewEvent {
  // デフォルトの階層情報を設定
  const defaultHierarchy: UIHierarchy = {
    activeTab: "project",
    activeSubTabs: {
      project: "企画・検討"
    }
  };
  
  const currentHierarchy = hierarchy || defaultHierarchy;
  const currentTab = currentHierarchy.activeTab;
  const currentSubTab = currentHierarchy.activeSubTabs.project;
  
  // タブに基づいて業務分析コードを設定
  let activityCode = "";
  if (currentTab === "project") {
    switch (currentSubTab) {
      case "企画・検討":
        activityCode = "PP01"; // 正しい業務コードに修正
        break;
      case "設計":
        activityCode = "DP01"; // 正しい業務コードに修正
        break;
      case "会議":
        activityCode = "MN01"; // 正しい業務コードに修正
        break;
      case "購入品":
        activityCode = "PB01"; // 正しい業務コードに修正
        break;
      case "その他":
        activityCode = "OT01"; // 正しい業務コードに修正
        break;
      default:
        activityCode = "PP01"; // デフォルトは企画・検討
    }
  } else if (currentTab === "indirect") {
    activityCode = "ZP01"; // 間接業務の正しいコード
  }

  // 新しいID形式: YYYYMMDD-UNIXTIMESTAMP-USERID
  const dateStr = day.getFullYear().toString() + 
                  (day.getMonth() + 1).toString().padStart(2, '0') + 
                  day.getDate().toString().padStart(2, '0');
  const unixTimestamp = Math.floor(Date.now() / 1000); // UNIXタイムスタンプ（秒）
  const currentUserId = userId || 'guest'; // ユーザーIDまたはデフォルト
  const eventId = `${dateStr}-${unixTimestamp}-${currentUserId}`;
  
  return {
    id: eventId,
    title: "新しいイベント",
    description: "",
    startDateTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute).toISOString(),
    endDateTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour + 1, minute).toISOString(),
    project: "",
    user_id: currentUserId, // ユーザーIDを追加
    color: "#BFDBFE", // より淡い青（blue-200）
    top: hour * 64 + (minute / 60) * 64,
    height: 64,
    activityCode: activityCode,
    status: "開始", // デフォルトの進捗状況
    unsaved: false,

  };
}
