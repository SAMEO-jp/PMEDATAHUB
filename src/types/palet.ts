import { z } from 'zod';

// ==========================================
// パレット関連の型定義
// ==========================================

/**
 * パレットマスターの型定義
 */
export interface PaletMaster {
  palet_master_id: string;
  palet_master_display_name: string;
  created_at: string;
  updated_at: string;
}

/**
 * 構成パレットの型定義
 */
export interface KonpoPalet {
  konpo_palet_id: string;
  palet_master_id: string;
  buhin_id: string;
  palet_buhin_quantity: number;
  created_at: string;
  updated_at: string;
}

/**
 * パレットリストの型定義
 */
export interface PaletList {
  palet_list_id: number;
  palet_master_id: string;
  palet_list_display_name: string;
  palet_quantity: number;
  created_at: string;
  updated_at: string;
}

/**
 * パレットステータス履歴の型定義
 */
export interface PaletStatusHistory {
  palet_status_history_id: number;
  palet_list_id: number;
  palet_location_id: number;
  palet_status_type: string;
  palet_status_date: string;
  palet_location_info: string;
  palet_status_notes: string;
  created_at: string;
  updated_at: string;
}

/**
 * パレットスケジュールの型定義
 */
export interface PaletSchedule {
  palet_schedule_id: number;
  palet_list_id: number;
  palet_schedule_status_type: string;
  palet_planned_date: string;
  palet_schedule_notes: string;
  created_at: string;
  updated_at: string;
}

/**
 * パレット一時場所の型定義
 */
export interface PaletTempLocations {
  palet_location_id: number;
  palet_location_name: string;
  palet_location_address: string;
  palet_contact_info: string;
  created_at: string;
  updated_at: string;
}

// ==========================================
// Zodスキーマ定義
// ==========================================

/**
 * パレットマスター作成スキーマ
 */
export const PaletMasterCreateSchema = z.object({
  palet_master_id: z.string().min(1, 'パレットマスターIDは必須です'),
  palet_master_display_name: z.string().min(1, 'パレット表示名は必須です'),
});

/**
 * 構成パレット作成スキーマ
 */
export const KonpoPaletCreateSchema = z.object({
  palet_master_id: z.string().min(1, 'マスターIDは必須です'),
  buhin_id: z.string().min(1, '部品IDは必須です'),
  palet_buhin_quantity: z.number().min(1, '部品数量は1以上である必要があります'),
});

/**
 * パレットリスト作成スキーマ
 */
export const PaletListCreateSchema = z.object({
  palet_master_id: z.string().min(1, 'マスターIDは必須です'),
  palet_list_display_name: z.string().min(1, 'パレット名は必須です'),
  palet_quantity: z.number().min(1, 'パレット数量は1以上である必要があります'),
});

/**
 * パレットステータス履歴作成スキーマ
 */
export const PaletStatusHistoryCreateSchema = z.object({
  palet_list_id: z.number().min(1, '現物パレットIDは必須です'),
  palet_location_id: z.number().min(1, '場所IDは必須です'),
  palet_status_type: z.string().min(1, 'パレットステータス種別は必須です'),
  palet_status_date: z.string().min(1, 'パレットステータス日時は必須です'),
  palet_location_info: z.string().optional(),
  palet_status_notes: z.string().optional(),
});

/**
 * パレットスケジュール作成スキーマ
 */
export const PaletScheduleCreateSchema = z.object({
  palet_list_id: z.number().min(1, '現物パレットIDは必須です'),
  palet_schedule_status_type: z.string().min(1, 'パレットスケジュールステータス種別は必須です'),
  palet_planned_date: z.string().min(1, 'パレット計画日時は必須です'),
  palet_schedule_notes: z.string().optional(),
});

/**
 * パレット一時場所作成スキーマ
 */
export const PaletTempLocationsCreateSchema = z.object({
  palet_location_name: z.string().min(1, 'パレット場所名は必須です'),
  palet_location_address: z.string().optional(),
  palet_contact_info: z.string().optional(),
});

// ==========================================
// 検索条件の型定義
// ==========================================

/**
 * パレットマスター検索条件
 */
export interface PaletMasterSearch {
  palet_master_display_name?: string;
}

/**
 * 構成パレット検索条件
 */
export interface KonpoPaletSearch {
  palet_master_id?: string;
  buhin_id?: string;
}

/**
 * パレットリスト検索条件
 */
export interface PaletListSearch {
  palet_master_id?: string;
  palet_list_display_name?: string;
}

/**
 * パレットステータス履歴検索条件
 */
export interface PaletStatusHistorySearch {
  palet_list_id?: number;
  palet_location_id?: number;
  palet_status_type?: string;
  palet_status_date_from?: string;
  palet_status_date_to?: string;
}

/**
 * パレットスケジュール検索条件
 */
export interface PaletScheduleSearch {
  palet_list_id?: number;
  palet_schedule_status_type?: string;
  palet_planned_date_from?: string;
  palet_planned_date_to?: string;
}

/**
 * パレット一時場所検索条件
 */
export interface PaletTempLocationsSearch {
  palet_location_name?: string;
  palet_location_address?: string;
}

// ==========================================
// 型エクスポート
// ==========================================

export type PaletMasterCreate = z.infer<typeof PaletMasterCreateSchema>;
export type KonpoPaletCreate = z.infer<typeof KonpoPaletCreateSchema>;
export type PaletListCreate = z.infer<typeof PaletListCreateSchema>;
export type PaletStatusHistoryCreate = z.infer<typeof PaletStatusHistoryCreateSchema>;
export type PaletScheduleCreate = z.infer<typeof PaletScheduleCreateSchema>;
export type PaletTempLocationsCreate = z.infer<typeof PaletTempLocationsCreateSchema>; 