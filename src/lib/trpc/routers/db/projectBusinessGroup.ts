import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { getAllRecords, getRecord, createRecord, updateRecord, deleteRecord } from '@src/lib/db/crud/db_CRUD';
import { createProjectBusinessGroupTable } from '@src/lib/db/crud/db_advanced';
import { ProjectBusinessGroup, ProjectBusinessGroupCreateSchema, ProjectBusinessGroupUpdateSchema, ProjectBusinessGroupGetAllSchema, ProjectBusinessGroupSearchSchema } from '@src/types/projectBusinessGroup';

/**
 * プロジェクト業務グループに関連するAPIエンドポイント（プロシージャ）を定義するルーターファイルです。
 */
export const projectBusinessGroupRouter = createTRPCRouter({
  /**
   * 全てのプロジェクト業務グループを取得するプロシージャ。
   */
  getAll: publicProcedure
    .input(ProjectBusinessGroupGetAllSchema)
    .query(async ({ input }) => {
      try {
        await createProjectBusinessGroupTable(); // テーブル作成を試行
        const limit = input?.limit || 20;
        const offset = input?.offset || 0;
        
        const result = await getAllRecords<ProjectBusinessGroup>(
          'プロジェクト業務グループ',
          `SELECT * FROM プロジェクト業務グループ LIMIT ${limit} OFFSET ${offset}`,
        );
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'プロジェクト業務グループ一覧の取得に失敗しました',
          });
        }
        
        return { success: true, data: result.data || [] };
      } catch (error) {
        console.error("tRPC projectBusinessGroup.getAll error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'プロジェクト業務グループ一覧の取得に失敗しました',
        });
      }
    }),

  /**
   * IDを指定してプロジェクト業務グループを取得するプロシージャ。
   */
  getById: publicProcedure
    .input(z.object({
      ID: z.number().int().positive(),
    }))
    .query(async ({ input }) => {
      try {
        await createProjectBusinessGroupTable(); // テーブル作成を試行
        const result = await getRecord<ProjectBusinessGroup>('プロジェクト業務グループ', input.ID, 'ID');
        
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error?.message || `プロジェクト業務グループID ${input.ID} が見つかりません`,
          });
        }
        
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC projectBusinessGroup.getById error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'プロジェクト業務グループの取得に失敗しました',
        });
      }
    }),

  /**
   * 新しいプロジェクト業務グループを作成するプロシージャ。
   */
  create: publicProcedure
    .input(ProjectBusinessGroupCreateSchema)
    .mutation(async ({ input }) => {
      try {
        await createProjectBusinessGroupTable(); // テーブル作成を試行
        const result = await createRecord<Omit<ProjectBusinessGroup, 'ID'>>('プロジェクト業務グループ', input);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'プロジェクト業務グループの作成に失敗しました',
          });
        }
        
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC projectBusinessGroup.create error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'プロジェクト業務グループの作成に失敗しました',
        });
      }
    }),

  /**
   * プロジェクト業務グループを更新するプロシージャ。
   */
  update: publicProcedure
    .input(z.object({
      ID: z.number().int().positive(),
      data: ProjectBusinessGroupUpdateSchema,
    }))
    .mutation(async ({ input }) => {
      try {
        await createProjectBusinessGroupTable(); // テーブル作成を試行
        const result = await updateRecord<ProjectBusinessGroup>('プロジェクト業務グループ', input.ID, input.data, 'ID');
        
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error?.message || `プロジェクト業務グループID ${input.ID} の更新に失敗しました`,
          });
        }
        
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC projectBusinessGroup.update error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'プロジェクト業務グループの更新に失敗しました',
        });
      }
    }),

  /**
   * プロジェクト業務グループを削除するプロシージャ。
   */
  delete: publicProcedure
    .input(z.object({ ID: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      try {
        await createProjectBusinessGroupTable(); // テーブル作成を試行
        const result = await deleteRecord('プロジェクト業務グループ', input.ID, 'ID');
        
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error?.message || `プロジェクト業務グループID ${input.ID} の削除に失敗しました`,
          });
        }
        
        return { success: true, data: null };
      } catch (error) {
        console.error("tRPC projectBusinessGroup.delete error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'プロジェクト業務グループの削除に失敗しました',
        });
      }
    }),

  /**
   * 条件を指定してプロジェクト業務グループを検索するプロシージャ（ページネーション対応）。
   */
  search: publicProcedure
    .input(ProjectBusinessGroupSearchSchema)
    .query(async ({ input }) => {
      try {
        await createProjectBusinessGroupTable(); // テーブル作成を試行
        const { limit, offset, ...filters } = input;
        
        const conditions: string[] = [];
        const params: any[] = [];
        
        if (filters.プロジェクトID) {
          conditions.push("プロジェクトID = ?");
          params.push(filters.プロジェクトID);
        }
        if (filters.業務種類ID !== undefined) {
          conditions.push("業務種類ID = ?");
          params.push(filters.業務種類ID);
        }
        if (filters.業務種類ID_2 !== undefined) {
          conditions.push("業務種類ID_2 = ?");
          params.push(filters.業務種類ID_2);
        }
        if (filters.ステータス) {
          conditions.push("ステータス = ?");
          params.push(filters.ステータス);
        }
        
        const whereClause = conditions.length > 0 ? conditions.join(' AND ') : '1=1';
        const query = `SELECT * FROM プロジェクト業務グループ WHERE ${whereClause} LIMIT ${limit} OFFSET ${offset}`;
        
        const result = await getAllRecords<ProjectBusinessGroup>(
          'プロジェクト業務グループ',
          query,
          params
        );
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'プロジェクト業務グループの検索に失敗しました',
          });
        }
        
        return { success: true, data: result.data || [] };
      } catch (error) {
        console.error("tRPC projectBusinessGroup.search error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'プロジェクト業務グループの検索に失敗しました',
        });
      }
    }),
});
