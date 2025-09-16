import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // CSVファイルのパスを構築
    const filePath = join(process.cwd(), 'src/app/box/test1/file_technologies.csv');

    // ファイルを読み込む
    const fileContent = readFileSync(filePath, 'utf-8');

    // レスポンスヘッダーを設定
    const headers = new Headers();
    headers.set('Content-Type', 'text/csv; charset=utf-8');
    headers.set('Content-Disposition', 'attachment; filename="file_technologies.csv"');
    headers.set('Cache-Control', 'public, max-age=3600'); // 1時間キャッシュ

    // ファイルを返す
    return new NextResponse(fileContent, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('CSVファイルの読み込みエラー:', error);

    // エラーレスポンスを返す
    return new NextResponse('ファイルが見つかりません', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
