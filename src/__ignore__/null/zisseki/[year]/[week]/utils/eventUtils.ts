// イベント操作関連のユーティリティ関数
import { formatDateTimeForStorage, TIME_SLOT_HEIGHT } from "./dateUtils"
import { DEFAULT_COLOR, PROJECT_COLORS, ACTIVITY_CODES } from "./constants"
import { DisplayEvent, Project } from "../types/event"

// 新しいイベントを作成する関数
export function createNewEvent({
  day,
  hour,
  minute,
  user_id,
  selectedTab,
  selectedProjectSubTab,
  projects,
}: {
  day: Date
  hour: number
  minute: number
  user_id: string
  selectedTab: string
  selectedProjectSubTab: string
  projects: Project[]
}): DisplayEvent {
  // 新規イベントの開始時間と終了時間を設定
  const startDateTime = new Date(day)

  // 時間を正しく設定
  startDateTime.setHours(hour)
  startDateTime.setMinutes(minute)
  startDateTime.setSeconds(0)
  startDateTime.setMilliseconds(0)

  // 終了時間は開始時間の30分後に変更
  const endDateTime = new Date(startDateTime)
  endDateTime.setMinutes(startDateTime.getMinutes() + 30)

  // フロントエンド側でもuser_id_YYYYMMDDHHmm形式のIDを生成
  const year = startDateTime.getFullYear()
  const month = (startDateTime.getMonth() + 1).toString().padStart(2, "0")
  const day_str = startDateTime.getDate().toString().padStart(2, "0")
  const hours = startDateTime.getHours().toString().padStart(2, "0")
  const minutes = startDateTime.getMinutes().toString().padStart(2, "0")
  const key_id = `${user_id}_${year}${month}${day_str}${hours}${minutes}`

  // 日時を正しくフォーマット
  const startDateTimeStr = formatDateTimeForStorage(startDateTime)
  const endDateTimeStr = formatDateTimeForStorage(endDateTime)

  // 選択されているタブに基づいて初期値を設定
  const isProjectTab = selectedTab === "project"

  // プロジェクトに基づいて役割を自動設定
  const defaultPosition = isProjectTab ? "担当者" : ""

  // 開催者名を自動設定
  const defaultOrganizer = isProjectTab && selectedProjectSubTab === "会議" ? "自動設定" : ""

  // ここでタブに応じた初期の業務コードを設定
  let initialActivityCode = ""
  let initialActivitySubcode = ""

  if (isProjectTab) {
    if (selectedProjectSubTab === "計画") {
      // 計画タブでのデフォルトコード
      initialActivityCode = ACTIVITY_CODES.PLAN.DEFAULT
      // サブタブの情報を使用
      if (selectedProjectSubTab === "計画") {
        initialActivityCode = ACTIVITY_CODES.PLAN.PLAN
      } else if (selectedProjectSubTab === "検討書") {
        initialActivityCode = ACTIVITY_CODES.PLAN.CONSIDERATION
      } else if (selectedProjectSubTab === "見積り") {
        initialActivityCode = ACTIVITY_CODES.PLAN.ESTIMATE
      }
    } else if (selectedProjectSubTab === "設計") {
      // 設計タブでのデフォルトコード
      initialActivityCode = ACTIVITY_CODES.DESIGN.DEFAULT
    } else if (selectedProjectSubTab === "購入品") {
      initialActivityCode = ACTIVITY_CODES.PURCHASE.DEFAULT
      initialActivitySubcode = ACTIVITY_CODES.PURCHASE.SUBCODE
    }
  }

  // プロジェクトに基づいて色を決定
  let projectColor = DEFAULT_COLOR
  if (isProjectTab && projects.length > 0) {
    // プロジェクトコードの最後の数字に基づいて色を割り当て
    const projectCode = projects[0].code
    const lastDigit = projectCode.slice(-1)

    projectColor = PROJECT_COLORS[lastDigit] || DEFAULT_COLOR
  }

  // 実際の時間間隔に基づいて高さを計算
  const durationMs = endDateTime.getTime() - startDateTime.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  const calculatedHeight = durationHours * TIME_SLOT_HEIGHT;

  // 新規作成時は、heightとoriginalHeightを同じ値に設定
  const eventHeight = calculatedHeight;
  const originalHeight = calculatedHeight;

  return {
    key_id,
    user_id,
    subject: isProjectTab ? `新規${selectedProjectSubTab}業務` : "新規間接業務",
    startDateTime: startDateTimeStr,
    endDateTime: endDateTimeStr,
    content: "",
    type: isProjectTab ? (selectedProjectSubTab === "会議" ? "会議" : "設計") : "会議",
    organizer: defaultOrganizer,
    projectNumber: isProjectTab && projects.length > 0 ? projects[0].code : "",
    position: defaultPosition,
    facility: "",
    status: "計画中",
    businessCode: "",
    departmentCode: "",
    weekCode: "",
    activityMaincode: initialActivityCode,
    activitySubcode: initialActivitySubcode,
    activityCode: initialActivityCode,
    equipmenNumber: "",
    projectType: isProjectTab ? selectedProjectSubTab : "",
    phase: isProjectTab ? selectedProjectSubTab : "",
    projectSubType: isProjectTab ? selectedProjectSubTab : "",
    color: projectColor,
    top: hour * TIME_SLOT_HEIGHT + (minute / 60) * TIME_SLOT_HEIGHT,
    height: eventHeight,  // イベントの基本高さ
    originalHeight: originalHeight,  // 新規作成時の元の高さ
    unsaved: true
  }
}
