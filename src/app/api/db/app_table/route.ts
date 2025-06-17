import { NextResponse } from 'next/server';
import { GetAllTables, DeleteTable } from '@src/lib/db/db_DeleteTable';

// GET: テーブル一覧を取得
export async function GET() {
  try {
    const result = await GetAllTables();
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('テーブル一覧の取得に失敗しました:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// DELETE: テーブルを削除
export async function DELETE(request: Request) {
  try {
    const { tableName } = await request.json();
    
    if (!tableName) {
      return NextResponse.json(
        { error: 'テーブル名が指定されていません' },
        { status: 400 }
      );
    }

    const result = await DeleteTable(tableName);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('テーブルの削除に失敗しました:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
