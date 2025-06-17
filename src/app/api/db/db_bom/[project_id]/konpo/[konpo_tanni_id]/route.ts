import { NextResponse } from 'next/server';
import { GetAllData } from '@src/lib/db/db_GetData';
import { KonpoList } from '@src/types/db_konpo';

export async function GET(
  request: Request,
  { params }: { params: { project_id: string } }
) {
  try {
    const result = await GetAllData<KonpoList[]>({
      tableName: 'KONPO_LIST'
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // プロジェクトIDでフィルタリング
    const filteredData = result.data?.filter(
      item => item.PROJECT_ID === params.project_id
    );

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('梱包リストの取得に失敗しました:', error);
    return NextResponse.json(
      { error: '梱包リストの取得に失敗しました' },
      { status: 500 }
    );
  }
}
