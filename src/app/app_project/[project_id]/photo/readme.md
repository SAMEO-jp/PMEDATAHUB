
SQL

-- カテゴリ情報を格納するテーブル
CREATE TABLE tag_categories (
    category_id INTEGER PRIMARY KEY,
    category_name TEXT NOT NULL UNIQUE
);

-- タグ情報を格納するテーブル
-- tag_categoriesテーブルのcategory_idを外部キーとして参照します
CREATE TABLE tags (
    tag_id INTEGER PRIMARY KEY,
    fk_category_id INTEGER,
    tag_name TEXT NOT NULL UNIQUE,
    FOREIGN KEY (fk_category_id) REFERENCES tag_categories (category_id)
);

-- 写真のメタデータを格納するテーブル
CREATE TABLE photos (
    photo_id INTEGER PRIMARY KEY,
    fk_project_id INTEGER,
    photo_file_path TEXT NOT NULL UNIQUE,
    photo_shooting_date TEXT,
    photo_title TEXT,
    photo_location TEXT,
    photo_comment TEXT,
    fk_uploaded_by_user_id INTEGER,
    photo_uploaded_at TEXT
    /*
    -- 注意: 以下の外部キー制約は、参照先のテーブル (projects, users) が
    -- 存在する場合に有効にしてください。
    , FOREIGN KEY (fk_project_id) REFERENCES projects (project_id)
    , FOREIGN KEY (fk_uploaded_by_user_id) REFERENCES users (user_id)
    */
);

-- 写真とタグの関連付けを行う中間テーブル (多対多リレーション)
-- photosテーブルのphoto_idとtagsテーブルのtag_idを外部キーとして参照します
CREATE TABLE photo_tags_link (
    fk_photo_id INTEGER,
    fk_tag_id INTEGER,
    PRIMARY KEY (fk_photo_id, fk_tag_id),
    FOREIGN KEY (fk_photo_id) REFERENCES photos (photo_id) ON DELETE CASCADE,
    FOREIGN KEY (fk_tag_id) REFERENCES tags (tag_id) ON DELETE CASCADE
);

## コードの解説
作成順序: 他のテーブルから参照されるtag_categories、tags、photosを先に定義し、最後にそれらを結びつけるphoto_tags_linkを定義しています。

主キー (PK): PRIMARY KEYは、テーブル内の各行を一意に識別するための制約です。photo_tags_linkテーブルでは、写真とタグの組み合わせが重複しないように、fk_photo_idとfk_tag_idの2つの列を組み合わせた複合主キーを設定しています。

外部キー (FK): FOREIGN KEYは、テーブル間の関連性を定義する制約です。これにより、例えばtagsテーブルにはtag_categoriesに存在するカテゴリIDしか登録できなくなり、データの整合性を保ちます。

ユニーク制約 (UK): UNIQUEは、その列に重複した値が入ることを防ぎます。主キーと同様に一意性を保証しますが、1つのテーブルに複数設定できます。ここではNOT NULLも併せて指定し、空の値も許さないようにしています。

ON DELETE CASCADE: photo_tags_linkテーブルの外部キーに設定されているこのオプションは、参照元のデータ（写真やタグ）が削除された場合に、関連するリンク情報も自動的に削除するよう指定するものです。これにより、不要になった関連付けデータが残るのを防ぎます。

コメントアウトされた外部キー: photosテーブル内のfk_project_idとfk_uploaded_by_user_idに関するFOREIGN KEY制約は、参照先となるprojectsテーブルとusersテーブルの定義が指定されていないため、コメントアウトしています。これらのテーブルを別途作成した後、このコメントを外して制約を有効にしてください。


# PMEDATAHUB - プロジェクト写真管理システム仕様書

## 📋 概要
プロジェクトに関連する写真を管理するシステムの仕様書です。パレット管理システムに統合された写真管理機能の設計と実装方針を定義します。

