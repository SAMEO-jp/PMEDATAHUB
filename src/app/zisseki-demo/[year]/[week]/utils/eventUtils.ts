interface UIHierarchy {
  activeTab: string;
  activeSubTabs: {
    project: string;
  };
}

interface NewEvent {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  project: string;
  color: string;
  top: number;
  height: number;
  activityCode: string;
  unsaved: boolean;
}

export function createNewEvent(
  day: Date, 
  hour: number, 
  minute: number, 
  hierarchy: UIHierarchy
): NewEvent {
  const currentTab = hierarchy.activeTab;
  const currentSubTab = hierarchy.activeSubTabs.project;
  
  // タブに基づいて業務分析コードを設定
  let activityCode = "";
  if (currentTab === "project") {
    switch (currentSubTab) {
      case "計画":
        activityCode = "P001";
        break;
      case "設計":
        activityCode = "D001";
        break;
      case "会議":
        activityCode = "M001";
        break;
      case "購入品":
        activityCode = "P001";
        break;
      case "その他":
        activityCode = "O001";
        break;
      default:
        activityCode = "P001";
    }
  } else if (currentTab === "indirect") {
    activityCode = "I001";
  }

  // 新しいID形式: YYYYMMDD-UNIXTIMESTAMP-USERID
  const dateStr = day.getFullYear().toString() + 
                  (day.getMonth() + 1).toString().padStart(2, '0') + 
                  day.getDate().toString().padStart(2, '0');
  const unixTimestamp = Math.floor(Date.now() / 1000); // UNIXタイムスタンプ（秒）
  const userId = 'user123'; // 後で認証システムと連携
  const eventId = `${dateStr}-${unixTimestamp}-${userId}`;
  
  return {
    id: eventId,
    title: "新しいイベント",
    description: "",
    startDateTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute).toISOString(),
    endDateTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour + 1, minute).toISOString(),
    project: "",
    color: "#3788d8",
    top: hour * 64 + (minute / 60) * 64,
    height: 64,
    activityCode: activityCode,
    unsaved: false
  };
}
