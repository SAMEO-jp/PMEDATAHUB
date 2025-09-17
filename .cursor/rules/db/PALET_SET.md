# PALET管理システム データベース設計ドキュメント

## 概要
BOM管理システムにおけるPALET（パレット）の出荷・工事管理機能を実現するためのデータベース設計です。
実績管理と予定管理の両方をサポートし、進捗状況の追跡と予定遅延の監視が可能です。

## テーブル構成図

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│  KONPO_PALET    │    │ KONPO_PALET_LIST │    │    palet_master     │
│                 │    │                  │    │                     │
│ - id            │    │ - id             │    │ - palet_id          │
│ - KONPO_PALET_ID│    │ - KONPO_PALET_ID │    │ - bom_palet_list_id │
│ - BUHIN_ID      │    │ - PALET_DISPLAY_ │    │ - palet_name        │
│ - PALET_BUHIN_  │    │   NAME           │    │ - palet_quantity    │
│   QUANTITY      │    │ - PALET_QUANTITY │    │ - created_at        │
│ - created_at    │    │ - created_at     │    │ - updated_at        │
│ - updated_at    │    │ - updated_at     │    └─────────────────────┘
└─────────────────┘    └──────────────────┘              │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────┐
                    │ palet_status_history│ ← 実績管理
                    │                     │
                    │ - history_id        │
                    │ - palet_id          │
                    │ - status_type       │
                    │ - status_date       │
                    │ - location_info     │
                    │ - notes             │
                    │ - created_at        │
                    └─────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────┐
                    │palet_status_planning│ ← 予定管理（新規）
                    │                     │
                    │ - plan_id           │
                    │ - palet_id          │
                    │ - status_type       │
                    │ - planned_date      │
                    │ - planned_location  │
                    │ - planned_notes     │
                    │ - is_completed      │
                    │ - completed_date    │
                    │ - created_at        │
                    │ - updated_at        │
                    └─────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────┐
                    │   temp_locations    │
                    │                     │
                    │ - location_id       │
                    │ - location_name     │
                    │ - location_address  │
                    │ - contact_info      │
                    │ - created_at        │
                    └─────────────────────┘
```

## テーブル詳細

### 1. KONPO_PALET（既存テーブル）
**説明**: 部品単位のパレット情報を管理するテーブル

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 主キー |
| KONPO_PALET_ID | VARCHAR(255) | NOT NULL | パレットID |
| BUHIN_ID | TEXT | - | 部品ID |
| PALET_BUHIN_QUANTITY | INTEGER | DEFAULT 0 | パレット内部品数量 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME | - | 更新日時 |

**インデックス**:
- UNIQUE (id, KONPO_PALET_ID)

### 2. KONPO_PALET_LIST（既存テーブル）
**説明**: パレットリストの基本情報を管理するテーブル

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 主キー |
| KONPO_PALET_ID | VARCHAR(255) | NOT NULL | パレットID |
| PALET_DISPLAY_NAME | TEXT | - | パレット表示名 |
| PALET_QUANTITY | INTEGER | DEFAULT 0 | パレット数量 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME | - | 更新日時 |

**インデックス**:
- UNIQUE (id, KONPO_PALET_ID)

### 3. palet_master（新規テーブル）
**説明**: PALETの基本情報を管理するテーブル（出荷・工事管理用）

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| palet_id | INTEGER | PRIMARY KEY AUTOINCREMENT | 主キー |
| bom_palet_list_id | INTEGER | NOT NULL, FOREIGN KEY | KONPO_PALET_LIST.idへの外部キー |
| palet_name | TEXT | NOT NULL | パレット名 |
| palet_quantity | INTEGER | NOT NULL DEFAULT 1 | パレット数量 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**インデックス**:
- idx_palet_master_bom_id ON palet_master(bom_palet_list_id)

**外部キー制約**:
- bom_palet_list_id → KONPO_PALET_LIST(id)

### 4. palet_status_history（新規テーブル）
**説明**: PALETのステータス履歴を管理するテーブル（実績管理）

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| history_id | INTEGER | PRIMARY KEY AUTOINCREMENT | 主キー |
| palet_id | INTEGER | NOT NULL, FOREIGN KEY | palet_master.palet_idへの外部キー |
| status_type | TEXT | NOT NULL, CHECK制約 | ステータス種別 |
| status_date | DATETIME | NOT NULL | 実績日時 |
| location_info | TEXT | - | 実績場所情報 |
| notes | TEXT | - | 実績備考 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 作成日時 |

**ステータス種別（CHECK制約）**:
- 'shipping' - 出荷
- 'transit' - 経由地
- 'temp_arrival' - 仮置き場到着
- 'construction_start' - 工事開始
- 'construction_complete' - 工事完了

**インデックス**:
- idx_status_history_palet_id ON palet_status_history(palet_id)
- idx_status_history_date ON palet_status_history(status_date)
- idx_status_history_type ON palet_status_history(status_type)

**外部キー制約**:
- palet_id → palet_master(palet_id)

### 5. palet_status_planning（新規テーブル）
**説明**: PALETのステータス予定を管理するテーブル（予定管理）

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| plan_id | INTEGER | PRIMARY KEY AUTOINCREMENT | 主キー |
| palet_id | INTEGER | NOT NULL, FOREIGN KEY | palet_master.palet_idへの外部キー |
| status_type | TEXT | NOT NULL, CHECK制約 | ステータス種別 |
| planned_date | DATETIME | NOT NULL | 予定日時 |
| planned_location | TEXT | - | 予定場所情報 |
| planned_notes | TEXT | - | 予定備考 |
| is_completed | BOOLEAN | DEFAULT FALSE | 完了フラグ |
| completed_date | DATETIME | - | 完了日時 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**ステータス種別（CHECK制約）**:
- 'shipping' - 出荷
- 'transit' - 経由地
- 'temp_arrival' - 仮置き場到着
- 'construction_start' - 工事開始
- 'construction_complete' - 工事完了

**インデックス**:
- idx_status_planning_palet_id ON palet_status_planning(palet_id)
- idx_status_planning_date ON palet_status_planning(planned_date)
- idx_status_planning_completed ON palet_status_planning(is_completed)

**外部キー制約**:
- palet_id → palet_master(palet_id)

### 6. temp_locations（新規テーブル）
**説明**: 仮置き場情報を管理するマスタテーブル

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| location_id | INTEGER | PRIMARY KEY AUTOINCREMENT | 主キー |
| location_name | TEXT | NOT NULL | 場所名 |
| location_address | TEXT | - | 住所 |
| contact_info | TEXT | - | 連絡先情報 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 作成日時 |

## リレーションシップ

### 1. 既存テーブル間の関係
```
KONPO_PALET.KONPO_PALET_ID = KONPO_PALET_LIST.KONPO_PALET_ID
```

### 2. 新規テーブル間の関係
```
palet_master.bom_palet_list_id → KONPO_PALET_LIST.id
palet_status_history.palet_id → palet_master.palet_id
palet_status_planning.palet_id → palet_master.palet_id
```

### 3. 全体の関係
```
KONPO_PALET_LIST ← palet_master ← palet_status_history (実績)
                              ↓
                        palet_status_planning (予定)
                              ↓
                        temp_locations (参照用)
