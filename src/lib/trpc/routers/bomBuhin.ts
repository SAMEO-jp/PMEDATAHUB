import { createRecord, deleteRecord, getAllRecords, getRecord, updateRecord } from '@src/lib/db/db_CRUD';
import type { BomBuhinData } from '@src/types/bom_buhin';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '../trpc';

// ==========================================
// Zodスキーマ
// ==========================================
const BomBuhinSchema = z.object({
  BUHIN_ID: z.string().min(1, '部品IDは必須です'),
  ZUMEN_ID: z.string().min(1, '図面IDは必須です'),
  BUHIN_PROJECT_ID: z.string().min(1, 'プロジェクトIDは必須です'),
  BUHIN_QUANTITY: z.number().min(0, '数量は0以上である必要があります'),
  BUHIN_SPARE_QUANTITY: z.number().min(0, '予備数量は0以上である必要があります'),
  BUHIN_NAME: z.string().min(1, '部品名は必須です'),
  BUHIN_KIND: z.string().optional(),
  BUHIN_REMARKS: z.string().optional(),
  BUHIN_TEHAI_DIVISION: z.string().optional(),
  BUHIN_TEHAI_ID: z.string().optional(),
  BUHIN_MANUFACTURER: z.string().optional(),
  BUHIN_SEKKOUHIN: z.string().optional(),
  KANREN_BUHIN: z.string().optional(),
  SOUTI_SEIBAN: z.string().optional(),
  BUHIN_PART_TANNI_WEIGHT: z.number().min(0, '重量は0以上である必要があります'),
});

// ==========================================
// tRPCルーター
// ==========================================
export const bomBuhinRouter = createTRPCRouter({
  // プロジェクトIDでBOM部品データを取得
  getByProjectId: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      try {
        // DAL層を使用してデータ取得
        const result = await getAllRecords<BomBuhinData>(
          'BOM_BUHIN', 
          `SELECT * FROM BOM_BUHIN WHERE BUHIN_PROJECT_ID = ?`, 
          [input.projectId]
        );
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'データの取得に失敗しました',
          });
        }
        
        return { success: true, data: result.data || [] };
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'データの取得に失敗しました',
        });
      }
    }),

  // 全BOM部品データを取得
  getAll: publicProcedure
    .query(async () => {
      try {
        const result = await getAllRecords<BomBuhinData>('BOM_BUHIN');
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'データの取得に失敗しました',
          });
        }
        
        return { success: true, data: result.data || [] };
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'データの取得に失敗しました',
        });
      }
    }),

  // ID指定でBOM部品データを取得
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const result = await getRecord<BomBuhinData>('BOM_BUHIN', input.id);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error?.message || 'レコードが見つかりません',
          });
        }
        
        return { success: true, data: result.data };
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'データの取得に失敗しました',
        });
      }
    }),

  // BOM部品データを作成
  create: publicProcedure
    .input(BomBuhinSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await createRecord('BOM_BUHIN', input);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'データの作成に失敗しました',
          });
        }
        
        return { success: true, data: result.data };
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'データの作成に失敗しました',
        });
      }
    }),

  // BOM部品データを更新
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      data: BomBuhinSchema.partial(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await updateRecord<BomBuhinData>('BOM_BUHIN', input.id, input.data);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error?.message || 'レコードが見つかりません',
          });
        }
        
        return { success: true, data: result.data };
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'データの更新に失敗しました',
        });
      }
    }),

  // BOM部品データを削除
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const result = await deleteRecord('BOM_BUHIN', input.id);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error?.message || 'レコードが見つかりません',
          });
        }
        
        return { success: true, data: { id: input.id } };
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'データの削除に失敗しました',
        });
      }
    }),

  // 部品名で検索
  search: publicProcedure
    .input(z.object({ BUHIN_NAME: z.string() }))
    .query(async ({ input }) => {
      try {
        const result = await getAllRecords<BomBuhinData>(
          'BOM_BUHIN',
          `SELECT * FROM BOM_BUHIN WHERE BUHIN_NAME LIKE ?`,
          [`%${input.BUHIN_NAME}%`]
        );
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || '検索に失敗しました',
          });
        }
        
        return { success: true, data: result.data || [] };
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '検索に失敗しました',
        });
      }
    }),
}); 