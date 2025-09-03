/**
 * @file box itemに関連するAPIエンドポイント（プロシージャ）を定義するルーターファイルです。
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import {
  getAllBoxItems,
  getBoxItemById,
  searchBoxItems,
  createBoxItem,
  updateBoxItem,
  deleteBoxItem,
  getBoxItemStats
} from '@src/lib/db/box/boxQueries';
import type { BoxItemCreateInput, BoxItemUpdateInput } from '@src/types/box/box';

/**
 * Box item関連のプロシージャをまとめたルーター。
 * `createTRPCRouter` を使って定義します。
 * ここで定義されたプロシージャは `trpc.box.getAll` のようにクライアントから呼び出されます。
 */
export const boxRouter = createTRPCRouter({
  /**
   * 全てのbox itemを取得するプロシージャ（ページネーション対応）。
   * .query() を使用するため、これはデータを取得する（読み取り）操作です。
   */
  getAll: publicProcedure
    .input(z.object({
      page: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).max(100).default(20),
    }).optional())
    .query(async ({ input }) => {
      try {
        const pagination = input ? { page: input.page, limit: input.limit } : undefined;
        const result = await getAllBoxItems(pagination);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'データの取得に失敗しました',
          });
        }
        
        return { success: true, data: result.data, count: result.count };
      } catch (error) {
        console.error("tRPC box.getAll error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'データの取得に失敗しました',
        });
      }
    }),

  /**
   * 指定されたIDのbox itemを取得するプロシージャ。
   */
  getById: publicProcedure
    .input(z.object({
      box_id: z.string().min(1, 'box_idは必須です'),
      item_type: z.number().int().min(0, 'item_typeは0以上の整数である必要があります'),
    }))
    .query(async ({ input }) => {
      try {
        const result = await getBoxItemById(input.box_id, input.item_type);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error || 'Box itemが見つかりません',
          });
        }
        
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC box.getById error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'データの取得に失敗しました',
        });
      }
    }),

  /**
   * 条件を指定してbox itemを検索するプロシージャ（ページネーション対応）。
   */
  search: publicProcedure
    .input(z.object({
      box_id: z.string().optional(),
      item_type: z.number().int().min(0).optional(),
      parent_item_id: z.string().optional(),
      name: z.string().optional(),
      owner_id: z.string().optional(),
      checksum: z.string().optional(),
      size: z.number().int().min(0).optional(),
      lock_id: z.string().optional(),
      lock_owner_id: z.string().optional(),
      content_created_at: z.number().int().optional(),
      content_updated_at: z.number().int().optional(),
      version_id: z.string().optional(),
      lock_app_type: z.string().optional(),
      page: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).max(100).default(20),
    }))
    .query(async ({ input }) => {
      try {
        const { page, limit, ...filters } = input;
        const pagination = { page, limit };
        const result = await searchBoxItems(filters, pagination);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '検索に失敗しました',
          });
        }
        
        return { success: true, data: result.data, count: result.count };
      } catch (error) {
        console.error("tRPC box.search error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '検索に失敗しました',
        });
      }
    }),

  /**
   * 新しいbox itemを作成するプロシージャ。
   * .mutation() を使用するため、これはデータを変更する（書き込み）操作です。
   */
  create: publicProcedure
    .input(z.object({
      box_id: z.string().min(1, 'box_idは必須です'),
      item_type: z.number().int().min(0, 'item_typeは0以上の整数である必要があります'),
      parent_item_id: z.string().optional(),
      name: z.string().optional(),
      sort_name: z.string().optional(),
      owner_id: z.string().min(1, 'owner_idは必須です'),
      checksum: z.string().optional(),
      size: z.number().int().min(0).optional(),
      lock_id: z.string().optional(),
      lock_owner_id: z.string().optional(),
      content_created_at: z.number().int().optional(),
      content_updated_at: z.number().int().optional(),
      version_id: z.string().optional(),
      lock_app_type: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await createBoxItem(input as BoxItemCreateInput);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'データの作成に失敗しました',
          });
        }
        
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC box.create error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'データの作成に失敗しました',
        });
      }
    }),

  /**
   * box itemを更新するプロシージャ。
   */
  update: publicProcedure
    .input(z.object({
      box_id: z.string().min(1, 'box_idは必須です'),
      item_type: z.number().int().min(0, 'item_typeは0以上の整数である必要があります'),
      parent_item_id: z.string().optional(),
      name: z.string().optional(),
      sort_name: z.string().optional(),
      checksum: z.string().optional(),
      size: z.number().int().min(0).optional(),
      lock_id: z.string().optional(),
      lock_owner_id: z.string().optional(),
      content_created_at: z.number().int().optional(),
      content_updated_at: z.number().int().optional(),
      version_id: z.string().optional(),
      lock_app_type: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { box_id, item_type, ...updates } = input;
        const result = await updateBoxItem(box_id, item_type, updates as BoxItemUpdateInput);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error || 'Box itemが見つからないか、更新に失敗しました',
          });
        }
        
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC box.update error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'データの更新に失敗しました',
        });
      }
    }),

  /**
   * box itemを削除するプロシージャ。
   */
  delete: publicProcedure
    .input(z.object({
      box_id: z.string().min(1, 'box_idは必須です'),
      item_type: z.number().int().min(0, 'item_typeは0以上の整数である必要があります'),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await deleteBoxItem(input.box_id, input.item_type);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error || 'Box itemが見つかりません',
          });
        }
        
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC box.delete error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'データの削除に失敗しました',
        });
      }
    }),

  /**
   * box itemの統計情報を取得するプロシージャ。
   */
  getStats: publicProcedure
    .query(async () => {
      try {
        const result = await getBoxItemStats();
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '統計情報の取得に失敗しました',
          });
        }
        
        return { success: true, data: result.data };
      } catch (error) {
        console.error("tRPC box.getStats error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '統計情報の取得に失敗しました',
        });
      }
    }),
});
