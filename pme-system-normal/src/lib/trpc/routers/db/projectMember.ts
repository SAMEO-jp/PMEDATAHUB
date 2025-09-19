/**
 * プロジェクトメンバー管理専用のtRPCルーター
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import {
  addProjectMember,
  updateProjectMember,
  removeProjectMember
} from '../../../db/queries/projectMemberQueries';

export const projectMemberRouter = createTRPCRouter({
  /**
   * プロジェクトメンバーを追加
   */
  add: publicProcedure
    .input(z.object({
      project_id: z.string().min(1, 'プロジェクトIDは必須です'),
      user_id: z.string().min(1, 'ユーザーIDは必須です'),
      role: z.enum(['PM', '開発者', '設計者', 'テスター', '閲覧者'], {
        errorMap: () => ({ message: 'ロールは PM, 開発者, 設計者, テスター, 閲覧者のいずれかを指定してください' })
      }),
      joined_at: z.string().min(1, '参加日は必須です'),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await addProjectMember(input.project_id, input.user_id, input.role || '閲覧者', input.joined_at);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'メンバーの追加に失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('tRPC projectMember.add error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'メンバーの追加に失敗しました',
        });
      }
    }),

  /**
   * プロジェクトメンバーを更新
   */
  update: publicProcedure
    .input(z.object({
      project_id: z.string().min(1, 'プロジェクトIDは必須です'),
      user_id: z.string().min(1, 'ユーザーIDは必須です'),
      data: z.object({
        role: z.string().optional(),
        joined_at: z.string().optional(),
        left_at: z.string().optional(),
        status: z.string().optional(),
      })
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await updateProjectMember(input.project_id, input.user_id, input.data);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'メンバーの更新に失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('tRPC projectMember.update error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'メンバーの更新に失敗しました',
        });
      }
    }),

  /**
   * プロジェクトメンバーを削除
   */
  remove: publicProcedure
    .input(z.object({
      project_id: z.string().min(1, 'プロジェクトIDは必須です'),
      user_id: z.string().min(1, 'ユーザーIDは必須です'),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await removeProjectMember(input.project_id, input.user_id);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'メンバーの削除に失敗しました',
          });
        }

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('tRPC projectMember.remove error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'メンバーの削除に失敗しました',
        });
      }
    }),
});
