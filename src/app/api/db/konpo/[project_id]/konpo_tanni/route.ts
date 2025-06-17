import { NextResponse } from 'next/server';
import { GetConditionData } from '@src/lib/db/db_GetData';
import type { KonpoTanni } from '@src/types/db_konpo';

export async function GET(
  request: Request,
  { params }: { params: { project_id: string } }
) {
  try {
    // プロジェクトIDの取得
    const projectId = params.project_id;
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'プロジェクトIDが指定されていません' },
        { status: 400 }
      );
    }

    // 梱包単位リストの取得
    const result = await GetConditionData<KonpoTanni[]>(
      'PROJECT_ID = ?',
      [projectId],
      {
        tableName: 'KONPO_TANNI',
        idColumn: 'KONPO_TANNI_ID'
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      count: result.count
    });

  } catch (error) {
    console.error('梱包単位リストの取得に失敗しました:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
