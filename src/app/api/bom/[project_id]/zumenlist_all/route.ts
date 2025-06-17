import { NextRequest, NextResponse } from 'next/server';
import { GetConditionData } from '@src/lib/db/db_GetData';
import { BomZumen } from '@src/types/db_bom';

interface ZumenResponse {
  projectId: string;
  total: number;
  zumenList: BomZumen[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { project_id: string } }
) {
  try {
    console.log('図面一覧の取得を開始:', params.project_id);

    // プロジェクトIDの検証
    if (!params.project_id) {
      console.error('プロジェクトIDが指定されていません');
      return NextResponse.json(
        { error: 'プロジェクトIDが指定されていません' },
        { status: 400 }
      );
    }

    // 図面一覧の取得
    const result = await GetConditionData<BomZumen[]>(
      'PROJECT_ID = ?',
      [params.project_id],
      {
        tableName: 'BOM_ZUMEN',
        idColumn: 'ZUMEN_ID'
      }
    );

    if (!result.success) {
      console.error('図面一覧の取得に失敗:', result.error);
      return NextResponse.json(
        { error: result.error || '図面一覧の取得に失敗しました' },
        { status: 500 }
      );
    }

    // レスポンスの作成
    const response: ZumenResponse = {
      projectId: params.project_id,
      total: result.count || 0,
      zumenList: result.data || []
    };

    console.log('図面一覧の取得が完了:', response.total, '件');
    return NextResponse.json(response);
  } catch (error) {
    console.error('図面一覧の取得中にエラーが発生:', error);
    return NextResponse.json(
      { error: '図面一覧の取得に失敗しました' },
      { status: 500 }
    );
  }
}
