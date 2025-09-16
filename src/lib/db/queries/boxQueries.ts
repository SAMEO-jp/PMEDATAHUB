/**
 * @file box item邵ｺ・ｫ鬮｢・｢鬨ｾ・｣邵ｺ蜷ｶ・狗ｹ昴・繝ｻ郢ｧ・ｿ郢晏生繝ｻ郢ｧ・ｹ隰ｫ蝣ｺ・ｽ諞ｺ譛ｪ隰ｨ・ｰ
 */

import { initializeBoxDatabase } from '../connection/boxConnection';
import type { 
  BoxItem, 
  BoxItemCreateInput, 
  BoxItemUpdateInput, 
  BoxItemSearchFilters,
  BoxItemResponse,
  BoxItemListResponse 
} from '@src/types/box/box';

/**
 * 郢晏｣ｹ繝ｻ郢ｧ・ｸ郢晞亂繝ｻ郢ｧ・ｷ郢晢ｽｧ郢晢ｽｳ騾包ｽｨ邵ｺ・ｮ郢昜ｻ｣ﾎ帷ｹ晢ｽ｡郢晢ｽｼ郢ｧ・ｿ
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * 陷茨ｽｨ邵ｺ・ｦ邵ｺ・ｮbox item郢ｧ雋槫徐陟墓圜・ｼ蛹ｻ繝ｻ郢晢ｽｼ郢ｧ・ｸ郢晞亂繝ｻ郢ｧ・ｷ郢晢ｽｧ郢晢ｽｳ陝・ｽｾ陟｢諛ｶ・ｼ繝ｻ */
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
    
    // 驍ｱ荵礼・郢ｧ雋槫徐陟輔・
    const totalRow = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM box_item');
    const totalCount = totalRow?.count || 0;
    
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
 * 隰悶・・ｮ螢ｹ・・ｹｧ蠕娯螺ID邵ｺ・ｮbox item郢ｧ雋槫徐陟輔・ */
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
 * 隴夲ｽ｡闔会ｽｶ郢ｧ蜻域ｬ陞ｳ螢ｹ・邵ｺ・ｦbox item郢ｧ蜻茨ｽ､諛・ｽｴ・｢繝ｻ蛹ｻ繝ｻ郢晢ｽｼ郢ｧ・ｸ郢晞亂繝ｻ郢ｧ・ｷ郢晢ｽｧ郢晢ｽｳ陝・ｽｾ陟｢諛ｶ・ｼ繝ｻ */
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
    
    // 郢晏｣ｹ繝ｻ郢ｧ・ｸ郢晞亂繝ｻ郢ｧ・ｷ郢晢ｽｧ郢晢ｽｳ鬩包ｽｩ騾包ｽｨ
    if (pagination) {
      const offset = (pagination.page - 1) * pagination.limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(pagination.limit, offset);
    }
    
    const items = await db.all<BoxItem[]>(query, params);
    
    // 隶諛・ｽｴ・｢隴夲ｽ｡闔会ｽｶ邵ｺ・ｫ闕ｳﾂ髢ｾ・ｴ邵ｺ蜷ｶ・矩こ荵礼・郢ｧ雋槫徐陟輔・
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
    
    const countRow = await db.get<{ count: number }>(countQuery, countParams);
    const totalCount = countRow?.count || 0;
    
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
 * 隴・ｽｰ邵ｺ蜉ｱ・枌ox item郢ｧ蜑・ｽｽ諛医・
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
    
    // 闖ｴ諛医・邵ｺ霈費ｽ檎ｸｺ貅倥＞郢ｧ・､郢昴・ﾎ堤ｹｧ雋槫徐陟輔・
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
 * box item郢ｧ蜻亥ｳｩ隴・ｽｰ
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
    
    // 隴厄ｽｴ隴・ｽｰ邵ｺ霈費ｽ檎ｸｺ貅倥＞郢ｧ・､郢昴・ﾎ堤ｹｧ雋槫徐陟輔・
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
 * box item郢ｧ雋樒ｎ鬮ｯ・､
 */
export async function deleteBoxItem(boxId: string, itemType: number): Promise<BoxItemResponse> {
  try {
    const db = await initializeBoxDatabase();
    
    // 陷台ｼ∝求陷鷹亂竊鍋ｹｧ・｢郢ｧ・､郢昴・ﾎ堤ｹｧ雋槫徐陟輔・
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
 * 髫阪・辟夂ｸｺ・ｮbox_id邵ｺ・ｫ陝・ｽｾ陟｢諛岩・郢ｧ荵昴Ψ郢ｧ・｡郢ｧ・､郢晢ｽｫ陷ｷ髦ｪ・定愾髢・ｾ繝ｻ */
export async function getFileNamesByBoxIds(boxIds: string[]): Promise<{
  success: boolean;
  data?: { box_id: string; name?: string; item_type: number }[];
  error?: string;
}> {
  try {
    if (!boxIds || boxIds.length === 0) {
      return {
        success: false,
        error: 'Box IDs are required'
      };
    }

    const db = await initializeBoxDatabase();

    // 鬩･蟠趣ｽ､繝ｻ・帝ｫｯ・､陷ｴ・ｻ邵ｺ蜉ｱﾂ竏ｫ・ｩ・ｺ邵ｺ・ｮ陋滂ｽ､郢ｧ蛛ｵ繝ｵ郢ｧ・｣郢晢ｽｫ郢ｧ・ｿ郢晢ｽｪ郢晢ｽｳ郢ｧ・ｰ
    const uniqueBoxIds = [...new Set(boxIds.filter(id => id && id.trim()))];

    if (uniqueBoxIds.length === 0) {
      return {
        success: false,
        error: 'Valid box IDs are required'
      };
    }

    // IN陷ｿ・･騾包ｽｨ邵ｺ・ｮ郢晏干ﾎ樒ｹ晢ｽｼ郢ｧ・ｹ郢晏ｸ厥晉ｹ敖郢晢ｽｼ郢ｧ蜑・ｽｽ諛医・
    const placeholders = uniqueBoxIds.map(() => '?').join(',');

    const query = `SELECT box_id, name, item_type FROM box_item WHERE box_id IN (${placeholders}) ORDER BY box_id, item_type`;

    const results = await db.all(query, uniqueBoxIds);

    return {
      success: true,
      data: results || []
    };
  } catch (error) {
    console.error('getFileNamesByBoxIds error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * box item邵ｺ・ｮ驍ｨ・ｱ髫ｪ蝓溘Η陜｣・ｱ郢ｧ雋槫徐陟輔・ */
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

    // 驍ｱ荵礼・
    const totalResult = await db.get('SELECT COUNT(*) as count FROM box_item');
    const totalCount = totalResult?.count || 0;

    // item_type陋ｻ・･邵ｺ・ｮ隰ｨ・ｰ
    const itemTypeResult = await db.all(
      'SELECT item_type, COUNT(*) as count FROM box_item GROUP BY item_type'
    );
    const itemTypeCounts: Record<number, number> = {};
    itemTypeResult?.forEach((row: any) => {
      itemTypeCounts[row.item_type] = row.count;
    });

    // owner_id陋ｻ・･邵ｺ・ｮ隰ｨ・ｰ
    const ownerResult = await db.all(
      'SELECT owner_id, COUNT(*) as count FROM box_item GROUP BY owner_id'
    );
    const ownerCounts: Record<string, number> = {};
    ownerResult?.forEach((row: any) => {
      ownerCounts[row.owner_id] = row.count;
    });

    // 陝ｷ・ｳ陜ｮ繝ｻ縺礼ｹｧ・､郢ｧ・ｺ
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
