/**
 * @file テーブル管理に関連するAPIエンドポイント（プロシージャ）を定義するルーターファイルです。
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { getAllTables, getTableDetail, getTableSchema } from '../../../db/crud/db_GetData';

// Zodスキーマ定義
export const TableSchema = z.object({
  name: z.string().min(1, 'テーブル名は必須です'),
  description: z.string().optional(),
});

export const TableSearchSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export const TableDetailSchema = z.object({
  tableName: z.string().min(1, 'テーブル名は必須です'),
});

export const TableDataSchema = z.object({
  tableName: z.string().min(1, 'テーブル名は必須です'),
  limit: z.number().min(1).max(1000).default(50),
  offset: z.number().min(0).default(0),
});

/**
 * テーブル管理関連のプロシージャをまとめたルーター。
 */
export const tableRouter = createTRPCRouter({
  /**
   * 全てのテーブル一覧を取得するプロシージャ。
   */
  getAll: publicProcedure
    .query(async () => {
      try {
        const result = await getAllTables();
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'テーブル一覧の取得に失敗しました',
          });
        }
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC table.getAll error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'テーブル一覧の取得に失敗しました',
        });
      }
    }),

  /**
   * 指定されたテーブルの詳細情報を取得するプロシージャ。
   */
  getById: publicProcedure
    .input(TableDetailSchema)
    .query(async ({ input }) => {
      try {
        const result = await getTableDetail(input.tableName);
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error || 'テーブルが見つかりません',
          });
        }
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC table.getById error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'テーブル詳細の取得に失敗しました',
        });
      }
    }),

  /**
   * テーブルのスキーマ情報を取得するプロシージャ。
   */
  getSchema: publicProcedure
    .input(TableDetailSchema)
    .query(async ({ input }) => {
      try {
        const result = await getTableSchema(input.tableName);
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error || 'テーブルスキーマが見つかりません',
          });
        }
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC table.getSchema error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'テーブルスキーマの取得に失敗しました',
        });
      }
    }),

  /**
   * テーブルのサンプルデータを取得するプロシージャ。
   */
  getData: publicProcedure
    .input(TableDataSchema)
    .query(({ input }) => {
      try {
        // TODO: DAL層のgetTableData()を実装後に置き換え
        // const result = await getTableData(input.tableName, input.limit, input.offset);
        // if (!result.success) {
        //   throw new TRPCError({
        //     code: 'NOT_FOUND',
        //     message: result.error || 'テーブルデータが見つかりません',
        //   });
        // }
        // return { success: true, data: result.data };

        // 一時的なモックデータ
        const mockColumns = [
          { name: 'id', type: 'INTEGER' },
          { name: 'name', type: 'TEXT' },
          { name: 'description', type: 'TEXT' },
          { name: 'created_at', type: 'TEXT' },
        ];

        const mockRows = Array.from({ length: Math.min(input.limit, 10) }, (_, i) => ({
          id: i + 1,
          name: `Sample ${i + 1}`,
          description: `This is sample data ${i + 1}`,
          created_at: new Date().toISOString(),
        }));

        return {
          success: true,
          data: {
            columns: mockColumns,
            rows: mockRows,
            total: 100,
            limit: input.limit,
            offset: input.offset
          }
        };
      } catch (error) {
        console.error("tRPC table.getData error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'テーブルデータの取得に失敗しました',
        });
      }
    }),

  /**
   * テーブルを検索するプロシージャ。
   */
  search: publicProcedure
    .input(TableSearchSchema)
    .query(({ input }) => {
      try {
        // TODO: DAL層のsearchTables()を実装後に置き換え
        // const result = await searchTables(input);
        // if (!result.success) {
        //   throw new TRPCError({
        //     code: 'INTERNAL_SERVER_ERROR',
        //     message: result.error?.message || '検索に失敗しました',
        //   });
        // }
        // return { success: true, data: result.data };

        // 一時的なモックデータ（検索フィルタリング）
        const mockTables = [
          {
            name: 'PROJECT',
            records: 1250,
            size: '2.3 MB',
            lastUpdated: '2025-01-15',
            description: 'プロジェクト基本情報'
          },
          {
            name: 'USER',
            records: 89,
            size: '156 KB',
            lastUpdated: '2025-01-14',
            description: 'ユーザー情報'
          }
        ];

        let filteredTables = mockTables;

        if (input.name) {
          filteredTables = filteredTables.filter(table => 
            table.name.toLowerCase().includes(input.name!.toLowerCase())
          );
        }

        if (input.description) {
          filteredTables = filteredTables.filter(table => 
            table.description.toLowerCase().includes(input.description!.toLowerCase())
          );
        }

        const paginatedTables = filteredTables.slice(input.offset, input.offset + input.limit);

        return {
          success: true,
          data: {
            tables: paginatedTables,
            total: filteredTables.length,
            limit: input.limit,
            offset: input.offset
          }
        };
      } catch (error) {
        console.error("tRPC table.search error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '検索に失敗しました',
        });
      }
    }),

  /**
   * テーブルの統計情報を取得するプロシージャ。
   */
  getStatistics: publicProcedure
    .input(TableDetailSchema)
    .query(({ input }) => {
      try {
        // TODO: DAL層のgetTableStatistics()を実装後に置き換え
        // const result = await getTableStatistics(input.tableName);
        // if (!result.success) {
        //   throw new TRPCError({
        //     code: 'NOT_FOUND',
        //     message: result.error?.message || '統計情報が見つかりません',
        //   });
        // }
        // return { success: true, data: result.data };

        // 一時的なモックデータ
        return {
          success: true,
          data: {
            tableName: input.tableName,
            totalRecords: 1250,
            totalSize: '2.3 MB',
            avgRecordSize: '1.84 KB',
            lastUpdated: '2025-01-15',
            growthRate: '+5.2%',
            indexCount: 3,
            columnCount: 12
          }
        };
      } catch (error) {
        console.error("tRPC table.getStatistics error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '統計情報の取得に失敗しました',
        });
      }
    }),
});