**※ この仕様書は設計段階であり、実装は未開始です。**

## 🗄️ データベース設計

### 統一されたテーブル定義

```sql
-- カテゴリ情報を格納するテーブル
CREATE TABLE photo_categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT NOT NULL UNIQUE,
    category_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- タグ情報を格納するテーブル
CREATE TABLE photo_tags (
    tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
    fk_category_id INTEGER,
    tag_name TEXT NOT NULL UNIQUE,
    tag_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_category_id) REFERENCES photo_categories (category_id)
);

-- 写真のメタデータを格納するテーブル
CREATE TABLE photos (
    photo_id INTEGER PRIMARY KEY AUTOINCREMENT,
    fk_project_id TEXT NOT NULL,
    fk_palet_list_id TEXT,
    photo_file_path TEXT NOT NULL UNIQUE,
    photo_thumbnail_path TEXT,
    photo_title TEXT NOT NULL,
    photo_description TEXT,
    photo_location TEXT,
    photo_shooting_date TEXT,
    photo_category TEXT NOT NULL DEFAULT 'others',
    photo_tags TEXT, -- JSON形式でタグIDを保存
    photo_status TEXT DEFAULT 'active',
    fk_uploaded_by_user_id TEXT,
    photo_uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    photo_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 写真とタグの関連付けを行う中間テーブル
CREATE TABLE photo_tags_link (
    fk_photo_id INTEGER,
    fk_tag_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (fk_photo_id, fk_tag_id),
    FOREIGN KEY (fk_photo_id) REFERENCES photos (photo_id) ON DELETE CASCADE,
    FOREIGN KEY (fk_tag_id) REFERENCES photo_tags (tag_id) ON DELETE CASCADE
);

-- インデックス
CREATE INDEX idx_photos_project_id ON photos(fk_project_id);
CREATE INDEX idx_photos_category ON photos(photo_category);
CREATE INDEX idx_photos_created_at ON photos(photo_uploaded_at);
CREATE INDEX idx_photos_palet_list_id ON photos(fk_palet_list_id);
CREATE INDEX idx_photos_status ON photos(photo_status);
```

### 初期データ

```sql
-- カテゴリの初期データ
INSERT INTO photo_categories (category_name, category_description) VALUES
('palet', 'パレットの現況、搬入・搬出時の写真'),
('construction', '工事現場、作業状況の写真'),
('quality', '品質チェック、検査時の写真'),
('safety', '安全確認、危険箇所の写真'),
('others', 'その他の関連写真');

-- タグの初期データ
INSERT INTO photo_tags (fk_category_id, tag_name, tag_description) VALUES
(1, 'palet_in', 'パレット搬入'),
(1, 'palet_out', 'パレット搬出'),
(1, 'palet_status', 'パレット現況'),
(2, 'construction_progress', '工事進捗'),
(2, 'construction_equipment', '工事機材'),
(3, 'quality_check', '品質チェック'),
(3, 'quality_inspection', '品質検査'),
(4, 'safety_check', '安全確認'),
(4, 'safety_hazard', '危険箇所');
```

## 📁 フォルダ体系設計

