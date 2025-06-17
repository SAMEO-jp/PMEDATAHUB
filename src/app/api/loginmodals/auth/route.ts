import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーIDは必須です' },
        { status: 400 }
      );
    }

    const dbPath = path.join(process.cwd(), 'data', 'achievements.db');
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // ユーザーテーブルが存在しない場合は作成
    await db.exec(`
      CREATE TABLE IF NOT EXISTS "USER" (
        user_id TEXT PRIMARY KEY,
        name_japanese TEXT,
        TEL TEXT,
        mail TEXT,
        name_english TEXT,
        name_yomi TEXT,
        company TEXT,
        bumon TEXT,
        in_year TEXT,
        Kengen TEXT,
        TEL_naisen TEXT,
        sitsu TEXT,
        ka TEXT,
        syokui TEXT
      )
    `);

    const user = await db.get(
      'SELECT * FROM USER WHERE user_id = ?',
      [userId]
    );

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
