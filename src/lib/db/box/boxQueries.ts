/**
 * @file box itemに関連するデータベース操作関数
 */

import { initializeBoxDatabase } from './boxConnection';
import type { 
  BoxItem, 
  BoxItemCreateInput, 
  BoxItemUpdateInput, 
  BoxItemSearchFilters,
  BoxItemResponse,
  BoxItemListResponse 
} from '@src/types/box/box';

/**
 * ページネーション用のパラメータ
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * 全てのbox itemを取得（ページネーション対応）
 */
export async function getAllBoxItems(pagination?: PaginationParams): Promise<BoxItemListResponse> {
  try {
    const db = await initializeBoxDatabase();
    
    let query = 'SELECT * FROM box_item ORDER BY content_updated_at DESC';
    const params: any[] = [];
    
    if (pagination) {
      const offset = (pagination.page - 1) * pagination.limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(pagination.limit, offset);
    }
    
    const items = await db.all<BoxItem[]>(query, params);
    
    // 総数を取得
    const countResult = await db.get('SELECT COUNT(*) as count FROM box_item');
    const totalCount = countResult?.count || 0;
    
    return {
      success: true,
      data: items || [],
      count: totalCount
    };
  } catch (error) {
    console.error('getAllBoxItems error:', error);
    return {
      success: false,
      data: [],
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * 指定されたIDのbox itemを取得
 */
export async function getBoxItemById(boxId: string, itemType: number): Promise<BoxItemResponse> {
  try {
    const db = await initializeBoxDatabase();
    const item = await db.get<BoxItem>(
      'SELECT * FROM box_item WHERE box_id = ? AND item_type = ?',
      [boxId, itemType]
    );
    
    if (!item) {
      return {
        success: false,
        error: 'Box item not found'
      };
    }
    
    return {
      success: true,
      data: item
    };
  } catch (error) {
    console.error('getBoxItemById error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * 条件を指定してbox itemを検索（ページネーション対応）
 */
export async function searchBoxItems(
  filters: BoxItemSearchFilters, 
  pagination?: PaginationParams
): Promise<BoxItemListResponse> {
  try {
    const db = await initializeBoxDatabase();
    
    let query = 'SELECT * FROM box_item WHERE 1=1';
    const params: any[] = [];
    
    if (filters.box_id) {
      query += ' AND box_id = ?';
      params.push(filters.box_id);
    }
    
    if (filters.item_type !== undefined) {
      query += ' AND item_type = ?';
      params.push(filters.item_type);
    }
    
    if (filters.parent_item_id) {
      query += ' AND parent_item_id = ?';
      params.push(filters.parent_item_id);
    }
    
    if (filters.name) {
      query += ' AND name LIKE ?';
      params.push(`%${filters.name}%`);
    }
    
    if (filters.owner_id) {
      query += ' AND owner_id = ?';
      params.push(filters.owner_id);
    }
    
    if (filters.checksum) {
      query += ' AND checksum = ?';
      params.push(filters.checksum);
    }
    
    if (filters.size !== undefined) {
      query += ' AND size = ?';
      params.push(filters.size);
    }
    
    if (filters.lock_id) {
      query += ' AND lock_id = ?';
      params.push(filters.lock_id);
    }
    
    if (filters.lock_owner_id) {
      query += ' AND lock_owner_id = ?';
      params.push(filters.lock_owner_id);
    }
    
    if (filters.content_created_at !== undefined) {
      query += ' AND content_created_at = ?';
      params.push(filters.content_created_at);
    }
    
    if (filters.content_updated_at !== undefined) {
      query += ' AND content_updated_at = ?';
      params.push(filters.content_updated_at);
    }
    
    if (filters.version_id) {
      query += ' AND version_id = ?';
      params.push(filters.version_id);
    }
    
    if (filters.lock_app_type) {
      query += ' AND lock_app_type = ?';
      params.push(filters.lock_app_type);
    }
    
    query += ' ORDER BY content_updated_at DESC';
    
    // ページネーション適用
    if (pagination) {
      const offset = (pagination.page - 1) * pagination.limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(pagination.limit, offset);
    }
    
    const items = await db.all<BoxItem[]>(query, params);
    
    // 検索条件に一致する総数を取得
    let countQuery = 'SELECT COUNT(*) as count FROM box_item WHERE 1=1';
    const countParams: any[] = [];
    
    if (filters.box_id) {
      countQuery += ' AND box_id = ?';
      countParams.push(filters.box_id);
    }
    
    if (filters.item_type !== undefined) {
      countQuery += ' AND item_type = ?';
      countParams.push(filters.item_type);
    }
    
    if (filters.parent_item_id) {
      countQuery += ' AND parent_item_id = ?';
      countParams.push(filters.parent_item_id);
    }
    
    if (filters.name) {
      countQuery += ' AND name LIKE ?';
      countParams.push(`%${filters.name}%`);
    }
    
    if (filters.owner_id) {
      countQuery += ' AND owner_id = ?';
      countParams.push(filters.owner_id);
    }
    
    if (filters.checksum) {
      countQuery += ' AND checksum = ?';
      countParams.push(filters.checksum);
    }
    
    if (filters.size !== undefined) {
      countQuery += ' AND size = ?';
      countParams.push(filters.size);
    }
    
    if (filters.lock_id) {
      countQuery += ' AND lock_id = ?';
      countParams.push(filters.lock_id);
    }
    
    if (filters.lock_owner_id) {
      countQuery += ' AND lock_owner_id = ?';
      countParams.push(filters.lock_owner_id);
    }
    
    if (filters.content_created_at !== undefined) {
      countQuery += ' AND content_created_at = ?';
      countParams.push(filters.content_created_at);
    }
    
    if (filters.content_updated_at !== undefined) {
      countQuery += ' AND content_updated_at = ?';
      countParams.push(filters.content_updated_at);
    }
    
    if (filters.version_id) {
      countQuery += ' AND version_id = ?';
      countParams.push(filters.version_id);
    }
    
    if (filters.lock_app_type) {
      countQuery += ' AND lock_app_type = ?';
      countParams.push(filters.lock_app_type);
    }
    
    const countResult = await db.get(countQuery, countParams);
    const totalCount = countResult?.count || 0;
    
    return {
      success: true,
      data: items || [],
      count: totalCount
    };
  } catch (error) {
    console.error('searchBoxItems error:', error);
    return {
      success: false,
      data: [],
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * 新しいbox itemを作成
 */
export async function createBoxItem(input: BoxItemCreateInput): Promise<BoxItemResponse> {
  try {
    const db = await initializeBoxDatabase();
    
    const result = await db.run(
      `INSERT INTO box_item (
        box_id, item_type, parent_item_id, name, sort_name, owner_id,
        checksum, size, lock_id, lock_owner_id, content_created_at,
        content_updated_at, version_id, lock_app_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.box_id,
        input.item_type,
        input.parent_item_id || null,
        input.name || null,
        input.sort_name || null,
        input.owner_id,
        input.checksum || null,
        input.size || null,
        input.lock_id || null,
        input.lock_owner_id || null,
        input.content_created_at || null,
        input.content_updated_at || null,
        input.version_id || null,
        input.lock_app_type || null
      ]
    );
    
    if (result.changes === 0) {
      return {
        success: false,
        error: 'Failed to create box item'
      };
    }
    
    // 作成されたアイテムを取得
    const createdItem = await getBoxItemById(input.box_id, input.item_type);
    return createdItem;
  } catch (error) {
    console.error('createBoxItem error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * box itemを更新
 */
export async function updateBoxItem(
  boxId: string, 
  itemType: number, 
  updates: BoxItemUpdateInput
): Promise<BoxItemResponse> {
  try {
    const db = await initializeBoxDatabase();
    
    const updateFields: string[] = [];
    const params: any[] = [];
    
    if (updates.parent_item_id !== undefined) {
      updateFields.push('parent_item_id = ?');
      params.push(updates.parent_item_id);
    }
    
    if (updates.name !== undefined) {
      updateFields.push('name = ?');
      params.push(updates.name);
    }
    
    if (updates.sort_name !== undefined) {
      updateFields.push('sort_name = ?');
      params.push(updates.sort_name);
    }
    
    if (updates.checksum !== undefined) {
      updateFields.push('checksum = ?');
      params.push(updates.checksum);
    }
    
    if (updates.size !== undefined) {
      updateFields.push('size = ?');
      params.push(updates.size);
    }
    
    if (updates.lock_id !== undefined) {
      updateFields.push('lock_id = ?');
      params.push(updates.lock_id);
    }
    
    if (updates.lock_owner_id !== undefined) {
      updateFields.push('lock_owner_id = ?');
      params.push(updates.lock_owner_id);
    }
    
    if (updates.content_created_at !== undefined) {
      updateFields.push('content_created_at = ?');
      params.push(updates.content_created_at);
    }
    
    if (updates.content_updated_at !== undefined) {
      updateFields.push('content_updated_at = ?');
      params.push(updates.content_updated_at);
    }
    
    if (updates.version_id !== undefined) {
      updateFields.push('version_id = ?');
      params.push(updates.version_id);
    }
    
    if (updates.lock_app_type !== undefined) {
      updateFields.push('lock_app_type = ?');
      params.push(updates.lock_app_type);
    }
    
    if (updateFields.length === 0) {
      return {
        success: false,
        error: 'No fields to update'
      };
    }
    
    params.push(boxId, itemType);
    
    const result = await db.run(
      `UPDATE box_item SET ${updateFields.join(', ')} WHERE box_id = ? AND item_type = ?`,
      params
    );
    
    if (result.changes === 0) {
      return {
        success: false,
        error: 'Box item not found or no changes made'
      };
    }
    
    // 更新されたアイテムを取得
    const updatedItem = await getBoxItemById(boxId, itemType);
    return updatedItem;
  } catch (error) {
    console.error('updateBoxItem error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * box itemを削除
 */
export async function deleteBoxItem(boxId: string, itemType: number): Promise<BoxItemResponse> {
  try {
    const db = await initializeBoxDatabase();
    
    // 削除前にアイテムを取得
    const existingItem = await getBoxItemById(boxId, itemType);
    if (!existingItem.success) {
      return existingItem;
    }
    
    const result = await db.run(
      'DELETE FROM box_item WHERE box_id = ? AND item_type = ?',
      [boxId, itemType]
    );
    
    if (result.changes === 0) {
      return {
        success: false,
        error: 'Box item not found'
      };
    }
    
    return {
      success: true,
      data: existingItem.data
    };
  } catch (error) {
    console.error('deleteBoxItem error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * box itemの統計情報を取得
 */
export async function getBoxItemStats(): Promise<{
  success: boolean;
  data?: {
    totalCount: number;
    itemTypeCounts: Record<number, number>;
    ownerCounts: Record<string, number>;
    averageSize: number;
  };
  error?: string;
}> {
  try {
    const db = await initializeBoxDatabase();
    
    // 総数
    const totalResult = await db.get('SELECT COUNT(*) as count FROM box_item');
    const totalCount = totalResult?.count || 0;
    
    // item_type別の数
    const itemTypeResult = await db.all(
      'SELECT item_type, COUNT(*) as count FROM box_item GROUP BY item_type'
    );
    const itemTypeCounts: Record<number, number> = {};
    itemTypeResult?.forEach((row: any) => {
      itemTypeCounts[row.item_type] = row.count;
    });
    
    // owner_id別の数
    const ownerResult = await db.all(
      'SELECT owner_id, COUNT(*) as count FROM box_item GROUP BY owner_id'
    );
    const ownerCounts: Record<string, number> = {};
    ownerResult?.forEach((row: any) => {
      ownerCounts[row.owner_id] = row.count;
    });
    
    // 平均サイズ
    const avgSizeResult = await db.get('SELECT AVG(size) as avg_size FROM box_item WHERE size IS NOT NULL');
    const averageSize = avgSizeResult?.avg_size || 0;
    
    return {
      success: true,
      data: {
        totalCount,
        itemTypeCounts,
        ownerCounts,
        averageSize
      }
    };
  } catch (error) {
    console.error('getBoxItemStats error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