### 推奨フォルダ構造
```
src/app/app_project/[project_id]/photo/
├── components/
│   ├── PhotoGrid/
│   │   ├── PhotoGrid.tsx
│   │   ├── PhotoCard.tsx
│   │   ├── PhotoModal.tsx
│   │   └── index.ts
│   ├── PhotoUpload/
│   │   ├── PhotoUpload.tsx
│   │   ├── DragDropZone.tsx
│   │   ├── UploadProgress.tsx
│   │   └── index.ts
│   ├── PhotoFilters/
│   │   ├── PhotoFilters.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── DateFilter.tsx
│   │   ├── TagFilter.tsx
│   │   └── index.ts
│   ├── PhotoActions/
│   │   ├── PhotoActions.tsx
│   │   ├── BatchActions.tsx
│   │   ├── PhotoMenu.tsx
│   │   └── index.ts
│   └── PhotoDetail/
│       ├── PhotoDetail.tsx
│       ├── PhotoInfo.tsx
│       ├── PhotoTags.tsx
│       └── index.ts
├── hooks/
│   ├── usePhotos.ts
│   ├── usePhotoUpload.ts
│   ├── usePhotoFilters.ts
│   ├── usePhotoActions.ts
│   └── usePhotoDetail.ts
├── types/
│   ├── photo.types.ts
│   ├── upload.types.ts
│   └── index.ts
├── utils/
│   ├── photoUtils.ts
│   ├── uploadUtils.ts
│   ├── filterUtils.ts
│   └── index.ts
├── api/
│   ├── photoApi.ts
│   ├── uploadApi.ts
│   └── index.ts
├── store/
│   ├── photoStore.ts
│   ├── uploadStore.ts
│   └── index.ts
├── page.tsx
└── layout.tsx
```

## 🧩 コンポーネント構想

### 1. PhotoGrid コンポーネント群

#### **PhotoGrid.tsx** - メインの写真グリッド
```typescript
interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  onPhotoSelect: (photoId: number, selected: boolean) => void;
  selectedPhotos: number[];
  loading?: boolean;
}
```

#### **PhotoCard.tsx** - 個別写真カード
```typescript
interface PhotoCardProps {
  photo: Photo;
  onSelect: (selected: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  selected?: boolean;
  showActions?: boolean;
}
```

#### **PhotoModal.tsx** - 写真詳細モーダル
```typescript
interface PhotoModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (photo: Photo) => void;
  onDelete: (photoId: number) => void;
}
```

### 2. PhotoUpload コンポーネント群

#### **PhotoUpload.tsx** - アップロードメインコンポーネント
```typescript
interface PhotoUploadProps {
  projectId: string;
  onUploadComplete: (photos: Photo[]) => void;
  onUploadError: (error: string) => void;
  maxFiles?: number;
  maxFileSize?: number;
}
```

#### **DragDropZone.tsx** - ドラッグ&ドロップエリア
```typescript
interface DragDropZoneProps {
  onFilesDrop: (files: File[]) => void;
  accept?: string[];
  maxFiles?: number;
  disabled?: boolean;
}
```

#### **UploadProgress.tsx** - アップロード進捗表示
```typescript
interface UploadProgressProps {
  progress: number;
  currentFile: string;
  totalFiles: number;
  onCancel: () => void;
}
```

### 3. PhotoFilters コンポーネント群

#### **PhotoFilters.tsx** - フィルタメインコンポーネント
```typescript
interface PhotoFiltersProps {
  onFiltersChange: (filters: PhotoFilters) => void;
  categories: PhotoCategory[];
  tags: PhotoTag[];
  dateRange?: DateRange;
}
```

#### **CategoryFilter.tsx** - カテゴリフィルタ
```typescript
interface CategoryFilterProps {
  categories: PhotoCategory[];
  selectedCategory?: PhotoCategory;
  onCategoryChange: (category?: PhotoCategory) => void;
}
```

#### **DateFilter.tsx** - 日付フィルタ
```typescript
interface DateFilterProps {
  dateRange?: DateRange;
  onDateRangeChange: (range?: DateRange) => void;
}
```

#### **TagFilter.tsx** - タグフィルタ
```typescript
interface TagFilterProps {
  tags: PhotoTag[];
  selectedTags: number[];
  onTagsChange: (tagIds: number[]) => void;
}
```

### 4. PhotoActions コンポーネント群

#### **PhotoActions.tsx** - アクションメインコンポーネント
```typescript
interface PhotoActionsProps {
  selectedPhotos: number[];
  onBatchDelete: () => void;
  onBatchMove: (targetProjectId: string) => void;
  onBatchTag: (tagIds: number[]) => void;
}
```

