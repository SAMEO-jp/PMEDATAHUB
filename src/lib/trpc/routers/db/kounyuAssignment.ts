/**
 * 購入品担当割り当て管理専用のtRPCルーター
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { getKounyuList, updateKounyuAssignment } from '../../../db/queries/kounyuQueries';
import { assignKounyuToUser, removeKounyuAssignment } from '../../../db/crud/kounyuCRUD';

export const kounyuAssignmentRouter = createTRPCRouter({
  /**
   * 購入品一覧を取得（担当割り当て用）
   */
  getAll: publicProcedure
    .query(async () => {
      try {
        const result = await getKounyuList();

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '購入品一覧の取得に失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('tRPC kounyuAssignment.getAll error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '購入品一覧の取得に失敗しました',
        });
      }
    }),

  /**
   * 購入品担当を割り当て
   */
  add: publicProcedure
    .input(z.object({
      project_id: z.string().min(1, 'プロジェクトIDは必須です'),
      kounyu_id: z.number().min(1, '購入品IDは必須です'),
      user_id: z.string().min(1, 'ユーザーIDは必須です'),
      assigned_at: z.string().min(1, '担当開始日は必須です'),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await assignKounyuToUser({
          project_id: input.project_id,
          kounyu_id: input.kounyu_id,
          user_id: input.user_id,
          status: 'active'
        });

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '担当割り当てに失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('tRPC kounyuAssignment.add error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '担当割り当てに失敗しました',
        });
      }
    }),

  /**
   * 購入品担当を更新
   */
  update: publicProcedure
    .input(z.object({
      assignment_id: z.number().min(1, '担当割り当てIDは必須です'),
      assigned_at: z.string().optional(),
      status: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await updateKounyuAssignment(input.assignment_id, {
          assigned_at: input.assigned_at,
          status: input.status
        });

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '担当更新に失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('tRPC kounyuAssignment.update error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '担当更新に失敗しました',
        });
      }
    }),

  /**
   * 購入品担当を解除
   */
  remove: publicProcedure
    .input(z.object({
      assignment_id: z.number().min(1, '担当割り当てIDは必須です'),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await removeKounyuAssignment(input.assignment_id);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '担当解除に失敗しました',
          });
        }

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('tRPC kounyuAssignment.remove error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '担当解除に失敗しました',
        });
      }
    }),
});
