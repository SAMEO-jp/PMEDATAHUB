// ==========================================
// ファイル名: client-storage.ts
// 機能: クライアント側のストレージユーティリティ（週データのlocalStorage操作）
// 技術: TypeScript, localStorage API
// 作成日: 2024-01-15
// 更新履歴: 2024-01-20: 
// ==========================================

// ==========================================
// 重複関数整理方針
// ==========================================
/*
修正完了:
- formatEventForClient関数を削除し、utils/formatEventForClientUtils.tsに統合
- カラー設定を定数ファイル（EVENT_CATEGORY_COLORS）に統一
- 型安全性を向上（ClientEvent型の明示的指定）

残りの改善項目:
- カラー設定の完全統一（文字列キーと数字キーの統合）
- エラーハンドリングの強化
- パフォーマンス最適化
- バリデーション強化

推奨ファイル構成:
- utils/formatEventForClientUtils.ts (統合されたフォーマッター)
- constants/event-colors.ts (カラー設定の完全統一)
- types/event.ts (統一された型定義)
*/

// ==========================================
// インポート層
// ==========================================
import { EventItem, ClientEvent } from '../types/event';

// ==========================================
// 型定義層
// ==========================================
// TODO: 型定義の追加が必要
// interface WeekData {
//   year: number;
//   week: number;
//   events: EventItem[];
//   lastModified: Date;
// }

// ==========================================
// 定数定義層
// ==========================================
// TODO: 定数の外部化が必要
// const STORAGE_KEYS = {
//   WEEK_DATA: (year: number, week: number) => `week_data_${year}_${week}`,
//   WEEK_CHANGED: (year: number, week: number) => `week_changed_${year}_${week}`
// };

// ==========================================
// ストレージ操作層（localStorage基本操作）
// ==========================================

/** * クライアント側のストレージユーティリティ
 * 週データをlocalStorageに保存・取得する関数群
 */

/**
 * 週データを localStorage に保存する
 * 
 * 使用箇所:
 * - page.tsx: イベント更新時、データ保存時
 * - client-db.ts: API通信後のデータ保存
 * - useDataHandlers.ts: データハンドラーでの保存
 * - useResizeEvent.ts: リサイズ後の保存
 * - useDndHandlers.ts: ドラッグ&ドロップ後の保存
 * - useUIHandlers.ts: UI操作後の保存
 * 
 * TODO: 改善提案
 * - エラーハンドリングの強化（QuotaExceededError対応）
 * - データサイズの制限チェック
 * - 保存前のデータ検証
 * - 非同期処理への対応検討
 */
export function saveWeekDataToStorage(
  year: number,
  week: number,
  data: ClientEvent[]
) {
  try {
    localStorage.setItem(
      `week_data_${year}_${week}`,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error("週データの保存中にエラーが発生しました:", error);
  }
}

/**
 * localStorage から週データを取得する
 * 
 * 使用箇所:
 * - page.tsx: 初期データ読み込み時、キャッシュ確認時
 * - client-db.ts: API通信前のキャッシュ確認
 * 
 * TODO: 改善提案
 * - データの整合性チェック
 * - キャッシュ有効期限の実装
 * - データ復旧機能の追加
 * - 型安全性の向上
 */
export function getWeekDataFromStorage(
  year: number,
  week: number
): ClientEvent[] | null {
  try {
    const data = localStorage.getItem(`week_data_${year}_${week}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("週データの取得中にエラーが発生しました:", error);
    return null;
  }
}

// ==========================================
// 変更管理層（変更フラグ操作）
// ==========================================

/**
 * 週データが「変更されたか」を示すフラグを設定する
 * 
 * 使用箇所:
 * - page.tsx: データ保存後、変更時
 * - client-db.ts: API通信後のフラグ設定
 * - useDataHandlers.ts: データ変更時のフラグ設定
 * - useResizeEvent.ts: リサイズ後のフラグ設定
 * - useDndHandlers.ts: ドラッグ&ドロップ後のフラグ設定
 * - useUIHandlers.ts: UI操作後のフラグ設定
 * - weekDataManager.ts: データ管理時のフラグ設定
 * 
 * TODO: 改善提案
 * - 変更履歴の詳細記録
 * - 複数ユーザー対応
 * - 変更通知機能
 */
export function setWeekDataChanged(
  year: number,
  week: number,
  changed: boolean
) {
  try {
    localStorage.setItem(
      `week_changed_${year}_${week}`,
      changed ? "true" : "false"
    );
  } catch (error) {
    console.error("週データの変更フラグ設定中にエラーが発生しました:", error);
  }
}

/*** 変更フラグを取得する ***/
/**
 * 変更フラグを取得する
 * 
 * 使用箇所:
 * - page.tsx: ページ遷移時、保存確認時
 * - client-db.ts: API通信前の変更確認
 * - useDataHandlers.ts: データ保存前の変更確認
 * - weekDataManager.ts: データ管理時の変更確認
 * 
 * TODO: 改善提案
 * - デフォルト値の統一
 * - 型安全性の向上
 */
export function hasWeekDataChanged(
  year: number,
  week: number
): boolean {
  try {
    return localStorage.getItem(`week_changed_${year}_${week}`) === "true";
  } catch (error) {
    console.error(
      "週データの変更フラグ取得中にエラーが発生しました:",
      error
    );
    return false;
  }
}

// ==========================================
// データクリーンアップ層
// ==========================================

/**
 * 週データとフラグを両方クリア（削除）する
 * 
 * 使用箇所:
 * - page.tsx: ページ遷移時の古いデータクリア
 * 
 * TODO: 改善提案
 * - 一括削除機能の追加
 * - 削除確認機能
 * - 削除ログの記録
 */
export function clearWeekData(year: number, week: number) {
  try {
    localStorage.removeItem(`week_data_${year}_${week}`);
    localStorage.removeItem(`week_changed_${year}_${week}`);
  } catch (error) {
    console.error("週データのクリア中にエラーが発生しました:", error);
  }
}

// ==========================================
// データ変換層（サーバー ↔ クライアント）
// ==========================================

/**
 * クライアント側のイベントを
 * サーバー保存用のフォーマットに変換する
 * 
 * 使用箇所:
 * - client-db.ts: サーバー保存前のデータ変換
 * 
 * TODO: 改善提案
 * - バリデーション強化
 * - 必須フィールドチェック
 * - データ整合性検証
 * - エラーメッセージの改善
 */
export function formatEventForServer(event: ClientEvent): EventItem {
  // employeeNumberが設定されていない場合はエラーを投げる
  if (!event.employeeNumber) {
    console.error("イベントに社員番号が設定されていません:", event);
    throw new Error("イベントに社員番号が設定されていません");
  }

  const result: EventItem = {
    keyID: event.keyID || event.id,
    employeeNumber: event.employeeNumber,
    startDateTime: event.startDateTime,
    endDateTime: event.endDateTime,
    subject: event.title,
    content: event.description,
    type: event.category,
    projectNumber: event.project,
    position: event.position || "",
    facility: event.facility || "",
    status: event.status || "計画中",
    businessCode: event.businessCode || event.activityCode || "",
    departmentCode: event.departmentCode || event.equipmentNumber || "",
    weekCode:
      event.weekCode ||
      `W${Math.floor((new Date(event.startDateTime).getDate() - 1) / 7) + 1}`,
    classification5:
      event.classification5 || event.businessCode || event.activityCode || "",
    classification6: event.activityRow || event.classification6 || "",
    classification7: event.activityColumn || event.classification7 || "",
    classification8: event.activitySubcode || event.classification8 || "",
    classification9: event.classification9 || "",
  };

  return result;
}