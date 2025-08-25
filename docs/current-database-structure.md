# 現在のデータベース構造ドキュメント

## 📊 データベース概要

**データベース名**: `achievements.db`  
**データベースタイプ**: SQLite  
**作成日**: 2025年1月現在

## 🗂️ テーブル一覧

現在のデータベースには以下のテーブルが存在します：

```
BOM_BUHIN              PALET_SCHEDULE         document_demo        
BOM_BUZAI              PALET_STATUS_HISTORY   events
BOM_PART               PALET_TEMP_LOCATIONS   photo_albums
BOM_ZUMEN              PROJECT                photo_categories     
KONPO_PALET            USER                   photo_tags
PALET_LIST             album_photos_link      photo_tags_link      
PALET_MASTER           business_achievements  photos
PALET_MASTER_OLD       business_categories    user_settings        
```

## 📋 プロジェクト管理関連テーブル詳細

### 1. PROJECT テーブル

#### テーブル構造
```sql
CREATE TABLE IF NOT EXISTS "PROJECT" (
    ROWID INTEGER PRIMARY KEY,
    PROJECT_ID TEXT,
    PROJECT_NAME TEXT,
    PROJECT_DESCRIPTION TEXT,
    PROJECT_START_DATE TEXT,
    PROJECT_START_ENDDATE TEXT,
    PROJECT_STATUS TEXT,
    PROJECT_CLIENT_NAME TEXT,
    PROJECT_CLASSIFICATION TEXT,
    PROJECT_BUDGENT_GRADE TEXT,
    installationDate TEXT,
    drawingCompletionDate TEXT,
    PROJECT_EQUIPMENT_CATEGORY TEXT,
    PROJECT_SYOHIN_CATEGORY TEXT,
    CREATED_AT TEXT,
    UPDATE_AT TEXT,
    PROJECT_NOTE TEXT,
    SPARE1 TEXT,
    SPARE2 TEXT,
    SPARE3 TEXT,
    IS_PROJECT TEXT
);
```

#### カラム詳細

| カラム名 | データ型 | NULL | 説明 |
|---------|---------|------|------|
| ROWID | INTEGER | NO | 主キー（自動採番） |
| PROJECT_ID | TEXT | YES | プロジェクト識別子 |
| PROJECT_NAME | TEXT | YES | プロジェクト名 |
| PROJECT_DESCRIPTION | TEXT | YES | プロジェクト説明 |
| PROJECT_START_DATE | TEXT | YES | プロジェクト開始日 |
| PROJECT_START_ENDDATE | TEXT | YES | プロジェクト終了予定日 |
| PROJECT_STATUS | TEXT | YES | プロジェクト状態 |
| PROJECT_CLIENT_NAME | TEXT | YES | クライアント名 |
| PROJECT_CLASSIFICATION | TEXT | YES | プロジェクト分類 |
| PROJECT_BUDGENT_GRADE | TEXT | YES | 予算グレード |
| installationDate | TEXT | YES | 設置日 |
| drawingCompletionDate | TEXT | YES | 図面完成日 |
| PROJECT_EQUIPMENT_CATEGORY | TEXT | YES | 設備カテゴリ |
| PROJECT_SYOHIN_CATEGORY | TEXT | YES | 商品カテゴリ |
| CREATED_AT | TEXT | YES | 作成日時 |
| UPDATE_AT | TEXT | YES | 更新日時 |
| PROJECT_NOTE | TEXT | YES | 備考 |
| SPARE1 | TEXT | YES | 予備フィールド1 |
| SPARE2 | TEXT | YES | 予備フィールド2 |
| SPARE3 | TEXT | YES | 予備フィールド3 |
| IS_PROJECT | TEXT | YES | プロジェクトフラグ |

#### サンプルデータ
```
ROWID: 1
PROJECT_ID: E923BXX215000
PROJECT_NAME: 君津２高炉BP水素吹き込み対応
PROJECT_DESCRIPTION: 君津２高炉BP水素吹き込み対応
PROJECT_START_DATE: 2025-03-03
PROJECT_START_ENDDATE: 2025/6/30
PROJECT_STATUS: 進行中
```

### 2. USER テーブル

