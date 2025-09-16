/**
 * 設備製番関連のCRUD操作関数
 */

import { initializeDatabase, DataResult } from '@src/lib/db/connection/db_connection';
import type { Database } from 'sqlite';
import type { SetsubiMaster, SetsubiHistory, SetsubiAssignment, SetsubiFormData } from '@src/types/setsubi';

/**
 * 製番マスターを作成
 * @param setsubiData - 製番データ
 * @returns 作成結果
 */
export async function createSetsubiMaster(setsubiData: SetsubiFormData): Promise<DataResult<SetsubiMaster>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const query = `
      INSERT INTO setsubi_master (
        seiban, shohin_category, setsubi_name, parent_seiban, location_code,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;

    const result = await db.run(query, [
      setsubiData.seiban,
      setsubiData.shohin_category || null,
      setsubiData.setsubi_name,
      setsubiData.parent_seiban || null,
      setsubiData.location_code || null
    ]);

    if (result.lastID) {
      // 作成したデータを取得
      const selectQuery = 'SELECT * FROM setsubi_master WHERE id = ?';
      const newRecord = await db.get<SetsubiMaster>(selectQuery, [result.lastID]);

      return {
        success: true,
        data: newRecord as SetsubiMaster,
        error: null
      };
    } else {
      return {
        success: false,
        error: '製番の作成に失敗しました',
        data: null
      };
    }
  } catch (error) {
    console.error('製番作成に失敗しました:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '製番の作成に失敗しました',
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
 * 製番マスターを更新
 * @param id - 設備ID
 * @param setsubiData - 更新データ
 * @returns 更新結果
 */
export async function updateSetsubiMaster(id: number, setsubiData: Partial<SetsubiFormData>): Promise<DataResult<SetsubiMaster>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const updateFields = [];
    const values = [];

    if (setsubiData.seiban !== undefined) {
      updateFields.push('seiban = ?');
      values.push(setsubiData.seiban);
    }
    if (setsubiData.shohin_category !== undefined) {
      updateFields.push('shohin_category = ?');
      values.push(setsubiData.shohin_category || null);
    }
    if (setsubiData.setsubi_name !== undefined) {
      updateFields.push('setsubi_name = ?');
      values.push(setsubiData.setsubi_name);
    }
    if (setsubiData.parent_seiban !== undefined) {
      updateFields.push('parent_seiban = ?');
      values.push(setsubiData.parent_seiban || null);
    }
    if (setsubiData.location_code !== undefined) {
      updateFields.push('location_code = ?');
      values.push(setsubiData.location_code || null);
    }

    if (updateFields.length === 0) {
      return {
        success: false,
        error: '更新するフィールドが指定されていません',
        data: null
      };
    }

    updateFields.push('updated_at = datetime(\'now\')');

    const query = `UPDATE setsubi_master SET ${updateFields.join(', ')} WHERE id = ?`;
    values.push(id);

    await db.run(query, values);

    // 更新したデータを取得
    const selectQuery = 'SELECT * FROM setsubi_master WHERE id = ?';
    const updatedRecord = await db.get<SetsubiMaster>(selectQuery, [id]);

    return {
      success: true,
      data: updatedRecord as SetsubiMaster,
      error: null
    };
  } catch (error) {
    console.error('製番更新に失敗しました:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '製番の更新に失敗しました',
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
 * 製番マスターを削除
 * @param id - 設備ID
 * @returns 削除結果
 */
export async function deleteSetsubiMaster(id: number): Promise<DataResult<null>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    // 関連する担当割り当てを先に削除
    await db.run('DELETE FROM setsubi_assignment WHERE setsubi_id = ?', [id]);

    // 製番マスターを削除
    await db.run('DELETE FROM setsubi_master WHERE id = ?', [id]);

    return {
      success: true,
      data: null,
      error: null
    };
  } catch (error) {
    console.error('製番削除に失敗しました:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '製番の削除に失敗しました',
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
 * 製番をプロジェクトに登録（ヒストリー作成）
 * @param projectId - プロジェクトID
 * @param seiban - 製番
 * @returns 登録結果
 */
export async function registerSetsubiToProject(projectId: string, seiban: string): Promise<DataResult<SetsubiHistory>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    // 製番マスターが存在するか確認
    const masterExists = await db.get('SELECT id FROM setsubi_master WHERE seiban = ?', [seiban]);
    if (!masterExists) {
      return {
        success: false,
        error: '指定された製番はマスターに登録されていません',
        data: null
      };
    }

    // 既にプロジェクトに登録されていないか確認
    const alreadyExists = await db.get(
      'SELECT id FROM setsubi_history WHERE project_id = ? AND seiban = ?',
      [projectId, seiban]
    );

    if (alreadyExists) {
      return {
        success: false,
        error: 'この製番は既にプロジェクトに登録されています',
        data: null
      };
    }

    const query = `
      INSERT INTO setsubi_history (project_id, seiban, created_at)
      VALUES (?, ?, datetime('now'))
    `;

    const result = await db.run(query, [projectId, seiban]);

    if (result.lastID) {
      const selectQuery = 'SELECT * FROM setsubi_history WHERE id = ?';
      const newRecord = await db.get<SetsubiHistory>(selectQuery, [result.lastID]);

      return {
        success: true,
        data: newRecord as SetsubiHistory,
        error: null
      };
    } else {
      return {
        success: false,
        error: '製番のプロジェクト登録に失敗しました',
        data: null
      };
    }
  } catch (error) {
    console.error('製番プロジェクト登録に失敗しました:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '製番のプロジェクト登録に失敗しました',
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
 * 製番担当を割り当て
 * @param assignmentData - 担当割り当てデータ
 * @returns 割り当て結果
 */
export async function assignSetsubiToUser(assignmentData: {
  project_id: string;
  user_id: string;
  setsubi_id: number;
  status?: 'active' | 'inactive';
}): Promise<DataResult<SetsubiAssignment>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    // 既に同じ担当が存在するか確認
    const existing = await db.get(
      'SELECT id FROM setsubi_assignment WHERE project_id = ? AND user_id = ? AND setsubi_id = ?',
      [assignmentData.project_id, assignmentData.user_id, assignmentData.setsubi_id]
    );

    if (existing) {
      // 既存の担当を更新
      const updateQuery = `
        UPDATE setsubi_assignment
        SET status = ?, assigned_at = datetime('now')
        WHERE id = ?
      `;
      await db.run(updateQuery, [assignmentData.status || 'active', existing.id]);

      const selectQuery = 'SELECT * FROM setsubi_assignment WHERE id = ?';
      const updatedRecord = await db.get<SetsubiAssignment>(selectQuery, [existing.id]);

      return {
        success: true,
        data: updatedRecord as SetsubiAssignment,
        error: null
      };
    } else {
      // 新規作成
      const insertQuery = `
        INSERT INTO setsubi_assignment (project_id, user_id, setsubi_id, status, assigned_at)
        VALUES (?, ?, ?, ?, datetime('now'))
      `;

      const result = await db.run(insertQuery, [
        assignmentData.project_id,
        assignmentData.user_id,
        assignmentData.setsubi_id,
        assignmentData.status || 'active'
      ]);

      if (result.lastID) {
        const selectQuery = 'SELECT * FROM setsubi_assignment WHERE id = ?';
        const newRecord = await db.get<SetsubiAssignment>(selectQuery, [result.lastID]);

        return {
          success: true,
          data: newRecord as SetsubiAssignment,
          error: null
        };
      } else {
        return {
          success: false,
          error: '担当割り当てに失敗しました',
          data: null
        };
      }
    }
  } catch (error) {
    console.error('担当割り当てに失敗しました:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '担当割り当てに失敗しました',
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
 * 製番担当を解除
 * @param assignmentId - 担当割り当てID
 * @returns 解除結果
 */
export async function removeSetsubiAssignment(assignmentId: number): Promise<DataResult<null>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    await db.run('DELETE FROM setsubi_assignment WHERE id = ?', [assignmentId]);

    return {
      success: true,
      data: null,
      error: null
    };
  } catch (error) {
    console.error('担当解除に失敗しました:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '担当解除に失敗しました',
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
