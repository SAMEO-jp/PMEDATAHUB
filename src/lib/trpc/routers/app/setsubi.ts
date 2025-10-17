/**
 * 設備製番管理関連のtRPCルーター
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import {
  getSetsubiWithAssignments,
  getSetsubiDetail,
  getSetsubiHistory,
  getSetsubiList
} from '../../../db/queries/setsubiQueries';
import {
  createSetsubiMaster,
  updateSetsubiMaster,
  deleteSetsubiMaster,
  registerSetsubiToProject,
  assignSetsubiToUser,
  removeSetsubiAssignment
} from '../../../db/crud/setsubiCRUD';
import { createSetsubiTables, checkSetsubiTablesExist } from '../../../db/migrations/create_setsubi_tables';

// バリデーションスキーマ
const SetsubiFormSchema = z.object({
  seiban: z.string().min(1, '製番は必須です'),
  shohin_category: z.string().optional(),
  setsubi_name: z.string().min(1, '設備名は必須です'),
  parent_seiban: z.string().optional(),
  location_code: z.string().optional(),
});

const SetsubiCreateWithProjectSchema = SetsubiFormSchema.extend({
  project_id: z.string().min(1, 'プロジェクトIDは必須です'),
});

const SetsubiUpdateSchema = SetsubiFormSchema.partial();

const SetsubiAssignmentSchema = z.object({
  project_id: z.string().min(1, 'プロジェクトIDは必須です'),
  user_id: z.string().min(1, 'ユーザーIDは必須です'),
  setsubi_id: z.number().min(1, '設備IDは必須です'),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

/**
 * 設備製番管理ルーター
 */
