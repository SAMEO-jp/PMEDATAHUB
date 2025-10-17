# 大製番体系技術管理システム データベース構造ドキュメント

## 📊 データベース概要

**データベース名**: `achievements.db`  
**データベースタイプ**: SQLite  
**作成日**: 2025年1月現在

## 🗂️ テーブル一覧

大製番体系技術管理システムで使用するテーブル一覧：

```
LARGE_SEIBAN_SYSTEM      # 大製番体系テーブル
MEDIUM_SEIBAN_SYSTEM     # 中製番体系テーブル
TECH_DOCUMENTS          # 検討書テーブル
```

## 📋 テーブル詳細

### 1. LARGE_SEIBAN_SYSTEM テーブル

#### テーブル構造
```sql
CREATE TABLE IF NOT EXISTS "LARGE_SEIBAN_SYSTEM" (
    ROWID INTEGER PRIMARY KEY,
    LARGE_SEIBAN_ID TEXT UNIQUE NOT NULL,
    LARGE_SEIBAN_NAME TEXT NOT NULL,
    LARGE_SEIBAN_DESCRIPTION TEXT,
    LARGE_SEIBAN_CATEGORY TEXT,
    LARGE_SEIBAN_TYPE TEXT,
    LARGE_SEIBAN_STATUS TEXT DEFAULT 'active',
    ORDER_NUM INTEGER DEFAULT 0,
    CREATED_AT TEXT DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TEXT DEFAULT CURRENT_TIMESTAMP,
    CREATED_BY TEXT,
    UPDATED_BY TEXT,
    LARGE_SEIBAN_NOTE TEXT,
    SPARE1 TEXT,
    SPARE2 TEXT,
    SPARE3 TEXT
);
```

#### カラム詳細

| カラム名 | データ型 | NULL | デフォルト値 | 説明 |
|---------|---------|------|-------------|------|
| ROWID | INTEGER | NO | AUTO_INCREMENT | 主キー（自動採番） |
| LARGE_SEIBAN_ID | TEXT | NO | - | 大製番識別子（一意） |
| LARGE_SEIBAN_NAME | TEXT | NO | - | 大製番名 |
| LARGE_SEIBAN_DESCRIPTION | TEXT | YES | - | 大製番説明 |
| LARGE_SEIBAN_CATEGORY | TEXT | YES | - | 大製番カテゴリ |
| LARGE_SEIBAN_TYPE | TEXT | YES | - | 大製番タイプ |
| LARGE_SEIBAN_STATUS | TEXT | YES | 'active' | 大製番状態 |
| ORDER_NUM | INTEGER | YES | 0 | 表示順序 |
| CREATED_AT | TEXT | YES | CURRENT_TIMESTAMP | 作成日時 |
| UPDATED_AT | TEXT | YES | CURRENT_TIMESTAMP | 更新日時 |
| CREATED_BY | TEXT | YES | - | 作成者 |
| UPDATED_BY | TEXT | YES | - | 更新者 |
| LARGE_SEIBAN_NOTE | TEXT | YES | - | 備考 |
| SPARE1 | TEXT | YES | - | 予備フィールド1 |
| SPARE2 | TEXT | YES | - | 予備フィールド2 |
| SPARE3 | TEXT | YES | - | 予備フィールド3 |

#### サンプルデータ
```
ROWID: 1
LARGE_SEIBAN_ID: SEIBAN-1000
LARGE_SEIBAN_NAME: 製銑・精錬技術体系
LARGE_SEIBAN_DESCRIPTION: 製銑・精錬に関する技術開発、設備管理、品質管理を担当する技術体系
LARGE_SEIBAN_CATEGORY: seisen
LARGE_SEIBAN_TYPE: technical
LARGE_SEIBAN_STATUS: active
ORDER_NUM: 1
CREATED_AT: 2025-01-01T00:00:00Z
UPDATED_AT: 2025-01-01T00:00:00Z
CREATED_BY: admin
UPDATED_BY: admin
LARGE_SEIBAN_NOTE: 製銑・精錬分野の基盤技術体系
```

### 2. MEDIUM_SEIBAN_SYSTEM テーブル

