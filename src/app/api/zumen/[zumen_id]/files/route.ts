import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * 図面ファイルの存在チェック
 * GET /api/zumen/[zumen_id]/files
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { zumen_id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const fileType = searchParams.get('type'); // 'jpeg', 'pdf', 'cad'
    const action = searchParams.get('action'); // 'check', 'download'

    console.log('ファイルチェックリクエスト:', { zumenId: params.zumen_id, fileType, action }); // デバッグ用

    if (!fileType || !action) {
      return NextResponse.json(
        { error: 'type と action パラメータが必要です' },
        { status: 400 }
      );
    }

    const basePath = path.join(process.cwd(), 'data', 'zumen');
    let filePath: string;
    let fileName: string;

    // ファイルタイプに応じてパスを設定
    switch (fileType) {
      case 'jpeg': {
        filePath = path.join(basePath, 'jpeg', `${params.zumen_id}.jpeg`);
        fileName = `${params.zumen_id}.jpeg`;
        break;
      }
      case 'pdf': {
        filePath = path.join(basePath, 'pdf', `${params.zumen_id}.pdf`);
        fileName = `${params.zumen_id}.pdf`;
        break;
      }
      case 'cad': {
        // CADファイルは複数のファイルが存在する可能性があるため、ディレクトリ内を検索
        const cadDir = path.join(basePath, 'cad');
        try {
          const files = await fs.readdir(cadDir);
          const cadFile = files.find(file => file.includes(params.zumen_id));
          if (cadFile) {
            filePath = path.join(cadDir, cadFile);
            fileName = cadFile;
          } else {
            console.log('CADファイルが見つかりません:', params.zumen_id); // デバッグ用
            return NextResponse.json(
              { exists: false, message: '準備中' },
              { status: 404 }
            );
          }
        } catch {
          console.log('CADディレクトリアクセスエラー:', params.zumen_id); // デバッグ用
          return NextResponse.json(
            { exists: false, message: '準備中' },
            { status: 404 }
          );
        }
        break;
      }
      default:
        return NextResponse.json(
          { error: '無効なファイルタイプです' },
          { status: 400 }
        );
    }

    console.log('ファイルパス:', filePath); // デバッグ用

    // ファイル存在チェック
    try {
      await fs.access(filePath);
      console.log('ファイル存在確認成功:', filePath); // デバッグ用
    } catch {
      console.log('ファイルが存在しません:', filePath); // デバッグ用
      return NextResponse.json(
        { exists: false, message: '準備中' },
        { status: 404 }
      );
    }

    if (action === 'check') {
      console.log('ファイル存在チェック成功:', fileName); // デバッグ用
      return NextResponse.json({ exists: true, fileName });
    } else if (action === 'download') {
      // ファイルダウンロード
      const fileBuffer = await fs.readFile(filePath);
      
      const headers = new Headers();
      headers.set('Content-Type', getContentType(fileType));
      headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
      headers.set('Content-Length', fileBuffer.length.toString());

      return new NextResponse(fileBuffer, {
        status: 200,
        headers
      });
    } else {
      return NextResponse.json(
        { error: '無効なアクションです' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('図面ファイル処理エラー:', error);
    return NextResponse.json(
      { error: 'ファイルの処理に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * ファイルタイプに応じたContent-Typeを取得
 */
function getContentType(fileType: string): string {
  switch (fileType) {
    case 'jpeg':
      return 'image/jpeg';
    case 'pdf':
      return 'application/pdf';
    case 'cad':
      return 'application/octet-stream';
    default:
      return 'application/octet-stream';
  }
} 