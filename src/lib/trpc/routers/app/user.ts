/**
 * ユーザー関連のtRPCルーター
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import {
  getAllUsers,
  getUserDetail,
  getUserTimeline,
  createUser,
  updateUser
} from '../../../db/queries/userQueries';

/**
 * ユーザー管理ルーター
 */
export const userRouter = createTRPCRouter({
  /**
   * 全ユーザー一覧取得
   */
  getAll: publicProcedure
    .query(async () => {
      try {
        const result = await getAllUsers();

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'ユーザー一覧の取得に失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC user.getAll error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'ユーザー一覧の取得に失敗しました',
        });
      }
    }),

  /**
   * ユーザー詳細取得
   */
  getDetail: publicProcedure
    .input(z.object({
      user_id: z.string().min(1, 'ユーザーIDは必須です'),
    }))
    .query(async ({ input }) => {
      try {
        const result = await getUserDetail(input.user_id);

        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error || 'ユーザーが見つかりません',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC user.getDetail error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'ユーザー詳細の取得に失敗しました',
        });
      }
    }),

  /**
   * ユーザータイムライン取得
   */
  getTimeline: publicProcedure
    .input(z.object({
      user_id: z.string().min(1, 'ユーザーIDは必須です'),
    }))
    .query(async ({ input }) => {
      try {
        const result = await getUserTimeline(input.user_id);

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'タイムラインの取得に失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC user.getTimeline error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'タイムラインの取得に失敗しました',
        });
      }
    }),

  /**
   * 新しいユーザー作成
   */
  create: publicProcedure
    .input(z.object({
      user_id: z.string().min(1, '社員番号は必須です'),
      name_japanese: z.string().min(1, '名前は必須です'),
      TEL: z.string().optional(),
      mail: z.string().email('有効なメールアドレスを入力してください').optional().or(z.literal('')),
      bumon: z.string().optional(),
      sitsu: z.string().optional(),
      ka: z.string().optional(),
      in_year: z.string().optional(),
      Kengen: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        // 空文字をnullに変換
        const submitData = {
          ...input,
          TEL: input.TEL || null,
          mail: input.mail || null,
          bumon: input.bumon || null,
          sitsu: input.sitsu || null,
          ka: input.ka || null,
          in_year: input.in_year || null,
          Kengen: input.Kengen || null,
        };

        const result = await createUser(submitData);

        if (!result.success) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: result.error || 'ユーザーの作成に失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC user.create error:', error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'ユーザーの作成に失敗しました',
        });
      }
    }),

  /**
   * ユーザー更新
   */
  update: publicProcedure
    .input(z.object({
      user_id: z.string().min(1, 'ユーザーIDは必須です'),
      data: z.object({
        user_id: z.string().min(1, '社員番号は必須です'),
        name_japanese: z.string().min(1, '名前は必須です'),
        TEL: z.string().optional(),
        mail: z.string().email('有効なメールアドレスを入力してください').optional().or(z.literal('')),
        bumon: z.string().optional(),
        sitsu: z.string().optional(),
        ka: z.string().optional(),
        in_year: z.string().optional(),
        Kengen: z.string().optional(),
      })
    }))
    .mutation(async ({ input }) => {
      try {
        // 空文字をnullに変換
        const submitData = {
          ...input.data,
          TEL: input.data.TEL || null,
          mail: input.data.mail || null,
          bumon: input.data.bumon || null,
          sitsu: input.data.sitsu || null,
          ka: input.data.ka || null,
          in_year: input.data.in_year || null,
          Kengen: input.data.Kengen || null,
        };

        const result = await updateUser(input.user_id, submitData);

        if (!result.success) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: result.error || 'ユーザーの更新に失敗しました',
          });
        }

        return { success: true, data: result.data };
      } catch (error) {
        console.error('tRPC user.update error:', error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'ユーザーの更新に失敗しました',
        });
      }
    }),
});