#### テーブル構造
```sql
CREATE TABLE IF NOT EXISTS "MEDIUM_SEIBAN_SYSTEM" (
    ROWID INTEGER PRIMARY KEY,
    MEDIUM_SEIBAN_ID TEXT UNIQUE NOT NULL,
    LARGE_SEIBAN_ID TEXT NOT NULL,
    MEDIUM_SEIBAN_NAME TEXT NOT NULL,
    MEDIUM_SEIBAN_DESCRIPTION TEXT,
    MEDIUM_SEIBAN_CATEGORY TEXT,
    MEDIUM_SEIBAN_TYPE TEXT,
    MEDIUM_SEIBAN_STATUS TEXT DEFAULT 'active',
    ORDER_NUM INTEGER DEFAULT 0,
    CREATED_AT TEXT DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TEXT DEFAULT CURRENT_TIMESTAMP,
    CREATED_BY TEXT,
    UPDATED_BY TEXT,
    MEDIUM_SEIBAN_NOTE TEXT,
    SPARE1 TEXT,
    SPARE2 TEXT,
    SPARE3 TEXT,
    FOREIGN KEY (LARGE_SEIBAN_ID) REFERENCES LARGE_SEIBAN_SYSTEM(LARGE_SEIBAN_ID)
);
```

#### カラム詳細

| カラム名 | データ型 | NULL | デフォルト値 | 説明 |
|---------|---------|------|-------------|------|
| ROWID | INTEGER | NO | AUTO_INCREMENT | 主キー（自動採番） |
| MEDIUM_SEIBAN_ID | TEXT | NO | - | 中製番識別子（一意） |
| LARGE_SEIBAN_ID | TEXT | NO | - | 親大製番ID（外部キー） |
| MEDIUM_SEIBAN_NAME | TEXT | NO | - | 中製番名 |
| MEDIUM_SEIBAN_DESCRIPTION | TEXT | YES | - | 中製番説明 |
| MEDIUM_SEIBAN_CATEGORY | TEXT | YES | - | 中製番カテゴリ |
| MEDIUM_SEIBAN_TYPE | TEXT | YES | - | 中製番タイプ |
| MEDIUM_SEIBAN_STATUS | TEXT | YES | 'active' | 中製番状態 |
| ORDER_NUM | INTEGER | YES | 0 | 表示順序 |
| CREATED_AT | TEXT | YES | CURRENT_TIMESTAMP | 作成日時 |
| UPDATED_AT | TEXT | YES | CURRENT_TIMESTAMP | 更新日時 |
| CREATED_BY | TEXT | YES | - | 作成者 |
| UPDATED_BY | TEXT | YES | - | 更新者 |
| MEDIUM_SEIBAN_NOTE | TEXT | YES | - | 備考 |
| SPARE1 | TEXT | YES | - | 予備フィールド1 |
| SPARE2 | TEXT | YES | - | 予備フィールド2 |
| SPARE3 | TEXT | YES | - | 予備フィールド3 |

#### サンプルデータ
```
ROWID: 1
MEDIUM_SEIBAN_ID: SEIBAN-1100
LARGE_SEIBAN_ID: SEIBAN-1000
MEDIUM_SEIBAN_NAME: 製銑・精錬第１課 - 1100
MEDIUM_SEIBAN_DESCRIPTION: 製銑・精錬に関する技術開発、設備管理、品質管理を担当します
MEDIUM_SEIBAN_CATEGORY: seisen-1
MEDIUM_SEIBAN_TYPE: technical
MEDIUM_SEIBAN_STATUS: active
ORDER_NUM: 1
CREATED_AT: 2025-01-01T00:00:00Z
UPDATED_AT: 2025-01-01T00:00:00Z
CREATED_BY: admin
UPDATED_BY: admin
MEDIUM_SEIBAN_NOTE: 製銑・精錬第１課の技術分野
```

### 3. TECH_DOCUMENTS テーブル

