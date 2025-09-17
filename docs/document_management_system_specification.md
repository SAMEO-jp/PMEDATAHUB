# ドキュメント管理システム仕様書

## 概要
このドキュメント管理システムは、ファイルのアップロード、タグ付け、検索・フィルタリング機能を提供するWebアプリケーションです。Next.js、tRPC、SQLiteを使用して構築されます。

## 1. データベース設計

### 1.1 既存テーブル拡張
```sql
-- 既存のdocument_demoテーブルを拡張
CREATE TABLE document_demo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  rootdocument_id INTEGER,
  type TEXT,
  bumon TEXT,
  name_project TEXT,
  meca_number TEXT,
  create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  delete_date DATETIME
);
```

### 1.2 新規追加テーブル

#### ファイルメタデータテーブル
```sql
CREATE TABLE document_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES document_demo(id)
);
```

#### タグテーブル
```sql
CREATE TABLE document_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3B82F6',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### ドキュメント-タグ関連テーブル
```sql
CREATE TABLE document_tag_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES document_demo(id),
  FOREIGN KEY (tag_id) REFERENCES document_tags(id),
  UNIQUE(document_id, tag_id)
);
```

## 2. API設計

### 2.1 ファイルアップロードAPI
- **エンドポイント**: `/api/documents/upload`
- **メソッド**: POST
- **機能**: 
  - ファイルアップロード
  - メタデータ保存
  - タグ関連付け
- **リクエスト形式**: FormData
- **レスポンス**: JSON

### 2.2 ドキュメント管理API
- **エンドポイント**: `/api/documents`
- **メソッド**: GET, POST, PUT, DELETE
- **機能**: CRUD操作
- **tRPCルーター**: `documentRouter`

### 2.3 タグ管理API
- **エンドポイント**: `/api/documents/tags`
- **メソッド**: GET, POST, PUT, DELETE
- **機能**: タグの管理
- **tRPCルーター**: `tagRouter`

## 3. フロントエンド機能

### 3.1 ドキュメント一覧ページ
- **パス**: `/documents`
- **機能**:
  - ドキュメントの一覧表示
  - 検索・フィルタリング機能
  - タグによる絞り込み
  - ソート機能（名前、作成日、サイズ）
  - ページネーション

### 3.2 ドキュメント詳細ページ
- **パス**: `/documents/[id]`
- **機能**:
  - ファイルプレビュー
  - タグ編集
  - メタデータ編集
  - ダウンロード機能
  - 削除機能

### 3.3 アップロードページ
- **パス**: `/documents/upload`
- **機能**:
  - ドラッグ&ドロップアップロード
  - タグ選択・作成
  - メタデータ入力
  - 複数ファイル一括アップロード

## 4. 実装計画

### Phase 1: データベースとAPI基盤
1. データベーステーブル作成
2. tRPCルーター作成
3. ファイルアップロードAPI実装
4. 基本的なCRUD API実装

### Phase 2: フロントエンド基盤
1. ドキュメント一覧ページ
2. アップロード機能
3. 基本的なCRUD操作
4. レスポンシブデザイン

### Phase 3: タグ機能
1. タグ管理API
2. タグUI実装
3. タグ検索・フィルタリング
4. タグカラー管理

### Phase 4: 高度な機能
1. ファイルプレビュー
2. 検索・ソート機能
3. バッチ操作
4. エクスポート機能

## 5. 技術的考慮事項

### 5.1 ファイルストレージ
- **ストレージ方式**: ローカルファイルシステム
- **パス構造**: `public/documents/[project_id]/[files]`
- **ファイル名**: タイムスタンプ付与でユニーク化
- **例**: `1753272434092_document.pdf`

### 5.2 セキュリティ
- **ファイルタイプ制限**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG
- **ファイルサイズ制限**: 最大50MB
- **パスサニタイゼーション**: ファイル名の特殊文字除去
- **アクセス制御**: プロジェクトベースの権限管理

### 5.3 パフォーマンス
- **ページネーション**: 20件ずつ表示
- **画像サムネイル**: 自動生成
- **遅延読み込み**: 大きなファイルリスト
- **キャッシュ**: タグ情報のキャッシュ

### 5.4 UI/UX
- **デザイン**: モダンで直感的なインターフェース
- **レスポンシブ**: モバイル対応
- **アクセシビリティ**: キーボードナビゲーション対応
- **フィードバック**: ローディング状態とエラーハンドリング

## 6. データ型定義

### 6.1 TypeScript型定義
```typescript
// ドキュメント型
interface Document {
  id: number;
  name: string;
  rootdocument_id?: number;
  type?: string;
  bumon?: string;
  name_project?: string;
  meca_number?: string;
  create_date: string;
  delete_date?: string;
  files?: DocumentFile[];
  tags?: DocumentTag[];
}

// ファイル型
interface DocumentFile {
  id: number;
  document_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  upload_date: string;
}

// タグ型
interface DocumentTag {
  id: number;
  name: string;
  color: string;
  created_at: string;
}
```

## 7. エラーハンドリング

### 7.1 APIエラー
- **400**: バリデーションエラー
- **404**: リソースが見つからない
- **413**: ファイルサイズ超過
- **415**: サポートされていないファイルタイプ
- **500**: サーバーエラー

### 7.2 フロントエンドエラー
- **ネットワークエラー**: 再接続機能
- **アップロードエラー**: 再試行機能
- **バリデーションエラー**: リアルタイム表示

## 8. テスト戦略

### 8.1 単体テスト
- APIエンドポイントのテスト
- データベース操作のテスト
- ユーティリティ関数のテスト

### 8.2 統合テスト
- ファイルアップロードフロー
- タグ管理フロー
- 検索・フィルタリング機能

### 8.3 E2Eテスト
- ユーザー操作フロー
- エラーケースのテスト

## 9. デプロイメント

### 9.1 環境設定
- **開発環境**: ローカルSQLite
- **本番環境**: SQLite（必要に応じてPostgreSQLに移行可能）

### 9.2 ファイルストレージ
- **開発**: ローカルファイルシステム
- **本番**: クラウドストレージ（AWS S3等）への移行準備

## 10. 今後の拡張予定

### 10.1 機能拡張
- バージョン管理機能
- コメント機能
- 承認ワークフロー
- 通知機能

### 10.2 技術拡張
- 全文検索機能
- リアルタイム同期
- オフライン対応
- モバイルアプリ

---

**作成日**: 2025年1月
**バージョン**: 1.0
**作成者**: AI Assistant 