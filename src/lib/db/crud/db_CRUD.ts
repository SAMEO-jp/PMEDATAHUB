import { initializeDatabase } from '../connection/db_connection';
import { DALResponse } from '@src/lib/types/api';
import type { Database } from 'sqlite';

/*********************************************************
 * データの挿入（単一レコード）
 * @param table - テーブル名
 * @param data - 挿入するデータ
 * @returns 挿入結果（成功/失敗、データ、エラーメッセージ）
 *********************************************************/
export async function insertData<T extends Record<string, unknown>>(table: string, data: T): Promise<DALResponse<T>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    const result = await db.run(query, values);

    return {
      success: true,
      data: { ...data, id: result.lastID } as T,
    };
  } catch (error) {
    console.error('データの挿入に失敗しました:', error);
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'データベースエラーが発生しました'
      }
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
 * IDでデータを更新
 * @param table - テーブル名
 * @param id - 更新対象のID
 * @param updates - 更新するデータ
 * @param idColumn - IDカラム名（デフォルト: 'id'）
 * @returns 更新結果（成功/失敗、データ、エラーメッセージ）
 *********************************************************/
export async function updateDataById<T extends Record<string, unknown>>(
  table: string,
  id: string | number,
  updates: Partial<T>,
  idColumn = 'id'
): Promise<DataResult<T>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    const keys = Object.keys(updates);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    const query = `UPDATE ${table} SET ${setClause} WHERE ${idColumn} = ?`;
    await db!.run(query, values);

    return {
      success: true,
      data: updates as T,
      error: null,
    };
  } catch (error) {
    console.error('データの更新に失敗しました:', error);
    return {
      success: false,
      error: 'データベースエラーが発生しました',
      data: null,
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
 * IDでデータを削除
 * @param table - テーブル名
 * @param id - 削除対象のID
 * @param idColumn - IDカラム名（デフォルト: 'id'）
 * @returns 削除結果（成功/失敗、エラーメッセージ）
 *********************************************************/
export async function deleteById(
  table: string,
  id: string | number,
  idColumn = 'id'
): Promise<DataResult<null>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    const query = `DELETE FROM ${table} WHERE ${idColumn} = ?`;
    await db!.run(query, [id]);

    return {
      success: true,
      error: null,
      data: null,
    };
  } catch (error) {
    console.error('データの削除に失敗しました:', error);
    return {
      success: false,
      error: 'データベースエラーが発生しました',
      data: null,
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
 * 単一レコード取得
 * @param table - テーブル名
 * @param id - 取得対象のID
 * @param idColumn - IDカラム名（デフォルト: 'id'）
 * @returns 取得結果（成功/失敗、データ、エラーメッセージ）
 *********************************************************/
export async function getRecord<T>(
  table: string, 
  id: number, 
  idColumn = 'id'
): Promise<{ success: boolean; data?: T; error?: { code: string; message: string } }> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    const query = `SELECT * FROM ${table} WHERE ${idColumn} = ?`;
    const result = await db!.get(query, [id]);

    if (!result) {
      return {
        success: false,
        error: {
          code: 'RECORD_NOT_FOUND',
          message: `Record with id ${id} not found in ${table}`
        }
      };
    }

    return {
      success: true,
      data: result as T
    };
  } catch (error) {
    console.error('データの取得に失敗しました:', error);
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown database error'
      }
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
 * レコード作成
 * @param table - テーブル名
 * @param data - 作成するデータ
 * @returns 作成結果（成功/失敗、データ、エラーメッセージ）
 *********************************************************/
export async function createRecord<T extends Record<string, unknown>>(
  table: string, 
  data: T
): Promise<{ success: boolean; data?: T; error?: { code: string; message: string } }> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );

    const columns = Object.keys(filteredData).join(', ');
    const placeholders = Object.keys(filteredData).map(() => '?').join(', ');
    const values = Object.values(filteredData);

    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    const result = await db!.run(query, values);

    return {
      success: true,
      data: { ...data, id: result.lastID } as T
    };
  } catch (error) {
    console.error('データの作成に失敗しました:', error);
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown database error'
      }
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
 * レコード更新
 * @param table - テーブル名
 * @param id - 更新対象のID
 * @param data - 更新するデータ
 * @param idColumn - IDカラム名（デフォルト: 'id'）
 * @returns 更新結果（成功/失敗、データ、エラーメッセージ）
 *********************************************************/
export async function updateRecord<T>(
  table: string,
  id: number,
  data: Partial<T>,
  idColumn = 'id'
): Promise<DALResponse<T>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    const keys = Object.keys(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];

    const query = `UPDATE ${table} SET ${setClause} WHERE ${idColumn} = ?`;
    await db!.run(query, values);

    return {
      success: true,
      data: data as T
    };
  } catch (error) {
    console.error('データの更新に失敗しました:', error);
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown database error'
      }
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
 * レコード削除
 * @param table - テーブル名
 * @param id - 削除対象のID
 * @param idColumn - IDカラム名（デフォルト: 'id'）
 * @returns 削除結果（成功/失敗、エラーメッセージ）
 *********************************************************/
export async function deleteRecord(
  table: string,
  id: number,
  idColumn = 'id'
): Promise<DALResponse<null>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    const query = `DELETE FROM ${table} WHERE ${idColumn} = ?`;
    await db!.run(query, [id]);

    return {
      success: true,
      data: null
    };
  } catch (error) {
    console.error('データの削除に失敗しました:', error);
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown database error'
      }
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
 * 全レコード取得（カスタムクエリ対応）
 * @param table - テーブル名
 * @param query - カスタムクエリ
 * @param values - クエリパラメータ
 * @returns 取得結果（成功/失敗、データ、エラーメッセージ）
 *********************************************************/
export async function getAllRecords<T>(
  table: string, 
  query?: string, 
  values: unknown[] = []
): Promise<{ success: boolean; data?: T[]; error?: { code: string; message: string } }> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    const sql = query || `SELECT * FROM ${table}`;
    const result = await db!.all(sql, values);

    return {
      success: true,
      data: result as T[]
    };
  } catch (error) {
    console.error('データの取得に失敗しました:', error);
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown database error'
      }
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
 * カスタムクエリ実行（INSERT、UPDATE、DELETE等）
 * @param query - 実行するSQLクエリ
 * @param values - クエリパラメータ
 * @returns 実行結果（成功/失敗、エラーメッセージ）
 *********************************************************/
export async function executeParameterizedQuery(
  query: string,
  values: unknown[] = []
): Promise<DALResponse<null>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    await db!.run(query, values);

    return {
      success: true,
      data: null
    };
  } catch (error) {
    console.error('クエリの実行に失敗しました:', error);
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown database error'
      }
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
