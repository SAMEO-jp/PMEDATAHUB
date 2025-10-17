// ==========================================
// 型定義集約ファイル（Props, 内部型, API型）
// ==========================================

import type { Part, PaletteItem } from './parts'
// 新しいAPI構造の型定義をインポート
import type {
  PaletMaster,
  KonpoPalet,
  PaletList,
  PaletStatusHistory,
  PaletSchedule,
  PaletTempLocations,
  PaletMasterCreate,
  KonpoPaletCreate,
  PaletListCreate,
  PaletStatusHistoryCreate,
  PaletScheduleCreate,
  PaletTempLocationsCreate,
  PaletMasterSearch,
  KonpoPaletSearch,
  PaletListSearch,
  PaletStatusHistorySearch,
  PaletScheduleSearch,
  PaletTempLocationsSearch
} from '@src/types/palet'

// 部品情報（parts.tsから再エクスポート）
export type { Part, PaletteItem }

// 新しいAPI構造の型定義を再エクスポート
export type {
  PaletMaster,
  KonpoPalet,
  PaletList,
  PaletStatusHistory,
  PaletSchedule,
  PaletTempLocations,
  PaletMasterCreate,
  KonpoPaletCreate,
  PaletListCreate,
  PaletStatusHistoryCreate,
  PaletScheduleCreate,
  PaletTempLocationsCreate,
  PaletMasterSearch,
  KonpoPaletSearch,
  PaletListSearch,
  PaletStatusHistorySearch,
  PaletScheduleSearch,
  PaletTempLocationsSearch
}

// ==========================================
// 既存コードとの互換性のための型定義
// ==========================================

/**
 * 構成パレットリスト（既存コード互換）
 */
export interface KonpoPaletList {
  KONPO_PALET_LIST_ID: number;
  KONPO_PALET_ID: number;
  palet_display_name: string;
  palet_quantity: number;
  created_at: string;
  updated_at: string;
}

/**
 * 構成パレット（リスト付き）
 */
export interface KonpoPaletWithList extends KonpoPalet {
  list?: KonpoPaletList;
}

/**
 * 構成パレットリスト（アイテム付き）
 */
export interface KonpoPaletListWithItems extends KonpoPaletList {
  items: KonpoPalet[];
}

/**
 * 構成パレット（部品付き）
 */
export interface KonpoPaletWithBuhin extends KonpoPalet {
  buhin?: {
    BUHIN_ID: string;
    BUHIN_NAME: string;
    ZUMEN_ID: string;
  };
}

/**
 * パレットリストアイテム（既存コード互換）
 */
export interface PaletListItem {
  konpo_palet_master_id: string;
  palet_display_name: string;
  palet_quantity: number;
  created_at: string;
  updated_at: string;
}

/**
 * パレット登録データ（既存コード互換）
 */
export interface PaletRegistrationData {
  palet_display_name: string;
  bom_buhin_id: string;
  bom_part_ko: number;
  ZUMEN_ID: string;
  palet_quantity?: number;
}

/**
 * パレット登録レスポンス（既存コード互換）
 */
export interface PaletRegistrationResponse {
  paletId: string;
  success: boolean;
  message?: string;
}

/**
 * パレットテーブル状態
 */
export interface PaletTableState {
  selectedItems: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  filterBy: string;
}

/**
 * 集約パレット
 */
export interface AggregatedPalet {
  paletId: string;
  paletName: string;
  totalQuantity: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// APIリクエスト型定義（既存コード互換）
// ==========================================

/**
 * 構成パレット作成リクエスト（既存コード互換）
 */
export interface CreateKonpoPaletRequest {
  BUHIN_ID: string;
  PALET_BUHIN_QUANTITY: number;
}

/**
 * 構成パレットリスト作成リクエスト（既存コード互換）
 */
export interface CreateKonpoPaletListRequest {
  KONPO_PALET_ID: number;
  palet_display_name: string;
  palet_quantity: number;
}

/**
 * 構成パレット更新リクエスト（既存コード互換）
 */
export interface UpdateKonpoPaletRequest {
  KONPO_PALET_ID: number;
  BUHIN_ID?: string;
  PALET_BUHIN_QUANTITY?: number;
}

/**
 * 構成パレットリスト更新リクエスト（既存コード互換）
 */
export interface UpdateKonpoPaletListRequest {
  KONPO_PALET_LIST_ID: number;
  palet_display_name?: string;
  palet_quantity?: number;
}

// ==========================================
// 新しいAPI構造との互換性マッピング
// ==========================================

/**
 * 新しいAPI構造との互換性のためのマッピング
 */
export const mapToNewPaletStructure = {
  // パレットマスター
  paletMaster: (data: any): PaletMaster => ({
    palet_master_id: data.palet_master_id || data.KONPO_PALET_ID,
    palet_master_display_name: data.palet_master_display_name || data.palet_display_name,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }),

  // 構成パレット
  konpoPalet: (data: any): KonpoPalet => ({
    konpo_palet_id: data.konpo_palet_id || data.KONPO_PALET_ID,
    palet_master_id: data.palet_master_id || data.KONPO_PALET_ID,
    buhin_id: data.buhin_id || data.BUHIN_ID,
    palet_buhin_quantity: data.palet_buhin_quantity || data.PALET_BUHIN_QUANTITY,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }),

  // パレットリスト
  paletList: (data: any): PaletListItem => ({
    konpo_palet_master_id: data.palet_master_id || data.palet_list_id || data.KONPO_PALET_LIST_ID,
    palet_display_name: data.palet_list_display_name || data.palet_display_name,
    palet_quantity: data.palet_quantity,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }),
};

// パレットレイアウト
export type LayoutType = 'normal' | 'expanded' | 'palette-master-list' | 'palette-list' | 'palette-table' | 'palette-list-new'
// パレットフィルタ
export type FilterType = 'all' | 'registered' | 'unregistered' | 'overregistered'
