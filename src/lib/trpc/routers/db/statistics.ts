/**
 * @file データベース統計情報に関連するAPIエンドポイント（プロシージャ）を定義するルーターファイルです。
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { getDatabaseStats } from '../../../db/crud/db_advanced';

// 統計情報取得のスキーマ
export const DatabaseStatsSchema = z.object({
  period: z.enum(['day', 'week', 'month', 'year']).default('month'),
});

// テーブルサイズ取得のスキーマ
export const TableSizesSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['name', 'size', 'records']).default('size'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// 成長率分析のスキーマ
export const GrowthRatesSchema = z.object({
  tableName: z.string().optional(),
  period: z.enum(['week', 'month', 'quarter', 'year']).default('month'),
  limit: z.number().min(1).max(50).default(10),
});

/**
 * データベース統計情報関連のプロシージャをまとめたルーター。
 */
export const statisticsRouter = createTRPCRouter({
  /**
   * データベース全体の統計情報を取得するプロシージャ。
   */
  getDatabaseStats: publicProcedure
    .input(DatabaseStatsSchema)
    .query(async ({ input }) => {
      try {
        const result = await getDatabaseStats();
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'データベース統計の取得に失敗しました',
          });
        }
        return { success: true, data: { ...result.data, period: input.period } };
      } catch (error) {
        console.error("tRPC statistics.getDatabaseStats error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'データベース統計の取得に失敗しました',
        });
      }
    }),

  /**
   * テーブル別のサイズ情報を取得するプロシージャ。
   */
  getTableSizes: publicProcedure
    .input(TableSizesSchema)
    .query(async ({ input }) => {
      try {
        // TODO: DAL層のgetTableSizes()を実装後に置き換え
        // const result = await getTableSizes(input);

        // 一時的なモックデータ
        const mockTableSizes = [
          {
            name: 'BOM_BUHIN',
            records: 15420,
            dataSize: '8.7 MB',
            indexSize: '1.2 MB',
            totalSize: '9.9 MB',
            averageRecordSize: '0.64 KB',
            lastUpdated: '2025-01-15'
          },
          {
            name: 'PALET_MASTER',
            records: 3420,
            dataSize: '4.2 MB',
            indexSize: '0.6 MB',
            totalSize: '4.8 MB',
            averageRecordSize: '1.23 KB',
            lastUpdated: '2025-01-13'
          },
          {
            name: 'business_achievements',
            records: 5670,
            dataSize: '3.1 MB',
            indexSize: '0.4 MB',
            totalSize: '3.5 MB',
            averageRecordSize: '0.55 KB',
            lastUpdated: '2025-01-15'
          },
          {
            name: 'PROJECT',
            records: 1250,
            dataSize: '2.3 MB',
            indexSize: '0.3 MB',
            totalSize: '2.6 MB',
            averageRecordSize: '1.84 KB',
            lastUpdated: '2025-01-15'
          },
          {
            name: 'photos',
            records: 2340,
            dataSize: '12.8 MB',
            indexSize: '0.2 MB',
            totalSize: '13.0 MB',
            averageRecordSize: '5.47 KB',
            lastUpdated: '2025-01-12'
          },
          {
            name: 'USER',
            records: 89,
            dataSize: '156 KB',
            indexSize: '24 KB',
            totalSize: '180 KB',
            averageRecordSize: '1.75 KB',
            lastUpdated: '2025-01-14'
          }
        ];

        // ソート処理
        let sortedTables = [...mockTableSizes];
        switch (input.sortBy) {
          case 'name':
            sortedTables.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'records':
            sortedTables.sort((a, b) => a.records - b.records);
            break;
          case 'size':
          default:
            // サイズでソート（MB単位に変換して比較）
            sortedTables.sort((a, b) => {
              const getSizeInMB = (sizeStr: string) => {
                const num = parseFloat(sizeStr);
                return sizeStr.includes('KB') ? num / 1024 : num;
              };
              return getSizeInMB(a.totalSize) - getSizeInMB(b.totalSize);
            });
        }

        if (input.order === 'desc') {
          sortedTables.reverse();
        }

        const paginatedTables = sortedTables.slice(0, input.limit);

        return {
          success: true,
          data: {
            tables: paginatedTables,
            total: mockTableSizes.length,
            sortBy: input.sortBy,
            order: input.order,
            summary: {
              totalTables: mockTableSizes.length,
              totalRecords: mockTableSizes.reduce((sum, table) => sum + table.records, 0),
              totalDataSize: '31.3 MB',
              totalIndexSize: '2.7 MB'
            }
          }
        };
      } catch (error) {
        console.error("tRPC statistics.getTableSizes error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'テーブルサイズ情報の取得に失敗しました',
        });
      }
    }),

  /**
   * データベースの成長率を分析するプロシージャ。
   */
  getGrowthRates: publicProcedure
    .input(GrowthRatesSchema)
    .query(async ({ input }) => {
      try {
        // TODO: DAL層のgetGrowthRates()を実装後に置き換え
        // const result = await getGrowthRates(input);

        // 一時的なモックデータ
        return {
          success: true,
          data: {
            period: input.period,
            tableName: input.tableName,
            growthData: [
              {
                tableName: 'BOM_BUHIN',
                currentRecords: 15420,
                previousRecords: 14890,
                recordGrowth: '+3.6%',
                currentSize: '8.7 MB',
                previousSize: '8.4 MB',
                sizeGrowth: '+3.6%',
                growthRate: 530,
                trend: 'increasing'
              },
              {
                tableName: 'business_achievements',
                currentRecords: 5670,
                previousRecords: 5480,
                recordGrowth: '+3.5%',
                currentSize: '3.1 MB',
                previousSize: '3.0 MB',
                sizeGrowth: '+3.3%',
                growthRate: 190,
                trend: 'increasing'
              },
              {
                tableName: 'PROJECT',
                currentRecords: 1250,
                previousRecords: 1220,
                recordGrowth: '+2.5%',
                currentSize: '2.3 MB',
                previousSize: '2.2 MB',
                sizeGrowth: '+4.5%',
                growthRate: 30,
                trend: 'stable'
              },
              {
                tableName: 'USER',
                currentRecords: 89,
                previousRecords: 85,
                recordGrowth: '+4.7%',
                currentSize: '156 KB',
                previousSize: '149 KB',
                sizeGrowth: '+4.7%',
                growthRate: 4,
                trend: 'increasing'
              },
              {
                tableName: 'photos',
                currentRecords: 2340,
                previousRecords: 2340,
                recordGrowth: '0.0%',
                currentSize: '12.8 MB',
                previousSize: '12.8 MB',
                sizeGrowth: '0.0%',
                growthRate: 0,
                trend: 'stable'
              }
            ],
            summary: {
              totalGrowthRecords: 754,
              averageGrowthRate: '+2.8%',
              fastestGrowingTable: 'USER',
              slowestGrowingTable: 'photos',
              projectedSizeNextMonth: '91.2 MB'
            }
          }
        };
      } catch (error) {
        console.error("tRPC statistics.getGrowthRates error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '成長率分析に失敗しました',
        });
      }
    }),

  /**
   * パフォーマンス統計を取得するプロシージャ。
   */
  getPerformanceStats: publicProcedure
    .input(DatabaseStatsSchema)
    .query(async ({ input }) => {
      try {
        // TODO: DAL層のgetPerformanceStats()を実装後に置き換え

        // 一時的なモックデータ
        return {
          success: true,
          data: {
            period: input.period,
            queryStats: {
              totalQueries: 2340,
              averageExecutionTime: 0.045,
              slowestQuery: {
                query: 'SELECT * FROM BOM_BUHIN JOIN PROJECT ON ...',
                executionTime: 2.345,
                executedAt: '2025-01-15 14:22:00'
              },
              fastestQuery: {
                query: 'SELECT COUNT(*) FROM USER',
                executionTime: 0.001,
                executedAt: '2025-01-15 15:10:00'
              },
              queryDistribution: {
                select: 1980,
                insert: 180,
                update: 150,
                delete: 30
              }
            },
            indexStats: {
              totalIndexes: 42,
              unusedIndexes: 3,
              mostUsedIndex: {
                name: 'idx_project_status',
                tableName: 'PROJECT',
                usage: 345
              },
              indexEfficiency: '94.2%'
            },
            cacheStats: {
              hitRate: '87.3%',
              cacheSize: '16 MB',
              missCount: 156
            },
            connectionStats: {
              activeConnections: 12,
              maxConnections: 100,
              averageConnectionTime: '00:05:32'
            }
          }
        };
      } catch (error) {
        console.error("tRPC statistics.getPerformanceStats error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'パフォーマンス統計の取得に失敗しました',
        });
      }
    }),
});