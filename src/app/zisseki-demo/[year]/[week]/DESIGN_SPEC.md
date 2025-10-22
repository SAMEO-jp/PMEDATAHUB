# 実績デモ週ページ 設計ドキュメント

このドキュメントは `src/app/zisseki-demo/[year]/[week]` 以下で構築されている実績入力デモページのアーキテクチャを、他プロジェクトへ移植できるレベルの詳細さで整理したものです。Atomic Designの階層に加えて、データソース・ビジネスロジック・UI連携の全体像を説明します。

## 1. 全体概要

- ページURL形式: `/zisseki-demo/:year/:week`
- 主機能:
  - 週単位イベント（実績）の閲覧・編集・保存
  - Outlook予定の取り込みとUI反映
  - プロジェクト／設備／購入品割当の補助入力
  - 週ナビゲーションと自動保存
- フロントエンドは Next.js App Router + クライアントコンポーネントで構築
- データ取得／保存は tRPC 経由で SQLite (`data/achievements.db`) にアクセス

ページエントリ (`page.tsx`) は URL パラメータから年・週を解釈し、ヘッダー操作と各種プロバイダー（`DatabaseProvider` / `EventProvider`）を初期化してテンプレートへ委譲します。【F:src/app/zisseki-demo/[year]/[week]/page.tsx†L1-L209】

## 2. ランタイム依存コンポーネント

### 2.1 状態プロバイダー

| Provider | 主責務 | 主要依存 | 備考 |
| --- | --- | --- | --- |
| `DatabaseProvider` | 認証情報からユーザーIDを確定し、tRPC で週次データ／ユーザー詳細（プロジェクト・設備・購入品）を取得。保存・更新ミューテーションを提供。 | `useZissekiOperations`, `trpc.user.getDetail`, `useAuthContext` | 初期化完了までは空配列を返し、保存APIに userId を確実に渡す。【F:src/app/zisseki-demo/[year]/[week]/context/DatabaseContext.tsx†L1-L207】【F:src/hooks/useZissekiData.ts†L1-L115】 |
| `EventProvider` | `useEventReducer` によるイベント状態と UI 状態を管理。Outlook同期イベントを監視し EventContext へ反映。 | `useEventReducer`, `localStorage`, カスタムイベント `outlookEventsLoaded` | 初回マウント時に `localStorage` の Outlook イベントを TimeGridEvent に変換して格納。【F:src/app/zisseki-demo/[year]/[week]/context/EventContext.tsx†L1-L196】 |

### 2.2 テンプレート／オーガニズム

- `ZissekiPageWrapper` / `ZissekiMainContent`: Atomic Designのテンプレート層。前者でレイアウト枠とローディング制御、後者で TimeGrid + Sidebar を結合し保存ロジックを実装。【F:src/app/zisseki-demo/[year]/[week]/components/layout/ZissekiMainContent.tsx†L1-L205】
- `TimeGrid` オーガニズム: 週日付の生成、30分単位グリッド描画、ドラッグドロップフックを担当。【F:src/app/zisseki-demo/[year]/[week]/components/weekgrid/TimeGrid.tsx†L1-L120】
- `ZissekiSidebar` オーガニズム: 選択中イベントの編集フォームと業務コード選択、プロジェクト／設備／購入品の連動制御を担う。【F:src/app/zisseki-demo/[year]/[week]/components/sidebar/ZissekiSidebar.tsx†L1-L200】

## 3. データソースと保存ロジック

### 3.1 永続データベース

- SQLite ファイル: `data/achievements.db`
- Prisma スキーマに `events`・`PROJECT`・`PROJECT_MEMBERS`・`setsubi_assignment`・`kounyu_assignment` などが定義されている（`events` は ignore されているがテーブル構造の参照に利用）。【F:prisma/schema.prisma†L333-L403】
- DB コネクション: `initializeDatabase()` がアプリルート直下 `data/achievements.db` を開き、存在しなければエラーを投げる。【F:src/lib/db/connection/db_connection.ts†L1-L46】

### 3.2 tRPC ルーター (`src/lib/trpc/routers/zisseki.ts`)

| Procedure | 目的 | SQL/操作 | 戻り値 |
| --- | --- | --- | --- |
| `getWeekData` | 指定週＋ユーザーのイベント取得 | `SELECT ... FROM events WHERE startDateTime BETWEEN ? AND ? AND (employeeNumber = ? OR employeeNumber IS NULL/空)` | `events[]`（UI向け整形）＋メタデータ |【F:src/lib/trpc/routers/zisseki.ts†L1-L210】
| `saveWeekData` | 週単位のイベントを一括保存 | 週範囲で DELETE 後、`REPLACE INTO events (...) VALUES (...)` で upsert。`employeeNumber` に必ず userId を設定。 | 保存件数＋タイムスタンプ |【F:src/lib/trpc/routers/zisseki.ts†L211-L360】
| `updateEvent` | 単一イベントの部分更新 | 所有者チェック → `UPDATE events SET ... WHERE id = ?` | 更新結果 |【F:src/lib/trpc/routers/zisseki.ts†L361-L436】
| `deleteEvent` | 単一イベント削除 | 所有者チェック → `DELETE FROM events WHERE id = ?` | 削除結果 |【F:src/lib/trpc/routers/zisseki.ts†L437-L505】
| `getMonthData` | 月次ビュー向け取得 | 月初〜月末で `getWeekData` と同様の SELECT | `events[]`＋メタデータ |【F:src/lib/trpc/routers/zisseki.ts†L506-L623】

