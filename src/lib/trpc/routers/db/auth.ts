/**
 * @file 認証（Authentication）に関連するAPIエンドポイント（プロシージャ）を定義するルーターファイルです。
 * USERテーブルを使用したログイン機能のPOC実装
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { searchUsersByName, getUserById, validateUser } from '@src/lib/db/userQueries';
import { createTRPCRouter, publicProcedure } from '../../trpc';

/**
 * 認証関連のプロシージャをまとめたルーター
 * `createTRPCRouter` を使って定義します。
 * ここで定義されたプロシージャは `trpc.auth.searchUsers` のようにクライアントから呼び出されます。
 */
export const authRouter = createTRPCRouter({
  /**
   * ユーザー検索プロシージャ
   * 名前による部分一致検索を行う
   * .query() を使用するため、これはデータを取得する（読み取り）操作です。
   */
  searchUsers: publicProcedure
    .input(z.object({
      name: z.string().min(2, '名前は2文字以上入力してください'),
    }))
    .query(async ({ input }) => {
      try {
        console.log("tRPC auth.searchUsers called with:", input);
        
        const result = await searchUsersByName(input.name);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: typeof result.error === 'object' && result.error?.message ? result.error.message : 'ユーザー検索に失敗しました',
          });
        }
        
        return { success: true, data: result.data || [] };
      } catch (error) {
        console.error("tRPC auth.searchUsers error:", error);
        
        // 既にTRPCErrorの場合はそのまま投げる
        if (error instanceof TRPCError) {
          throw error;
        }
        
        // その他のエラーの場合は統一されたエラーを投げる
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'ユーザー検索に失敗しました',
        });
      }
    }),

  /**
   * ログインプロシージャ
   * UserIDでユーザー存在確認とログイン処理
   * .mutation() を使用するため、これはデータを変更する（書き込み）操作です。
   */
  login: publicProcedure
    .input(z.object({
      userId: z.string().min(1, 'UserIDは必須です'),
    }))
    .mutation(async ({ input }) => {
      try {
        console.log("tRPC auth.login called with:", input);
        
        const result = await getUserById(input.userId);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: typeof result.error === 'object' && result.error?.message ? result.error.message : 'ユーザー情報の取得に失敗しました',
          });
        }
        
        if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '指定されたUserIDのユーザーが見つかりません',
          });
        }

        const user = result.data[0];
        
        // 簡単なセッション情報を返す（POC実装）
        const loginData = {
          user_id: user.user_id,
          name_japanese: user.name_japanese,
          company: user.company || '',
          bumon: user.bumon || '',
          sitsu: user.sitsu || '',
          ka: user.ka || '',
          syokui: user.syokui || '',
          loginTime: new Date().toISOString(),
        };
        
        console.log("Login successful for user:", loginData);
        
        return { 
          success: true, 
          data: loginData
        };
      } catch (error) {
        console.error("tRPC auth.login error:", error);
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'ログインに失敗しました',
        });
      }
    }),

  /**
   * ユーザー存在確認プロシージャ
   * UserIDの存在確認のみを行う（軽量な確認用）
   */
  validateUser: publicProcedure
    .input(z.object({
      userId: z.string().min(1, 'UserIDは必須です'),
    }))
    .query(async ({ input }) => {
      try {
        console.log("tRPC auth.validateUser called with:", input);
        
        const result = await validateUser(input.userId);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: typeof result.error === 'object' && result.error?.message ? result.error.message : 'ユーザー検証に失敗しました',
          });
        }
        
        return { 
          success: true, 
          data: result.data
        };
      } catch (error) {
        console.error("tRPC auth.validateUser error:", error);
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'ユーザー検証に失敗しました',
        });
      }
    }),

  /**
   * ログアウトプロシージャ
   * POC実装では単純にタイムスタンプを返すのみ
   */
  logout: publicProcedure
    .mutation(async () => {
      try {
        console.log("tRPC auth.logout called");
        
        // POC実装：単純にログアウト時刻を返す
        return { 
          success: true, 
          data: { 
            logoutTime: new Date().toISOString(),
            message: 'ログアウトしました'
          } 
        };
      } catch (error) {
        console.error("tRPC auth.logout error:", error);
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'ログアウトに失敗しました',
        });
      }
    }),
});