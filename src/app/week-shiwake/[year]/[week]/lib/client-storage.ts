/** * クライアント側のストレージユーティリティ
 * 週データをlocalStorageに保存・取得する関数群
 */

import { EventItem, ClientEvent } from '../types/event';

/**
 * 週データを localStorage に保存する
 */
export function saveWeekDataToStorage(
  year: number,
  week: number,
  user_id: string,
  data: ClientEvent[]
) {
  try {
    localStorage.setItem(
      `week_data_${year}_${week}_${user_id}`,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error("週データの保存中にエラーが発生しました:", error);
  }
}

/**
 * 週データを localStorage から取得する
 */
export function getWeekDataFromStorage(
  year: number,
  week: number,
  user_id: string
): ClientEvent[] | null {
  try {
    const data = localStorage.getItem(`week_data_${year}_${week}_${user_id}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("週データの取得中にエラーが発生しました:", error);
    return null;
  }
}

/**
 * 週データの変更状態を設定する
 */
export function setWeekDataChanged(
  year: number,
  week: number,
  user_id: string,
  changed: boolean
) {
  try {
    localStorage.setItem(
      `week_data_changed_${year}_${week}_${user_id}`,
      JSON.stringify(changed)
    );
  } catch (error) {
    console.error("週データの変更状態の設定中にエラーが発生しました:", error);
  }
}

/**
 * 週データの変更状態を取得する
 */
export function hasWeekDataChanged(
  year: number,
  week: number,
  user_id: string
): boolean {
  try {
    const changed = localStorage.getItem(`week_data_changed_${year}_${week}_${user_id}`);
    return changed ? JSON.parse(changed) : false;
  } catch (error) {
    console.error("週データの変更状態の取得中にエラーが発生しました:", error);
    return false;
  }
}

/**
 * 週データをクリアする
 */
export function clearWeekData(
  year: number,
  week: number,
  user_id: string
) {
  try {
    localStorage.removeItem(`week_data_${year}_${week}_${user_id}`);
    localStorage.removeItem(`week_data_changed_${year}_${week}_${user_id}`);
  } catch (error) {
    console.error("週データのクリア中にエラーが発生しました:", error);
  }
}

/**
 * サーバーから来たイベントデータを
 * クライアントで表示しやすい形に変換する
 */
export function formatEventForClient(item: EventItem): ClientEvent {
  const startTime = new Date(item.startDateTime);
  const endTime = new Date(item.endDateTime);

  const startHour = startTime.getHours();
  const startMinutes = startTime.getMinutes();
  const endHour = endTime.getHours();
  const endMinutes = endTime.getMinutes();
  const duration = (endHour - startHour) * 60 + (endMinutes - startMinutes);

  const top = startHour * 64 + (startMinutes / 60) * 64;
  const height = (duration / 60) * 64;

  const defaultColors: Record<string, string> = {
    会議: "#3788d8",
    営業: "#e67c73",
    研修: "#8e24aa",
    開発: "#43a047",
    報告: "#f6bf26",
  };

  return {
    ...item,
    // 表示用のエイリアス（現在は使用していない）
    // title: item.subject,
    // description: item.content || "",
    // project: item.projectNumber || "",
    // category: item.type || "",
    color: item.color || defaultColors[item.type || ""] || "#3788d8",
    top: top.toString(),
    height: height.toString(),
    // 表示用のエイリアス（現在は使用していない）
    // equipmentNumber: item.equipmenNumber || "",
    // activityRow: item.activityMaincode || "",
    // activityColumn: item.activityCode || "",
    // activitySubcode: item.activitySubcode || "",
    // projectPhase: item.phase || "",
    // projectSubType: item.projectSubType || "",
    // indirectType: item.projectType || "",
    unsaved: false
  };
}

/**
 * クライアント側のイベントを
 * サーバー保存用のフォーマットに変換する
 */
export function formatEventForServer(event: ClientEvent): EventItem {
  if (!event.user_id) {
    console.error("イベントにユーザーIDが設定されていません:", event);
    throw new Error("イベントにユーザーIDが設定されていません");
  }

  const { unsaved, ...serverEvent } = event;
  return {
    ...serverEvent,
    // 以下のフィールドは現在は使用していない
    // key_id: event.key_id,
    // user_id: event.user_id,
    // startDateTime: event.startDateTime,
    // endDateTime: event.endDateTime,
    // subject: event.title || event.subject,
    // content: event.description || event.content || "",
    // type: event.category || event.type || "",
    // projectNumber: event.project || event.projectNumber || "",
    // position: event.position || "",
    // facility: event.facility || "",
    // status: event.status || "計画中",
    // organizer: event.organizer || "",
    // businessCode: event.businessCode || "",
    // departmentCode: event.departmentCode || "",
    // weekCode: event.weekCode || `W${Math.floor((new Date(event.startDateTime).getDate() - 1) / 7) + 1}`,
    // activityMaincode: event.activityRow || event.activityMaincode || "",
    // activitySubcode: event.activitySubcode || "",
    // activityCode: event.activityColumn || event.activityCode || "",
    // equipmenNumber: event.equipmentNumber || event.equipmenNumber || "",
    // projectType: event.indirectType || event.projectType || "",
    // phase: event.projectPhase || event.phase || "",
    // projectSubType: event.projectSubType || "",
    // height: event.height || "",
    // top: event.top || "",
    // color: event.color || "",
    // createdAt: event.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
