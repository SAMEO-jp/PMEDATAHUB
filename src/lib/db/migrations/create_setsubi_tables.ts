/**
 * 設備製番関連テーブルの作成マイグレーション
 */

import { initializeDatabase, DataResult } from '@src/lib/db/connection/db_connection';
import type { Database } from 'sqlite';

/**
 * 製番マスターテーブル作成
 */
async function createSetsubiMasterTable(db: Database): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS setsubi_master (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seiban VARCHAR(50) NOT NULL UNIQUE,
      shohin_category VARCHAR(100),
      setsubi_name VARCHAR(200) NOT NULL,
      parent_seiban VARCHAR(50),
      location_code VARCHAR(50),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await db.run(query);

  // インデックスの作成
  await db.run('CREATE INDEX IF NOT EXISTS idx_setsubi_master_seiban ON setsubi_master(seiban)');
  await db.run('CREATE INDEX IF NOT EXISTS idx_setsubi_master_parent ON setsubi_master(parent_seiban)');
}

/**
 * 製番履歴テーブル作成
 */
async function createSetsubiHistoryTable(db: Database): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS setsubi_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id VARCHAR(50) NOT NULL,
      seiban VARCHAR(50) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES PROJECT(PROJECT_ID),
      UNIQUE(project_id, seiban)
    )
  `;

  await db.run(query);

  // インデックスの作成
  await db.run('CREATE INDEX IF NOT EXISTS idx_setsubi_history_project ON setsubi_history(project_id)');
  await db.run('CREATE INDEX IF NOT EXISTS idx_setsubi_history_seiban ON setsubi_history(seiban)');
}

/**
 * 製番担当テーブル作成
 */
async function createSetsubiAssignmentTable(db: Database): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS setsubi_assignment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id VARCHAR(50) NOT NULL,
      user_id VARCHAR(50) NOT NULL,
      setsubi_id INTEGER NOT NULL,
      assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(20) DEFAULT 'active',
      FOREIGN KEY (project_id) REFERENCES PROJECT(PROJECT_ID),
      FOREIGN KEY (user_id) REFERENCES USER(user_id),
      FOREIGN KEY (setsubi_id) REFERENCES setsubi_master(id),
      UNIQUE(project_id, user_id, setsubi_id)
    )
  `;

  await db.run(query);

  // インデックスの作成
  await db.run('CREATE INDEX IF NOT EXISTS idx_setsubi_assignment_project ON setsubi_assignment(project_id)');
  await db.run('CREATE INDEX IF NOT EXISTS idx_setsubi_assignment_user ON setsubi_assignment(user_id)');
  await db.run('CREATE INDEX IF NOT EXISTS idx_setsubi_assignment_setsubi ON setsubi_assignment(setsubi_id)');
  await db.run('CREATE INDEX IF NOT EXISTS idx_setsubi_assignment_status ON setsubi_assignment(status)');
}

/**
 * 初期データ投入
 */
async function insertInitialData(db: Database): Promise<void> {
  // サンプル製番データの投入
  const sampleSetsubi = [
    {
      seiban: 'SEIBAN-001',
      shohin_category: '電子機器',
      setsubi_name: '制御盤A',
      parent_seiban: null,
      location_code: 'AREA-A01'
    },
    {
      seiban: 'SEIBAN-002',
      shohin_category: '電子機器',
      setsubi_name: '制御盤B',
      parent_seiban: null,
      location_code: 'AREA-A02'
    },
    {
      seiban: 'SEIBAN-003',
      shohin_category: '機械部品',
      setsubi_name: 'モーター制御ユニット',
      parent_seiban: 'SEIBAN-001',
      location_code: 'AREA-B01'
    },
    {
      seiban: 'SEIBAN-004',
      shohin_category: '機械部品',
      setsubi_name: 'センサーアレイ',
      parent_seiban: 'SEIBAN-002',
      location_code: 'AREA-B02'
    }
  ];

  for (const setsubi of sampleSetsubi) {
    const exists = await db.get('SELECT id FROM setsubi_master WHERE seiban = ?', [setsubi.seiban]);
    if (!exists) {
      await db.run(
        `INSERT INTO setsubi_master (seiban, shohin_category, setsubi_name, parent_seiban, location_code)
         VALUES (?, ?, ?, ?, ?)`,
        [setsubi.seiban, setsubi.shohin_category, setsubi.setsubi_name, setsubi.parent_seiban, setsubi.location_code]
      );
    }
  }
}

/**
 * 製番関連テーブルを作成
 * @returns 作成結果
 */
export async function createSetsubiTables(): Promise<DataResult<null>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    // トランザクション開始
    await db.run('BEGIN TRANSACTION');

    // テーブル作成
    await createSetsubiMasterTable(db);
    await createSetsubiHistoryTable(db);
    await createSetsubiAssignmentTable(db);

    // 初期データ投入
    await insertInitialData(db);

    // トランザクションコミット
    await db.run('COMMIT');

    return {
      success: true,
      data: null,
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

    console.error('製番テーブル作成に失敗しました:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '製番テーブルの作成に失敗しました',
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

/**
 * 製番関連テーブルの存在確認
 * @returns 確認結果
 */
export async function checkSetsubiTablesExist(): Promise<DataResult<boolean>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const tables = ['setsubi_master', 'setsubi_history', 'setsubi_assignment'];
    let allExist = true;

    for (const tableName of tables) {
      const result = await db.get(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
        [tableName]
      );
      if (!result) {
        allExist = false;
        break;
      }
    }

    return {
      success: true,
      data: allExist,
      error: null
    };
  } catch (error) {
    console.error('テーブル存在確認に失敗しました:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'テーブル存在確認に失敗しました',
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
