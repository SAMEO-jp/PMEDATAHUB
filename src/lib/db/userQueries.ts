/**
 * @file ユーザー関連のデータアクセス層
 * USERテーブルに対するクエリ操作を提供
 */

import { GetConditionData } from '@src/lib/db/db_GetData';

/**
 * 名前による部分一致でユーザーを検索
 * @param name 検索する名前（部分一致）
 * @returns 検索結果（最大10件）
 */
export async function searchUsersByName(name: string) {
  try {
    console.log('Searching users by name:', name);
    
    const result = await GetConditionData(
      'name_japanese LIKE ?',
      [`%${name}%`],
      { 
        tableName: 'USER',
        idColumn: 'user_id'
      }
    );
    
    console.log('User search result:', result);
    
    // データが取得できた場合、必要な項目のみに絞り込み
    if (result.success && result.data && Array.isArray(result.data)) {
      const filteredData = result.data.slice(0, 10).map((user: any) => ({
        user_id: user.user_id,
        name_japanese: user.name_japanese,
        bumon: user.bumon || '',
        syokui: user.syokui || ''
      }));
      
      return {
        ...result,
        data: filteredData
      };
    }
    
    return result;
  } catch (error) {
    console.error('Error in searchUsersByName:', error);
    return {
      success: false,
      data: null,
      error: {
        code: 'SEARCH_ERROR',
        message: 'ユーザー検索中にエラーが発生しました'
      }
    };
  }
}

/**
 * UserIDでユーザーを取得
 * @param userId ユーザーID
 * @returns ユーザー情報
 */
export async function getUserById(userId: string) {
  try {
    console.log('Getting user by ID:', userId);
    
    const result = await GetConditionData(
      'user_id = ?',
      [userId],
      { 
        tableName: 'USER',
        idColumn: 'user_id'
      }
    );
    
    console.log('Get user result:', result);
    return result;
  } catch (error) {
    console.error('Error in getUserById:', error);
    return {
      success: false,
      data: null,
      error: {
        code: 'GET_USER_ERROR',
        message: 'ユーザー取得中にエラーが発生しました'
      }
    };
  }
}

/**
 * ユーザーの存在確認
 * @param userId ユーザーID
 * @returns ユーザーが存在するかどうか
 */
export async function validateUser(userId: string) {
  try {
    console.log('Validating user:', userId);
    
    const result = await GetConditionData(
      'user_id = ?',
      [userId],
      { 
        tableName: 'USER',
        idColumn: 'user_id'
      }
    );
    
    const isValid = result.success && result.data && Array.isArray(result.data) && result.data.length > 0;
    console.log('User validation result:', isValid);
    
    return {
      success: true,
      data: { isValid, userId }
    };
  } catch (error) {
    console.error('Error in validateUser:', error);
    return {
      success: false,
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'ユーザー検証中にエラーが発生しました'
      }
    };
  }
}