#### テーブル構造
```sql
CREATE TABLE IF NOT EXISTS "TECH_DOCUMENTS" (
    ROWID INTEGER PRIMARY KEY,
    DOCUMENT_ID TEXT UNIQUE NOT NULL,
    MEDIUM_SEIBAN_ID TEXT NOT NULL,
    DOCUMENT_TITLE TEXT NOT NULL,
    DOCUMENT_CONTENT TEXT,
    DOCUMENT_SUMMARY TEXT,
    DOCUMENT_TYPE TEXT DEFAULT 'technical_review',
    DOCUMENT_STATUS TEXT DEFAULT 'draft',
    DOCUMENT_CATEGORY TEXT,
    DOCUMENT_PRIORITY TEXT DEFAULT 'medium',
    AUTHOR_ID TEXT,
    REVIEWER_ID TEXT,
    APPROVED_BY TEXT,
    CREATED_AT TEXT DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TEXT DEFAULT CURRENT_TIMESTAMP,
    REVIEWED_AT TEXT,
    APPROVED_AT TEXT,
    PUBLISHED_AT TEXT,
    DOCUMENT_FILE_PATH TEXT,
    DOCUMENT_FILE_SIZE INTEGER,
    DOCUMENT_FILE_TYPE TEXT,
    DOCUMENT_NOTE TEXT,
    SPARE1 TEXT,
    SPARE2 TEXT,
    SPARE3 TEXT,
    FOREIGN KEY (MEDIUM_SEIBAN_ID) REFERENCES MEDIUM_SEIBAN_SYSTEM(MEDIUM_SEIBAN_ID)
);
```

#### カラム詳細

| カラム名 | データ型 | NULL | デフォルト値 | 説明 |
|---------|---------|------|-------------|------|
| ROWID | INTEGER | NO | AUTO_INCREMENT | 主キー（自動採番） |
| DOCUMENT_ID | TEXT | NO | - | 検討書識別子（一意） |
| MEDIUM_SEIBAN_ID | TEXT | NO | - | 親中製番ID（外部キー） |
| DOCUMENT_TITLE | TEXT | NO | - | 検討書タイトル |
| DOCUMENT_CONTENT | TEXT | YES | - | 検討書内容 |
| DOCUMENT_SUMMARY | TEXT | YES | - | 検討書概要 |
| DOCUMENT_TYPE | TEXT | YES | 'technical_review' | 検討書タイプ |
| DOCUMENT_STATUS | TEXT | YES | 'draft' | 検討書状態 |
| DOCUMENT_CATEGORY | TEXT | YES | - | 検討書カテゴリ |
| DOCUMENT_PRIORITY | TEXT | YES | 'medium' | 優先度 |
| AUTHOR_ID | TEXT | YES | - | 作成者ID |
| REVIEWER_ID | TEXT | YES | - | レビュアーID |
| APPROVED_BY | TEXT | YES | - | 承認者ID |
| CREATED_AT | TEXT | YES | CURRENT_TIMESTAMP | 作成日時 |
| UPDATED_AT | TEXT | YES | CURRENT_TIMESTAMP | 更新日時 |
| REVIEWED_AT | TEXT | YES | - | レビュー日時 |
| APPROVED_AT | TEXT | YES | - | 承認日時 |
| PUBLISHED_AT | TEXT | YES | - | 公開日時 |
| DOCUMENT_FILE_PATH | TEXT | YES | - | ファイルパス |
| DOCUMENT_FILE_SIZE | INTEGER | YES | - | ファイルサイズ |
| DOCUMENT_FILE_TYPE | TEXT | YES | - | ファイルタイプ |
| DOCUMENT_NOTE | TEXT | YES | - | 備考 |
| SPARE1 | TEXT | YES | - | 予備フィールド1 |
| SPARE2 | TEXT | YES | - | 予備フィールド2 |
| SPARE3 | TEXT | YES | - | 予備フィールド3 |

