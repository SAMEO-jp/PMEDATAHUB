import { createRecord, deleteRecord, getAllRecords, getRecord, updateRecord } from '@src/lib/db/db_CRUD';
import type { BomZumen } from '@src/types/db_bom';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '../trpc';

// ==========================================
// Zodスキーマ
// ==========================================
const BomZumenSchema = z.object({
  Zumen_ID: z.string().min(1, '図面IDは必須です'),
  project_ID: z.string().min(1, 'プロジェクトIDは必須です'),
  Zumen_Name: z.string().min(1, '図面名は必須です'),
  Zumen_Kind: z.string().optional(),
  Kumitate_Zumen: z.string().optional(),
  Souti_ID: z.string().optional(),
  Souti_name: z.string().optional(),
  rev_number: z.string().optional(),
  Tantou_a1: z.string().optional(),
  Tantou_a2: z.string().optional(),
  Tantou_b1: z.string().optional(),
  Tantou_b2: z.string().optional(),
  Tantou_c1: z.string().optional(),
  Tantou_c2: z.string().optional(),
  status: z.string().optional(),
  Syutuzubi_Date: z.string().optional(),
  Sakuzu_a: z.string().optional(),
  Sakuzu_b: z.string().optional(),
  Sakuzu_date: z.string().optional(),
  Scale: z.string().optional(),
  Size: z.string().optional(),
  Sicret_code: z.string().optional(),
  WRITEver: z.string().optional(),
  KANREN_ZUMEN: z.string().optional(),
});

// ==========================================
// tRPCルーター
// ==========================================
export const bomZumenRouter = createTRPCRouter({
  // プロジェクトIDでBOM図面データを取得
  getByProjectId: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      try {
        const result = await getAllRecords<BomZumen>(
          'BOM_ZUMEN', 
          `SELECT * FROM BOM_ZUMEN WHERE project_ID = ? ORDER BY Zumen_ID`, 
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

  // 図面IDでBOM図面データを取得
  getByZumenId: publicProcedure
    .input(z.object({ zumenId: z.string() }))
    .query(async ({ input }) => {
      try {
        const result = await getAllRecords<BomZumen>(
          'BOM_ZUMEN', 
          `SELECT * FROM BOM_ZUMEN WHERE Zumen_ID = ?`, 
          [input.zumenId]
        );
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'データの取得に失敗しました',
          });
        }
        
        return { success: true, data: result.data?.[0] || null };
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'データの取得に失敗しました',
        });
      }
    }),

  // 全BOM図面データを取得
  getAll: publicProcedure
    .query(async () => {
      try {
        const result = await getAllRecords<BomZumen>('BOM_ZUMEN', 'SELECT * FROM BOM_ZUMEN ORDER BY project_ID, Zumen_ID');
        
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

  // ROWID指定でBOM図面データを取得
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const result = await getRecord<BomZumen>('BOM_ZUMEN', input.id, 'ROWID');
        
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

  // BOM図面データを作成
  create: publicProcedure
    .input(BomZumenSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await createRecord('BOM_ZUMEN', input);
        
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

  // BOM図面データを更新
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      data: BomZumenSchema.partial(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await updateRecord<BomZumen>('BOM_ZUMEN', input.id, input.data, 'ROWID');
        
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

  // BOM図面データを削除
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const result = await deleteRecord('BOM_ZUMEN', input.id, 'ROWID');
        
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

  // 図面IDでBOM図面データを削除
  deleteByZumenId: publicProcedure
    .input(z.object({ zumenId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const result = await getAllRecords<BomZumen>(
          'BOM_ZUMEN', 
          `DELETE FROM BOM_ZUMEN WHERE Zumen_ID = ?`, 
          [input.zumenId]
        );
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'データの削除に失敗しました',
          });
        }
        
        return { success: true, data: { zumenId: input.zumenId } };
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'データの削除に失敗しました',
        });
      }
    }),
}); 