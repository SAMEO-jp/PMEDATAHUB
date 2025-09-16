import { initializeDatabase, DataResult } from '../connection/db_connection';
import type { Database } from 'sqlite';

// プロジェクトメンバーの型定義
export interface ProjectMember {
  member_id: number;
  project_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  left_at: string | null;
  created_at: string;
  updated_at: string;
  user: {
    user_id: string;
    name_japanese: string;
    TEL: string;
    bumon: string;
    sitsu: string;
    ka: string;
  };
}

// ユーザー情報の型定義
export interface User {
  user_id: string;
  name_japanese: string;
  TEL: string;
  bumon: string;
  sitsu: string;
  ka: string;
}

/**
 * プロジェクトの全メンバーを取得（在籍中のみ）
 * @param projectId プロジェクトID
 * @returns メンバー一覧
 */
export async function getProjectMembers(projectId: string): Promise<DataResult<ProjectMember[]>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const query = `
      SELECT
        pm.member_id,
        pm.project_id,
        pm.user_id,
        pm.role,
        pm.joined_at,
        pm.left_at,
        pm.created_at,
        pm.updated_at,
        u.user_id as user_user_id,
        u.name_japanese,
        u.TEL,
        u.bumon,
        u.sitsu,
        u.ka
      FROM PROJECT_MEMBERS pm
      LEFT JOIN USER u ON pm.user_id = u.user_id
      WHERE pm.project_id = ? AND pm.left_at IS NULL
      ORDER BY pm.joined_at DESC
    `;

    const rows = await db.all(query, [projectId]);

    const members: ProjectMember[] = rows.map((row: {
      member_id: number;
      project_id: string;
      user_id: string;
      role: string;
      joined_at: string;
      left_at: string | null;
      created_at: string;
      updated_at: string;
      user_user_id: string;
      name_japanese: string;
      TEL: string;
      bumon: string;
      sitsu: string;
      ka: string;
    }) => ({
      member_id: row.member_id,
      project_id: row.project_id,
      user_id: row.user_id,
      role: row.role,
      joined_at: row.joined_at,
      left_at: row.left_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      user: {
        user_id: row.user_user_id,
        name_japanese: row.name_japanese,
        TEL: row.TEL,
        bumon: row.bumon,
        sitsu: row.sitsu,
        ka: row.ka,
      }
    }));

    return {
      success: true,
      data: members,
      error: null,
    };
  } catch (error) {
    console.error('プロジェクトメンバーの取得に失敗しました:', error);
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

/**
 * プロジェクトにメンバーを追加
 * @param projectId プロジェクトID
 * @param userId ユーザーID
 * @param role 役割（デフォルト: '閲覧者'）
 * @returns 追加結果
 */
export async function addProjectMember(
  projectId: string,
  userId: string,
  role: string = 'member',
  joinedAt?: string
): Promise<DataResult<ProjectMember>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    // 既にメンバーでないかチェック
    const checkQuery = `
      SELECT member_id FROM PROJECT_MEMBERS
      WHERE project_id = ? AND user_id = ? AND left_at IS NULL
    `;
    const existing: unknown = await db.get(checkQuery, [projectId, userId]);

    if (existing && typeof existing === 'object' && 'member_id' in existing) {
      return {
        success: false,
        error: '既にこのプロジェクトのメンバーです',
        data: null,
      };
    }

    // メンバーを追加
    const insertQuery = `
      INSERT INTO PROJECT_MEMBERS (
        project_id, user_id, role, joined_at, left_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const now = new Date().toISOString();
    const joinDate = joinedAt || now;
    const result = await db.run(insertQuery, [
      projectId,
      userId,
      role,
      joinDate,
      null,
      now,
      now
    ]);

    // 追加したメンバーを取得
    const memberQuery = `
      SELECT
        pm.member_id,
        pm.project_id,
        pm.user_id,
        pm.role,
        pm.joined_at,
        pm.left_at,
        pm.created_at,
        pm.updated_at,
        u.user_id as user_user_id,
        u.name_japanese,
        u.TEL,
        u.bumon,
        u.sitsu,
        u.ka
      FROM PROJECT_MEMBERS pm
      LEFT JOIN USER u ON pm.user_id = u.user_id
      WHERE pm.member_id = ?
    `;

    const memberRow = await db.get(memberQuery, [result.lastID]) as {
      member_id: number;
      project_id: string;
      user_id: string;
      role: string;
      joined_at: string;
      left_at: string | null;
      created_at: string;
      updated_at: string;
      user_user_id: string;
      name_japanese: string;
      TEL: string;
      bumon: string;
      sitsu: string;
      ka: string;
    };

    const member: ProjectMember = {
      member_id: memberRow.member_id,
      project_id: memberRow.project_id,
      user_id: memberRow.user_id,
      role: memberRow.role,
      joined_at: memberRow.joined_at,
      left_at: memberRow.left_at,
      created_at: memberRow.created_at,
      updated_at: memberRow.updated_at,
      user: {
        user_id: memberRow.user_user_id,
        name_japanese: memberRow.name_japanese,
        TEL: memberRow.TEL,
        bumon: memberRow.bumon,
        sitsu: memberRow.sitsu,
        ka: memberRow.ka,
      }
    };

    return {
      success: true,
      data: member,
      error: null,
    };
  } catch (error) {
    console.error('プロジェクトメンバーの追加に失敗しました:', error);
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

/**
 * プロジェクトからメンバーを削除（退出）
 * @param projectId プロジェクトID
 * @param userId ユーザーID
 * @returns 削除結果
 */
export async function removeProjectMember(
  projectId: string,
  userId: string
): Promise<DataResult<null>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    // left_atを更新して退出扱いにする
    const updateQuery = `
      UPDATE PROJECT_MEMBERS
      SET left_at = ?, updated_at = ?
      WHERE project_id = ? AND user_id = ? AND left_at IS NULL
    `;

    const now = new Date().toISOString();
    const result = await db.run(updateQuery, [now, now, projectId, userId]);

    if (result.changes === 0) {
      return {
        success: false,
        error: '指定されたメンバーが見つからないか、既に退出しています',
        data: null,
      };
    }

    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (error) {
    console.error('プロジェクトメンバーの削除に失敗しました:', error);
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

/**
 * プロジェクトメンバーを更新
 * @param projectId プロジェクトID
 * @param userId ユーザーID
 * @param updates 更新データ
 * @returns 更新結果
 */
export async function updateProjectMember(
  projectId: string,
  userId: string,
  updates: {
    role?: string;
    joined_at?: string;
    left_at?: string;
    status?: string;
  }
): Promise<DataResult<ProjectMember>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    // 更新するフィールドを構築
    const updateFields: string[] = [];
    const values: any[] = [];

    if (updates.role !== undefined) {
      updateFields.push('role = ?');
      values.push(updates.role);
    }

    if (updates.joined_at !== undefined) {
      updateFields.push('joined_at = ?');
      values.push(updates.joined_at);
    }

    if (updates.left_at !== undefined) {
      updateFields.push('left_at = ?');
      values.push(updates.left_at);
    }

    // status は PROJECT_MEMBERS テーブルにないので無視

    if (updateFields.length === 0) {
      return {
        success: false,
        error: '更新するフィールドが指定されていません',
        data: null,
      };
    }

    // 更新クエリを実行
    const updateQuery = `
      UPDATE PROJECT_MEMBERS
      SET ${updateFields.join(', ')}, updated_at = ?
      WHERE project_id = ? AND user_id = ? AND left_at IS NULL
    `;

    values.push(new Date().toISOString(), projectId, userId);

    const result = await db.run(updateQuery, values);

    if (result.changes === 0) {
      return {
        success: false,
        error: '指定されたメンバーが見つからないか、既に退出しています',
        data: null,
      };
    }

    // 更新したメンバーを取得
    const memberQuery = `
      SELECT
        pm.member_id,
        pm.project_id,
        pm.user_id,
        pm.role,
        pm.joined_at,
        pm.left_at,
        pm.created_at,
        pm.updated_at,
        u.user_id as 'user.user_id',
        u.name_japanese as 'user.name_japanese',
        u.TEL as 'user.TEL',
        u.bumon as 'user.bumon',
        u.sitsu as 'user.sitsu',
        u.ka as 'user.ka'
      FROM PROJECT_MEMBERS pm
      JOIN USER u ON pm.user_id = u.user_id
      WHERE pm.project_id = ? AND pm.user_id = ? AND pm.left_at IS NULL
    `;

    const row = await db.get(memberQuery, [projectId, userId]);

    if (!row) {
      return {
        success: false,
        error: '更新したメンバーの取得に失敗しました',
        data: null,
      };
    }

    const member: ProjectMember = {
      member_id: row.member_id,
      project_id: row.project_id,
      user_id: row.user_id,
      role: row.role,
      joined_at: row.joined_at,
      left_at: row.left_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      user: {
        user_id: row['user.user_id'],
        name_japanese: row['user.name_japanese'],
        TEL: row['user.TEL'],
        bumon: row['user.bumon'],
        sitsu: row['user.sitsu'],
        ka: row['user.ka'],
      },
    };

    return {
      success: true,
      data: member,
      error: null,
    };
  } catch (error) {
    console.error('プロジェクトメンバーの更新に失敗しました:', error);
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

/**
 * 全ユーザーを取得（組織階層表示用）
 * @returns ユーザー一覧
 */
export async function getAllUsers(): Promise<DataResult<User[]>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const query = `
      SELECT user_id, name_japanese, TEL, bumon, sitsu, ka
      FROM USER
      ORDER BY bumon, sitsu, ka, user_id
    `;

    const rows = await db.all(query);

    const users: User[] = rows.map((row: {
      user_id: string;
      name_japanese: string;
      TEL: string;
      bumon: string;
      sitsu: string;
      ka: string;
    }) => ({
      user_id: row.user_id,
      name_japanese: row.name_japanese,
      TEL: row.TEL,
      bumon: row.bumon,
      sitsu: row.sitsu,
      ka: row.ka,
    }));

    return {
      success: true,
      data: users,
      error: null,
    };
  } catch (error) {
    console.error('ユーザー一覧の取得に失敗しました:', error);
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

/**
 * 部署情報を取得
 * @returns 部署一覧
 */
export async function getDepartments(): Promise<DataResult<Array<{
  id: number;
  name: string;
  department_kind: string;
  top_department: string | null;
  status: string;
}>>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const query = `
      SELECT id, name, department_kind, top_department, status
      FROM DEPARTMENT
      WHERE status = 'active'
      ORDER BY department_kind, name
    `;

    const rows = await db.all(query);

    return {
      success: true,
      data: rows,
      error: null,
    };
  } catch (error) {
    console.error('部署情報の取得に失敗しました:', error);
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
