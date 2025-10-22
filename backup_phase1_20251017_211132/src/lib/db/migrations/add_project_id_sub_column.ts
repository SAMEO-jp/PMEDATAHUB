/**
 * プロジェクトテーブルにプロジェクトIDサブカラムを追加するマイグレーション
 */

import { initializeDatabase, DataResult } from '@src/lib/db/connection/db_connection';
import type { Database } from 'sqlite';

/**
 * プロジェクトテーブルにPROJECT_ID_SUBカラムを追加
 */
export async function addProjectIdSubColumn(): Promise<DataResult<null>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    // カラムが既に存在するかチェック
    const checkColumnQuery = `
      PRAGMA table_info(PROJECT)
    `;
    const columns = await db.all(checkColumnQuery);
    const columnExists = columns.some((col: any) => col.name === 'PROJECT_ID_SUB');

    if (columnExists) {
      return {
        success: true,
        data: null,
        error: null
      };
    }

    // PROJECT_ID_SUBカラムを追加
    const addColumnQuery = `
      ALTER TABLE PROJECT ADD COLUMN PROJECT_ID_SUB TEXT
    `;

    await db.run(addColumnQuery);

    // インデックスを作成（必要に応じて）
    await db.run('CREATE INDEX IF NOT EXISTS idx_project_id_sub ON PROJECT(PROJECT_ID_SUB)');

    return {
      success: true,
      data: null,
      error: null
    };
  } catch (error) {
    console.error('PROJECT_ID_SUBカラム追加エラー:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'カラム追加に失敗しました'
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

/**
 * マイグレーション実行
 */
export async function runProjectIdSubMigration(): Promise<DataResult<null>> {
  try {
    const result = await addProjectIdSubColumn();
    
    if (result.success) {
      console.log('✅ PROJECT_ID_SUBカラムの追加が完了しました');
    } else {
      console.error('❌ PROJECT_ID_SUBカラムの追加に失敗しました:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('マイグレーション実行エラー:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'マイグレーション実行に失敗しました'
    };
  }
}
