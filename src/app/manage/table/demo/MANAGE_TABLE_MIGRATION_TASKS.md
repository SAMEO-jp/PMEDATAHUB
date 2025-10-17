# manage/table 移行タスクリスト

## 概要
`src/app/manage/table/demo` から `src/app/manage/table` への移行を行い、データベース管理システムを本格運用可能にする。

## 調査結果

### 現在の実装状況（demo）
以下の6つの機能が定義されている：
1. **DB-001: テーブル一覧** (`tables/page.tsx`) ✅ 実装済み
2. **DB-002: テーブル詳細** (`table-detail/page.tsx`) ✅ 実装済み
3. **DB-003: データ検索** (`data-search/page.tsx`) ❌ 未実装
4. **DB-004: SQL実行** (`sql-executor/page.tsx`) ✅ 実装済み
5. **DB-005: データベース統計** (`statistics/page.tsx`) ✅ 実装済み
6. **DB-006: 管理設定** (`settings/page.tsx`) ❌ 未実装

### API設計方針（.cursor/rules/000_api.mdc より）
- **tRPC v11** を使用した型安全なAPI設計
- **データアクセス層（DAL）統一** - `src/lib/db/` ファイル群を必須利用
- **カスタムフック** - `hooks/use{TableName}Data.ts` パターン
- **統一レスポンス形式** - success/error ベース

---

## 移行タスクリスト

### Phase 1: アーキテクチャ準備
#### 1.1 tRPCルーター設計・実装
- [x] **テーブル管理用ルーター作成**
  - ファイル: `src/lib/trpc/routers/db/table.ts` ✅
  - 機能: getAll, getById, getSchema, search, getStatistics ✅
  - バリデーション: Zodスキーマ定義 ✅
  
- [x] **SQL実行用ルーター作成**
  - ファイル: `src/lib/trpc/routers/db/sql.ts` ✅
  - 機能: executeQuery, getQueryHistory, validateQuery ✅
  - セキュリティ: SQL文の制限・検証 ✅

- [x] **データベース統計用ルーター作成**
  - ファイル: `src/lib/trpc/routers/db/statistics.ts` ✅
  - 機能: getDatabaseStats, getTableSizes, getGrowthRates ✅

#### 1.2 データアクセス層（DAL）実装
- [x] **テーブル情報取得関数**
  - `src/lib/db/db_GetData.ts` に実装 ✅
  - テーブル一覧・構造・データ取得 ✅

- [x] **SQL実行基盤**
  - `src/lib/db/db_advanced.ts` に実装 ✅
  - 安全なクエリ実行・履歴管理 ✅

- [x] **統計情報取得関数**
  - `src/lib/db/db_advanced.ts` に実装 ✅
  - レコード数・サイズ・更新日取得 ✅

#### 1.3 カスタムフック実装
- [x] **テーブル管理フック**
  - ファイル: `src/hooks/useTableData.ts` ✅
  - 機能: テーブル一覧・詳細・検索 ✅

- [x] **SQL実行フック**
  - ファイル: `src/hooks/useSqlData.ts` ✅
  - 機能: クエリ実行・履歴管理・バリデーション ✅

- [x] **統計情報フック**
  - ファイル: `src/hooks/useStatisticsData.ts` ✅
  - 機能: データベース統計・パフォーマンス情報 ✅

### Phase 2: コンポーネント移行・リファクタリング
#### 2.1 共通コンポーネント作成
- [x] **テーブル表示コンポーネント**
  - ファイル: `src/components/table/TableView.tsx` ✅
  - 機能: ページネーション・ソート・フィルタリング ✅

- [x] **SQLエディタコンポーネント**
  - ファイル: `src/components/sql/SqlEditor.tsx` ✅
  - 機能: シンタックスハイライト・補完・履歴 ✅

- [x] **統計グラフコンポーネント**
  - ファイル: `src/components/statistics/StatisticsChart.tsx` ✅
  - 機能: データ可視化・チャート表示 ✅

#### 2.2 ページコンポーネント移行
- [x] **メインページ**
  - 移行元: `demo/page.tsx` ✅
  - 移行先: `manage/table/page.tsx` ✅
  - 変更: デモデータ → 実データ接続 ✅

- [x] **テーブル一覧ページ**
  - 移行元: `demo/tables/page.tsx` ✅
  - 移行先: `manage/table/tables/page.tsx` ✅
  - 変更: tRPCフック適用・実データ接続 ✅

- [x] **テーブル詳細ページ**
  - 移行元: `demo/table-detail/page.tsx` ✅
  - 移行先: `manage/table/detail/[id]/page.tsx` ✅
  - 変更: 動的ルーティング・実データ接続 ✅

- [x] **SQL実行ページ**
  - 移行元: `demo/sql-executor/page.tsx` ✅
  - 移行先: `manage/table/sql/page.tsx` ✅
  - 変更: tRPCフック適用・履歴機能 ✅

