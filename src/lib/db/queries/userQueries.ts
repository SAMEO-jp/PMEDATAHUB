/**
 * ユーザー関連のクエリ関数群
 * ユーザーの詳細情報、参加プロジェクト、担当設備・購入品を取得
 */

import { initializeDatabase, DataResult } from '@src/lib/db/connection/db_connection';
import type { Database } from 'sqlite';
import type { User, UserWithProjects, UserProjectInfo, UserSetsubiAssignment, UserKounyuAssignment, UserTimelineItem } from '@src/types/user';

export interface CreateUserData {
  user_id: string;
  name_japanese: string;
  TEL?: string | null;
  mail?: string | null;
  bumon?: string | null;
  sitsu?: string | null;
  ka?: string | null;
  in_year?: string | null;
  Kengen?: string | null;
}

export interface UpdateUserData {
  user_id: string;
  name_japanese: string;
  TEL?: string | null;
  mail?: string | null;
  bumon?: string | null;
  sitsu?: string | null;
  ka?: string | null;
  in_year?: string | null;
  Kengen?: string | null;
}

/**
 * 全ユーザーの一覧を取得
 * @returns ユーザー一覧
 */
export async function getAllUsers(): Promise<DataResult<User[]>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const query = `
      SELECT * FROM USER ORDER BY name_japanese ASC
    `;

    const rows = await db.all(query);

    const users: User[] = rows.map((row: any) => ({
      user_id: row.user_id,
      name_japanese: row.name_japanese,
      TEL: row.TEL,
      mail: row.mail,
      bumon: row.bumon,
      sitsu: row.sitsu,
      ka: row.ka,
      in_year: row.in_year,
      Kengen: row.Kengen
    }));

    return {
      success: true,
      data: users,
      error: null
    };
  } catch (error) {
    console.error('ユーザー一覧取得に失敗しました:', error);
    return {
      success: false,
      error: 'ユーザー一覧の取得に失敗しました',
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
 * 新しいユーザーを作成
 * @param userData - 作成するユーザーデータ
 * @returns 作成されたユーザー情報
 */
export async function createUser(userData: CreateUserData): Promise<DataResult<User>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    // 同じユーザーIDが既に存在するかチェック
    const existingQuery = 'SELECT user_id FROM USER WHERE user_id = ?';
    const existingUser = await db.get(existingQuery, [userData.user_id]);

    if (existingUser) {
      return {
        success: false,
        error: '指定された社員番号は既に使用されています',
        data: null
      };
    }

    // ユーザー作成
    const insertQuery = `
      INSERT INTO USER (
        user_id, name_japanese, TEL, mail, bumon, sitsu, ka, in_year, Kengen
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.run(insertQuery, [
      userData.user_id,
      userData.name_japanese,
      userData.TEL || null,
      userData.mail || null,
      userData.bumon || null,
      userData.sitsu || null,
      userData.ka || null,
      userData.in_year || null,
      userData.Kengen || null
    ]);

    // 作成したユーザー情報を返す
    const createdUser: User = {
      user_id: userData.user_id,
      name_japanese: userData.name_japanese,
      TEL: userData.TEL || null,
      mail: userData.mail || null,
      bumon: userData.bumon || null,
      sitsu: userData.sitsu || null,
      ka: userData.ka || null,
      in_year: userData.in_year || null,
      Kengen: userData.Kengen || null
    };

    return {
      success: true,
      data: createdUser,
      error: null
    };
  } catch (error) {
    console.error('ユーザー作成に失敗しました:', error);
    return {
      success: false,
      error: 'ユーザーの作成に失敗しました',
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
 * ユーザーを更新
 * @param userId - 更新するユーザーのID
 * @param userData - 更新するユーザーデータ
 * @returns 更新されたユーザー情報
 */
export async function updateUser(userId: string, userData: UpdateUserData): Promise<DataResult<User>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    // ユーザーが存在するかチェック
    const existingQuery = 'SELECT user_id FROM USER WHERE user_id = ?';
    const existingUser = await db.get(existingQuery, [userId]);

    if (!existingUser) {
      return {
        success: false,
        error: '指定されたユーザーが見つかりません',
        data: null
      };
    }

    // 社員番号が変更された場合、他のユーザーと重複していないかチェック
    if (userData.user_id !== userId) {
      const duplicateQuery = 'SELECT user_id FROM USER WHERE user_id = ?';
      const duplicateUser = await db.get(duplicateQuery, [userData.user_id]);

      if (duplicateUser) {
        return {
          success: false,
          error: '指定された社員番号は既に使用されています',
          data: null
        };
      }
    }

    // ユーザー更新
    const updateQuery = `
      UPDATE USER SET
        user_id = ?,
        name_japanese = ?,
        TEL = ?,
        mail = ?,
        bumon = ?,
        sitsu = ?,
        ka = ?,
        in_year = ?,
        Kengen = ?
      WHERE user_id = ?
    `;

    await db.run(updateQuery, [
      userData.user_id,
      userData.name_japanese,
      userData.TEL || null,
      userData.mail || null,
      userData.bumon || null,
      userData.sitsu || null,
      userData.ka || null,
      userData.in_year || null,
      userData.Kengen || null,
      userId
    ]);

    // 更新したユーザー情報を返す
    const updatedUser: User = {
      user_id: userData.user_id,
      name_japanese: userData.name_japanese,
      TEL: userData.TEL || null,
      mail: userData.mail || null,
      bumon: userData.bumon || null,
      sitsu: userData.sitsu || null,
      ka: userData.ka || null,
      in_year: userData.in_year || null,
      Kengen: userData.Kengen || null
    };

    return {
      success: true,
      data: updatedUser,
      error: null
    };
  } catch (error) {
    console.error('ユーザー更新に失敗しました:', error);
    return {
      success: false,
      error: 'ユーザーの更新に失敗しました',
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
 * ユーザーの詳細情報を取得（参加プロジェクト、担当設備・購入品含む）
 * @param userId - ユーザーID
 * @returns ユーザーの詳細情報
 */
export async function getUserDetail(userId: string): Promise<DataResult<UserWithProjects>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    // 基本ユーザー情報取得
    const userQuery = 'SELECT * FROM USER WHERE user_id = ?';
    const userRow = await db.get(userQuery, [userId]);

    if (!userRow) {
      return {
        success: false,
        error: '指定されたユーザーが見つかりません',
        data: null
      };
    }

    const user: User = {
      user_id: userRow.user_id,
      name_japanese: userRow.name_japanese,
      TEL: userRow.TEL,
      mail: userRow.mail,
      bumon: userRow.bumon,
      sitsu: userRow.sitsu,
      ka: userRow.ka,
      in_year: userRow.in_year,
      Kengen: userRow.Kengen
    };

    // 参加プロジェクト取得
    const projectsQuery = `
      SELECT
        pm.project_id,
        p.PROJECT_NAME as project_name,
        pm.role,
        pm.joined_at,
        p.PROJECT_STATUS as status,
        p.IS_PROJECT
      FROM PROJECT_MEMBERS pm
      JOIN PROJECT p ON pm.project_id = p.PROJECT_ID
      WHERE pm.user_id = ? AND pm.left_at IS NULL
      ORDER BY pm.joined_at DESC
    `;

    const projectRows = await db.all(projectsQuery, [userId]);
    const projects: UserProjectInfo[] = projectRows.map((row: any) => ({
      project_id: row.project_id,
      project_name: row.project_name,
      role: row.role,
      joined_at: row.joined_at,
      status: row.status,
      IS_PROJECT: row.IS_PROJECT
    }));

    // 担当設備取得
    const setsubiQuery = `
      SELECT
        sa.id,
        sa.project_id,
        sa.setsubi_id,
        sm.seiban,
        sm.setsubi_name,
        sa.assigned_at,
        sa.status
      FROM setsubi_assignment sa
      JOIN setsubi_master sm ON sa.setsubi_id = sm.id
      WHERE sa.user_id = ? AND sa.status = 'active'
      ORDER BY sa.assigned_at DESC
    `;

    const setsubiRows = await db.all(setsubiQuery, [userId]);
    const setsubi_assignments: UserSetsubiAssignment[] = setsubiRows.map((row: any) => ({
      id: row.id,
      project_id: row.project_id,
      setsubi_id: row.setsubi_id,
      seiban: row.seiban,
      setsubi_name: row.setsubi_name,
      assigned_at: row.assigned_at,
      status: row.status
    }));

    // 担当購入品取得
    const kounyuQuery = `
      SELECT
        ka.id,
        ka.project_id,
        ka.kounyu_id,
        km.management_number,
        km.item_name,
        ka.assigned_at,
        ka.status
      FROM kounyu_assignment ka
      JOIN kounyu_master km ON ka.kounyu_id = km.id
      WHERE ka.user_id = ? AND ka.status = 'active'
      ORDER BY ka.assigned_at DESC
    `;

    const kounyuRows = await db.all(kounyuQuery, [userId]);
    const kounyu_assignments: UserKounyuAssignment[] = kounyuRows.map((row: any) => ({
      id: row.id,
      project_id: row.project_id,
      kounyu_id: row.kounyu_id,
      management_number: row.management_number,
      item_name: row.item_name,
      assigned_at: row.assigned_at,
      status: row.status
    }));

    const result: UserWithProjects = {
      ...user,
      projects,
      setsubi_assignments,
      kounyu_assignments
    };

    return {
      success: true,
      data: result,
      error: null
    };
  } catch (error) {
    console.error('ユーザー詳細取得に失敗しました:', error);
    return {
      success: false,
      error: 'ユーザー詳細の取得に失敗しました',
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
 * ユーザーのタイムラインを取得（モックデータ）
 * @param userId - ユーザーID
 * @returns ユーザーのタイムライン
 */
export async function getUserTimeline(userId: string): Promise<DataResult<UserTimelineItem[]>> {
  // モックデータとしてタイムラインを作成
  const mockTimeline: UserTimelineItem[] = [
    {
      id: '1',
      type: 'project_join',
      title: 'プロジェクト参加',
      description: 'プロジェクト「E923BXX215000」に参加しました',
      date: '2024-01-15',
      project_id: 'E923BXX215000',
      project_name: 'テストプロジェクト'
    },
    {
      id: '2',
      type: 'setsubi_assign',
      title: '設備担当割り当て',
      description: '設備「制御用モーター」の担当者に割り当てられました',
      date: '2024-02-01',
      item_id: 1,
      item_name: '制御用モーター'
    },
    {
      id: '3',
      type: 'kounyu_assign',
      title: '購入品担当割り当て',
      description: '購入品「センサーアレイ」の担当者に割り当てられました',
      date: '2024-02-15',
      item_id: 2,
      item_name: 'センサーアレイ'
    },
    {
      id: '4',
      type: 'project_join',
      title: 'プロジェクト参加',
      description: 'プロジェクト「E923BXX215001」に参加しました',
      date: '2024-03-01',
      project_id: 'E923BXX215001',
      project_name: '新プロジェクト'
    }
  ];

  return {
    success: true,
    data: mockTimeline,
    error: null
  };
}

/**
 * 名前によるユーザー検索
 * @param name - 検索する名前（部分一致）
 * @returns 検索結果のユーザー一覧
 */
export async function searchUsersByName(name: string): Promise<DataResult<User[]>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const query = `
      SELECT * FROM USER
      WHERE name_japanese LIKE ?
      ORDER BY name_japanese ASC
    `;

    const rows = await db.all(query, [`%${name}%`]);

    const users: User[] = rows.map((row: any) => ({
      user_id: row.user_id,
      name_japanese: row.name_japanese,
      TEL: row.TEL,
      mail: row.mail,
      bumon: row.bumon,
      sitsu: row.sitsu,
      ka: row.ka,
      in_year: row.in_year,
      Kengen: row.Kengen
    }));

    return {
      success: true,
      data: users,
      error: null
    };
  } catch (error) {
    console.error('ユーザー検索に失敗しました:', error);
    return {
      success: false,
      error: 'ユーザー検索に失敗しました',
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
 * UserIDによるユーザー取得
 * @param userId - ユーザーID
 * @returns ユーザーデータ（配列）
 */
export async function getUserById(userId: string): Promise<DataResult<User[]>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const query = `
      SELECT * FROM USER WHERE user_id = ?
    `;

    const rows = await db.all(query, [userId]);

    if (rows.length === 0) {
      return {
        success: false,
        error: '指定されたユーザーが見つかりません',
        data: null
      };
    }

    const users: User[] = rows.map((row: any) => ({
      user_id: row.user_id,
      name_japanese: row.name_japanese,
      TEL: row.TEL,
      mail: row.mail,
      bumon: row.bumon,
      sitsu: row.sitsu,
      ka: row.ka,
      in_year: row.in_year,
      Kengen: row.Kengen
    }));

    return {
      success: true,
      data: users,
      error: null
    };
  } catch (error) {
    console.error('ユーザー取得に失敗しました:', error);
    return {
      success: false,
      error: 'ユーザー取得に失敗しました',
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
 * ユーザーの存在確認
 * @param userId - ユーザーID
 * @returns ユーザー存在確認結果
 */
export async function validateUser(userId: string): Promise<DataResult<boolean>> {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const query = `
      SELECT COUNT(*) as count FROM USER WHERE user_id = ?
    `;

    const row = await db.get(query, [userId]);

    const exists = row.count > 0;

    return {
      success: true,
      data: exists,
      error: null
    };
  } catch (error) {
    console.error('ユーザー検証に失敗しました:', error);
    return {
      success: false,
      error: 'ユーザー検証に失敗しました',
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