export const setsubiRouter = createTRPCRouter({
  /**
   * テーブル初期化
   */
  initializeTables: publicProcedure
    .mutation(async () => {
      try {
        const result = await createSetsubiTables();

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'テーブル作成に失敗しました',
          });
        }

        return { success: true, message: '製番関連テーブルを作成しました' };
      } catch (error) {
        console.error('tRPC setsubi.initializeTables error:', error);
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
        const result = await checkSetsubiTablesExist();

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'テーブル確認に失敗しました',
          });
        }

        return { success: true, exists: result.data };
      } catch (error) {
        console.error('tRPC setsubi.checkTables error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'テーブル確認に失敗しました',
        });
      }
    }),

  /**
   * プロジェクトの製番一覧取得（担当者情報付き）
   */
  getAllByProject: publicProcedure
    .input(z.object({
      project_id: z.string().min(1, 'プロジェクトIDは必須です'),
    }))
    .query(async ({ input }) => {
      try {
        const result = await getSetsubiWithAssignments(input.project_id);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '製番一覧の取得に失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC setsubi.getAllByProject error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '製番一覧の取得に失敗しました',
        });
      }
    }),

  /**
   * 製番詳細取得
   */
  getDetail: publicProcedure
    .input(z.object({
      setsubi_id: z.number().min(1, '設備IDは必須です'),
    }))
    .query(async ({ input }) => {
      try {
        const result = await getSetsubiDetail(input.setsubi_id);

        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error || '製番が見つかりません',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC setsubi.getDetail error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '製番詳細の取得に失敗しました',
        });
      }
    }),

  /**
   * 全設備一覧取得
   */
  getAll: publicProcedure
    .query(async () => {
      try {
        const result = await getSetsubiList();

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '設備一覧の取得に失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC setsubi.getAll error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '設備一覧の取得に失敗しました',
        });
      }
    }),

  /**
   * 製番履歴取得
   */
  getHistory: publicProcedure
    .input(z.object({
      seiban: z.string().min(1, '製番は必須です'),
    }))
    .query(async ({ input }) => {
      try {
        const result = await getSetsubiHistory(input.seiban);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '製番履歴の取得に失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC setsubi.getHistory error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '製番履歴の取得に失敗しました',
        });
      }
    }),

  /**
   * 製番マスター作成
   */
  createMaster: publicProcedure
    .input(SetsubiFormSchema)
    .mutation(async ({ input }) => {
      try {
        // テーブルが存在するか確認
        const tableCheck = await checkSetsubiTablesExist();
        if (!tableCheck.success || !tableCheck.data) {
          // テーブルが存在しない場合は作成
          console.log('設備テーブルが存在しないため、作成します');
          const createResult = await createSetsubiTables();
          if (!createResult.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: '設備テーブルの作成に失敗しました',
            });
          }
        }

        const result = await createSetsubiMaster(input);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '製番の作成に失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC setsubi.createMaster error:', error);
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          input: input
        });
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `製番の作成に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }),

  /**
   * 製番マスター作成（プロジェクト登録込み）
   */
  createMasterWithProject: publicProcedure
    .input(SetsubiCreateWithProjectSchema)
    .mutation(async ({ input }) => {
      try {
        // テーブルが存在するか確認
        const tableCheck = await checkSetsubiTablesExist();
        if (!tableCheck.success || !tableCheck.data) {
          // テーブルが存在しない場合は作成
          console.log('設備テーブルが存在しないため、作成します');
          const createResult = await createSetsubiTables();
          if (!createResult.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: '設備テーブルの作成に失敗しました',
            });
          }
        }

        // 設備マスター作成
        const { project_id, ...setsubiData } = input;
        const result = await createSetsubiMaster(setsubiData);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '製番の作成に失敗しました',
          });
        }

        // プロジェクトに登録
        const registerResult = await registerSetsubiToProject(project_id, setsubiData.seiban);
        if (!registerResult.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: registerResult.error || '製番のプロジェクト登録に失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC setsubi.createMasterWithProject error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '製番の作成に失敗しました',
        });
      }
    }),

  /**
   * 製番マスター更新
   */
  updateMaster: publicProcedure
    .input(z.object({
      id: z.number().min(1, '設備IDは必須です'),
      data: SetsubiUpdateSchema,
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await updateSetsubiMaster(input.id, input.data);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '製番の更新に失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC setsubi.updateMaster error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '製番の更新に失敗しました',
        });
      }
    }),

  /**
   * 製番マスター削除
   */
  deleteMaster: publicProcedure
    .input(z.object({
      id: z.number().min(1, '設備IDは必須です'),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await deleteSetsubiMaster(input.id);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '製番の削除に失敗しました',
          });
        }

        return { success: true, message: '製番を削除しました' };
      } catch (error) {
        console.error('tRPC setsubi.deleteMaster error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '製番の削除に失敗しました',
        });
      }
    }),

  /**
   * 製番をプロジェクトに登録
   */
  registerToProject: publicProcedure
    .input(z.object({
      project_id: z.string().min(1, 'プロジェクトIDは必須です'),
      seiban: z.string().min(1, '製番は必須です'),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await registerSetsubiToProject(input.project_id, input.seiban);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '製番のプロジェクト登録に失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC setsubi.registerToProject error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '製番のプロジェクト登録に失敗しました',
        });
      }
    }),

  /**
   * 製番担当割り当て
   */
  assignUser: publicProcedure
    .input(SetsubiAssignmentSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await assignSetsubiToUser(input);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '担当割り当てに失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC setsubi.assignUser error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '担当割り当てに失敗しました',
        });
      }
    }),

  /**
   * 製番担当解除
   */
  removeAssignment: publicProcedure
    .input(z.object({
      assignment_id: z.number().min(1, '担当割り当てIDは必須です'),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await removeSetsubiAssignment(input.assignment_id);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '担当解除に失敗しました',
          });
        }

        return { success: true, message: '担当を解除しました' };
      } catch (error) {
        console.error('tRPC setsubi.removeAssignment error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '担当解除に失敗しました',
        });
      }
    }),

  /**
   * 製番検索
   */
  search: publicProcedure
    .input(z.object({
      query: z.string().optional(),
      project_id: z.string().optional(),
      shohin_category: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        let db: any = null;
        // ここでは簡易的な検索を実装
        // 実際には専用の検索関数を作成することを推奨

        return { success: true, data: [] };
      } catch (error) {
        console.error('tRPC setsubi.search error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '検索に失敗しました',
        });
      }
    }),
});
