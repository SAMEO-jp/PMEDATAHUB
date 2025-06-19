import { BaseEvent, DisplayEvent, ProjectEvent, IndirectEvent } from '../types/event';

/**
 * サーバーから来たイベントデータを
 * クライアントで表示しやすい形に変換する
 */
export function formatEventForClient(item: BaseEvent): DisplayEvent {
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

  // 表示用のプロパティを追加
  const displayProps = {
    top,
    height,
    color: defaultColors[item.type || ""] || "#3788d8",
    unsaved: false
  };

  return {
    ...item,
    ...displayProps
  };
}

/**
 * クライアント側のイベントを
 * サーバー保存用のフォーマットに変換する
 */
export function formatEventForServer(event: DisplayEvent): BaseEvent {
  if (!event.user_id) {
    console.error("イベントにユーザーIDが設定されていません:", event);
    throw new Error("イベントにユーザーIDが設定されていません");
  }

  // 表示用のプロパティを除外
  const { height, top, color, unsaved, ...serverEvent } = event;
  return {
    ...serverEvent,
    updatedAt: new Date().toISOString()
  };
}

/**
 * プロジェクトイベントを表示用イベントに変換する
 */
export function formatProjectEventForDisplay(event: ProjectEvent): DisplayEvent {
  return formatEventForClient(event);
}

/**
 * 間接業務イベントを表示用イベントに変換する
 */
export function formatIndirectEventForDisplay(event: IndirectEvent): DisplayEvent {
  return formatEventForClient(event);
}

/**
 * 指定された週の実績データを取得する
 * @param year 年
 * @param week 週
 * @param user_id ユーザーID
 * @returns 実績データの配列
 */
export async function getZissekiData(
  year: number,
  week: number,
  user_id: string
) {
  try {
    console.log(`getZissekiData が呼び出されました: ${year}年 第${week}週`);

    // APIから週データを取得
    console.log(`APIから週データを取得します: /api/zisseki/week/${user_id}/${year}/${week}`);
    const response = await fetch(`/api/zisseki/week/${user_id}/${year}/${week}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API応答エラー: ${response.status}`, errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log("API応答:", data);

    if (!data.success) {
      throw new Error(data.message || "データの取得に失敗しました");
    }

    // 取得したデータをクライアント表示用に変換
    const formattedEvents = data.data.map((event: BaseEvent) => formatEventForClient(event));
    console.log("フォーマット後のイベント数:", formattedEvents.length);

    return formattedEvents;
  } catch (error) {
    console.error("実績データの取得中にエラーが発生しました:", error);
    throw error;
  }
}

/**
 * 週次実績データの変更状態を設定する関数
 * @param year 年
 * @param week 週番号
 * @param user_id ユーザーID
 * @param changed 変更状態
 */
export function setZissekiDataChanged(
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
 * 週次実績データの変更状態を取得する関数
 * @param year 年
 * @param week 週番号
 * @param user_id ユーザーID
 * @returns 変更状態
 */
export function hasZissekiDataChanged(
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
 * 週次実績データをクリアする関数
 * @param year 年
 * @param week 週番号
 * @param user_id ユーザーID
 */
export function clearZissekiData(
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
