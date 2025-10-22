/**
 * @file SQL実行に関連するAPIエンドポイント（プロシージャ）を定義するルーターファイルです。
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { executeQuery, getQueryHistory } from '../../../db/crud/db_advanced';

// SQL実行のバリデーションスキーマ
export const SqlExecuteSchema = z.object({
  query: z.string().min(1, 'SQLクエリは必須です'),
  limit: z.number().min(1).max(1000).default(100),
});

// クエリ履歴取得のスキーマ
export const QueryHistorySchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

// SQL検証のスキーマ
export const SqlValidateSchema = z.object({
  query: z.string().min(1, 'SQLクエリは必須です'),
});

/**
 * SQL実行関連のプロシージャをまとめたルーター。
 */
export const sqlRouter = createTRPCRouter({
  /**
   * SQLクエリを実行するプロシージャ。
   * セキュリティのため、SELECT文のみ許可。
   */
  executeQuery: publicProcedure
    .input(SqlExecuteSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await executeQuery(input.query, input.limit);
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'クエリの実行に失敗しました',
          });
        }
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC sql.executeQuery error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'クエリの実行に失敗しました',
        });
      }
    }),

  /**
   * クエリ実行履歴を取得するプロシージャ。
   */
  getQueryHistory: publicProcedure
    .input(QueryHistorySchema)
    .query(async ({ input }) => {
      try {
        const result = await getQueryHistory(input.limit, input.offset);
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'クエリ履歴の取得に失敗しました',
          });
        }
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC sql.getQueryHistory error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'クエリ履歴の取得に失敗しました',
        });
      }
    }),

  /**
   * SQLクエリの構文を検証するプロシージャ。
   */
  validateQuery: publicProcedure
    .input(SqlValidateSchema)
    .query(async ({ input }) => {
      try {
        // 基本的な検証ルール
        const query = input.query.trim();
        const normalizedQuery = query.toUpperCase();

        const validationResult = {
          isValid: true,
          errors: [] as string[],
          warnings: [] as string[],
          suggestions: [] as string[]
        };

        // 空文字チェック
        if (!query) {
          validationResult.isValid = false;
          validationResult.errors.push('SQLクエリが空です');
        }

        // 許可されていない文の種類をチェック
        const forbiddenStatements = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER'];
        for (const statement of forbiddenStatements) {
          if (normalizedQuery.startsWith(statement)) {
            validationResult.isValid = false;
            validationResult.errors.push(`${statement}文は実行できません。SELECT文のみ許可されています。`);
          }
        }

        // 危険なキーワードをチェック
        const dangerousKeywords = ['--', '/*', '*/', 'UNION', 'EXEC'];
        for (const keyword of dangerousKeywords) {
          if (normalizedQuery.includes(keyword)) {
            validationResult.warnings.push(`注意: "${keyword}"が含まれています。悪意のあるクエリでないか確認してください。`);
          }
        }

        // 基本的な構文チェック
        if (normalizedQuery.startsWith('SELECT') && !normalizedQuery.includes('FROM')) {
          validationResult.warnings.push('FROM句がない可能性があります。');
        }

        // パフォーマンスに関する提案
        if (!normalizedQuery.includes('LIMIT') && normalizedQuery.startsWith('SELECT')) {
          validationResult.suggestions.push('大量のデータを避けるため、LIMIT句の追加を検討してください。');
        }

        // TODO: より高度な構文解析を実装
        // const result = await validateQuerySyntax(input.query);

        return {
          success: true,
          data: validationResult
        };
      } catch (error) {
        console.error("tRPC sql.validateQuery error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'クエリの検証に失敗しました',
        });
      }
    }),

  /**
   * クエリの実行計画を取得するプロシージャ。
   */
  getExecutionPlan: publicProcedure
    .input(SqlValidateSchema)
    .query(async ({ input }) => {
      try {
        // TODO: DAL層のgetExecutionPlan()を実装後に置き換え
        // const result = await getExecutionPlan(input.query);

        // 一時的なモックデータ
        return {
          success: true,
          data: {
            query: input.query,
            plan: [
              {
                id: 0,
                parent: null,
                detail: 'SCAN TABLE users',
                estimatedCost: 100,
                estimatedRows: 1000
              },
              {
                id: 1,
                parent: 0,
                detail: 'USE INDEX idx_email',
                estimatedCost: 10,
                estimatedRows: 50
              }
            ],
            totalCost: 110,
            estimatedExecutionTime: 0.05
          }
        };
      } catch (error) {
        console.error("tRPC sql.getExecutionPlan error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '実行計画の取得に失敗しました',
        });
      }
    }),
});