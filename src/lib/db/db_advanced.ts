import { initializeDatabase, DataResult } from '@src/lib/db/db_connection';
import type { Database } from 'sqlite';

/*********************************************************
 * トランザクションを実行する
 * @param callback - トランザクション内で実行する処理
 * @returns 実行結果（成功/失敗、データ、エラーメッセージ）
 *********************************************************/
export async function runTransaction<T>(
  callback: (db: Database) => Promise<T>
): Promise<DataResult<T>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    await db.run('BEGIN TRANSACTION');
    
    const result = await callback(db);
    
    await db.run('COMMIT');
    return {
      success: true,
      data: result,
      error: null
    };
  } catch (error) {
    if (db) {
      try {
        await db.run('ROLLBACK');
      } catch (rollbackError) {
        console.error('ロールバックに失敗しました:', rollbackError);
      }
    }
    console.error('トランザクション実行中にエラーが発生しました:', error);
    return {
      success: false,
      error: 'データベースエラーが発生しました',
      data: null
    };
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeErr) {
        console.warn('DBクローズ時にエラーが発生しました:', closeErr);
      }
    }
  }
}

/*********************************************************
 * レコードの存在確認
 * @param table - テーブル名
 * @param id - 確認対象のID
 * @param idColumn - IDカラム名（デフォルト: 'id'）
 * @returns 存在確認結果（成功/失敗、存在有無、エラーメッセージ）
 *********************************************************/
export async function exists(
  table: string,
  id: string | number,
  idColumn = 'id'
): Promise<DataResult<boolean>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    const query = `SELECT 1 FROM ${table} WHERE ${idColumn} = ? LIMIT 1`;
    const result = await db.get(query, [id]);
    
    return {
      success: true,
      data: !!result,
      error: null
    };
  } catch (error) {
    console.error('レコードの存在確認に失敗しました:', error);
    return {
      success: false,
      error: 'データベースエラーが発生しました',
      data: null
    };
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeErr) {
        console.warn('DBクローズ時にエラーが発生しました:', closeErr);
      }
    }
  }
}

/*********************************************************
 * 条件付き件数取得
 * @param table - テーブル名
 * @param conditionExpr - 検索条件（WHERE句の条件、オプション）
 * @param conditionValues - 検索条件の値（オプション）
 * @returns 件数取得結果（成功/失敗、件数、エラーメッセージ）
 *********************************************************/
export async function countRows(
  table: string,
  conditionExpr?: string,
  conditionValues: (string | number)[] = []
): Promise<DataResult<number>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    const whereClause = conditionExpr ? `WHERE ${conditionExpr}` : '';
    const query = `SELECT COUNT(*) as count FROM ${table} ${whereClause}`;
    
    const result = await db.get(query, conditionValues);
    return {
      success: true,
      data: result.count,
      error: null
    };
  } catch (error) {
    console.error('件数取得に失敗しました:', error);
    return {
      success: false,
      error: 'データベースエラーが発生しました',
      data: null
    };
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeErr) {
        console.warn('DBクローズ時にエラーが発生しました:', closeErr);
      }
    }
  }
}

/*********************************************************
 * ページネーション
 * @param table - テーブル名
 * @param page - ページ番号（1から開始）
 * @param limit - 1ページあたりの件数
 * @param where - 検索条件（WHERE句の条件、オプション）
 * @param whereValues - 検索条件の値（オプション）
 * @returns ページネーション結果（成功/失敗、データ、総件数、エラーメッセージ）
 *********************************************************/
export async function paginate<T>(
  table: string,
  page: number,
  limit: number,
  where?: string,
  whereValues: (string | number)[] = []
): Promise<DataResult<{ data: T[]; total: number; page: number; limit: number }>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    const offset = (page - 1) * limit;
    const whereClause = where ? `WHERE ${where}` : '';
    
    // 総件数を取得
    const countQuery = `SELECT COUNT(*) as total FROM ${table} ${whereClause}`;
    const countResult = await db.get(countQuery, whereValues);
    const total = countResult.total;
    
    // データを取得
    const query = `
      SELECT * 
      FROM ${table} 
      ${whereClause}
      LIMIT ? OFFSET ?
    `;
    const data = await db.all(query, [...whereValues, limit, offset]);
    
    return {
      success: true,
      data: {
        data: data as T[],
        total,
        page,
        limit
      },
      error: null
    };
  } catch (error) {
    console.error('ページネーション処理に失敗しました:', error);
    return {
      success: false,
      error: 'データベースエラーが発生しました',
      data: null
    };
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeErr) {
        console.warn('DBクローズ時にエラーが発生しました:', closeErr);
      }
    }
  }
} 