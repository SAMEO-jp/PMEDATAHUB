// ==========================================
// テーブル管理用tRPCルーター
// ==========================================

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { getAllTables, getTableInfo, deleteTable, type TableInfo } from '@src/lib/db/db_GetData';



/**
 * テーブル管理関連のプロシージャをまとめたルーター
 */
export const tableManagementRouter = createTRPCRouter({
  /**
   * 全てのテーブル一覧を取得するプロシージャ
   */
  getAllTables: publicProcedure
    .query(async () => {
      try {
        // DAL層を使用したテーブル一覧取得
        const result = await getAllTables();
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'テーブル一覧の取得に失敗しました',
          });
        }
        
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC tableManagement.getAllTables error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'テーブル一覧の取得に失敗しました',
        });
      }
    }),

  /**
   * 特定のテーブル情報を取得するプロシージャ
   */
  getTableInfo: publicProcedure
    .input(z.object({ tableName: z.string() }))
    .query(async ({ input }) => {
      try {
        const result = await getTableInfo(input.tableName);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error || 'テーブルが見つかりません',
          });
        }
        
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC tableManagement.getTableInfo error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'テーブル情報の取得に失敗しました',
        });
      }
    }),

  /**
   * テーブルを検索するプロシージャ
   */
  searchTables: publicProcedure
    .input(z.object({
      searchTerm: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }))
    .query(async ({ input }) => {
      try {
        // 全テーブルを取得してからフィルタリング
        const result = await getAllTables();
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'テーブル一覧の取得に失敗しました',
          });
        }

        let filteredTables = result.data || [];

        // 検索語によるフィルタリング
        if (input.searchTerm) {
          const searchLower = input.searchTerm.toLowerCase();
          filteredTables = filteredTables.filter((table: TableInfo) =>
            table.name.toLowerCase().includes(searchLower) ||
            table.description.toLowerCase().includes(searchLower)
          );
        }

        // タグによるフィルタリング
        if (input.tags && input.tags.length > 0) {
          filteredTables = filteredTables.filter((table: TableInfo) =>
            input.tags!.some(tag => table.tags.includes(tag))
          );
        }
        
        return { success: true, data: filteredTables };
      } catch (error) {
        console.error("tRPC tableManagement.searchTables error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'テーブル検索に失敗しました',
        });
      }
    }),

  /**
   * テーブルを削除するプロシージャ
   */
  deleteTable: publicProcedure
    .input(z.object({ tableName: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const result = await deleteTable(input.tableName);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: result.error || 'テーブルの削除に失敗しました',
          });
        }
        
        return { success: true, message: `テーブル '${input.tableName}' を削除しました` };
      } catch (error) {
        console.error("tRPC tableManagement.deleteTable error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'テーブルの削除に失敗しました',
        });
      }
    }),
}); 