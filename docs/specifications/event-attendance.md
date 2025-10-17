# イベント出席者システム データベース設計

## 概要
イベントの出席者管理システムを実現するためのデータベース設計です。
既存のtest_userテーブルを活用し、イベント管理と出席管理の機能を提供します。

## テーブル構成図

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   test_user     │    │   test_events    │    │ test_event_attendees│
│                 │    │                  │    │                     │
│ - user_id       │    │ - event_id       │    │ - attendance_id     │
│ - name          │    │ - event_name     │    │ - event_id          │
│ - reading       │    │ - description    │    │ - user_id           │
│ - position      │    │ - event_date     │    │ - status            │
│ - years_of_serv │    │ - location       │    │ - registration_date │
│ - created_at    │    │ - max_attendees  │    │ - notes             │
│ - updated_at    │    │ - status         │    │ - created_at        │
└─────────────────┘    │ - created_at     │    └─────────────────────┘
                       │ - updated_at     │
                       └──────────────────┘
```

## 詳細設計

### 1. test_events（イベント基本情報テーブル）
**説明**: イベントの基本情報を管理するマスタテーブル

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| event_id | INTEGER | PRIMARY KEY AUTOINCREMENT | 主キー |
| event_name | TEXT | NOT NULL | イベント名 |
| description | TEXT | - | イベント説明 |
| event_date | DATETIME | NOT NULL | イベント開催日時 |
| location | TEXT | - | 開催場所 |
| max_attendees | INTEGER | - | 最大参加者数 |
| status | TEXT | NOT NULL DEFAULT 'active' | イベントステータス |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 更新日時 |

**ステータス値**:
- 'active' - 開催予定
- 'cancelled' - キャンセル
- 'completed' - 終了
- 'postponed' - 延期

### 2. test_event_attendees（イベント出席者テーブル）
**説明**: イベントへの出席登録・管理テーブル

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| attendance_id | INTEGER | PRIMARY KEY AUTOINCREMENT | 主キー |
| event_id | INTEGER | NOT NULL | イベントID |
| user_id | INTEGER | NOT NULL | ユーザーID |
| status | TEXT | NOT NULL DEFAULT 'registered' | 出席ステータス |
| registration_date | DATETIME | DEFAULT CURRENT_TIMESTAMP | 登録日時 |
| notes | TEXT | - | 備考 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 作成日時 |

**出席ステータス値**:
- 'registered' - 出席登録済み
- 'confirmed' - 出席確定
- 'cancelled' - キャンセル
- 'attended' - 出席済み
- 'absent' - 欠席

## リレーションシップ

### 外部キー制約
1. `test_event_attendees.event_id` → `test_events.event_id`
2. `test_event_attendees.user_id` → `test_user.user_id`

### 制約
- 同一ユーザーが同一イベントに複数回登録できない（UNIQUE制約）
- イベントの最大参加者数を超える登録を防ぐ（アプリケーション制約）

## インデックス戦略

### パフォーマンス向上のためのインデックス
```sql
-- test_eventsテーブル
CREATE INDEX IF NOT EXISTS idx_test_events_date ON test_events(event_date);
CREATE INDEX IF NOT EXISTS idx_test_events_status ON test_events(status);

-- test_event_attendeesテーブル
CREATE INDEX IF NOT EXISTS idx_test_attendees_event_id ON test_event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_test_attendees_user_id ON test_event_attendees(user_id);
CREATE INDEX IF NOT EXISTS idx_test_attendees_status ON test_event_attendees(status);
CREATE INDEX IF NOT EXISTS idx_test_attendees_registration_date ON test_event_attendees(registration_date);
```

## サンプルクエリ

### 1. イベント一覧取得（参加者数付き）
```sql
SELECT 
    e.*,
    COUNT(ea.attendance_id) as attendee_count
FROM test_events e
LEFT JOIN test_event_attendees ea ON e.event_id = ea.event_id
WHERE e.status = 'active'
GROUP BY e.event_id
ORDER BY e.event_date;
```

### 2. 特定イベントの出席者一覧
```sql
SELECT 
    tu.name,
    tu.position,
    ea.status,
    ea.registration_date
FROM test_event_attendees ea
JOIN test_user tu ON ea.user_id = tu.user_id
WHERE ea.event_id = ?
ORDER BY ea.registration_date;
```

### 3. ユーザーの出席履歴
```sql
SELECT 
    e.event_name,
    e.event_date,
    ea.status,
    ea.registration_date
FROM test_event_attendees ea
JOIN test_events e ON ea.event_id = e.event_id
WHERE ea.user_id = ?
ORDER BY e.event_date DESC;
```

### 4. 出席率統計
```sql
SELECT 
    e.event_name,
    COUNT(ea.attendance_id) as total_registered,
    COUNT(CASE WHEN ea.status = 'attended' THEN 1 END) as attended,
    ROUND(
        CAST(COUNT(CASE WHEN ea.status = 'attended' THEN 1 END) AS FLOAT) / 
        CAST(COUNT(ea.attendance_id) AS FLOAT) * 100, 2
    ) as attendance_rate
FROM test_events e
LEFT JOIN test_event_attendees ea ON e.event_id = ea.event_id
WHERE e.status = 'completed'
GROUP BY e.event_id, e.event_name;
```

## 拡張機能の提案

### 1. イベントカテゴリ機能
```sql
-- event_categoriesテーブル
CREATE TABLE event_categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- eventsテーブルにcategory_idを追加
ALTER TABLE events ADD COLUMN category_id INTEGER;
```

### 2. イベント通知機能
```sql
-- event_notificationsテーブル
CREATE TABLE event_notifications (
    notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    notification_type TEXT NOT NULL,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (user_id) REFERENCES test_user(user_id)
);
```

### 3. イベント評価機能
```sql
-- event_feedbackテーブル
CREATE TABLE event_feedback (
    feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (user_id) REFERENCES test_user(user_id)
);
```

## 実装時の考慮事項

### 1. データ整合性
- 外部キー制約による参照整合性の確保
- チェック制約によるステータス値の妥当性チェック
- トランザクション処理による一貫性の確保

### 2. パフォーマンス
- 適切なインデックスの設定
- 大量データの場合はページネーション実装
- 複雑な集計クエリはビューとして作成

### 3. セキュリティ
- SQLインジェクション対策
- 適切なアクセス制御
- ログ記録による監査証跡

### 4. 運用性
- 定期的なデータバックアップ
- パフォーマンス監視
- データアーカイブ戦略

## 作成日: 2025-01-XX
## 更新日: 2025-01-XX
## 作成者: AI Assistant
## バージョン: 1.0.0 