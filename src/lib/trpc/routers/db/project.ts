/**
 * @file プロジェクト管理に関連するAPIエンドポイント（プロシージャ）を定義するルーターファイルです。
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { GetRecode, GetConditionData } from '@src/lib/db/crud/db_GetData';
import { createRecord, updateRecord, deleteRecord } from '@src/lib/db/crud/db_CRUD';
import { getProjectMembers } from '@src/lib/db/queries/projectMemberQueries';
import { runProjectIdSubMigration } from '@src/lib/db/migrations/add_project_id_sub_column';
import type { Project } from '@src/types/db_project';

// プロジェクト作成用のスキーマ
const ProjectCreateSchema = z.object({
  PROJECT_ID: z.string().min(1, 'プロジェクトIDは必須です'),
  PROJECT_ID_SUB: z.string().optional(),
  PROJECT_NAME: z.string().min(1, 'プロジェクト名は必須です'),
  PROJECT_STATUS: z.enum(['active', 'completed', 'archived']).default('active'),
  PROJECT_CLIENT_NAME: z.string().optional(),
  PROJECT_START_DATE: z.string().optional(),
  PROJECT_START_ENDDATE: z.string().optional(),
  PROJECT_DESCRIPTION: z.string().optional(),
});

// プロジェクト更新用のスキーマ
const ProjectUpdateSchema = z.object({
  PROJECT_ID_SUB: z.string().optional(),
  PROJECT_NAME: z.string().min(1, 'プロジェクト名は必須です').optional(),
  PROJECT_STATUS: z.enum(['active', 'completed', 'archived']).optional(),
  PROJECT_CLIENT_NAME: z.string().optional(),
  PROJECT_START_DATE: z.string().optional(),
  PROJECT_START_ENDDATE: z.string().optional(),
  PROJECT_DESCRIPTION: z.string().optional(),
});

// プロジェクト検索用のスキーマ
const ProjectSearchSchema = z.object({
  PROJECT_NAME: z.string().optional(),
  PROJECT_STATUS: z.enum(['active', 'completed', 'archived']).optional(),
  PROJECT_CLIENT_NAME: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

/**
 * プロジェクト関連のプロシージャをまとめたルーター。
 * `createTRPCRouter` を使って定義します。
 * ここで定義されたプロシージャは `trpc.project.getAll` のようにクライアントから呼び出されます。
 */
