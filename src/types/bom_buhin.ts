import { z } from 'zod';

// BOM_BUHINテーブルのスキーマ定義
export const BomBuhinSchema = z.object({
  id: z.number().optional(), // AUTOINCREMENTなので作成時は省略可能
  BUHIN_ID: z.string().min(1, '部品IDは必須です'),
  ZUMEN_ID: z.string().min(1, '図面IDは必須です'),
  BUHIN_PROJECT_ID: z.string().optional(),
  BUHIN_QUANTITY: z.number().default(0),
  BUHIN_SPARE_QUANTITY: z.number().default(0),
  BUHIN_NAME: z.string().optional(),
  BUHIN_KIND: z.string().optional(),
  BUHIN_REMARKS: z.string().optional(),
  BUHIN_TEHAI_DIVISION: z.string().optional(),
  BUHIN_TEHAI_ID: z.string().optional(),
  BUHIN_MANUFACTURER: z.string().optional(),
  BUHIN_SEKKOUHIN: z.string().optional(),
  KANREN_BUHIN: z.string().optional(),
  SOUTI_SEIBAN: z.string().optional(),
  BUHIN_PART_TANNI_WEIGHT: z.number().default(0)
});

// 作成用のスキーマ（idを除外）
export const CreateBomBuhinSchema = BomBuhinSchema.omit({ id: true });

// 更新用のスキーマ（すべてのフィールドをオプショナルに）
export const UpdateBomBuhinSchema = BomBuhinSchema.partial().omit({ id: true });

// 検索用のスキーマ
export const SearchBomBuhinSchema = z.object({
  BUHIN_ID: z.string().optional(),
  ZUMEN_ID: z.string().optional(),
  BUHIN_PROJECT_ID: z.string().optional(),
  BUHIN_NAME: z.string().optional(),
  BUHIN_KIND: z.string().optional(),
  BUHIN_MANUFACTURER: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
});

// 型定義
export type BomBuhin = z.infer<typeof BomBuhinSchema>;
export type CreateBomBuhin = z.infer<typeof CreateBomBuhinSchema>;
export type UpdateBomBuhin = z.infer<typeof UpdateBomBuhinSchema>;
export type SearchBomBuhin = z.infer<typeof SearchBomBuhinSchema>;

// APIレスポンス型
export interface BomBuhinResponse {
  success: boolean;
  data?: BomBuhin | BomBuhin[] | null;
  error?: string | null;
  count?: number;
  total?: number;
  page?: number;
  limit?: number;
}

// ==========================================
// BOM部品データの型定義
// ==========================================

/**
 * BOM部品データの基本型
 */
export interface BomBuhinData {
  id: number;
  BUHIN_ID: string;
  ZUMEN_ID: string;
  BUHIN_PROJECT_ID: string;
  BUHIN_QUANTITY: number;
  BUHIN_SPARE_QUANTITY: number;
  BUHIN_NAME: string;
  BUHIN_KIND: string;
  BUHIN_REMARKS: string;
  BUHIN_TEHAI_DIVISION: string;
  BUHIN_TEHAI_ID: string;
  BUHIN_MANUFACTURER: string;
  BUHIN_SEKKOUHIN: string;
  KANREN_BUHIN: string;
  SOUTI_SEIBAN: string;
  BUHIN_PART_TANNI_WEIGHT: number;
}

/**
 * BOM部品作成用の型（ID除外）
 */
export type CreateBomBuhinData = Omit<BomBuhinData, 'id'>;

/**
 * BOM部品更新用の型（部分更新可能）
 */
export type UpdateBomBuhinData = Partial<CreateBomBuhinData>;

/**
 * BOM部品検索条件の型
 */
export interface BomBuhinSearchFilters {
  BUHIN_ID?: string;
  ZUMEN_ID?: string;
  BUHIN_PROJECT_ID?: string;
  BUHIN_NAME?: string;
  BUHIN_KIND?: string;
  BUHIN_MANUFACTURER?: string;
} 