/**
 * @file データベースセットアップAPI
 * 
 * プロジェクト管理システムに必要なデータベーステーブルとビューを作成するAPIエンドポイントです。
 * 
 * 作成されるテーブル:
 * - PROJECT_MEMBERS: プロジェクトメンバー管理テーブル
 * - PROJECT_HISTORY: プロジェクト履歴管理テーブル
 * 
 * 作成されるビュー:
 * - v_project_members_detail: プロジェクトメンバーの詳細情報ビュー
 * - v_project_history_detail: プロジェクト履歴の詳細情報ビュー
 * 
 * 使用方法:
 * POST /api/database/setup
 * 
 * @author PMEDATAHUB
 * @version 1.0.0
 */

import { NextResponse } from 'next/server';
import { initializeDatabase } from '@src/lib/db/connection/db_connection';
import type { Database } from 'sqlite';

export async function POST() {
  let db: Database | null = null;
  try {
    db = await initializeDatabase();

    const setupSQL = `
-- Project members table
CREATE TABLE IF NOT EXISTS PROJECT_MEMBERS (
  member_id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('PM','DEVELOPER','DESIGNER','TESTER','VIEWER')),
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  left_at DATETIME NULL,
  assigned_by TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES PROJECT(PROJECT_ID) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES USER(user_id) ON DELETE CASCADE,
  UNIQUE(project_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON PROJECT_MEMBERS(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON PROJECT_MEMBERS(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_role ON PROJECT_MEMBERS(role);

-- Project history table
CREATE TABLE IF NOT EXISTS PROJECT_HISTORY (
  history_id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('CREATE','UPDATE','DELETE','STATUS_CHANGE','MEMBER_ADD','MEMBER_REMOVE','MEMBER_ROLE_CHANGE')),
  field_name TEXT NULL,
  old_value TEXT NULL,
  new_value TEXT NULL,
  changed_by TEXT NOT NULL,
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES PROJECT(PROJECT_ID) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES USER(user_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_project_history_project_id ON PROJECT_HISTORY(project_id);
CREATE INDEX IF NOT EXISTS idx_project_history_action_type ON PROJECT_HISTORY(action_type);
CREATE INDEX IF NOT EXISTS idx_project_history_changed_at ON PROJECT_HISTORY(changed_at);
CREATE INDEX IF NOT EXISTS idx_project_history_changed_by ON PROJECT_HISTORY(changed_by);

-- Views
CREATE VIEW IF NOT EXISTS v_project_members_detail AS
SELECT 
  pm.member_id,
  pm.project_id,
  p.PROJECT_NAME,
  pm.user_id,
  u.name_japanese,
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
  ph.changed_at
FROM PROJECT_HISTORY ph
JOIN PROJECT p ON ph.project_id = p.PROJECT_ID
ORDER BY ph.changed_at DESC;
`;

    await db.exec(setupSQL);

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
      message: 'Database objects created successfully',
      createdTables: tables.map((t: any) => t.name),
      createdViews: views.map((v: any) => v.name),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json({
      success: false,
      error: 'Database setup failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  } finally {
    if (db) {
      try { await db.close(); } catch (e) { console.warn('DB close error:', e); }
    }
  }
}