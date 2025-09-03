/**
 * @file box itemに関連する型定義
 */

export interface BoxItem {
  box_id: string;
  item_type: number;
  parent_item_id?: string;
  name?: string;
  sort_name?: string;
  owner_id: string;
  checksum?: string;
  size?: number;
  lock_id?: string;
  lock_owner_id?: string;
  content_created_at?: number;
  content_updated_at?: number;
  version_id?: string;
  lock_app_type?: string;
}

export interface BoxItemCreateInput {
  box_id: string;
  item_type: number;
  parent_item_id?: string;
  name?: string;
  sort_name?: string;
  owner_id: string;
  checksum?: string;
  size?: number;
  lock_id?: string;
  lock_owner_id?: string;
  content_created_at?: number;
  content_updated_at?: number;
  version_id?: string;
  lock_app_type?: string;
}

export interface BoxItemUpdateInput {
  parent_item_id?: string;
  name?: string;
  sort_name?: string;
  checksum?: string;
  size?: number;
  lock_id?: string;
  lock_owner_id?: string;
  content_created_at?: number;
  content_updated_at?: number;
  version_id?: string;
  lock_app_type?: string;
}

export interface BoxItemSearchFilters {
  box_id?: string;
  item_type?: number;
  parent_item_id?: string;
  name?: string;
  owner_id?: string;
  checksum?: string;
  size?: number;
  lock_id?: string;
  lock_owner_id?: string;
  content_created_at?: number;
  content_updated_at?: number;
  version_id?: string;
  lock_app_type?: string;
}

export interface BoxItemListResponse {
  success: boolean;
  data: BoxItem[];
  count: number;
  error?: string;
}

export interface BoxItemResponse {
  success: boolean;
  data?: BoxItem;
  error?: string;
}
