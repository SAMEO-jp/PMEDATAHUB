// ==========================================
// ファイル名: file.ts
// 機能: week-shiwakeフォルダ以下のイベント型定義の現状分析と修正方針
// 作成日: 2024-12-19
// ==========================================

// ==========================================
// 現状分析
// ==========================================

/**
 * 1. イベント型定義の現状
 * 
 * 主要な型定義ファイル:
 * - types/event.ts: EventItem, ClientEvent
 * - utils/constants.ts: EVENT_CATEGORY_COLORS, ACTIVITY_CODES
 * - constants/index.ts: EVENT_CATEGORY_COLORS（重複）
 * 
 * 問題点:
 * 1. 型定義の不整合
 *    - EventItemとClientEventでプロパティの重複・不整合
 *    - WeekEvent型（page.tsx内）とClientEvent型の混在
 *    - [key: string]: unknown による型安全性の欠如
 * 
 * 2. カラー定義の重複
 *    - constants/index.ts: 数字キー（"0", "1", ...）
 *    - utils/constants.ts: 文字列キー（"会議", "営業", ...）
 *    - 統一されていないカラー設定
 * 
 * 3. 業務分類コードの混乱
 *    - classification1-9: 古い分類システム
 *    - activityCode: 新しい分類システム
 *    - businessCode: 混在している分類コード
 *    - 各タブコンポーネントで独自のコード生成ロジック
 * 
 * 4. データ変換の複雑性
 *    - formatEventForClient: サーバー→クライアント
 *    - formatEventForServer: クライアント→サーバー
 *    - 変換ロジックの重複と不整合
 */

// ==========================================
// 修正方針
// ==========================================

/**
 * 1. 型定義の統一
 * 
 * 推奨構成:
 * - types/event.ts: 統一されたイベント型定義
 * - types/event-category.ts: カテゴリ型定義
 * - types/activity-code.ts: 業務分類コード型定義
 * 
 * 統一型定義:
 * ```typescript
 * interface BaseEvent {
 *   id: string
 *   keyID: string
 *   startDateTime: string
 *   endDateTime: string
 *   title: string
 *   description: string
 *   employeeNumber: string
 *   category: EventCategory
 *   activityCode: ActivityCode
 *   position?: string
 *   facility?: string
 *   status?: EventStatus
 *   organizer?: string
 *   projectNumber?: string
 *   weekCode?: string
 * }
 * 
 * interface ClientEvent extends BaseEvent {
 *   color: string
 *   top: number
 *   height: number
 *   unsaved?: boolean
 * }
 * 
 * interface ServerEvent extends BaseEvent {
 *   subject: string
 *   content?: string
 *   type?: string
 *   // 古い分類フィールド（後方互換性のため）
 *   classification1?: string
 *   classification2?: string
 *   // ... classification9
 * }
 * ```
 */

/**
 * 2. カラー定義の統一
 * 
 * 推奨構成:
 * - constants/event-colors.ts: 統一されたカラー定義
 * 
 * 統一カラー定義:
 * ```typescript
 * export const EVENT_CATEGORY_COLORS: Record<EventCategory, string> = {
 *   MEETING: "#2563eb",     // 会議
 *   SALES: "#dc2626",       // 営業
 *   TRAINING: "#7e22ce",    // 研修
 *   DEVELOPMENT: "#16a34a", // 開発
 *   REPORT: "#ca8a04",      // 報告
 *   PLANNING: "#0e7490",    // 計画
 *   DESIGN: "#7e22ce",      // 設計
 *   PURCHASE: "#ea580c",    // 購入
 *   OTHER: "#475569",       // その他
 * }
 * ```
 */

/**
 * 3. 業務分類コードの統一
 * 
 * 推奨構成:
 * - types/activity-code.ts: 業務分類コード型定義
 * - constants/activity-codes.ts: 業務分類コード定数
 * 
 * 統一業務分類コード:
 * ```typescript
 * export type ActivityCode = 
 *   | `M${string}${string}`  // 会議系
 *   | `P${string}${string}`  // 計画系
 *   | `D${string}${string}`  // 設計系
 *   | `B${string}${string}`  // 購入系
 *   | `O${string}${string}`  // その他
 * 
 * export const ACTIVITY_CODES = {
 *   MEETING: {
 *     INTERNAL: "M001",
 *     EXTERNAL: "M002",
 *     PROJECT: "M003",
 *     OTHER: "M004"
 *   },
 *   PLANNING: {
 *     PLAN: "P001",
 *     ESTIMATE: "P002",
 *     CONSIDERATION: "P003"
 *   },
 *   // ... 他のカテゴリ
 * }
 * ```
 */

/**
 * 4. データ変換の統一
 * 
 * 推奨構成:
 * - utils/event-converter.ts: 統一された変換ロジック
 * 
 * 統一変換関数:
 * ```typescript
 * export function convertToClientEvent(serverEvent: ServerEvent): ClientEvent
 * export function convertToServerEvent(clientEvent: ClientEvent): ServerEvent
 * export function createNewEvent(params: CreateEventParams): ClientEvent
 * ```
 */

// ==========================================
// 実装優先度
// ==========================================

/**
 * Phase 1: 型定義の統一（高優先度）
 * - types/event.ts の修正
 * - 重複型定義の削除
 * - 型安全性の向上
 * 
 * Phase 2: カラー定義の統一（中優先度）
 * - constants/event-colors.ts の作成
 * - 重複定義の削除
 * - カラー参照の統一
 * 
 * Phase 3: 業務分類コードの統一（中優先度）
 * - types/activity-code.ts の作成
 * - constants/activity-codes.ts の作成
 * - タブコンポーネントの修正
 * 
 * Phase 4: データ変換の統一（低優先度）
 * - utils/event-converter.ts の作成
 * - 既存変換関数の統合
 * - 変換ロジックの最適化
 */

// ==========================================
// 影響範囲
// ==========================================

/**
 * 修正が必要なファイル:
 * 
 * 型定義関連:
 * - types/event.ts
 * - page.tsx（WeekEvent型の削除）
 * - lib/client-db.ts（型エラーの修正）
 * 
 * カラー定義関連:
 * - constants/index.ts（削除）
 * - utils/constants.ts（修正）
 * - utils/formatEventForClientUtils.ts（修正）
 * 
 * 業務分類コード関連:
 * - components/sidebar/*.tsx（全タブコンポーネント）
 * - utils/eventUtils.ts
 * - lib/client-storage.ts
 * 
 * データ変換関連:
 * - utils/formatEventForClientUtils.ts
 * - lib/client-storage.ts
 * - lib/client-db.ts
 */

// ==========================================
// 注意事項
// ==========================================

/**
 * 1. 後方互換性の維持
 * - 既存のclassification1-9フィールドは段階的に削除
 * - 古いデータ形式のサポート継続
 * 
 * 2. 段階的移行
 * - 一度に全てを変更せず、段階的に修正
 * - 各段階でのテスト実施
 * 
 * 3. データ整合性
 * - 既存データの移行計画
 * - データ変換の検証
 * 
 * 4. パフォーマンス
 * - 型チェックの最適化
 * - 不要な変換処理の削除
 */

