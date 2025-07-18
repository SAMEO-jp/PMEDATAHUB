// ==========================================
// ファイル名: formatEventForClientUtils.ts
// 機能: イベントデータのクライアント表示用フォーマット変換
// 技術: TypeScript, データ変換ユーティリティ
// 作成日: 2024-01-15
// 更新履歴: 2024-01-20: 重複関数の統合が必要
// ==========================================

// ==========================================
// 重複関数整理方針
// ==========================================
/*
修正完了:
- client-storage.ts の重複実装を削除し、このファイルに統合
- カラー設定を定数ファイル（EVENT_CATEGORY_COLORS）に統一
- 型安全性を向上（ClientEvent型の明示的指定）

残りの改善項目:
- __ignore__/null/zisseki/.../zisseki_get_data.ts との統合（使用されていないため優先度低）
- カラー設定の完全統一（文字列キーと数字キーの統合）
- エラーハンドリングの強化
- パフォーマンス最適化

推奨ファイル構成:
- utils/formatEventForClientUtils.ts (統合されたフォーマッター)
- constants/event-colors.ts (カラー設定の完全統一)
- types/event.ts (統一された型定義)
*/

// ==========================================
// インポート層
// ==========================================
import { EventItem, ClientEvent } from "../types/event"
import { EVENT_CATEGORY_COLORS } from "../constants"

// ==========================================
// データ変換層（サーバー → クライアント）
// ==========================================

/**
 * イベントデータをクライアント表示用にフォーマットする
 * 
 * 使用箇所:
 * - page.tsx: イベント表示時のデータ変換
 * - client-db.ts: API通信後のデータ変換
 * 
 * 統合状況:
 * - client-storage.ts: 削除済み（このファイルに統合）
 * - __ignore__/null/zisseki/.../zisseki_get_data.ts: 使用されていないため統合対象外
 * 
 * TODO: 改善提案
 * - カラー設定の完全統一（文字列キーと数字キーの統合）
 * - エラーハンドリングの強化
 * - パフォーマンス最適化
 * - バリデーション強化
 * 
 * @param item イベントアイテム
 * @returns フォーマットされたイベントデータ
 */
export function formatEventForClient(item: EventItem): ClientEvent {
  const startTime = new Date(item.startDateTime)
  const endTime = new Date(item.endDateTime)
  const startHour = startTime.getHours()
  const startMinutes = startTime.getMinutes()
  const endHour = endTime.getHours()
  const endMinutes = endTime.getMinutes()
  const duration = (endHour - startHour) * 60 + (endMinutes - startMinutes)
  const top = startHour * 64 + (startMinutes / 60) * 64
  const height = (duration / 60) * 64

  return {
    id: item.keyID,
    keyID: item.keyID,
    title: item.subject,
    startDateTime: item.startDateTime,
    endDateTime: item.endDateTime,
    description: item.content || "",
    project: item.projectNumber || "",
    category: item.type || "",
    color: item.type ? (EVENT_CATEGORY_COLORS[item.type] || "#3788d8") : "#3788d8",
    employeeNumber: item.employeeNumber,
    position: item.position,
    facility: item.facility,
    status: item.status,
    organizer: item.organizer,
    top,
    height,
    businessCode: item.businessCode || item.classification5 || "",
    departmentCode: item.departmentCode || "",
    weekCode: item.weekCode,
    classification1: item.classification1,
    classification2: item.classification2,
    classification3: item.classification3,
    classification4: item.classification4,
    classification5: item.classification5,
    classification6: item.classification6,
    classification7: item.classification7,
    classification8: item.classification8,
    classification9: item.classification9,
    activityCode: item.businessCode || item.classification5 || "",
    activityRow: item.classification6 || "",
    activityColumn: item.classification7 || "",
    activitySubcode: item.classification8 || "",
    equipmentNumber: item.departmentCode || "",
  }
} 