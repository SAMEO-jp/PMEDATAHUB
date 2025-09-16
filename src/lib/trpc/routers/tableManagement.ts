import { GetAllTables, DeleteTable } from '@src/lib/db/crud/db_DeleteTable';
import { DeleteMultipleTablesSchema, DeleteTableSchema } from '@src/types/tableManagement';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '../trpc';

export const tableManagementRouter = createTRPCRouter({
  // テーブル一覧を取得
  getAll: publicProcedure
    .query(async () => {
      try {
        const result = await GetAllTables();
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'テーブル一覧の取得に失敗しました',
          });
        }
        
        // テーブル名をTableInfo形式に変換
        const tableInfos = result.data?.map((tableName, index) => ({
          id: `table_${index}`,
          name: tableName,
          created_at: new Date().toISOString(), // 実際の実装ではDBから取得
          updated_at: new Date().toISOString(),
        })) || [];
        
        return { 
          success: true, 
          data: tableInfos 
        };
      } catch (error) {
        console.error("tRPC tableManagement.getAll error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'テーブル一覧の取得に失敗しました',
        });
      }
    }),

  // 単一テーブルを削除
  delete: publicProcedure
    .input(DeleteTableSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await DeleteTable(input.tableName);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'テーブルの削除に失敗しました',
          });
        }
        
        return { 
          success: true, 
          data: { deletedTable: input.tableName } 
        };
      } catch (error) {
        console.error("tRPC tableManagement.delete error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'テーブルの削除に失敗しました',
        });
      }
    }),

  // 複数テーブルを一括削除
  deleteMultiple: publicProcedure
    .input(DeleteMultipleTablesSchema)
    .mutation(async ({ input }) => {
      try {
        const deletedTables: string[] = [];
        const failedTables: string[] = [];
        
        // 各テーブルを順次削除
        for (const tableName of input.tableNames) {
          const result = await DeleteTable(tableName);
          
          if (result.success) {
            deletedTables.push(tableName);
          } else {
            failedTables.push(tableName);
          }
        }
        
        // 一部失敗した場合
        if (failedTables.length > 0) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `以下のテーブルの削除に失敗しました: ${failedTables.join(', ')}`,
          });
        }
        
        return { 
          success: true, 
          data: { deletedTables } 
        };
      } catch (error) {
        console.error("tRPC tableManagement.deleteMultiple error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'テーブルの一括削除に失敗しました',
        });
      }
    }),

  // テーブル情報を取得（詳細情報）
  getTableInfo: publicProcedure
    .input(z.object({ tableName: z.string().min(1, 'テーブル名は必須です') }))
    .query(async ({ input }) => {
      try {
        // テーブルが存在するかチェック
        const allTablesResult = await GetAllTables();
        
        if (!allTablesResult.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'テーブル一覧の取得に失敗しました',
          });
        }
        
        const tableExists = allTablesResult.data?.includes(input.tableName);
        
        if (!tableExists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `テーブル '${input.tableName}' が見つかりません`,
          });
        }
        
        return { 
          success: true, 
          data: { 
            name: input.tableName,
            exists: true,
            // 実際の実装ではテーブルの詳細情報（カラム数、レコード数など）を取得
          } 
        };
      } catch (error) {
        console.error("tRPC tableManagement.getTableInfo error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'テーブル情報の取得に失敗しました',
        });
      }
    }),
}); 