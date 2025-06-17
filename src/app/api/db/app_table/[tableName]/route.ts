import { NextResponse } from 'next/server';
import { initializeDatabase } from '@src/lib/db/db_connection';

export async function GET(
  request: Request,
  { params }: { params: { tableName: string } }
) {
  try {
    const db = await initializeDatabase();
    const tableName = params.tableName;

    // テーブルの存在確認
    const tableCheck = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name = ?",
      [tableName]
    );

    if (!tableCheck) {
      return NextResponse.json(
        { error: '指定されたテーブルが存在しません' },
        { status: 404 }
      );
    }

    // テーブルのカラム情報を取得
    const columns = await db.all(`PRAGMA table_info(${tableName})`);

    // テーブルのデータを取得
    const data = await db.all(`SELECT * FROM ${tableName}`);

    return NextResponse.json({
      success: true,
      data: {
        columns,
        rows: data
      }
    });
  } catch (error) {
    console.error('テーブルデータの取得に失敗しました:', error);
    return NextResponse.json(
      { error: 'データベースエラーが発生しました' },
      { status: 500 }
    );
  }
} 