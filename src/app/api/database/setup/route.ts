import { NextResponse } from 'next/server';
import { initializeDatabase } from '@src/lib/db/db_connection';
import type { Database } from 'sqlite';

export async function POST() {
  let db: Database | null = null;
  
  try {
    db = await initializeDatabase();
    
    // プロジェクト管理用テーブル作成SQL
    const setupSQL = `
-- プロジェクト管理アプリ用データベーススキーマ
-- achievements.db に追加する新規テーブル

-- ========================================
-- PROJECT_MEMBERS テーブル（プロジェクトメンバー管理）
-- ========================================
CREATE TABLE IF NOT EXISTS PROJECT_MEMBERS (
    member_id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('PM', '開発者', '設計者', 'テスター', '閲覧者')),
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    left_at DATETIME NULL,
    assigned_by TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES PROJECT(PROJECT_ID) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES USER(user_id) ON DELETE CASCADE,
    UNIQUE(project_id, user_id)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON PROJECT_MEMBERS(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON PROJECT_MEMBERS(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_role ON PROJECT_MEMBERS(role);

-- ========================================
-- PROJECT_HISTORY テーブル（プロジェクト変更履歴管理）
-- ========================================
CREATE TABLE IF NOT EXISTS PROJECT_HISTORY (
    history_id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id TEXT NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'MEMBER_ADD', 'MEMBER_REMOVE', 'MEMBER_ROLE_CHANGE')),
    field_name TEXT NULL,
    old_value TEXT NULL,
    new_value TEXT NULL,
    changed_by TEXT NOT NULL,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES PROJECT(PROJECT_ID) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES USER(user_id) ON DELETE SET NULL
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_project_history_project_id ON PROJECT_HISTORY(project_id);
CREATE INDEX IF NOT EXISTS idx_project_history_action_type ON PROJECT_HISTORY(action_type);
CREATE INDEX IF NOT EXISTS idx_project_history_changed_at ON PROJECT_HISTORY(changed_at);
CREATE INDEX IF NOT EXISTS idx_project_history_changed_by ON PROJECT_HISTORY(changed_by);

-- ========================================
-- ビュー作成（オプション）
-- ========================================

-- プロジェクトメンバー詳細ビュー
CREATE VIEW IF NOT EXISTS v_project_members_detail AS
SELECT 
    pm.member_id,
    pm.project_id,
    p.PROJECT_NAME,
    pm.user_id,
    u.name_japanese,
    u.name_english,
    u.company,
    pm.role,
    pm.joined_at,
    pm.left_at,
    pm.assigned_by,
    pm.created_at,
    pm.updated_at
FROM PROJECT_MEMBERS pm
JOIN PROJECT p ON pm.project_id = p.PROJECT_ID
JOIN USER u ON pm.user_id = u.user_id
WHERE pm.left_at IS NULL;

-- プロジェクト履歴詳細ビュー
CREATE VIEW IF NOT EXISTS v_project_history_detail AS
SELECT 
    ph.history_id,
    ph.project_id,
    p.PROJECT_NAME,
    ph.action_type,
    ph.field_name,
    ph.old_value,
    ph.new_value,
    ph.changed_by,
    u.name_japanese as changed_by_name,
    ph.changed_at
FROM PROJECT_HISTORY ph
JOIN PROJECT p ON ph.project_id = p.PROJECT_ID
LEFT JOIN USER u ON ph.changed_by = u.user_id
ORDER BY ph.changed_at DESC;
`;

    // SQLを実行
    await db.exec(setupSQL);
    
    // 作成されたテーブルの確認
    const tables = await db.all(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name IN ('PROJECT_MEMBERS', 'PROJECT_HISTORY')
    `);
    
    const views = await db.all(`
      SELECT name FROM sqlite_master 
      WHERE type='view' AND name IN ('v_project_members_detail', 'v_project_history_detail')
    `);

    return NextResponse.json({
      success: true,
      message: 'プロジェクト管理用データベーステーブルが正常に作成されました',
      createdTables: tables.map(t => t.name),
      createdViews: views.map(v => v.name),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('データベースセットアップエラー:', error);
    return NextResponse.json({
      success: false,
      error: 'データベースセットアップに失敗しました',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
    
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
