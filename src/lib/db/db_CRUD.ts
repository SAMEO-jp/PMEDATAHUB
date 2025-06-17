import { initializeDatabase, DataResult } from '@src/lib/db/db_connection';
import type { Database } from 'sqlite';

/*********************************************************
 * データの挿入（単一レコード）
 * @param table - テーブル名
 * @param data - 挿入するデータ
 * @returns 挿入結果（成功/失敗、データ、エラーメッセージ）
 *********************************************************/
export async function insertData<T extends Record<string, unknown>>(table: string, data: T): Promise<DataResult<T>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    const result = await db!.run(query, values);

    return {
      success: true,
      data: { ...data, id: result.lastID } as T,
      error: null,
    };
  } catch (error) {
    console.error('データの挿入に失敗しました:', error);
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