```

## データフロー

### 1. PALET作成フロー
1. `KONPO_PALET_LIST`にパレット基本情報を登録
2. `palet_master`にPALET管理用情報を登録
3. `palet_status_planning`に予定を登録
4. 必要に応じて`palet_status_history`に初期ステータスを登録

### 2. 予定管理フロー
1. `palet_status_planning`にステータス予定を登録
2. 予定変更時は既存レコードを更新
3. 予定完了時は`is_completed`フラグを更新

### 3. 実績管理フロー
1. `palet_status_history`に実績を追加
2. 対応する予定の`is_completed`フラグを更新
3. 予定と実績の差異を分析

### 4. データ取得フロー
1. `palet_master`と`KONPO_PALET_LIST`をJOIN
2. `palet_status_history`から最新実績を取得
3. `palet_status_planning`から予定情報を取得
4. `temp_locations`から場所情報を参照

## サンプルクエリ

### 1. 予定と実績の比較
```sql
SELECT 
  pm.palet_name,
  psp.status_type,
  psp.planned_date,
  psh.status_date as actual_date,
  CASE 
    WHEN psh.status_date IS NULL THEN '未完了'
    WHEN psh.status_date <= psp.planned_date THEN '予定通り'
    ELSE '遅延'
  END as status,
  CASE 
    WHEN psh.status_date IS NULL THEN NULL
    ELSE JULIANDAY(psh.status_date) - JULIANDAY(psp.planned_date)
  END as delay_days
FROM palet_master pm
LEFT JOIN palet_status_planning psp ON pm.palet_id = psp.palet_id
LEFT JOIN palet_status_history psh ON pm.palet_id = psh.palet_id 
  AND psp.status_type = psh.status_type
WHERE psp.is_completed = FALSE
ORDER BY psp.planned_date;
```

### 2. 遅延予定の取得
```sql
SELECT 
  pm.palet_name,
  psp.status_type,
  psp.planned_date,
  psp.planned_location,
  CASE 
    WHEN psp.planned_date < DATE('now') THEN '遅延中'
    WHEN psp.planned_date = DATE('now') THEN '本日予定'
    WHEN psp.planned_date <= DATE('now', '+3 days') THEN '緊急'
    WHEN psp.planned_date <= DATE('now', '+7 days') THEN '要注意'
    ELSE '予定通り'
  END as urgency
FROM palet_status_planning psp
JOIN palet_master pm ON psp.palet_id = pm.palet_id
WHERE psp.is_completed = FALSE
  AND psp.planned_date <= DATE('now', '+7 days')
