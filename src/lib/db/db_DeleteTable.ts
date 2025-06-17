/* eslint-disable @typescript-eslint/no-explicit-any */

import { initializeDatabase, DataResult } from '@src/lib/db/db_connection';

/*********************************************************
 * データベース内の全テーブル一覧を取得する
 * @returns 取得結果（成功/失敗、データ、エラーメッセージ）
 **********************************************************/
export async function GetAllTables(): Promise<DataResult<string[]>> {
  let db: any = null;
  try {
    db = await initializeDatabase();
    const query = `
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' 
      AND name NOT LIKE 'sqlite_%'
    `;
    const result = await db.all(query);
    const tableNames = result.map((row: any) => row.name);
    return {
      success: true,
      error: null,
      count: tableNames.length,
      data: tableNames
    };
  } catch (error) {
    console.error('テーブル一覧の取得に失敗しました:', error);
    return {
      success: false,
      error: 'データベースエラーが発生しました',
      count: 0,
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
 * 指定されたテーブルを削除する
 * @param tableName - 削除対象のテーブル名
 * @returns 削除結果（成功/失敗、エラーメッセージ）
 **********************************************************/
export async function DeleteTable(tableName: string): Promise<DataResult<null>> {
  let db: any = null;
  try {
    db = await initializeDatabase();
    const query = `DROP TABLE IF EXISTS ${tableName}`;
    await db.run(query);
    return {
      success: true,
      error: null,
      data: null
    };
  } catch (error) {
    console.error('テーブルの削除に失敗しました:', error);
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