#### **BatchActions.tsx** - 一括操作コンポーネント
```typescript
interface BatchActionsProps {
  selectedCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBatchAction: (action: BatchAction) => void;
}
```

#### **PhotoMenu.tsx** - 写真メニュー
```typescript
interface PhotoMenuProps {
  photo: Photo;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: () => void;
  onShare: () => void;
}
```

### 5. PhotoDetail コンポーネント群

#### **PhotoDetail.tsx** - 写真詳細メインコンポーネント
```typescript
interface PhotoDetailProps {
  photo: Photo;
  onUpdate: (updates: Partial<Photo>) => void;
  onDelete: () => void;
}
```

#### **PhotoInfo.tsx** - 写真情報表示
```typescript
interface PhotoInfoProps {
  photo: Photo;
  onUpdate: (field: keyof Photo, value: any) => void;
  editable?: boolean;
}
```

#### **PhotoTags.tsx** - 写真タグ管理
```typescript
interface PhotoTagsProps {
  photo: Photo;
  availableTags: PhotoTag[];
  onTagsUpdate: (tagIds: number[]) => void;
}
```

## 🎣 フック構想

### 1. usePhotos.ts - 写真データ管理
```typescript
export function usePhotos(projectId: string) {
  // 写真一覧取得
  const { data: photos, isLoading, error } = useQuery(...);
  
  // 写真検索
  const searchPhotos = useCallback((query: string) => {...}, []);
  
  // 写真フィルタ
  const filterPhotos = useCallback((filters: PhotoFilters) => {...}, []);
  
  // 写真選択
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  
  return {
    photos,
    isLoading,
    error,
    searchPhotos,
    filterPhotos,
    selectedPhotos,
    setSelectedPhotos
  };
}
```

### 2. usePhotoUpload.ts - アップロード管理
```typescript
export function usePhotoUpload(projectId: string) {
  // アップロード状態
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // ファイルアップロード
  const uploadFiles = useCallback(async (files: File[]) => {...}, []);
  
  // アップロードキャンセル
  const cancelUpload = useCallback(() => {...}, []);
  
  // ファイル検証
  const validateFiles = useCallback((files: File[]) => {...}, []);
  
  return {
    uploadProgress,
    isUploading,
    uploadFiles,
    cancelUpload,
    validateFiles
  };
}
```

### 3. usePhotoFilters.ts - フィルタ管理
```typescript
export function usePhotoFilters() {
  // フィルタ状態
  const [filters, setFilters] = useState<PhotoFilters>({});
  
  // カテゴリフィルタ
  const setCategoryFilter = useCallback((category?: PhotoCategory) => {...}, []);
  
  // 日付フィルタ
  const setDateFilter = useCallback((dateRange?: DateRange) => {...}, []);
  
  // タグフィルタ
  const setTagFilter = useCallback((tagIds: number[]) => {...}, []);
  
  // フィルタリセット
  const resetFilters = useCallback(() => {...}, []);
  
  return {
    filters,
    setCategoryFilter,
    setDateFilter,
    setTagFilter,
    resetFilters
  };
}
```

### 4. usePhotoActions.ts - アクション管理
```typescript
export function usePhotoActions() {
  // 一括削除
  const batchDelete = useCallback(async (photoIds: number[]) => {...}, []);
  
  // 一括更新
  const batchUpdate = useCallback(async (photoIds: number[], updates: Partial<Photo>) => {...}, []);
  
  // 一括タグ付け
  const batchAddTags = useCallback(async (photoIds: number[], tagIds: number[]) => {...}, []);
  
  // 写真移動
  const movePhotos = useCallback(async (photoIds: number[], targetProjectId: string) => {...}, []);
  
  // 写真複製
  const duplicatePhoto = useCallback(async (photoId: number) => {...}, []);
  
  return {
    batchDelete,
    batchUpdate,
    batchAddTags,
    movePhotos,
    duplicatePhoto
  };
}
```

