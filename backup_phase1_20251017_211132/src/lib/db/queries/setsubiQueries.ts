/**
 * 設備製番関連のクエリ関数群
 * 複雑なJOINや特殊ビジネスロジックを含むクエリをここに集約
 */

import { initializeDatabase, DataResult } from '@src/lib/db/connection/db_connection';
import type { Database } from 'sqlite';
import type { SetsubiMaster, SetsubiHistory, SetsubiAssignment, SetsubiWithAssignment } from '@src/types/setsubi';

/**
 * プロジェクトの製番一覧を取得（担当者情報付き）
 * @param projectId - プロジェクトID
 * @returns 製番一覧
 */
export async function getSetsubiWithAssignments(projectId: string): Promise<DataResult<SetsubiWithAssignment[]>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const query = `
      SELECT
        sm.*,
        GROUP_CONCAT(DISTINCT u.name_japanese) as assignee_names,
        COUNT(DISTINCT sa.user_id) as assignee_count
      FROM setsubi_master sm
      LEFT JOIN setsubi_assignment sa ON sm.id = sa.setsubi_id AND sa.status = 'active'
      LEFT JOIN USER u ON sa.user_id = u.user_id
      WHERE EXISTS (
        SELECT 1 FROM setsubi_history sh
        WHERE sh.seiban = sm.seiban AND sh.project_id = ?
      )
      GROUP BY sm.id
      ORDER BY sm.created_at DESC
    `;

    const rows = await db.all(query, [projectId]);

    const result: SetsubiWithAssignment[] = rows.map((row: any) => ({
      id: row.id,
      seiban: row.seiban,
      shohin_category: row.shohin_category,
      setsubi_name: row.setsubi_name,
      parent_seiban: row.parent_seiban,
      location_code: row.location_code,
      created_at: row.created_at,
      updated_at: row.updated_at,
      assignee_count: row.assignee_count || 0,
      current_assignees: row.assignee_names ? row.assignee_names.split(',').map((name: string) => ({ name_japanese: name })) : []
    }));

    return {
      success: true,
      data: result,
      error: null
    };
  } catch (error) {
    console.error('製番一覧取得に失敗しました:', error);
    return {
      success: false,
      error: '製番一覧の取得に失敗しました',
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
 * 製番の詳細情報を取得（担当者詳細付き）
 * @param setsubiId - 設備ID
 * @returns 製番詳細情報
 */
export async function getSetsubiDetail(setsubiId: number): Promise<DataResult<SetsubiWithAssignment>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    // 基本情報取得
    const setsubiQuery = `
      SELECT * FROM setsubi_master WHERE id = ?
    `;
    const setsubiRow = await db.get(setsubiQuery, [setsubiId]);

    if (!setsubiRow) {
      return {
        success: false,
        error: '指定された設備が見つかりません',
        data: null
      };
    }

    // 担当者情報取得
    const assignmentQuery = `
      SELECT
        sa.*,
        u.name_japanese,
        u.bumon,
        u.sitsu,
        u.ka
      FROM setsubi_assignment sa
      JOIN USER u ON sa.user_id = u.user_id
      WHERE sa.setsubi_id = ? AND sa.status = 'active'
      ORDER BY sa.assigned_at DESC
    `;
    const assignments = await db.all(assignmentQuery, [setsubiId]);

    const result: SetsubiWithAssignment = {
      id: setsubiRow.id,
      seiban: setsubiRow.seiban,
      shohin_category: setsubiRow.shohin_category,
      setsubi_name: setsubiRow.setsubi_name,
      parent_seiban: setsubiRow.parent_seiban,
      location_code: setsubiRow.location_code,
      created_at: setsubiRow.created_at,
      updated_at: setsubiRow.updated_at,
      assignments: assignments,
      assignee_count: assignments.length,
      current_assignees: assignments.map((a: any) => ({
        user_id: a.user_id,
        name_japanese: a.name_japanese,
        role: `${a.bumon} ${a.sitsu} ${a.ka}`.trim()
      }))
    };

    return {
      success: true,
      data: result,
      error: null
    };
  } catch (error) {
    console.error('製番詳細取得に失敗しました:', error);
    return {
      success: false,
      error: '製番詳細の取得に失敗しました',
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
 * 製番の使用履歴を取得
 * @param seiban - 製番
 * @returns 製番使用履歴
 */
export async function getSetsubiHistory(seiban: string): Promise<DataResult<SetsubiHistory[]>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const query = `
      SELECT sh.*, p.PROJECT_NAME
      FROM setsubi_history sh
      JOIN PROJECT p ON sh.project_id = p.PROJECT_ID
      WHERE sh.seiban = ?
      ORDER BY sh.created_at DESC
    `;

    const rows = await db.all(query, [seiban]);

    const result: (SetsubiHistory & { project_name?: string })[] = rows.map((row: any) => ({
      id: row.id,
      project_id: row.project_id,
      seiban: row.seiban,
      created_at: row.created_at,
      project_name: row.PROJECT_NAME
    }));

    return {
      success: true,
      data: result,
      error: null
    };
  } catch (error) {
    console.error('製番履歴取得に失敗しました:', error);
    return {
      success: false,
      error: '製番履歴の取得に失敗しました',
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
 * 全設備一覧を取得（担当割り当て用）
 * @returns 設備一覧
 */
export async function getSetsubiList(): Promise<DataResult<SetsubiMaster[]>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const query = `
      SELECT * FROM setsubi_master
      ORDER BY setsubi_name ASC
    `;

    const rows = await db.all(query);

    const setsubiList: SetsubiMaster[] = rows.map((row: any) => ({
      id: row.id,
      seiban: row.seiban,
      shohin_category: row.shohin_category,
      setsubi_name: row.setsubi_name,
      parent_seiban: row.parent_seiban,
      location_code: row.location_code,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));

    return {
      success: true,
      data: setsubiList,
      error: null
    };
  } catch (error) {
    console.error('設備一覧取得に失敗しました:', error);
    return {
      success: false,
      error: '設備一覧の取得に失敗しました',
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
 * 設備担当割り当てを更新
 * @param assignmentId 担当割り当てID
 * @param updates 更新データ
 * @returns 更新結果
 */
export async function updateSetsubiAssignment(
  assignmentId: number,
  updates: {
    assigned_at?: string;
    status?: string;
  }
): Promise<DataResult<SetsubiAssignment>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    // 更新するフィールドを構築
    const updateFields: string[] = [];
    const values: any[] = [];

    if (updates.assigned_at !== undefined) {
      updateFields.push('assigned_at = ?');
      values.push(updates.assigned_at);
    }

    if (updates.status !== undefined) {
      updateFields.push('status = ?');
      values.push(updates.status);
    }

    if (updateFields.length === 0) {
      return {
        success: false,
        error: '更新するフィールドが指定されていません',
        data: null,
      };
    }

    // 更新クエリを実行
    const updateQuery = `
      UPDATE setsubi_assignment
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    values.push(assignmentId);

    const result = await db.run(updateQuery, values);

    if (result.changes === 0) {
      return {
        success: false,
        error: '指定された担当割り当てが見つかりません',
        data: null,
      };
    }

    // 更新した割り当てを取得
    const assignmentQuery = 'SELECT * FROM setsubi_assignment WHERE id = ?';
    const row = await db.get(assignmentQuery, [assignmentId]);

    if (!row) {
      return {
        success: false,
        error: '更新した割り当ての取得に失敗しました',
        data: null,
      };
    }

    const assignment: SetsubiAssignment = {
      id: row.id,
      project_id: row.project_id,
      user_id: row.user_id,
      setsubi_id: row.setsubi_id,
      assigned_at: row.assigned_at,
      status: row.status
    };

    return {
      success: true,
      data: assignment,
      error: null,
    };
  } catch (error) {
    console.error('設備担当割り当ての更新に失敗しました:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'データベースエラーが発生しました',
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