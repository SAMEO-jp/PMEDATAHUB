/**
 * 購入品関連テーブルの作成マイグレーション
 */

import { initializeDatabase, DataResult } from '@src/lib/db/connection/db_connection';
import type { Database } from 'sqlite';

/**
 * 購入品マスターテーブル作成
 */
async function createKounyuMasterTable(db: Database): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS kounyu_master (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT NOT NULL,
      management_number TEXT NOT NULL,
      item_name TEXT NOT NULL,
      contract_number TEXT,
      item_category TEXT NOT NULL,
      setsubi_seiban TEXT,
      responsible_department TEXT,
      drawing_number TEXT,
      display_order INTEGER DEFAULT 0,
      remarks TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(project_id, management_number)
    )
  `;

  await db.run(query);

  // インデックスの作成
  await db.run('CREATE INDEX IF NOT EXISTS idx_kounyu_master_project ON kounyu_master(project_id)');
  await db.run('CREATE INDEX IF NOT EXISTS idx_kounyu_master_management ON kounyu_master(management_number)');
  await db.run('CREATE INDEX IF NOT EXISTS idx_kounyu_master_category ON kounyu_master(item_category)');
  await db.run('CREATE INDEX IF NOT EXISTS idx_kounyu_master_order ON kounyu_master(display_order)');
}

/**
 * 購入品担当テーブル作成
 */
async function createKounyuAssignmentTable(db: Database): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS kounyu_assignment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT NOT NULL,
      kounyu_id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'active',
      FOREIGN KEY (project_id) REFERENCES PROJECT(PROJECT_ID),
      FOREIGN KEY (kounyu_id) REFERENCES kounyu_master(id),
      FOREIGN KEY (user_id) REFERENCES USER(user_id),
      UNIQUE(project_id, kounyu_id, user_id)
    )
  `;

  await db.run(query);

  // インデックスの作成
  await db.run('CREATE INDEX IF NOT EXISTS idx_kounyu_assignment_project ON kounyu_assignment(project_id)');
  await db.run('CREATE INDEX IF NOT EXISTS idx_kounyu_assignment_kounyu ON kounyu_assignment(kounyu_id)');
  await db.run('CREATE INDEX IF NOT EXISTS idx_kounyu_assignment_user ON kounyu_assignment(user_id)');
  await db.run('CREATE INDEX IF NOT EXISTS idx_kounyu_assignment_status ON kounyu_assignment(status)');
}

/**
 * 初期データ投入
 */
async function insertInitialData(db: Database): Promise<void> {
  // サンプル購入品データの投入
  const sampleKounyu = [
    {
      project_id: 'E923BXX215000',
      management_number: 'KOU-001',
      item_name: '制御用モーター',
      contract_number: 'CONT-2024-001',
      item_category: '電気機器',
      setsubi_seiban: 'SEIBAN-001',
      responsible_department: '技術部',
      drawing_number: 'DRW-001',
      display_order: 1,
      remarks: '制御盤用モーター'
    },
    {
      project_id: 'E923BXX215000',
      management_number: 'KOU-002',
      item_name: 'センサーアレイ',
      contract_number: 'CONT-2024-002',
      item_category: '電子部品',
      setsubi_seiban: 'SEIBAN-002',
      responsible_department: '技術部',
      drawing_number: 'DRW-002',
      display_order: 2,
      remarks: '温度・圧力センサー'
    },
    {
      project_id: 'E923BXX215000',
      management_number: 'KOU-003',
      item_name: '配線ケーブル',
      contract_number: null,
      item_category: '電線',
      setsubi_seiban: null,
      responsible_department: '資材部',
      drawing_number: 'DRW-003',
      display_order: 3,
      remarks: '電源・信号用ケーブル'
    }
  ];

  for (const kounyu of sampleKounyu) {
    const exists = await db.get(
      'SELECT id FROM kounyu_master WHERE project_id = ? AND management_number = ?',
      [kounyu.project_id, kounyu.management_number]
    );
    if (!exists) {
      await db.run(
        `INSERT INTO kounyu_master (
          project_id, management_number, item_name, contract_number, item_category,
          setsubi_seiban, responsible_department, drawing_number, display_order, remarks
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          kounyu.project_id,
          kounyu.management_number,
          kounyu.item_name,
          kounyu.contract_number,
          kounyu.item_category,
          kounyu.setsubi_seiban,
          kounyu.responsible_department,
          kounyu.drawing_number,
          kounyu.display_order,
          kounyu.remarks
        ]
      );
    }
  }
}

/**
 * 購入品関連テーブルを作成
 * @returns 作成結果
 */
export async function createKounyuTables(): Promise<DataResult<null>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    // トランザクション開始
    await db.run('BEGIN TRANSACTION');

    // テーブル作成
    await createKounyuMasterTable(db);
    await createKounyuAssignmentTable(db);

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

    console.error('購入品テーブル作成に失敗しました:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '購入品テーブルの作成に失敗しました',
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
 * 購入品関連テーブルの存在確認
 * @returns 確認結果
 */
export async function checkKounyuTablesExist(): Promise<DataResult<boolean>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const tables = ['kounyu_master', 'kounyu_assignment'];
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