#### ユーザー情報取得
`tRPC user.getDetail` は `USER` テーブルの基本情報に加え、`PROJECT_MEMBERS`・`setsubi_assignment`・`kounyu_assignment` の結合で所属プロジェクトや担当装置・購入品を返却する。【F:src/lib/db/queries/userQueries.ts†L1-L206】【F:src/lib/db/queries/userQueries.ts†L300-L381】

### 3.3 クライアント側データフロー

1. `DatabaseProvider` が `useAuthContext` / URL クエリ / `localStorage` から userId を決定。【F:src/app/zisseki-demo/[year]/[week]/context/DatabaseContext.tsx†L66-L139】
2. `useZissekiOperations` が `trpc.zisseki.getWeekData` を発行し、events/workTimes/metadata を受け取る。【F:src/hooks/useZissekiData.ts†L12-L115】
3. `ZissekiMainContent` 初期レンダリング時に `DatabaseContext` のイベントを `EventContext` へ同期。保存時は `database.saveWeekData(currentEvents)` を呼び、完了後 `refetch()`。【F:src/app/zisseki-demo/[year]/[week]/components/layout/ZissekiMainContent.tsx†L25-L124】
4. `EventContext` は Outlook連携やユーザー操作で更新されたイベントを `useEventReducer` ストアに蓄積し、`TimeGrid` / `Sidebar` に供給。【F:src/app/zisseki-demo/[year]/[week]/context/EventContext.tsx†L22-L184】【F:src/app/zisseki-demo/[year]/[week]/hooks/reducer/useEventReducer.ts†L1-L68】

## 4. ビジネスロジック詳細

### 4.1 イベント生成・編集

- 空スロットダブルクリックで `createNewEvent()` を呼び、タブに応じた業務コードを自動付与（例: プロジェクトタブ「企画・検討」は `PP01`）。ID は `YYYYMMDD-UNIXTIMESTAMP-USERID` 形式。【F:src/app/zisseki-demo/[year]/[week]/utils/eventUtils.ts†L1-L67】
- `useEventReducer` が `eventActions` を介してイベント配列と選択状態、ドラッグ／リサイズ状態を一元管理。【F:src/app/zisseki-demo/[year]/[week]/hooks/reducer/useEventReducer.ts†L1-L68】
- `ZissekiSidebar` は `parseActivityCode()` の結果を元に「プロジェクト／間接業務」タブを自動判定し、タブ切替時にデフォルトコード（例: `ZW04`）へ更新。プロジェクト変更時は設備・購入品選択をリセットして整合性を確保。【F:src/app/zisseki-demo/[year]/[week]/components/sidebar/ZissekiSidebar.tsx†L1-L200】【F:src/app/zisseki-demo/[year]/[week]/components/sidebar/utils/businessCodeUtils.ts†L1-L120】

### 4.2 プロジェクト・設備・購入品の解決

- `DatabaseProvider` の `userInfo.projects/setsubi_assignments/kounyu_assignments` を `useProjectAssignments` が整形し、UI で再利用可能な `code/name` オブジェクトへ変換。【F:src/app/zisseki-demo/[year]/[week]/hooks/useProjectAssignments.ts†L1-L101】
- プロジェクト選択時は `getSetsubiByProject` / `getKounyuByProject` で担当データをフィルタし、未選択時には全組み合わせ候補を提供。
- `ZissekiSidebar` では `IS_PROJECT` フラグを参照し、プロジェクトタブでは本務（`'1'`）のみ、間接タブでは `'0'` のみを候補表示。【F:src/app/zisseki-demo/[year]/[week]/components/sidebar/ZissekiSidebar.tsx†L45-L116】

### 4.3 業務コード体系

- `business-code-config.json`（構造体）をユーティリティで読み取り、メインタブ→サブタブ→詳細タブ→分類名の階層をコードへマッピング。
- `parseActivityCode` でコードからタブ種別を逆引き、`getCodeFromPath` 等で UI 選択内容をコードに戻す仕組みが整備されている。【F:src/app/zisseki-demo/[year]/[week]/components/sidebar/utils/businessCodeUtils.ts†L1-L180】

### 4.4 勤務時間

- `useWorkTimeReducer` が週の勤務時間行の追加・更新・削除・変更有無を管理。現状 DB 連携は未実装で空配列を保持するが、`database.saveWeekData` では `workTimes` を送信可能な形で受け付けている。【F:src/app/zisseki-demo/[year]/[week]/hooks/reducer/useWorkTimeReducer.ts†L1-L117】【F:src/lib/trpc/routers/zisseki.ts†L211-L360】

### 4.5 Outlook 連携

