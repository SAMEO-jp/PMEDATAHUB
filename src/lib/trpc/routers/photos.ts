import { createRecord, deleteRecord, getAllRecords, getRecord, updateRecord } from '@src/lib/db/crud/db_CRUD';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '../trpc';

// ==========================================
// Zodスキーマ
// ==========================================
const PhotoCategorySchema = z.enum(['palet', 'construction', 'quality', 'safety', 'others']);
const PhotoStatusSchema = z.enum(['active', 'archived', 'deleted']);

// アルバム関連のスキーマ
const AlbumSchema = z.object({
  album_id: z.number().optional(),
  fk_project_id: z.string().min(1, 'プロジェクトIDは必須です'),
  album_name: z.string().min(1, 'アルバム名は必須です'),
  album_description: z.string().optional(),
  album_cover_photo_id: z.number().optional(),
  album_created_at: z.string().optional(),
  album_updated_at: z.string().optional(),
});

const AlbumFiltersSchema = z.object({
  search: z.string().optional(),
  sortBy: z.enum(['name', 'created_at', 'photo_count']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

const PhotoSchema = z.object({
  photo_id: z.number().optional(),
  fk_project_id: z.string().min(1, 'プロジェクトIDは必須です'),
  fk_palet_list_id: z.string().optional(),
  photo_file_path: z.string().min(1, 'ファイルパスは必須です'),
  photo_thumbnail_path: z.string().optional(),
  photo_title: z.string().min(1, 'タイトルは必須です'),
  photo_description: z.string().optional(),
  photo_location: z.string().optional(),
  photo_shooting_date: z.string().optional(),
  photo_category: PhotoCategorySchema.default('others'),
  photo_tags: z.string().optional(), // JSON形式でタグIDを保存
  photo_status: PhotoStatusSchema.default('active'),
  fk_uploaded_by_user_id: z.string().optional(),
  photo_uploaded_at: z.string().optional(),
  photo_updated_at: z.string().optional(),
});

const PhotoFiltersSchema = z.object({
  category: PhotoCategorySchema.optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  tags: z.array(z.number()).optional(),
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

// ==========================================
// tRPCルーター
// ==========================================
export const photosRouter = createTRPCRouter({
  // プロジェクトの写真一覧取得
  getByProjectId: publicProcedure
    .input(z.object({ 
      projectId: z.string(),
      filters: PhotoFiltersSchema.optional(),
    }))
    .query(async ({ input }) => {
      try {
        let query = 'SELECT * FROM photos WHERE fk_project_id = ?';
        const params: any[] = [input.projectId];

        // フィルタ条件を追加
        if (input.filters) {
          if (input.filters.category) {
            query += ' AND photo_category = ?';
            params.push(input.filters.category);
          }
          if (input.filters.dateFrom) {
            query += ' AND photo_shooting_date >= ?';
            params.push(input.filters.dateFrom);
          }
          if (input.filters.dateTo) {
            query += ' AND photo_shooting_date <= ?';
            params.push(input.filters.dateTo);
          }
          if (input.filters.search) {
            query += ' AND (photo_title LIKE ? OR photo_description LIKE ?)';
            const searchTerm = `%${input.filters.search}%`;
            params.push(searchTerm, searchTerm);
          }
        }

        // ソートとページネーション
        query += ' ORDER BY photo_uploaded_at DESC';
        if (input.filters?.limit) {
          query += ` LIMIT ${input.filters.limit}`;
          if (input.filters.offset) {
            query += ` OFFSET ${input.filters.offset}`;
          }
        }

        const result = await getAllRecords('photos', query, params);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || '写真データの取得に失敗しました',
          });
        }
        
        return { success: true, data: result.data || [] };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '写真データの取得に失敗しました',
        });
      }
    }),

  // 個別写真取得
  getById: publicProcedure
    .input(z.object({ photoId: z.number() }))
    .query(async ({ input }) => {
      try {
        const result = await getRecord('photos', input.photoId);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error?.message || '写真が見つかりません',
          });
        }
        
        return { success: true, data: result.data };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '写真データの取得に失敗しました',
        });
      }
    }),

  // パレット関連写真取得
  getByPaletListId: publicProcedure
    .input(z.object({ paletListId: z.string() }))
    .query(async ({ input }) => {
      try {
        const result = await getAllRecords(
          'photos',
          'SELECT * FROM photos WHERE fk_palet_list_id = ? ORDER BY photo_uploaded_at DESC',
          [input.paletListId]
        );
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'パレット関連写真の取得に失敗しました',
          });
        }
        
        return { success: true, data: result.data || [] };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'パレット関連写真の取得に失敗しました',
        });
      }
    }),

  // 写真検索
  search: publicProcedure
    .input(z.object({
      projectId: z.string(),
      query: z.string(),
      category: PhotoCategorySchema.optional(),
      tags: z.array(z.number()).optional(),
    }))
    .query(async ({ input }) => {
      try {
        let query = 'SELECT * FROM photos WHERE fk_project_id = ? AND (photo_title LIKE ? OR photo_description LIKE ?)';
        const params: any[] = [input.projectId, `%${input.query}%`, `%${input.query}%`];

        if (input.category) {
          query += ' AND photo_category = ?';
          params.push(input.category);
        }

        query += ' ORDER BY photo_uploaded_at DESC';

        const result = await getAllRecords('photos', query, params);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || '写真検索に失敗しました',
          });
        }
        
        return { success: true, data: result.data || [] };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '写真検索に失敗しました',
        });
      }
    }),



  // 写真更新
  update: publicProcedure
    .input(z.object({
      photoId: z.number(),
      updates: z.object({
        photo_title: z.string().optional(),
        photo_description: z.string().optional(),
        photo_location: z.string().optional(),
        photo_category: z.enum(['palet', 'construction', 'quality', 'safety', 'others']).optional(),
        photo_shooting_date: z.string().optional(),
        photo_tags: z.string().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      try {
        const updateFields = Object.keys(input.updates)
          .filter(key => key !== 'photo_id')
          .map(key => `${key} = ?`)
          .join(', ');
        
        const query = `UPDATE photos SET ${updateFields}, photo_updated_at = ? WHERE photo_id = ?`;
        const params = [...Object.values(input.updates), new Date().toISOString(), input.photoId];
        
        const result = await getAllRecords('photos', query, params);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: '写真の更新に失敗しました',
          });
        }
        
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '写真の更新に失敗しました',
        });
      }
    }),

  // 写真削除
  delete: publicProcedure
    .input(z.object({ photoId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        // まず写真ファイルのパスを取得
        const photoResult = await getAllRecords(
          'photos',
          'SELECT photo_file_path FROM photos WHERE photo_id = ?',
          [input.photoId]
        );
        
        if (!photoResult.success || !photoResult.data?.[0]) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '写真が見つかりません',
          });
        }

        // アルバム関連付けを削除
        await getAllRecords(
          'album_photos_link',
          'DELETE FROM album_photos_link WHERE fk_photo_id = ?',
          [input.photoId]
        );

        // 写真レコードを削除
        const result = await getAllRecords(
          'photos',
          'DELETE FROM photos WHERE photo_id = ?',
          [input.photoId]
        );
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: '写真の削除に失敗しました',
          });
        }
        
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '写真の削除に失敗しました',
        });
      }
    }),

  // 写真統計情報取得
  getStats: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      try {
        const statsResult = await getAllRecords(
          'photos',
          `SELECT 
            COUNT(*) as total_photos,
            COUNT(CASE WHEN photo_category = 'palet' THEN 1 END) as palet_photos,
            COUNT(CASE WHEN photo_category = 'construction' THEN 1 END) as construction_photos,
            COUNT(CASE WHEN photo_category = 'quality' THEN 1 END) as quality_photos,
            COUNT(CASE WHEN photo_category = 'safety' THEN 1 END) as safety_photos,
            COUNT(CASE WHEN photo_category = 'others' THEN 1 END) as others_photos
          FROM photos WHERE fk_project_id = ?`,
          [input.projectId]
        );
        
        if (!statsResult.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: '統計情報の取得に失敗しました',
          });
        }
        
        return { success: true, data: statsResult.data?.[0] || {} };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '統計情報の取得に失敗しました',
        });
      }
    }),

  // ==========================================
  // アルバム関連API
  // ==========================================

  // プロジェクトのアルバム一覧取得
  getAlbums: publicProcedure
    .input(z.object({ 
      projectId: z.string(),
      filters: AlbumFiltersSchema.optional(),
    }))
    .query(async ({ input }) => {
      try {
        let query = `
          SELECT 
            a.*,
            COUNT(ap.fk_photo_id) as photo_count
          FROM photo_albums a
          LEFT JOIN album_photos_link ap ON a.album_id = ap.fk_album_id
          WHERE a.fk_project_id = ?
        `;
        const params: any[] = [input.projectId];

        // フィルタ条件を追加
        if (input.filters?.search) {
          query += ' AND (a.album_name LIKE ? OR a.album_description LIKE ?)';
          const searchTerm = `%${input.filters.search}%`;
          params.push(searchTerm, searchTerm);
        }

        query += ' GROUP BY a.album_id';

        // ソート
        const sortBy = input.filters?.sortBy || 'album_created_at';
        const sortOrder = input.filters?.sortOrder || 'desc';
        query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;

        const result = await getAllRecords('photo_albums', query, params);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'アルバムデータの取得に失敗しました',
          });
        }
        
        return { success: true, data: result.data || [] };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'アルバムデータの取得に失敗しました',
        });
      }
    }),

  // アルバム作成
  createAlbum: publicProcedure
    .input(AlbumSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await createRecord('photo_albums', input);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'アルバムの作成に失敗しました',
          });
        }
        
        return { success: true, data: result.data };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'アルバムの作成に失敗しました',
        });
      }
    }),

  // アルバム更新
  updateAlbum: publicProcedure
    .input(z.object({
      albumId: z.number(),
      updates: AlbumSchema.partial(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await updateRecord('photo_albums', input.albumId, input.updates);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'アルバムの更新に失敗しました',
          });
        }
        
        return { success: true, data: result.data };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'アルバムの更新に失敗しました',
        });
      }
    }),

  // アルバム削除
  deleteAlbum: publicProcedure
    .input(z.object({ albumId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const result = await deleteRecord('photo_albums', input.albumId);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'アルバムの削除に失敗しました',
          });
        }
        
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'アルバムの削除に失敗しました',
        });
      }
    }),

  // アルバム内の写真取得
  getPhotosByAlbum: publicProcedure
    .input(z.object({ 
      albumId: z.number(),
      filters: PhotoFiltersSchema.optional(),
    }))
    .query(async ({ input }) => {
      try {
        let query = `
          SELECT p.*
          FROM photos p
          INNER JOIN album_photos_link ap ON p.photo_id = ap.fk_photo_id
          WHERE ap.fk_album_id = ?
        `;
        const params: any[] = [input.albumId];

        // フィルタ条件を追加
        if (input.filters) {
          if (input.filters.category) {
            query += ' AND p.photo_category = ?';
            params.push(input.filters.category);
          }
          if (input.filters.dateFrom) {
            query += ' AND p.photo_shooting_date >= ?';
            params.push(input.filters.dateFrom);
          }
          if (input.filters.dateTo) {
            query += ' AND p.photo_shooting_date <= ?';
            params.push(input.filters.dateTo);
          }
          if (input.filters.search) {
            query += ' AND (p.photo_title LIKE ? OR p.photo_description LIKE ?)';
            const searchTerm = `%${input.filters.search}%`;
            params.push(searchTerm, searchTerm);
          }
        }

        // ソートとページネーション
        query += ' ORDER BY ap.photo_order ASC, p.photo_uploaded_at DESC';
        if (input.filters?.limit) {
          query += ` LIMIT ${input.filters.limit}`;
          if (input.filters.offset) {
            query += ` OFFSET ${input.filters.offset}`;
          }
        }

        const result = await getAllRecords('photos', query, params);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || 'アルバム内の写真取得に失敗しました',
          });
        }
        
        return { success: true, data: result.data || [] };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'アルバム内の写真取得に失敗しました',
        });
      }
    }),

  // 写真作成
  create: publicProcedure
    .input(PhotoSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await createRecord('photos', input);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error?.message || '写真の作成に失敗しました',
          });
        }
        
        return { success: true, data: result.data };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '写真の作成に失敗しました',
        });
      }
    }),





  // 写真一括削除
  batchDelete: publicProcedure
    .input(z.object({ photoIds: z.array(z.number()) }))
    .mutation(async ({ input }) => {
      try {
        const placeholders = input.photoIds.map(() => '?').join(',');
        const query = `DELETE FROM photos WHERE photo_id IN (${placeholders})`;
        
        const result = await getAllRecords('photos', query, input.photoIds);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: '写真の一括削除に失敗しました',
          });
        }
        
        return { success: true, deletedCount: input.photoIds.length };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '写真の一括削除に失敗しました',
        });
      }
    }),

  // 写真一括更新
  batchUpdate: publicProcedure
    .input(z.object({
      photoIds: z.array(z.number()),
      updates: PhotoSchema.partial(),
    }))
    .mutation(async ({ input }) => {
      try {
        const placeholders = input.photoIds.map(() => '?').join(',');
        const updateFields = Object.keys(input.updates)
          .filter(key => key !== 'photo_id')
          .map(key => `${key} = ?`)
          .join(', ');
        
        const query = `UPDATE photos SET ${updateFields} WHERE photo_id IN (${placeholders})`;
        const params = [...Object.values(input.updates), ...input.photoIds];
        
        const result = await getAllRecords('photos', query, params);
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: '写真の一括更新に失敗しました',
          });
        }
        
        return { success: true, updatedCount: input.photoIds.length };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '写真の一括更新に失敗しました',
        });
      }
    }),

  // カテゴリ一覧取得
  getCategories: publicProcedure
    .query(async () => {
      try {
        const result = await getAllRecords('photo_categories', 'SELECT * FROM photo_categories ORDER BY category_id');
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'カテゴリの取得に失敗しました',
          });
        }
        
        return { success: true, data: result.data || [] };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'カテゴリの取得に失敗しました',
        });
      }
    }),

  // タグ一覧取得
  getTags: publicProcedure
    .input(z.object({ projectId: z.string().optional() }))
    .query(async ({ input }) => {
      try {
        const result = await getAllRecords(
          'photo_tags',
          'SELECT pt.*, pc.category_name FROM photo_tags pt LEFT JOIN photo_categories pc ON pt.fk_category_id = pc.category_id ORDER BY pt.tag_id'
        );
        
        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'タグの取得に失敗しました',
          });
        }
        
        return { success: true, data: result.data || [] };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'タグの取得に失敗しました',
        });
      }
    }),

  // アルバム未登録写真取得
  getUnassignedPhotos: publicProcedure
    .input(z.object({
      projectId: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const { projectId } = input;
        
        // プロジェクトの全写真を取得
        const allPhotosResult = await getAllRecords(
          'photos',
          'SELECT * FROM photos WHERE fk_project_id = ? AND photo_status = ? ORDER BY photo_uploaded_at DESC',
          [projectId, 'active']
        );

        if (!allPhotosResult.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: '写真の取得に失敗しました',
          });
        }

        // アルバムに登録されている写真IDを取得
        const assignedPhotosResult = await getAllRecords(
          'album_photos_link',
          'SELECT DISTINCT fk_photo_id FROM album_photos_link'
        );

        if (!assignedPhotosResult.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: '関連付けの取得に失敗しました',
          });
        }

        const assignedPhotoIds = new Set(
          (assignedPhotosResult.data as { fk_photo_id: number }[] || []).map(link => link.fk_photo_id)
        );

        // アルバム未登録の写真をフィルタ
        const unassignedPhotos = (allPhotosResult.data as { photo_id: number }[] || []).filter(
          photo => !assignedPhotoIds.has(photo.photo_id)
        );
        
        return { 
          success: true, 
          data: unassignedPhotos,
          message: `${unassignedPhotos.length}件の未登録写真を取得しました`
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '未登録写真の取得に失敗しました',
        });
      }
    }),
}); 