#### サンプルデータ
```
ROWID: 1
DOCUMENT_ID: DOC-2025-001
MEDIUM_SEIBAN_ID: SEIBAN-1100
DOCUMENT_TITLE: 高炉水素吹き込み技術検討書
DOCUMENT_CONTENT: 高炉への水素吹き込み技術に関する詳細な検討内容...
DOCUMENT_SUMMARY: 高炉水素吹き込み技術の実現可能性と効果について検討
DOCUMENT_TYPE: technical_review
DOCUMENT_STATUS: draft
DOCUMENT_CATEGORY: technology
DOCUMENT_PRIORITY: high
AUTHOR_ID: user001
REVIEWER_ID: user002
APPROVED_BY: user003
CREATED_AT: 2025-01-01T00:00:00Z
UPDATED_AT: 2025-01-01T00:00:00Z
REVIEWED_AT: 2025-01-02T00:00:00Z
APPROVED_AT: 2025-01-03T00:00:00Z
PUBLISHED_AT: 2025-01-04T00:00:00Z
DOCUMENT_FILE_PATH: /documents/DOC-2025-001.pdf
DOCUMENT_FILE_SIZE: 2048576
DOCUMENT_FILE_TYPE: application/pdf
DOCUMENT_NOTE: 重要な技術検討書
```

## 🔗 リレーションシップ

### 外部キー制約
```sql
-- MEDIUM_SEIBAN_SYSTEM テーブルの外部キー
ALTER TABLE MEDIUM_SEIBAN_SYSTEM 
ADD CONSTRAINT fk_medium_large_seiban 
FOREIGN KEY (LARGE_SEIBAN_ID) 
REFERENCES LARGE_SEIBAN_SYSTEM(LARGE_SEIBAN_ID);

-- TECH_DOCUMENTS テーブルの外部キー
ALTER TABLE TECH_DOCUMENTS 
ADD CONSTRAINT fk_tech_documents_medium_seiban 
FOREIGN KEY (MEDIUM_SEIBAN_ID) 
REFERENCES MEDIUM_SEIBAN_SYSTEM(MEDIUM_SEIBAN_ID);
```

### リレーションシップ図
```
LARGE_SEIBAN_SYSTEM (1) ←→ (N) MEDIUM_SEIBAN_SYSTEM (1) ←→ (N) TECH_DOCUMENTS
```

## 📊 インデックス設計

### パフォーマンス最適化用インデックス
```sql
-- 大製番体系
CREATE INDEX idx_large_seiban_category ON LARGE_SEIBAN_SYSTEM(LARGE_SEIBAN_CATEGORY);
CREATE INDEX idx_large_seiban_status ON LARGE_SEIBAN_SYSTEM(LARGE_SEIBAN_STATUS);
CREATE INDEX idx_large_seiban_order ON LARGE_SEIBAN_SYSTEM(ORDER_NUM);
CREATE INDEX idx_large_seiban_created_at ON LARGE_SEIBAN_SYSTEM(CREATED_AT);

-- 中製番体系
CREATE INDEX idx_medium_seiban_large_id ON MEDIUM_SEIBAN_SYSTEM(LARGE_SEIBAN_ID);
CREATE INDEX idx_medium_seiban_category ON MEDIUM_SEIBAN_SYSTEM(MEDIUM_SEIBAN_CATEGORY);
CREATE INDEX idx_medium_seiban_status ON MEDIUM_SEIBAN_SYSTEM(MEDIUM_SEIBAN_STATUS);
CREATE INDEX idx_medium_seiban_order ON MEDIUM_SEIBAN_SYSTEM(ORDER_NUM);
CREATE INDEX idx_medium_seiban_created_at ON MEDIUM_SEIBAN_SYSTEM(CREATED_AT);

-- 検討書
CREATE INDEX idx_tech_documents_medium_id ON TECH_DOCUMENTS(MEDIUM_SEIBAN_ID);
CREATE INDEX idx_tech_documents_type ON TECH_DOCUMENTS(DOCUMENT_TYPE);
CREATE INDEX idx_tech_documents_status ON TECH_DOCUMENTS(DOCUMENT_STATUS);
CREATE INDEX idx_tech_documents_author ON TECH_DOCUMENTS(AUTHOR_ID);
CREATE INDEX idx_tech_documents_created_at ON TECH_DOCUMENTS(CREATED_AT);
CREATE INDEX idx_tech_documents_priority ON TECH_DOCUMENTS(DOCUMENT_PRIORITY);
CREATE INDEX idx_tech_documents_category ON TECH_DOCUMENTS(DOCUMENT_CATEGORY);
```

## 🔍 検索・フィルタリング最適化