export const projectRouter = createTRPCRouter({
  /**
   * 全てのプロジェクトを取得するプロシージャ（ページネーション対応）。
   * .query() を使用するため、これはデータを取得する（読み取り）操作です。
   */
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(async ({ input }) => {
      try {
        const limit = input?.limit || 20;
        const offset = input?.offset || 0;
        
        const result = await GetConditionData<Project[]>(
          '1=1',
          [],
          { 
            tableName: 'PROJECT', 
            idColumn: 'PROJECT_ID',
            limit,
            offset
          }
        );
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: typeof result.error === 'string' ? result.error : 'プロジェクト一覧の取得に失敗しました',
          });
        }
        
        return { success: true, data: result.data || [] };
      } catch (error) {
        console.error("tRPC project.getAll error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'プロジェクト一覧の取得に失敗しました',
        });
      }
    }),

  /**
   * 指定されたIDのプロジェクトを取得するプロシージャ。
   */
  getById: publicProcedure
    .input(z.object({
      project_id: z.string().min(1, 'プロジェクトIDは必須です'),
    }))
    .query(async ({ input }) => {
      try {
        const result = await GetRecode<Project>(input.project_id, {
          tableName: 'PROJECT',
          idColumn: 'PROJECT_ID'
        });
        
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error || 'プロジェクトが見つかりません',
          });
        }
        
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC project.getById error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'プロジェクトの取得に失敗しました',
        });
      }
    }),

  /**
   * 条件を指定してプロジェクトを検索するプロシージャ（ページネーション対応）。
   */
  search: publicProcedure
    .input(ProjectSearchSchema)
    .query(async ({ input }) => {
      try {
        const { limit, offset, ...filters } = input;
        
        // 検索条件を構築
        const conditions: string[] = [];
        const params: any[] = [];
        
        if (filters.PROJECT_NAME) {
          conditions.push('PROJECT_NAME LIKE ?');
          params.push(`%${filters.PROJECT_NAME}%`);
        }
        
        if (filters.PROJECT_STATUS) {
          conditions.push('PROJECT_STATUS = ?');
          params.push(filters.PROJECT_STATUS);
        }
        
        if (filters.PROJECT_CLIENT_NAME) {
          conditions.push('PROJECT_CLIENT_NAME LIKE ?');
          params.push(`%${filters.PROJECT_CLIENT_NAME}%`);
        }
        
        const whereClause = conditions.length > 0 ? conditions.join(' AND ') : '1=1';
        
        const result = await GetConditionData<Project[]>(
          whereClause,
          params,
          { 
            tableName: 'PROJECT', 
            idColumn: 'PROJECT_ID',
            limit,
            offset
          }
        );
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'プロジェクト検索に失敗しました',
          });
        }
        
        return { success: true, data: result.data || [] };
      } catch (error) {
        console.error("tRPC project.search error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'プロジェクト検索に失敗しました',
        });
      }
    }),

  /**
   * 新しいプロジェクトを作成するプロシージャ。
   * .mutation() を使用するため、これはデータを変更する（書き込み）操作です。
   */
  create: publicProcedure
    .input(ProjectCreateSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await createRecord('PROJECT', input);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'プロジェクトの作成に失敗しました',
          });
        }
        
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC project.create error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'プロジェクトの作成に失敗しました',
        });
      }
    }),

  /**
   * プロジェクトを更新するプロシージャ。
   */
  update: publicProcedure
    .input(z.object({
      project_id: z.string().min(1, 'プロジェクトIDは必須です'),
      data: ProjectUpdateSchema,
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await updateRecord('PROJECT', input.project_id as any, input.data, 'PROJECT_ID');
        
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error?.message || 'プロジェクトが見つからないか、更新に失敗しました',
          });
        }
        
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC project.update error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'プロジェクトの更新に失敗しました',
        });
      }
    }),

  /**
   * プロジェクトを削除するプロシージャ。
   */
  delete: publicProcedure
    .input(z.object({
      project_id: z.string().min(1, 'プロジェクトIDは必須です'),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await deleteRecord('PROJECT', input.project_id as any, 'PROJECT_ID');
        
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error?.message || 'プロジェクトが見つかりません',
          });
        }
        
        return { success: true, data: null };
      } catch (error) {
        console.error("tRPC project.delete error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'プロジェクトの削除に失敗しました',
        });
      }
    }),

  /**
   * プロジェクトの統計情報を取得するプロシージャ。
   */
  getStats: publicProcedure
    .query(async () => {
      try {
        // 全プロジェクト数
        const totalResult = await GetConditionData<{ count: number }[]>(
          '1=1',
          [],
          { 
            tableName: 'PROJECT', 
            idColumn: 'PROJECT_ID',
            select: 'COUNT(*) as count'
          }
        );
        
        // ステータス別の集計
        const statusResult = await GetConditionData<{ PROJECT_STATUS: string; count: number }[]>(
          '1=1',
          [],
          { 
            tableName: 'PROJECT', 
            idColumn: 'PROJECT_ID',
            select: 'PROJECT_STATUS, COUNT(*) as count',
            groupBy: 'PROJECT_STATUS'
          }
        );
        
        if (!totalResult.success || !statusResult.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: '統計情報の取得に失敗しました',
          });
        }
        
        const totalCount = totalResult.data?.[0]?.count || 0;
        const statusCounts = statusResult.data || [];
        
        return { 
          success: true, 
          data: {
            totalCount,
            statusCounts: statusCounts.reduce((acc, item) => {
              acc[item.PROJECT_STATUS] = item.count;
              return acc;
            }, {} as Record<string, number>)
          }
        };
      } catch (error) {
        console.error("tRPC project.getStats error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '統計情報の取得に失敗しました',
        });
      }
    }),

  /**
   * プロジェクトメンバーを取得するプロシージャ。
   */
  getMembers: publicProcedure
    .input(z.object({
      project_id: z.string().min(1, 'プロジェクトIDは必須です'),
    }))
    .query(async ({ input }) => {
      try {
        const result = await getProjectMembers(input.project_id);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'プロジェクトメンバーの取得に失敗しました',
          });
        }
        
        return { success: true, data: result.data || [] };
      } catch (error) {
        console.error("tRPC project.getMembers error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'プロジェクトメンバーの取得に失敗しました',
        });
      }
    }),

  /**
   * プロジェクトにメンバーを追加するプロシージャ。
   */
  addMember: publicProcedure
    .input(z.object({
      project_id: z.string().min(1, 'プロジェクトIDは必須です'),
      user_id: z.string().min(1, 'ユーザーIDは必須です'),
      role: z.string().min(1, '役割は必須です'),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await createRecord('PROJECT_MEMBER', {
          PROJECT_ID: input.project_id,
          USER_ID: input.user_id,
          ROLE: input.role,
        });
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'メンバーの追加に失敗しました',
          });
        }
        
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC project.addMember error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'メンバーの追加に失敗しました',
        });
      }
    }),

  /**
   * プロジェクトからメンバーを削除するプロシージャ。
   */
  removeMember: publicProcedure
    .input(z.object({
      project_id: z.string().min(1, 'プロジェクトIDは必須です'),
      user_id: z.string().min(1, 'ユーザーIDは必須です'),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await deleteRecord('PROJECT_MEMBER', input.user_id as any, 'USER_ID');
        
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error?.message || 'メンバーが見つかりません',
          });
        }
        
        return { success: true, data: null };
      } catch (error) {
        console.error("tRPC project.removeMember error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'メンバーの削除に失敗しました',
        });
      }
    }),

  /**
   * PROJECT_ID_SUBカラムを追加
   */
  addProjectIdSubColumn: publicProcedure
    .mutation(async () => {
      try {
        const result = await runProjectIdSubMigration();

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'カラム追加に失敗しました',
          });
        }

        return { success: true, message: 'PROJECT_ID_SUBカラムの追加が完了しました' };
      } catch (error) {
        console.error('tRPC project.addProjectIdSubColumn error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'カラム追加に失敗しました',
        });
      }
    }),
});