1. ヘッダー操作で `createOutlookSyncService(year, week)` を生成し `syncFromOutlook()` を実行。【F:src/app/zisseki-demo/[year]/[week]/page.tsx†L78-L175】【F:src/lib/outlook/outlookSyncService.ts†L1-L74】
2. `OutlookDataExtractor` がブラウザカレンダーAPI→ローカルストレージ→CSV手動入力の優先順でイベントを収集し、構造化データ（project/color/status/activityCode など）を付与。【F:src/lib/outlook/outlookDataExtractor.ts†L1-L169】
3. 取得イベントを `localStorage` に保存し、`outlookEventsLoaded` カスタムイベントを発火。`EventProvider` が受信して TimeGridEvent に変換、既存イベントとの重複チェック後に `createEvent` を呼び出す。【F:src/app/zisseki-demo/[year]/[week]/context/EventContext.tsx†L22-L184】
4. 保存操作を行うと `employeeNumber`=ユーザーID 付きで SQLite `events` テーブルに反映される。

## 5. ローカルキャッシュ戦略

| 対象 | 保持場所 | 読み出しタイミング |
| --- | --- | --- |
| Outlook同期済みイベント | `localStorage['outlook_events_${year}_${week}']` | `EventProvider` 初期化時および `syncFromOutlook` 完了時 |【F:src/app/zisseki-demo/[year]/[week]/context/EventContext.tsx†L22-L184】
| ヘッダー表示用ユーザー | `localStorage['current_user']`（フォールバック） | `DatabaseProvider` が userId 決定時に参照 |【F:src/app/zisseki-demo/[year]/[week]/context/DatabaseContext.tsx†L94-L133】
| 週実績マスター（従業員・プロジェクト等） | `useZissekiStore` が `localStorage` 保存APIを提供（現状初期化のみ） | 将来の高速化に利用可能 |【F:src/app/zisseki-demo/[year]/[week]/store/zissekiStore.ts†L1-L121】

## 6. 移植時の留意点

1. **データベース**: SQLite ファイルを含む `data/achievements.db` を同ディレクトリへ配置し、`events` テーブル構造と補助テーブル（`USER` / `PROJECT` / `PROJECT_MEMBERS` / `setsubi_master` 等）を同期させる必要があります。`initializeDatabase` は相対パスでファイルを参照するため、サーバ環境のカレントディレクトリに注意します。【F:src/lib/db/connection/db_connection.ts†L1-L46】
2. **認証／ユーザー判定**: `DatabaseProvider` は `AuthContext` を前提とします。別プロジェクトへ移植する場合は `useAuthContext` の代替実装、または URL クエリ・localStorage フォールバックを利用できるよう整合を取ってください。【F:src/app/zisseki-demo/[year]/[week]/context/DatabaseContext.tsx†L80-L138】
3. **tRPC**: `trpc` クライアントとサーバールーターが必要です。移植先で tRPC を使わない場合は `useZissekiOperations` を REST など他APIに差し替えてください。【F:src/hooks/useZissekiData.ts†L1-L115】
4. **Outlook連携**: `navigator.calendar` API や CSV入力ダイアログなどブラウザ依存機能が含まれます。利用不可の場合は `OutlookDataExtractor` の分岐（手動入力）を活用し、連携ボタン周りのUIを調整してください。【F:src/lib/outlook/outlookDataExtractor.ts†L66-L169】
5. **ローカルストレージ依存**: ブラウザ以外（SSR など）では `localStorage` が使用できないため、条件付きで安全に参照していることを確認してください。必要に応じてサーバ側永続化へ移行します。
6. **業務コード体系**: `business-code-config.json` を含めて移植し、社内基準に合わせてカスタマイズします。`parseActivityCode` を中心に UI との対応が組まれているため、構造変更時はサイドバーの表示ロジックも合わせて更新してください。【F:src/app/zisseki-demo/[year]/[week]/components/sidebar/utils/businessCodeUtils.ts†L1-L180】

## 7. 拡張ポイント

- **勤務時間の保存**: 現状 API は空配列を返すのみなので、`events` と同様に `work_times` テーブルを追加し `saveWeekData` で同時保存する余地があります。【F:src/lib/trpc/routers/zisseki.ts†L190-L245】
- **イベント重複・整列ロジック**: `utils/eventOverlapUtils.ts` 等の補助ユーティリティが既存実装に残っている場合は TimeGrid に組み込み可能です。
- **Zustand ストア**: `useZissekiStore` を活用してマスターデータをクライアントサイドキャッシュし、初回アクセス速度を向上できます。【F:src/app/zisseki-demo/[year]/[week]/store/zissekiStore.ts†L1-L121】
- **Outlook 書き戻し**: `OutlookSyncService.addManualEvent()` を利用した予定登録や更新の双方向同期を検討できます。【F:src/lib/outlook/outlookSyncService.ts†L75-L120】

---
この設計ドキュメントを基に、Atomic Design の粒度を保ちながらデータアクセス層・業務ロジック・UI を別プロジェクトへ切り離し移植できます。必要に応じてここで紹介したコンテキスト／フック／ユーティリティを個別モジュールとして再構成してください。
