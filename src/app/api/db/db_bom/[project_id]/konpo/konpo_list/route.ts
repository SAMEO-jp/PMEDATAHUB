import { NextResponse } from 'next/server';
import { GetAllData } from '@src/lib/db/crud/db_GetData';
import { KonpoList } from '@src/types/db_konpo';

export async function GET(
  request: Request,
  { params }: { params: { project_id: string } }
) {
  try {
    // Get project ID
    const projectId = params.project_id;

    // KONPO_LIST table configuration
    const tableConfig = {
      tableName: 'KONPO_LIST',
      idColumn: 'KONPO_LIST_ID'
    };

    // Get data
    const result = await GetAllData<KonpoList[]>(tableConfig);

    if (!result.success || !result.data) {
      return NextResponse.json(
        { error: result.error || '繝・・繧ｿ縺瑚ｦ九▽縺九ｊ縺ｾ縺帙ｓ縺ｧ縺励◆' },
        { status: 500 }
      );
    }

    // 繝励Ο繧ｸ繧ｧ繧ｯ繝・D縺ｧ繝輔ぅ繝ｫ繧ｿ繝ｪ繝ｳ繧ｰ
    const filteredData = result.data.filter(
      (item) => item.PROJECT_ID === projectId
    );

    return NextResponse.json({
      success: true,
      data: filteredData,
      count: filteredData.length
    });

  } catch (error) {
    console.error('KONPO_LIST縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆:', error);
    return NextResponse.json(
      { error: '繝・・繧ｿ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆' },
      { status: 500 }
    );
  }
}
