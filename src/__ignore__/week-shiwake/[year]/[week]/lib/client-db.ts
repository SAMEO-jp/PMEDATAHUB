/**
 * クライアントサイドからデータベースを操作するためのラッパー関数
 * 週データをlocalStorageに保存・取得する関数群
 * 
 * TODO: 型安全性の改善が必要
 * - events: any[] を具体的な型に変更
 * - EventItem型に不足しているプロパティを追加
 * - updatedEventsの型定義を明確化
 */

import {
  saveWeekDataToStorage,
  getWeekDataFromStorage,
  setWeekDataChanged,
  hasWeekDataChanged,
  formatEventForServer
} from './client-storage';

import { formatEventForClient } from '../utils/formatEventForClientUtils';
import { useAuthStore } from '@/src/store/authStore';

// ==========================================
// 型定義層（修正方針）
// ==========================================
// TODO: 以下の型定義を追加・修正する必要があります
// interface WeekEvent {
//   id: string;
//   keyID?: string;
//   classification5?: string;
//   classification6?: string;
//   classification7?: string;
//   activityCode?: string;
//   businessCode?: string;
//   departmentCode?: string;
//   activityRow?: number;
//   activityColumn?: number;
//   unsaved?: boolean;
//   [key: string]: any; // その他のプロパティ
// }

// interface ServerEvent extends WeekEvent {
//   oldId?: string; // 新規イベント用のマッピングID
// }

// interface UpdatedEvent {
//   oldId: string;
//   newId: string;
// }

// ==========================================
// データ取得層
// ==========================================
/**
 * 特定の年と週の実績データを取得する関数
 * 
 * 使用箇所:
 * - page.tsx: 初期データ読み込み時
 * 
 * 修正方針:
 * - エラーハンドリングの強化
 * - キャッシュ有効期限の実装
 * - リトライ機能の追加
 * 
 * @param year 年
 * @param week 週番号
 * @param forceRefresh キャッシュを無視して再取得するかどうか
 * @returns 実績データの配列
 */
