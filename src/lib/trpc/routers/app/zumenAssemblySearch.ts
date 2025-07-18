/**
 * @file 図面番号で組立図としてデータを登録している図面を逆に調べるAPI
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { GetConditionData } from '@src/lib/db/db_GetData';
import type { BomZumen } from '@src/types/db_bom';
import { createTRPCRouter, publicProcedure } from '../../trpc';

// ==========================================
// Zodスキーマ
// ==========================================
const ZumenAssemblySearchSchema = z.object({
  zumenId: z.string().min(1, '図面番号は必須です'),
});

// ==========================================
// 型定義
// ==========================================
export interface AssemblySearchResult {
  assemblyZumen: BomZumen[];
  totalCount: number;
}

/**
 * 図面番号で組立図としてデータを登録している図面を逆に調べるルーター
 */
export const zumenAssemblySearchRouter = createTRPCRouter({
  /**
   * 指定された図面番号を組立図として登録している図面を検索
   */
  searchByZumenId: publicProcedure
    .input(ZumenAssemblySearchSchema)
    .query(async ({ input }) => {
      try {
        // Kumitate_Zumenフィールドに指定された図面番号が含まれている図面を検索
        const result = await GetConditionData<BomZumen[]>(
          'Kumitate_Zumen LIKE ?',
          [`%${input.zumenId}%`],
          {
            tableName: 'BOM_ZUMEN',
            idColumn: 'ROWID'
          }
        );

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'データの取得に失敗しました',
          });
        }

        const assemblyZumen = result.data || [];
        
        return {
          success: true,
          data: {
            assemblyZumen,
            totalCount: assemblyZumen.length
          } as AssemblySearchResult
        };
      } catch (error) {
        console.error('tRPC zumenAssemblySearch.searchByZumenId error:', error);
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '組立図検索に失敗しました',
        });
      }
    }),

  /**
   * 指定された図面番号を組立図として登録している図面を詳細検索（セミコロン区切りで完全一致）
   */
  searchExactByZumenId: publicProcedure
    .input(ZumenAssemblySearchSchema)
    .query(async ({ input }) => {
      try {
        // Kumitate_Zumenフィールドでセミコロン区切りの完全一致を検索
        const result = await GetConditionData<BomZumen[]>(
          'Kumitate_Zumen LIKE ? OR Kumitate_Zumen LIKE ? OR Kumitate_Zumen = ?',
          [
            `${input.zumenId};%`,  // 先頭に一致
            `%;${input.zumenId};%`, // 中間に一致
            input.zumenId          // 完全一致
          ],
          {
            tableName: 'BOM_ZUMEN',
            idColumn: 'ROWID'
          }
        );

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'データの取得に失敗しました',
          });
        }

        const assemblyZumen = result.data || [];
        
        return {
          success: true,
          data: {
            assemblyZumen,
            totalCount: assemblyZumen.length
          } as AssemblySearchResult
        };
      } catch (error) {
        console.error('tRPC zumenAssemblySearch.searchExactByZumenId error:', error);
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '組立図詳細検索に失敗しました',
        });
      }
    }),

  /**
   * 指定された図面番号を組立図として登録している図面を検索（プロジェクトID指定）
   */
  searchByZumenIdAndProject: publicProcedure
    .input(z.object({
      zumenId: z.string().min(1, '図面番号は必須です'),
      projectId: z.string().min(1, 'プロジェクトIDは必須です'),
    }))
    .query(async ({ input }) => {
      try {
        // プロジェクトIDと図面番号の両方で検索
        const result = await GetConditionData<BomZumen[]>(
          'project_ID = ? AND Kumitate_Zumen LIKE ?',
          [input.projectId, `%${input.zumenId}%`],
          {
            tableName: 'BOM_ZUMEN',
            idColumn: 'ROWID'
          }
        );

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'データの取得に失敗しました',
          });
        }

        const assemblyZumen = result.data || [];
        
        return {
          success: true,
          data: {
            assemblyZumen,
            totalCount: assemblyZumen.length
          } as AssemblySearchResult
        };
      } catch (error) {
        console.error('tRPC zumenAssemblySearch.searchByZumenIdAndProject error:', error);
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'プロジェクト別組立図検索に失敗しました',
        });
      }
    }),

  /**
   * 指定された図面番号を組立図として登録している図面を検索（図面種類指定）
   */
  searchByZumenIdAndKind: publicProcedure
    .input(z.object({
      zumenId: z.string().min(1, '図面番号は必須です'),
      zumenKind: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        let query = 'Kumitate_Zumen LIKE ?';
        const params = input.zumenKind 
          ? [`%${input.zumenId}%`, input.zumenKind]
          : [`%${input.zumenId}%`];

        // 図面種類が指定されている場合は条件に追加
        if (input.zumenKind) {
          query += ' AND Zumen_Kind = ?';
        }

        const result = await GetConditionData<BomZumen[]>(
          query,
          params,
          {
            tableName: 'BOM_ZUMEN',
            idColumn: 'ROWID'
          }
        );

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'データの取得に失敗しました',
          });
        }

        const assemblyZumen = result.data || [];
        
        return {
          success: true,
          data: {
            assemblyZumen,
            totalCount: assemblyZumen.length
          } as AssemblySearchResult
        };
      } catch (error) {
        console.error('tRPC zumenAssemblySearch.searchByZumenIdAndKind error:', error);
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '図面種類別組立図検索に失敗しました',
        });
      }
    }),
}); 