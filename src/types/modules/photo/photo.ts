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

// 写真フィルタ
export interface PhotoFilters {
  category?: PhotoCategory;
  dateRange?: DateRange;
  tags?: number[];
  search?: string;
}

// アルバム関連の型定義
export interface PhotoAlbum {
  album_id: number;
  fk_project_id: string;
  album_name: string;
  album_description?: string;
  album_cover_photo_id?: number;
  album_created_at: string;
  album_updated_at: string;
  photo_count?: number; // アルバム内の写真数
  cover_photo?: Photo; // カバー写真
}

export interface AlbumPhoto {
  fk_album_id: number;
  fk_photo_id: number;
  photo_order: number;
  added_at: string;
  photo?: Photo; // 関連する写真情報
}

export interface AlbumFilters {
  search?: string;
  sortBy?: 'name' | 'created_at' | 'photo_count';
  sortOrder?: 'asc' | 'desc';
}

// 日付範囲
export interface DateRange {
  from: Date;
  to: Date;
}

// バッチアクション
export interface BatchAction {
  type: 'delete' | 'move' | 'tag' | 'archive';
  payload: any;
}

// アップロード状態
export interface UploadState {
  progress: number;
  currentFile: string;
  totalFiles: number;
  isUploading: boolean;
}

// 写真カテゴリ情報
export interface PhotoCategoryInfo {
  category_id: number;
  category_name: PhotoCategory;
  category_description?: string;
  created_at: string;
}

// 写真タグ情報
export interface PhotoTagInfo {
  tag_id: number;
  fk_category_id: number;
  tag_name: string;
  tag_description?: string;
  created_at: string;
  category_name?: string;
} 