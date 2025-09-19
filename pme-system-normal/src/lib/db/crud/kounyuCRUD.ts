/**
 * 購入品関連のCRUD操作関数
 */

import { initializeDatabase, DataResult } from '@src/lib/db/connection/db_connection';
import type { Database } from 'sqlite';
import type { KounyuMaster, KounyuAssignment, KounyuFormData } from '@src/types/kounyu';

/**
 * 購入品マスターを作成
 * @param kounyuData - 購入品データ
 * @returns 作成結果
 */
export async function createKounyuMaster(kounyuData: KounyuFormData): Promise<DataResult<KounyuMaster>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const query = `
      INSERT INTO kounyu_master (
        project_id, management_number, item_name, contract_number, item_category,
        setsubi_seiban, responsible_department, drawing_number, display_order, remarks,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;

    const result = await db.run(query, [
      kounyuData.project_id,
      kounyuData.management_number,
      kounyuData.item_name,
      kounyuData.contract_number || null,
      kounyuData.item_category,
      kounyuData.setsubi_seiban || null,
      kounyuData.responsible_department || null,
      kounyuData.drawing_number || null,
      kounyuData.display_order,
      kounyuData.remarks || null
    ]);

    if (result.lastID) {
      // 作成したデータを取得
      const selectQuery = 'SELECT * FROM kounyu_master WHERE id = ?';
      const newRecord = await db.get<KounyuMaster>(selectQuery, [result.lastID]);

      return {
        success: true,
        data: newRecord as KounyuMaster,
        error: null
      };
    } else {
      return {
        success: false,
        error: '購入品の作成に失敗しました',
        data: null
      };
    }
  } catch (error) {
    console.error('購入品作成に失敗しました:', error);
    console.error('エラー詳細:', {
      message: error instanceof Error ? error.message : '不明なエラー',
      stack: error instanceof Error ? error.stack : undefined,
      kounyuData
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : '購入品の作成に失敗しました',
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
 * 購入品マスターを更新
 * @param id - 購入品ID
 * @param kounyuData - 更新データ
 * @returns 更新結果
 */
export async function updateKounyuMaster(id: number, kounyuData: Partial<KounyuFormData>): Promise<DataResult<KounyuMaster>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const updateFields = [];
    const values = [];

    if (kounyuData.management_number !== undefined) {
      updateFields.push('management_number = ?');
      values.push(kounyuData.management_number);
    }
    if (kounyuData.item_name !== undefined) {
      updateFields.push('item_name = ?');
      values.push(kounyuData.item_name);
    }
    if (kounyuData.contract_number !== undefined) {
      updateFields.push('contract_number = ?');
      values.push(kounyuData.contract_number || null);
    }
    if (kounyuData.item_category !== undefined) {
      updateFields.push('item_category = ?');
      values.push(kounyuData.item_category);
    }
    if (kounyuData.setsubi_seiban !== undefined) {
      updateFields.push('setsubi_seiban = ?');
      values.push(kounyuData.setsubi_seiban || null);
    }
    if (kounyuData.responsible_department !== undefined) {
      updateFields.push('responsible_department = ?');
      values.push(kounyuData.responsible_department || null);
    }
    if (kounyuData.drawing_number !== undefined) {
      updateFields.push('drawing_number = ?');
      values.push(kounyuData.drawing_number || null);
    }
    if (kounyuData.display_order !== undefined) {
      updateFields.push('display_order = ?');
      values.push(kounyuData.display_order);
    }
    if (kounyuData.remarks !== undefined) {
      updateFields.push('remarks = ?');
      values.push(kounyuData.remarks || null);
    }

    if (updateFields.length === 0) {
      return {
        success: false,
        error: '更新するフィールドが指定されていません',
        data: null
      };
    }

    updateFields.push('updated_at = datetime(\'now\')');

    const query = `UPDATE kounyu_master SET ${updateFields.join(', ')} WHERE id = ?`;
    values.push(id);

    await db.run(query, values);

    // 更新したデータを取得
    const selectQuery = 'SELECT * FROM kounyu_master WHERE id = ?';
    const updatedRecord = await db.get<KounyuMaster>(selectQuery, [id]);

    return {
      success: true,
      data: updatedRecord as KounyuMaster,
      error: null
    };
  } catch (error) {
    console.error('購入品更新に失敗しました:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '購入品の更新に失敗しました',
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
 * 購入品マスターを削除
 * @param id - 購入品ID
 * @returns 削除結果
 */
export async function deleteKounyuMaster(id: number): Promise<DataResult<null>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    // 関連する担当割り当てを先に削除
    await db.run('DELETE FROM kounyu_assignment WHERE kounyu_id = ?', [id]);

    // 購入品マスターを削除
    await db.run('DELETE FROM kounyu_master WHERE id = ?', [id]);

    return {
      success: true,
      data: null,
      error: null
    };
  } catch (error) {
    console.error('購入品削除に失敗しました:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '購入品の削除に失敗しました',
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
 * 購入品担当を割り当て
 * @param assignmentData - 担当割り当てデータ
 * @returns 割り当て結果
 */
export async function assignKounyuToUser(assignmentData: {
  project_id: string;
  kounyu_id: number;
  user_id: string;
  status?: 'active' | 'inactive';
}): Promise<DataResult<KounyuAssignment>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    // 既に同じ担当が存在するか確認
    const existing = await db.get(
      'SELECT id FROM kounyu_assignment WHERE project_id = ? AND kounyu_id = ? AND user_id = ?',
      [assignmentData.project_id, assignmentData.kounyu_id, assignmentData.user_id]
    );

    if (existing) {
      // 既存の担当を更新
      const updateQuery = `
        UPDATE kounyu_assignment
        SET status = ?, assigned_at = datetime('now')
        WHERE id = ?
      `;
      await db.run(updateQuery, [assignmentData.status || 'active', existing.id]);

      const selectQuery = 'SELECT * FROM kounyu_assignment WHERE id = ?';
      const updatedRecord = await db.get<KounyuAssignment>(selectQuery, [existing.id]);

      return {
        success: true,
        data: updatedRecord as KounyuAssignment,
        error: null
      };
    } else {
      // 新規作成
      const insertQuery = `
        INSERT INTO kounyu_assignment (project_id, kounyu_id, user_id, status, assigned_at)
        VALUES (?, ?, ?, ?, datetime('now'))
      `;

      const result = await db.run(insertQuery, [
        assignmentData.project_id,
        assignmentData.kounyu_id,
        assignmentData.user_id,
        assignmentData.status || 'active'
      ]);

      if (result.lastID) {
        const selectQuery = 'SELECT * FROM kounyu_assignment WHERE id = ?';
        const newRecord = await db.get<KounyuAssignment>(selectQuery, [result.lastID]);

        return {
          success: true,
          data: newRecord as KounyuAssignment,
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
 * 購入品担当を解除
 * @param assignmentId - 担当割り当てID
 * @returns 解除結果
 */
export async function removeKounyuAssignment(assignmentId: number): Promise<DataResult<null>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    await db.run('DELETE FROM kounyu_assignment WHERE id = ?', [assignmentId]);

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