#### テーブル構造
```sql
CREATE TABLE IF NOT EXISTS "USER" (
    user_id TEXT,
    name_japanese TEXT,
    TEL TEXT,
    mail TEXT,
    name_english TEXT,
    name_yomi TEXT,
    company TEXT,
    bumon TEXT,
    in_year TEXT,
    Kengen TEXT,
    TEL_naisen TEXT,
    sitsu TEXT,
    ka TEXT
);
```

#### カラム詳細

| カラム名 | データ型 | NULL | 説明 |
|---------|---------|------|------|
| user_id | TEXT | YES | ユーザーID |
| name_japanese | TEXT | YES | 日本語名 |
| TEL | TEXT | YES | 電話番号 |
| mail | TEXT | YES | メールアドレス |
| name_english | TEXT | YES | 英語名 |
| name_yomi | TEXT | YES | 読み仮名 |
| company | TEXT | YES | 会社名 |
| bumon | TEXT | YES | 部門 |
| in_year | TEXT | YES | 入社年 |
| Kengen | TEXT | YES | 権限 |
| TEL_naisen | TEXT | YES | 内線電話番号 |
| sitsu | TEXT | YES | 室 |
| ka | TEXT | YES | 課 |

## 🔍 型定義との差異分析

### PROJECT テーブル

#### 現在の型定義（src/types/db_project.ts）
```typescript
export interface Project {
  rowid: number;
  PROJECT_ID: string;
  PROJECT_NAME: string;
  PROJECT_DESCRIPTION: string;
  PROJECT_START_DATE: string;
  PROJECT_STATUS: string;
  PROJECT_CLIENT_NAME: string;
  PROJECT_START_ENDDATE: string;
  PROJECT_NOTE: string;
  CREATED_AT: string;
  UPDATE_AT: string;
  PROJECT_CLASSIFICATION: string;
  PROJECT_BUDGENT_GRADE: string;
  installationDate: string;
  drawingCompletionDate: string;
  PROJECT_EQUIPMENT_CATEGORY: string;
  PROJECT_SYOHIN_CATEGORY: string;
  SPARE1: string;
  SPARE2: string;
  SPARE3: string;
  IS_PROJECT: string;
}
```

#### 型定義の整合性
現在の型定義は実際のデータベース構造と一致しています。

### USER テーブル

#### 現在の型定義との差異
現在のUSERテーブルは、プロジェクト管理で想定しているユーザー構造とは大きく異なります：

**データベースの構造:**
- 社員情報中心（部門、入社年、権限など）
- 日本語名、英語名、読み仮名の3つの名前フィールド
- 電話番号、内線番号の分離

**想定していた構造:**
- シンプルなユーザー管理（username, email, full_name）
- プロジェクトメンバー管理用

## 🚨 必要な対応

### 1. 型定義の修正
PROJECT型定義を実際のデータベース構造に合わせて修正する必要があります。

### 2. データベース構造の確認
現在のPROJECTテーブル構造は、プロジェクト管理に必要な情報を十分に含んでいます。

### 3. プロジェクトメンバー管理テーブルの作成
現在のUSERテーブルは社員情報用のため、プロジェクトメンバー管理用の新しいテーブルが必要：

```sql
-- プロジェクトメンバー管理用テーブル
CREATE TABLE PROJECT_MEMBERS (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  assigned_at TEXT DEFAULT CURRENT_TIMESTAMP,
  assigned_by TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (project_id) REFERENCES PROJECT(PROJECT_ID),
  FOREIGN KEY (user_id) REFERENCES USER(user_id),
  UNIQUE(project_id, user_id)
);
```

### 4. プロジェクト履歴テーブルの作成
```sql
-- プロジェクト変更履歴テーブル
CREATE TABLE PROJECT_HISTORY (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  action TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by TEXT NOT NULL,
  changed_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES PROJECT(PROJECT_ID),
  FOREIGN KEY (changed_by) REFERENCES USER(user_id)
);
```

## 📝 推奨アクション

1. **型定義の確認**: 現在の型定義はデータベース構造と一致していることを確認
2. **新規テーブルの作成**: プロジェクトメンバー管理と履歴管理用のテーブルを作成
3. **実装の開始**: 既存のデータベース構造を活用してプロジェクト管理機能を実装

## 🔧 実装時の注意点

- 既存のデータとの整合性を保つ
- 型定義とデータベース構造の同期を維持
- 段階的な移行を実施
- バックアップを取得してから変更を実施