ORDER BY psp.planned_date;
```

### 3. ステータス別進捗状況
```sql
SELECT 
  psp.status_type,
  COUNT(*) as total_planned,
  SUM(CASE WHEN psp.is_completed = TRUE THEN 1 ELSE 0 END) as completed,
  SUM(CASE WHEN psp.is_completed = FALSE AND psp.planned_date < DATE('now') THEN 1 ELSE 0 END) as delayed,
  ROUND(
    (SUM(CASE WHEN psp.is_completed = TRUE THEN 1 ELSE 0 END) * 100.0) / COUNT(*), 
    2
  ) as completion_rate
FROM palet_status_planning psp
GROUP BY psp.status_type
ORDER BY psp.status_type;
```

### 4. PALET詳細情報取得（予定・実績含む）
```sql
SELECT 
  pm.*,
  kpl.PALET_DISPLAY_NAME as palet_display_name,
  kpl.PALET_QUANTITY as palet_list_quantity,
  -- 最新実績
  psh.status_type as current_status,
  psh.status_date as current_status_date,
  psh.location_info as current_location,
  -- 最新予定
  psp.planned_date as next_planned_date,
  psp.planned_location as next_planned_location,
  psp.status_type as next_status_type
FROM palet_master pm
LEFT JOIN KONPO_PALET_LIST kpl ON pm.bom_palet_list_id = kpl.id
-- 最新実績
LEFT JOIN (
  SELECT 
    palet_id,
    status_type,
    status_date,
    location_info,
    ROW_NUMBER() OVER (PARTITION BY palet_id ORDER BY status_date DESC, created_at DESC) as rn
  FROM palet_status_history
) psh ON pm.palet_id = psh.palet_id AND psh.rn = 1
-- 最新予定
LEFT JOIN (
  SELECT 
    palet_id,
    status_type,
    planned_date,
    planned_location,
    ROW_NUMBER() OVER (PARTITION BY palet_id ORDER BY planned_date ASC) as rn
  FROM palet_status_planning
  WHERE is_completed = FALSE
) psp ON pm.palet_id = psp.palet_id AND psp.rn = 1
WHERE pm.palet_id = ?;
```

### 5. 予定完了処理
```sql
-- 予定を完了済みに更新
UPDATE palet_status_planning 
SET is_completed = TRUE, 
    completed_date = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE plan_id = ?;
```

## パフォーマンス考慮事項

### 1. インデックス戦略
- 外部キーカラムにインデックスを設定
- 日時カラムにインデックスを設定
- ステータス種別にインデックスを設定
- 完了フラグにインデックスを設定

### 2. クエリ最適化
- 最新実績・予定取得にはROW_NUMBER()を使用
- 大量データの場合はページネーションを実装
- 複雑な集計クエリはビューとして作成を検討
- 予定と実績の比較クエリは定期的に実行

### 3. データ管理
- 古い履歴データのアーカイブ
- 完了済み予定の定期的なクリーンアップ
- 統計情報の事前集計

## 拡張性

### 1. 将来の拡張項目
- 工事現場情報テーブル
- 運送業者情報テーブル
- 品質検査情報テーブル
- 写真・ドキュメント管理テーブル
- アラート・通知設定テーブル
- 承認フロー管理テーブル

### 2. マイグレーション考慮
- 既存データとの整合性を保つ
- 段階的な機能追加を可能にする
- データ移行時のバックアップ体制
- 予定管理機能の段階的導入

## セキュリティ考慮事項

### 1. データ整合性
- 外部キー制約による参照整合性の確保
- CHECK制約によるステータス値の妥当性チェック
- トランザクション処理による一貫性の確保
- 予定と実績の整合性チェック

### 2. アクセス制御
- 必要最小限の権限設定
- ログ記録による監査証跡の確保
- データ暗号化の検討
- 予定変更履歴の追跡

### 3. データ品質
- 予定日時の妥当性チェック
- 重複予定の検出
- 予定と実績の矛盾検出
- データ入力時のバリデーション

## 運用考慮事項

### 1. 監視項目
- 遅延予定の自動検出
- 予定完了率の監視
- データ不整合の検出
- パフォーマンス監視

### 2. メンテナンス
- 定期的なインデックス最適化
- 古いデータのアーカイブ
- 統計情報の更新
- バックアップとリストア

### 3. ユーザーサポート
- 予定管理の操作方法
- 遅延対応の手順
- データ修正の手順
- トラブルシューティング

---

**作成日**: 2025-01-XX  
**更新日**: 2025-01-XX  
**作成者**: AI Assistant  
**バージョン**: 2.0.0  
**変更履歴**: 予定管理機能（palet_status_planning）を追加

このドキュメントにより、予定管理機能を含む完全なPALET管理システムの全体像が明確になりました。実装時や保守時の参考資料としてご活用ください。 