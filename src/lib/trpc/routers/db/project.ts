/**
 * @file プロジェクト管理に関連するAPIエンドポイント（プロシージャ）を定義するルーターファイルです。
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { getAllRecords, getRecord, createRecord, updateRecord, deleteRecord, executeQuery } from '@src/lib/db/crud/db_CRUD';
import { createProjectsTable } from '@src/lib/db/crud/db_advanced';
import { Project, ProjectCreateSchema, ProjectUpdateSchema, ProjectGetAllSchema, ProjectSearchSchema } from '@src/types/project';
import { GetRecode, GetConditionData } from '@src/lib/db/crud/db_GetData';
import { getProjectMembers } from '@src/lib/db/queries/projectMemberQueries';
import { runProjectIdSubMigration } from '@src/lib/db/migrations/add_project_id_sub_column';

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
    .input(ProjectGetAllSchema)
    .query(async ({ input }) => {
      try {
        await createProjectsTable(); // テーブル作成を試行
        const limit = input?.limit || 20;
        const offset = input?.offset || 0;
        
        const result = await getAllRecords<Project>(
          'projects',
          `SELECT * FROM projects LIMIT ${limit} OFFSET ${offset}`,
        );
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'プロジェクト一覧の取得に失敗しました',
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
      ID: z.number().int().positive(),
    }))
    .query(async ({ input }) => {
      try {
        await createProjectsTable(); // テーブル作成を試行
        const result = await getRecord<Project>('projects', input.ID, 'ID');
        
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error?.message || `プロジェクトID ${input.ID} が見つかりません`,
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
        await createProjectsTable(); // テーブル作成を試行
        const { limit, offset, ...filters } = input;
        
        // 検索条件を構築
        const conditions: string[] = [];
        const params: any[] = [];
        
        if (filters.プロジェクト名) {
          conditions.push("プロジェクト名 LIKE ?");
          params.push(`%${filters.プロジェクト名}%`);
        }
        
        if (filters.プロジェクトステータスID !== undefined) {
          conditions.push("プロジェクトステータスID = ?");
          params.push(filters.プロジェクトステータスID);
        }
        
        if (filters.クライアント名ID !== undefined) {
          conditions.push("クライアント名ID = ?");
          params.push(filters.クライアント名ID);
        }
        
        const whereClause = conditions.length > 0 ? conditions.join(' AND ') : '1=1';
        const query = `SELECT * FROM projects WHERE ${whereClause} LIMIT ${limit} OFFSET ${offset}`;
        
        const result = await getAllRecords<Project>(
          'projects',
          query,
          params
        );
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'プロジェクト検索に失敗しました',
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
        await createProjectsTable(); // テーブル作成を試行
        const result = await createRecord<Omit<Project, 'ID'>>('projects', input);
        
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
      ID: z.number().int().positive(),
      data: ProjectUpdateSchema,
    }))
    .mutation(async ({ input }) => {
      try {
        await createProjectsTable(); // テーブル作成を試行
        const result = await updateRecord<Project>('projects', input.ID, input.data, 'ID');
        
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error?.message || `プロジェクトID ${input.ID} の更新に失敗しました`,
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
    .input(z.object({ ID: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      try {
        await createProjectsTable(); // テーブル作成を試行
        const result = await deleteRecord('projects', input.ID, 'ID');
        
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error?.message || `プロジェクトID ${input.ID} の削除に失敗しました`,
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
        await createProjectsTable(); // テーブル作成を試行
        // 全プロジェクト数
        const totalResult = await getAllRecords<{ count: number }[]>(
          'projects',
          'SELECT COUNT(*) as count FROM projects',
        );
        
        // ステータス別の集計
        const statusResult = await getAllRecords<{ プロジェクトステータスID: number; count: number }[]>(
          'projects',
          'SELECT プロジェクトステータスID, COUNT(*) as count FROM projects GROUP BY プロジェクトステータスID',
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
              if (item.プロジェクトステータスID !== undefined) {
                acc[item.プロジェクトステータスID] = item.count;
              }
              return acc;
            }, {} as Record<number, number>)
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
      プロジェクトID: z.string().min(1, 'プロジェクトIDは必須です'),
    }))
    .query(async ({ input }) => {
      try {
        await createProjectsTable(); // テーブル作成を試行
        const result = await getProjectMembers(input.プロジェクトID);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'プロジェクトメンバーの取得に失敗しました',
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
      プロジェクトID: z.string().min(1, 'プロジェクトIDは必須です'),
      ユーザーID: z.string().min(1, 'ユーザーIDは必須です'),
      役割: z.string().min(1, '役割は必須です'),
    }))
    .mutation(async ({ input }) => {
      try {
        await createProjectsTable(); // テーブル作成を試行
        const result = await createRecord('PROJECT_MEMBER', {
          PROJECT_ID: input.プロジェクトID,
          USER_ID: input.ユーザーID,
          ROLE: input.役割,
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
      プロジェクトID: z.string().min(1, 'プロジェクトIDは必須です'),
      ユーザーID: z.string().min(1, 'ユーザーIDは必須です'),
    }))
    .mutation(async ({ input }) => {
      try {
        await createProjectsTable(); // テーブル作成を試行
        // PROJECT_IDとUSER_IDの両方でレコードを特定して削除する必要があるため、executeQueryを使用します
        const result = await executeQuery(
          'DELETE FROM PROJECT_MEMBER WHERE PROJECT_ID = ? AND USER_ID = ?',
          [input.プロジェクトID, input.ユーザーID]
        );
        
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error?.message || 'メンバーが見つからないか、削除に失敗しました',
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
        await createProjectsTable(); // テーブル作成を試行
        const result = await runProjectIdSubMigration();

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'カラム追加に失敗しました',
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