### 5. usePhotoDetail.ts - 写真詳細管理
```typescript
export function usePhotoDetail(photoId: number) {
  // 写真詳細取得
  const { data: photo, isLoading, error } = useQuery(...);
  
  // 写真更新
  const updatePhoto = useCallback(async (updates: Partial<Photo>) => {...}, []);
  
  // 写真削除
  const deletePhoto = useCallback(async () => {...}, []);
  
  // タグ更新
  const updateTags = useCallback(async (tagIds: number[]) => {...}, []);
  
  return {
    photo,
    isLoading,
    error,
    updatePhoto,
    deletePhoto,
    updateTags
  };
}
```

## 🗂️ 型定義

### photo.types.ts
```typescript
export interface PhotoFilters {
  category?: PhotoCategory;
  dateRange?: DateRange;
  tags?: number[];
  search?: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface BatchAction {
  type: 'delete' | 'move' | 'tag' | 'archive';
  payload: any;
}

export interface UploadState {
  progress: number;
  currentFile: string;
  totalFiles: number;
  isUploading: boolean;
}
```

### upload.types.ts
```typescript
export interface UploadConfig {
  maxFiles: number;
  maxFileSize: number;
  allowedTypes: string[];
}

export interface UploadResult {
  success: boolean;
  photos?: Photo[];
  errors?: string[];
}
```

## 🎯 機能要件

### 1.1 基本機能
- ⏳ **写真表示**: プロジェクト関連の写真を一覧表示
- ⏳ **写真アップロード**: 新しい写真のアップロード機能
- ⏳ **写真詳細表示**: 個別写真の詳細情報表示
- ⏳ **写真検索・フィルタ**: 日付、カテゴリ、タグによる検索機能
- ⏳ **写真編集**: 写真のメタデータ（タイトル、説明、タグ）の編集

### 1.2 写真カテゴリ
- **パレット写真** (`palet`): パレットの現況、搬入・搬出時の写真
- **工事写真** (`construction`): 工事現場、作業状況の写真
- **品質管理写真** (`quality`): 品質チェック、検査時の写真
- **安全管理写真** (`safety`): 安全確認、危険箇所の写真
- **その他** (`others`): その他の関連写真

## 🛠️ 技術仕様

### 2.1 フロントエンド
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **UIライブラリ**: Tailwind CSS
- **状態管理**: Zustand
- **API通信**: tRPC

### 2.2 バックエンド
- **データベース**: SQLite (achievements.db)
- **API**: tRPC
- **ファイル保存**: `public/photos/projects/[project_id]/images/`

### 2.3 型定義
```typescript
// 写真カテゴリ
export type PhotoCategory = 'palet' | 'construction' | 'quality' | 'safety' | 'others';

// 写真ステータス
export type PhotoStatus = 'active' | 'archived' | 'deleted';

// 写真情報（統一型定義 - AI開発向け）
export interface Photo {
  photo_id: number;
  fk_project_id: string;
  fk_palet_list_id?: string;
  photo_file_path: string;
  photo_thumbnail_path?: string;
  photo_title: string;
  photo_description?: string;
  photo_location?: string;
  photo_shooting_date?: string;
  photo_category: PhotoCategory;
  photo_tags?: string; // JSON形式でタグIDを保存
  photo_status: PhotoStatus;
  fk_uploaded_by_user_id?: string;
  photo_uploaded_at: string;
  photo_updated_at: string;
}

// 写真アップロード用（簡略化）
export interface PhotoUpload {
  fk_project_id: string;
  fk_palet_list_id?: string;
  photo_title: string;
  photo_description?: string;
  photo_location?: string;
  photo_shooting_date?: string;
  photo_category: PhotoCategory;
  photo_tags?: string[];
  photo_status?: PhotoStatus;
}
```

## 📄 ページ構成