### 複合インデックス
```sql
-- 検討書の複合検索用インデックス
CREATE INDEX idx_tech_documents_composite_1 ON TECH_DOCUMENTS(MEDIUM_SEIBAN_ID, DOCUMENT_STATUS, DOCUMENT_TYPE);
CREATE INDEX idx_tech_documents_composite_2 ON TECH_DOCUMENTS(DOCUMENT_STATUS, DOCUMENT_PRIORITY, CREATED_AT);
CREATE INDEX idx_tech_documents_composite_3 ON TECH_DOCUMENTS(AUTHOR_ID, DOCUMENT_STATUS, CREATED_AT);

-- 中製番体系の複合検索用インデックス
CREATE INDEX idx_medium_seiban_composite_1 ON MEDIUM_SEIBAN_SYSTEM(LARGE_SEIBAN_ID, MEDIUM_SEIBAN_STATUS, ORDER_NUM);
CREATE INDEX idx_medium_seiban_composite_2 ON MEDIUM_SEIBAN_SYSTEM(MEDIUM_SEIBAN_CATEGORY, MEDIUM_SEIBAN_STATUS, ORDER_NUM);

-- 大製番体系の複合検索用インデックス
CREATE INDEX idx_large_seiban_composite_1 ON LARGE_SEIBAN_SYSTEM(LARGE_SEIBAN_CATEGORY, LARGE_SEIBAN_STATUS, ORDER_NUM);
```

## 📈 データ整合性

### チェック制約
```sql
-- 大製番体系の状態チェック
ALTER TABLE LARGE_SEIBAN_SYSTEM 
ADD CONSTRAINT chk_large_seiban_status 
CHECK (LARGE_SEIBAN_STATUS IN ('active', 'inactive', 'archived', 'deprecated'));

-- 中製番体系の状態チェック
ALTER TABLE MEDIUM_SEIBAN_SYSTEM 
ADD CONSTRAINT chk_medium_seiban_status 
CHECK (MEDIUM_SEIBAN_STATUS IN ('active', 'inactive', 'archived', 'deprecated'));

-- 検討書の状態チェック
ALTER TABLE TECH_DOCUMENTS 
ADD CONSTRAINT chk_document_status 
CHECK (DOCUMENT_STATUS IN ('draft', 'under_review', 'approved', 'published', 'archived', 'rejected'));

-- 検討書のタイプチェック
ALTER TABLE TECH_DOCUMENTS 
ADD CONSTRAINT chk_document_type 
CHECK (DOCUMENT_TYPE IN ('technical_review', 'design_review', 'feasibility_study', 'specification', 'manual', 'report', 'other'));

-- 検討書の優先度チェック
ALTER TABLE TECH_DOCUMENTS 
ADD CONSTRAINT chk_document_priority 
CHECK (DOCUMENT_PRIORITY IN ('low', 'medium', 'high', 'urgent'));

-- 表示順序の非負チェック
ALTER TABLE LARGE_SEIBAN_SYSTEM 
ADD CONSTRAINT chk_large_seiban_order 
CHECK (ORDER_NUM >= 0);

ALTER TABLE MEDIUM_SEIBAN_SYSTEM 
ADD CONSTRAINT chk_medium_seiban_order 
CHECK (ORDER_NUM >= 0);

-- ファイルサイズの非負チェック
ALTER TABLE TECH_DOCUMENTS 
ADD CONSTRAINT chk_document_file_size 
CHECK (DOCUMENT_FILE_SIZE >= 0);
```

## 🔄 データ移行・バックアップ

