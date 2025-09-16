import { NextResponse } from 'next/server';
import { GetAllData } from '@src/lib/db/crud/db_GetData';
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

    // 繝励Ο繧ｸ繧ｧ繧ｯ繝・D縺ｧ繝輔ぅ繝ｫ繧ｿ繝ｪ繝ｳ繧ｰ
    const filteredData = result.data?.filter(
      item => item.PROJECT_ID === params.project_id
    );

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('譴ｱ蛹・Μ繧ｹ繝医・蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆:', error);
    return NextResponse.json(
      { error: '譴ｱ蛹・Μ繧ｹ繝医・蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆' },
      { status: 500 }
    );
  }
}