### 3.1 メインページ (`/app_project/[project_id]/photo`)
- プロジェクト全体の写真一覧
- カテゴリ別フィルタ
- 検索機能
- 写真アップロード機能

### 3.2 写真詳細ページ (`/app_project/[project_id]/photo/[photo_id]`)
- 個別写真の詳細表示
- 写真情報の編集
- 関連写真の表示

### 3.3 パレット関連写真ページ (`/app_project/[project_id]/mbom/[palet_id]/photos`)
- パレット固有の写真表示
- パレット状況の写真記録

## 🎨 UI/UX設計

### 4.1 写真表示
- **グリッドレイアウト**: レスポンシブな写真グリッド
- **サムネイル表示**: 写真のサムネイル表示
- **ホバー効果**: 写真にホバー時の詳細表示
- **モーダル表示**: 写真クリック時の拡大表示

### 4.2 アップロード機能
- **ドラッグ&ドロップ**: ファイルのドラッグ&ドロップ対応
- **複数ファイル**: 複数写真の同時アップロード
- **プレビュー**: アップロード前のプレビュー表示
- **プログレスバー**: アップロード進捗の表示

### 4.3 検索・フィルタ
- **カテゴリフィルタ**: カテゴリ別の絞り込み
- **日付フィルタ**: 撮影日による絞り込み
- **タグ検索**: タグによる検索機能
- **キーワード検索**: タイトル・説明文での検索

## 🔌 API設計

### 6.1 写真取得API
```typescript
// プロジェクトの写真一覧取得
trpc.photos.getByProjectId.useQuery({ 
  projectId: string, 
  category?: PhotoCategory, 
  dateFrom?: string, 
  dateTo?: string,
  limit?: number,
  offset?: number
})

// 個別写真取得
trpc.photos.getById.useQuery({ photoId: number })

// パレット関連写真取得
trpc.photos.getByPaletListId.useQuery({ paletListId: string })

// 写真検索
trpc.photos.search.useQuery({ 
  projectId: string,
  query: string,
  category?: PhotoCategory,
  tags?: string[]
})

// 写真統計情報取得
trpc.photos.getStats.useQuery({ 
  projectId: string 
})
```

### 6.2 写真アップロード・更新API
```typescript
// 写真アップロード
trpc.photos.upload.useMutation({
  projectId: string,
  files: File[],
  metadata: PhotoUpload[]
})

// 写真更新
trpc.photos.update.useMutation({
  photoId: number,
  metadata: Partial<PhotoUpload>
})

// 写真削除
trpc.photos.delete.useMutation({ photoId: number })

// 写真一括削除
trpc.photos.batchDelete.useMutation({ 
  photoIds: number[] 
})

// 写真一括更新
trpc.photos.batchUpdate.useMutation({
  photoIds: number[],
  updates: Partial<PhotoUpload>
})
```

### 6.3 タグ管理API
```typescript
// タグ一括付け
trpc.photos.batchAddTags.useMutation({
  photoIds: number[],
  tagIds: number[]
})

// タグ一括削除
trpc.photos.batchRemoveTags.useMutation({
  photoIds: number[],
  tagIds: number[]
})

// タグ一括置換
trpc.photos.batchReplaceTags.useMutation({
  photoIds: number[],
  tagIds: number[]
})

// タグ一覧取得
trpc.photos.getTags.useQuery({ 
  projectId: string 
})

// カテゴリ一覧取得
trpc.photos.getCategories.useQuery()
```

