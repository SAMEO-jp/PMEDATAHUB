import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * 図面JPEGファイルの表示
 * GET /api/zumen/[zumen_id]/image
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { zumen_id: string } }
) {
  try {
    const basePath = path.join(process.cwd(), 'data', 'zumen');
    const filePath = path.join(basePath, 'jpeg', `${params.zumen_id}.jpeg`);

    // ファイル存在チェック
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: '図面ファイルが見つかりません' },
        { status: 404 }
      );
    }

    // ファイル読み込み
    const fileBuffer = await fs.readFile(filePath);
    
    const headers = new Headers();
    headers.set('Content-Type', 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=3600'); // 1時間キャッシュ

    return new NextResponse(fileBuffer, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('図面画像処理エラー:', error);
    return NextResponse.json(
      { error: '画像の処理に失敗しました' },
      { status: 500 }
    );
  }
} 