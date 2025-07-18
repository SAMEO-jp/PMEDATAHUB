/**
 * @file パレット関連のAPIエンドポイント（プロシージャ）を定義するルーターファイルです。
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { 
  getRecord, 
  updateRecord, 
  getAllRecords, 
  createRecord,
  deleteRecord 
} from '@src/lib/db/db_CRUD';
import { createTRPCRouter, publicProcedure } from '../trpc';
import type {
  PaletMaster,
  KonpoPalet,
  PaletList,
  PaletStatusHistory,
  PaletSchedule,
  PaletTempLocations
} from '@src/types/palet';

/**
 * パレット関連のプロシージャをまとめたルーター。
 * `createTRPCRouter` を使って定義します。
 * ここで定義されたプロシージャは `trpc.palet.master.getAll` のようにクライアントから呼び出されます。
 */
export const paletRouter = createTRPCRouter({
  // ==========================================
  // パレットマスター関連
  // ==========================================
  master: createTRPCRouter({
    /**
     * 全てのパレットマスターを取得するプロシージャ。
     */
    getAll: publicProcedure
      .query(async () => {
        try {
          const result = await getAllRecords<PaletMaster>('PALET_MASTER');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: result.error?.message || 'データの取得に失敗しました',
            });
          }
          
          return { success: true, data: result.data || [] };
        } catch (error) {
          console.error("tRPC palet.master.getAll error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの取得に失敗しました',
          });
        }
      }),

    /**
     * ID指定でパレットマスターを取得するプロシージャ。
     */
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        try {
          const result = await getRecord<PaletMaster>('PALET_MASTER', input.id, 'palet_master_id');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error?.message || 'レコードが見つかりません',
            });
          }
          
          return { success: true, data: result.data };
        } catch (error) {
          console.error("tRPC palet.master.getById error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの取得に失敗しました',
          });
        }
      }),

    /**
     * 条件を指定してパレットマスターを検索するプロシージャ。
     */
    search: publicProcedure
      .input(z.object({
        palet_master_display_name: z.string().optional(),
      }))
      .query(async ({ input }) => {
        try {
          let query = 'SELECT * FROM PALET_MASTER';
          const values: (string | number)[] = [];
          const conditions: string[] = [];

          if (input.palet_master_display_name) {
            conditions.push('palet_master_display_name LIKE ?');
            values.push(`%${input.palet_master_display_name}%`);
          }

          if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
          }

          const result = await getAllRecords<PaletMaster>('PALET_MASTER', query, values);
          
          if (!result.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: result.error?.message || '検索に失敗しました',
            });
          }
          
          return { success: true, data: result.data || [] };
        } catch (error) {
          console.error("tRPC palet.master.search error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: '検索に失敗しました',
          });
        }
      }),

    /**
     * 新しいパレットマスターを作成するプロシージャ。
     */
    create: publicProcedure
      .input(z.object({
        palet_master_id: z.string().min(1, 'パレットマスターIDは必須です'),
        palet_master_display_name: z.string().min(1, 'パレット表示名は必須です'),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await createRecord('PALET_MASTER', input);
          
          if (!result.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: result.error?.message || 'データの作成に失敗しました',
            });
          }
          
          return { success: true, data: result };
        } catch (error) {
          console.error("tRPC palet.master.create error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの作成に失敗しました',
          });
        }
      }),

    /**
     * パレットマスターを更新するプロシージャ。
     */
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          palet_master_display_name: z.string().min(1, 'パレット表示名は必須です'),
        }),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await updateRecord('PALET_MASTER', input.id, input.data, 'palet_master_id');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error?.message || 'レコードが見つかりません',
            });
          }
          
          return { success: true, data: result.data };
        } catch (error) {
          console.error("tRPC palet.master.update error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの更新に失敗しました',
          });
        }
      }),

    /**
     * パレットマスターを削除するプロシージャ。
     */
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        try {
          const result = await deleteRecord('PALET_MASTER', input.id, 'palet_master_id');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error?.message || 'レコードが見つかりません',
            });
          }
          
          return { success: true };
        } catch (error) {
          console.error("tRPC palet.master.delete error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの削除に失敗しました',
          });
        }
      }),
  }),

  // ==========================================
  // 構成パレット関連
  // ==========================================
  konpo: createTRPCRouter({
    /**
     * 全ての構成パレットを取得するプロシージャ。
     */
    getAll: publicProcedure
      .query(async () => {
        try {
          const result = await getAllRecords<KonpoPalet>('KONPO_PALET');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: result.error?.message || 'データの取得に失敗しました',
            });
          }
          
          return { success: true, data: result.data || [] };
        } catch (error) {
          console.error("tRPC palet.konpo.getAll error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの取得に失敗しました',
          });
        }
      }),

    /**
     * ID指定で構成パレットを取得するプロシージャ。
     */
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        try {
          const result = await getRecord<KonpoPalet>('KONPO_PALET', input.id, 'konpo_palet_id');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error?.message || 'レコードが見つかりません',
            });
          }
          
          return { success: true, data: result.data };
        } catch (error) {
          console.error("tRPC palet.konpo.getById error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの取得に失敗しました',
          });
        }
      }),

    /**
     * 条件を指定して構成パレットを検索するプロシージャ。
     */
    search: publicProcedure
      .input(z.object({
        palet_master_id: z.string().optional(),
        buhin_id: z.string().optional(),
      }))
      .query(async ({ input }) => {
        try {
          let query = 'SELECT * FROM KONPO_PALET';
          const values: (string | number)[] = [];
          const conditions: string[] = [];

          if (input.palet_master_id) {
            conditions.push('palet_master_id = ?');
            values.push(input.palet_master_id);
          }

          if (input.buhin_id) {
            conditions.push('buhin_id LIKE ?');
            values.push(`%${input.buhin_id}%`);
          }

          if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
          }

          const result = await getAllRecords<KonpoPalet>('KONPO_PALET', query, values);
          
          if (!result.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: result.error?.message || '検索に失敗しました',
            });
          }
          
          return { success: true, data: result.data || [] };
        } catch (error) {
          console.error("tRPC palet.konpo.search error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: '検索に失敗しました',
          });
        }
      }),

    /**
     * 新しい構成パレットを作成するプロシージャ。
     */
    create: publicProcedure
      .input(z.object({
        palet_master_id: z.string().min(1, 'マスターIDは必須です'),
        buhin_id: z.string().min(1, '部品IDは必須です'),
        palet_buhin_quantity: z.number().min(1, '部品数量は1以上である必要があります'),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await createRecord('KONPO_PALET', input);
          
          if (!result.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: result.error?.message || 'データの作成に失敗しました',
            });
          }
          
          return { success: true, data: result.data };
        } catch (error) {
          console.error("tRPC palet.konpo.create error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの作成に失敗しました',
          });
        }
      }),

    /**
     * 構成パレットを更新するプロシージャ。
     */
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          palet_master_id: z.string().min(1, 'マスターIDは必須です'),
          buhin_id: z.string().min(1, '部品IDは必須です'),
          palet_buhin_quantity: z.number().min(1, '部品数量は1以上である必要があります'),
        }),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await updateRecord('KONPO_PALET', input.id, input.data, 'konpo_palet_id');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error?.message || 'レコードが見つかりません',
            });
          }
          
          return { success: true, data: result.data };
        } catch (error) {
          console.error("tRPC palet.konpo.update error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの更新に失敗しました',
          });
        }
      }),

    /**
     * 構成パレットを削除するプロシージャ。
     */
    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const result = await deleteRecord('KONPO_PALET', parseInt(input.id), 'konpo_palet_id');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error?.message || 'レコードが見つかりません',
            });
          }
          
          return { success: true };
        } catch (error) {
          console.error("tRPC palet.konpo.delete error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの削除に失敗しました',
          });
        }
      }),
  }),

  // ==========================================
  // パレットリスト関連
  // ==========================================
  list: createTRPCRouter({
    /**
     * 全てのパレットリストを取得するプロシージャ。
     */
    getAll: publicProcedure
      .query(async () => {
        try {
          const result = await getAllRecords<PaletList>('PALET_LIST');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: result.error?.message || 'データの取得に失敗しました',
            });
          }
          
          return { success: true, data: result.data || [] };
        } catch (error) {
          console.error("tRPC palet.list.getAll error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの取得に失敗しました',
          });
        }
      }),

    /**
     * ID指定でパレットリストを取得するプロシージャ。
     */
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        try {
          const result = await getRecord<PaletList>('PALET_LIST', input.id, 'palet_list_id');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error?.message || 'レコードが見つかりません',
            });
          }
          
          return { success: true, data: result.data };
        } catch (error) {
          console.error("tRPC palet.list.getById error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの取得に失敗しました',
          });
        }
      }),

    /**
     * 条件を指定してパレットリストを検索するプロシージャ。
     */
    search: publicProcedure
      .input(z.object({
        palet_master_id: z.string().optional(),
        palet_list_display_name: z.string().optional(),
      }))
      .query(async ({ input }) => {
        try {
          let query = 'SELECT * FROM PALET_LIST';
          const values: (string | number)[] = [];
          const conditions: string[] = [];

          if (input.palet_master_id) {
            conditions.push('palet_master_id = ?');
            values.push(input.palet_master_id);
          }

          if (input.palet_list_display_name) {
            conditions.push('palet_list_display_name LIKE ?');
            values.push(`%${input.palet_list_display_name}%`);
          }

          if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
          }

          const result = await getAllRecords<PaletList>('PALET_LIST', query, values);
          
          if (!result.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: result.error?.message || '検索に失敗しました',
            });
          }
          
          return { success: true, data: result.data || [] };
        } catch (error) {
          console.error("tRPC palet.list.search error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: '検索に失敗しました',
          });
        }
      }),

    /**
     * 新しいパレットリストを作成するプロシージャ。
     */
    create: publicProcedure
      .input(z.object({
        palet_master_id: z.string().min(1, 'マスターIDは必須です'),
        palet_list_display_name: z.string().min(1, 'パレット名は必須です'),
        palet_quantity: z.number().min(1, 'パレット数量は1以上である必要があります'),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await createRecord('PALET_LIST', input);
          
          if (!result.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: result.error?.message || 'データの作成に失敗しました',
            });
          }
          
          return { success: true, data: result.data };
        } catch (error) {
          console.error("tRPC palet.list.create error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの作成に失敗しました',
          });
        }
      }),

    /**
     * パレットリストを更新するプロシージャ。
     */
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          palet_master_id: z.string().min(1, 'マスターIDは必須です'),
          palet_list_display_name: z.string().min(1, 'パレット名は必須です'),
          palet_quantity: z.number().min(1, 'パレット数量は1以上である必要があります'),
        }),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await updateRecord('PALET_LIST', input.id, input.data, 'palet_list_id');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error?.message || 'レコードが見つかりません',
            });
          }
          
          return { success: true, data: result.data };
        } catch (error) {
          console.error("tRPC palet.list.update error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの更新に失敗しました',
          });
        }
      }),

    /**
     * パレットリストを削除するプロシージャ。
     */
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        try {
          const result = await deleteRecord('PALET_LIST', input.id, 'palet_list_id');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error?.message || 'レコードが見つかりません',
            });
          }
          
          return { success: true };
        } catch (error) {
          console.error("tRPC palet.list.delete error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの削除に失敗しました',
          });
        }
      }),
  }),

  // ==========================================
  // パレットステータス履歴関連
  // ==========================================
  statusHistory: createTRPCRouter({
    /**
     * 全てのパレットステータス履歴を取得するプロシージャ。
     */
    getAll: publicProcedure
      .query(async () => {
        try {
          const result = await getAllRecords<PaletStatusHistory>('PALET_STATUS_HISTORY');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: result.error?.message || 'データの取得に失敗しました',
            });
          }
          
          return { success: true, data: result.data || [] };
        } catch (error) {
          console.error("tRPC palet.statusHistory.getAll error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの取得に失敗しました',
          });
        }
      }),

    /**
     * ID指定でパレットステータス履歴を取得するプロシージャ。
     */
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        try {
          const result = await getRecord<PaletStatusHistory>('PALET_STATUS_HISTORY', input.id, 'palet_status_history_id');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error?.message || 'レコードが見つかりません',
            });
          }
          
          return { success: true, data: result.data };
        } catch (error) {
          console.error("tRPC palet.statusHistory.getById error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの取得に失敗しました',
          });
        }
      }),

    /**
     * 条件を指定してパレットステータス履歴を検索するプロシージャ。
     */
    search: publicProcedure
      .input(z.object({
        palet_list_id: z.number().optional(),
        palet_location_id: z.number().optional(),
        palet_status_type: z.string().optional(),
        palet_status_date_from: z.string().optional(),
        palet_status_date_to: z.string().optional(),
      }))
      .query(async ({ input }) => {
        try {
          let query = 'SELECT * FROM PALET_STATUS_HISTORY';
          const values: (string | number)[] = [];
          const conditions: string[] = [];

          if (input.palet_list_id) {
            conditions.push('palet_list_id = ?');
            values.push(input.palet_list_id);
          }

          if (input.palet_location_id) {
            conditions.push('palet_location_id = ?');
            values.push(input.palet_location_id);
          }

          if (input.palet_status_type) {
            conditions.push('palet_status_type LIKE ?');
            values.push(`%${input.palet_status_type}%`);
          }

          if (input.palet_status_date_from) {
            conditions.push('palet_status_date >= ?');
            values.push(input.palet_status_date_from);
          }

          if (input.palet_status_date_to) {
            conditions.push('palet_status_date <= ?');
            values.push(input.palet_status_date_to);
          }

          if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
          }

          const result = await getAllRecords<PaletStatusHistory>('PALET_STATUS_HISTORY', query, values);
          
          if (!result.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: result.error?.message || '検索に失敗しました',
            });
          }
          
          return { success: true, data: result.data || [] };
        } catch (error) {
          console.error("tRPC palet.statusHistory.search error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: '検索に失敗しました',
          });
        }
      }),

    /**
     * 新しいパレットステータス履歴を作成するプロシージャ。
     */
    create: publicProcedure
      .input(z.object({
        palet_list_id: z.number().min(1, '現物パレットIDは必須です'),
        palet_location_id: z.number().min(1, '場所IDは必須です'),
        palet_status_type: z.string().min(1, 'パレットステータス種別は必須です'),
        palet_status_date: z.string().min(1, 'パレットステータス日時は必須です'),
        palet_location_info: z.string().optional(),
        palet_status_notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await createRecord('PALET_STATUS_HISTORY', input);
          
          if (!result.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: result.error?.message || 'データの作成に失敗しました',
            });
          }
          
          return { success: true, data: result.data };
        } catch (error) {
          console.error("tRPC palet.statusHistory.create error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの作成に失敗しました',
          });
        }
      }),

    /**
     * パレットステータス履歴を更新するプロシージャ。
     */
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          palet_list_id: z.number().min(1, '現物パレットIDは必須です'),
          palet_location_id: z.number().min(1, '場所IDは必須です'),
          palet_status_type: z.string().min(1, 'パレットステータス種別は必須です'),
          palet_status_date: z.string().min(1, 'パレットステータス日時は必須です'),
          palet_location_info: z.string().optional(),
          palet_status_notes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await updateRecord('PALET_STATUS_HISTORY', input.id, input.data, 'palet_status_history_id');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error?.message || 'レコードが見つかりません',
            });
          }
          
          return { success: true, data: result.data };
        } catch (error) {
          console.error("tRPC palet.statusHistory.update error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの更新に失敗しました',
          });
        }
      }),

    /**
     * パレットステータス履歴を削除するプロシージャ。
     */
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        try {
          const result = await deleteRecord('PALET_STATUS_HISTORY', input.id, 'palet_status_history_id');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error?.message || 'レコードが見つかりません',
            });
          }
          
          return { success: true };
        } catch (error) {
          console.error("tRPC palet.statusHistory.delete error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの削除に失敗しました',
          });
        }
      }),
  }),

  // ==========================================
  // パレットスケジュール関連
  // ==========================================
  schedule: createTRPCRouter({
    /**
     * 全てのパレットスケジュールを取得するプロシージャ。
     */
    getAll: publicProcedure
      .query(async () => {
        try {
          const result = await getAllRecords<PaletSchedule>('PALET_SCHEDULE');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: result.error?.message || 'データの取得に失敗しました',
            });
          }
          
          return { success: true, data: result.data || [] };
        } catch (error) {
          console.error("tRPC palet.schedule.getAll error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの取得に失敗しました',
          });
        }
      }),

    /**
     * ID指定でパレットスケジュールを取得するプロシージャ。
     */
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        try {
          const result = await getRecord<PaletSchedule>('PALET_SCHEDULE', input.id, 'palet_schedule_id');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error?.message || 'レコードが見つかりません',
            });
          }
          
          return { success: true, data: result.data };
        } catch (error) {
          console.error("tRPC palet.schedule.getById error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの取得に失敗しました',
          });
        }
      }),

    /**
     * 条件を指定してパレットスケジュールを検索するプロシージャ。
     */
    search: publicProcedure
      .input(z.object({
        palet_list_id: z.number().optional(),
        palet_schedule_status_type: z.string().optional(),
        palet_planned_date_from: z.string().optional(),
        palet_planned_date_to: z.string().optional(),
      }))
      .query(async ({ input }) => {
        try {
          let query = 'SELECT * FROM PALET_SCHEDULE';
          const values: (string | number)[] = [];
          const conditions: string[] = [];

          if (input.palet_list_id) {
            conditions.push('palet_list_id = ?');
            values.push(input.palet_list_id);
          }

          if (input.palet_schedule_status_type) {
            conditions.push('palet_schedule_status_type LIKE ?');
            values.push(`%${input.palet_schedule_status_type}%`);
          }

          if (input.palet_planned_date_from) {
            conditions.push('palet_planned_date >= ?');
            values.push(input.palet_planned_date_from);
          }

          if (input.palet_planned_date_to) {
            conditions.push('palet_planned_date <= ?');
            values.push(input.palet_planned_date_to);
          }

          if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
          }

          const result = await getAllRecords<PaletSchedule>('PALET_SCHEDULE', query, values);
          
          if (!result.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: result.error?.message || '検索に失敗しました',
            });
          }
          
          return { success: true, data: result.data || [] };
        } catch (error) {
          console.error("tRPC palet.schedule.search error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: '検索に失敗しました',
          });
        }
      }),

    /**
     * 新しいパレットスケジュールを作成するプロシージャ。
     */
    create: publicProcedure
      .input(z.object({
        palet_list_id: z.number().min(1, '現物パレットIDは必須です'),
        palet_schedule_status_type: z.string().min(1, 'パレットスケジュールステータス種別は必須です'),
        palet_planned_date: z.string().min(1, 'パレット計画日時は必須です'),
        palet_schedule_notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await createRecord('PALET_SCHEDULE', input);
          
          if (!result.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: result.error?.message || 'データの作成に失敗しました',
            });
          }
          
          return { success: true, data: result.data };
        } catch (error) {
          console.error("tRPC palet.schedule.create error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの作成に失敗しました',
          });
        }
      }),

    /**
     * パレットスケジュールを更新するプロシージャ。
     */
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          palet_list_id: z.number().min(1, '現物パレットIDは必須です'),
          palet_schedule_status_type: z.string().min(1, 'パレットスケジュールステータス種別は必須です'),
          palet_planned_date: z.string().min(1, 'パレット計画日時は必須です'),
          palet_schedule_notes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await updateRecord('PALET_SCHEDULE', input.id, input.data, 'palet_schedule_id');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error?.message || 'レコードが見つかりません',
            });
          }
          
          return { success: true, data: result.data };
        } catch (error) {
          console.error("tRPC palet.schedule.update error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの更新に失敗しました',
          });
        }
      }),

    /**
     * パレットスケジュールを削除するプロシージャ。
     */
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        try {
          const result = await deleteRecord('PALET_SCHEDULE', input.id, 'palet_schedule_id');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error?.message || 'レコードが見つかりません',
            });
          }
          
          return { success: true };
        } catch (error) {
          console.error("tRPC palet.schedule.delete error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの削除に失敗しました',
          });
        }
      }),
  }),

  // ==========================================
  // パレット一時場所関連
  // ==========================================
  tempLocations: createTRPCRouter({
    /**
     * 全てのパレット一時場所を取得するプロシージャ。
     */
    getAll: publicProcedure
      .query(async () => {
        try {
          const result = await getAllRecords<PaletTempLocations>('PALET_TEMP_LOCATIONS');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: result.error?.message || 'データの取得に失敗しました',
            });
          }
          
          return { success: true, data: result.data || [] };
        } catch (error) {
          console.error("tRPC palet.tempLocations.getAll error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの取得に失敗しました',
          });
        }
      }),

    /**
     * ID指定でパレット一時場所を取得するプロシージャ。
     */
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        try {
          const result = await getRecord<PaletTempLocations>('PALET_TEMP_LOCATIONS', input.id, 'palet_location_id');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error?.message || 'レコードが見つかりません',
            });
          }
          
          return { success: true, data: result.data };
        } catch (error) {
          console.error("tRPC palet.tempLocations.getById error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの取得に失敗しました',
          });
        }
      }),

    /**
     * 条件を指定してパレット一時場所を検索するプロシージャ。
     */
    search: publicProcedure
      .input(z.object({
        palet_location_name: z.string().optional(),
        palet_location_address: z.string().optional(),
      }))
      .query(async ({ input }) => {
        try {
          let query = 'SELECT * FROM PALET_TEMP_LOCATIONS';
          const values: (string | number)[] = [];
          const conditions: string[] = [];

          if (input.palet_location_name) {
            conditions.push('palet_location_name LIKE ?');
            values.push(`%${input.palet_location_name}%`);
          }

          if (input.palet_location_address) {
            conditions.push('palet_location_address LIKE ?');
            values.push(`%${input.palet_location_address}%`);
          }

          if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
          }

          const result = await getAllRecords<PaletTempLocations>('PALET_TEMP_LOCATIONS', query, values);
          
          if (!result.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: result.error?.message || '検索に失敗しました',
            });
          }
          
          return { success: true, data: result.data || [] };
        } catch (error) {
          console.error("tRPC palet.tempLocations.search error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: '検索に失敗しました',
          });
        }
      }),

    /**
     * 新しいパレット一時場所を作成するプロシージャ。
     */
    create: publicProcedure
      .input(z.object({
        palet_location_name: z.string().min(1, 'パレット場所名は必須です'),
        palet_location_address: z.string().optional(),
        palet_contact_info: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await createRecord('PALET_TEMP_LOCATIONS', input);
          
          if (!result.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: result.error?.message || 'データの作成に失敗しました',
            });
          }
          
          return { success: true, data: result.data };
        } catch (error) {
          console.error("tRPC palet.tempLocations.create error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの作成に失敗しました',
          });
        }
      }),

    /**
     * パレット一時場所を更新するプロシージャ。
     */
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          palet_location_name: z.string().min(1, 'パレット場所名は必須です'),
          palet_location_address: z.string().optional(),
          palet_contact_info: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await updateRecord('PALET_TEMP_LOCATIONS', input.id, input.data, 'palet_location_id');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error?.message || 'レコードが見つかりません',
            });
          }
          
          return { success: true, data: result.data };
        } catch (error) {
          console.error("tRPC palet.tempLocations.update error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの更新に失敗しました',
          });
        }
      }),

    /**
     * パレット一時場所を削除するプロシージャ。
     */
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        try {
          const result = await deleteRecord('PALET_TEMP_LOCATIONS', input.id, 'palet_location_id');
          
          if (!result.success) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: result.error?.message || 'レコードが見つかりません',
            });
          }
          
          return { success: true };
        } catch (error) {
          console.error("tRPC palet.tempLocations.delete error:", error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データの削除に失敗しました',
          });
        }
      }),
  }),
}); 