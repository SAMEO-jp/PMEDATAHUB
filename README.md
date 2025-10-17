# PMEDATAHUB

## プロジェクト写真管理ページ仕様書（簡易版）

### 概要
プロジェクトに関連する写真を管理するページの仕様書です。現在のパレット管理システムに統合された写真管理機能の設計と実装方針を定義します。

### 1. 機能要件

#### 1.1 基本機能
- **写真表示**: プロジェクト関連の写真を一覧表示
- **写真アップロード**: 新しい写真のアップロード機能
- **写真詳細表示**: 個別写真の詳細情報表示
- **写真検索・フィルタ**: 日付、カテゴリ、タグによる検索機能
- **写真編集**: 写真のメタデータ（タイトル、説明、タグ）の編集

#### 1.2 写真カテゴリ
- **パレット写真**: パレットの現況、搬入・搬出時の写真
- **工事写真**: 工事現場、作業状況の写真
- **品質管理写真**: 品質チェック、検査時の写真
- **安全管理写真**: 安全確認、危険箇所の写真
- **その他**: その他の関連写真

### 2. 技術仕様

#### 2.1 フロントエンド
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **UIライブラリ**: Tailwind CSS
- **状態管理**: Zustand
- **API通信**: tRPC

#### 2.2 バックエンド
- **データベース**: SQLite (achievements.db)
- **API**: tRPC
- **ファイル保存**: public/demopic/ ディレクトリ

#### 2.3 データ構造
```typescript

```

### 3. ページ構成

#### 3.1 メインページ (`/app_project/[project_id]/photos`)
- プロジェクト全体の写真一覧
- カテゴリ別フィルタ
- 検索機能
- 写真アップロード機能

#### 3.2 写真詳細ページ (`/app_project/[project_id]/photos/[photo_id]`)
- 個別写真の詳細表示
- 写真情報の編集
- 関連写真の表示

#### 3.3 パレット関連写真ページ (`/app_project/[project_id]/mbom/palet-list/[palet_list_id]`)
- パレット固有の写真表示
- パレット状況の写真記録

### 4. UI/UX設計

#### 4.1 写真表示
- **グリッドレイアウト**: レスポンシブな写真グリッド
- **サムネイル表示**: 写真のサムネイル表示
- **ホバー効果**: 写真にホバー時の詳細表示
- **モーダル表示**: 写真クリック時の拡大表示

#### 4.2 アップロード機能
- **ドラッグ&ドロップ**: ファイルのドラッグ&ドロップ対応
- **複数ファイル**: 複数写真の同時アップロード
- **プレビュー**: アップロード前のプレビュー表示
- **プログレスバー**: アップロード進捗の表示

#### 4.3 検索・フィルタ
- **カテゴリフィルタ**: カテゴリ別の絞り込み
- **日付フィルタ**: 撮影日による絞り込み
- **タグ検索**: タグによる検索機能
- **キーワード検索**: タイトル・説明文での検索

### 5. データベース設計

#### 5.1 写真テーブル
```sql
CREATE TABLE photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  photo_id TEXT UNIQUE NOT NULL,
  project_id TEXT NOT NULL,
  palet_list_id TEXT,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  photographer TEXT,
  notes TEXT,
  category TEXT NOT NULL,
  tags TEXT,
  location TEXT,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 5.2 インデックス
```sql
CREATE INDEX idx_photos_project_id ON photos(project_id);
CREATE INDEX idx_photos_category ON photos(category);
CREATE INDEX idx_photos_created_at ON photos(created_at);
CREATE INDEX idx_photos_palet_list_id ON photos(palet_list_id);
```

### 6. API設計

#### 6.1 写真取得API
```typescript
// プロジェクトの写真一覧取得
trpc.photos.getByProjectId.useQuery({ projectId, category?, dateFrom?, dateTo? })

// 個別写真取得
trpc.photos.getById.useQuery({ photoId })

// パレット関連写真取得
trpc.photos.getByPaletListId.useQuery({ paletListId })
```

#### 6.2 写真アップロードAPI
```typescript
// 写真アップロード
trpc.photos.upload.useMutation({
  projectId: string,
  file: File,
  metadata: PhotoMetadata
})

// 写真更新
trpc.photos.update.useMutation({
  photoId: string,
  metadata: PhotoMetadata
})

// 写真削除
trpc.photos.delete.useMutation({ photoId: string })
```

### 7. セキュリティ考慮事項

#### 7.1 ファイルアップロード
- **ファイルサイズ制限**: 最大10MB
- **ファイル形式制限**: JPG, PNG, GIFのみ許可
- **ウイルススキャン**: アップロード時のウイルスチェック
- **ファイル名サニタイズ**: 危険な文字の除去

#### 7.2 アクセス制御
- **プロジェクト権限**: プロジェクトメンバーのみアクセス可能
- **写真権限**: 写真の所有者のみ編集・削除可能
- **ログ記録**: 写真の閲覧・編集ログの記録

### 8. パフォーマンス最適化

#### 8.1 画像最適化
- **サムネイル生成**: 自動的なサムネイル生成
- **画像圧縮**: アップロード時の画像圧縮
- **遅延読み込み**: スクロール時の遅延読み込み
- **CDN利用**: 画像配信のCDN利用

#### 8.2 データベース最適化
- **インデックス**: 適切なインデックスの設定
- **ページネーション**: 大量データのページネーション
- **キャッシュ**: 頻繁にアクセスされるデータのキャッシュ

### 9. 実装優先度

#### 9.1 Phase 1 (基本機能)
- [x] 写真表示機能
- [x] 写真アップロード機能
- [x] 基本的な写真管理

#### 9.2 Phase 2 (検索・フィルタ)
- [ ] カテゴリフィルタ
- [ ] 日付フィルタ
- [ ] キーワード検索

#### 9.3 Phase 3 (高度な機能)
- [ ] タグ機能
- [ ] 写真編集機能
- [ ] バッチ処理機能

### 10. テスト計画

#### 10.1 単体テスト
- 写真アップロード機能のテスト
- 写真表示機能のテスト
- 検索・フィルタ機能のテスト

#### 10.2 統合テスト
- API通信のテスト
- データベース操作のテスト
- ファイル操作のテスト

#### 10.3 E2Eテスト
- 写真管理フローのテスト
- ユーザー操作のテスト

### 11. 今後の拡張予定

#### 11.1 機能拡張
- **AI画像認識**: 写真の自動タグ付け
- **写真比較**: 前後の写真比較機能
- **写真レポート**: 写真を使ったレポート生成

#### 11.2 技術拡張
- **クラウドストレージ**: AWS S3等への移行
- **画像処理**: 高度な画像処理機能
- **モバイル対応**: モバイルアプリ対応

---

**作成日**: 2025年1月
**バージョン**: 1.0
**作成者**: AI Assistant
