/**
 * @file 部署管理に関連するAPIエンドポイント（プロシージャ）を定義するルーターファイルです。
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { GetConditionData } from '@src/lib/db/crud/db_GetData';

// 部署の型定義
export interface Department {
  id: number;
  name: string;
  department_kind: string;
  top_department: string | null;
  status: string;
}

/**
 * 部署関連のプロシージャをまとめたルーター。
 * `createTRPCRouter` を使って定義します。
 * ここで定義されたプロシージャは `trpc.department.getAll` のようにクライアントから呼び出されます。
 */
export const departmentRouter = createTRPCRouter({
  /**
   * 全ての部署を取得するプロシージャ。
   * .query() を使用するため、これはデータを取得する（読み取り）操作です。
   */
  getAll: publicProcedure
    .query(async () => {
      try {
        const result = await GetConditionData<Department[]>(
          '1=1',
          [],
          { 
            tableName: 'DEPARTMENT', 
            idColumn: 'id'
          }
        );
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '部署一覧の取得に失敗しました',
          });
        }
        
        return { success: true, data: result.data || [] };
      } catch (error) {
        console.error("tRPC department.getAll error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '部署一覧の取得に失敗しました',
        });
      }
    }),

  /**
   * 指定されたIDの部署を取得するプロシージャ。
   */
  getById: publicProcedure
    .input(z.object({
      id: z.number().min(1, '部署IDは必須です'),
    }))
    .query(async ({ input }) => {
      try {
        const result = await GetConditionData<Department[]>(
          'id = ?',
          [input.id],
          { 
            tableName: 'DEPARTMENT', 
            idColumn: 'id'
          }
        );
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '部署の取得に失敗しました',
          });
        }
        
        const department = result.data?.[0];
        if (!department) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '部署が見つかりません',
          });
        }
        
        return { success: true, data: department };
      } catch (error) {
        console.error("tRPC department.getById error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '部署の取得に失敗しました',
        });
      }
    }),

  /**
   * 部署種別で部署を検索するプロシージャ。
   */
  getByKind: publicProcedure
    .input(z.object({
      department_kind: z.string().min(1, '部署種別は必須です'),
    }))
    .query(async ({ input }) => {
      try {
        const result = await GetConditionData<Department[]>(
          'department_kind = ?',
          [input.department_kind],
          { 
            tableName: 'DEPARTMENT', 
            idColumn: 'id'
          }
        );
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '部署検索に失敗しました',
          });
        }
        
        return { success: true, data: result.data || [] };
      } catch (error) {
        console.error("tRPC department.getByKind error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '部署検索に失敗しました',
        });
      }
    }),
});