### 6.4 写真管理API
```typescript
// 写真複製
trpc.photos.duplicate.useMutation({
  photoId: number,
  newMetadata?: Partial<PhotoUpload>
})

// 写真移動（プロジェクト間）
trpc.photos.move.useMutation({
  photoId: number,
  targetProjectId: string
})

// 写真一括移動
trpc.photos.batchMove.useMutation({
  photoIds: number[],
  targetProjectId: string
})

// 写真アーカイブ
trpc.photos.archive.useMutation({ 
  photoId: number 
})

// 写真一括アーカイブ
trpc.photos.batchArchive.useMutation({ 
  photoIds: number[] 
})

// 写真復元
trpc.photos.restore.useMutation({ 
  photoId: number 
})

// 写真一括復元
trpc.photos.batchRestore.useMutation({ 
  photoIds: number[] 
})
```

### 6.5 写真エクスポートAPI
```typescript
// 写真一括ダウンロード
trpc.photos.export.useMutation({
  photoIds: number[],
  format: 'zip' | 'pdf'
})

// 写真レポート生成
trpc.photos.generateReport.useMutation({
  projectId: string,
  dateFrom?: string,
  dateTo?: string,
  category?: PhotoCategory
})
```

## 🔒 セキュリティ考慮事項

### 7.1 ファイルアップロード
- **ファイルサイズ制限**: 最大10MB
- **ファイル形式制限**: JPG, PNG, GIF, WebPのみ許可
- **ファイル名サニタイズ**: 危険な文字の除去
- **ウイルススキャン**: アップロード時のウイルスチェック（将来実装）

### 7.2 アクセス制御
- **プロジェクト権限**: プロジェクトメンバーのみアクセス可能（将来実装）
- **写真権限**: 写真の所有者のみ編集・削除可能
- **ログ記録**: 写真の閲覧・編集ログの記録（将来実装）

## ⚡ パフォーマンス最適化

### 8.1 画像最適化
- **サムネイル生成**: 自動的なサムネイル生成（Sharp.js使用）
- **画像圧縮**: アップロード時の画像圧縮（将来実装）
- **遅延読み込み**: スクロール時の遅延読み込み
- **WebP対応**: モダンブラウザでのWebP形式対応

### 8.2 データベース最適化
- **インデックス**: 適切なインデックスの設定
- **ページネーション**: 大量データのページネーション
- **キャッシュ**: 頻繁にアクセスされるデータのキャッシュ

## 📊 実装優先度

### 9.1 Phase 1 (基本機能) - 計画中
- ⏳ 写真表示機能
- ⏳ 写真アップロード機能
- ⏳ 写真削除機能
- ⏳ 基本的なタグ機能

### 9.2 Phase 2 (管理機能) - 計画中
- ⏳ 一括操作（削除・更新・タグ付け）
- ⏳ 写真移動・複製機能
- ⏳ カテゴリフィルタ
- ⏳ 日付フィルタ
- ⏳ キーワード検索

### 9.3 Phase 3 (高度な機能) - 計画中
- ⏳ 写真処理（リサイズ・回転）
- ⏳ エクスポート・レポート機能
- ⏳ 写真共有機能
- ⏳ AI画像認識
- ⏳ 写真比較機能

## 🧪 テスト計画

### 10.1 単体テスト
- 写真アップロード機能のテスト
- 写真表示機能のテスト
- 検索・フィルタ機能のテスト

### 10.2 統合テスト
- API通信のテスト
- データベース操作のテスト
- ファイル操作のテスト

### 10.3 E2Eテスト
- 写真管理フローのテスト
- ユーザー操作のテスト

## 🚀 今後の拡張予定

### 11.1 機能拡張
- **AI画像認識**: 写真の自動タグ付け
- **写真比較**: 前後の写真比較機能
- **写真レポート**: 写真を使ったレポート生成
- **写真ギャラリー**: スライドショー機能

### 11.2 技術拡張
- **クラウドストレージ**: AWS S3等への移行
- **画像処理**: 高度な画像処理機能
- **モバイル対応**: モバイルアプリ対応
- **リアルタイム同期**: WebSocketによるリアルタイム更新

---

**作成日**: 2025年1月
**最終更新**: 2025年1月
**バージョン**: 2.0
**作成者**: AI Assistant