- [x] **統計情報ページ**
  - 移行元: `demo/statistics/page.tsx` ✅
  - 移行先: `manage/table/statistics/page.tsx` ✅
  - 変更: 実統計データ接続・チャート実装 ✅

#### 2.3 新規ページ実装
- [x] **データ検索ページ**
  - ファイル: `manage/table/search/page.tsx` ✅
  - 機能: 条件検索・フィルタリング・エクスポート ✅

- [x] **管理設定ページ**
  - ファイル: `manage/table/settings/page.tsx` ✅
  - 機能: バックアップ・ログ設定・権限管理 ✅

### Phase 3: セキュリティ・パフォーマンス対応
#### 3.1 セキュリティ実装
- [ ] **SQL実行制限**
  - 許可クエリ種別の制限（SELECT系のみ等）
  - SQLインジェクション対策
  - クエリタイムアウト設定

- [ ] **権限管理**
  - ユーザー認証・認可システム
  - 機能別アクセス制御
  - ログ記録・監査機能

#### 3.2 パフォーマンス最適化
- [ ] **データローディング最適化**
  - 仮想スクロール（大量データ対応）
  - ページネーション実装
  - キャッシュ戦略

- [ ] **クエリ最適化**
  - React Query設定調整
  - 不要なリクエスト削減
  - エラーハンドリング強化

### Phase 4: テスト・デプロイ準備
#### 4.1 テスト実装
- [ ] **APIテスト**
  - tRPCプロシージャのテスト
  - DAL関数のユニットテスト
  - エラーハンドリングテスト

- [ ] **コンポーネントテスト**
  - 各ページコンポーネントのテスト
  - フック機能のテスト
  - UI操作のテスト

#### 4.2 ドキュメント・設定
- [ ] **API仕様書作成**
  - tRPCルーター仕様
  - エラーコード一覧
  - 使用方法ガイド

- [ ] **環境設定**
  - 型安全な環境変数設定（`lib/env.ts`）
  - データベース接続設定
  - 本番環境対応

#### 4.3 移行・クリーンアップ
- [ ] **ルーティング更新**
  - 既存リンクの更新
  - リダイレクト設定
  - メニュー項目更新

- [ ] **demoフォルダクリーンアップ**
  - demo フォルダの削除
  - 不要なファイルの削除
  - インポートパス更新

---

## 技術要件

### 必須技術スタック
- **Frontend**: Next.js 14.2.28, React, TypeScript
- **API**: tRPC v11 + React Query
- **バリデーション**: Zod
- **データベース**: 既存DB接続システム利用
- **スタイリング**: Tailwind CSS + Lucide Icons

### ディレクトリ構成（移行後）
```
src/
├── app/
│   └── manage/
│       └── table/
│           ├── page.tsx                    # メイン管理画面
│           ├── tables/
│           │   └── page.tsx               # テーブル一覧
│           ├── detail/
│           │   └── [id]/
│           │       └── page.tsx           # テーブル詳細
│           ├── search/
│           │   └── page.tsx               # データ検索
│           ├── sql/
│           │   └── page.tsx               # SQL実行
│           ├── statistics/
│           │   └── page.tsx               # 統計情報
│           ├── settings/
│           │    └── page.tsx               # 管理設定
│           │
│           ├── hooks/
│           │   ├── useTableData.ts                   # テーブル管理フック
│           │   ├── useSqlData.ts                     # SQL実行フック
│           │   └── useStatisticsData.ts              # 統計情報フック
│           └── components/
│                ├── table/
│                │   └── TableView.tsx                 # テーブル表示
│                ├── sql/
│                │   └── SqlEditor.tsx                 # SQLエディタ
│                └── statistics/
│                    └── StatisticsChart.tsx           # 統計グラフ
│
├── lib/
│   ├── trpc/
│   │   └── routers/
│   │       └── db/
│   │           ├── table.ts              # テーブル管理API
│   │           ├── sql.ts                # SQL実行API
│   │           └── statistics.ts         # 統計情報API
│   └── db/                               # 既存DAL利用

```

### 実装優先順位
1. **高優先度**: Phase 1（アーキテクチャ準備）+ Phase 2.1（共通コンポーネント）
2. **中優先度**: Phase 2.2（ページ移行）+ Phase 2.3（新規ページ）
3. **低優先度**: Phase 3（セキュリティ・パフォーマンス）+ Phase 4（テスト・デプロイ）

### 所要時間見積もり
- **Phase 1**: 3-4日
- **Phase 2**: 5-6日  
- **Phase 3**: 2-3日
- **Phase 4**: 2-3日
- **合計**: 12-16日（約3-4週間）

---

## 注意事項
- デモデータから実データへの切り替え時は十分なテストを実施
- セキュリティ要件（SQL実行制限等）は必ず実装
- パフォーマンスに配慮した実装（大量データ対応）
- 既存システムとの互換性を確保