export async function getAchievementsByWeek(year: number, week: number, forceRefresh = false) {
  try {
    console.log(`getAchievementsByWeek が呼び出されました: ${year}年 第${week}週, forceRefresh=${forceRefresh}`)

    // ローカルストレージから週データを取得
    const cachedData = getWeekDataFromStorage(year, week)

    // キャッシュデータがあり、強制更新でない場合はキャッシュを返す
    if (cachedData && !forceRefresh) {
      console.log("キャッシュから週データを取得しました", year, week, "件数:", cachedData.length)
      return cachedData
    }

    // APIから週データを取得
    console.log(`APIから週データを取得します: /api/achievements/week/${year}/${week}`)
    const response = await fetch(`/api/achievements/week/${year}/${week}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API応答エラー: ${response.status}`, errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const data = await response.json()
    console.log("API応答:", data)

    if (!data.success) {
      throw new Error(data.message || "データの取得に失敗しました")
    }

    // 取得したデータをクライアント表示用に変換
    const formattedEvents = data.data.map(formatEventForClient)
    console.log("フォーマット後のイベント数:", formattedEvents.length)

    // サンプルデータをログに出力
    if (formattedEvents.length > 0) {
      console.log("フォーマット後のサンプルイベント:", {
        id: formattedEvents[0].id,
        activityCode: formattedEvents[0].activityCode,
        businessCode: formattedEvents[0].businessCode, // businessCodeをログに追加
        departmentCode: formattedEvents[0].departmentCode, // departmentCodeをログに追加
        classification5: formattedEvents[0].classification5,
        classification6: formattedEvents[0].classification6,
        classification7: formattedEvents[0].classification7,
      })
    }

    // ローカルストレージに保存
    saveWeekDataToStorage(year, week, formattedEvents)
    setWeekDataChanged(year, week, false)

    return formattedEvents
  } catch (error) {
    console.error("実績データの取得中にエラーが発生しました:", error)
    throw error
  }
}

// ==========================================
// データ保存層
// ==========================================
/**
 * 週データを一括保存する関数
 * 
 * 使用箇所:
 * - page.tsx: ページ遷移時の保存、手動保存時
 * - useDataHandlers.ts: データハンドラーでの保存
 * - weekDataManager.ts: データ管理時の保存
 * 
 * 修正方針:
 * - 型安全性の向上（any[] → 具体的な型）
 * - バリデーション強化
 * - 部分保存機能の実装
 * - 保存前の確認機能
 * 
 * @param year 年
 * @param week 週番号
 * @param events イベントデータの配列
 * @returns 保存が成功したかどうか
 */
// TODO: events: any[] を WeekEvent[] に変更する必要があります
export async function saveWeekAchievements(year: number, week: number, events: any[]) {
  try {
    console.log("saveWeekAchievements が呼び出されました", { year, week, eventsCount: events.length })

    // 変更がない場合は何もしない
    if (!hasWeekDataChanged(year, week)) {
      console.log("変更がないため保存をスキップします", year, week)
      return true
    }

    // イベントが空の場合は警告を表示
    if (!events || events.length === 0) {
      console.error("保存するイベントが空です！", { year, week })
      alert("保存するイベントデータが空です。操作をキャンセルします。")
      return false
    }

    // サーバー保存用にフォーマット
    const serverEvents = events.map((event) => {
      const serverEvent = formatEventForServer(event)

      // 新規イベントの場合、oldIdを設定して後でマッピングできるようにする
      // TODO: ServerEvent型にoldIdプロパティを追加する必要があります
      if (event.id && event.id.startsWith("new-")) {
        // @ts-expect-error - TODO: ServerEvent型にoldIdプロパティを追加
        serverEvent.oldId = event.id
      }

      return serverEvent
    })

    console.log("保存するイベント数:", serverEvents.length)
    console.log(
      "サーバーに送信するイベントのサンプル:",
      serverEvents.slice(0, 3).map((e) => ({
        keyID: e.keyID,
        classification5: e.classification5,
        // TODO: EventItem型に以下のプロパティを追加する必要があります
        // @ts-expect-error - activityCodeプロパティが存在しない
        activityCode: e.activityCode,
        // @ts-expect-error - activityRowプロパティが存在しない
        activityRow: e.activityRow,
        // @ts-expect-error - activityColumnプロパティが存在しない
        activityColumn: e.activityColumn,
      })),
    )

    // APIを呼び出して週データを一括保存
    const response = await fetch(`/api/achievements/week/${year}/${week}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ events: serverEvents }),
    })

    // レスポンスのステータスコードをログに出力
    console.log("APIレスポンスステータス:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    // レスポンスのテキストをログに出力
    const responseText = await response.text()
    console.log("APIレスポンステキスト:", responseText)

    // JSONとしてパースし直す
    const data = JSON.parse(responseText)

    if (!data.success) {
      throw new Error(data.message || "データの保存に失敗しました")
    }

    console.log("保存成功:", data)

    // 保存成功後、変更フラグをリセット
    setWeekDataChanged(year, week, false)

    // 新しいIDを持つイベントがある場合、ストレージを更新
    if (data.updatedEvents && data.updatedEvents.length > 0) {
      console.log("更新されたイベント:", data.updatedEvents)
      const updatedEvents = events.map((event) => {
        // TODO: UpdatedEvent型を定義してanyを置き換える必要があります
        const updatedEvent = data.updatedEvents.find((updated: any) => updated.oldId === event.id)

        if (updatedEvent) {
          return { ...event, id: updatedEvent.newId, unsaved: false }
        }
        return { ...event, unsaved: false }
      })

      saveWeekDataToStorage(year, week, updatedEvents)
    } else {
      // 更新IDがない場合でも、すべてのイベントの未保存フラグをリセット
      const updatedEvents = events.map((event) => ({ ...event, unsaved: false }))
      saveWeekDataToStorage(year, week, updatedEvents)
    }

    return true
  } catch (error) {
    console.error("週データの保存中にエラーが発生しました:", error)
    throw error
  }
}

// ==========================================
// データ削除層
// ==========================================
/**
 * 実績データを削除する関数
 * 
 * 使用箇所:
 * - page.tsx: イベント削除時
 * - useDataHandlers.ts: データハンドラーでの削除
 * 
 * 修正方針:
 * - 削除前の確認機能
 * - 削除履歴の記録
 * - 復元機能の検討
 * - 一括削除機能
 * 
 * @param keyID 削除する実績データのID
 */
export async function deleteAchievement(keyID: string) {
  try {
    console.log(`実績データを削除します: ${keyID}`);
    // キー自体が有効かチェック
    if (!keyID || keyID === 'undefined' || keyID === 'null') {
      console.error('無効なkeyIDが指定されました:', keyID);
      throw new Error('無効なkeyIDが指定されました');
    }

    const response = await fetch(`/api/achievements/?keyID=${encodeURIComponent(keyID)}`, {
      method: "DELETE",
    });

    console.log(`削除API応答ステータス: ${response.status}`);

    // レスポンスがJSONでなかった場合のエラーハンドリング
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('レスポンスのJSONパースに失敗しました:', await response.text());
      throw new Error(`レスポンスのJSONパースに失敗: ${parseError}`);
    }

    if (!response.ok) {
      // 404の場合は特別なメッセージを表示
      if (response.status === 404) {
        console.warn(`イベント ${keyID} は既に削除されているか存在しません`);
        // 404の場合でも成功として扱う（すでに存在しないため）
        return true;
      }
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    if (!data.success) {
      throw new Error(data.message || "データの削除に失敗しました");
    }

    console.log("実績データが正常に削除されました:", keyID);
    return true;
  } catch (error) {
    console.error("実績データの削除中にエラーが発生しました:", error);
    // エラーを上位に伝播
    throw error;
  }
}

// ==========================================
// ユーザーデータ取得層（統合版）
// ==========================================

// 型定義
type UserData = {
  employeeNumber: string;
  name: string;
}

type EmployeeList = UserData[];

/**
 * ユーザーデータを取得する統合関数（Zustandストア版）
 * 
 * 使用箇所:
 * - page.tsx: 初期データ読み込み時
 * - client-kintai.ts: 勤怠データ取得時
 * 
 * 修正方針:
 * - Zustandストアからユーザー情報を取得
 * - 型の整合性を確保
 * - エラーハンドリングの強化
 * - 従業員リスト形式と単一ユーザー形式の両方に対応
 * 
 * @param asEmployeeList 従業員リスト形式で返すかどうか（デフォルト: false）
 * @returns ユーザー情報（単一ユーザーまたは従業員リスト）
 */
export async function getUserData(asEmployeeList: true): Promise<EmployeeList>;
export async function getUserData(asEmployeeList: false): Promise<UserData>;
export async function getUserData(asEmployeeList: boolean = false): Promise<UserData | EmployeeList> {
  try {
    // Zustandストアから現在のユーザー情報を取得
    const { currentUser } = useAuthStore.getState()
    
    if (!currentUser) {
      throw new Error("ユーザーがログインしていません")
    }

    const userData: UserData = {
      employeeNumber: currentUser.user_id,
      name: currentUser.name_japanese
    }

    // 従業員リスト形式で返すか、単一ユーザー形式で返すか
    return asEmployeeList ? [userData] : userData
  } catch (error) {
    console.error("ユーザーデータの取得中にエラーが発生しました:", error)
    throw error
  }
}

/**
 * 従業員データを取得する関数（getUserDataのエイリアス）
 * 
 * @returns 従業員データの配列
 */
export async function getEmployees(): Promise<EmployeeList> {
  return getUserData(true)
}

/**
 * 現在のユーザー情報を取得する関数（getUserDataのエイリアス）
 * 
 * @returns ユーザー情報
 */
export async function getCurrentUser(): Promise<UserData> {
  return getUserData(false)
}