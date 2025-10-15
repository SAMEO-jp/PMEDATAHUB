/* eslint-disable @typescript-eslint/no-explicit-any */

import { initializeDatabase } from '../connection/db_connection';
import { DALResponse } from '@src/lib/types/api';

/*********************************************************
 * 指定されたテーブルを削除する
 * @param tableName - 削除対象のテーブル名
 * @returns 削除結果（成功/失敗、エラーメッセージ）
 *********************************************************/
export async function deleteTable(tableName: string): Promise<DALResponse<null>> {
  let db: any = null;
  try {
    db = await initializeDatabase();
    const query = `DROP TABLE IF EXISTS ${tableName}`;
    await db.run(query);
    return {
      success: true,
      data: null
    };
  } catch (error) {
    console.error('テーブルの削除に失敗しました:', error);
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