### 初期データ投入
```sql
-- 大製番体系の初期データ
INSERT INTO LARGE_SEIBAN_SYSTEM (
    LARGE_SEIBAN_ID, 
    LARGE_SEIBAN_NAME, 
    LARGE_SEIBAN_DESCRIPTION, 
    LARGE_SEIBAN_CATEGORY, 
    LARGE_SEIBAN_TYPE, 
    LARGE_SEIBAN_STATUS, 
    ORDER_NUM, 
    CREATED_BY, 
    UPDATED_BY
) VALUES 
('SEIBAN-1000', '製銑・精錬技術体系', '製銑・精錬に関する技術開発、設備管理、品質管理を担当する技術体系', 'seisen', 'technical', 'active', 1, 'admin', 'admin'),
('SEIBAN-2000', '連鋳・圧延技術体系', '連鋳・圧延プラントの設計、製造、施工管理を担当する技術体系', 'renchu', 'technical', 'active', 2, 'admin', 'admin'),
('SEIBAN-3000', '設備管理技術体系', '設備の保守、安全管理、環境対策を担当する技術体系', 'equipment', 'management', 'active', 3, 'admin', 'admin');

-- 中製番体系の初期データ
INSERT INTO MEDIUM_SEIBAN_SYSTEM (
    MEDIUM_SEIBAN_ID, 
    LARGE_SEIBAN_ID, 
    MEDIUM_SEIBAN_NAME, 
    MEDIUM_SEIBAN_DESCRIPTION, 
    MEDIUM_SEIBAN_CATEGORY, 
    MEDIUM_SEIBAN_TYPE, 
    MEDIUM_SEIBAN_STATUS, 
    ORDER_NUM, 
    CREATED_BY, 
    UPDATED_BY
) VALUES 
('SEIBAN-1100', 'SEIBAN-1000', '製銑・精錬第１課 - 1100', '製銑・精錬に関する技術開発、設備管理、品質管理を担当します', 'seisen-1', 'technical', 'active', 1, 'admin', 'admin'),
('SEIBAN-1200', 'SEIBAN-1000', '製銑・精錬第２課 - 1200', '製銑・精錬の生産技術向上、新技術導入、効率化を担当します', 'seisen-2', 'technical', 'active', 2, 'admin', 'admin'),
('SEIBAN-2100', 'SEIBAN-2000', '連鋳・圧延プラント設計第１課 - 2100', '連鋳・圧延プラントの基本設計、技術仕様策定を担当します', 'renchu-1', 'design', 'active', 1, 'admin', 'admin');
```

### バックアップ戦略
```sql
-- 日次バックアップ
-- 全テーブルのデータをエクスポート
.mode insert
.output backup_$(date +%Y%m%d).sql
.dump LARGE_SEIBAN_SYSTEM MEDIUM_SEIBAN_SYSTEM TECH_DOCUMENTS

-- 差分バックアップ（変更されたレコードのみ）
-- 更新日時が前回バックアップ以降のレコードを抽出
SELECT * FROM LARGE_SEIBAN_SYSTEM WHERE UPDATED_AT > '2025-01-01T00:00:00Z';
SELECT * FROM MEDIUM_SEIBAN_SYSTEM WHERE UPDATED_AT > '2025-01-01T00:00:00Z';
SELECT * FROM TECH_DOCUMENTS WHERE UPDATED_AT > '2025-01-01T00:00:00Z';
```

## 📊 パフォーマンス監視

### クエリパフォーマンス監視
```sql
-- テーブルサイズ確認
SELECT 
    name as table_name,
    sqlite_compileoption_used('ENABLE_STAT4') as stat4_enabled,
    sqlite_compileoption_used('ENABLE_STAT3') as stat3_enabled
FROM sqlite_master 
WHERE type='table' AND name IN ('LARGE_SEIBAN_SYSTEM', 'MEDIUM_SEIBAN_SYSTEM', 'TECH_DOCUMENTS');

-- インデックス使用状況確認
SELECT 
    name as index_name,
    tbl_name as table_name,
    sql as index_sql
FROM sqlite_master 
WHERE type='index' AND tbl_name IN ('LARGE_SEIBAN_SYSTEM', 'MEDIUM_SEIBAN_SYSTEM', 'TECH_DOCUMENTS');

-- テーブル統計情報
ANALYZE LARGE_SEIBAN_SYSTEM;
ANALYZE MEDIUM_SEIBAN_SYSTEM;
ANALYZE TECH_DOCUMENTS;
```

## 🔧 メンテナンス

### 定期的なメンテナンス
```sql
-- データベース最適化
VACUUM;

-- インデックス再構築
REINDEX;

-- 統計情報更新
ANALYZE;

-- 不要なデータの削除（アーカイブ済みの古いデータ）
DELETE FROM TECH_DOCUMENTS 
WHERE DOCUMENT_STATUS = 'archived' 
AND UPDATED_AT < datetime('now', '-5 years');
```
