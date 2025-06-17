import { NextResponse } from 'next/server';
import { GetAllData } from '@src/lib/db/db_GetData';
import { KonpoList } from '@src/types/db_konpo';

export async function GET(
  request: Request,
  { params }: { params: { project_id: string } }
) {
  try {
    // プロジェクトIDを取得
    const projectId = params.project_id;

    // KONPO_LISTテーブルの設定
    const tableConfig = {
      tableName: 'KONPO_LIST',
      idColumn: 'KONPO_LIST_ID'
    };

    // データを取得
    const result = await GetAllData<KonpoList[]>(tableConfig);

    if (!result.success || !result.data) {
      return NextResponse.json(
        { error: result.error || 'データが見つかりませんでした' },
        { status: 500 }
      );
    }

    // プロジェクトIDでフィルタリング
    const filteredData = result.data.filter(
      (item) => item.PROJECT_ID === projectId
    );

    return NextResponse.json({
      success: true,
      data: filteredData,
      count: filteredData.length
    });

  } catch (error) {
    console.error('KONPO_LISTの取得に失敗しました:', error);
    return NextResponse.json(
      { error: 'データの取得に失敗しました' },
      { status: 500 }
    );
  }
}
