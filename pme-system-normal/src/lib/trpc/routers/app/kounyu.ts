/**
 * 購入品管理関連のtRPCルーター
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import {
  getKounyuWithAssignments,
  getKounyuDetail,
  getKounyuList
} from '../../../db/queries/kounyuQueries';
import {
  createKounyuMaster,
  updateKounyuMaster,
  deleteKounyuMaster,
  assignKounyuToUser,
  removeKounyuAssignment
} from '../../../db/crud/kounyuCRUD';
import { createKounyuTables, checkKounyuTablesExist } from '../../../db/migrations/create_kounyu_tables';

// バリデーションスキーマ
const KounyuFormSchema = z.object({
  project_id: z.string().min(1, 'プロジェクトIDは必須です'),
  management_number: z.string().min(1, '管理番号は必須です'),
  item_name: z.string().min(1, '購入品名は必須です'),
  contract_number: z.string().optional(),
  item_category: z.string().min(1, '購入品種別は必須です'),
  setsubi_seiban: z.string().optional(),
  responsible_department: z.string().optional(),
  drawing_number: z.string().optional(),
  display_order: z.number().min(0, '表示順は0以上である必要があります'),
  remarks: z.string().optional(),
});

const KounyuUpdateSchema = KounyuFormSchema.partial();

const KounyuAssignmentSchema = z.object({
  project_id: z.string().min(1, 'プロジェクトIDは必須です'),
  kounyu_id: z.number().min(1, '購入品IDは必須です'),
  user_id: z.string().min(1, 'ユーザーIDは必須です'),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

/**
 * 購入品管理ルーター
 */
export const kounyuRouter = createTRPCRouter({
  /**
   * テーブル初期化
   */
  initializeTables: publicProcedure
    .mutation(async () => {
      try {
        const result = await createKounyuTables();

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'テーブル作成に失敗しました',
          });
        }

        return { success: true, message: '購入品関連テーブルを作成しました' };
      } catch (error) {
        console.error('tRPC kounyu.initializeTables error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'テーブル作成に失敗しました',
        });
      }
    }),

  /**
   * テーブル存在確認
   */
  checkTables: publicProcedure
    .query(async () => {
      try {
        const result = await checkKounyuTablesExist();

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'テーブル確認に失敗しました',
          });
        }

        return { success: true, exists: result.data };
      } catch (error) {
        console.error('tRPC kounyu.checkTables error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'テーブル確認に失敗しました',
        });
      }
    }),

  /**
   * プロジェクトの購入品一覧取得（担当者情報付き）
   */
  getAllByProject: publicProcedure
    .input(z.object({
      project_id: z.string().min(1, 'プロジェクトIDは必須です'),
    }))
    .query(async ({ input }) => {
      try {
        const result = await getKounyuWithAssignments(input.project_id);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '購入品一覧の取得に失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC kounyu.getAllByProject error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '購入品一覧の取得に失敗しました',
        });
      }
    }),

  /**
   * 全購入品一覧取得
   */
  getAll: publicProcedure
    .query(async () => {
      try {
        const result = await getKounyuList();

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '購入品一覧の取得に失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC kounyu.getAll error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '購入品一覧の取得に失敗しました',
        });
      }
    }),

  /**
   * 購入品詳細取得
   */
  getDetail: publicProcedure
    .input(z.object({
      kounyu_id: z.number().min(1, '購入品IDは必須です'),
    }))
    .query(async ({ input }) => {
      try {
        const result = await getKounyuDetail(input.kounyu_id);

        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error || '購入品が見つかりません',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC kounyu.getDetail error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '購入品詳細の取得に失敗しました',
        });
      }
    }),

  /**
   * 購入品マスター作成
   */
  createMaster: publicProcedure
    .input(KounyuFormSchema)
    .mutation(async ({ input }) => {
      try {
        // テーブルが存在するか確認
        const tableCheck = await checkKounyuTablesExist();
        if (!tableCheck.success || !tableCheck.data) {
          // テーブルが存在しない場合は作成
          console.log('購入品テーブルが存在しないため、作成します');
          const createResult = await createKounyuTables();
          if (!createResult.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: '購入品テーブルの作成に失敗しました',
            });
          }
        }

        const result = await createKounyuMaster(input);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '購入品の作成に失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC kounyu.createMaster error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '購入品の作成に失敗しました',
        });
      }
    }),

  /**
   * 購入品マスター更新
   */
  updateMaster: publicProcedure
    .input(z.object({
      id: z.number().min(1, '購入品IDは必須です'),
      data: KounyuUpdateSchema,
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await updateKounyuMaster(input.id, input.data);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '購入品の更新に失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC kounyu.updateMaster error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '購入品の更新に失敗しました',
        });
      }
    }),

  /**
   * 購入品マスター削除
   */
  deleteMaster: publicProcedure
    .input(z.object({
      id: z.number().min(1, '購入品IDは必須です'),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await deleteKounyuMaster(input.id);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '購入品の削除に失敗しました',
          });
        }

        return { success: true, message: '購入品を削除しました' };
      } catch (error) {
        console.error('tRPC kounyu.deleteMaster error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '購入品の削除に失敗しました',
        });
      }
    }),

  /**
   * 購入品担当割り当て
   */
  assignUser: publicProcedure
    .input(KounyuAssignmentSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await assignKounyuToUser(input);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '担当割り当てに失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC kounyu.assignUser error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '担当割り当てに失敗しました',
        });
      }
    }),

  /**
   * 購入品担当解除
   */
  removeAssignment: publicProcedure
    .input(z.object({
      assignment_id: z.number().min(1, '担当割り当てIDは必須です'),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await removeKounyuAssignment(input.assignment_id);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '担当解除に失敗しました',
          });
        }

        return { success: true, message: '担当を解除しました' };
      } catch (error) {
        console.error('tRPC kounyu.removeAssignment error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '担当解除に失敗しました',
        });
      }
    }),
});
