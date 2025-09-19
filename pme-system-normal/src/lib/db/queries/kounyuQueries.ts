/**
 * 購入品関連のクエリ関数群
 * 複雑なJOINや特殊ビジネスロジックを含むクエリをここに集約
 */

import { initializeDatabase, DataResult } from '@src/lib/db/connection/db_connection';
import type { Database } from 'sqlite';
import type { KounyuMaster, KounyuAssignment, KounyuWithAssignment } from '@src/types/kounyu';

/**
 * プロジェクトの購入品一覧を取得（担当者情報付き）
 * @param projectId - プロジェクトID
 * @returns 購入品一覧
 */
export async function getKounyuWithAssignments(projectId: string): Promise<DataResult<KounyuWithAssignment[]>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const query = `
      SELECT
        km.*,
        GROUP_CONCAT(DISTINCT u.name_japanese) as assignee_names,
        COUNT(DISTINCT ka.user_id) as assignee_count
      FROM kounyu_master km
      LEFT JOIN kounyu_assignment ka ON km.id = ka.kounyu_id AND ka.status = 'active'
      LEFT JOIN USER u ON ka.user_id = u.user_id
      WHERE km.project_id = ?
      GROUP BY km.id
      ORDER BY km.display_order ASC, km.created_at DESC
    `;

    const rows = await db.all(query, [projectId]);

    const result: KounyuWithAssignment[] = rows.map((row: any) => ({
      id: row.id,
      project_id: row.project_id,
      management_number: row.management_number,
      item_name: row.item_name,
      contract_number: row.contract_number,
      item_category: row.item_category,
      setsubi_seiban: row.setsubi_seiban,
      responsible_department: row.responsible_department,
      drawing_number: row.drawing_number,
      display_order: row.display_order,
      remarks: row.remarks,
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
    console.error('購入品一覧取得に失敗しました:', error);
    return {
      success: false,
      error: '購入品一覧の取得に失敗しました',
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
 * 購入品の詳細情報を取得（担当者詳細付き）
 * @param kounyuId - 購入品ID
 * @returns 購入品詳細情報
 */
export async function getKounyuDetail(kounyuId: number): Promise<DataResult<KounyuWithAssignment>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    // 基本情報取得
    const kounyuQuery = `
      SELECT * FROM kounyu_master WHERE id = ?
    `;
    const kounyuRow = await db.get(kounyuQuery, [kounyuId]);

    if (!kounyuRow) {
      return {
        success: false,
        error: '指定された購入品が見つかりません',
        data: null
      };
    }

    // 担当者情報取得
    const assignmentQuery = `
      SELECT
        ka.*,
        u.name_japanese,
        u.bumon,
        u.sitsu,
        u.ka
      FROM kounyu_assignment ka
      JOIN USER u ON ka.user_id = u.user_id
      WHERE ka.kounyu_id = ? AND ka.status = 'active'
      ORDER BY ka.assigned_at DESC
    `;
    const assignments = await db.all(assignmentQuery, [kounyuId]);

    const result: KounyuWithAssignment = {
      id: kounyuRow.id,
      project_id: kounyuRow.project_id,
      management_number: kounyuRow.management_number,
      item_name: kounyuRow.item_name,
      contract_number: kounyuRow.contract_number,
      item_category: kounyuRow.item_category,
      setsubi_seiban: kounyuRow.setsubi_seiban,
      responsible_department: kounyuRow.responsible_department,
      drawing_number: kounyuRow.drawing_number,
      display_order: kounyuRow.display_order,
      remarks: kounyuRow.remarks,
      created_at: kounyuRow.created_at,
      updated_at: kounyuRow.updated_at,
      assignments: assignments,
      assignee_count: assignments.length,
      current_assignees: assignments.map((a: any) => ({
        user_id: a.user_id,
        name_japanese: a.name_japanese,
        department: `${a.bumon} ${a.sitsu} ${a.ka}`.trim()
      }))
    };

    return {
      success: true,
      data: result,
      error: null
    };
  } catch (error) {
    console.error('購入品詳細取得に失敗しました:', error);
    return {
      success: false,
      error: '購入品詳細の取得に失敗しました',
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
 * 全購入品一覧を取得（担当割り当て用）
 * @returns 購入品一覧
 */
export async function getKounyuList(): Promise<DataResult<KounyuMaster[]>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const query = `
      SELECT * FROM kounyu_master
      ORDER BY item_name ASC
    `;

    const rows = await db.all(query);

    const kounyuList: KounyuMaster[] = rows.map((row: any) => ({
      id: row.id,
      project_id: row.project_id,
      management_number: row.management_number,
      item_name: row.item_name,
      contract_number: row.contract_number,
      item_category: row.item_category,
      setsubi_seiban: row.setsubi_seiban,
      responsible_department: row.responsible_department,
      drawing_number: row.drawing_number,
      display_order: row.display_order,
      remarks: row.remarks,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));

    return {
      success: true,
      data: kounyuList,
      error: null
    };
  } catch (error) {
    console.error('購入品一覧取得に失敗しました:', error);
    return {
      success: false,
      error: '購入品一覧の取得に失敗しました',
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
 * 購入品担当割り当てを更新
 * @param assignmentId 担当割り当てID
 * @param updates 更新データ
 * @returns 更新結果
 */
export async function updateKounyuAssignment(
  assignmentId: number,
  updates: {
    assigned_at?: string;
    status?: string;
  }
): Promise<DataResult<KounyuAssignment>> {
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
      UPDATE kounyu_assignment
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
    const assignmentQuery = 'SELECT * FROM kounyu_assignment WHERE id = ?';
    const row = await db.get(assignmentQuery, [assignmentId]);

    if (!row) {
      return {
        success: false,
        error: '更新した割り当ての取得に失敗しました',
        data: null,
      };
    }

    const assignment: KounyuAssignment = {
      id: row.id,
      kounyu_id: row.kounyu_id,
      user_id: row.user_id,
      assigned_at: row.assigned_at,
      status: row.status
    };

    return {
      success: true,
      data: assignment,
      error: null,
    };
  } catch (error) {
    console.error('購入品担当割り当ての更新に失敗しました:', error);
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